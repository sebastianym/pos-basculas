import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function DahsboardProveedores() {
  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-[#1a47b8]">
          Administrador de Proveedores
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Modificar Proveedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-muted-foreground">
              En esta sección podrás modificar los proveedores de la plataforma,
              incluyendo la lista de proveedores, eliminarlos o modificarlos.
            </p>
            <Button className="mt-4 w-full bg-[#1a47b8]" size="lg">
              Ir a Proveedores
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Creación de Proveedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-muted-foreground">
              En esta sección podrás crear nuevos proveedores para la plataforma
              a partir de un formulario.
            </p>
            <Button className="mt-4 w-full bg-[#1a47b8]" size="lg">
              Ir a Crear
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default DahsboardProveedores;
