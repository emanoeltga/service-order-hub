import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/FormInput";
import { HardHat, Server, CheckCircle2, XCircle, Loader2, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { loginMock } from "@/lib/auth";
import { useRef, useState } from "react";
import { ApiUrlDialog } from "@/components/admin/ApiUrlDialog";
import {
  getApiServerUrl, setApiServerUrl, normalizeServerUrl,
} from "@/lib/api-config";
import { testApiConnection } from "@/lib/api";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const Route = createFileRoute("/login")({ component: LoginPage });

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(4, "Mínimo 4 caracteres"),
});
type FormData = z.infer<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const [apiDialogOpen, setApiDialogOpen] = useState(false);
  const [serverUrl, setServerUrl] = useState(getApiServerUrl());
  const [urlError, setUrlError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [serverOpen, setServerOpen] = useState(false);
  const savedUrl = getApiServerUrl();

  const clicksRef = useRef<{ count: number; timer: ReturnType<typeof setTimeout> | null }>({
    count: 0, timer: null,
  });

  const handleLogoClick = () => {
    clicksRef.current.count += 1;
    if (clicksRef.current.timer) clearTimeout(clicksRef.current.timer);
    clicksRef.current.timer = setTimeout(() => { clicksRef.current.count = 0; }, 1500);
    if (clicksRef.current.count >= 5) {
      clicksRef.current.count = 0;
      setApiDialogOpen(true);
    }
  };

  const handleSaveUrl = () => {
    setUrlError(null);
    try {
      const normalized = normalizeServerUrl(serverUrl);
      setApiServerUrl(normalized);
      setServerUrl(normalized);
      toast.success("URL do servidor salva");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "URL inválida";
      setUrlError(msg);
      toast.error(msg);
    }
  };

  const handleTestConnection = async () => {
    setUrlError(null);
    setTestResult(null);
    // garante que a URL digitada está salva antes do teste
    try {
      const normalized = normalizeServerUrl(serverUrl);
      setApiServerUrl(normalized);
      setServerUrl(normalized);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "URL inválida";
      setUrlError(msg);
      return;
    }
    setTesting(true);
    const result = await testApiConnection();
    setTesting(false);
    setTestResult(result);
    result.ok ? toast.success(result.message) : toast.error(result.message);
  };

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
          <button
            type="button"
            onClick={handleLogoClick}
            aria-label="OS Control"
            className="mx-auto size-12 rounded-xl bg-primary flex items-center justify-center mb-2 select-none cursor-pointer"
          >
            <HardHat className="size-6 text-primary-foreground" />
          </button>
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

          {/* Configuração do servidor */}
          <Collapsible open={serverOpen} onOpenChange={setServerOpen} className="mt-6">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border bg-muted/30 hover:bg-muted/60 transition-colors text-xs"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Server className="size-3.5" />
                  Servidor:
                  <span className="font-mono text-foreground truncate max-w-[220px]">
                    {savedUrl}
                  </span>
                </span>
                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform ${serverOpen ? "rotate-180" : ""}`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-3">
              <FormInput
                label="URL do servidor"
                placeholder="https://exemplo.trycloudflare.com"
                value={serverUrl}
                onChange={(e) => { setServerUrl(e.target.value); setUrlError(null); setTestResult(null); }}
                error={urlError ?? undefined}
              />
              <p className="text-[11px] text-muted-foreground -mt-1">
                Pode incluir ou não <code>/api</code> — o sistema normaliza automaticamente.
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={handleSaveUrl}>
                  Salvar URL
                </Button>
                <Button type="button" variant="secondary" className="flex-1" onClick={handleTestConnection} disabled={testing}>
                  {testing ? <Loader2 className="size-4 animate-spin" /> : null}
                  Testar conexão
                </Button>
              </div>
              {testResult && (
                <div className={`flex items-start gap-2 rounded-md border p-2 text-xs ${
                  testResult.ok ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-destructive/40 bg-destructive/10 text-destructive"
                }`}>
                  {testResult.ok
                    ? <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                    : <XCircle className="size-4 shrink-0 mt-0.5" />}
                  <span>{testResult.message}</span>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
      <ApiUrlDialog open={apiDialogOpen} onOpenChange={setApiDialogOpen} />
      {/* Acesso discreto aos logs */}
      <button
        type="button"
        onClick={() => navigate({ to: "/admin/logs" })}
        aria-label="Logs"
        title="Logs"
        className="fixed bottom-2 right-2 size-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/60 transition-colors"
      />
    </div>
  );
}
