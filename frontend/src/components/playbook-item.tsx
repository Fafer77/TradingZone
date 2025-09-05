"use client"

import * as React from "react"
import {
  LogIn, LogOut, ShieldX, Sparkles, Wallet, Pencil, Trash2, Check, X, ArrowRight, Ban,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const playbookData = {
  title: "Trend Continuation Play",
  description: "A strategy based on the premise that moves aligned with the trend are stronger and faster than corrections, increasing the probability of profit and allowing for better risk-to-reward ratios.",
  category: "Day Trading",
  sections: [
    { title: "Entry Criteria", icon: LogIn, content: ["Price in 4h supply/demand zone.", "1h & 1D HTS aligns.", "Price action confirmation on ≥ 5-min TF."] },
    { title: "Exit Strategy (Take Profit)", icon: LogOut, content: ["Target minimum 1:3.5 R:R.", "Exit on price capitulation."] },
    { title: "Stop Loss Placement", icon: ShieldX, content: ["Placed above/below recent local high/low.", "Based on entry TF structure."] },
    { title: "Confluence / Enhancers", icon: Sparkles, content: ["Building m5/m15 structure in the trade direction.", "Liquidity grab followed by a close back inside the zone."] },
    { title: "Trade Management", icon: Wallet, content: ["TP1: 20% off at 2R.", "Move SL to Breakeven after 1.5R."] },
  ],
}

const checklistItems = [
    { id: "hts-align", label: "Does Higher Timeframe Structure align?" },
    { id: "zone-confirm", label: "Is price reacting to a valid zone?" },
    { id: "pa-confirm", label: "Is there price action confirmation?" },
    { id: "rr-valid", label: "Is the Risk-to-Reward ratio valid (≥ 1:3.5)?" },
    { id: "news-check", label: "Are there any high-impact news events soon?" },
    { id: "emotion-check", label: "Am I emotionally neutral?" },
]

type ChecklistState = Record<string, "yes" | "no" | null>;

function ChecklistItem({ item, selection, onSelectionChange }: { item: { id: string, label: string }, selection: "yes" | "no" | null, onSelectionChange: (id: string, value: "yes" | "no") => void }) {
  return (
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium pr-4">{item.label}</label>
      <div className="flex gap-2 shrink-0">
        <Button
          variant={selection === "yes" ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectionChange(item.id, "yes")}
          className={cn("w-20", selection === "yes" && "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white")}
        >
          <Check className="mr-2 h-4 w-4" /> Yes
        </Button>
        <Button
          variant={selection === "no" ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectionChange(item.id, "no")}
          className={cn("w-20", selection === "no" && "bg-rose-600 hover:bg-rose-700 border-rose-600 text-white")}
        >
          <X className="mr-2 h-4 w-4" /> No
        </Button>
      </div>
    </div>
  );
}

export function PlaybookItem() {
  const [checklistState, setChecklistState] = React.useState<ChecklistState>(() =>
    checklistItems.reduce((acc, item) => ({ ...acc, [item.id]: null }), {})
  );

  const handleChecklistChange = (id: string, value: "yes" | "no") => {
    setChecklistState(prevState => ({ ...prevState, [id]: value }));
  };

  const allYes = React.useMemo(() => {
    return checklistItems.every(item => checklistState[item.id] === "yes");
  }, [checklistState]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] w-full max-w-7xl gap-8">

      {/* Lewa Karta: Opis Strategii */}
      <Card className="w-full bg-zinc-950 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{playbookData.title}</CardTitle>
            <Badge className="border-transparent bg-purple-950 text-purple-400 border border-purple-800 hover:bg-purple-900/80">
              {playbookData.category}
            </Badge>
          </div>
          {/* ✅ ZMIANA 3: Dodano `break-words` dla bezpieczeństwa */}
          <CardDescription className="break-words">{playbookData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="item-0">
            {playbookData.sections.map((section, index) => (
              <AccordionItem value={`item-${index}`} key={section.title}>
                <AccordionTrigger className="text-lg hover:no-underline">
                  <div className="flex items-center gap-3">{section.icon && <section.icon className="h-5 w-5" />} {section.title}</div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2 pl-2">
                    {/* ✅ ZMIANA 3: Dodano `break-words` dla bezpieczeństwa */}
                    {section.content.map((point) => <li key={point} className="break-words">{point}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm"><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
          <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
        </CardFooter>
      </Card>

      {/* Prawa Karta: Checklista */}
      <Card className="w-full bg-zinc-950 border-zinc-800 flex flex-col">
        <CardHeader>
          <CardTitle>Pre-Trade Checklist</CardTitle>
          <CardDescription>Confirm all conditions are met before entering.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            {checklistItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <ChecklistItem 
                  item={item} 
                  selection={checklistState[item.id]} 
                  onSelectionChange={handleChecklistChange} 
                />
                {index < checklistItems.length - 1 && <Separator className="bg-zinc-800 my-4" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          {allYes ? (
            // ✅ ZMIANA 1: Fioletowy przycisk
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Execute Trade <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button className="w-full" variant="destructive" disabled>
              <Ban className="mr-2 h-4 w-4" /> Conditions Not Met
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}