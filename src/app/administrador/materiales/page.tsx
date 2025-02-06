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
import CreateMaterialModal from "@/components/modals/materiales/createMaterialModal";
import UpdateMaterialModal from "@/components/modals/materiales/updateMaterialModal";
import { CircularProgress } from "@nextui-org/react";

function TablaMateriales() {
  const [materiales, setMateriales] = useState<any>([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [isModalCreateOpen, setModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [materialSelected, setMaterialSelected] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);
  async function loadMateriales() {
    const data = await fetchGET({
      url: "/api/materiales/all",
      error: "Error al obtener los materiales",
    });
    setMateriales(data);
    setLoading(false);
  }

  useEffect(() => {
    loadMateriales();
  }, [updateTable]);

  async function handleEliminar(id: number) {
    const data = await fetchPOST({
      url: "/api/materiales/delete",
      body: { id },
      error: "Error al eliminar el material",
    });
    if (data.id) {
      setUpdateTable(!updateTable);
      successAlert("Éxito", "Material eliminado correctamente", "success");
    } else {
      errorAlert("Error", "Error al eliminar el material");
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

  return (
    <div>
      <CreateMaterialModal
        handleModalClose={handleModalCreateClose}
        isModalOpen={isModalCreateOpen}
        updateTable={updateTable}
        setUpdateTable={setUpdateTable}
      />
      <UpdateMaterialModal
        handleModalClose={handleModalUpdateClose}
        isModalOpen={isModalUpdateOpen}
        material={materialSelected}
        updateTable={updateTable}
        setUpdateTable={setUpdateTable}
      />
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-evenly space-y-2 max-w-4xl">
          <h1 className="text-3xl font-bold m-8 text-center text-[#1a47b8]">
            Tabla de Materiales
          </h1>
          <Button
            className="bg-[#1a47b8]"
            onClick={() => {
              handleModalCreateOpen();
            }}
          >
            + Crear material
          </Button>
        </div>
        <div className="w-full max-w-4xl border rounded-lg shadow-lg overflow-hidden bg-white px-4 py-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio por Kg</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materiales && materiales.length ? (
                materiales.map((material: any) => (
                  <TableRow key={material.id}>
                    <TableCell>{material.nombre}</TableCell>
                    <TableCell>{material.precioPorKg}</TableCell>
                    <TableCell>
                      <div className="flex justify-start space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setMaterialSelected(material);
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
                              "Eliminar material",
                              "¿Estás seguro de eliminar este material?, se eliminaran las compras y ventas asociadas al material"
                            );
                            responseSubmit.then((confirmed) => {
                              if (confirmed) {
                                handleEliminar(material.id.toString());
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
                  <TableCell colSpan={3} className="text-center">
                    No hay materiales registrados
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

export default TablaMateriales;
