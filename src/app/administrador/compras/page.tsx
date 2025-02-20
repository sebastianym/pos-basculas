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

function TablaCompras() {
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para los filtros
  const [materialFilter, setMaterialFilter] = useState("");
  const [usuarioFilter, setUsuarioFilter] = useState("");
  const [proveedorFilter, setProveedorFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");

  // Cargar datos de compras
  async function loadCompras() {
    const data = await fetchGET({
      url: "/api/compras/all",
      error: "Error al obtener las compras",
    });
    setCompras(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCompras();
  }, []);

  // Filtrar compras según los criterios ingresados
  const filteredCompras = compras.filter((compra: any) => {
    // Filtrar por material (nombre)
    const matchesMaterial =
      materialFilter.trim() === "" ||
      (compra.material &&
        compra.material.nombre
          .toLowerCase()
          .includes(materialFilter.toLowerCase()));

    // Filtrar por usuario (identificador)
    const matchesUsuario =
      usuarioFilter.trim() === "" ||
      (compra.usuario &&
        compra.usuario.identificador
          .toLowerCase()
          .includes(usuarioFilter.toLowerCase()));

    // Filtrar por proveedor (nombreProveedor)
    const matchesProveedor =
      proveedorFilter.trim() === "" ||
      (compra.proveedor &&
        compra.proveedor.nombreProveedor
          .toLowerCase()
          .includes(proveedorFilter.toLowerCase()));

    // Filtrar por fecha (se formatea la fecha y se compara)
    const compraFecha = new Date(compra.fecha).toLocaleDateString();
    const matchesFecha =
      fechaFilter.trim() === "" ||
      compraFecha.toLowerCase().includes(fechaFilter.toLowerCase());

    return matchesMaterial && matchesUsuario && matchesProveedor && matchesFecha;
  });

  // Función para exportar a Excel utilizando la librería xlsx.
  const exportarExcel = () => {
    // Mapeamos los datos filtrados a un formato sencillo
    const datosAExportar = filteredCompras.map((compra: any) => ({
      Material: compra.material.nombre,
      Usuario: compra.usuario.identificador,
      Proveedor: compra.proveedor.nombreProveedor,
      Fecha: new Date(compra.fecha).toLocaleDateString(),
      Hora: new Date(compra.hora).toLocaleTimeString(),
      Valor: compra.valorCompra.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
    }));

    // Crear una hoja de trabajo y un libro
    const worksheet = XLSX.utils.json_to_sheet(datosAExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Compras");

    // Generar archivo Excel y disparar la descarga
    XLSX.writeFile(workbook, "compras.xlsx");
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
        {/* Encabezado y botón de exportación */}
        <div className="flex flex-col md:flex-row md:justify-evenly items-center space-y-2 max-w-4xl w-full">
          <h1 className="text-3xl font-bold m-8 text-center text-[#1a47b8]">
            Tabla de Compras
          </h1>
          <Button
            onClick={exportarExcel}
            className="bg-[#1a47b8]"
            disabled={filteredCompras.length === 0}
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
              <label className="block mb-1 font-medium">Proveedor</label>
              <input
                type="text"
                value={proveedorFilter}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setProveedorFilter(e.target.value)
                }
                placeholder="Filtrar por proveedor"
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

        {/* Tabla de compras */}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompras && filteredCompras.length > 0 ? (
                filteredCompras.map((compra: any) => (
                  <TableRow key={compra.id}>
                    <TableCell>{compra.material.nombre}</TableCell>
                    <TableCell>{compra.usuario.identificador}</TableCell>
                    <TableCell>{compra.proveedor.nombreProveedor}</TableCell>
                    <TableCell>
                      {new Date(compra.fecha).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(compra.hora).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {compra.valorCompra.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No hay compras que coincidan con los filtros
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

export default TablaCompras;
