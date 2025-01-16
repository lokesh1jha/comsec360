"use client";
import {
  CompanyInfo,
  CompanySecretary,
  ShareCapital,
} from "@/components/Forms";
import { DirectorsMain, ShareHoldersMain } from "@/components/Main";
import { Popup } from "@/components/Popup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataContext } from "@/context/ContextProvider";
import { useEffect } from "react";
import { CheckCircle2, SquarePen } from "lucide-react";

export default function Home() {
  const {
    tabValue,
    setTabValue,
    disableSI,
    setDisableSI,
    disableDirectors,
    setDisableDirectors,
    disableCS,
    setDisableCS,
  } = useDataContext();
  useEffect(() => {
    setTabValue(tabValue);
    setDisableSI(disableSI);
    setDisableDirectors(disableDirectors);
    setDisableCS(disableCS);
  }, [
    tabValue,
    setTabValue,
    disableCS,
    setDisableCS,
    disableDirectors,
    setDisableDirectors,
    disableSI,
    setDisableSI,
  ]);

const { companyId } = useDataContext();
  useEffect(() => {
    const updateAuthFromQueryParams = () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const type = params.get("type");
      const user = params.get("user");

      // If token exists in query params, update localStorage
      if (token && type && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("type", type);
        localStorage.setItem("user", decodeURIComponent(user));
        // Clear the query parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        return true;
      }

      return false;
    };

    const validateAndRedirect = () => {
      const token = localStorage.getItem("token");
      const type = localStorage.getItem("type");
      const user = localStorage.getItem("user");

      if (token && type && user) {

        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const expiry = decodedToken.exp * 1000;
          if (Date.now() >= expiry) {
            console.log("Token has expired, redirecting to login");
            localStorage.removeItem("token");
            localStorage.removeItem("type");
            localStorage.removeItem("user");
            window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL ?? 'http://3.74.43.250:3000/login';
          } else {
            console.log("Token is valid");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL ?? 'http://3.74.43.250:3000/login'}`;
        }
      } else {
        // Redirect to login if authentication data is missing
        window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL ?? 'http://3.74.43.250:3000/login'}`;
      }
    };

    // Try to update auth data from query params first
    const updatedFromQuery = updateAuthFromQueryParams();

    // If not updated from query, validate existing localStorage data
    if (!updatedFromQuery) {
      validateAndRedirect();
    }
  }, []);


  return (
    <main className="py-6">
      {/* TODO: show this only when there is no project: Account Users have no project / company  */}
      {!companyId && <Popup />}
      <Tabs defaultValue="CI" value={tabValue}>
        <TabsList className="grid w-full md:grid-cols-4 sm:grid-cols-2 grid-cols-1 sm:mb-0 mb-40">
          <TabsTrigger
            value="CI"
            onClick={() => setTabValue("CI")}
            className="space-x-2"
          >
            <span>Company Info</span>
            <span>
              {tabValue === "CI" ? (
                <SquarePen size={20} />
              ) : (
                <CheckCircle2 size={20} color="green" />
              )}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="SI"
            disabled={disableSI}
            onClick={() => (disableSI ? setTabValue("CI") : setTabValue("SI"))}
            className="space-x-2"
          >
            <span>Shares Info</span>
            <span>
              {tabValue === "D" ||
                tabValue === "CS" ||
                (disableDirectors === false && tabValue === "CI") ? (
                <CheckCircle2 size={20} color="green" />
              ) : (
                <SquarePen size={20} />
              )}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="D"
            disabled={disableDirectors}
            onClick={() =>
              disableDirectors === false
                ? setTabValue("D")
                : setTabValue(tabValue)
            }
            className="space-x-2"
          >
            <span>Directors</span>
            <span>
              {tabValue === "CS" ||
                (disableDirectors === false && tabValue === "CI") ? (
                <CheckCircle2 size={20} color="green" />
              ) : (
                <SquarePen size={20} />
              )}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="CS"
            disabled={disableCS}
            onClick={() =>
              disableCS ? setTabValue(tabValue) : setTabValue("CS")
            }
          >
            Company Secretary
          </TabsTrigger>
        </TabsList>
        <TabsContent value="CI">
          <CompanyInfo />
        </TabsContent>
        <TabsContent value="SI" className="space-y-3">
          <ShareCapital />
          <ShareHoldersMain />
        </TabsContent>
        <TabsContent value="D">
          <DirectorsMain />
        </TabsContent>
        <TabsContent value="CS">
          <CompanySecretary />
        </TabsContent>
      </Tabs>
      <p className="mt-4">
        Copyright © 2012 - 2024 ComSec360®. All rights reserved.
      </p>
    </main>
  );
}
