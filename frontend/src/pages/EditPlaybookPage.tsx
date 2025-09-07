import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import api from "@/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

// Schemat formularza i walidacja Zod
const playbookSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  overview: z.string().optional(),
  trade_type: z.enum(["day_trading", "scalping", "swing_trading"]),
  entry_criteria: z.string().min(1, { message: "Entry criteria are required." }),
  exit_strategy: z.string().min(1, { message: "Exit strategy is required." }),
  stop_loss_rules: z.string().min(1, { message: "Stop loss rules are required." }),
  enhancers: z.string().optional(),
  trade_management: z.string().optional(),
  checklist: z.string().min(1, { message: "Checklist items are required." }),
});

// Główny komponent strony
export default function EditPlaybookPage() {
  const { playbookId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof playbookSchema>>({
    resolver: zodResolver(playbookSchema),
    defaultValues: {
      title: "",
      overview: "",
      entry_criteria: "",
      exit_strategy: "",
      stop_loss_rules: "",
      enhancers: "",
      trade_management: "",
      checklist: "",
    },
  });

  // Pobieranie istniejących danych
  useEffect(() => {
    if (playbookId) {
      setLoading(true);
      api.get(`/api/playbooks/${playbookId}/`)
        .then((res) => {
          const playbook = res.data;
          // Konwersja tablic z API na stringi dla pól Textarea
          const dataForForm = {
            ...playbook,
            entry_criteria: playbook.entry_criteria.join('\n'),
            exit_strategy: playbook.exit_strategy.join('\n'),
            stop_loss_rules: playbook.stop_loss_rules.join('\n'),
            enhancers: playbook.enhancers ? playbook.enhancers.join('\n') : "",
            trade_management: playbook.trade_management ? playbook.trade_management.join('\n') : "",
            checklist: playbook.checklist.join('\n'),
          };
          form.reset(dataForForm); // Wypełniamy formularz danymi z API
        })
        .catch((error) => {
          toast.error("Failed to load playbook data.");
          console.error(error);
          navigate("/playbook"); // Wróć, jeśli nie uda się załadować danych
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [playbookId, form]);

  // Logika wysyłania zaktualizowanych danych
  async function onSubmit(values: z.infer<typeof playbookSchema>) {
    const splitToArray = (text: string | undefined) => text ? text.split('\n').filter(line => line.trim() !== '') : [];

    const dataToSubmit = {
      ...values,
      entry_criteria: splitToArray(values.entry_criteria),
      exit_strategy: splitToArray(values.exit_strategy),
      stop_loss_rules: splitToArray(values.stop_loss_rules),
      enhancers: splitToArray(values.enhancers),
      trade_management: splitToArray(values.trade_management),
      checklist: splitToArray(values.checklist),
    };

    try {
      await api.put(`/api/playbooks/${playbookId}/`, dataToSubmit);
      toast.success("Playbook updated successfully!");
      navigate(`/playbook/${playbookId}`);
    } catch (error) {
      toast.error("Failed to update playbook. Please try again.");
      console.error(error);
    }
  }

  // Widok ładowania
  if (loading) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-[600px] w-full"/>
        </main>
    )
  }

  // Widok formularza
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Playbook</h1>
        <p className="text-muted-foreground">Update the details of your trading strategy.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle>Strategy Details</CardTitle>
              <CardDescription>Define the core components of your play.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Morning Momentum Scalp" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="trade_type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trade Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a type..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="day_trading">Day Trading</SelectItem>
                        <SelectItem value="scalping">Scalping</SelectItem>
                        <SelectItem value="swing_trading">Swing Trading</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="overview" render={({ field }) => (
                <FormItem>
                  <FormLabel>Overview</FormLabel>
                  <FormControl><Textarea placeholder="A brief description of the strategy's premise..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="entry_criteria" render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Criteria</FormLabel>
                  <FormControl><Textarea placeholder="List each criterion on a new line..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="exit_strategy" render={({ field }) => (
                <FormItem>
                  <FormLabel>Exit Strategy</FormLabel>
                  <FormControl><Textarea placeholder="List each rule on a new line..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="stop_loss_rules" render={({ field }) => (
                <FormItem>
                  <FormLabel>Stop Loss Rules</FormLabel>
                  <FormControl><Textarea placeholder="List each rule on a new line..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="enhancers" render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra Confirmations (Enhancers)</FormLabel>
                  <FormControl><Textarea placeholder="What makes the play extra good? List on new lines..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="trade_management" render={({ field }) => (
                <FormItem>
                  <FormLabel>Trade Management</FormLabel>
                  <FormControl><Textarea placeholder="How to manage the position? (e.g., SL to BE, partial TPs). List on new lines..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="checklist" render={({ field }) => (
                <FormItem>
                  <FormLabel>Pre-Trade Checklist</FormLabel>
                  <FormControl><Textarea placeholder="List each question on a new line..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </main>
  );
}