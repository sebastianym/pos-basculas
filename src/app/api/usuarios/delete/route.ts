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

    const { id } = await request.json();

    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      include: {
        ventas: true,
        compras: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { message: "No se encontró el usuario" },
        { status: 404 }
      );
    }

    // Eliminar las relaciones (ventas y compras) del usuario
    await prisma.$transaction([
      prisma.venta.deleteMany({
        where: { usuarioId: Number(id) },
      }),
      prisma.compra.deleteMany({
        where: { usuarioId: Number(id) },
      }),
    ]);

    // Eliminar el usuario
    const usuarioEliminado = await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(usuarioEliminado);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "No se encontró el usuario" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Error inesperado al eliminar el usuario" },
      { status: 500 }
    );
  }
}
