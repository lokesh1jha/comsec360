import { AccountUserSchema } from "@/lib/validationSchemas";
import { z } from "zod";

const serverURL = process.env.NEXT_PUBLIC_BACKEND_URL! ?? 'http://3.78.244.234:5001';

const getToken = (): string | null => {
    if (typeof window !== "undefined") {
        console.log("token", localStorage.getItem("token"));
        return localStorage.getItem("token");
    }
    return null;
};

export async function createNewAccountUser(userInfo: z.infer<typeof AccountUserSchema>) {
    try {
        let result = { success: false, error: true, message: "Sorry!! Email already exists." };

        let response = await fetch(`${serverURL}/admin/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(userInfo),
        })

        let resp: { error: string, message: string } = await response.json();

        if (resp.error) {
            return result;
        }

        result.success = true;
        result.error = false;
        return result;
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
}


export async function updateAccountUser(userInfo: z.infer<typeof AccountUserSchema>, id: string) {
    try {
        const response = await fetch(`${serverURL}/admin/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(userInfo),
        })
        if (response.status !== 200) {
            return { success: false, error: true };
        }
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
}

export async function listAccountUser() {
    try {
        console.log('listAccountUser')
        const response = await fetch(`${serverURL}/admin/list`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
        })
        if (response.status !== 200) {
            return [];
        }
        let userData = (await response.json()).data.data;

        return userData;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function deleteAccountUser(id: string) {
    try {
        let res = { success: true, error: null };
        const response = await fetch(`${serverURL}/admin/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
        })
        if (response.status !== 200) {
            res.success = false;
        }
        return res;
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
}

export async function getAccountUserCount() {
    try {
        let res = { success: true, error: null, count: 0 };
        const response = await fetch(`${serverURL}/admin/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
        })
        if (response.status !== 200) {
            res.success = false;
            return res;
        }
        const responsebody: any = (await response.json()).data;
        // console.log("responsebody", responsebody);
        if (!responsebody.success) {
            res.success = false;
            return res;
        }

        res.count = responsebody.data;
        return res;
    } catch (error) {
        console.log(error);
        return { success: false, error: true, count: 0 };
    }
}

export async function getCompanyCount() {
    try {
        let res = { success: true, error: null, count: 0 };
        const response = await fetch(`${serverURL}/account-user/get-company-count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
        })
        const responsebody: any = await response.json();
        
        if (!responsebody.success) {
            res.success = false;
            return res;
        }

        res.count = responsebody.data;
        return res;
    } catch (error) {
        console.log(error);
        return { success: false, error: true, count: 0 };
    }
}