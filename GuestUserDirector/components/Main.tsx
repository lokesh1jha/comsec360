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
import DirectorsData from "./DirectorsData";
import { buttonVariants } from "./ui/button";
import Directors from "./Forms/DirectorsMain";
import { getDirectorInviteById } from "@/api/guestDirector";

const Main = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [companyName, setCompanyName] = useState("Tencent Games Pvt Ltd. / ABCD");
  const [DirectorName, setDirectorName] = useState("Minamoto Riotsu");
  const [inviteId, setInviteId] = useState("");


  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("id");
      if (id) {
        setInviteId(id);
      }
    }
  }, []);

  useEffect(() => {
    if (inviteId) {
      getDirectorsinviteById(inviteId)
    }
  }, [inviteId]);

  const getDirectorsinviteById = async (id: string) => {
    // fetch directors data using companyId
    try {

      const response = await getDirectorInviteById(id);

      if (response) {
        // handle the response data
        setDirectorName(response.data.name);
        setCompanyName(response.companyInfo.name);
      }
    } catch (error) {
      console.error("Error fetching directors invite:", error);
    }
  }
  return (
    <Card className="my-3">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardDescription>{companyName}</CardDescription>
        <CardTitle>{DirectorName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full px-1.5 space-y-6">
          <Card>
            <div className="flex flex-1 justify-between items-center">
              <CardHeader>
                <CardTitle>Directors</CardTitle>
                <CardDescription>
                  Here are the details on Directors
                </CardDescription>
              </CardHeader>
              <CollapsibleTrigger type="button" className="pr-6">
                <span className={buttonVariants({ variant: "outline" })}>
                  {isOpen ? "-" : "+"}
                </span>
              </CollapsibleTrigger>
            </div>
            <CardContent className="space-y-6">
              <CollapsibleContent className="CollapsibleContent">
                <DirectorsData />
              </CollapsibleContent>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fill in the Information for Director</CardTitle>
            </CardHeader>
            <CardContent>
              <Directors />
            </CardContent>
          </Card>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default Main;
