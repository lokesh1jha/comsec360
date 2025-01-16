const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL! ?? 'http://3.78.244.234:5001';
const getToken = () => localStorage.getItem("token") || "";

function validateAndRedirect() {
    if(getToken() === null) {
        window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL! ?? 'http://3.74.43.250:3000/login';
        return true
    };
    return false
}
export const addShareCapitalData = async (data: any, companyId: string) => {
    if(validateAndRedirect()) return
    console.log("companyId----", companyId);
    data.companyId = parseInt(data.companyId)
    console.log(typeof data.companyId, companyId)
    const response = await fetch(`${BACKEND_URL}/account-user/add-comapny-sharecapital/${companyId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const fetchShareCapitalData = async (companyId: string) => {
    if(validateAndRedirect()) return
    const response = await fetch(`${BACKEND_URL}/account-user/get-companies-sharecapital/${companyId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
    });
    return await response.json();
}


export const updateShareCapitalData = async (shareData: any, companyId: string) => {
    if(validateAndRedirect()) return
    shareData.companyId = parseInt(companyId)
    const response = await fetch(`${BACKEND_URL}/account-user/update-comapny-sharecapital/${companyId}/${shareData.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(shareData),
    });
    return response.json();
};


export const deleteShareCapitalData = async (id: any, companyId: string) => {
    if(validateAndRedirect()) return
    console.log("shareData", id);
    const response = await fetch(`${BACKEND_URL}/account-user/delete-comapny-sharecapital/${companyId}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
    });
    return response.json();
};