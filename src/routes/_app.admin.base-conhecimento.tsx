import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterPanel } from "@/components/common/FilterPanel";
import { LoadingState } from "@/components/common/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Power, Trash2 } from "lucide-react";
import { knowledgeService } from "@/services/admin";
import type { KnowledgeItem } from "@/lib/admin-mock";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/base-conhecimento")({ component: BaseConhecimentoPage });

function BaseConhecimentoPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["kb"], queryFn: knowledgeService.list });
  const filtered = (data ?? []).filter((k) =>
    [k.titulo, k.categoria, k.tags.join(" ")].join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  const indexColor: Record<KnowledgeItem["indexacao"], "default" | "secondary" | "outline" | "destructive"> = {
    indexado: "default", pendente: "secondary", erro: "destructive",
  };

  const columns: Column<KnowledgeItem>[] = [
    { key: "titulo", header: "Título", cell: (r) => <span className="font-medium">{r.titulo}</span> },
    { key: "categoria", header: "Categoria", cell: (r) => <Badge variant="secondary">{r.categoria}</Badge> },
    { key: "tags", header: "Tags", cell: (r) => (
      <div className="flex gap-1 flex-wrap">{r.tags.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div>
    )},
    { key: "indexacao", header: "Indexação", cell: (r) => <Badge variant={indexColor[r.indexacao]}>{r.indexacao}</Badge> },
    { key: "status", header: "Status", cell: (r) => (
      <Badge variant={r.status === "ativo" ? "default" : "outline"}>{r.status}</Badge>
    )},
    { key: "atualizadoEm", header: "Atualizado", cell: (r) => new Date(r.atualizadoEm).toLocaleDateString("pt-BR") },
    { key: "acoes", header: "Ações", cell: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => toast.info(`Editar ${r.titulo}`)}>Editar</Button>
        <Button size="sm" variant="ghost" onClick={() => toast.success(`Status alternado`)}><Power className="size-4" /></Button>
        <Button size="sm" variant="ghost" onClick={() => toast.error(`Removido`)}><Trash2 className="size-4" /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Base de Conhecimento IA"
        description="Conteúdos usados pela IA para responder com contexto da empresa"
        actions={
          <>
            <Button variant="outline" onClick={() => toast.info("Upload em breve")}>Upload</Button>
            <Button onClick={() => toast.info("Novo conteúdo")}><Plus className="size-4" /> Novo</Button>
          </>
        }
      />
      <FilterPanel search={search} onSearchChange={setSearch} placeholder="Buscar por título, categoria, tag..." />
      {isLoading ? <LoadingState /> : <DataTable columns={columns} data={filtered} />}
    </div>
  );
}
