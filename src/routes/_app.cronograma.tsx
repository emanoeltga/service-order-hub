import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { mockOS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/common/StatusBadge";
import { format, differenceInDays, parseISO } from "date-fns";

export const Route = createFileRoute("/_app/cronograma")({ component: CronogramaPage });

function CronogramaPage() {
  const items = [...mockOS].sort((a, b) => a.prazo.localeCompare(b.prazo));
  const minDate = parseISO(items[0].abertura);
  const maxDate = parseISO(items[items.length - 1].prazo);
  const totalDays = Math.max(differenceInDays(maxDate, minDate), 1);

  return (
    <div>
      <PageHeader title="Cronograma" description="Linha do tempo das ordens de serviço" />
      <Card>
        <CardContent className="p-6 space-y-3">
          {items.map((os) => {
            const start = differenceInDays(parseISO(os.abertura), minDate);
            const duration = Math.max(differenceInDays(parseISO(os.prazo), parseISO(os.abertura)), 1);
            const left = (start / totalDays) * 100;
            const width = (duration / totalDays) * 100;
            return (
              <div key={os.id} className="grid grid-cols-12 items-center gap-3 text-sm">
                <div className="col-span-3">
                  <p className="font-medium">{os.numero}</p>
                  <p className="text-xs text-muted-foreground truncate">{os.titulo}</p>
                </div>
                <div className="col-span-7 relative h-8 bg-muted rounded-md">
                  <div
                    className="absolute top-0 h-full bg-primary/80 rounded-md flex items-center px-2"
                    style={{ left: `${left}%`, width: `${width}%`, minWidth: 60 }}
                  >
                    <span className="text-[10px] text-primary-foreground truncate">{os.tecnico}</span>
                  </div>
                </div>
                <div className="col-span-2 flex flex-col items-end gap-1">
                  <StatusBadge status={os.status} />
                  <span className="text-xs text-muted-foreground">{format(parseISO(os.prazo), "dd/MM")}</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
