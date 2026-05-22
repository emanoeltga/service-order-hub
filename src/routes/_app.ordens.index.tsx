import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterPanel } from "@/components/common/FilterPanel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { mockOS, type OrdemServico } from "@/lib/mock-data";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/ordens/")({ component: OrdensPage });

function OrdensPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const data = useMemo(() =>
    mockOS.filter((o) =>
      [o.numero, o.titulo, o.cliente, o.tecnico].join(" ").toLowerCase().includes(search.toLowerCase()),
    ), [search]);

  const columns: Column<OrdemServico>[] = [
    { key: "numero", header: "Número", cell: (r) => <span className="font-medium">{r.numero}</span> },
    { key: "titulo", header: "Título", cell: (r) => r.titulo },
    { key: "cliente", header: "Cliente", cell: (r) => r.cliente },
    { key: "tecnico", header: "Técnico", cell: (r) => r.tecnico },
    { key: "prioridade", header: "Prioridade", cell: (r) => <PriorityBadge priority={r.prioridade} /> },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "prazo", header: "Prazo", cell: (r) => format(new Date(r.prazo), "dd/MM/yyyy") },
    { key: "valor", header: "Valor", className: "text-right", cell: (r) => `R$ ${r.valor.toLocaleString("pt-BR")}` },
  ];

  return (
    <div>
      <PageHeader
        title="Ordens de Serviço"
        description="Gerencie todas as ordens de serviço"
        actions={<Button asChild><Link to="/ordens/nova"><Plus className="size-4" /> Nova OS</Link></Button>}
      />
      <FilterPanel search={search} onSearchChange={setSearch} placeholder="Buscar por número, título, cliente..." />
      <DataTable
        columns={columns}
        data={data}
        onRowClick={(r) => navigate({ to: "/ordens/$id", params: { id: r.id } })}
      />
    </div>
  );
}
