import createProviderAction from "@/data/actions/proveedor/createProviderAction";
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

function CreateProviderModal({
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
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [nit, setNit] = useState("");

  const [formState, formAction] = useFormState(
    createProviderAction,
    INITIAL_STATE
  );

  const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(event.target.value);
  };

  const handleDireccionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDireccion(event.target.value);
  };

  const handleTelefonoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTelefono(event.target.value);
  };

  const handleCorreoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCorreo(event.target.value);
  };

  const handleNitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNit(event.target.value);
  };

  useEffect(() => {
    if (formState.success) {
      setUpdateTable(!updateTable);
      successAlert(
        "Éxito",
        "Proveedor creado correctamente. Redirigiendo a la lista de proveedores.",
        "success"
      );
      setNombre("");
      setDireccion("");
      setTelefono("");
      setCorreo("");
      setNit("");
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
                Crear Proveedor
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
                    placeholder="Ingresa el nombre del proveedor"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.nombre} />
                </div>

                <div className="mb-4">
                  <label htmlFor="direccion">
                    <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                      Dirección:
                    </p>
                  </label>
                  <input
                    onChange={handleDireccionChange}
                    type="text"
                    id="direccion"
                    value={direccion}
                    autoComplete="off"
                    name="direccion"
                    placeholder="Ingresa la dirección del proveedor"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.direccion} />
                </div>

                <div className="mb-4">
                  <label htmlFor="telefono">
                    <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                      Teléfono:
                    </p>
                  </label>
                  <input
                    onChange={handleTelefonoChange}
                    type="text"
                    id="telefono"
                    value={telefono}
                    autoComplete="off"
                    name="telefono"
                    placeholder="Ingresa el teléfono del proveedor"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.telefono} />
                </div>

                <div className="mb-4">
                  <label htmlFor="correo">
                    <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                      Correo:
                    </p>
                  </label>
                  <input
                    onChange={handleCorreoChange}
                    type="text"
                    id="correo"
                    value={correo}
                    autoComplete="off"
                    name="correo"
                    placeholder="Ingresa el correo del proveedor"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.correo} />
                </div>

                <div className="mb-4">
                  <label htmlFor="NIT">
                    <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                      NIT:
                    </p>
                  </label>
                  <input
                    onChange={handleNitChange}
                    type="text"
                    id="NIT"
                    value={nit}
                    autoComplete="off"
                    name="NIT"
                    placeholder="Ingresa el NIT del proveedor"
                    className="w-full min-w-0 rounded-md text-black bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-2.5"
                  />
                  <ZodErrors error={formState?.zodErrors?.NIT} />
                </div>

                <div className="mt-5 transition-all flex justify-between">
                  <SubmitButton
                    text="Crear proveedor"
                    color="blue"
                    loadingText="Creando proveedor..."
                    className="px-10"
                    size="medium"
                  />
                  <ApiErrors error={formState.apiErrors} />
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => {
                      setNombre("");
                      setDireccion("");
                      setTelefono("");
                      setCorreo("");
                      setNit("");
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

export default CreateProviderModal;
