"use client";

import { Scale, ShoppingCart, Store } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/custom/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100 w-full">
        <Sidebar className="bg-[#1a47b8] text-white">
          <SidebarHeader className="border-b border-white/10 px-4 py-6">
            <h2 className="text-xl font-bold text-black">
              ASORESCATAR (USER)
            </h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard/compraMaterial"
                    className={`w-full text-black hover:bg-white/10 ${
                      pathname === "/dashboard/compraMaterial"
                        ? "bg-white/20"
                        : ""
                    }`}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Compra de Material
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard/ventaMaterial"
                    className={`w-full text-black hover:bg-white/10 ${
                      pathname === "/dashboard/ventaMaterial"
                        ? "bg-white/20"
                        : ""
                    }`}
                  >
                    <Store className="mr-2 h-4 w-4" />
                    Venta de Material
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard/servicioBascula"
                    className={`w-full text-black hover:bg-white/10 ${
                      pathname === "/dashboard/servicioBascula"
                        ? "bg-white/20"
                        : ""
                    }`}
                  >
                    <Scale className="mr-2 h-4 w-4" />
                    Servicio de Báscula
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="w-full">
          <header className="border-b bg-white shadow-sm w-full">
            <div className="flex h-16 items-center justify-between gap-4 px-6 w-full">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
              </div>

              <div className="flex items-center justify-end w-full">
                <LogoutButton/>
              </div>
            </div>
          </header>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
