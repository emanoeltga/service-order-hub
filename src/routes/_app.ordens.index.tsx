import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterPanel } from "@/components/common/FilterPanel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { LoadingState } from "@/components/common/LoadingState";
import { type OrdemServico } from "@/lib/mock-data";
import { osService, getApiErrorMessage } from "@/services/os";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/ordens/")({ component: OrdensPage });

function OrdensPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: ordens = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["service-orders"],
    queryFn: osService.list,
  });

  const data = useMemo(
    () =>
      ordens.filter((o) =>
        [o.numero, o.titulo, o.cliente, o.tecnico]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [ordens, search],
  );

  const columns: Column<OrdemServico>[] = [
    { key: "numero", header: "Número", cell: (r) => <span className="font-medium">{r.numero}</span> },
    { key: "titulo", header: "Título", cell: (r) => r.titulo },
    { key: "cliente", header: "Cliente", cell: (r) => r.cliente },
    { key: "tecnico", header: "Técnico", cell: (r) => r.tecnico },
    { key: "prioridade", header: "Prioridade", cell: (r) => <PriorityBadge priority={r.prioridade} /> },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "prazo", header: "Prazo", cell: (r) => (r.prazo ? format(new Date(r.prazo), "dd/MM/yyyy") : "-") },
    { key: "valor", header: "Valor", className: "text-right", cell: (r) => `R$ ${Number(r.valor ?? 0).toLocaleString("pt-BR")}` },
  ];

  return (
    <div>
      <PageHeader
        title="Ordens de Serviço"
        description="Gerencie todas as ordens de serviço"
        actions={
          <Button asChild>
            <Link to="/ordens/nova"><Plus className="size-4" /> Nova OS</Link>
          </Button>
        }
      />
      <FilterPanel search={search} onSearchChange={setSearch} placeholder="Buscar por número, título, cliente..." />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <div className="rounded-lg border bg-card p-6 flex items-start gap-3">
          <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Não foi possível carregar as ordens de serviço</p>
            <p className="text-sm text-muted-foreground mt-1">{getApiErrorMessage(error)}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? "Tentando..." : "Tentar novamente"}
            </Button>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onRowClick={(r) => navigate({ to: "/ordens/$id", params: { id: r.id } })}
        />
      )}
    </div>
  );
}
