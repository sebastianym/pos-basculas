import { getAuthToken } from "./user/getToken";

interface fetchPOSTProps<T> {
    url: string;
    body: T;
    error: string;
}

export async function fetchPOST<T, R = any>(props: fetchPOSTProps<T>): Promise<R> {
    const url = new URL(props.url, process.env.NEXT_PUBLIC_BACKEND_URL);
    const authToken = await getAuthToken();

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(props.body),
            cache: "no-cache",
        });

        return await response.json();

    } catch (error) {
        console.error(props.error, error);
        throw error;
    }
}