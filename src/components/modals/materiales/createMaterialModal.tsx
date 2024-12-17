import createMaterialAction from "@/data/actions/material/createMaterialAction";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { ZodErrors } from "@/components/custom/ZodErrors";
import { ApiErrors } from "@/components/custom/ApiErrors";
import { SubmitButton } from "@/components/custom/SubmitButton";
import { successAlert } from "@/lib/utils/alerts/successAlert";

const INITIAL_STATE = {
  apiErrors: null,
  zodErrors: null,
  data: null,
  message: null,
};

function CreateMaterialModal({
  isModalOpen,
  handleModalClose,
  updateTable,
  setUpdateTable,
}: {
  isModalOpen: boolean;
  handleModalClose: () => void;
  updateTable: boolean;
  setUpdateTable: (value: boolean) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [precioPorKg, setPrecioPorKg] = useState("");

  const [formState, formAction] = useFormState(
    createMaterialAction,
    INITIAL_STATE
  );

  const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(event.target.value);
  };

  const handlePrecioPorKgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrecioPorKg(event.target.value);
  };

  useEffect(() => {
    if (formState.success) {
      setUpdateTable(!updateTable);
      successAlert(
        "Éxito",
        "Material creado correctamente. Redirigiendo a la lista de materiales.",
        "success"
      );
      setNombre("");
      setPrecioPorKg("");
      handleModalClose();
    }
  }, [formState]);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center pb-2">
              <h2 className="text-xl text-black font-semibold">
                Crear Material
              </h2>
            </div>
            <div className="mt-4">
              <form action={formAction}>
                <div className="mb-4">
                  <label htmlFor="nombre">
                  <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                    Nombre:
                  </p>
                  </label>
                  <input
                  onChange={handleNombreChange}
                  type="text"
                  id="nombre"
                  value={nombre}
                  autoComplete="off"
                  name="nombre"
                  placeholder="Ingresa el nombre del material"
                  className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.nombre} />
                </div>

                <div className="mb-4">
                  <label htmlFor="precioPorKg">
                  <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                    Precio por Kg:
                  </p>
                  </label>
                  <input
                  onChange={handlePrecioPorKgChange}
                  type="text"
                  id="precioPorKg"
                  value={precioPorKg}
                  autoComplete="off"
                  name="precioPorKg"
                  placeholder="Ingresa el precio por Kg del material"
                  className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.precioPorKg} />
                </div>

                <div className="mt-5 transition-all flex justify-between">
                  <SubmitButton
                    text="Crear material"
                    color="blue"
                    loadingText="Creando material..."
                    className="px-10"
                    size="medium"
                  />
                  <ApiErrors error={formState.apiErrors} />
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => {
                      setNombre("");
                      setPrecioPorKg("");
                      handleModalClose();
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateMaterialModal;
