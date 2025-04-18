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
import { fetchPOST } from "@/data/services/fetchPOST";
import { successAlert } from "@/lib/utils/alerts/successAlert";
import { confirmAlert, errorAlert } from "@/lib/alerts/alerts";
import CreateClientModal from "@/components/modals/clientes/createClientModal";
import UpdateClientModal from "@/components/modals/clientes/updateClientModal";
import { CircularProgress } from "@nextui-org/react";

function TablaClientes() {
  const [clientes, setClientes] = useState<any>([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalCreateOpen, setModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [clienteSelected, setClienteSelected] = useState<any>(undefined);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el input de búsqueda

  async function loadClientes() {
    setLoading(true);
    const data = await fetchGET({
      url: "/api/clientes/all",
      error: "Error al obtener los clientes",
    });
    setClientes(data);
    setLoading(false);
  }

  useEffect(() => {
    loadClientes();
  }, [updateTable]);

  async function handleEliminar(id: number) {
    const data = await fetchPOST({
      url: "/api/clientes/delete",
      body: { id },
      error: "Error al eliminar el cliente",
    });
    if (data.id) {
      setUpdateTable(!updateTable);
      successAlert("Éxito", "Cliente eliminado correctamente", "success");
    } else {
      errorAlert("Error", "Error al eliminar el cliente");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <CircularProgress />
      </div>
    );
  }

  // Filtrar clientes por nombre, correo o NIT (la búsqueda es insensible a mayúsculas/minúsculas)
  const filteredClientes = clientes.filter((cliente: any) => {
    const search = searchTerm.toLowerCase();
    return (
      cliente.nombre.toLowerCase().includes(search) ||
      cliente.correo.toLowerCase().includes(search) ||
      (cliente.NIT && String(cliente.NIT).toLowerCase().includes(search))
    );
  });

  return (
    <div>
      <CreateClientModal
        handleModalClose={handleModalCreateClose}
        isModalOpen={isModalCreateOpen}
        updateTable={updateTable}
        setUpdateTable={setUpdateTable}
      />
      <UpdateClientModal
        handleModalClose={handleModalUpdateClose}
        isModalOpen={isModalUpdateOpen}
        cliente={clienteSelected}
        updateTable={updateTable}
        setUpdateTable={setUpdateTable}
      />
      <div className="flex flex-col items-center">
        {/* Encabezado y botón para crear cliente */}
        <div className="flex flex-col items-center max-w-4xl w-full space-y-4">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-3xl font-bold my-8 text-center text-[#1a47b8]">
              Tabla de Clientes
            </h1>
            <Button
              className="bg-[#1a47b8]"
              onClick={handleModalCreateOpen}
            >
              + Crear cliente
            </Button>
          </div>
          {/* Input de búsqueda */}
          <div className="w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, correo o NIT"
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        {/* Tabla de clientes */}
        <div className="w-full max-w-4xl border rounded-lg shadow-lg overflow-hidden bg-white px-4 py-1 mt-4">
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
              {filteredClientes && filteredClientes.length > 0 ? (
                filteredClientes.map((cliente: any) => (
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
                          onClick={() => {
                            setClienteSelected(cliente);
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
                              "Eliminar cliente",
                              "¿Estás seguro de eliminar este cliente?, se eliminarán las ventas asociadas al cliente"
                            );
                            responseSubmit.then((confirmed) => {
                              if (confirmed) {
                                handleEliminar(cliente.id);
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
                    No hay registros
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

export default TablaClientes;
