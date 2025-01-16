import { CompanyInfoFormSchema } from "@/app/validationSchemas";
import { z } from "zod";

interface API_RESPONSE {
  success: boolean;
  error: boolean;
  message: string;
  data: any;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL! ?? 'http://3.78.244.234:5001';
const getToken = () => localStorage.getItem("token") || "";

export async function submitCompanyDetails(companyInfo: z.infer<typeof CompanyInfoFormSchema>, companyId?: string) {
  let result: API_RESPONSE = { success: false, error: true, message: "Please try again and check all fields.", data: {} };
  if (companyInfo.companyLogo.length > 255) {
    delete companyInfo.companyLogo; // as this is signed url and it should not be saved in db
  }
  try {
    // console.log("companyInfo", companyInfo);
    let response = await fetch(`${BACKEND_URL}/account-user/submit-company-details` + (companyId ? `/${companyId}` : ""), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(companyInfo),
    })

    if (response.status !== 200) {
      return result;
    }

    // let resp: { error: string, success: boolean, data: any } = await response.json();

    result.message = "Company details submitted successfully";
    result.success = true;
    result.error = false;
    result.data = (await response.json()).data;
    return result;
  } catch (error) {
    console.log(error);
    result.message = "Internal Server Error";
    return result
  }
}

export const uploadCompanyLogo = async (image: File, companyId: string | undefined): Promise<{ success: boolean, error: boolean, message: string, data: any }> => {
  const formData = new FormData();
  formData.append('file', image);
  let result = { success: false, error: true, message: "Something went wrong.", data: null };

  try {
    const response = await fetch(`${BACKEND_URL}/account-user/upload-company-logo/${companyId}`, {
      method: 'POST',
      body: formData, // Pass the FormData directly as the body
    });
    console.log("pre", response);
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


export const getCompanyDetailsByCompanyId = async ({ companyId }: { companyId: string }): Promise<{ success: boolean, error: boolean, message: string, data: any }> => {
  let result = { success: false, error: true, message: "Something went wrong.", data: null };
  try {
    const response = await fetch(`${BACKEND_URL}/account-user/get-company-details/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
    });
    if (!response.ok) {
      result.message = "Something went wrong.";
      return result
    }

    const data = (await response.json()).data;

    result.data = data;
    result.success = true;
    result.error = false;
    result.message = "Company details fetched successfully";
    return result;
  } catch (error) {
    console.error('Error fetching company details:', error);
    result.message = "Something went wrong.";
    return result
  }
}

export const checkIfCompanyDetailsCompleted = async ({ companyId }: { companyId: string }): Promise<{ success: boolean, error: boolean, message: string, data: any }> => {
  let result: API_RESPONSE = { success: false, error: true, message: "Something went wrong.", data: null };
  try {
    const response = await fetch(`${BACKEND_URL}/account-user/check-company-details/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
    });
    if (!response.ok) {
      result.message = "Something went wrong.";
      return result
    }

    const responseData = (await response.json()).data;

    result.data = responseData;
    result.success = true;
    result.error = false;
    result.message = "Company details fetched successfully";
    return result;
  } catch (error) {
    console.error('Error fetching company details:', error);
    result.message = "Something went wrong.";
    return result
  }
}

export const confirmCompanyDetails = async ({ companyId }: { companyId: string }): Promise<{ success: boolean, error: boolean, message: string, data: any }> => {
  let result = { success: false, error: true, message: "Something went wrong.", data: null };
  try {
    const response = await fetch(`${BACKEND_URL}/account-user/confirm-company-details/${companyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
    });
    if (!response.ok) {
      result.message = "Something went wrong.";
      return result
    }

    const data = (await response.json()).data;

    result.data = data;
    result.success = true;
    result.error = false;
    result.message = "Company details confirmed successfully";
    return result;
  } catch (error) {
    console.error('Error confirming company details:', error);
    result.message = "Something went wrong.";
    return result
  }
}

export const produceAllDocEmailAll = async (companyId: string): Promise<{ success: boolean, error: boolean, message: string, data: any }> => {
  let result = { success: false, error: true, message: "Something went wrong.", data: null };
  try {
    const response = await fetch(`${BACKEND_URL}/account-user/produce-all-doc-email-all/${companyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
    });
    if (!response.ok) {
      result.message = "Something went wrong.";
      return result;
    }

    const data = (await response.json()).data;

    result.data = data;
    result.success = true;
    result.error = false;
    result.message = "Emails produced successfully";
    return result;
  } catch (error) {
    console.error('Error producing emails:', error);
    result.message = "Something went wrong.";
    return result;
  }
}



export const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean, error: boolean, message: string, data: any }> => {
  let result = { success: false, error: true, message: "Something went wrong.", data: null };
  try {
    const response = await fetch(`${BACKEND_URL}/account-user/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });
    if (!response.ok) {
      result.message = "Password change failed.";
      return result;
    }

    const data = (await response.json()).data;

    result.data = data;
    result.success = true;
    result.error = false;
    result.message = "Password changed successfully";
    return result;
  } catch (error) {
    console.error('Error changing password:', error);
    result.message = "Something went wrong.";
    return result;
  }
}