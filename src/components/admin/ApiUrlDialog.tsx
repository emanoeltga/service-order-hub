import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/FormInput";
import { getApiBaseUrl, setApiBaseUrl, clearApiBaseUrl, DEFAULT_API_URL } from "@/lib/api-config";
import { toast } from "sonner";
import { ScrollText } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiUrlDialog({ open, onOpenChange }: Props) {
  const [url, setUrl] = useState(DEFAULT_API_URL);
  const navigate = useNavigate();

  useEffect(() => { if (open) setUrl(getApiBaseUrl()); }, [open]);

  const handleSave = () => {
    try {
      // Valida formato
      new URL(url);
    } catch {
      toast.error("URL inválida");
      return;
    }
    setApiBaseUrl(url);
    toast.success("URL do backend salva. Será usada em todas as conexões.");
    onOpenChange(false);
  };

  const handleReset = () => {
    clearApiBaseUrl();
    setUrl(DEFAULT_API_URL);
    toast.info("URL restaurada para o padrão");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configuração do Servidor</DialogTitle>
          <DialogDescription>
            Defina a URL base do backend. Esta configuração ficará salva neste dispositivo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <FormInput
            label="URL do servidor (API)"
            placeholder="https://api.suaempresa.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="button"
            onClick={() => { onOpenChange(false); navigate({ to: "/admin/logs" }); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ScrollText className="size-3.5" />
            Ver logs do sistema
          </button>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleReset}>Restaurar padrão</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
