import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { mockOS, type OrdemServico } from "@/lib/mock-data";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/aprovacoes")({ component: AprovacoesPage });

function AprovacoesPage() {
  const data = mockOS.filter((o) => o.status === "aguardando" || o.status === "aberta");

  const columns: Column<OrdemServico>[] = [
    { key: "numero", header: "Número", cell: (r) => <span className="font-medium">{r.numero}</span> },
    { key: "titulo", header: "Título", cell: (r) => r.titulo },
    { key: "cliente", header: "Cliente", cell: (r) => r.cliente },
    { key: "valor", header: "Valor", cell: (r) => `R$ ${r.valor.toLocaleString("pt-BR")}` },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: "acoes", header: "Ações", className: "text-right",
      cell: () => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); toast.success("Aprovado"); }}>
            <Check className="size-4" /> Aprovar
          </Button>
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); toast.error("Rejeitado"); }}>
            <X className="size-4" /> Rejeitar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Aprovações" description="OS aguardando aprovação" />
      <DataTable columns={columns} data={data} emptyTitle="Nenhuma OS pendente de aprovação" />
    </div>
  );
}
