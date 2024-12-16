"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  identificador: string;
}

const datos: Persona[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  nombre: `Nombre${i + 1}`,
  apellido: `Apellido${i + 1}`,
  identificador: `ID-${(i + 1).toString().padStart(3, "0")}`,
}));

function TablaMateriales() {
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;
  const totalPaginas = Math.ceil(datos.length / porPagina);

  const datosPaginados = datos.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

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
          Tabla de Materiales
        </h1>
        <Button>+ Crear material</Button>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl border rounded-lg shadow-lg overflow-hidden bg-white px-4 py-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Codigo</TableHead>
                <TableHead>Precio por Kg</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datosPaginados.map((persona) => (
                <TableRow key={persona.id}>
                  <TableCell>{persona.nombre}</TableCell>
                  <TableCell>{persona.apellido}</TableCell>
                  <TableCell>{persona.identificador}</TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActualizar(persona.id)}
                        className="px-2 py-1 text-xs"
                      >
                        Actualizar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEliminar(persona.id)}
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

export default TablaMateriales;
