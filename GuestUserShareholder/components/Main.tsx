"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useEffect, useState } from "react";
import Shareholders from "./Forms/ShareholdersMain";
import ShareCapital from "./ShareCapital";
import { buttonVariants } from "./ui/button";
import ShareholdersData from "./ShareholdersData";
import { getShareCapitalAndShareHolder, getShareHolderInviteById } from "@/api/shareholder";

export interface ShareCapitalItem {
  id: string;
  class: string;
  totalProposed: number;
  currency: string;
  unitPrice: number;
  total: number;
  paid: number;
  unpaid: number;
  rightsAttached: string;
}

export interface ShareCapitalDataProps {
  shareCapital: ShareCapitalItem[];
}

export interface ShareHolderDataProps {
  shareHolder: ShareHolderItem[];
}

export interface ShareDetails {
  shareType: string;
  shareCount: number;
}

export interface ShareHolderItem {
  id?: string;
  type: "person" | "company" | "You";
  surname: string | null;
  name: string;
  idNo: string;
  address: string;
  phone: string;
  email?: string;
  shareDetails: ShareDetails[];
  idProof: string;
  addressProof?: string;
}


const Main = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [compantId, setCompanyId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [shareCapital, setShareCapital] = useState<ShareCapitalItem[] | null>(null);
  const [shareHolder, setShareHolder] = useState<ShareHolderItem[] | null>(null);
  const [shareHolderName, setShareHolderName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [inviteId, setInviteId] = useState("");

  useEffect(() => {
    if (typeof window != 'undefined') {
      const company_id = localStorage.getItem("companyId")
      const invite_id = localStorage.getItem("id")
      if (invite_id) setInviteId(invite_id)
      if (company_id) setCompanyId(company_id)
    }
  }, []);

  useEffect(() => {
    if (compantId) {
      getContent();
    }
    if (inviteId) {
      getShareHolderName(inviteId);
    }
  }, [compantId]);

  const getShareHolderName = async (inviteId: string) => {
    try {
      const shareHolderInivite = await getShareHolderInviteById(inviteId);
      if(shareHolderInivite){
        setShareHolderName(shareHolderInivite.data.name)
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  const getContent = async () => {
    try {
      const response = await getShareCapitalAndShareHolder(compantId);
      if (response) {
        const { shareCapital, shareHolders, companyInfo } = response;
        shareHolders.forEach((shareHolder: ShareHolderItem) => {
          shareHolder.type = shareHolder.type.toLowerCase() as "person" | "company" | "You";
        });
      console.log("dfsdfsfs", shareCapital)

        setShareCapital(shareCapital);
        setShareHolder(shareHolders);
        setCompanyName(companyInfo.name);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch data");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setIsLoading(false);
    }
  };

  if(isLoading){
    return <div>Loading....</div>
  }

  return (
    <Card className="my-3">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardDescription>{companyName}</CardDescription>
        <CardTitle>{shareHolderName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {shareCapital && <ShareCapital shareCapital={shareCapital} />}
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <Card>
            <div className="flex flex-1 justify-between items-center">
              <CardHeader>
                <CardTitle>Shareholders</CardTitle>
                <CardDescription>
                  Here are the details on Shareholders
                </CardDescription>
              </CardHeader>
              <CollapsibleTrigger type="button" className="pr-6">
                <span className={buttonVariants({ variant: "outline" })}>
                  {isOpen ? "-" : "+"}
                </span>
              </CollapsibleTrigger>
            </div>
            <CardContent>
              <CollapsibleContent className="CollapsibleContent">
                {shareHolder && <ShareholdersData shareHolder={shareHolder} />}
              </CollapsibleContent>
            </CardContent>
          </Card>
        </Collapsible>
        <Card>
          <CardHeader>
            <CardTitle>Fill in the information for Shareholder</CardTitle>
          </CardHeader>
          <CardContent>
            <Shareholders />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default Main;
