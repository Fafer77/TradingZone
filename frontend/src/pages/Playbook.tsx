import { PlaybookItem } from "@/components/playbook-item"

export default function Playbook() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Trading Playbook
        </h1>
        <p className="text-muted-foreground">
          Your library of validated trading strategies and checklists.
        </p>
      </div>

      <div className="w-full">
        <PlaybookItem />
      </div>

    </div>
  )
}