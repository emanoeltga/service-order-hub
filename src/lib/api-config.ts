// Persistência da URL base do SERVIDOR (sem /api) + buffer de logs do frontend.
// O sufixo /api é aplicado pelo client central (src/lib/api.ts).

const API_SERVER_URL_KEY = "os-api-server-url";
const LEGACY_API_URL_KEY = "os-api-base-url"; // chave antiga (continha /api)
const LOGS_KEY = "os-app-logs";
const MAX_LOGS = 500;

export const DEFAULT_API_SERVER_URL =
  "https://references-terrorist-argued-crystal.trycloudflare.com";

/** Normaliza a URL do servidor: sem barra final, sem /api, valida protocolo. */
export function normalizeServerUrl(url: string): string {
  let normalized = (url ?? "").trim();
  if (!normalized) throw new Error("URL vazia");

  // remove barras finais
  normalized = normalized.replace(/\/+$/, "");

  // remove /api do final, se houver
  if (/\/api$/i.test(normalized)) {
    normalized = normalized.slice(0, -4);
  }

  if (/https?:\/\/https?/i.test(normalized)) {
    throw new Error("URL inválida: protocolo duplicado");
  }
  if (!/^https?:\/\//i.test(normalized)) {
    throw new Error("URL deve começar com http:// ou https://");
  }

  // valida sintaxe (lança se inválida)
  // eslint-disable-next-line no-new
  new URL(normalized);

  return normalized;
}

/** Migra chave antiga `os-api-base-url` (com /api) para `os-api-server-url`. */
function migrateLegacyKey() {
  if (typeof window === "undefined") return;
  const old = localStorage.getItem(LEGACY_API_URL_KEY);
  if (!old) return;
  try {
    const normalized = normalizeServerUrl(old);
    if (!localStorage.getItem(API_SERVER_URL_KEY)) {
      localStorage.setItem(API_SERVER_URL_KEY, normalized);
    }
  } catch {
    /* ignora */
  }
  localStorage.removeItem(LEGACY_API_URL_KEY);
}

export function getApiServerUrl(): string {
  if (typeof window === "undefined") return DEFAULT_API_SERVER_URL;
  migrateLegacyKey();
  const saved = localStorage.getItem(API_SERVER_URL_KEY);
  if (!saved) return DEFAULT_API_SERVER_URL;
  try {
    return normalizeServerUrl(saved);
  } catch {
    localStorage.removeItem(API_SERVER_URL_KEY);
    return DEFAULT_API_SERVER_URL;
  }
}

export function setApiServerUrl(url: string) {
  const normalized = normalizeServerUrl(url);
  localStorage.setItem(API_SERVER_URL_KEY, normalized);
}

export function hasApiServerUrl(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(API_SERVER_URL_KEY);
}

export function clearApiServerUrl() {
  localStorage.removeItem(API_SERVER_URL_KEY);
}

/** URL base completa para o axios: SERVER + /api */
export function getApiBaseUrl(): string {
  return `${getApiServerUrl()}/api`;
}

// Aliases de compatibilidade
export const getApiBaseURL = getApiBaseUrl;
export const setApiBaseUrl = setApiServerUrl;
export const clearApiBaseUrl = clearApiServerUrl;
export const hasApiBaseUrl = hasApiServerUrl;
export const DEFAULT_API_URL = DEFAULT_API_SERVER_URL;

// ---------- Logs ----------
export type LogLevel = "info" | "warn" | "error" | "debug";
export interface LogEntry {
  ts: string;
  level: LogLevel;
  message: string;
  meta?: unknown;
}

function readLogs(): LogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY) || "[]") as LogEntry[];
  } catch {
    return [];
  }
}

function writeLogs(entries: LogEntry[]) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(entries.slice(-MAX_LOGS)));
}

export function pushLog(level: LogLevel, message: string, meta?: unknown) {
  const entries = readLogs();
  entries.push({ ts: new Date().toISOString(), level, message, meta });
  writeLogs(entries);
}

export function getLogs(): LogEntry[] {
  return readLogs().slice().reverse();
}

export function clearLogs() {
  localStorage.removeItem(LOGS_KEY);
}

let installed = false;
export function installLogCapture() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    try { pushLog("error", args.map(String).join(" ")); } catch { /* noop */ }
    origError(...args);
  };
  window.addEventListener("error", (e) => pushLog("error", e.message, { src: e.filename }));
  window.addEventListener("unhandledrejection", (e) =>
    pushLog("error", "UnhandledRejection: " + String(e.reason)),
  );
  pushLog("info", "Log capture iniciado");
}
