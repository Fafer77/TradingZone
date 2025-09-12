import { useState, useEffect } from "react";
import api from "@/api";
import { type Reminder, type MarketDriver } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

function ReminderForm({ onSave, existingReminder }: { onSave: () => void; existingReminder?: Reminder }) {
  const [text, setText] = useState(existingReminder?.text || "");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.length < 3) {
      toast.error("Reminder is too short.");
      return;
    }
    try {
      if (existingReminder) {
        await api.put(`/api/reminders/${existingReminder.id}/`, { text });
        toast.success("Reminder updated!");
      } else {
        await api.post("/api/reminders/", { text });
        toast.success("Reminder added!");
      }
      onSave();
      setIsOpen(false);
    } catch (err) {
      toast.error("An error occurred.");
      console.log(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {existingReminder ? (
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4"/></Button>
        ) : (
          <Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/>Add Reminder</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{existingReminder ? "Edit Reminder" : "Add New Reminder"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="text">Reminder Text</Label>
            <Input id="text" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Formularz dla Market Drivers ---
const initialDriverState = { name: "", percentage: 0, color: "" };

function MarketDriverForm({ onSave, existingDriver }: { onSave: () => void; existingDriver?: MarketDriver }) {
  const [driver, setDriver] = useState(existingDriver || initialDriverState);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDriver(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setDriver(prev => ({ ...prev, color: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prosta walidacja
    if (!driver.name || driver.name.length < 3) {
        toast.error("Driver name is too short.");
        return;
    }
    if (driver.percentage < 0 || driver.percentage > 100) {
        toast.error("Percentage must be between 0 and 100.");
        return;
    }

    try {
      if (existingDriver) {
        await api.put(`/api/market-drivers/${existingDriver.id}/`, driver);
        toast.success("Market Driver updated!");
      } else {
        await api.post("/api/market-drivers/", driver);
        toast.success("Market Driver added!");
      }
      onSave();
      setIsOpen(false);
    } catch (err) {
      toast.error("An error occurred.");
      console.log(err);
    }
  };

  const colorOptions = ["purple", "green", "red", "blue", "yellow", "sky"];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {existingDriver ? (
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4"/></Button>
        ) : (
          <Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/>Add Driver</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{existingDriver ? "Edit Market Driver" : "Add New Driver"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Driver Name</Label>
            <Input id="name" name="name" value={driver.name} onChange={handleChange} placeholder="e.g., Market Sentiment" />
          </div>
          <div className="flex gap-4">
            <div className="grid gap-3 flex-1">
              <Label htmlFor="percentage">Percentage (%)</Label>
              <Input id="percentage" name="percentage" type="number" value={driver.percentage} onChange={handleChange} />
            </div>
            <div className="grid gap-3 flex-1">
              <Label htmlFor="color">Color</Label>
              <Select onValueChange={handleSelectChange} value={driver.color}>
                <SelectTrigger><SelectValue placeholder="Select color..." /></SelectTrigger>
                <SelectContent>{colorOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit">Save</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


// --- Komponent Główny Strony ---
export default function DashboardSettingsPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [drivers, setDrivers] = useState<MarketDriver[]>([]);

  const fetchData = () => {
    Promise.all([api.get("/api/reminders/"), api.get("/api/market-drivers/")])
      .then(([remindersRes, driversRes]) => {
        setReminders(remindersRes.data);
        setDrivers(driversRes.data);
      });
  };

  useEffect(fetchData, []);

  const deleteItem = async (type: "reminder" | "driver", id: string) => {
    const endpoint = type === "reminder" ? `/api/reminders/${id}/` : `/api/market-drivers/${id}/`;
    try {
      await api.delete(endpoint);
      toast.success(`${type === "reminder" ? "Reminder" : "Market Driver"} deleted!`);
      fetchData();
    } catch (err) {
      toast.error(`Failed to delete ${type}.`);
      console.log(err);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Settings</h1>
        <p className="text-muted-foreground">Manage your reminders and market drivers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Your Reminders</CardTitle>
            <ReminderForm onSave={fetchData} />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {reminders.map(r => (
                <li key={r.id} className="flex items-center justify-between rounded-md border border-zinc-800 p-3">
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                  <div className="flex gap-2">
                    <ReminderForm onSave={fetchData} existingReminder={r} />
                    <Button variant="ghost" size="icon" onClick={() => deleteItem('reminder', r.id)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Market Drivers</CardTitle>
            <MarketDriverForm onSave={fetchData} />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {drivers.map(d => (
                <li key={d.id} className="flex items-center justify-between rounded-md border border-zinc-800 p-3">
                  <div className="flex items-center gap-3">
                      <div className={cn("h-4 w-4 rounded-full", d.color === "purple" && "bg-purple-500", d.color === "green" && "bg-green-500", d.color === "red" && "bg-red-500", d.color === "blue" && "bg-blue-500", d.color === "yellow" && "bg-yellow-500", d.color === "sky" && "bg-sky-500")} />
                      <p className="text-sm font-medium">{d.name}</p>
                      <p className="text-sm text-muted-foreground">({d.percentage}%)</p>
                  </div>
                  <div className="flex gap-2">
                    <MarketDriverForm onSave={fetchData} existingDriver={d} />
                    <Button variant="ghost" size="icon" onClick={() => deleteItem('driver', d.id)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}