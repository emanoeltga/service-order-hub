import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { systemSettingsService } from "@/services/admin";
import type { SystemSettings } from "@/lib/admin-mock";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/configuracoes-sistema")({ component: ConfigSistemaPage });

function ConfigSistemaPage() {
  const { data, isLoading } = useQuery({ queryKey: ["sys-settings"], queryFn: systemSettingsService.get });
  const [form, setForm] = useState<SystemSettings | null>(null);

  useEffect(() => { if (data) setForm(data); }, [data]);
  if (isLoading || !form) return <LoadingState />;

  const update = <K extends keyof SystemSettings>(k: K, v: SystemSettings[K]) =>
    setForm({ ...form, [k]: v });

  return (
    <div>
      <PageHeader
        title="Configurações do Sistema"
        description="Parâmetros globais da aplicação"
        actions={<Button onClick={() => toast.success("Configurações salvas")}>Salvar</Button>}
      />
      <Card>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Nome do sistema" value={form.nomeSistema} onChange={(e) => update("nomeSistema", e.target.value)} />
          <FormInput label="URL base da API" value={form.urlApi} onChange={(e) => update("urlApi", e.target.value)} />
          <FormSelect
            label="Ambiente"
            value={form.ambiente}
            onValueChange={(v) => update("ambiente", v as SystemSettings["ambiente"])}
            options={[
              { label: "Produção", value: "producao" },
              { label: "Homologação", value: "homologacao" },
              { label: "Desenvolvimento", value: "desenvolvimento" },
            ]}
          />
          <FormSelect
            label="Tema padrão"
            value={form.tema}
            onValueChange={(v) => update("tema", v as SystemSettings["tema"])}
            options={[
              { label: "Claro", value: "claro" },
              { label: "Escuro", value: "escuro" },
              { label: "Automático", value: "auto" },
            ]}
          />
          <FormInput label="Tempo limite de OS aberta (h)" type="number"
            value={form.tempoLimiteOs} onChange={(e) => update("tempoLimiteOs", Number(e.target.value))} />
          <FormInput label="Tempo para alerta de atraso (h)" type="number"
            value={form.tempoAlertaAtraso} onChange={(e) => update("tempoAlertaAtraso", Number(e.target.value))} />
          <FormInput label="Logo do sistema (URL)" value={form.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} />
          <FormInput label="Ícone do app (URL)" value={form.iconeUrl} onChange={(e) => update("iconeUrl", e.target.value)} />
          <div className="flex items-center gap-3">
            <Switch checked={form.notificacoes} onCheckedChange={(v) => update("notificacoes", v)} />
            <Label>Ativar notificações</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.moduloIa} onCheckedChange={(v) => update("moduloIa", v)} />
            <Label>Ativar módulo IA</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
