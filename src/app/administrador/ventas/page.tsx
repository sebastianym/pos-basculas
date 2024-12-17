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

function TablaVentas() {
  const [ventas, setVentas] = useState<any>([]);

  async function loadVentas() {
    const data = await fetchGET({
      url: "/api/ventas/all",
      error: "Error al obtener las ventas",
    });
    setVentas(data);
  }

  useEffect(() => {
    loadVentas();
  }, []);

  const handleActualizar = (id: number) => {
    console.log(`Actualizar registro con ID: ${id}`);
  };

  const handleEliminar = (id: number) => {
    console.log(`Eliminar registro con ID: ${id}`);
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-evenly space-y-2 max-w-4xl">
          <h1 className="text-3xl font-bold m-8 text-center text-[#1a47b8]">
            Tabla de Ventas
          </h1>
          <Button className="bg-[#1a47b8]">Exportar excel</Button>
        </div>
        <div className="w-full max-w-4xl border rounded-lg shadow-lg overflow-hidden bg-white px-4 py-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.map((venta: any) => (
                <TableRow key={venta.id}>
                  <TableCell>{venta.material.nombre}</TableCell>
                  <TableCell>{venta.usuario.nombre}</TableCell>
                  <TableCell>
                    {venta.companiaCliente?.nombre || "N/A"}
                  </TableCell>
                  <TableCell>{venta.fecha}</TableCell>
                  <TableCell>{venta.hora}</TableCell>
                  <TableCell>{venta.valor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default TablaVentas;
