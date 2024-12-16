import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserMeLoader } from "./data/services/user/getUserMeLoader";

const accessControl = {
  "/horas-de-vuelo": {
    roles: ["ADMIN", "EMPLOYEE", "CLIENT"],
    licenseCheck: "flightTimeManagement",
  },
  "/cuenta": {
    roles: ["ADMIN", "EMPLOYEE", "CLIENT", "INSTRUCTOR"],
    licenseCheck: null,
  },
};
function isAuthorized(path: string, role: string | undefined): boolean {
  // @ts-ignore
  const accessRule = accessControl[path];

  if (!accessRule) return true;

  const allowedRoles = accessRule.roles;

  if (!allowedRoles.includes(role)) {
    return false;
  }

  return true;
}

export async function middleware(request: NextRequest) {
  const user = await getUserMeLoader();
  const currentPath = request.nextUrl.pathname;

  if (user && "data" in user && user.data && user.data.decoded) {
    const role = user.data.decoded.role;

    // Si la ruta está restringida y el usuario no está autorizado, redirigir
    if (currentPath in accessControl && !isAuthorized(currentPath, role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Comprobaciones adicionales para rutas específicas
  if (currentPath.startsWith("/dashboard") && user.ok === false) {
    return NextResponse.redirect(new URL("/iniciar-sesion", request.url));
  }

  if (currentPath.startsWith("/horas-de-vuelo") && user.ok === false) {
    return NextResponse.redirect(new URL("/iniciar-sesion", request.url));
  }

  if (currentPath.startsWith("/iniciar-sesion") && user.ok === true) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
