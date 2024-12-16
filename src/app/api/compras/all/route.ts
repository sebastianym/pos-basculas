import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/utils/verifyToken";
import { prisma } from "@/lib/config/prisma";

export async function GET(request: Request) {
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

    const compras = await prisma.compra.findMany({
      include: {
        material: true,
        usuario: true,
        proveedor: true,
      },
    });

    if (!compras) {
      return NextResponse.json(compras, { status: 404 });
    }

    return NextResponse.json(compras);
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
