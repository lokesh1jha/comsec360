
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL! ?? 'http://3.78.244.234:5001';

const getToken = (): string | null => {
    if (typeof window !== "undefined") {
        console.log("token", localStorage.getItem("token"));
        return localStorage.getItem("token");
    }
    return null;
};

export const getCardsData = async () => {
    const token = getToken();
    const response = await fetch(`${BACKEND_URL}/multi-user/dashboard-count`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return await response.json();
}


export const getProjects = async (page: number, pageSize: number) => {
    const token = getToken();
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
    });
    const response = await fetch(`${BACKEND_URL}/multi-user/projects?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return await response.json();
}


export const getProjectUserDeatils = async (companyId: string) => {
    const token = getToken();
    const response = await fetch(`${BACKEND_URL}/multi-user/user-details/${companyId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return await response.json();
}

export const getDocumentsData = async (companyId: string) => {
    const token = getToken();
    const response = await fetch(`${BACKEND_URL}/multi-user/documents/${companyId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return await response.json();
}

export const uploadCompanyLogo = async (image: File, id: string, position: string): Promise<{ success: boolean, error: boolean, message: string, location: any }> => {
   console.log("uploading company logo", id, position);
    const token = getToken();
    const formData = new FormData();
    formData.append('file', image);
    let result = { success: false, error: true, message: "Something went wrong.", location: null };

    try {
        const response = await fetch(`${BACKEND_URL}/multi-user/upload-company-nnc1-form/${id}/${position}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });
        console.log("pre", response);
        if (!response.ok) {
            result.message = "File upload failed";
            return result
        }

        const data = await response.json();

        result.location = data;
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


export const obtainCompanyDocuments = async (companyId: string, formData: FormData) => {
    const token = getToken();
    const response = await fetch(`${BACKEND_URL}/multi-user/add-company-documents/obtain-documents/${companyId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    return await response.json();
}


export const getNotificationsForUser = async () => {
    const token = getToken();
    const response = await fetch(`${BACKEND_URL}/company-job/get-notification`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return await response.json();
}


export const getCompanyDocumentStatus = async (companyId: string) => {
    const token = getToken();
    const response = await fetch(`${BACKEND_URL}/company-job/is-document-generated/${companyId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return await response.json();
}