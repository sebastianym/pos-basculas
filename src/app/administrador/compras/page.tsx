"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchGET } from "@/data/services/fetchGET";

function TablaCompras() {
  const [compras, setCompras] = useState<any>([]);

  async function loadCompras() {
    const data = await fetchGET({
      url: "/api/compras/all",
      error: "Error al obtener los compras",
    });
    setCompras(data);
  }

  useEffect(() => {
    loadCompras();
  }, []);

  const handleActualizar = (id: number) => {
    console.log(`Actualizar registro con ID: ${id}`);
  };

  const handleEliminar = (id: number) => {
    console.log(`Eliminar registro con ID: ${id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-evenly space-y-2 max-w-4xl">
        <h1 className="text-3xl font-bold m-8 text-center">Tabla de Compras</h1>
        <Button>Exportar excel</Button>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl border rounded-lg shadow-lg overflow-hidden bg-white px-4 py-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compras.map((compra: any) => (
                <TableRow key={compra.id}>
                  <TableCell>{compra.material.nombre}</TableCell>
                  <TableCell>{compra.usuario.identificador}</TableCell>
                  <TableCell>{compra.proveedor.nombreProveedor}</TableCell>
                    <TableCell>{new Date(compra.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(compra.hora).toLocaleTimeString()}</TableCell>
                  <TableCell>{compra.valorCompra}</TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActualizar(compra.id)}
                        className="px-2 py-1 text-xs"
                      >
                        Actualizar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEliminar(compra.id)}
                        className="px-2 py-1 text-xs"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default TablaCompras;
