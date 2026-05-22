import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterPanel } from "@/components/common/FilterPanel";
import { mockClientes } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/clientes")({ component: ClientesPage });

type Cliente = (typeof mockClientes)[number];

function ClientesPage() {
  const [search, setSearch] = useState("");
  const data = useMemo(
    () => mockClientes.filter((c) => c.nome.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const columns: Column<Cliente>[] = [
    { key: "nome", header: "Nome", cell: (r) => <span className="font-medium">{r.nome}</span> },
    { key: "cnpj", header: "CNPJ", cell: (r) => r.cnpj },
    { key: "email", header: "E-mail", cell: (r) => r.email },
    { key: "telefone", header: "Telefone", cell: (r) => r.telefone },
    { key: "cidade", header: "Cidade", cell: (r) => r.cidade },
  ];
  return (
    <div>
      <PageHeader title="Clientes" description="Gerencie a base de clientes" actions={<Button><Plus className="size-4" /> Novo cliente</Button>} />
      <FilterPanel search={search} onSearchChange={setSearch} placeholder="Buscar cliente..." />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
