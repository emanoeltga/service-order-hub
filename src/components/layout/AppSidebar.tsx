import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, ClipboardList, KanbanSquare, CalendarRange, CheckSquare,
  Users, Wrench, Package, Briefcase, BarChart3, Settings, HardHat,
  UserCog, Shield, KeyRound, Menu as MenuIcon, LayoutGrid, UserCircle,
  SlidersHorizontal, Bot, BookOpen, ScrollText,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { isAdmin } from "@/lib/auth";

const operacional = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Ordens de Serviço", url: "/ordens", icon: ClipboardList },
  { title: "Board Kanban", url: "/kanban", icon: KanbanSquare },
  { title: "Cronograma", url: "/cronograma", icon: CalendarRange },
  { title: "Aprovações", url: "/aprovacoes", icon: CheckSquare },
];

const cadastros = [
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Técnicos", url: "/tecnicos", icon: Wrench },
  { title: "Produtos", url: "/produtos", icon: Package },
  { title: "Serviços", url: "/servicos", icon: Briefcase },
];

const administracao = [
  { title: "Usuários", url: "/admin/usuarios", icon: UserCog },
  { title: "Perfis de Acesso", url: "/admin/perfis", icon: Shield },
  { title: "Permissões", url: "/admin/permissoes", icon: KeyRound },
  { title: "Menus e Telas", url: "/admin/menus", icon: MenuIcon },
  { title: "Dashboard por Perfil", url: "/admin/dashboard-perfil", icon: LayoutGrid },
  { title: "Dashboard por Usuário", url: "/admin/dashboard-usuario", icon: UserCircle },
  { title: "Configurações do Sistema", url: "/admin/configuracoes-sistema", icon: SlidersHorizontal },
  { title: "Configuração da IA", url: "/admin/ia", icon: Bot },
  { title: "Base de Conhecimento IA", url: "/admin/base-conhecimento", icon: BookOpen },
  { title: "Logs do Sistema", url: "/admin/logs", icon: ScrollText },
];

const sistema = [
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => (url === "/" ? path === "/" : path.startsWith(url));
  const showAdmin = isAdmin();

  const renderGroup = (label: string, items: typeof operacional) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="size-8 rounded-md bg-sidebar-primary flex items-center justify-center">
            <HardHat className="size-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">OS Control</span>
            <span className="text-xs text-sidebar-foreground/60">Gestão de OS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Operacional", operacional)}
        {renderGroup("Cadastros", cadastros)}
        {showAdmin && renderGroup("Administração", administracao)}
        {renderGroup("Sistema", sistema)}
      </SidebarContent>
    </Sidebar>
  );
}
