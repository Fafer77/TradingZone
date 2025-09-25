import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/api";
import { type Reminder, type MarketDriver } from "@/types";
import { RemindersWidget } from "@/components/reminders-widget";
import { MarketDriversWidget } from "@/components/market-drivers-widget";
import { MarketBiasWidget } from "@/components/market-bias-widget";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [drivers, setDrivers] = useState<MarketDriver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/reminders/"),
      api.get("/api/market-drivers/")
    ])
    .then(([remindersRes, driversRes]) => {
      setReminders(remindersRes.data);
      setDrivers(driversRes.data);
    })
    .catch(err => console.error("Failed to load dashboard data", err))
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8 items-start">
         <div className="space-y-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your mission control for the trading day.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>

      {/* ✅ ZMIANA: Nowy, dwukolumnowy layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Lewa kolumna */}
        <div className="space-y-8">
            <MarketDriversWidget drivers={drivers} />
            <MarketBiasWidget />
        </div>

        {/* Prawa kolumna */}
        <div className="space-y-8">
            <RemindersWidget reminders={reminders} />
        </div>

      </div>
    </main>
  );
}