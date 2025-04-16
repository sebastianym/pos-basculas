"use server";
import { fetchPOST } from "@/data/services/fetchPOST";
import { schemaUsuarioUpdate } from "@/lib/schemas/schemaUsuarioUpdate";

export default async function updateUserAction(
  prevState: any,
  formData: FormData
) {
  try {
    const validatedFields = schemaUsuarioUpdate.safeParse({
      id: formData.get("id"),
      nombre: formData.get("nombre"),
      apellido: formData.get("apellido"),
      contrasena: formData.get("contrasena"),
    });

    if (
      !validatedFields.success ||
      !validatedFields.data.nombre ||
      !validatedFields.data.apellido
    ) {
      return {
        ...prevState,
        apiErrors: null,
        zodErrors: validatedFields.error?.flatten().fieldErrors,
        message: "Faltan campos por completar.",
      };
    }
    console.log(validatedFields.data);
    if (
      validatedFields.data.contrasena &&
      validatedFields.data.contrasena.length < 6
    ) {
      return {
        ...prevState,
        apiErrors: null,
        zodErrors: {
          contrasena: ["La contraseña debe tener al menos 6 caracteres"],
        },
        message: "Faltan campos por completar.",
      };
    }

    const responseData = await fetchPOST({
      url: "/api/usuarios/update",
      body: validatedFields.data,
      error: "Error al actualizar el usuario.",
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
        apiErrors: "Ocurrio un error al actualizar el usuario.",
        zodErrors: null,
        message: "Error al actualizar el usuario.",
      };
    }

    return {
      ...prevState,
      apiErrors: null,
      zodErrors: null,
      message: "Usuario actualizado correctamente",
    };
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
}
