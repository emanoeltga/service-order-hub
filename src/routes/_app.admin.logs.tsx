import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, Download } from "lucide-react";
import { getLogs, clearLogs, type LogEntry } from "@/lib/api-config";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/logs")({ component: LogsPage });

function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const refresh = () => setLogs(getLogs());

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 2000);
    return () => clearInterval(id);
  }, []);

  const handleClear = () => {
    clearLogs();
    refresh();
    toast.success("Logs limpos");
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();
  };

  const levelColor = (l: LogEntry["level"]) =>
    l === "error" ? "destructive" : l === "warn" ? "secondary" : "outline";

  return (
    <div>
      <PageHeader
        title="Logs do Sistema"
        description="Eventos e erros capturados no frontend"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="size-4" /> Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="size-4" /> Exportar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClear}>
              <Trash2 className="size-4" /> Limpar
            </Button>
          </div>
        }
      />
      <Card>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Nenhum log registrado.
            </div>
          ) : (
            <div className="divide-y max-h-[70vh] overflow-auto font-mono text-xs">
              {logs.map((log, i) => (
                <div key={i} className="px-4 py-2 flex gap-3 items-start hover:bg-muted/40">
                  <span className="text-muted-foreground whitespace-nowrap">
                    {new Date(log.ts).toLocaleString("pt-BR")}
                  </span>
                  <Badge variant={levelColor(log.level) as never} className="uppercase text-[10px]">
                    {log.level}
                  </Badge>
                  <span className="flex-1 break-words">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
