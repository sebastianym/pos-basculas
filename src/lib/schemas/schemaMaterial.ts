import { z } from "zod";

export const schemaMaterial = z.object({
    id: z.string().optional(),
    nombre: z
        .string({
            message: "El nombre del material es requerido",
        })
        .min(3, {
            message: "El nombre del material debe tener al menos 3 caracteres",
        })
        .max(255, {
            message: "El nombre del material debe tener como máximo 255 caracteres",
        }),
    precioPorKg: z
        .number({
            message: "El precio por kg del material es requerido",
        })
        .positive({
            message: "El precio por kg del material debe ser un número positivo",
        }),
});
