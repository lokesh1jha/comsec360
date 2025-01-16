"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useDataContext } from "@/context/ContextProvider";
import { getCompanyDetailsByCompanyId } from "@/lib/api/company";
import { CompanyInfo } from "@/store/types";
import Image from "next/image";
import { useEffect, useState } from "react";

const CompanyInfoCard = () => {
  const { companyId } = useDataContext();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    // Check if companyId is valid before fetching
    if (!companyId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No company ID provided.",
      });
      setLoading(false);
      return;
    }

    async function fetchCompanyDetails() {
      setLoading(true); // Set loading before fetching
      try {
        const response = await getCompanyDetailsByCompanyId({ companyId });
        if (!response.success) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch company data",
          });
          return;
        }
        setCompanyInfo(response.data);
        setCompanyLogo(response.data?.companyLogo || null);
      } catch (error) {
        console.error("Error fetching company details:", error); // Log error for debugging
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred.",
        });
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }

    fetchCompanyDetails();
  }, [companyId]); // Add companyId as a dependency

  if (loading) return <div>Loading...</div>; // Loading indicator

  // Handle case where companyInfo is null or undefined
  if (!companyInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Company Information Available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className=" *:my-2">
          <Image
            src={companyLogo ? companyLogo : "/tencent-logo.png"}
            width={58}
            height={58}
            alt="logo"
            className="object-contain"
          />
          <span>{companyInfo?.name || 'Company Name'}</span>
        </CardTitle>
        <CardDescription>
          Here are the details of your Company Info.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Example of reusable component for displaying info */}
        <div className="flex items-center gap-3">
          <p className="font-medium text-base">Business Registration Number:</p>
          <p className="text-base">S313XXXX</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <p className="font-medium text-base">
              Incorporate Date:
            </p>
            <p className="text-base">17/04/2024</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="font-medium text-base">
              Financial Date:
            </p>
            <p className="text-base">-</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <p className="font-medium text-base">Company Name (English):</p>
            <p className="text-base">{companyInfo?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className=" font-medium text-base">Company Name (Chinese):</p>
            <p className=" text-base">{companyInfo?.chiname ?? "-"}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <p className="font-medium text-base">Type of Company:</p>
            <p className="text-base">{companyInfo?.type}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="font-medium text-base">Nature of Business:</p>
            <p className="text-base">{companyInfo?.nature}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-xl font-medium">Address Details:</h1>
          {/* Address details rendering */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <p className="font-medium text-base">Flat / Floor / Block:</p>
              <p className="text-base">{companyInfo?.house || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-medium text-base">Building:</p>
              <p className="text-base">{companyInfo?.building}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-medium text-base">Street:</p>
              <p className="text-base">{companyInfo?.street}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-medium text-base">District:</p>
              <p className="text-base">{companyInfo?.district}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-medium text-base">Country:</p>
              <p className="text-base">{companyInfo?.country}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-medium text-base">Company E-mail:</p>
          <p className="text-base">{companyInfo?.email}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <p className="font-medium text-base">Company Telephone :</p>
            <p className="text-base">{companyInfo?.companyTel}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className=" font-medium text-base">Company FaxNo:</p>
            <p className=" text-base">{companyInfo?.companyfax ?? "-"}</p>
          </div>
        </div>
        {/* Presentor's Reference Section */}
        <div className="flex items-center gap-3">
          <p className="font-medium text-base">
            Time period of business administration fee:
          </p>
          <p className="text-base">{companyInfo?.time}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Presentor&rsquo;s Reference</CardTitle>
            <CardDescription>Here are the details of Presentor&rsquo;s Reference</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3">
                <p className="font-medium text-base">Name (English):</p>
                <p className="text-base">{companyInfo?.presentorName}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className=" font-medium text-base">Name (Chinese):</p>
                <p className=" text-base">{companyInfo?.presentorChiName ?? "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-medium text-base">Address:</p>
              <p className="text-base">
                {companyInfo?.presentorAddress}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3">
                <p className="font-medium text-base">Company Telephone :</p>
                <p className="text-base">{companyInfo?.presentorTel}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className=" font-medium text-base">Company FaxNo:</p>
                <p className=" text-base">{companyInfo?.presentorFax ?? "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-medium text-base">E-mail:</p>
              <p className="text-base">{companyInfo?.presentorEmail || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoCard;
