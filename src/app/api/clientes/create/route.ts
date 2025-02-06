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

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a este recurso" },
        { status: 403 }
      );
    }

    const { nombre, direccion, telefono, correo, NIT } = await request.json();

    // Comprobar si ya existe un cliente con el mismo NIT
    const existingClient = await prisma.companiaCliente.findUnique({
      where: { NIT },
    });

    if (existingClient) {
      return NextResponse.json(
        { error: "El identificador (NIT) ya existe" },
        { status: 400 }
      );
    }

    const nuevoCliente = await prisma.companiaCliente.create({
      data: {
        nombre,
        direccion,
        telefono,
        correo,
        NIT,
      },
    });
    return NextResponse.json(nuevoCliente);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Error desconocido" },
      { status: 500 }
    );
  }
}
