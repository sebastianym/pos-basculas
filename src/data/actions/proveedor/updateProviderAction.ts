"use server";
import { fetchPOST } from "@/data/services/fetchPOST";
import { schemaProvider } from "@/lib/schemas/schemaProvider";

export default async function updateProviderAction(
  prevState: any,
  formData: FormData
) {
  try {
    const validatedFields = schemaProvider.safeParse({
      id: formData.get("id"),
      nombre: formData.get("nombre"),
      direccion: formData.get("direccion"),
      telefono: formData.get("telefono"),
      correo: formData.get("correo"),
      NIT: formData.get("NIT"),
    });
    if (
      !validatedFields.success ||
      !validatedFields.data.nombre ||
      !validatedFields.data.direccion ||
      !validatedFields.data.telefono ||
      !validatedFields.data.correo ||
      !validatedFields.data.NIT
    ) {
      return {
        ...prevState,
        apiErrors: null,
        zodErrors: validatedFields.error?.flatten().fieldErrors,
        message: "Faltan campos por completar.",
      };
    }

    const responseData = await fetchPOST({
      url: "/api/proveedores/update",
      body: validatedFields.data,
      error: "Error al actualizar el proveedor.",
    });

    if (!responseData) {
      return {
        ...prevState,
        apiErrors: responseData.error,
        zodErrors: null,
        message: "Ocurrió un error. Por favor, intenta de nuevo.",
      };
    }

    if (responseData.error) {
      return {
        apiErrors: "Ocurrio un error al actualizar el proveedor.",
        zodErrors: null,
        message: "Error al actualizar el proveedor.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    throw error;
  }
}
