import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type MarketDriver } from "@/types";
import { cn } from "@/lib/utils";

const colorClasses: Record<string, string> = {
  purple: "bg-purple-500/20 text-purple-200 border border-purple-500/50",
  green: "bg-green-500/20 text-green-200 border border-green-500/50",
  red: "bg-red-500/20 text-red-200 border border-red-500/50",
  blue: "bg-blue-500/20 text-blue-200 border border-blue-500/50",
  yellow: "bg-yellow-500/20 text-yellow-200 border border-yellow-500/50",
  sky: "bg-sky-500/20 text-sky-200 border border-sky-500/50",
};

export function MarketDriversWidget({ drivers }: { drivers: MarketDriver[] }) {
  const totalPercentage = drivers.reduce((sum, driver) => sum + driver.percentage, 0) || 100;

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle>Market Drivers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-center">
          {drivers.map((driver) => {
            const size = (driver.percentage / totalPercentage) * 150 + 80;

            return (
              <div
                key={driver.id}
                className={cn(
                  "flex items-center justify-center rounded-full p-2", // Dodano p-2
                  colorClasses[driver.color] || "bg-gray-500/20 text-gray-200"
                )}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              >
                <div className="text-center">
                  <p className="text-sm font-bold break-words">{driver.name}</p>
                  <p className="text-xs text-white/70">{driver.percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}