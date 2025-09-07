import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import api from "@/api";
import { DRCCard } from "@/components/drc-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type DRCFromAPI = {
  id: string;
  date: string;
  grade: string;
  pnl: string;
};

type DRCForComponent = {
  id: string;
  date: string;
  grade: string;
  pnl: number;
}

export default function DRCPage() {
  const [drcs, setDrcs] = useState<DRCForComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDrcs();
  }, []);

  const getDrcs = () => {
    api
      .get("/api/drcs/")
      .then((res) => res.data)
      .then((data: DRCFromAPI[]) => {
        const formattedData = data.map(drc => ({
          ...drc,
          pnl: parseFloat(drc.pnl)
        }));
        setDrcs(formattedData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Daily Report Cards</h1>
          <p className="text-muted-foreground">Your daily journal for performance tracking and self-assessment.</p>
        </div>
        <Button asChild>
          <Link to="/drc/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Report
          </Link>
        </Button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}
        </div>
      )}

      {!loading && drcs.length === 0 && (
        <div className="text-center py-10">
            <p className="text-muted-foreground">No reports found. Create your first one!</p>
        </div>
      )}
      
      {!loading && drcs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {drcs.map((drc) => (
            <DRCCard key={drc.id} drc={drc} />
          ))}
        </div>
      )}
    </main>
  );
}