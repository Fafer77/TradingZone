import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


type Category = {
  label: "D Setup" | "C Setup" | "B Setup" | "A Setup" | "A+ Setup";
  className: string;
};

type Strategy = {
  name: string;
  ev: number;
};

function getCategory(ev: number): Category {
  if (ev >= 2) return { label: "A+ Setup", className: "bg-green-700/80 text-green-200 border-green-600" };
  if (ev >= 1.5) return { label: "A Setup", className: "bg-green-900/70 text-green-300 border-green-700" };
  if (ev >= 1) return { label: "B Setup", className: "bg-yellow-900/70 text-yellow-300 border-yellow-700" };
  if (ev >= 0.5) return { label: "C Setup", className: "bg-orange-900/70 text-orange-300 border-orange-700" };
  return { label: "D Setup", className: "bg-red-900/70 text-red-300 border-red-700" };
}



interface StrategyCardProps extends React.ComponentProps<typeof Card> {
  strategy: Strategy;
  themeColor: "purple" | "green" | "red";
}

export function StrategyCard({ strategy, themeColor, className, ...props }: StrategyCardProps) {
  const category = getCategory(strategy.ev);

  const themeClasses = {
    purple: "border-purple-800/80 before:bg-purple-900/40",
    green: "border-green-800/80 before:bg-green-900/40",
    red: "border-red-800/80 before:bg-red-900/40",
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-zinc-950 transition-transform hover:-translate-y-1",
        "before:absolute before:top-0 before:left-0 before:h-48 before:w-full before:rounded-full before:blur-3xl before:opacity-30 before:-z-10",
        themeClasses[themeColor],
        className
      )}
      {...props}
    >
      <CardContent className="p-4 py-0">
        <p className="text-sm font-semibold truncate">{strategy.name}</p>
        <div className="flex items-center justify-between mt-1">
            <p className="text-sm font-bold tracking-tight">EV {strategy.ev.toFixed(2)}</p>
            <Badge variant="outline" className={cn("text-xs font-semibold", category.className)}>
              {category.label}
            </Badge>
        </div>
      </CardContent>
    </Card>
  );
}