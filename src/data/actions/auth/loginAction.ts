"use server";

import { loginService } from "@/data/services/auth/loginService";
import { config } from "@/lib/config/auth/cookieConfig";
import { schemaLogin } from "@/lib/schemas/schemaLogin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginAction = async (prevState: any, formData: FormData) => {
  let redirectPath: string | null = null;

  try {
    const validatedFields = schemaLogin.safeParse({
      identificador: formData.get("identificador"),
      password: formData.get("password"),
    });

    if (
      !validatedFields.success ||
      !validatedFields.data.identificador ||
      !validatedFields.data.password
    ) {
      return {
        ...prevState,
        apiErrors: null,
        zodErrors: validatedFields.error?.flatten().fieldErrors,
        message: "Faltan campos por completar. No se pudo iniciar sesión.",
      };
    }

    const responseData = await loginService({
      identificador: validatedFields.data.identificador,
      password: validatedFields.data.password,
    });

    if (!responseData) {
      return {
        ...prevState,
        zodErrors: null,
        message: "Ocurrió un error. Por favor, intenta de nuevo.",
      };
    }

    if (responseData.error) {
      return {
        ...prevState,
        apiErrors: responseData.error,
        zodErrors: null,
        message: "Error al iniciar sesión.",
      };
    }
    if (responseData.jwt) {
      cookies().set("jwt", responseData.jwt, config);
      if (responseData.user.rol === "ADMIN") {
        redirectPath = `/administrador/usuarios`;
      } else if (responseData.user.rol === "USER") {
        redirectPath = `/dashboard/compraMaterial`;
      }
    }
  } catch (error) {
    console.error("Login action error:", error);
    throw error;
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
};
