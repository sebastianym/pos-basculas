import { NextResponse } from "next/server";
import { getAuthToken } from "./getToken";

export async function getUserMeLoader() {

    const url = new URL("/api/user/me", process.env.NEXT_PUBLIC_BACKEND_URL);

    const authToken = await getAuthToken();
    if (!authToken) return { ok: false, data: null, error: null };

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            cache: "no-cache",
        });

        const data = await response.json();

        if (response.status !== 200 || data.error) {
            return NextResponse.redirect(new URL("/api/logout", process.env.NEXT_PUBLIC_BACKEND_URL));
        }

        return { ok: true, data: data, error: null };

    } catch (error) {
        return { ok: false, data: null, error: error };
    }
}