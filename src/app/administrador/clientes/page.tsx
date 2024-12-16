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

function TablaClientes() {
  const [clientes, setClientes] = useState<any>([]);

  async function loadClientes() {
    const data = await fetchGET({
      url: "/api/clientes/all",
      error: "Error al obtener los clientes",
    });
    setClientes(data);
  }

  useEffect(() => {
    loadClientes();
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
        <h1 className="text-3xl font-bold m-8 text-center">
          Tabla de Clientes
        </h1>
        <Button>+ Crear cliente</Button>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl border rounded-lg shadow-lg overflow-hidden bg-white px-4 py-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Correo electrónico</TableHead>
                <TableHead>NIT</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente: any) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.direccion}</TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>{cliente.correo}</TableCell>
                  <TableCell>{cliente.NIT}</TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActualizar(cliente.id)}
                        className="px-2 py-1 text-xs"
                      >
                        Actualizar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEliminar(cliente.id)}
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

export default TablaClientes;
