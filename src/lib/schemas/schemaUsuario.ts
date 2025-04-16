import { z } from "zod";

export const schemaUsuario = z.object({
  nombre: z
    .string({
      message: "El nombre del usuario es requerido",
    })
    .min(3, {
      message: "El nombre del usuario debe tener al menos 3 caracteres",
    })
    .max(255, {
      message: "El nombre del usuario debe tener como máximo 255 caracteres",
    }),
  apellido: z
    .string({
      message: "El apellido del usuario es requerido",
    })
    .min(3, {
      message: "El apellido del usuario debe tener al menos 3 caracteres",
    })
    .max(255, {
      message: "El apellido del usuario debe tener como máximo 255 caracteres",
    }),
  identificador: z
    .string({
      message: "El identificador del usuario es requerido",
    })
    .min(6, {
      message: "El identificador del usuario debe tener al menos 6 caracteres",
    })
    .max(255, {
      message:
        "El identificador del usuario debe tener como máximo 255 caracteres",
    }),
  contrasena: z
    .string({
      message: "La contraseña del usuario es requerida",
    })
    .min(6, {
      message: "La contraseña del usuario debe tener al menos 6 caracteres",
    }),
  confirmarContrasena: z
    .string({ message: "La confirmación de la contraseña es requerida" })
    .min(6, {
      message:
        "La confirmación de la contraseña debe tener al menos 6 caracteres",
    }),
});
