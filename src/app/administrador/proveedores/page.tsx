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
import { confirmAlert, errorAlert } from "@/lib/alerts/alerts";
import { fetchPOST } from "@/data/services/fetchPOST";
import { successAlert } from "@/lib/utils/alerts/successAlert";
import CreateProviderModal from "@/components/modals/proveedores/createProviderModal";
import UpdateProviderModal from "@/components/modals/proveedores/updateProviderModal";

function TablaProveedores() {
  const [proveedores, setProveedores] = useState<any>([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [isModalCreateOpen, setModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [proveedorSelected, setProveedorSelected] = useState<any>(undefined);
  async function loadProveedores() {
    const data = await fetchGET({
      url: "/api/proveedores/all",
      error: "Error al obtener los proveedores",
    });
    setProveedores(data);
  }

  useEffect(() => {
    loadProveedores();
  }, [updateTable]);

  const handleActualizar = (id: number) => {
    console.log(`Actualizar registro con ID: ${id}`);
  };

  async function handleEliminar(id: number) {
    const data = await fetchPOST({
      url: "/api/proveedores/delete",
      body: { id },
      error: "Error al eliminar el proveedor",
    });
    if (data.id) {
      setUpdateTable(!updateTable);
      successAlert("Éxito", "Proveedor eliminado correctamente", "success");
    } else {
      errorAlert("Error", "Error al eliminar el proveedor");
    }
  }

  const handleModalCreateClose = () => {
    setModalCreateOpen(false);
  };

  const handleModalCreateOpen = () => {
    setModalCreateOpen(true);
  };

  const handleModalUpdateClose = () => {
    setModalUpdateOpen(false);
  };

  const handleModalUpdateOpen = () => {
    setModalUpdateOpen(true);
  };

  return (
    <div>
      <CreateProviderModal
        handleModalClose={handleModalCreateClose}
        isModalOpen={isModalCreateOpen}
        updateTable={updateTable}
        setUpdateTable={setUpdateTable}
      />
      <UpdateProviderModal
        handleModalClose={handleModalUpdateClose}
        isModalOpen={isModalUpdateOpen}
        proveedor={proveedorSelected}
        updateTable={updateTable}
        setUpdateTable={setUpdateTable}
      />
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-evenly space-y-2 max-w-4xl">
          <h1 className="text-3xl font-bold m-8 text-center text-[#1a47b8]">
            Tabla de Proveedores
          </h1>
          <Button
            className="bg-[#1a47b8]"
            onClick={() => {
              handleModalCreateOpen();
            }}
          >
            + Crear proveedor
          </Button>
        </div>
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
              {proveedores && proveedores.length > 0 ? (
                proveedores.map((proveedor: any) => (
                  <TableRow key={proveedor.id}>
                    <TableCell>{proveedor.nombreProveedor}</TableCell>
                    <TableCell>{proveedor.direccion}</TableCell>
                    <TableCell>{proveedor.telefono}</TableCell>
                    <TableCell>{proveedor.correo}</TableCell>
                    <TableCell>{proveedor.NIT}</TableCell>
                    <TableCell>
                      <div className="flex justify-start space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProveedorSelected(proveedor);
                            handleModalUpdateOpen();
                          }}
                          className="px-2 py-1 text-xs"
                        >
                          Actualizar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            const responseSubmit = confirmAlert(
                              "Eliminar proveedor",
                              "¿Estás seguro de eliminar este proveedor?, se eliminaran las compras asociadas al proveedor"
                            );
                            responseSubmit.then((confirmed) => {
                              if (confirmed) {
                                console.log(proveedor.id);
                                handleEliminar(proveedor.id.toString());
                              }
                            });
                          }}
                          className="px-2 py-1 text-xs"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No hay proveedores registrados
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

export default TablaProveedores;
