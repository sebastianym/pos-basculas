import { z } from "zod";

export const schemaProvider = z.object({
  id: z.string().optional(),
  nombreProveedor: z
    .string({
      message: "El nombre del proveedor es requerido",
    })
    .min(3, {
      message: "El nombre del proveedor debe tener al menos 3 caracteres",
    })
    .max(255, {
      message: "El nombre del proveedor debe tener como máximo 255 caracteres",
    }),
  direccion: z
    .string({
      message: "La dirección del proveedor es requerida",
    })
    .min(5, {
      message: "La dirección del proveedor debe tener al menos 5 caracteres",
    })
    .max(255, {
      message:
        "La dirección del proveedor debe tener como máximo 255 caracteres",
    }),
  telefono: z
    .string({
      message: "El teléfono del proveedor es requerido",
    })
    .min(7, {
      message: "El teléfono del proveedor debe tener al menos 7 caracteres",
    })
    .max(15, {
      message: "El teléfono del proveedor debe tener como máximo 15 caracteres",
    }),
  correo: z
    .string({
      message: "El correo del proveedor es requerido",
    })
    .email({
      message: "El correo del proveedor debe ser un correo válido",
    }),
  NIT: z
    .string({
      message: "El NIT del proveedor es requerido",
    })
    .min(6, {
      message: "El NIT del proveedor debe tener al menos 6 caracteres",
    })
    .max(20, {
      message: "El NIT del proveedor debe tener como máximo 20 caracteres",
    }),
});
