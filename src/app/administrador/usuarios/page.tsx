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

function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState<any>([]);

  async function loadUsuarios() {
    const data = await fetchGET({
      url: "/api/usuarios/all",
      error: "Error al obtener los usuarios",
    });
    setUsuarios(data);
  }

  useEffect(() => {
    loadUsuarios();
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
          Tabla de Usuarios
        </h1>
        <Button>+ Crear usuario</Button>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl border rounded-lg shadow-lg overflow-hidden bg-white px-4 py-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Identificador</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario: any) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.apellido}</TableCell>
                  <TableCell>{usuario.identificador}</TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActualizar(usuario.id)}
                        className="px-2 py-1 text-xs"
                      >
                        Actualizar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEliminar(usuario.id)}
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

export default TablaUsuarios;
