import { Badge } from "@/components/ui/badge";
import type { OSStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const map: Record<OSStatus, { label: string; className: string }> = {
  aberta: { label: "Aberta", className: "bg-info/15 text-info border-info/30" },
  em_andamento: { label: "Em andamento", className: "bg-primary/15 text-primary border-primary/30" },
  aguardando: { label: "Aguardando", className: "bg-warning/20 text-warning-foreground border-warning/40" },
  concluida: { label: "Concluída", className: "bg-success/15 text-success border-success/30" },
  cancelada: { label: "Cancelada", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export function StatusBadge({ status }: { status: OSStatus }) {
  const c = map[status];
  return <Badge variant="outline" className={cn("font-medium", c.className)}>{c.label}</Badge>;
}
