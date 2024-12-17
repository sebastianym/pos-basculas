import updateUserAction from "@/data/actions/usuarios/updateUserAction";
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

function UpdateUserModal({
  isModalOpen,
  handleModalClose,
  usuario,
  updateTable,
  setUpdateTable,
}: {
  isModalOpen: boolean;
  handleModalClose: () => void;
  usuario: any;
  updateTable: boolean;
  setUpdateTable: (value: boolean) => void;
}) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [apellidoUsuario, setApellidoUsuario] = useState("");

  const [formState, formAction] = useFormState(updateUserAction, INITIAL_STATE);

  const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNombreUsuario(event.target.value);
  };

  const handleApellidoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApellidoUsuario(event.target.value);
  };

  useEffect(() => {
    if (usuario) {
      setNombreUsuario(usuario.nombre);
      setApellidoUsuario(usuario.apellido);
    }
  }, [usuario]);

  useEffect(() => {
    if (formState.success) {
      setUpdateTable(!updateTable);
      successAlert(
        "Éxito",
        "Usuario actualizado correctamente. Redirigiendo a la lista de usuarios.",
        "success"
      );
      setNombreUsuario("");
      setApellidoUsuario("");
      handleModalClose();
    }
  }, [formState]);
  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center pb-2">
              <h2 className="text-xl text-black font-semibold">
                Editar Usuario
              </h2>
            </div>
            <div className="mt-4">
              <form action={formAction}>
                <input type="hidden" name="id" defaultValue={usuario?.id} />
                <div className="mb-5">
                  <label htmlFor="nombre">
                    <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                      Nombre:
                    </p>
                  </label>
                  <input
                    onChange={handleNombreChange}
                    type="text"
                    id="nombre"
                    autoComplete="off"
                    name="nombre"
                    defaultValue={nombreUsuario}
                    placeholder="Ingresa el nombre del usuario"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.nombre} />
                </div>

                <div className="mb-5">
                  <label htmlFor="apellido">
                    <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                      Apellido:
                    </p>
                  </label>
                  <input
                    onChange={handleApellidoChange}
                    type="text"
                    id="apellido"
                    autoComplete="off"
                    name="apellido"
                    defaultValue={apellidoUsuario}
                    placeholder="Ingresa el apellido del usuario"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.apellido} />
                </div>

                <div className="mt-5 transition-all flex justify-between">
                  <SubmitButton
                    text="Actualizar usuario"
                    color="blue"
                    loadingText="Actualizando usuario..."
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

export default UpdateUserModal;
