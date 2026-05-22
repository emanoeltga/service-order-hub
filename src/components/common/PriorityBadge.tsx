import { Badge } from "@/components/ui/badge";
import type { OSPriority } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const map: Record<OSPriority, { label: string; className: string }> = {
  baixa: { label: "Baixa", className: "bg-muted text-muted-foreground border-border" },
  media: { label: "Média", className: "bg-info/10 text-info border-info/30" },
  alta: { label: "Alta", className: "bg-warning/15 text-warning-foreground border-warning/40" },
  urgente: { label: "Urgente", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export function PriorityBadge({ priority }: { priority: OSPriority }) {
  const c = map[priority];
  return <Badge variant="outline" className={cn("font-medium", c.className)}>{c.label}</Badge>;
}
