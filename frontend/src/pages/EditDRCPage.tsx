import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ POPRAWKA 1: PNL jest teraz stringiem, tak jak wszystkie inne pola
const drcSchema = z.object({
  date: z.string().min(1, { message: "Date is required." }),
  grade: z.string().min(1, { message: "Grade is required." }),
  goal: z.string().optional(),
  pnl: z.string().min(1, { message: "PNL is required." }), // PNL jako string
  reminders: z.string().optional(),
  improvements: z.string().optional(),
  mistakes_with_solutions: z.string().optional(),
  performance_table: z.string().optional(),
});


export default function EditDRCPage() {
  const { drcId } = useParams();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof drcSchema>>({
    resolver: zodResolver(drcSchema),
    // `defaultValues` zostaną nadpisane przez dane z API
  });

  useEffect(() => {
    if (drcId) {
      api.get(`/api/drcs/${drcId}/`)
        .then((res) => {
          const drc = res.data;
          const dataForForm = {
            ...drc,
            pnl: String(drc.pnl), // Upewniamy się, że PNL jest stringiem dla formularza
            reminders: drc.reminders.join('\n'),
            improvements: drc.improvements.join('\n'),
            mistakes_with_solutions: drc.mistakes_with_solutions.join('\n'),
            performance_table: JSON.stringify(drc.performance_table, null, 2),
          };
          form.reset(dataForForm);
        })
        .catch((error) => {
          toast.error("Failed to load report data.");
          console.error(error);
          navigate("/drc");
        })
    }
  }, [drcId, form]);

  const onSubmit = async (values: z.infer<typeof drcSchema>) => {
    const splitToArray = (text?: string) => text ? text.split('\n').filter(line => line.trim() !== '') : [];
    
    let performanceTableData = [];
    if (values.performance_table && values.performance_table.trim() !== "") {
        try {
            performanceTableData = JSON.parse(values.performance_table);
        } catch (e) {
            toast.error("Performance Table is not valid JSON.");
            return;
        }
    }

    const dataToSubmit = {
      ...values,
      // ✅ POPRAWKA 2: Konwertujemy PNL na liczbę tuż przed wysłaniem do API
      pnl: parseFloat(values.pnl),
      reminders: splitToArray(values.reminders),
      improvements: splitToArray(values.improvements),
      mistakes_with_solutions: splitToArray(values.mistakes_with_solutions),
      performance_table: performanceTableData,
    };

    try {
      await api.put(`/api/drcs/${drcId}/`, dataToSubmit);
      toast.success("Report Card updated successfully!");
      navigate(`/drc/${drcId}`);
    } catch (error) {
      toast.error("Failed to update the report.");
      console.error(error);
    }
  };

  const isLoading = !form.formState.isDirty && form.formState.isLoading;

  if (isLoading) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-[600px] w-full"/>
        </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Daily Report Card</h1>
        <p className="text-muted-foreground">Update the details of your trading strategy.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle>Report for {form.watch('date')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="grade" render={({ field }) => (
                  <FormItem><FormLabel>Grade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a grade..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'N/A'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="pnl" render={({ field }) => (
                  <FormItem><FormLabel>PNL ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              {/* Pozostałe pola formularza bez zmian */}
              <FormField control={form.control} name="goal" render={({ field }) => ( <FormItem><FormLabel>Main Goal for the Day</FormLabel><FormControl><Textarea placeholder="What was your primary focus today?" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="improvements" render={({ field }) => ( <FormItem><FormLabel>Improvements</FormLabel><FormControl><Textarea placeholder="What did you do well? List on new lines..." {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="mistakes_with_solutions" render={({ field }) => ( <FormItem><FormLabel>Mistakes & Solutions</FormLabel><FormControl><Textarea placeholder="What mistakes did you make and how to fix them? List on new lines..." {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="performance_table" render={({ field }) => ( <FormItem><FormLabel>Performance Table (JSON format)</FormLabel><FormControl><Textarea placeholder='[{"segment_name": "Mood", "grade": "B"}, ...]' rows={8} {...field} /></FormControl><FormMessage /></FormItem> )} />
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