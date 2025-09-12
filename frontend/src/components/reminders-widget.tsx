import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Reminder } from "@/types";
import { Pin } from "lucide-react";

export function RemindersWidget({ reminders }: { reminders: Reminder[] }) {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle>Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {reminders.map(reminder => (
            <li key={reminder.id} className="flex items-start gap-3">
              <Pin className="h-4 w-4 mt-1 text-zinc-500 shrink-0" />
              <p className="text-sm text-muted-foreground">{reminder.text}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}