"use client"
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  CompanyInfoCard,
  CompanySecretaryCard,
  DirectorsCard,
  ShareCapitalCard,
  ShareholderCard,
} from "./cards";
import { useDataContext } from "@/context/ContextProvider";
import { use, useEffect, useState } from "react";
import { useShareCapitalStore } from "@/store/shareCapitalDataStore";
import { useShareHolderStore } from "@/store/shareHolderDataStore";
import { useDirectorStore } from "@/store/directorStore";
import { useCompanySecretaryStore } from "@/store/CompanySecretaryStore";
import { checkIfCompanyDetailsCompleted, produceAllDocEmailAll } from "@/lib/api/company";
import { toast } from "@/components/ui/use-toast";
const MULTIPLE_USER_UI = process.env.NEXT_PUBLIC_MULTIPLE_FRONTEND_URL ?? 'http://3.74.161.52:3000'

const Page = () => {
  const { companyId,setCompanyId } = useDataContext();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        setToken(token);
        setUser(user);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") { 
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const type = params.get('type');
      const user = params.get('user') ? decodeURIComponent(params.get('user')!) : null;
      const companyId = params.get('companyId');

      if (token && type && user && companyId) {
        console.log("companyId", companyId);
        localStorage.clear();
      }

      if (token) localStorage.setItem('token', token);
      if (type) localStorage.setItem('type', type);
      if (user) localStorage.setItem('user', user);
      
      // Update companyId in context and localStorage
      if (companyId) {
        setCompanyId(companyId); // Update context state
        localStorage.setItem('companyId', companyId); // Update localStorage directly if needed
      }
      if (!localStorage.getItem('token') || !localStorage.getItem('type') || !localStorage.getItem('user') || !localStorage.getItem('companyId')) {
        window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL ?? 'http://3.74.43.250:3000/login'}`;
      }
      // Clear the URL parameters
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [setCompanyId]); // Add setCompanyId as a dependency

  useEffect(() => {
    useShareCapitalStore.getState().fetchShareCapitalData(companyId);
    useShareHolderStore.getState().fetchShareHolderData(companyId);
    useDirectorStore.getState().fetchDirectorData(companyId);
    useCompanySecretaryStore.getState().fetchCompanySecretaryData(companyId);
  }, [companyId]);

  const redirectToDashboard = () => {
    window.location.href = `${MULTIPLE_USER_UI}?token=${token}&type=account_user&user=${encodeURIComponent(user ?? "")}`;
  };

  const redirectToDocumentsPage = (companyId: string) => {
    window.location.href = `${MULTIPLE_USER_UI}/document_status/${companyId}?token=${token}&type=account_user&user=${encodeURIComponent(user ?? "")}`;
  };

  const buildDocumentsAndSendEmail = async () => {
    let response = await checkIfCompanyDetailsCompleted({ companyId });
    if (response.error || !response.data || response.success === false) {
      toast({
        title: "Error",
        description: "Error fetching company status",
        variant: "destructive",
      });
      console.error("Error fetching company details");
      return;
    }
    const isCompleted = response.data.isCompleted;
    if (!isCompleted) {
      toast({
        title: "Error",
        description: "Currently All Invites are not accepted",
        variant: "destructive",
      });
      console.error("Please complete all the details");
      redirectToDashboard();
      return;
    }

    const companyStaus: string = response.data ?? "";
    if (companyStaus && (companyStaus === 'completed' || companyStaus === 'in_progress')) {
      redirectToDocumentsPage(companyId);
    }

    produceAllDocEmailAll(companyId).then((response) => {
      if (response.error || !response.data || response.success === false) {
        console.error("Error producing documents and sending email");
        toast({
          title: "Error",
          description: "Error producing documents and sending email",
          variant: "destructive",
        });
        return;
      }
    });

    toast({
      title: "Success",
      description: "Documents have been built and email has been sent",
      variant: "default",
    });
    redirectToDashboard();
  }

  return (
    <div className="flex flex-1 justify-center">
      <Card className="container my-6">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Please Review your details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CompanyInfoCard />
          <ShareCapitalCard />
          <ShareholderCard />
          <DirectorsCard />
          <CompanySecretaryCard />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link
            className={buttonVariants({ className: "cursor-pointer" })}
            href="/"
          >
            Edit
          </Link>
          <Button
            className={buttonVariants({
              variant: "destructive",
              className: "cursor-pointer",
            })}
            onClick={buildDocumentsAndSendEmail}
          >
            Confirm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
