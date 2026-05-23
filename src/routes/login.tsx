import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/FormInput";
import { HardHat } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { loginMock } from "@/lib/auth";

export const Route = createFileRoute("/login")({ component: LoginPage });

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(4, "Mínimo 4 caracteres"),
});
type FormData = z.infer<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@empresa.com", password: "admin" },
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 400));
    loginMock(data.email);
    toast.success("Bem-vindo de volta!");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto size-12 rounded-xl bg-primary flex items-center justify-center mb-2">
            <HardHat className="size-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">OS Control</CardTitle>
          <CardDescription>Acesse sua conta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput label="E-mail" type="email" placeholder="seu@email.com"
              {...register("email")} error={errors.email?.message} />
            <FormInput label="Senha" type="password" placeholder="••••••••"
              {...register("password")} error={errors.password?.message} />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Demo: admin@empresa.com / admin
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
