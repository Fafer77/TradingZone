import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type TradeSampleFromAPI } from "@/types";
import api from "@/api";
import { toast } from "sonner";
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

const gradeColorMap: Record<string, string> = {
    'A+': 'text-green-400', 'A': 'text-green-500', 'A-': 'text-green-600',
    'B+': 'text-yellow-400', 'B': 'text-yellow-500', 'B-': 'text-yellow-600',
    'C+': 'text-orange-400', 'C': 'text-orange-500', 'C-': 'text-orange-600',
    'D': 'text-red-500', 'F': 'text-red-600',
    'N/A': 'text-zinc-500',
};

export function TradeSampleItem({ sample }: { sample: TradeSampleFromAPI }) {
  const pnlValue = parseFloat(sample.pnl);
  const pnlColor = pnlValue >= 0 ? "text-green-500" : "text-red-500";
  const gradeColor = gradeColorMap[sample.grade] || "text-gray-400";
  
  const handleDeleteSample = async () => {
    try {
      await api.delete(`/api/samples/${sample.id}/`);
      toast.success("Sample deleted successfully!");
      window.location.href = "/samples"; 
    } catch (error) {
      toast.error("Failed to delete the sample.");
      console.error("Deletion error:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{sample.name}</h1>
          <p className="text-muted-foreground">
            {sample.start_date} - {sample.end_date || 'In Progress'}
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link to={`/samples/edit/${sample.id}`}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </Link>
            </Button>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Sample
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                           This action cannot be undone. This will permanently delete the sample "{sample.name}" and all its associated trades.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteSample}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader><CardTitle>Overall Grade</CardTitle></CardHeader>
            <CardContent><p className={cn("text-5xl font-bold", gradeColor)}>{sample.grade}</p></CardContent>
        </Card>
        <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader><CardTitle>Sample PNL</CardTitle></CardHeader>
            <CardContent><p className={cn("text-5xl font-bold", pnlColor)}>${pnlValue.toFixed(2)}</p></CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Trade Log</CardTitle>
                <CardDescription>All trades recorded for this sample.</CardDescription>
            </div>
            <Button size="sm" asChild>
                <Link to={`/samples/${sample.id}/add-trade`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Trade
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Instrument</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>R-Multiple</TableHead>
                <TableHead>PNL</TableHead>
                <TableHead className="hidden md:table-cell">Comment</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sample.trades.length > 0 ? (
                sample.trades.map(trade => (
                  <TableRow 
                    key={trade.id} 
                    // ✅ ZMIANA JEST TUTAJ: Przywrócono podświetlenie tła
                    className={cn(
                        trade.rules_followed 
                            ? "bg-emerald-950/20 hover:bg-emerald-950/40"
                            : "bg-rose-950/50 hover:bg-rose-950/70"
                    )}
                  >
                    <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                    <TableCell>{trade.instrument}</TableCell>
                    <TableCell>{trade.outcome}</TableCell>
                    <TableCell>{parseFloat(trade.realized_r_multiple).toFixed(2)}R</TableCell>
                    <TableCell>${parseFloat(trade.realized_pnl).toFixed(2)}</TableCell>
                    <TableCell className="max-w-xs truncate hidden md:table-cell">{trade.comment}</TableCell>
                    <TableCell>
                        <Button variant="ghost" size="icon" asChild>
                            <Link to={`/samples/${sample.id}/trades/${trade.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                        No trades added to this sample yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}