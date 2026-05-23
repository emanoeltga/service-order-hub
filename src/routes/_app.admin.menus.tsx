import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterPanel } from "@/components/common/FilterPanel";
import { LoadingState } from "@/components/common/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { menusService } from "@/services/admin";
import type { MenuItem } from "@/lib/admin-mock";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/menus")({ component: MenusPage });

function MenusPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["admin-menus"], queryFn: menusService.list });
  const filtered = (data ?? []).filter((m) =>
    [m.nome, m.rota, m.grupo].join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<MenuItem>[] = [
    { key: "nome", header: "Nome", cell: (r) => <span className="font-medium">{r.nome}</span> },
    { key: "rota", header: "Rota", cell: (r) => <code className="text-xs">{r.rota}</code> },
    { key: "icone", header: "Ícone", cell: (r) => r.icone },
    { key: "grupo", header: "Grupo", cell: (r) => <Badge variant="secondary">{r.grupo}</Badge> },
    { key: "ordem", header: "Ordem", cell: (r) => r.ordem },
    { key: "permissao", header: "Permissão", cell: (r) => r.permissao },
    { key: "visivel", header: "Visível", cell: (r) => (
      <Badge variant={r.visivel ? "default" : "outline"}>{r.visivel ? "Sim" : "Não"}</Badge>
    )},
    { key: "status", header: "Status", cell: (r) => (
      <Badge variant={r.status === "ativo" ? "default" : "outline"}>{r.status}</Badge>
    )},
    { key: "acoes", header: "Ações", cell: (r) => (
      <Button size="sm" variant="outline" onClick={() => toast.info(`Editar ${r.nome}`)}>Editar</Button>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Menus e Telas"
        description="Configure dinamicamente os menus disponíveis no sistema"
        actions={<Button onClick={() => toast.info("Novo menu")}><Plus className="size-4" /> Novo Menu</Button>}
      />
      <FilterPanel search={search} onSearchChange={setSearch} placeholder="Buscar menu..." />
      {isLoading ? <LoadingState /> : <DataTable columns={columns} data={filtered} />}
    </div>
  );
}
