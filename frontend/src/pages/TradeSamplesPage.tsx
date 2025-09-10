// src/pages/TradeSamplesPage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import api from "@/api";
import { TradeSampleCard } from "@/components/trade-sample-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type TradeSampleFromAPI } from "@/types";

export default function TradeSamplesPage() {
  const [samples, setSamples] = useState<TradeSampleFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/samples/")
      .then((res) => setSamples(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Trade Samples</h1>
          <p className="text-muted-foreground">Analyze your performance in focused samples.</p>
        </div>
        <Button asChild>
          <Link to="/samples/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Sample
          </Link>
        </Button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      )}

      {!loading && samples.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {samples.map((sample) => (
            <TradeSampleCard 
              key={sample.id} 
              sample={{
                id: sample.id,
                name: sample.name,
                start_date: sample.start_date,
                pnl: parseFloat(sample.pnl),
                // ✅ POPRAWKA JEST TUTAJ: Dodajemy brakujące pola
                trades_count: sample.trades_count,
                size: sample.size
              }} 
            />
          ))}
        </div>
      )}
    </main>
  );
}