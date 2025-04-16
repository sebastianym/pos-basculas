import { z } from "zod";

export const schemaUsuarioUpdate = z.object({
  id: z.string().nonempty(),
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
  contrasena: z
    .string({
      message: "La contraseña del usuario es requerida",
    })
    .optional(),
});
