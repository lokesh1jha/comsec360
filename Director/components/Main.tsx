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
import { getDirector } from "@/api/director";

export interface DirectorDocuments {
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

  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [directorDocuments, setDirectorDocuments] = useState<DirectorDocuments | null>(null)
  const [userName, setUserName] = useState("");
  const [type, setType] = useState("company");

  if(documents.length > 0) {
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
        let user = encodedUser;
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
        const res =(await getDirector(companyId)).data;
        console.log(res.success);
        if (res.success) {
          const { documents, directorDocuments, company } = res.data;
          console.log(documents, directorDocuments, company);
          
          localStorage.setItem("documents", JSON.stringify(documents));
          localStorage.setItem("directorDocuments", JSON.stringify(directorDocuments));
          localStorage.setItem("company", JSON.stringify(company));

          setCompanyName(company.nameEnglish);
          setDocuments(documents);
          setDirectorDocuments(directorDocuments);
          setType(directorDocuments?.type?.toLowerCase());
          setUserName(directorDocuments?.name);
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
            <CardDescription>{companyName} / Director</CardDescription>
            <CardTitle>{userName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(directorDocuments && documents) && <UploadFormTable directorDocuments={directorDocuments} documents= {documents}/>}
            {directorDocuments && <IDProof directorDocuments={directorDocuments} />}
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
