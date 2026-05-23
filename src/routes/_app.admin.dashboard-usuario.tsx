import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { FormSelect } from "@/components/common/FormSelect";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { usersService, dashboardConfigService } from "@/services/admin";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/dashboard-usuario")({ component: DashboardUsuarioPage });

function DashboardUsuarioPage() {
  const { data: users, isLoading: lu } = useQuery({ queryKey: ["admin-users"], queryFn: usersService.list });
  const { data: cards, isLoading: lc } = useQuery({ queryKey: ["dash-cards"], queryFn: dashboardConfigService.cards });
  const [userId, setUserId] = useState("1");
  const [ativo, setAtivo] = useState(true);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  if (lu || lc) return <LoadingState />;

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const itens = cards ?? [];
  const onlyCards = itens.filter((c) => c.tipo === "card");
  const onlyGraphs = itens.filter((c) => c.tipo === "grafico");

  return (
    <div>
      <PageHeader
        title="Dashboard por Usuário"
        description="Personalize os componentes visíveis para cada usuário"
        actions={<Button onClick={() => toast.success("Configuração salva")}>Salvar</Button>}
      />
      <Card className="mb-4">
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Usuário"
            value={userId}
            onValueChange={setUserId}
            options={(users ?? []).map((u) => ({ label: u.nome, value: u.id }))}
          />
          <div className="flex items-center gap-3 pt-7">
            <Switch checked={ativo} onCheckedChange={setAtivo} />
            <Label>Configuração ativa</Label>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Cards visíveis</h3>
            <div className="space-y-2">
              {onlyCards.map((c) => (
                <Label key={c.id} className="flex items-center gap-3 p-2 border rounded-md cursor-pointer hover:bg-muted/40">
                  <Checkbox checked={!!selected[c.id]} onCheckedChange={() => toggle(c.id)} />
                  <span className="text-sm">{c.nome}</span>
                </Label>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Gráficos visíveis</h3>
            <div className="space-y-2">
              {onlyGraphs.map((c) => (
                <Label key={c.id} className="flex items-center gap-3 p-2 border rounded-md cursor-pointer hover:bg-muted/40">
                  <Checkbox checked={!!selected[c.id]} onCheckedChange={() => toggle(c.id)} />
                  <span className="text-sm">{c.nome}</span>
                </Label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
