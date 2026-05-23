import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { FormTextarea } from "@/components/common/FormTextarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { aiSettingsService } from "@/services/admin";
import type { AiSettings } from "@/lib/admin-mock";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/ia")({ component: IaPage });

function IaPage() {
  const { data, isLoading } = useQuery({ queryKey: ["ai-settings"], queryFn: aiSettingsService.get });
  const [form, setForm] = useState<AiSettings | null>(null);

  useEffect(() => { if (data) setForm(data); }, [data]);
  if (isLoading || !form) return <LoadingState />;

  const update = <K extends keyof AiSettings>(k: K, v: AiSettings[K]) => setForm({ ...form, [k]: v });

  const testar = async () => {
    const r = await aiSettingsService.testConnection();
    toast.success(`Conexão OK (${r.latencyMs}ms)`);
  };

  return (
    <div>
      <PageHeader
        title="Configuração da IA"
        description="Configure a integração com provedores de IA"
        actions={
          <>
            <Button variant="outline" onClick={testar}>Testar conexão</Button>
            <Button onClick={() => toast.success("Configuração salva")}>Salvar</Button>
          </>
        }
      />
      <Card>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 md:col-span-2">
            <Switch checked={form.ativa} onCheckedChange={(v) => update("ativa", v)} />
            <Label>IA ativa</Label>
          </div>
          <FormSelect
            label="Provedor"
            value={form.provedor}
            onValueChange={(v) => update("provedor", v)}
            options={[
              { label: "OpenAI", value: "OpenAI" },
              { label: "Anthropic", value: "Anthropic" },
              { label: "Google Gemini", value: "Google" },
              { label: "Lovable AI Gateway", value: "Lovable" },
            ]}
          />
          <FormInput label="Modelo" value={form.modelo} onChange={(e) => update("modelo", e.target.value)} />
          <FormInput label="URL da API" value={form.urlApi} onChange={(e) => update("urlApi", e.target.value)} />
          <FormInput label="Chave/API Token" type="password" placeholder="••••••••"
            value={form.apiKey} onChange={(e) => update("apiKey", e.target.value)} />
          <FormInput label="Limite de tokens" type="number"
            value={form.limiteTokens} onChange={(e) => update("limiteTokens", Number(e.target.value))} />
          <FormInput label="Temperatura" type="number" step="0.1" min="0" max="2"
            value={form.temperatura} onChange={(e) => update("temperatura", Number(e.target.value))} />
          <div className="md:col-span-2">
            <FormTextarea label="Prompt padrão do assistente" rows={5}
              value={form.promptPadrao} onChange={(e) => update("promptPadrao", e.target.value)} />
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <Switch checked={form.usarBaseConhecimento} onCheckedChange={(v) => update("usarBaseConhecimento", v)} />
            <Label>Usar base de conhecimento</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
