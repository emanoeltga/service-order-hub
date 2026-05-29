import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { FormTextarea } from "@/components/common/FormTextarea";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockClientes, mockTecnicos } from "@/lib/mock-data";
import { toast } from "sonner";
import { osService, clientesService, tecnicosService, getApiErrorMessage } from "@/services/os";

export const Route = createFileRoute("/_app/ordens/nova")({ component: NovaOSPage });

const schema = z.object({
  titulo: z.string().min(3, "Título obrigatório"),
  cliente: z.string().min(1, "Selecione um cliente"),
  tecnico: z.string().min(1, "Selecione um técnico"),
  prioridade: z.string().min(1),
  prazo: z.string().min(1, "Informe o prazo"),
  valor: z.coerce.number().min(0),
  descricao: z.string().min(5, "Descreva o serviço"),
});
type FormData = z.infer<typeof schema>;

function NovaOSPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Tenta buscar do backend; se falhar (404 etc), cai para mocks só pra UI não travar
  const { data: clientes } = useQuery({
    queryKey: ["clients"],
    queryFn: clientesService.list,
    retry: false,
  });
  const { data: tecnicos } = useQuery({
    queryKey: ["technicians"],
    queryFn: tecnicosService.list,
    retry: false,
  });

  const clientesOpts = (clientes && clientes.length > 0 ? clientes : mockClientes).map((c) => ({ label: c.nome, value: c.nome }));
  const tecnicosOpts = (tecnicos && tecnicos.length > 0 ? tecnicos : mockTecnicos).map((t) => ({ label: t.nome, value: t.nome }));

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { prioridade: "media", valor: 0 },
  });

  const createMutation = useMutation({
    mutationFn: (payload: FormData) =>
      osService.create({
        titulo: payload.titulo,
        cliente: payload.cliente,
        tecnico: payload.tecnico,
        prioridade: payload.prioridade as OrdemServicoPriority,
        prazo: payload.prazo,
        valor: payload.valor,
        descricao: payload.descricao,
        status: "aberta",
      }),
    onSuccess: () => {
      toast.success("Ordem de Serviço criada");
      queryClient.invalidateQueries({ queryKey: ["service-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      navigate({ to: "/ordens" });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Falha ao criar OS"));
    },
  });

  return (
    <div>
      <PageHeader title="Nova Ordem de Serviço" description="Preencha os dados para abrir uma nova OS" />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
            <FormInput label="Título" placeholder="Ex: Manutenção do servidor" {...register("titulo")} error={errors.titulo?.message} />
            <div className="grid gap-4 md:grid-cols-2">
              <Controller name="cliente" control={control} render={({ field }) => (
                <FormSelect label="Cliente" value={field.value} onValueChange={field.onChange}
                  options={clientesOpts} error={errors.cliente?.message} />
              )} />
              <Controller name="tecnico" control={control} render={({ field }) => (
                <FormSelect label="Técnico responsável" value={field.value} onValueChange={field.onChange}
                  options={tecnicosOpts} error={errors.tecnico?.message} />
              )} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Controller name="prioridade" control={control} render={({ field }) => (
                <FormSelect label="Prioridade" value={field.value} onValueChange={field.onChange}
                  options={[
                    { label: "Baixa", value: "baixa" },
                    { label: "Média", value: "media" },
                    { label: "Alta", value: "alta" },
                    { label: "Urgente", value: "urgente" },
                  ]} />
              )} />
              <FormInput label="Prazo" type="date" {...register("prazo")} error={errors.prazo?.message} />
              <FormInput label="Valor (R$)" type="number" step="0.01" {...register("valor")} error={errors.valor?.message} />
            </div>
            <FormTextarea label="Descrição" rows={5} placeholder="Descreva o serviço a ser executado..."
              {...register("descricao")} error={errors.descricao?.message} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate({ to: "/ordens" })}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Salvando..." : "Criar OS"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

type OrdemServicoPriority = "baixa" | "media" | "alta" | "urgente";
