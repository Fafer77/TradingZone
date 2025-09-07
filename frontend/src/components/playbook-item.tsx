import * as React from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api"
import { LogIn, LogOut, ShieldX, Sparkles, Wallet, Pencil, Trash2, Check, X, ArrowRight, Ban } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Link } from "react-router-dom"

type PlaybookFromAPI = {
  id: string;
  title: string;
  overview: string;
  trade_type: "day_trading" | "scalping" | "swing_trading";
  entry_criteria: string[];
  exit_strategy: string[];
  stop_loss_rules: string[];
  enhancers: string[];
  trade_management: string[];
  checklist: string[];
};

type ChecklistState = Record<string, "yes" | "no" | null>;

function ChecklistItem({ item, selection, onSelectionChange }: { item: { id: string, label: string }, selection: "yes" | "no" | null, onSelectionChange: (id: string, value: "yes" | "no" | null) => void }) {
  const handleSelection = (value: "yes" | "no") => {
    onSelectionChange(item.id, selection === value ? null : value);
  };

  return (
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium pr-4">{item.label}</label>
      <div className="flex gap-2 shrink-0">
        <Button
          variant={selection === "yes" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSelection("yes")}
          className={cn("w-20", selection === "yes" && "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white")}
        >
          <Check className="mr-2 h-4 w-4" /> Yes
        </Button>
        <Button
          variant={selection === "no" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSelection("no")}
          className={cn("w-20", selection === "no" && "bg-rose-600 hover:bg-rose-700 border-rose-600 text-white")}
        >
          <X className="mr-2 h-4 w-4" /> No
        </Button>
      </div>
    </div>
  );
}

export function PlaybookItem({ playbook }: { playbook: PlaybookFromAPI }) {
  const navigate = useNavigate();

  const checklistItems = React.useMemo(() => 
    playbook.checklist.map((label, index) => ({ id: `chk-${index}`, label })), 
    [playbook.checklist]
  );
  
  const [checklistState, setChecklistState] = React.useState<ChecklistState>(() =>
    checklistItems.reduce((acc, item) => ({ ...acc, [item.id]: null }), {})
  );

  const handleChecklistChange = (id: string, value: "yes" | "no" | null) => {
    setChecklistState(prevState => ({ ...prevState, [id]: value }));
  };

  const allYes = React.useMemo(() => {
    if (checklistItems.length === 0) return false;
    return checklistItems.every(item => checklistState[item.id] === "yes");
  }, [checklistState, checklistItems]);
  
  const categoryDetails = {
    day_trading: { title: "Day Trading" },
    scalping: { title: "Scalping" },
    swing_trading: { title: "Swing Trading" },
  };
  
  const sections = [
    { title: "Entry Criteria", icon: LogIn, content: playbook.entry_criteria },
    { title: "Exit Strategy", icon: LogOut, content: playbook.exit_strategy },
    { title: "Stop Loss Placement", icon: ShieldX, content: playbook.stop_loss_rules },
    { title: "Confluence / Enhancers", icon: Sparkles, content: playbook.enhancers },
    { title: "Trade Management", icon: Wallet, content: playbook.trade_management },
  ];

  const handleDelete = async () => {
    try {
      await api.delete(`/api/playbooks/${playbook.id}/`);
      toast.success("Playbook deleted successfully!");
      navigate("/playbook");
    } catch (error) {
      toast.error("Failed to delete playbook!");
      console.error("Error when deleting playbook: ", error);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] w-full max-w-7xl gap-8 lg:items-start">
      <Card className="w-full bg-zinc-950 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{playbook.title}</CardTitle>
            <Badge className="border-transparent bg-purple-950 text-purple-400 border border-purple-800 hover:bg-purple-900/80">
              {categoryDetails[playbook.trade_type]?.title || "Strategy"}
            </Badge>
          </div>
          <CardDescription className="break-words">{playbook.overview}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue={sections[0]?.title}>
            {sections.map((section) => {
              const Icon = section.icon; 
              return (
                section.content && section.content.length > 0 && (
                  <AccordionItem value={section.title} key={section.title}>
                    <AccordionTrigger className="text-lg hover:no-underline">
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="h-5 w-5" />}
                        {section.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-2 pl-2">
                        {section.content.map((point) => <li key={point} className="break-words">{point}</li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )
              )
            })}
          </Accordion>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/playbook/edit/${playbook.id}`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  playbook "{playbook.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
      
      <Card className="w-full bg-zinc-950 border-zinc-800 flex flex-col">
        <CardHeader>
          <CardTitle>Pre-Trade Checklist</CardTitle>
          <CardDescription>Confirm all conditions are met before entering.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            {checklistItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <ChecklistItem item={item} selection={checklistState[item.id]} onSelectionChange={handleChecklistChange} />
                {index < checklistItems.length - 1 && <Separator className="bg-zinc-800 my-4" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
        <CardFooter>
            {allYes ?
              (<Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Execute Trade <ArrowRight className="ml-2 h-4 w-4" /></Button>) : 
              (<Button className="w-full" variant="destructive" disabled><Ban className="mr-2 h-4 w-4" /> Conditions Not Met</Button>)
            }
        </CardFooter>
      </Card>
    </div>
  )
}