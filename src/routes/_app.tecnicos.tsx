import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterPanel } from "@/components/common/FilterPanel";
import { Badge } from "@/components/ui/badge";
import { mockTecnicos } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/tecnicos")({ component: TecnicosPage });

type Tecnico = (typeof mockTecnicos)[number];

function TecnicosPage() {
  const [search, setSearch] = useState("");
  const data = useMemo(
    () => mockTecnicos.filter((t) => t.nome.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const columns: Column<Tecnico>[] = [
    { key: "nome", header: "Nome", cell: (r) => <span className="font-medium">{r.nome}</span> },
    { key: "esp", header: "Especialidade", cell: (r) => r.especialidade },
    { key: "email", header: "E-mail", cell: (r) => r.email },
    { key: "telefone", header: "Telefone", cell: (r) => r.telefone },
    { key: "ativo", header: "Status", cell: (r) => r.ativo ? <Badge className="bg-success/15 text-success border-success/30" variant="outline">Ativo</Badge> : <Badge variant="outline">Inativo</Badge> },
  ];
  return (
    <div>
      <PageHeader title="Técnicos" description="Equipe de técnicos" actions={<Button><Plus className="size-4" /> Novo técnico</Button>} />
      <FilterPanel search={search} onSearchChange={setSearch} placeholder="Buscar técnico..." />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
