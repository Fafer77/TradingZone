import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import { type TradeSampleFromAPI } from "@/types";
import { TradeSampleItem } from "@/components/trade-sample-item";

export default function TradeSampleDetailPage() {
  const { sampleId } = useParams();
  const [sample, setSample] = useState<TradeSampleFromAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sampleId) {
      api.get(`/api/samples/${sampleId}/`)
        .then((res) => setSample(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [sampleId]);

  if (loading) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-96 w-full" />
        </main>
    );
  }

  if (!sample) return <main className="p-8">Sample not found.</main>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <TradeSampleItem sample={sample} />
    </main>
  );
}