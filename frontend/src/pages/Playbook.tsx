import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { PlusCircle } from "lucide-react"
import api from "@/api"
import { cn } from "@/lib/utils"
import { StrategyCard } from "@/components/strategy-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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
  owner: number;
};


export default function Playbook() {
  const [playbooks, setPlaybooks] = useState<PlaybookFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlaybooks();
  }, []);

  const getPlaybooks = () => {
    api
      .get("/api/playbooks/")
      .then((res) => res.data)
      .then((data) => {
        setPlaybooks(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const groupedPlaybooks = playbooks.reduce((acc, playbook) => {
    const key = playbook.trade_type;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(playbook);
    return acc;
  }, {} as Record<string, PlaybookFromAPI[]>);

  const categoryDetails = {
    day_trading: { title: "Day Trading", theme: "purple" as const },
    scalping: { title: "Scalping", theme: "green" as const },
    swing_trading: { title: "Swing Trading", theme: "red" as const },
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Trading Playbook</h1>
          <p className="text-muted-foreground">Your library of validated trading strategies and checklists.</p>
        </div>
        <Button asChild>
          <Link to="/playbook/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {Object.entries(categoryDetails).map(([key, details]) => (
          <Card 
            key={key} 
            className={cn("w-full border-2 bg-zinc-950", 
              details.theme === "purple" && "border-purple-800/50",
              details.theme === "green" && "border-green-800/50",
              details.theme === "red" && "border-red-800/50"
            )}
          >
            <CardHeader>
              <CardTitle>{details.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {loading ? (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : groupedPlaybooks[key] && groupedPlaybooks[key].length > 0 ? (
                groupedPlaybooks[key].map((playbook) => (
                  <StrategyCard
                    key={playbook.id}
                    strategy={{ id: playbook.id, name: playbook.title, ev: 0 }} // calculated backend
                    themeColor={details.theme}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-4 text-center">No strategies in this category yet.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}