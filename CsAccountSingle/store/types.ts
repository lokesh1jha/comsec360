export type CompanyInfo = {
  name: string;
  chiname?: string;
  type: "public" | "private";
  code: string;
  nature: string;
  house?: string;
  building?: string;
  street?: string;
  district?: string;
  country: string;
  email?: string;
  companyTel: string;
  companyfax: string;
  time: "1 year" | "3 years";
  presentorName: string;
  presentorChiName?: string;
  presentorAddress: string;
  presentorTel: string;
  presentorFax: string;
  presentorEmail?: string;
  presentorReferance: string;
  companyLogo: any;
};


export type ShareCapitalProps = {
  class: string;
  totalProposed: number;
  currency: string;
  unitPrice: number;
  total: number;
  paid: number;
  unpaid: number;
  id?: number;
  rightsAttached?: string | undefined;
  shareTypeMap?: { [key: string]: number } | undefined;
};

export type ShareHolderSharesDetailsProps = {
  type?: string;
  classOfShares?: string;
  noOfShares: number;
  shareCertificateUrl?: string
};

export type ShareHolderProps = {
  type: string;
  name: string;
  surname: string;
  idNo: string;
  address: string;
  phone: string;
  email: string;
  idProof: string;
  addressProof: string;
  id?: number;
  sharesDetails: ShareHolderSharesDetailsProps[];
};

export type ShareholdersUpdateProps ={
  name: string;
  shareDetails: ShareHolderSharesDetailsProps[];
  email: string;
  phone: string;
  address: string;
}

export type ShareHolderUpdateProps = {
  type: string;
  name: string;
  surname: string;
  idNo: string;
  address: string;
  phone: string;
  email: string;
  sharesDetails: ShareHolderSharesDetailsProps[];
};

export type DirectorProps = {
  type: string;
  name: string;
  surname: string;
  idNo: string;
  address: string;
  phone: string;
  email: string;
  idProof: string;
  addressProof: string;
  id: number;
}


export type DirectorUpdateProps = {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export type CompanySecretaryProps = {
  tcspLicenseNo: string;
  tcspReason: string;
  type: string;
  name: string;
  surname: string;
  idNo: string;
  address: string;
  phone: string;
  email: string;
  idProof: string;
  addressProof: string;
  id: number;
  companyId: number;
  NNC1Url?: string | null;
  updatedAt: string;
  createdAt: string;
}