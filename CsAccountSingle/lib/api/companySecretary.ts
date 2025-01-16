const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL! ?? 'http://3.78.244.234:5001';
const getToken = () => localStorage.getItem("token") || "";

function validateAndRedirect() {
    if(getToken() === null) {
        window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL! ?? 'http://3.74.43.250:3000/login';
        return true
    };
    return false
}

export const addSecretaryData = async (data: any, companyId: any) => {
    if(validateAndRedirect()) return
    console.log("data", data);
    const response = await fetch(`${BACKEND_URL}/account-user/add-comapny-secretary/${companyId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const fetchSecretaryData = async (companyId: any): Promise<any> => {
    if(validateAndRedirect()) return
    const response = await fetch(`${BACKEND_URL}/account-user/get-companies-secretary/${companyId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
    });
    return (await response.json()).data;
}

// export const deleteSecretaryData = async (id: any, companyId: any): Promise<any> => {
//     if(validateAndRedirect()) return
//     const response = await fetch(`${BACKEND_URL}/account-user/delete-comapny-secretary/${companyId}/${id}`, {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${getToken()}`
//         },
//     });
//     return response.json();
// };

// export const updateSecretaryData = async (shareData: any, companyId: any): Promise<any> => {
//     if(validateAndRedirect()) return
//     const response = await fetch(`${BACKEND_URL}/account-user/update-comapny-secretary/${companyId}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${getToken()}`
//         },
//         body: JSON.stringify(shareData),
//     });
//     return response.json();
// };
