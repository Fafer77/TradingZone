import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const sampleSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  size: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
    message: "Size must be a positive number.",
  }),
  start_date: z.string().min(1, { message: "Start date is required." }),
});

export default function CreateTradeSamplePage() {
  const form = useForm<z.infer<typeof sampleSchema>>({
    resolver: zodResolver(sampleSchema),
    defaultValues: {
      name: "",
      size: "20",
      start_date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (values: z.infer<typeof sampleSchema>) => {
    const dataToSubmit = {
      ...values,
      size: parseInt(values.size, 10),
    };

    try {
      await api.post("/api/samples/", dataToSubmit);
      toast.success("Trade Sample created successfully!");
      window.location.href = "/samples";
    } catch (error) {
      toast.error("Failed to create the sample.");
      console.error(error);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create New Trade Sample</h1>
        <p className="text-muted-foreground">Define a new sample of trades to track your performance.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle>Sample Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Q4 2025 EUR/USD" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="size" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Size</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="start_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button type="submit">Create Sample</Button>
          </div>
        </form>
      </Form>
    </main>
  );
}