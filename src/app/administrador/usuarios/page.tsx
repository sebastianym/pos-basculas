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
import CreateUserModal from "@/components/modals/usuarios/createUserModal";
import UpdateUserModal from "@/components/modals/usuarios/updateUserModal";

function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState<any>([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [isModalCreateOpen, setModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [usuarioSelected, setUsuarioSelected] = useState<any>(undefined);
  async function loadUsuarios() {
    const data = await fetchGET({
      url: "/api/usuarios/all",
      error: "Error al obtener los usuarios",
    });
    setUsuarios(data);
  }

  useEffect(() => {
    loadUsuarios();
  }, [updateTable]);

  async function handleEliminar(id: number) {
    const data = await fetchPOST({
      url: "/api/usuarios/delete",
      body: { id },
      error: "Error al eliminar el capítulo",
    });
    if (data.id) {
      setUpdateTable(!updateTable);
      successAlert("Éxito", "Usuario eliminado correctamente", "success");
    } else {
      errorAlert("Error", "Error al eliminar el usuario");
    }
  }

  const handleModalCreateClose = () => {
    setModalCreateOpen(false);
  };

  const handleModalCreateOpen = () => {
    setModalCreateOpen(true);
  };

  const handleModalUpdateClose = () => {
    setUsuarioSelected(undefined);
    setModalUpdateOpen(false);
  };

  const handleModalUpdateOpen = () => {
    setModalUpdateOpen(true);
  };

  return (
    <div>
      <CreateUserModal
        handleModalClose={handleModalCreateClose}
        isModalOpen={isModalCreateOpen}
        updateTable={updateTable}
        setUpdateTable={setUpdateTable}
      />
      <UpdateUserModal
        handleModalClose={handleModalUpdateClose}
        isModalOpen={isModalUpdateOpen}
        usuario={usuarioSelected}
        updateTable={updateTable}
        setUpdateTable={setUpdateTable}
      />
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-evenly space-y-2 max-w-4xl">
          <h1 className="text-3xl font-bold m-8 text-center text-[#1a47b8]">
            Tabla de Usuarios
          </h1>
          <Button
            className="bg-[#1a47b8]"
            onClick={() => {
              handleModalCreateOpen();
            }}
          >
            + Crear usuario
          </Button>
        </div>
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
              {usuarios && usuarios.length > 0 ? (
                usuarios.map((usuario: any) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.apellido}</TableCell>
                    <TableCell>{usuario.identificador}</TableCell>
                    <TableCell>
                      <div className="flex justify-start space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUsuarioSelected(usuario);
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
                              "Eliminar usuario",
                              "¿Estás seguro de eliminar este usuario?, se eliminaran las ventas y compras asociadas al usuario"
                            );
                            responseSubmit.then((confirmed) => {
                              if (confirmed) {
                                handleEliminar(usuario.id.toString());
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
                  <TableCell colSpan={4} className="text-center">
                    No hay usuarios
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

export default TablaUsuarios;
