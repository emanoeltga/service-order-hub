import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { mockOS } from "@/lib/mock-data";
import { ArrowLeft, Calendar, DollarSign, User, Building2 } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/ordens/$id")({
  loader: ({ params }) => {
    const os = mockOS.find((o) => o.id === params.id);
    if (!os) throw notFound();
    return os;
  },
  component: OSDetailPage,
  notFoundComponent: () => <div className="p-6">OS não encontrada</div>,
});

function OSDetailPage() {
  const os = Route.useLoaderData();

  return (
    <div>
      <PageHeader
        title={`${os.numero} · ${os.titulo}`}
        description="Detalhes da Ordem de Serviço"
        actions={
          <Button asChild variant="outline">
            <Link to="/ordens"><ArrowLeft className="size-4" /> Voltar</Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Descrição</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{os.descricao}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Resumo</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge status={os.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Prioridade</span>
              <PriorityBadge priority={os.prioridade} />
            </div>
            <div className="border-t pt-3 space-y-3">
              <Row icon={Building2} label="Cliente" value={os.cliente} />
              <Row icon={User} label="Técnico" value={os.tecnico} />
              <Row icon={Calendar} label="Abertura" value={format(new Date(os.abertura), "dd/MM/yyyy")} />
              <Row icon={Calendar} label="Prazo" value={format(new Date(os.prazo), "dd/MM/yyyy")} />
              <Row icon={DollarSign} label="Valor" value={`R$ ${os.valor.toLocaleString("pt-BR")}`} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 rounded-md bg-muted flex items-center justify-center">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1 flex justify-between items-center">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}
