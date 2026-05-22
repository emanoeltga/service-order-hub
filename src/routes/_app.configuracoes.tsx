import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormInput } from "@/components/common/FormInput";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/configuracoes")({ component: ConfigPage });

function ConfigPage() {
  return (
    <div>
      <PageHeader title="Configurações" description="Preferências do sistema" />
      <Tabs defaultValue="geral">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
        </TabsList>
        <TabsContent value="geral">
          <Card>
            <CardHeader><CardTitle>Dados da empresa</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <FormInput label="Nome da empresa" defaultValue="Empresa Demo Ltda" />
              <FormInput label="CNPJ" defaultValue="00.000.000/0001-00" />
              <FormInput label="E-mail de contato" defaultValue="contato@empresa.com" />
              <Button>Salvar alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader><CardTitle>Preferências</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                "Notificar nova OS",
                "Notificar mudança de status",
                "Alerta de prazo crítico",
                "Resumo diário por e-mail",
              ].map((label) => (
                <div key={label} className="flex items-center justify-between border-b pb-3">
                  <Label className="font-normal">{label}</Label>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integracoes">
          <Card>
            <CardHeader><CardTitle>Integrações</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Em breve. Conecte WhatsApp, Slack e ERPs externos.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
