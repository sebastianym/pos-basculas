"use client";

import { useEffect, useState, ChangeEvent } from "react";
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
import { CircularProgress } from "@nextui-org/react";
import * as XLSX from "xlsx";

function TablaVentas() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros
  const [materialFilter, setMaterialFilter] = useState("");
  const [usuarioFilter, setUsuarioFilter] = useState("");
  const [clienteFilter, setClienteFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");

  // Cargar datos de ventas
  async function loadVentas() {
    const data = await fetchGET({
      url: "/api/ventas/all",
      error: "Error al obtener las ventas",
    });
    setVentas(data);
    setLoading(false);
  }

  useEffect(() => {
    loadVentas();
  }, []);

  // Funciones de manejo para actualizar y eliminar (actualmente solo loguean)
  const handleActualizar = (id: number) => {
    console.log(`Actualizar registro con ID: ${id}`);
  };

  const handleEliminar = (id: number) => {
    console.log(`Eliminar registro con ID: ${id}`);
  };

  // Función para filtrar ventas según los criterios ingresados
  const filteredVentas = ventas.filter((venta: any) => {
    // Filtrar por material (nombre)
    const matchesMaterial =
      materialFilter.trim() === "" ||
      (venta.material &&
        venta.material.nombre
          .toLowerCase()
          .includes(materialFilter.toLowerCase()));

    // Filtrar por usuario (nombre)
    const matchesUsuario =
      usuarioFilter.trim() === "" ||
      (venta.usuario &&
        venta.usuario.nombre
          .toLowerCase()
          .includes(usuarioFilter.toLowerCase()));

    // Filtrar por cliente (nombre). Se verifica si existe companiaCliente
    const clienteNombre = venta.companiaCliente
      ? venta.companiaCliente.nombre
      : "";
    const matchesCliente =
      clienteFilter.trim() === "" ||
      clienteNombre.toLowerCase().includes(clienteFilter.toLowerCase());

    // Filtrar por fecha. Se formatea la fecha y se compara si incluye el texto del filtro.
    const ventaFecha = new Date(venta.fecha).toLocaleDateString();
    const matchesFecha =
      fechaFilter.trim() === "" ||
      ventaFecha.toLowerCase().includes(fechaFilter.toLowerCase());

    return matchesMaterial && matchesUsuario && matchesCliente && matchesFecha;
  });

  // Función para exportar a Excel utilizando la librería xlsx.
  const exportarExcel = () => {
    // Mapeamos los datos filtrados a un formato sencillo (arreglo de objetos)
    const datosAExportar = filteredVentas.map((venta: any) => ({
      Material: venta.material.nombre,
      Usuario: venta.usuario.nombre,
      Cliente: venta.companiaCliente?.nombre || "N/A",
      Fecha: new Date(venta.fecha).toLocaleDateString(),
      Hora: new Date(venta.hora).toLocaleTimeString(),
      Valor: venta.valorVenta.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
    }));

    // Crear una nueva hoja de trabajo y un libro
    const worksheet = XLSX.utils.json_to_sheet(datosAExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");

    // Generar archivo Excel y disparar la descarga
    XLSX.writeFile(workbook, "ventas.xlsx");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        <div className="flex flex-col md:flex-row md:justify-evenly items-center space-y-2 max-w-4xl w-full">
          <h1 className="text-3xl font-bold m-8 text-center text-[#1a47b8]">
            Tabla de Ventas
          </h1>
          <Button
            onClick={exportarExcel}
            disabled={filteredVentas.length === 0}
            className="bg-[#1a47b8]"
          >
            Exportar Excel
          </Button>
        </div>

        {/* Sección de filtros */}
        <div className="w-full max-w-4xl bg-white p-4 mb-4 rounded-lg shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block mb-1 font-medium">Material</label>
              <input
                type="text"
                value={materialFilter}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMaterialFilter(e.target.value)
                }
                placeholder="Filtrar por material"
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Usuario</label>
              <input
                type="text"
                value={usuarioFilter}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsuarioFilter(e.target.value)
                }
                placeholder="Filtrar por usuario"
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Cliente</label>
              <input
                type="text"
                value={clienteFilter}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setClienteFilter(e.target.value)
                }
                placeholder="Filtrar por cliente"
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Fecha</label>
              <input
                type="text"
                value={fechaFilter}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFechaFilter(e.target.value)
                }
                placeholder="Día, mes o año"
                className="border rounded w-full px-2 py-1"
              />
            </div>
          </div>
        </div>

        {/* Tabla de ventas */}
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
              {filteredVentas && filteredVentas.length > 0 ? (
                filteredVentas.map((venta: any) => (
                  <TableRow key={venta.id}>
                    <TableCell>{venta.material.nombre}</TableCell>
                    <TableCell>{venta.usuario.nombre}</TableCell>
                    <TableCell>
                      {venta.companiaCliente?.nombre || "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(venta.fecha).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(venta.hora).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {venta.valorVenta.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No hay ventas que coincidan con los filtros
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default TablaVentas;
