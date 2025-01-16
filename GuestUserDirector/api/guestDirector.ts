const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://3.78.244.234:5001";
const getToken = async () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        return token;
    }
    return null;
}


export const verifyGuestUser = async (id: number, otp: string, email: string, inviteType: string) => {

    const response = await fetch(`${BACKEND_URL}/guest/verify-guest-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id,
            otp,
            email,
            inviteType
        })
    });
    const data = await response.json();
    return data;
}


export const uploadFileProof = async (image: File, companyId: string, docType: string): Promise<{ success: boolean, error: boolean, message: string, data: any }> => {
    const token = await getToken();
    if (!token) {
        throw new Error("Token not found");
    }
    const formData = new FormData();
    formData.append('file', image);
    let result = { success: false, error: true, message: "Something went wrong.", data: null };

    try {
        let response: any;

        if (docType === "idProof") {
            response = await fetch(`${BACKEND_URL}/account-user/upload-id-proof-file/${companyId}`, {
                method: 'POST',
                body: formData, // Pass the FormData directly as the body
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        }
        else if (docType === "addressProof") {
            response = await fetch(`${BACKEND_URL}/account-user/upload-id-proof-file/${companyId}`, {
                method: 'POST',
                body: formData, // Pass the FormData directly as the body
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        }
        else {
            result.message = "Provide valid document type";
            return result
        }
        if (!response.ok) {
            result.message = "File upload failed";
            return result
        }

        const data = (await response.json()).data;

        result.data = data;
        result.success = true;
        result.error = false;
        result.message = "File uploaded successfully";
        return result;
    } catch (error) {
        console.error('Error uploading company logo:', error);
        result.message = "File upload failed";
        return result
    }
};


export const getDirectorInviteById = async (id: string) => {
    const token = await getToken();
    if (!token) {
        throw new Error("Token not found");
    }
    console.log(id,BACKEND_URL, "is lkjhlkhjlk;j");

    const response = await fetch(`${BACKEND_URL}/guest/get-director-invite/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return response.json();
}

export const addDirectorData = async (data: any, companyId: string, directorInviteId: number) =>
{
    const token = await getToken();
    if (!token) {
        throw new Error("Token not found");
    }
    data.directorInviteId = directorInviteId;
    data.companyId = parseInt(companyId);
    const response = await fetch(`${BACKEND_URL}/guest/add-company-director/${companyId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

export const getCompanyDirectors = async (companyId: string) => {
    const token = await getToken();
    if (!token) {
        throw new Error("Token not found");
    }
    const response = await fetch(`${BACKEND_URL}/guest/get-company-directors/${companyId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return response.json();
}