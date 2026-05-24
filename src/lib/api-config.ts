// Persistência da URL base do backend + buffer de logs do frontend.
// Usado por axios e por qualquer chamada HTTP do app.

const API_URL_KEY = "os-api-base-url";
const LOGS_KEY = "os-app-logs";
const MAX_LOGS = 500;

export const DEFAULT_API_URL = "http://localhost:3000/api";

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_API_URL;
  return localStorage.getItem(API_URL_KEY) || DEFAULT_API_URL;
}

export function setApiBaseUrl(url: string) {
  localStorage.setItem(API_URL_KEY, url.trim().replace(/\/+$/, ""));
}

export function hasApiBaseUrl(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(API_URL_KEY);
}

export function clearApiBaseUrl() {
  localStorage.removeItem(API_URL_KEY);
}

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

// Hook automático: captura erros globais e console.error
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
