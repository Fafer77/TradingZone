import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/api";
import { PlaybookItem } from "@/components/playbook-item";
import { Skeleton } from "@/components/ui/skeleton";

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
};

export default function PlaybookDetailPage() {
  const { playbookId } = useParams();
  const [playbook, setPlaybook] = useState<PlaybookFromAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playbookId) {
      getPlaybook(playbookId);
    }
  }, [playbookId]);

  const getPlaybook = (id: string) => {
    setLoading(true);
    api
      .get(`/api/playbooks/${id}/`)
      .then((res) => res.data)
      .then((data) => {
        setPlaybook(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
            <Skeleton className="h-[500px] w-full"/>
            <Skeleton className="h-[400px] w-full"/>
        </div>
      </main>
    );
  }

  if (!playbook) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <p>Playbook not found.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PlaybookItem playbook={playbook} />
    </main>
  );
}