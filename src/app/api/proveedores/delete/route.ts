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

    // Verificar si el proveedor existe
    const proveedor = await prisma.proveedor.findUnique({
      where: { id: Number(id) },
      include: { compras: true },
    });

    if (!proveedor) {
      return NextResponse.json(
        { message: "No se encontró el proveedor" },
        { status: 404 }
      );
    }

    // Eliminar las relaciones de compras
    try {
      await prisma.compra.deleteMany({ where: { proveedorId: Number(id) } });
    } catch (relationError) {
      console.error("Error eliminando compras:", relationError);
      return NextResponse.json(
        { message: "Error eliminando las compras asociadas al proveedor" },
        { status: 500 }
      );
    }

    // Eliminar el proveedor
    try {
      const proveedorEliminado = await prisma.proveedor.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json(proveedorEliminado);
    } catch (deleteError) {
      console.error("Error eliminando proveedor:", deleteError);
      return NextResponse.json(
        { message: "Error al eliminar el proveedor" },
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
