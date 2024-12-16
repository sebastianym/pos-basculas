import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VentaForm from "@/components/usuarios/forms/ventaForm";

function VentaMaterial() {
  return (
    <main className="p-6 w-full">
      <div className="mx-auto max-w-[2000px]">
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a47b8]">
            Venta de Material
          </h1>
        </div>
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>Formulario de Venta</CardTitle>
          </CardHeader>
          <CardContent>
            <VentaForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default VentaMaterial;
