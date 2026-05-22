import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterPanel } from "@/components/common/FilterPanel";
import { mockServicos } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/servicos")({ component: ServicosPage });

type Servico = (typeof mockServicos)[number];

function ServicosPage() {
  const [search, setSearch] = useState("");
  const data = useMemo(
    () => mockServicos.filter((s) => s.nome.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const columns: Column<Servico>[] = [
    { key: "codigo", header: "Código", cell: (r) => <span className="font-mono text-xs">{r.codigo}</span> },
    { key: "nome", header: "Nome", cell: (r) => <span className="font-medium">{r.nome}</span> },
    { key: "duracao", header: "Duração estimada", cell: (r) => r.duracao },
    { key: "valor", header: "Valor", className: "text-right", cell: (r) => `R$ ${r.valor.toLocaleString("pt-BR")}` },
  ];
  return (
    <div>
      <PageHeader title="Serviços" description="Catálogo de serviços" actions={<Button><Plus className="size-4" /> Novo serviço</Button>} />
      <FilterPanel search={search} onSearchChange={setSearch} placeholder="Buscar serviço..." />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
