export const dynamic = "force-dynamic";

import prisma from "@/lib/config/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

interface UserPayload extends JwtPayload {
  id: number;
  role: string;
  type: "user";
}

interface ClientPayload extends JwtPayload {
  id: number;
  type: "client";
}

export async function GET(request: Request) {
  try {
    if (JWT_SECRET === undefined) {
      return NextResponse.json(
        { error: "Ocurrió un error al comprobar la sesión" },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verificar el token JWT
    let decoded: UserPayload | ClientPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as UserPayload | ClientPayload;
    } catch (error) {
      return NextResponse.json(
        { error: "Token de autenticación inválido" },
        { status: 401 }
      );
    }

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ decoded });
  } catch (error) {
    console.error("Error al obtener datos del usuario/cliente:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
