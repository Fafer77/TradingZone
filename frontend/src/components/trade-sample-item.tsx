import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { type TradeSampleFromAPI } from "@/types";

export function TradeSampleItem({ sample }: { sample: TradeSampleFromAPI }) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">{sample.name}</h1>
                    <p className="text-muted-foreground">
                        {sample.start_date} - {sample.end_date || 'In Progress'}
                    </p>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/samples/edit/${sample.id}`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Link>
                    </Button>
                </div>
            </div>
            
            <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Trade Log</CardTitle>
                        <CardDescription>All trades recorded for this sample.</CardDescription>
                    </div>
                    <Button size="sm" asChild>
                        <Link to={`/samples/${sample.id}/add-trade`}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Trade
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Instrument</TableHead>
                                <TableHead>Outcome</TableHead>
                                <TableHead>R-Multiple</TableHead>
                                <TableHead>PNL</TableHead>
                                <TableHead className="hidden md:table-cell">Comment</TableHead>
                                <TableHead className="w-[50px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sample.trades.length > 0 ? (
                                sample.trades.map(trade => (
                                    <TableRow 
                                        key={trade.id} 
                                        // ✅ ZMIANA JEST TUTAJ
                                        className={cn(
                                            trade.rules_followed 
                                                ? "bg-emerald-950/40 hover:bg-emerald-950/60" // Stały zielony + hover
                                                : "bg-rose-950/50 hover:bg-rose-950/70"    // Stały czerwony + hover
                                        )}
                                    >
                                        <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{trade.instrument}</TableCell>
                                        <TableCell>{trade.outcome}</TableCell>
                                        <TableCell>{parseFloat(trade.realized_r_multiple).toFixed(2)}R</TableCell>
                                        <TableCell>${parseFloat(trade.realized_pnl).toFixed(2)}</TableCell>
                                        <TableCell className="max-w-xs truncate hidden md:table-cell">{trade.comment}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link to={`/samples/${sample.id}/trades/${trade.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24">
                                        No trades added to this sample yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}