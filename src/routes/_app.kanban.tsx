import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { mockOS, type OSStatus } from "@/lib/mock-data";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";

export const Route = createFileRoute("/_app/kanban")({ component: KanbanPage });

const columns: { status: OSStatus; title: string }[] = [
  { status: "aberta", title: "Aberta" },
  { status: "em_andamento", title: "Em andamento" },
  { status: "aguardando", title: "Aguardando" },
  { status: "concluida", title: "Concluída" },
];

function KanbanPage() {
  return (
    <div>
      <PageHeader title="Board Kanban" description="Acompanhe o fluxo das OS" />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const items = mockOS.filter((o) => o.status === col.status);
          return (
            <div key={col.status} className="bg-muted/40 rounded-lg p-3 min-h-[400px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((os) => (
                  <Card key={os.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <p className="text-xs text-muted-foreground">{os.numero}</p>
                    <p className="text-sm font-medium mt-1">{os.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-1">{os.cliente}</p>
                    <div className="flex items-center justify-between mt-3">
                      <PriorityBadge priority={os.prioridade} />
                      <StatusBadge status={os.status} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
