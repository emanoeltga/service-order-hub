/**
 * Camada de services do módulo Administração.
 *
 * Endpoints esperados no backend:
 *   GET/POST/PUT/DELETE  /api/users
 *   GET/POST/PUT/DELETE  /api/access-profiles
 *   GET/PUT              /api/permissions
 *   GET/POST/PUT/DELETE  /api/menus
 *   GET/PUT              /api/dashboard-profile-configs
 *   GET/PUT              /api/dashboard-user-configs
 *   GET/PUT              /api/system-settings
 *   GET/PUT              /api/ai/settings
 *   POST                 /api/ai/test-connection
 *   GET/POST/PUT/DELETE  /api/ai/knowledge-base
 *
 * Enquanto o backend não está pronto, as funções retornam dados de
 * `src/lib/admin-mock.ts`. Para integrar, basta substituir o corpo de
 * cada função por uma chamada `api.get/post/put/delete(...)`.
 */
import axios from "axios";
import {
  mockUsers, mockProfiles, mockMenus, mockDashboardCards,
  mockProfileDashboards, mockUserDashboards, mockSystemSettings,
  mockAiSettings, mockKnowledgeBase,
  type AdminUser, type AccessProfile, type MenuItem,
  type DashboardProfileConfig, type DashboardUserConfig,
  type SystemSettings, type AiSettings, type KnowledgeItem,
} from "@/lib/admin-mock";
import { getApiBaseUrl, pushLog } from "@/lib/api-config";

export const api = axios.create({ baseURL: getApiBaseUrl() });

// Atualiza baseURL a cada request, permitindo trocar em tempo de execução.
api.interceptors.request.use((cfg) => {
  cfg.baseURL = getApiBaseUrl();
  pushLog("debug", `HTTP ${cfg.method?.toUpperCase()} ${cfg.baseURL}${cfg.url ?? ""}`);
  return cfg;
});
api.interceptors.response.use(
  (res) => res,
  (err) => {
    pushLog("error", `HTTP error: ${err?.message ?? "unknown"}`, {
      url: err?.config?.url, status: err?.response?.status,
    });
    return Promise.reject(err);
  },
);

const delay = <T>(data: T, ms = 250) =>
  new Promise<T>((r) => setTimeout(() => r(data), ms));

// Usuários
export const usersService = {
  list: () => delay(mockUsers),
  create: (u: Omit<AdminUser, "id" | "criadoEm">) =>
    delay({ ...u, id: crypto.randomUUID(), criadoEm: new Date().toISOString().slice(0, 10) }),
  update: (u: AdminUser) => delay(u),
  remove: (id: string) => delay(id),
};

// Perfis de acesso
export const profilesService = {
  list: () => delay(mockProfiles),
  save: (p: AccessProfile) => delay(p),
};

// Permissões
export const permissionsService = {
  getByProfile: (_profileId: string) => delay({}),
  save: (_profileId: string, _data: unknown) => delay(true),
};

// Menus
export const menusService = {
  list: () => delay(mockMenus),
  save: (m: MenuItem) => delay(m),
};

// Dashboard por perfil/usuário
export const dashboardConfigService = {
  cards: () => delay(mockDashboardCards),
  listByProfile: () => delay(mockProfileDashboards),
  saveProfile: (c: DashboardProfileConfig) => delay(c),
  listByUser: () => delay(mockUserDashboards),
  saveUser: (c: DashboardUserConfig) => delay(c),
};

// Configurações do sistema
export const systemSettingsService = {
  get: () => delay(mockSystemSettings),
  save: (s: SystemSettings) => delay(s),
};

// IA
export const aiSettingsService = {
  get: () => delay(mockAiSettings),
  save: (s: AiSettings) => delay(s),
  testConnection: () => delay({ ok: true, latencyMs: 312 }),
};

// Base de conhecimento
export const knowledgeService = {
  list: () => delay(mockKnowledgeBase),
  save: (k: KnowledgeItem) => delay(k),
  remove: (id: string) => delay(id),
};
