import { fetchGET } from "@/data/services/fetchGET";

export default async function getUserInformationAction() {
    const user = await fetchGET({ url: "/api/user/all", error: "Error al obtener la información del usuario" });
    return user;
}