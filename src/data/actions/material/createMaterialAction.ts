"use server";
import { fetchPOST } from "@/data/services/fetchPOST";
import { schemaMaterial } from "@/lib/schemas/schemaMaterial";

export default async function createMaterialAction(
  prevState: any,
  formData: FormData
) {
  try {
    const validatedFields = schemaMaterial.safeParse({
      nombre: formData.get("nombre"),
      precioPorKg: Number(formData.get("precioPorKg")),
    });
    console.log(validatedFields);
    console.log(validatedFields.error);
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
      url: "/api/materiales/create",
      body: validatedFields.data,
      error: "Error al crear el material.",
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
        apiErrors: "Ocurrio un error al crear el material.",
        zodErrors: null,
        message: "Error al crear el material.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error al crear el material:", error);
    throw error;
  }
}
