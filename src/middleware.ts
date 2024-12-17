import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserMeLoader } from "./data/services/user/getUserMeLoader";

const accessControl = {
  "/dashboard": {
    roles: ["USER"],
  },
  "/dashboard/compraMaterial": {
    roles: ["USER"],
  },
  "/dashboard/servicioBascula": {
    roles: ["USER"],
  },
  "/dashboard/ventaMaterial": {
    roles: ["USER"],
  },
  "/administrador": {
    roles: ["ADMIN"],
  },
  "/administrador/clientes": {
    roles: ["ADMIN"],
  },
  "/administrador/compras": {
    roles: ["ADMIN"],
  },
  "/administrador/materiales": {
    roles: ["ADMIN"],
  },
  "/administrador/proveedores": {
    roles: ["ADMIN"],
  },
  "/administrador/usuarios": {
    roles: ["ADMIN"],
  },
  "/administrador/ventas": {
    roles: ["ADMIN"],
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
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (currentPath.startsWith("/administrador") && user.ok === false) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // if (currentPath.startsWith("/") && user.ok === true) {
  //   return NextResponse.redirect(
  //     new URL("/dashboard/compraMaterial", request.url)
  //   );
  // }

  return NextResponse.next();
}
