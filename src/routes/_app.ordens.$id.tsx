import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { LoadingState } from "@/components/common/LoadingState";
import { AlertTriangle, ArrowLeft, Trash2, CheckCircle } from "lucide-react";
import { osService, getApiErrorMessage } from "@/services/os";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/ordens/$id")({
  component: OrdemDetalhePage,
});

function OrdemDetalhePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: os, isLoading, error } = useQuery({
    queryKey: ["service-orders", id],
    queryFn: () => osService.get(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => osService.remove(id),
    onSuccess: () => {
      toast.success("Ordem de serviço removida");
      queryClient.invalidateQueries({ queryKey: ["service-orders"] });
      navigate({ to: "/ordens" });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Erro ao excluir"));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => osService.update(id, { status }),
    onSuccess: () => {
      toast.success("Status atualizado");
      queryClient.invalidateQueries({ queryKey: ["service-orders", id] });
      queryClient.invalidateQueries({ queryKey: ["service-orders"] });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Erro ao atualizar status"));
    },
  });

  if (isLoading) return <LoadingState />;
  if (error || !os) {
    return (
      <div className="rounded-lg border bg-card p-6 flex items-start gap-3">
        <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Erro ao carregar OS</p>
          <p className="text-sm text-muted-foreground">{getApiErrorMessage(error)}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate({ to: "/ordens" })}>
            Voltar para lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/ordens" })}>
          <ArrowLeft className="mr-2 size-4" /> Voltar
        </Button>
        <div className="flex gap-2">
          {os.status !== "concluida" && (
            <Button variant="outline" onClick={() => updateStatusMutation.mutate("concluida")} disabled={updateStatusMutation.isPending}>
              <CheckCircle className="mr-2 size-4" /> Marcar como Concluída
            </Button>
          )}
          <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <PageHeader title={`OS #${os.numero}`} description={os.titulo} />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Descrição</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{os.descricao}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cliente</p>
              <p>{os.cliente}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Técnico</p>
              <p>{os.tecnico}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prioridade</p>
                <PriorityBadge priority={os.prioridade} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <StatusBadge status={os.status} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Prazo</p>
              <p>{os.prazo ? format(new Date(os.prazo), "dd/MM/yyyy") : "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor</p>
              <p className="text-lg font-bold">R$ {Number(os.valor ?? 0).toLocaleString("pt-BR")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
