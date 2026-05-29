/**
 * Service layer para Ordens de Serviço, Clientes, Técnicos e Dashboard.
 *
 * Endpoints esperados (REST padrão, baseURL = <server>/api):
 *   GET    /service-orders
 *   GET    /service-orders/:id
 *   POST   /service-orders
 *   PUT    /service-orders/:id
 *   DELETE /service-orders/:id
 *   GET    /dashboard/summary
 *   GET    /clients
 *   GET    /technicians
 *
 * Se o backend usar outros paths (ex.: /ordens-servico), basta ajustar
 * as constantes abaixo — todas as telas consomem essas funções.
 */
import { api } from "@/lib/api";
import type { OrdemServico } from "@/lib/mock-data";

const OS_PATH = "/service-orders";
const DASHBOARD_PATH = "/dashboard/summary";
const CLIENTS_PATH = "/clients";
const TECH_PATH = "/technicians";

export interface DashboardSummary {
  metrics: {
    totalAbertas: number;
    emAndamento: number;
    concluidasMes: number;
    receitaMes: number;
  };
  porStatus: { name: string; value: number }[];
  evolucao: { mes: string; abertas: number; concluidas: number }[];
}

export interface ClienteDTO { id: string; nome: string }
export interface TecnicoDTO { id: string; nome: string }

export const osService = {
  list: async (): Promise<OrdemServico[]> => {
    const { data } = await api.get(OS_PATH);
    return Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
  },
  get: async (id: string): Promise<OrdemServico> => {
    const { data } = await api.get(`${OS_PATH}/${id}`);
    return data?.data ?? data;
  },
  create: async (payload: Partial<OrdemServico>): Promise<OrdemServico> => {
    const { data } = await api.post(OS_PATH, payload);
    return data?.data ?? data;
  },
  update: async (id: string, payload: Partial<OrdemServico>): Promise<OrdemServico> => {
    const { data } = await api.put(`${OS_PATH}/${id}`, payload);
    return data?.data ?? data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`${OS_PATH}/${id}`);
  },
};

export const dashboardService = {
  summary: async (): Promise<DashboardSummary> => {
    const { data } = await api.get(DASHBOARD_PATH);
    return data?.data ?? data;
  },
};

export const clientesService = {
  list: async (): Promise<ClienteDTO[]> => {
    const { data } = await api.get(CLIENTS_PATH);
    return Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
  },
};

export const tecnicosService = {
  list: async (): Promise<TecnicoDTO[]> => {
    const { data } = await api.get(TECH_PATH);
    return Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
  },
};

/** Mensagem amigável para erros do axios. */
export function getApiErrorMessage(err: unknown, fallback = "Erro ao comunicar com o servidor"): string {
  const e = err as {
    response?: { status?: number; data?: { message?: string; error?: string } };
    code?: string;
    message?: string;
  };
  if (e?.response?.data?.message) return e.response.data.message;
  if (e?.response?.data?.error) return e.response.data.error;
  if (e?.response?.status) return `${fallback} (HTTP ${e.response.status})`;
  if (e?.code === "ERR_NETWORK") return "Servidor inacess\u00edvel. Verifique a URL configurada no login.";
  if (e?.message) return e.message;
  return fallback;
}
