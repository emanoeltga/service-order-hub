# Módulo Administração

Novo grupo no menu lateral visível apenas para usuários com perfil **admin**.
A guarda fica em `src/routes/_app.tsx` (bloqueia `/admin/*` para não-admin) e a
visibilidade do grupo em `src/components/layout/AppSidebar.tsx`.

## Telas criadas

| Rota | Tela | Endpoint esperado |
|------|------|-------------------|
| `/admin/usuarios` | Usuários | `/api/users` |
| `/admin/perfis` | Perfis de Acesso | `/api/access-profiles` |
| `/admin/permissoes` | Permissões | `/api/permissions` |
| `/admin/menus` | Menus e Telas | `/api/menus` |
| `/admin/dashboard-perfil` | Dashboard por Perfil | `/api/dashboard-profile-configs` |
| `/admin/dashboard-usuario` | Dashboard por Usuário | `/api/dashboard-user-configs` |
| `/admin/configuracoes-sistema` | Configurações do Sistema | `/api/system-settings` |
| `/admin/ia` | Configuração da IA | `/api/ai/settings` + `/api/ai/test-connection` |
| `/admin/base-conhecimento` | Base de Conhecimento IA | `/api/ai/knowledge-base` |

## Onde substituir mocks por API real

- `src/services/admin.ts` — cada função retorna dados de `src/lib/admin-mock.ts`
  via `delay(...)`. Trocar pelo `api.get/post/put/delete(...)` correspondente
  (a instância `axios` já está configurada com `baseURL: "/api"`).
- `src/lib/admin-mock.ts` — pode ser removido após a integração.
- `src/lib/auth.ts` — sessão local em `localStorage`. Trocar `loginMock` pela
  chamada real de autenticação e popular `role` e `permissions` com o que vier
  do backend. Helpers `hasPermission()` / `isAdmin()` já estão prontos.

## Controle de permissão

- Tipos em `src/lib/auth.ts`: `Role`, `Permission`, `SessionUser`.
- `hasPermission(p)` e `isAdmin()` para uso em componentes.
- Mapa padrão `ROLE_PERMISSIONS` enquanto não vier do backend.
