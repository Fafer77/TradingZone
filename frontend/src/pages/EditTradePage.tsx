import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { type PlaybookFromAPI } from "@/types";

// Definicja typu dla danych w formularzu
type FormData = {
  date: string;
  instrument: string;
  strategy: string | null;
  outcome: string;
  realized_pnl: string;
  realized_r_multiple: string;
  initial_risk_pips: string;
  initial_target_pips: string;
  rules_followed: boolean;
  context: string;
  comment: string;
};

// Wartości początkowe, aby uniknąć `null` i błędów
const initialFormData: FormData = {
  date: "",
  instrument: "",
  strategy: null,
  outcome: "",
  realized_pnl: "0.00",
  realized_r_multiple: "0.0",
  initial_risk_pips: "0.0",
  initial_target_pips: "0.0",
  rules_followed: true,
  context: "",
  comment: "",
};

export default function EditTradePage() {
  const { sampleId, tradeId } = useParams();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [playbooks, setPlaybooks] = useState<PlaybookFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tradeId || !sampleId) return;

    const fetchData = async () => {
      try {
        const [playbooksRes, tradeRes] = await Promise.all([
          api.get("/api/playbooks/"),
          api.get(`/api/samples/${sampleId}/trades/${tradeId}/`)
        ]);
        
        setPlaybooks(playbooksRes.data);
        const trade = tradeRes.data;

        setFormData({
          ...trade,
          date: trade.date ? new Date(trade.date).toISOString().slice(0, 16) : '',
          realized_pnl: String(trade.realized_pnl),
          realized_r_multiple: String(trade.realized_r_multiple),
          initial_risk_pips: String(trade.initial_risk_pips),
          initial_target_pips: String(trade.initial_target_pips),
          strategy: trade.strategy || "",
        });
      } catch (err) {
        toast.error("Failed to load initial data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tradeId, sampleId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prevState => ({ ...prevState, rules_followed: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      ...formData,
      realized_pnl: parseFloat(formData.realized_pnl),
      realized_r_multiple: parseFloat(formData.realized_r_multiple),
      initial_risk_pips: parseFloat(formData.initial_risk_pips),
      initial_target_pips: parseFloat(formData.initial_target_pips),
      strategy: formData.strategy === "" ? null : formData.strategy,
    };

    try {
      await api.put(`/api/samples/${sampleId}/trades/${tradeId}/`, dataToSubmit);
      toast.success("Trade updated successfully!");
      window.location.href = `/samples/${sampleId}`;
    } catch (error) {
      toast.error("Failed to update trade.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <main className="flex flex-1 flex-col items-center p-4 md:p-8">
            <div className="w-full max-w-4xl space-y-4">
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-[500px] w-full" />
            </div>
        </main>
    );
  }

  return (
    <main className="flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-4">
        <div className="grid gap-2 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight">Edit Trade</h1>
          <p className="text-muted-foreground">Update the details of your trade.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader><CardTitle>Trade Details</CardTitle></CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3"><Label htmlFor="date">Date & Time</Label><Input type="datetime-local" id="date" name="date" value={formData.date} onChange={handleChange} required /></div>
                <div className="grid gap-3"><Label htmlFor="instrument">Instrument</Label><Input id="instrument" name="instrument" placeholder="e.g., GOLD, EUR/USD" value={formData.instrument} onChange={handleChange} required /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3"><Label htmlFor="initial_risk_pips">Initial Risk (pips)</Label><Input type="number" step="0.01" id="initial_risk_pips" name="initial_risk_pips" value={formData.initial_risk_pips} onChange={handleChange} required /></div>
                <div className="grid gap-3"><Label htmlFor="initial_target_pips">Initial Target (pips)</Label><Input type="number" step="0.01" id="initial_target_pips" name="initial_target_pips" value={formData.initial_target_pips} onChange={handleChange} required /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="grid gap-3"><Label htmlFor="outcome">Outcome</Label><Select onValueChange={(value) => handleSelectChange('outcome', value)} value={formData.outcome}><SelectTrigger><SelectValue placeholder="Select outcome..." /></SelectTrigger><SelectContent><SelectItem value="WIN">Win</SelectItem><SelectItem value="LOSS">Loss</SelectItem><SelectItem value="BE">Breakeven</SelectItem></SelectContent></Select></div>
                <div className="grid gap-3"><Label htmlFor="realized_pnl">Realized PNL ($)</Label><Input type="number" step="0.01" id="realized_pnl" name="realized_pnl" value={formData.realized_pnl} onChange={handleChange} required /></div>
                <div className="grid gap-3"><Label htmlFor="realized_r_multiple">Realized R-Multiple</Label><Input type="number" step="0.1" id="realized_r_multiple" name="realized_r_multiple" placeholder="e.g., 2.5 or -1" value={formData.realized_r_multiple} onChange={handleChange} required /></div>
              </div>
              <div className="grid gap-3"><Label htmlFor="strategy">Playbook Strategy (Optional)</Label><Select onValueChange={(value) => handleSelectChange('strategy', value)} value={formData.strategy || ''}><SelectTrigger><SelectValue placeholder="Select a playbook..." /></SelectTrigger><SelectContent>{playbooks.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid gap-3"><Label htmlFor="context">Market Context</Label><Textarea id="context" name="context" placeholder="What was the market environment?" value={formData.context} onChange={handleChange} /></div>
              <div className="grid gap-3"><Label htmlFor="comment">Comment</Label><Textarea id="comment" name="comment" placeholder="Lessons, mistakes, emotions, etc." value={formData.comment} onChange={handleChange} /></div>
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-zinc-900 border-zinc-800"><div className="space-y-0.5"><Label className="text-base">Rules Followed?</Label></div><Switch checked={formData.rules_followed} onCheckedChange={handleSwitchChange} /></div>
            </CardContent>
          </Card>
          <div className="flex justify-end"><Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button></div>
        </form>
      </div>
    </main>
  );
}