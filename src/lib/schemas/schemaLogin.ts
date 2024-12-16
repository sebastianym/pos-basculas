import { z } from "zod";

export const schemaLogin = z.object({
  identificador: z
    .string()
    .min(3, {
      message: "El identificador debe tener por lo menos 3 caracteres",
    }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener por lo menos 6 caracteres" })
    .max(100, { message: "La contraseña debe tener entre 6 y 100 caracteres" }),
});
