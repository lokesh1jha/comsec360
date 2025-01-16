"use client";
import { buttonVariants } from "@/components/ui/button";
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
} from "../cards";
import NewShareholdersCard from "../cards/NewShareholderCard";
import { useEffect } from "react";
import { useDataContext } from "@/context/ContextProvider";
import { useShareCapitalStore } from "@/store/shareCapitalDataStore";
import { useShareHolderStore } from "@/store/shareHolderDataStore";
import { useDirectorStore } from "@/store/directorStore";
import { useCompanySecretaryStore } from "@/store/CompanySecretaryStore";

const Page = () => {
  const { setCompanyId, companyId } = useDataContext();

  useEffect(() => {
    if (typeof window !== "undefined") { // Ensure window is defined
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
          <NewShareholdersCard />
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
          <Link
            className={buttonVariants({
              variant: "destructive",
              className: "cursor-pointer",
            })}
            href={process.env.NEXT_PUBLIC_MULTIPLE_FRONTEND_URL || "http://3.74.161.52:3000"}
          >
            Confirm
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
