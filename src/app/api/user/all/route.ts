export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/config/prisma";
import { verifyToken } from "@/lib/utils/verifyToken";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const decoded = verifyToken(authHeader || "");

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.usuario.findUnique({
      where: { id: parseInt(decoded.id) },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        identificador: true,
        rol: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error al obtener datos del usuario/cliente:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
