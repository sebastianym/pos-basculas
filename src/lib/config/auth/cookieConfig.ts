export const config = {
	expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Date.now() + 1 día en milisegundos
	path: "/",
	domain: "localhost",
	//domain:  process.env.HOST,
	httpOnly: true,
	sameSite: "lax" as "lax", // Especifica explícitamente el tipo
	secure: true,
};