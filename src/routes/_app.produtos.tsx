import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterPanel } from "@/components/common/FilterPanel";
import { mockProdutos } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/produtos")({ component: ProdutosPage });

type Produto = (typeof mockProdutos)[number];

function ProdutosPage() {
  const [search, setSearch] = useState("");
  const data = useMemo(
    () => mockProdutos.filter((p) => p.nome.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const columns: Column<Produto>[] = [
    { key: "codigo", header: "Código", cell: (r) => <span className="font-mono text-xs">{r.codigo}</span> },
    { key: "nome", header: "Nome", cell: (r) => <span className="font-medium">{r.nome}</span> },
    { key: "categoria", header: "Categoria", cell: (r) => r.categoria },
    { key: "preco", header: "Preço", className: "text-right", cell: (r) => `R$ ${r.preco.toLocaleString("pt-BR")}` },
    { key: "estoque", header: "Estoque", className: "text-right", cell: (r) => r.estoque },
  ];
  return (
    <div>
      <PageHeader title="Produtos" description="Catálogo de produtos" actions={<Button><Plus className="size-4" /> Novo produto</Button>} />
      <FilterPanel search={search} onSearchChange={setSearch} placeholder="Buscar produto..." />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
