import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { FormSelect } from "@/components/common/FormSelect";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { profilesService, dashboardConfigService } from "@/services/admin";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/dashboard-perfil")({ component: DashboardPerfilPage });

function DashboardPerfilPage() {
  const { data: profiles, isLoading: lp } = useQuery({ queryKey: ["admin-profiles"], queryFn: profilesService.list });
  const { data: cards, isLoading: lc } = useQuery({ queryKey: ["dash-cards"], queryFn: dashboardConfigService.cards });
  const [profileId, setProfileId] = useState("1");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  if (lp || lc) return <LoadingState />;

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div>
      <PageHeader
        title="Dashboard por Perfil"
        description="Defina quais cards e gráficos cada perfil pode visualizar"
        actions={<Button onClick={() => toast.success("Configuração salva")}>Salvar</Button>}
      />
      <Card className="mb-4">
        <CardContent className="pt-6 max-w-md">
          <FormSelect
            label="Perfil"
            value={profileId}
            onValueChange={setProfileId}
            options={(profiles ?? []).map((p) => ({ label: p.nome, value: p.id }))}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(cards ?? []).map((c) => (
            <Label key={c.id} className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/40">
              <Checkbox checked={!!selected[c.id]} onCheckedChange={() => toggle(c.id)} />
              <div className="flex-1">
                <div className="font-medium text-sm">{c.nome}</div>
                <div className="text-xs text-muted-foreground capitalize">{c.tipo}</div>
              </div>
            </Label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
