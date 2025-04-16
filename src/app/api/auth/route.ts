import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/config/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    const { identificador, password } = await request.json();

    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "Ocurrió un error en la autenticación del lado del servidor" },
        { status: 500 }
      );
    }

    const user = await prisma.usuario.findUnique({
      where: { identificador },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    if (!user.activo) {
      return NextResponse.json(
        { error: "El usuario no se encuentra activo" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.contrasena);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    let token;

    token = jwt.sign({ id: user.id, role: user.rol }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const userData = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      identificador: user.identificador,
      rol: user.rol,
    };

    return NextResponse.json({ jwt: token, user: userData });
  } catch (error) {
    console.error("Se ha producido un error en la autenticación:", error);
    return NextResponse.json(
      { error: "Error al autenticar el usuario" },
      { status: 500 }
    );
  }
}
