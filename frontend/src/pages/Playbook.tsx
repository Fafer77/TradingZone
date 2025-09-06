import { Link } from "react-router-dom"
import { PlusCircle } from "lucide-react"

import { StrategyCard } from "@/components/strategy-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Definicja typu dla pojedynczej strategii
type Strategy = {
  name: string;
  ev: number;
};

const playbookCategories = [
  {
    title: "Day Trading",
    theme: "purple" as const,
    strategies: [
      { name: "Morning Momentum Scalp", ev: 2.15 },
      { name: "Mid-day Reversal", ev: 1.75 },
    ],
  },
  {
    title: "Scalping",
    theme: "green" as const,
    strategies: [
      { name: "1-Min ORB", ev: 1.55 },
      { name: "Orderflow Imbalance", ev: 2.30 },
      { name: "Tick Fade", ev: 0.95 },
    ],
  },
  {
    title: "Swing Trading",
    theme: "red" as const,
    strategies: [
      { name: "4h Structure Break", ev: 1.90 },
      { name: "Weekly Support Bounce", ev: 1.60 },
    ],
  },
]


export default function Playbook() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">

      <div className="flex items-center justify-between">
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Trading Playbook
          </h1>
          <p className="text-muted-foreground">
            Your library of validated trading strategies and checklists.
          </p>
        </div>
        {/* ✅ ZMIANA 2: Dodajemy przycisk opakowany w Link */}
        <Button asChild>
          <Link to="/playbook/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {playbookCategories.map((category) => (
          <Card 
            key={category.title} 
            className={cn(
              "w-full border-2 bg-zinc-950",
              category.theme === "purple" && "border-purple-800/50",
              category.theme === "green" && "border-green-800/50",
              category.theme === "red" && "border-red-800/50"
            )}
          >
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {category.strategies.map((strategy) => (
                <StrategyCard
                  key={strategy.name}
                  strategy={strategy}
                  themeColor={category.theme}
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}