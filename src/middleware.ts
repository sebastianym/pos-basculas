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
  //@ts-ignore
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

    // Si la ruta está restringida y el usuario no está autorizado
    if (currentPath in accessControl && !isAuthorized(currentPath, role)) {
      // Si el rol es ADMIN, redirige a la sección de administrador
      if (role === "ADMIN") {
        return NextResponse.redirect(
          new URL("/administrador/usuarios", request.url)
        );
      }
      // Si el rol es USER (o cualquier otro), redirige a la raíz (o la ruta que definas)
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Comprobaciones adicionales para rutas específicas si el usuario no está autenticado
  if (currentPath.startsWith("/dashboard") && user.ok === false) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (currentPath.startsWith("/administrador") && user.ok === false) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirigir de la raíz a la ruta correspondiente según el rol
  // Por ejemplo, si el usuario autenticado es USER y está en la raíz, redirigir a /dashboard/compraMaterial
  // Y si es ADMIN, redirigir a /administrador/usuarios
  if (currentPath === "/" && user.ok === true) {
    if (user && "data" in user && user.data && user.data.decoded) {
      const role = user.data?.decoded.role;
      if (role === "ADMIN") {
        return NextResponse.redirect(
          new URL("/administrador/usuarios", request.url)
        );
      } else if (role === "USER") {
        return NextResponse.redirect(
          new URL("/dashboard/compraMaterial", request.url)
        );
      }
    }
  }

  return NextResponse.next();
}
