"use server";
import { fetchPOST } from "@/data/services/fetchPOST";
import { schemaMaterial } from "@/lib/schemas/schemaMaterial";

export default async function updateMaterialAction(
  prevState: any,
  formData: FormData
) {
  try {
    const validatedFields = schemaMaterial.safeParse({
      id: formData.get("id"),
      nombre: formData.get("nombre"),
      precioPorKg: Number(formData.get("precioPorKg")),
    });
    if (
      !validatedFields.success ||
      !validatedFields.data.nombre ||
      !validatedFields.data.precioPorKg
    ) {
      return {
        ...prevState,
        apiErrors: null,
        zodErrors: validatedFields.error?.flatten().fieldErrors,
        message: "Faltan campos por completar.",
      };
    }

    const responseData = await fetchPOST({
      url: "/api/materiales/update",
      body: validatedFields.data,
      error: "Error al actualizar el material.",
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
        apiErrors: "Ocurrio un error al actualizar el material.",
        zodErrors: null,
        message: "Error al actualizar el material.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar el material:", error);
    throw error;
  }
}
