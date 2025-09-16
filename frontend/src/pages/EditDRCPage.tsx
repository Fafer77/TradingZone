import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Schemat dla pojedynczego wiersza w tabeli
const performanceSegmentSchema = z.object({
  id: z.any().optional(), // ID może istnieć dla istniejących wierszy
  segment_name: z.string(),
  grade: z.string().min(1, { message: "Required" }),
  playbook_trades_only: z.string().min(1, { message: "Required" }),
  sizing: z.string().min(1, { message: "Required" }),
  immediately_in_favour: z.string(),
  comments: z.string().optional(),
});

// Główny schemat formularza
const drcSchema = z.object({
  date: z.string().min(1, { message: "Date is required." }),
  grade: z.string().min(1, { message: "Grade is required." }),
  goal: z.string().optional(),
  pnl: z.string().min(1, { message: "PNL is required." }),
  reminders: z.string().optional(),
  improvements: z.string().optional(),
  mistakes_with_solutions: z.string().optional(),
  performance_table: z.array(performanceSegmentSchema),
});

const defaultTableValues = [
  { segment_name: "Mood", grade: "N/A", playbook_trades_only: "N/A", sizing: "N/A", immediately_in_favour: "0/0", comments: "" },
  { segment_name: "Session 1 (09-11)", grade: "N/A", playbook_trades_only: "N/A", sizing: "N/A", immediately_in_favour: "0/0", comments: "" },
  { segment_name: "Session 2 (11-13)", grade: "N/A", playbook_trades_only: "N/A", sizing: "N/A", immediately_in_favour: "0/0", comments: "" },
  { segment_name: "Session 3 (13-15)", grade: "N/A", playbook_trades_only: "N/A", sizing: "N/A", immediately_in_favour: "0/0", comments: "" },
  { segment_name: "Session 4 (15-17)", grade: "N/A", playbook_trades_only: "N/A", sizing: "N/A", immediately_in_favour: "0/0", comments: "" },
];

export default function EditDRCPage() {
  const { drcId } = useParams();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof drcSchema>>({
    resolver: zodResolver(drcSchema),
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "performance_table",
  });

  useEffect(() => {
    if (drcId) {
      api.get(`/api/drcs/${drcId}/`)
        .then((res) => {
          const drc = res.data;
          form.reset({
            ...drc,
            pnl: String(drc.pnl),
            reminders: drc.reminders.join('\n'),
            improvements: drc.improvements.join('\n'),
            mistakes_with_solutions: drc.mistakes_with_solutions.join('\n'),
            performance_table: drc.performance_table.length > 0 ? drc.performance_table : defaultTableValues,
          });
        })
        .catch(() => toast.error("Failed to load report data."))
    }
  }, [drcId, form]);

  const onSubmit = async (values: z.infer<typeof drcSchema>) => {
    const splitToArray = (text?: string) => text ? text.split('\n').filter(line => line.trim() !== '') : [];
    
    const dataToSubmit = {
      ...values,
      pnl: parseFloat(values.pnl),
      reminders: splitToArray(values.reminders),
      improvements: splitToArray(values.improvements),
      mistakes_with_solutions: splitToArray(values.mistakes_with_solutions),
    };

    try {
      await api.put(`/api/drcs/${drcId}/`, dataToSubmit);
      toast.success("Report Card updated successfully!");
      navigate(`/drc/${drcId}`);
    } catch (error) {
      toast.error("Failed to update the report.");
    }
  };

  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'N/A'];

  if (form.formState.isLoading) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-96 w-full" />
        </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Edit Daily Report Card</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle>Report for {form.watch('date')}</CardTitle>
              <CardDescription>Update the details of your daily report.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="grade" render={({ field }) => (
                  <FormItem><FormLabel>Grade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a grade..." /></SelectTrigger></FormControl>
                      <SelectContent>{gradeOptions.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="pnl" render={({ field }) => (
                  <FormItem><FormLabel>PNL ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="goal" render={({ field }) => (
                  <FormItem><FormLabel>Main Goal for the Day</FormLabel><FormControl><Textarea placeholder="What was your primary focus today?" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="improvements" render={({ field }) => (
                  <FormItem><FormLabel>Improvements</FormLabel><FormControl><Textarea placeholder="What did you do well? List on new lines..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="mistakes_with_solutions" render={({ field }) => (
                  <FormItem><FormLabel>Mistakes & Solutions</FormLabel><FormControl><Textarea placeholder="What mistakes did you make and how to fix them? List on new lines..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="reminders" render={({ field }) => (
                  <FormItem><FormLabel>Reminders</FormLabel><FormControl><Textarea placeholder="Key reminders for the next session..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
              <CardDescription>Grade each segment of your trading day.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Segment</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>PB Only</TableHead>
                    <TableHead>Sizing</TableHead>
                    <TableHead>In Favour</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell><FormField control={form.control} name={`performance_table.${index}.segment_name`} render={({ field }) => (<Input {...field} />)} /></TableCell>
                      <TableCell><FormField control={form.control} name={`performance_table.${index}.grade`} render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>{gradeOptions.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                          </Select>
                        )} /></TableCell>
                      <TableCell><FormField control={form.control} name={`performance_table.${index}.playbook_trades_only`} render={({ field }) => (
                           <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>{gradeOptions.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                           </Select>
                        )} /></TableCell>
                       <TableCell><FormField control={form.control} name={`performance_table.${index}.sizing`} render={({ field }) => (
                           <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>{gradeOptions.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                           </Select>
                        )} /></TableCell>
                       <TableCell><FormField control={form.control} name={`performance_table.${index}.immediately_in_favour`} render={({ field }) => (<Input {...field} type="text"/>)} /></TableCell>
                       <TableCell><FormField control={form.control} name={`performance_table.${index}.comments`} render={({ field }) => (<Textarea {...field} placeholder="Any notes..." className="w-full" />)} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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