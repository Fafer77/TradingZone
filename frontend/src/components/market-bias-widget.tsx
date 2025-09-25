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

  useEffect(() => {
    fetchBiases();
  }, []);

  const fetchBiases = () => {
    api.get("/api/market-bias/")
      .then(res => setBiases(res.data))
      .catch(() => toast.error("Could not fetch market biases"))
      .finally(() => setLoading(false));
  };
  
  const handleBiasChange = (instrumentId: string, newBias: "BULLISH" | "BEARISH" | "RANGE" | "RESURRECTION" | "NEUTRAL") => {
    if (!newBias) return;

    api.put(`/api/market-bias/${instrumentId}/`, {
      instrument: biases.find(b => b.id === instrumentId)?.instrument,
      bias: newBias,
    })
    .then(res => {
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
              onValueChange={(value) => handleBiasChange(bias.id, value as "BULLISH" | "BEARISH" | "RANGE" | "RESURRECTION" | "NEUTRAL")}
              className="flex-wrap justify-end"
            >
              {/* ✅ ZMIANA: Dodano klasę `px-3` do każdego przycisku */}
              <ToggleGroupItem value="BULLISH" className="data-[state=on]:bg-emerald-900/50 data-[state=on]:text-emerald-300 px-3">
                Bullish
              </ToggleGroupItem>
              <ToggleGroupItem value="BEARISH" className="data-[state=on]:bg-rose-900/50 data-[state=on]:text-rose-300 px-3">
                Bearish
              </ToggleGroupItem>
              <ToggleGroupItem value="RANGE" className="data-[state=on]:bg-yellow-900/50 data-[state=on]:text-yellow-300 px-3">
                Range
              </ToggleGroupItem>
              <ToggleGroupItem value="RESURRECTION" className="data-[state=on]:bg-sky-900/50 data-[state=on]:text-sky-300 px-3">
                Rsrrct
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}