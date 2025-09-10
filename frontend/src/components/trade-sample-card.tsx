import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Sample = {
  id: string;
  name: string;
  start_date: string;
  pnl: number;
  trades_count: number;
  size: number;
};

export function TradeSampleCard({ sample }: { sample: Sample }) {
  const pnlValue = parseFloat(String(sample.pnl));
  const pnlColor = pnlValue >= 0 ? "text-green-500" : "text-red-500";
  const PnlIcon = pnlValue >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <Link to={`/samples/${sample.id}`} className="block">
      <Card className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg">{sample.name}</CardTitle>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Started: {sample.start_date}</span>
            <span>{sample.trades_count} / {sample.size}</span>
          </div>
        </CardHeader>
        <CardFooter>
          <div className={cn("flex items-center text-lg font-bold", pnlColor)}>
            <PnlIcon className="mr-2 h-5 w-5" />
            <span>${pnlValue.toFixed(2)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}