"use server";

import { loginService } from "@/data/services/auth/loginService";
import { config } from "@/lib/config/auth/cookieConfig";
import { schemaLogin } from "@/lib/schemas/schemaLogin";
import { error } from "console";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginAction = async (prevState: any, formData: FormData) => {
  let redirectPath: string | null = null;

  try {
    const validatedFields = schemaLogin.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (
      !validatedFields.success ||
      !validatedFields.data.email ||
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
      email: validatedFields.data.email,
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
      redirectPath = `/cliente`;
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
