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
import { usersService } from "@/services/admin";
import type { AdminUser } from "@/lib/admin-mock";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/usuarios")({ component: UsuariosPage });

function UsuariosPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: usersService.list });
  const filtered = (data ?? []).filter((u) =>
    [u.nome, u.email, u.login, u.perfil].join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<AdminUser>[] = [
    { key: "nome", header: "Nome", cell: (r) => <span className="font-medium">{r.nome}</span> },
    { key: "email", header: "E-mail", cell: (r) => r.email },
    { key: "login", header: "Login", cell: (r) => r.login },
    { key: "perfil", header: "Perfil", cell: (r) => <Badge variant="secondary">{r.perfil}</Badge> },
    { key: "status", header: "Status", cell: (r) => (
      <Badge variant={r.status === "ativo" ? "default" : "outline"}>{r.status}</Badge>
    )},
    { key: "criadoEm", header: "Criado em", cell: (r) => new Date(r.criadoEm).toLocaleDateString("pt-BR") },
    { key: "acoes", header: "Ações", cell: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => toast.info(`Editar ${r.nome}`)}>Editar</Button>
        <Button size="sm" variant="ghost" onClick={() => toast.success(`${r.nome}: ${r.status === "ativo" ? "inativado" : "ativado"}`)}>
          <Power className="size-4" />
        </Button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie usuários e vincule a perfis de acesso"
        actions={<Button onClick={() => toast.info("Novo usuário")}><Plus className="size-4" /> Novo Usuário</Button>}
      />
      <FilterPanel search={search} onSearchChange={setSearch} placeholder="Buscar por nome, e-mail, login..." />
      {isLoading ? <LoadingState /> : <DataTable columns={columns} data={filtered} />}
    </div>
  );
}
