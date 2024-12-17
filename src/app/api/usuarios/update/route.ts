import { NextResponse } from "next/server";
import { prisma } from "@/lib/config/prisma";
import { Prisma } from "@prisma/client";
import { verifyToken } from "@/lib/utils/verifyToken";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const decoded = verifyToken(authHeader || "");

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a este recurso" },
        { status: 403 }
      );
    }

    const { id, nombre, apellido } =
      await request.json();
    const updateUsuario = await prisma.usuario.update({
      where: {
        id: Number(id),
      },
      data: {
        nombre,
        apellido,
      },
    });

    return NextResponse.json(updateUsuario);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "No se encontró el producto" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
