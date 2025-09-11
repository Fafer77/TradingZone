import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "@/api";
import { type PlaybookFromAPI, type TradeFromAPI } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DatabasePage() {
  const [trades, setTrades] = useState<TradeFromAPI[]>([]);
  const [playbooks, setPlaybooks] = useState<PlaybookFromAPI[]>([]);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pobieramy jednocześnie wszystkie transakcje i playbooki
    Promise.all([
      api.get("/api/trades/"), // Potrzebny będzie endpoint zwracający wszystkie transakcje
      api.get("/api/playbooks/")
    ])
    .then(([tradesRes, playbooksRes]) => {
      setTrades(tradesRes.data);
      setPlaybooks(playbooksRes.data);
    })
    .catch(err => console.error("Failed to fetch data", err))
    .finally(() => setLoading(false));
  }, []);

  // Filtrujemy transakcje po stronie klienta za pomocą useMemo dla wydajności
  const filteredTrades = useMemo(() => {
    if (selectedPlaybookId === 'all') {
      return trades;
    }
    return trades.filter(trade => trade.strategy === selectedPlaybookId);
  }, [trades, selectedPlaybookId]);

  // Mapujemy ID playbooków na ich nazwy dla łatwiejszego wyświetlania
  const playbookTitleMap = useMemo(() => {
    const map = new Map<string, string>();
    playbooks.forEach(p => map.set(p.id, p.title));
    return map;
  }, [playbooks]);


  if (loading) {
    return (
        <main className="p-8">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-96 w-full" />
        </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Trade Database</h1>
          <p className="text-muted-foreground">A complete log of all your trades.</p>
        </div>
        <Button asChild>
          {/* Ten przycisk może prowadzić do listy próbek, aby tam dodać nową transakcję */}
          <Link to="/samples"> 
            <PlusCircle className="mr-2 h-4 w-4" /> Log New Trade
          </Link>
        </Button>
      </div>
      
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>All Trades</CardTitle>
          <div className="w-[250px]">
            <Select onValueChange={setSelectedPlaybookId} value={selectedPlaybookId}>
              <SelectTrigger><SelectValue placeholder="Filter by playbook..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Playbooks</SelectItem>
                {playbooks.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Instrument</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Initial Reward (R)</TableHead>
                <TableHead>Realized R</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map(trade => {
                const initialReward = (parseFloat(trade.initial_target_pips) / parseFloat(trade.initial_risk_pips)).toFixed(2);
                return (
                  <TableRow 
                    key={trade.id}
                    className={cn(!trade.rules_followed && "bg-rose-950/50")}
                  >
                    <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                    <TableCell>{trade.instrument}</TableCell>
                    <TableCell className="text-muted-foreground">{playbookTitleMap.get(trade.strategy || '') || '-'}</TableCell>
                    <TableCell>{trade.outcome}</TableCell>
                    <TableCell>{initialReward}R</TableCell>
                    <TableCell>{parseFloat(trade.realized_r_multiple).toFixed(2)}R</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}