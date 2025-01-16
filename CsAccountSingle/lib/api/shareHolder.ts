const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL! ?? 'http://3.78.244.234:5001';
const getToken = () => localStorage.getItem("token") || "";

function validateAndRedirect() {
  if (getToken() === null) {
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL! ?? 'http://3.74.43.250:3000/login';
    return true
  };
  return false
}
export const addSharedHolderData = async (data: any, companyId: string) => {
  if (validateAndRedirect()) return
  const response = await fetch(`${BACKEND_URL}/account-user/add-comapny-shareholder/${companyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const fetchShareHolderData = async (companyId: string) => {
  if (validateAndRedirect()) return
  const response = await fetch(`${BACKEND_URL}/account-user/get-companies-shareholders/${companyId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
  });
  return (await response.json()).data;
}

export const updateShareHolderData = async (shareData: any, companyId: string) => {
  if (validateAndRedirect()) return
  shareData.companyId = parseInt(companyId)
  const response = await fetch(`${BACKEND_URL}/account-user/update-comapny-shareholder/${companyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(shareData),
  });
  return response.json();
};


export const deleteShareHolderData = async (shareDataId: any, companyId: string) => {
  if (validateAndRedirect()) return
  const response = await fetch(`${BACKEND_URL}/account-user/delete-comapny-shareholder/${companyId}/${shareDataId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
  });
  return response.json();
};

export const uploadFileProof = async (image: File, companyId: string | undefined, docType: string): Promise<{ success: boolean, error: boolean, message: string, data: any }> => {
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
          "Authorization": `Bearer ${getToken()}`
        }
      });
    }
    else if (docType === "addressProof") {
      response = await fetch(`${BACKEND_URL}/account-user/upload-id-proof-file/${companyId}`, {
        method: 'POST',
        body: formData, // Pass the FormData directly as the body
        headers: {
          "Authorization": `Bearer ${getToken()}`
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


export const inviteGuestUser = async (data: any, companyId: string) => {
  if (validateAndRedirect()) return
  try {
    const response = await fetch(`${BACKEND_URL}/account-user/invite-guest-user-shareholder/${companyId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.log(error);
    return error
  }

};