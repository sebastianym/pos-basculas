import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/config/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!JWT_SECRET) {
    return NextResponse.json(
      { error: "Ocurrió un error en la autenticación del lado del servidor" },
      { status: 500 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      // include: {
      //     academy: true,
      //     client: {
      //         include: {
      //             academies: {
      //                 include: {
      //                     academy: true,
      //                 },
      //             },
      //         },
      //     },
      //     admin: true,
      //     employee: true,
      //     instructor: true,
      // },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    let academyId;
    let token;

    token = jwt.sign({ id: user.id, role: user.role, academyId }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
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
