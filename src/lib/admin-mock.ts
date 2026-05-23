// Mocks de dados para o módulo Administração.
// Substituir por chamadas reais aos endpoints listados em src/services/admin.ts.

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  login: string;
  perfil: string;
  status: "ativo" | "inativo";
  criadoEm: string;
}

export interface AccessProfile {
  id: string;
  nome: string;
  descricao: string;
  status: "ativo" | "inativo";
}

export type PermissionKey =
  | "visualizar" | "criar" | "editar" | "excluir"
  | "exportar" | "aprovar" | "configurar";

export interface ProfilePermissions {
  profileId: string;
  modulo: string;
  permissoes: Record<PermissionKey, boolean>;
}

export interface MenuItem {
  id: string;
  nome: string;
  rota: string;
  icone: string;
  grupo: string;
  ordem: number;
  status: "ativo" | "inativo";
  visivel: boolean;
  permissao: string;
}

export interface DashboardCard {
  id: string;
  nome: string;
  tipo: "card" | "grafico";
}

export interface DashboardProfileConfig {
  profileId: string;
  cards: string[];
}

export interface DashboardUserConfig {
  userId: string;
  cards: string[];
  graficos: string[];
  ordem: string[];
  status: "ativo" | "inativo";
}

export interface SystemSettings {
  nomeSistema: string;
  urlApi: string;
  ambiente: "producao" | "homologacao" | "desenvolvimento";
  tempoLimiteOs: number;
  tempoAlertaAtraso: number;
  notificacoes: boolean;
  moduloIa: boolean;
  logoUrl: string;
  iconeUrl: string;
  tema: "claro" | "escuro" | "auto";
}

export interface AiSettings {
  ativa: boolean;
  provedor: string;
  modelo: string;
  urlApi: string;
  apiKey: string;
  promptPadrao: string;
  limiteTokens: number;
  temperatura: number;
  usarBaseConhecimento: boolean;
}

export interface KnowledgeItem {
  id: string;
  titulo: string;
  categoria: string;
  tags: string[];
  conteudo: string;
  status: "ativo" | "inativo";
  indexacao: "pendente" | "indexado" | "erro";
  atualizadoEm: string;
}

export const mockUsers: AdminUser[] = [
  { id: "1", nome: "Administrador", email: "admin@empresa.com", login: "admin", perfil: "Administrador", status: "ativo", criadoEm: "2024-01-12" },
  { id: "2", nome: "João Silva", email: "joao@empresa.com", login: "joao.silva", perfil: "Técnico", status: "ativo", criadoEm: "2024-02-08" },
  { id: "3", nome: "Maria Souza", email: "maria@empresa.com", login: "maria.souza", perfil: "Gestor", status: "ativo", criadoEm: "2024-02-22" },
  { id: "4", nome: "Carlos Lima", email: "carlos@empresa.com", login: "carlos.lima", perfil: "Atendente", status: "inativo", criadoEm: "2024-03-15" },
];

export const mockProfiles: AccessProfile[] = [
  { id: "1", nome: "Administrador", descricao: "Acesso total ao sistema", status: "ativo" },
  { id: "2", nome: "Gestor", descricao: "Gestão operacional e relatórios", status: "ativo" },
  { id: "3", nome: "Técnico", descricao: "Execução de ordens de serviço", status: "ativo" },
  { id: "4", nome: "Atendente", descricao: "Abertura e acompanhamento de OS", status: "ativo" },
  { id: "5", nome: "Cliente", descricao: "Acompanhamento de seus próprios chamados", status: "ativo" },
];

export const adminModules = [
  "Ordens de Serviço", "Clientes", "Técnicos", "Produtos",
  "Serviços", "Relatórios", "Usuários", "Configurações",
];

export const mockMenus: MenuItem[] = [
  { id: "1", nome: "Dashboard", rota: "/", icone: "LayoutDashboard", grupo: "Operacional", ordem: 1, status: "ativo", visivel: true, permissao: "visualizar" },
  { id: "2", nome: "Ordens de Serviço", rota: "/ordens", icone: "ClipboardList", grupo: "Operacional", ordem: 2, status: "ativo", visivel: true, permissao: "visualizar" },
  { id: "3", nome: "Kanban", rota: "/kanban", icone: "KanbanSquare", grupo: "Operacional", ordem: 3, status: "ativo", visivel: true, permissao: "visualizar" },
  { id: "4", nome: "Clientes", rota: "/clientes", icone: "Users", grupo: "Cadastros", ordem: 4, status: "ativo", visivel: true, permissao: "visualizar" },
  { id: "5", nome: "Usuários", rota: "/admin/usuarios", icone: "UserCog", grupo: "Administração", ordem: 10, status: "ativo", visivel: true, permissao: "configurar" },
];

export const mockDashboardCards: DashboardCard[] = [
  { id: "os-abertas", nome: "OS Abertas", tipo: "card" },
  { id: "os-atraso", nome: "OS em Atraso", tipo: "card" },
  { id: "os-finalizadas", nome: "OS Finalizadas", tipo: "card" },
  { id: "sla-vencido", nome: "SLA Vencido", tipo: "card" },
  { id: "prod-tecnico", nome: "Produtividade por Técnico", tipo: "grafico" },
  { id: "por-status", nome: "Ordens por Status", tipo: "grafico" },
  { id: "por-prioridade", nome: "Ordens por Prioridade", tipo: "grafico" },
];

export const mockProfileDashboards: DashboardProfileConfig[] = [
  { profileId: "1", cards: ["os-abertas", "os-atraso", "os-finalizadas", "sla-vencido", "prod-tecnico", "por-status", "por-prioridade"] },
  { profileId: "2", cards: ["os-abertas", "os-finalizadas", "prod-tecnico", "por-status"] },
  { profileId: "3", cards: ["os-abertas", "os-atraso"] },
];

export const mockUserDashboards: DashboardUserConfig[] = [
  { userId: "1", cards: ["os-abertas", "os-atraso"], graficos: ["por-status"], ordem: [], status: "ativo" },
  { userId: "2", cards: ["os-abertas"], graficos: ["prod-tecnico"], ordem: [], status: "ativo" },
];

export const mockSystemSettings: SystemSettings = {
  nomeSistema: "OS Control",
  urlApi: "https://api.oscontrol.com",
  ambiente: "producao",
  tempoLimiteOs: 72,
  tempoAlertaAtraso: 12,
  notificacoes: true,
  moduloIa: true,
  logoUrl: "",
  iconeUrl: "",
  tema: "claro",
};

export const mockAiSettings: AiSettings = {
  ativa: true,
  provedor: "OpenAI",
  modelo: "gpt-4o-mini",
  urlApi: "https://api.openai.com/v1",
  apiKey: "",
  promptPadrao: "Você é um assistente especialista em ordens de serviço.",
  limiteTokens: 2048,
  temperatura: 0.4,
  usarBaseConhecimento: true,
};

export const mockKnowledgeBase: KnowledgeItem[] = [
  { id: "1", titulo: "Procedimento padrão de abertura de OS", categoria: "Operacional", tags: ["os", "padrão"], conteudo: "Passos para abertura...", status: "ativo", indexacao: "indexado", atualizadoEm: "2024-05-01" },
  { id: "2", titulo: "Política de SLA", categoria: "Políticas", tags: ["sla"], conteudo: "Tempos máximos...", status: "ativo", indexacao: "indexado", atualizadoEm: "2024-04-22" },
  { id: "3", titulo: "Catálogo de serviços", categoria: "Comercial", tags: ["serviços"], conteudo: "Lista completa...", status: "inativo", indexacao: "pendente", atualizadoEm: "2024-05-10" },
];
