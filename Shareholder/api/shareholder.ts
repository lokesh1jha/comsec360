
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://3.78.244.234:5001';



const getToken = (): string | null => {
    if (typeof window !== "undefined") {
        console.log("token", localStorage.getItem("token"));
        return localStorage.getItem("token");
    }
    return null;
};

export const getShareholder = async (company_id: string) => {
    try {
        const token = getToken();
        const response = await fetch(`${BACKEND_URL}/shareholder/get-shareholder-documents/${company_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch shareholder documents:", error);
        throw error;
    }
};

export const signshareholderDocuments = async (company_id: number, signature: string) => {
    try {
        const token = getToken();
        const response = await fetch(`${BACKEND_URL}/shareholder/sign-documents`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                company_id,
                signature,
            }),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to sign documents:", error);
        throw error;
    }
};

