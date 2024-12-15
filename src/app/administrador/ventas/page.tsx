import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function DashboardVentas() {
  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-[#1a47b8]">
          Administrador de Ventas
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Mostrar todas las Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-muted-foreground">
              En esta sección podrás ver las ventas que registró la plataforma y
              filtrar por una busqueda especifica.
            </p>
            <Button className="mt-4 w-full bg-[#1a47b8]" size="lg">
              Ir a Ventas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Exportar Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-muted-foreground">
              En esta sección podrás exportar un excel con todas las ventas
              entre un cierto rango.
            </p>
            <Button className="mt-4 w-full bg-[#1a47b8]" size="lg">
              Exportar Excel
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default DashboardVentas;
