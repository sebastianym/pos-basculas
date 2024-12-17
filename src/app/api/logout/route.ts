import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = () => {
  const allCookies = cookies().getAll();
  const cookieDomain = "localhost";

  allCookies.forEach((cookie) => {
    cookies().set(cookie.name, "", {
      expires: new Date(0),
      path: "/",
      domain: cookieDomain,
    });
  });

  return NextResponse.json({ status: 200 });
};
