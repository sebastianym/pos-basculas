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

    // Verificar si la companiaCliente existe
    const companiaCliente = await prisma.companiaCliente.findUnique({
      where: { id: Number(id) },
      include: {
        ventas: true,
      },
    });

    if (!companiaCliente) {
      return NextResponse.json(
        { message: "No se encontró la compañía cliente" },
        { status: 404 }
      );
    }

    // Eliminar las relaciones (ventas) de la companiaCliente
    await prisma.venta.deleteMany({
      where: { companiaClienteId: Number(id) },
    });

    // Eliminar la companiaCliente
    const clienteEliminado = await prisma.companiaCliente.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(clienteEliminado);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "No se encontró la compañía cliente" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Error inesperado al eliminar la compañía cliente" },
      { status: 500 }
    );
  }
}
