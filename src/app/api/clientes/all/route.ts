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

    const clientes = await prisma.companiaCliente.findMany();

    if (!clientes) {
      return NextResponse.json(clientes, { status: 404 });
    }

    return NextResponse.json(clientes);
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
