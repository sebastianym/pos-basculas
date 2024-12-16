import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompraForm from "@/components/usuarios/forms/compraForm";

function CompraMaterial() {
  return (
    <main className="p-6 w-full bg-gray-100">
      <div className="mx-auto max-w-[2000px]">
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a47b8]">
            Compra de Material
          </h1>
        </div>
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>Formulario de Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <CompraForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default CompraMaterial;
