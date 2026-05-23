import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { profilesService } from "@/services/admin";
import { adminModules, type PermissionKey } from "@/lib/admin-mock";
import { toast } from "sonner";

const PERMS: PermissionKey[] = ["visualizar", "criar", "editar", "excluir", "exportar", "aprovar", "configurar"];

export const Route = createFileRoute("/_app/admin/permissoes")({ component: PermissoesPage });

function PermissoesPage() {
  const { data: profiles, isLoading } = useQuery({ queryKey: ["admin-profiles"], queryFn: profilesService.list });
  const [profileId, setProfileId] = useState<string>("1");
  const [matrix, setMatrix] = useState<Record<string, Record<PermissionKey, boolean>>>(() => {
    const init: Record<string, Record<PermissionKey, boolean>> = {};
    adminModules.forEach((m) => {
      init[m] = PERMS.reduce((acc, p) => ({ ...acc, [p]: p === "visualizar" }), {} as Record<PermissionKey, boolean>);
    });
    return init;
  });

  const toggle = (mod: string, perm: PermissionKey) =>
    setMatrix((m) => ({ ...m, [mod]: { ...m[mod], [perm]: !m[mod][perm] } }));

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Permissões"
        description="Configure permissões por módulo para cada perfil"
        actions={<Button onClick={() => toast.success("Permissões salvas")}>Salvar</Button>}
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
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Módulo</TableHead>
              {PERMS.map((p) => <TableHead key={p} className="capitalize text-center">{p}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminModules.map((m) => (
              <TableRow key={m}>
                <TableCell className="font-medium">{m}</TableCell>
                {PERMS.map((p) => (
                  <TableCell key={p} className="text-center">
                    <Checkbox checked={matrix[m][p]} onCheckedChange={() => toggle(m, p)} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
