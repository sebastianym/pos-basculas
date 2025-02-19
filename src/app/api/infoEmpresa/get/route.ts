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

    const infoEmpresa = await prisma.empresa.findFirst();

    if (!infoEmpresa) {
      return NextResponse.json(infoEmpresa, { status: 404 });
    }

    return NextResponse.json(infoEmpresa);
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
