import { useState, useEffect } from "react";
import api from "@/api";
import { type MarketBias } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function MarketBiasWidget() {
  const [biases, setBiases] = useState<MarketBias[]>([]);
  const [loading, setLoading] = useState(true);

  // Pobierz dane przy załadowaniu komponentu
  useEffect(() => {
    fetchBiases();
  }, []);

  const fetchBiases = () => {
    api.get("/api/market-bias/")
      .then(res => setBiases(res.data))
      .catch(() => toast.error("Could not fetch market biases"))
      .finally(() => setLoading(false));
  };
  
  // Zaktualizuj bias w bazie danych
  const handleBiasChange = (instrumentId: string, newBias: "BULLISH" | "BEARISH" | "NEUTRAL") => {
    if (!newBias) return; // Nie rób nic, jeśli użytkownik odkliknie opcję

    api.put(`/api/market-bias/${instrumentId}/`, {
      // Znajdź pełny obiekt, aby wysłać wszystkie wymagane pola
      instrument: biases.find(b => b.id === instrumentId)?.instrument,
      bias: newBias,
    })
    .then(res => {
        // Zaktualizuj stan lokalny, aby interfejs był natychmiastowy
        setBiases(currentBiases => 
            currentBiases.map(b => b.id === instrumentId ? res.data : b)
        );
        toast.success(`${res.data.instrument} bias updated to ${res.data.bias}`);
    })
    .catch(() => toast.error("Failed to update bias."));
  };

  if (loading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle>Market Bias</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {biases.map(bias => (
          <div key={bias.id} className="flex items-center justify-between rounded-md border border-zinc-800 p-3">
            <p className="font-semibold">{bias.instrument}</p>
            <ToggleGroup
              type="single"
              variant="outline"
              value={bias.bias}
              onValueChange={(value) => handleBiasChange(bias.id, value as any)}
            >
              <ToggleGroupItem value="BULLISH" aria-label="Toggle bullish" className="data-[state=on]:bg-emerald-900/50 data-[state=on]:text-emerald-300">
                Bullish
              </ToggleGroupItem>
              <ToggleGroupItem value="BEARISH" aria-label="Toggle bearish" className="data-[state=on]:bg-rose-900/50 data-[state=on]:text-rose-300">
                Bearish
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}