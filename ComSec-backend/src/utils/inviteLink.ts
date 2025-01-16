export const generateShareHolderInviteLink = (comapnyId: number, id: number, email: string, inviteType: string): string => {
    const link = `${process.env.GUEST_SHAREHOLDER_FRONTEND_URL}?companyId=${comapnyId}&id=${id}&email=${email}&inviteType=${inviteType}`;
    return link;
}

export const generateDirectorInviteLink = (comapnyId: number, id: number, email: string, inviteType: string): string => {
    const link = `${process.env.GUEST_DIRECTOR_FRONTEND_URL}?companyId=${comapnyId}&id=${id}&email=${email}&inviteType=${inviteType}`;
    return link;
}

export const generateShareHolderSignatureLink = (companyId: number, token: string, user: any): string => {
    const link = `${process.env.DOCUMENT_SIGN_SHAREHOLDER_FRONTEND_URL}?companyId=${companyId}&token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
    return link;
}

export const generateDirectorSignatureLink = (companyId: number, token: string, user: any): string => {
    const link = `${process.env.DOCUMENT_SIGN_DIRECTOR_FRONTEND_URL}?companyId=${companyId}&token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
    return link;
}