import { useTransitionRouter } from "next-view-transitions";

export function LogoutButton() {

	const router = useTransitionRouter()

	const handleLogout = async () => {
		const url = new URL('/api/logout', process.env.NEXT_PUBLIC_BACKEND_URL);

		try {
			const response = await fetch(url, {
				method: "GET",
			});

		} catch (error) {
			console.error("Error during logout", error);
		}

		router.push("/iniciar-sesion");
	};


	return (
		<div onClick={handleLogout} className="font-semibold text-sm text-gray-500 rounded-sm hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 nav-link-dashboard">
			<button type="submit" className="font-semibold text-sm text-gray-500 rounded-sm hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 nav-link-dashboard">
				Cerrar sesión
			</button>
		</div>
	);
}