import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Typ danych dla pojedynczej karty
type DRC = {
  id: string;
  date: string;
  grade: string;
  pnl: number;
};

// Mapowanie ocen na kolory Tailwind
const gradeColorMap: Record<string, string> = {
  'A+': 'text-green-400',
  'A': 'text-green-500',
  'A-': 'text-green-600',
  'B+': 'text-yellow-400',
  'B': 'text-yellow-500',
  'B-': 'text-yellow-600',
  'C+': 'text-orange-400',
  'C': 'text-orange-500',
  'C-': 'text-orange-600',
  'D': 'text-red-500',
  'F': 'text-red-600',
  'N/A': 'text-zinc-500',
};

export function DRCCard({ drc }: { drc: DRC }) {
  const pnlColor = drc.pnl >= 0 ? "text-green-500" : "text-red-500";
  const gradeColor = gradeColorMap[drc.grade] || "text-gray-400";

  return (
    <Link to={`/drc/${drc.id}`} className="block">
      <Card className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg">{drc.date}</CardTitle>
          <CardDescription>Click to view details</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between text-lg font-bold">
          <span className={cn(gradeColor)}>{drc.grade}</span>
          <span className={cn(pnlColor)}>${drc.pnl.toFixed(2)}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}