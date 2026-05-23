import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterPanel } from "@/components/common/FilterPanel";
import { LoadingState } from "@/components/common/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Power } from "lucide-react";
import { profilesService } from "@/services/admin";
import type { AccessProfile } from "@/lib/admin-mock";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/perfis")({ component: PerfisPage });

function PerfisPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["admin-profiles"], queryFn: profilesService.list });
  const filtered = (data ?? []).filter((p) =>
    [p.nome, p.descricao].join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<AccessProfile>[] = [
    { key: "nome", header: "Perfil", cell: (r) => <span className="font-medium">{r.nome}</span> },
    { key: "descricao", header: "Descrição", cell: (r) => r.descricao },
    { key: "status", header: "Status", cell: (r) => (
      <Badge variant={r.status === "ativo" ? "default" : "outline"}>{r.status}</Badge>
    )},
    { key: "acoes", header: "Ações", cell: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => toast.info(`Editar ${r.nome}`)}>Editar</Button>
        <Button size="sm" variant="ghost" onClick={() => toast.success(`${r.nome} alternado`)}>
          <Power className="size-4" />
        </Button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Perfis de Acesso"
        description="Defina perfis que controlam o acesso ao sistema"
        actions={<Button onClick={() => toast.info("Novo perfil")}><Plus className="size-4" /> Novo Perfil</Button>}
      />
      <FilterPanel search={search} onSearchChange={setSearch} placeholder="Buscar perfil..." />
      {isLoading ? <LoadingState /> : <DataTable columns={columns} data={filtered} />}
    </div>
  );
}
