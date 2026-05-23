// Sessão local + helpers de permissão.
// Substituir por chamada real à API quando o backend estiver pronto.

export type Role = "admin" | "gestor" | "tecnico" | "atendente" | "cliente";
export type Permission =
  | "visualizar" | "criar" | "editar" | "excluir"
  | "exportar" | "aprovar" | "configurar";

export interface SessionUser {
  id: string;
  nome: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

const STORAGE_KEY = "os-auth";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ["visualizar", "criar", "editar", "excluir", "exportar", "aprovar", "configurar"],
  gestor: ["visualizar", "criar", "editar", "exportar", "aprovar"],
  tecnico: ["visualizar", "editar"],
  atendente: ["visualizar", "criar"],
  cliente: ["visualizar"],
};

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionUser;
    if (!parsed?.role) return null;
    return parsed;
  } catch {
    // Compat com versão anterior que salvava "1"
    return {
      id: "u-admin",
      nome: "Administrador",
      email: "admin@empresa.com",
      role: "admin",
      permissions: ROLE_PERMISSIONS.admin,
    };
  }
}

export function setSession(user: SessionUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function loginMock(email: string): SessionUser {
  const role: Role = email.startsWith("admin") ? "admin" : "atendente";
  const user: SessionUser = {
    id: "u-" + role,
    nome: role === "admin" ? "Administrador" : "Usuário",
    email,
    role,
    permissions: ROLE_PERMISSIONS[role],
  };
  setSession(user);
  return user;
}

export function hasPermission(p: Permission): boolean {
  return !!getSession()?.permissions.includes(p);
}

export function isAdmin(): boolean {
  return getSession()?.role === "admin";
}
