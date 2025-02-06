import { NextResponse } from "next/server";
import { prisma } from "@/lib/config/prisma";
import { verifyToken } from "@/lib/utils/verifyToken";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const decoded = verifyToken(authHeader || "");

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (decoded.role !== "USER") {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a este recurso" },
        { status: 403 }
      );
    }

    const { valorVenta, materialId, usuarioId, companiaClienteId } =
      await request.json();

    const nuevaVenta = await prisma.venta.create({
      data: {
        valorVenta,
        hora: new Date(),
        fecha: new Date(),
        materialId,
        usuarioId,
        companiaClienteId,
      },
    });
    return NextResponse.json(nuevaVenta);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}
