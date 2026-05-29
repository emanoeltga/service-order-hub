import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { LoadingState } from "@/components/common/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Clock, CheckCircle2, DollarSign, Plus, AlertTriangle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { dashboardService, osService, getApiErrorMessage } from "@/services/os";

export const Route = createFileRoute("/_app/")({ component: Dashboard });

const COLORS = ["var(--info)", "var(--primary)", "var(--warning)", "var(--success)"];

function Dashboard() {
  const summary = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardService.summary,
  });

  const recentQuery = useQuery({
    queryKey: ["service-orders"],
    queryFn: osService.list,
  });

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral das operações"
        actions={
          <Button asChild>
            <Link to="/ordens/nova"><Plus className="size-4" /> Nova OS</Link>
          </Button>
        }
      />

      {summary.isLoading ? (
        <LoadingState />
      ) : summary.error ? (
        <ErrorBox message={getApiErrorMessage(summary.error)} onRetry={() => summary.refetch()} loading={summary.isFetching} />
      ) : (
        <DashboardContent data={summary.data!} />
      )}

      <Card className="mt-6">
        <CardHeader><CardTitle>OS recentes</CardTitle></CardHeader>
        <CardContent>
          {recentQuery.isLoading ? (
            <LoadingState />
          ) : recentQuery.error ? (
            <p className="text-sm text-muted-foreground">{getApiErrorMessage(recentQuery.error)}</p>
          ) : (recentQuery.data?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma OS cadastrada ainda.</p>
          ) : (
            <div className="divide-y">
              {recentQuery.data!.slice(0, 5).map((os) => (
                <Link key={os.id} to="/ordens/$id" params={{ id: os.id }} className="flex items-center justify-between py-3 hover:bg-muted/40 -mx-2 px-2 rounded">
                  <div>
                    <p className="font-medium text-sm">{os.numero} · {os.titulo}</p>
                    <p className="text-xs text-muted-foreground">{os.cliente} · {os.tecnico}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={os.prioridade} />
                    <StatusBadge status={os.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardContent({ data }: { data: NonNullable<ReturnType<typeof dashboardService.summary> extends Promise<infer T> ? T : never> }) {
  const { metrics, porStatus, evolucao } = data;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard label="OS Abertas" value={metrics.totalAbertas} icon={ClipboardList} tone="info" />
        <MetricCard label="Em andamento" value={metrics.emAndamento} icon={Clock} tone="default" />
        <MetricCard label="Concluídas no mês" value={metrics.concluidasMes} icon={CheckCircle2} tone="success" />
        <MetricCard label="Receita do mês" value={`R$ ${Number(metrics.receitaMes ?? 0).toLocaleString("pt-BR")}`} icon={DollarSign} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Evolução mensal</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evolucao}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="abertas" fill="var(--primary)" name="Abertas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="concluidas" fill="var(--success)" name="Concluídas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Status das OS</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={porStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {porStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ErrorBox({ message, onRetry, loading }: { message: string; onRetry: () => void; loading: boolean }) {
  return (
    <div className="rounded-lg border bg-card p-6 flex items-start gap-3 mb-6">
      <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium">Não foi possível carregar o dashboard</p>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry} disabled={loading}>
          {loading ? "Tentando..." : "Tentar novamente"}
        </Button>
      </div>
    </div>
  );
}
