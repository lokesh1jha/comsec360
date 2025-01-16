"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UploadFormTable from "./Forms";
import { IDProof } from "./Tables";
import { useEffect, useState } from "react";
import { getShareholder } from "@/api/shareholder";



export interface ShareholderDocuments {
  NNC1Url: string | null;
  address: string;
  addressProof?: string;
  companyId: number;
  email: string;
  id: number;
  idNo: string;
  idProof: string;
  name: string;
  phone: string;
  sharesDetails: Array<{
    noOfShares: number;
    classOfShares: string;
    shareCertificateUrl?: string;
  }> | null;
  surname?: string;
  type: string;
}

export interface DocumentInterface {
  id: number;
  name: string;
  url: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

const Main = () => {
  const [userValid, setUserValid] = useState(true);
  const [companyName, setCompanyName] = useState("");

  const [token, setToken] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [user, setUser] = useState("");
  const [userName, setUserName] = useState("");

  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [shareholderDocuments, setShareholderDocuments] = useState<ShareholderDocuments | null>(null)

  const [type, setType] = useState("company");

  if (documents.length > 0) {
    const nameToUrlMap = new Map<string, string>();
    documents.forEach((doc) => {
      nameToUrlMap.set(doc.name, doc.url);
    });
    console.log(documents);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const encodedUser = urlParams.get("user");
      const companyId = urlParams.get("companyId");

      if (token && encodedUser && companyId) {
        let user = null;
        try {
          user = JSON.parse(decodeURIComponent(Buffer.from(encodedUser, 'base64').toString('utf-8')));
        } catch (error) {
          console.error("Failed to parse user data:", error);
          // setUserValid(false);
          // return;
        }
        setToken(token);
        setCompanyId(companyId);
        setUser(user);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("companyId", companyId);
        setUserValid(true);

        // Clear the URL parameters
        //http://localhost:3005/?companyId=2&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imxva2VzaDFqaGFAZ21haWwuY29tIiwidHlwZSI6ImRpcmVjdG9yIiwiZmlyc3RuYW1lIjoiTG9rZXNoIiwibGFzdG5hbWUiOiJqaGEiLCJpYXQiOjE3MzU3NDI4NjcsImV4cCI6MTczNjE3NDg2N30.hpPzd45Vf4g36XpyhN6bnlt94PBsW6CEYgHhIzOZ4Mk&user=%5Bobject%20Object%5D
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      else {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        if (!user || !token || !companyId) {
          setUserValid(false);
        } else {

          setToken(token);
          setCompanyId(companyId);
          setUser(user);

          setUserValid(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    async function getDashboard() {
      if (token && companyId) {
        const res = (await getShareholder(companyId)).data;

        if (res.success) {
          const { documents, shareholderDocuments, company } = res.data;
          console.log(documents, shareholderDocuments, company);

          localStorage.setItem("documents", JSON.stringify(documents));
          localStorage.setItem("shareholderDocuments", JSON.stringify(shareholderDocuments));
          localStorage.setItem("company", JSON.stringify(company));

          setCompanyName(company.nameEnglish);
          setDocuments(documents);
          setShareholderDocuments(shareholderDocuments);
          setType(shareholderDocuments?.type?.toLowerCase());
          setUserName(shareholderDocuments?.name);

        }
      }
    }

    getDashboard();
  }, [token, companyId]);


  return (
    <>
      {userValid ? (
        <Card className="my-6">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardDescription>{companyName} / Shareholder</CardDescription>
            <CardTitle>{userName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(shareholderDocuments && documents) && <UploadFormTable shareholderDocuments={shareholderDocuments} documents={documents} />}
            {shareholderDocuments && <IDProof shareholderDocuments={shareholderDocuments} />}
          </CardContent>
        </Card>
      ) :
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl">This link is Expired. Please contact Company for valid link.</h1>
        </div>
      }
    </>
  );
};

export default Main;
