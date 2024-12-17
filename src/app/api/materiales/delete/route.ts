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

    // Verificar si el material existe
    const material = await prisma.material.findUnique({
      where: { id: Number(id) },
      include: {
        ventas: true,
        compras: true,
      },
    });

    if (!material) {
      return NextResponse.json(
        { message: "No se encontró el material" },
        { status: 404 }
      );
    }

    // Eliminar las relaciones asociadas
    try {
      // Eliminar todas las ventas asociadas al material
      await prisma.venta.deleteMany({
        where: { materialId: Number(id) },
      });

      // Eliminar todas las compras asociadas al material
      await prisma.compra.deleteMany({
        where: { materialId: Number(id) },
      });
    } catch (relationError) {
      console.error("Error eliminando relaciones:", relationError);
      return NextResponse.json(
        { message: "Error eliminando las relaciones asociadas al material" },
        { status: 500 }
      );
    }

    // Eliminar el material
    try {
      const materialEliminado = await prisma.material.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json(materialEliminado);
    } catch (deleteError) {
      console.error("Error eliminando material:", deleteError);
      return NextResponse.json(
        { message: "Error al eliminar el material" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { message: "Error inesperado al procesar la solicitud" },
      { status: 500 }
    );
  }
}
