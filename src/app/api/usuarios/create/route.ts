import { NextResponse } from "next/server";
import { prisma } from "@/lib/config/prisma";
import { verifyToken } from "@/lib/utils/verifyToken";
import bcrypt from "bcryptjs";

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

    const { nombre, apellido, identificador, contrasena } =
      await request.json();

    // Comprobar si ya existe un cliente con el mismo Identificador
    const existingUser = await prisma.usuario.findUnique({
      where: { identificador },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El identificador ya existe" },
        { status: 400 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        identificador,
        contrasena: hashedPassword,
        rol: "USER",
      },
    });
    return NextResponse.json(nuevoUsuario);
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
