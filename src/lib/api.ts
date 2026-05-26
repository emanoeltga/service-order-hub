// Client HTTP central. Todos os services devem importar `api` daqui.
// A baseURL é resolvida dinamicamente a partir da URL salva no localStorage.

import axios from "axios";
import { getApiBaseUrl, pushLog } from "@/lib/api-config";

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  // Sempre revalida a baseURL (permite trocar em tempo de execução)
  config.baseURL = getApiBaseUrl();

  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  pushLog("debug", `HTTP ${config.method?.toUpperCase()} ${config.baseURL}${config.url ?? ""}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    pushLog("error", "Erro HTTP", {
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    return Promise.reject(error);
  },
);

/**
 * Testa se o servidor configurado está respondendo.
 * 401/403 são tratados como "servidor encontrado" (apenas exige login).
 */
export async function testApiConnection(): Promise<{ ok: boolean; message: string }> {
  const tryPath = async (path: string) => {
    try {
      await api.get(path, { timeout: 8000 });
      return { ok: true, status: 200 };
    } catch (err: unknown) {
      const e = err as { response?: { status?: number }; code?: string };
      return { ok: false, status: e.response?.status, code: e.code };
    }
  };

  const a = await tryPath("/auth/me");
  if (a.ok) return { ok: true, message: "Servidor conectado" };
  if (a.status === 401 || a.status === 403) {
    return { ok: true, message: "Servidor encontrado. Faça login para continuar." };
  }
  if (a.status === 404) {
    const b = await tryPath("/companies");
    if (b.ok) return { ok: true, message: "Servidor conectado" };
    if (b.status === 401 || b.status === 403) {
      return { ok: true, message: "Servidor encontrado. Faça login para continuar." };
    }
  }
  return { ok: false, message: "Não foi possível conectar ao servidor." };
}
