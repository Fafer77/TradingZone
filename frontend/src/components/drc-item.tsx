import { Link, useNavigate } from "react-router-dom";
import api from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// --- Typy i dane (bez zmian) ---
type PerformanceSegment = {
  segment_name: string;
  grade: string;
  playbook_trades_only: string;
  sizing: string;
  immediately_in_favour: string;
  comments: string;
};

type DRCFromAPI = {
  id: string;
  date: string;
  grade: string;
  pnl: number;
  goal: string;
  reminders: string[];
  improvements: string[];
  mistakes_with_solutions: string[];
  performance_table: PerformanceSegment[];
};

const gradeColorMap: Record<string, string> = {
    'A+': 'text-green-400', 'A': 'text-green-500', 'A-': 'text-green-600',
    'B+': 'text-yellow-400', 'B': 'text-yellow-500', 'B-': 'text-yellow-600',
    'C+': 'text-orange-400', 'C': 'text-orange-500', 'C-': 'text-orange-600',
    'D': 'text-red-500', 'F': 'text-red-600', 'N/A': 'text-zinc-500'
};

export function DRCItem({ drc }: { drc: DRCFromAPI }) {
  const navigate = useNavigate();
  const pnlColor = drc.pnl >= 0 ? "text-green-500" : "text-red-500";
  const gradeColor = gradeColorMap[drc.grade] || "text-gray-400";
  
  // ✅ ZMIANA 2: Funkcja do obsługi usuwania
  const handleDelete = async () => {
    try {
      await api.delete(`/api/drcs/${drc.id}/`);
      toast.success("Report Card deleted successfully!");
      navigate("/drc"); // Przekieruj na listę po usunięciu
    } catch (error) {
      toast.error("Failed to delete the report.");
      console.error("Deletion error:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Report for {drc.date}</h1>
          <p className="text-muted-foreground">Daily goal: {drc.goal || "Not set"}</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link to={`/drc/edit/${drc.id}`}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </Link>
            </Button>

            {/* ✅ ZMIANA 2: Implementacja AlertDialog dla przycisku "Delete" */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the report for {drc.date}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader><CardTitle>Overall Grade</CardTitle></CardHeader>
            {/* ✅ ZMIANA 1: Zmniejszono rozmiar czcionki */}
            <CardContent><p className={cn("text-5xl font-bold", gradeColor)}>{drc.grade}</p></CardContent>
        </Card>
        <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader><CardTitle>Daily PNL</CardTitle></CardHeader>
            {/* ✅ ZMIANA 1: Zmniejszono rozmiar czcionki */}
            <CardContent><p className={cn("text-5xl font-bold", pnlColor)}>${drc.pnl.toFixed(2)}</p></CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader><CardTitle>Performance Breakdown</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>PB Only</TableHead>
                <TableHead>Sizing</TableHead>
                <TableHead>In Favour</TableHead>
                <TableHead>Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drc.performance_table.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.segment_name}</TableCell>
                  <TableCell>{row.grade}</TableCell>
                  <TableCell>{row.playbook_trades_only}</TableCell>
                  <TableCell>{row.sizing}</TableCell>
                  <TableCell>{row.immediately_in_favour}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-pre-wrap">
                    {row.comments}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {drc.improvements.length > 0 && <InfoCard title="Improvements" items={drc.improvements} />}
        {drc.mistakes_with_solutions.length > 0 && <InfoCard title="Mistakes & Solutions" items={drc.mistakes_with_solutions} />}
        {drc.reminders.length > 0 && <InfoCard title="Reminders" items={drc.reminders} />}
      </div>
    </div>
  );
}

// Komponent pomocniczy do wyświetlania list
function InfoCard({ title, items }: { title: string; items: string[] }) {
    return (
        <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2">
                    {items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </CardContent>
        </Card>
    );
}