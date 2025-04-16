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
import { CircularProgress } from "@nextui-org/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function TablaUsuarios() {
  const [usuariosActivos, setUsuariosActivos] = useState<any>([]);
  const [usuariosNoActivos, setUsuariosNoActivos] = useState<any>([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [isModalCreateOpen, setModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [usuarioSelected, setUsuarioSelected] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);

  async function loadUsuarios() {
    const data = await fetchGET({
      url: "/api/usuarios/all",
      error: "Error al obtener los usuarios",
    });
    const usuariosActivos = data.filter((usuario: any) => usuario.activo);
    const usuariosNoActivos = data.filter((usuario: any) => !usuario.activo);
    setUsuariosActivos(usuariosActivos);
    setUsuariosNoActivos(usuariosNoActivos);
    setLoading(false);
  }

  useEffect(() => {
    loadUsuarios();
  }, [updateTable]);

  async function handleEliminar(id: number) {
    const data = await fetchPOST({
      url: "/api/usuarios/delete",
      body: { id },
      error: "Error al eliminar el usuario",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
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

      <div className="flex flex-col w-3/4 items-center space-y-2">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-3xl font-bold my-5 text-center text-[#1a47b8]">
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

        <Tabs
          defaultValue="active"
          className="w-full flex-col items-center justify-center"
        >
          <TabsList>
            <TabsTrigger value="active">Usuarios activos</TabsTrigger>
            <TabsTrigger value="no-active">Usuarios desactivados</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <div className="flex flex-col items-center">
              <div className="w-full border rounded-lg shadow-lg overflow-hidden bg-white px-4 py-1">
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
                    {usuariosActivos && usuariosActivos.length > 0 ? (
                      usuariosActivos.map((usuario: any) => (
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
                                    "Desactivar usuario",
                                    "¿Estás seguro de desactivar este usuario?, no podrá acceder al sistema"
                                  );
                                  responseSubmit.then((confirmed) => {
                                    if (confirmed) {
                                      handleEliminar(usuario.id.toString());
                                    }
                                  });
                                }}
                                className="px-2 py-1 text-xs"
                              >
                                Desactivar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No hay usuarios activos registrados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="no-active">
            <div className="flex flex-col items-center">
              <div className="w-full border rounded-lg shadow-lg overflow-hidden bg-white px-4 py-1">
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
                    {usuariosNoActivos && usuariosNoActivos.length > 0 ? (
                      usuariosNoActivos.map((usuario: any) => (
                        <TableRow key={usuario.id}>
                          <TableCell>{usuario.nombre}</TableCell>
                          <TableCell>{usuario.apellido}</TableCell>
                          <TableCell>{usuario.identificador}</TableCell>
                          <TableCell>
                            <div className="flex justify-start space-x-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={async () => {
                                  const responseSubmit = confirmAlert(
                                    "Activar usuario",
                                    "¿Estás seguro de activar este usuario?"
                                  );
                                  responseSubmit.then((confirmed) => {
                                    if (confirmed) {
                                      handleEliminar(usuario.id.toString());
                                    }
                                  });
                                }}
                                className="px-2 py-1 text-xs bg-green-600"
                              >
                                Activar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No hay usuarios desactivados registrados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default TablaUsuarios;
