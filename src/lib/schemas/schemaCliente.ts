import { z } from "zod";

export const schemaCliente = z.object({
  id: z.string().optional(),
  nombre: z
    .string({
      message: "El nombre del cliente es requerido",
    })
    .min(3, {
      message: "El nombre del cliente debe tener al menos 3 caracteres",
    })
    .max(255, {
      message: "El nombre del cliente debe tener como máximo 255 caracteres",
    }),
  direccion: z
    .string({
      message: "La dirección del cliente es requerida",
    })
    .min(5, {
      message: "La dirección del cliente debe tener al menos 5 caracteres",
    })
    .max(255, {
      message: "La dirección del cliente debe tener como máximo 255 caracteres",
    }),
  telefono: z
    .string({
      message: "El teléfono del cliente es requerido",
    })
    .min(7, {
      message: "El teléfono del cliente debe tener al menos 7 caracteres",
    })
    .max(15, {
      message: "El teléfono del cliente debe tener como máximo 15 caracteres",
    }),
  correo: z
    .string({
      message: "El correo del cliente es requerido",
    })
    .email({
      message: "El correo del cliente debe ser un correo válido",
    }),
  NIT: z
    .string({
      message: "El NIT del cliente es requerido",
    })
    .min(6, {
      message: "El NIT del cliente debe tener al menos 6 caracteres",
    })
    .max(20, {
      message: "El NIT del cliente debe tener como máximo 20 caracteres",
    }),
});
