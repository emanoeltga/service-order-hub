import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Topbar } from "@/components/layout/Topbar";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const session = getSession();
    if (!session) throw redirect({ to: "/login" });
    // Bloqueia rotas /admin/* para quem não é administrador.
    if (location.pathname.startsWith("/admin") && session.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
