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

    const { id, nombre, direccion, telefono, correo, NIT } =
      await request.json();

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

    const updateCliente = await prisma.companiaCliente.update({
      where: {
        id: Number(id),
      },
      data: {
        nombre,
        direccion,
        telefono,
        correo,
        NIT,
      },
    });

    return NextResponse.json(updateCliente);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "No se encontró el cliente" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
