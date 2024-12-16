"use server";

export async function logoutAction() {

	const url = new URL('/api/logout', process.env.NEXT_PUBLIC_BACKEND_URL);

	try {
		const response = await fetch(url, {
			method: "GET",
		});

	} catch (error) {
		console.error("Error during logout", error);
	}
}