import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/api";
import { DRCItem } from "@/components/drc-item";
import { Skeleton } from "@/components/ui/skeleton";

export default function DRCDetailPage() {
  const { drcId } = useParams();
  const [drc, setDrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (drcId) {
      api
        .get(`/api/drcs/${drcId}/`)
        .then((res) => res.data)
        .then((data) => {
            // Konwertujemy pnl na liczbę, tak jak na stronie listy
            setDrc({ ...data, pnl: parseFloat(data.pnl) });
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [drcId]);

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Skeleton className="h-40 w-full" /><Skeleton className="h-40 w-full" /></div>
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (!drc) {
    return <main className="p-8">Report not found.</main>;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DRCItem drc={drc} />
    </main>
  );
}