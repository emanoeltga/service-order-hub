import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { LoadingState } from "@/components/common/LoadingState";
import { ArrowLeft, Calendar, DollarSign, User, Building2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { osService, getApiErrorMessage } from "@/services/os";

export const Route = createFileRoute("/_app/ordens/$id")({
  component: OSDetailPage,
});

function OSDetailPage() {
  const { id } = Route.useParams();
  const { data: os, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["service-orders", id],
    queryFn: () => osService.get(id),
  });

  if (isLoading) return <LoadingState />;

  if (error || !os) {
    return (
      <div>
        <PageHeader
          title="Ordem de Serviço"
          actions={
            <Button asChild variant="outline">
              <Link to="/ordens"><ArrowLeft className="size-4" /> Voltar</Link>
            </Button>
          }
        />
        <div className="rounded-lg border bg-card p-6 flex items-start gap-3">
          <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Não foi possível carregar a OS</p>
            <p className="text-sm text-muted-foreground mt-1">{getApiErrorMessage(error)}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? "Tentando..." : "Tentar novamente"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              <Row icon={Calendar} label="Abertura" value={os.abertura ? format(new Date(os.abertura), "dd/MM/yyyy") : "-"} />
              <Row icon={Calendar} label="Prazo" value={os.prazo ? format(new Date(os.prazo), "dd/MM/yyyy") : "-"} />
              <Row icon={DollarSign} label="Valor" value={`R$ ${Number(os.valor ?? 0).toLocaleString("pt-BR")}`} />
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
