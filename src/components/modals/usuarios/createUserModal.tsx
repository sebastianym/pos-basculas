import createUserAction from "@/data/actions/usuarios/createUserAction";
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

function CreateProductModal({
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
  const [formState, formAction] = useFormState(createUserAction, INITIAL_STATE);

  useEffect(() => {
    if (formState.message === "Usuario creado correctamente") {
      setUpdateTable(!updateTable);
      successAlert(
        "Éxito",
        "Usuario creado correctamente. Redirigiendo a la lista de usuarios.",
        "success"
      );
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
                Crear Usuario
              </h2>
            </div>
            <div className="mt-4">
              <form action={formAction}>
                <div className="mb-4">
                  <label htmlFor="nombre">
                    <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                      Nombre
                    </p>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingresa el nombre del usuario"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.nombre} />
                </div>

                <div className="mb-4">
                  <label htmlFor="apellido">
                    <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                      Apellido
                    </p>
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    placeholder="Ingresa el apellido del usuario"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.apellido} />
                </div>

                <div className="mb-4">
                  <label htmlFor="identificador">
                    <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                      Identificador
                    </p>
                  </label>
                  <input
                    type="text"
                    id="identificador"
                    name="identificador"
                    placeholder="Ingresa el identificador del usuario"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.identificador} />
                </div>

                <div className="mb-4">
                  <label htmlFor="contrasena">
                    <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                      Contraseña
                    </p>
                  </label>
                  <input
                    type="text"
                    id="contrasena"
                    name="contrasena"
                    placeholder="Ingresa la contraseña del usuario"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.contrasena} />
                </div>

                <div className="mb-4">
                  <label htmlFor="contrasena">
                    <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                      Confirma tu Contraseña
                    </p>
                  </label>
                  <input
                    type="text"
                    id="confirmarContrasena"
                    name="confirmarContrasena"
                    placeholder="Ingresa la contraseña del usuario"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors
                    error={formState?.zodErrors?.confirmarContrasena}
                  />
                </div>

                <div className="mt-5 transition-all flex justify-between">
                  <SubmitButton
                    text="Crear usuario"
                    color="blue"
                    loadingText="Creando usuario..."
                    className="px-10"
                    size="medium"
                  />
                  <ApiErrors error={formState.apiErrors} />
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => {
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

export default CreateProductModal;
