"use server";
import { fetchPOST } from "@/data/services/fetchPOST";
import { schemaCliente } from "@/lib/schemas/schemaCliente";

export default async function updateClienteAction(
  prevState: any,
  formData: FormData
) {
  try {
    const validatedFields = schemaCliente.safeParse({
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
      url: "/api/clientes/update",
      body: validatedFields.data,
      error: "Error al actualizar el cliente.",
    });

    // Si la API responde con un error (por ejemplo, NIT duplicado) lo devolvemos
    if (responseData?.error) {
      return {success: false, message: responseData.error};
    }

    if (!responseData) {
      return {
        ...prevState,
        apiErrors: responseData.error,
        zodErrors: null,
        message: "Ocurrió un error. Por favor, intenta de nuevo.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    throw error;
  }
}
