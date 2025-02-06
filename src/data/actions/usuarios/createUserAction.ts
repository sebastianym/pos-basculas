"use server";
import { fetchPOST } from "@/data/services/fetchPOST";
import { schemaUsuario } from "@/lib/schemas/schemaUsuario";

export default async function createUserAction(
  prevState: any,
  formData: FormData
) {
  try {
    const validatedFields = schemaUsuario.safeParse({
      nombre: formData.get("nombre"),
      apellido: formData.get("apellido"),
      identificador: formData.get("identificador"),
      contrasena: formData.get("contrasena"),
    });

    if (
      !validatedFields.success ||
      !validatedFields.data.nombre ||
      !validatedFields.data.apellido ||
      !validatedFields.data.identificador ||
      !validatedFields.data.contrasena
    ) {
      return {
        ...prevState,
        apiErrors: null,
        zodErrors: validatedFields.error?.flatten().fieldErrors,
        message: "Faltan campos por completar.",
      };
    }

    const responseData = await fetchPOST({
      url: "/api/usuarios/create",
      body: validatedFields.data,
      error: "Error al crear el usuario.",
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

    if (responseData.error) {
      return {
        apiErrors: "Ocurrio un error al crear el usuario.",
        zodErrors: null,
        message: "Error al crear el usuario.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
}
