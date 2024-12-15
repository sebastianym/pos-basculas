import { getAuthToken } from "./user/getToken";

interface fetchGETProps {
    url: string;
    error: string;
}

export async function fetchGET<T = any>(props: fetchGETProps): Promise<T> {

    const url = new URL(props.url, process.env.NEXT_PUBLIC_BACKEND_URL);

    const authToken = await getAuthToken();
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            cache: "no-cache",
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${props.error}`);
        }

        return await response.json();

    } catch (error) {
        console.log(props.error, error);
        throw error;
    }
}