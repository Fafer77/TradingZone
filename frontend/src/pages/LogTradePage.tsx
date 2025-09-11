import { useState, useEffect } from "react";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { type PlaybookFromAPI } from "@/types";

type Instrument = {
  id: number;
  name: string;
}

const initialFormData = {
  strategy: "",
  instrument: "",
  outcome: "",
  realized_r: "0.0",
};

export default function LogTradePage() {
  const [formData, setFormData] = useState(initialFormData);
  const [playbooks, setPlaybooks] = useState<PlaybookFromAPI[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/api/playbooks/"),
      api.get("/api/instruments/")
    ])
    .then(([playbooksRes, instrumentsRes]) => {
      setPlaybooks(playbooksRes.data);
      setInstruments(instrumentsRes.data);
    })
    .catch(err => console.error("Failed to fetch initial data", err))
    .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      ...formData,
      realized_r: parseFloat(formData.realized_r),
    };

    try {
      await api.post("/api/trade-logs/", dataToSubmit);
      toast.success("Trade logged successfully!");
      window.location.href = "/playbook";
    } catch (error) {
      toast.error("Failed to log trade.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="grid gap-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Log a New Trade</h1>
          <p className="text-muted-foreground">Add a trade to your database to calculate statistics.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle>Trade Entry</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="strategy">Strategy</Label>
                <Select onValueChange={(value) => handleSelectChange('strategy', value)} value={formData.strategy} required>
                  <SelectTrigger><SelectValue placeholder="Select a playbook..." /></SelectTrigger>
                  <SelectContent>
                    {playbooks.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="instrument">Instrument</Label>
                  <Select onValueChange={(value) => handleSelectChange('instrument', value)} value={formData.instrument} required>
                    <SelectTrigger><SelectValue placeholder="Select an instrument..." /></SelectTrigger>
                    <SelectContent>
                      {instruments.map(i => <SelectItem key={i.id} value={String(i.id)}>{i.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="outcome">Outcome</Label>
                  <Select onValueChange={(value) => handleSelectChange('outcome', value)} value={formData.outcome} required>
                    <SelectTrigger><SelectValue placeholder="Select outcome..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WIN">Win</SelectItem>
                      <SelectItem value="LOSS">Loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="realized_r">Realized R-Multiple</Label>
                <Input type="number" step="0.1" id="realized_r" name="realized_r" value={formData.realized_r} onChange={handleChange} required />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Logging..." : "Log Trade"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}