"use client";
import { InviteGuestUsers, Shareholders } from "@/components/Forms";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDataContext } from "@/context/ContextProvider";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ShareholdersData from "../Forms/Data/ShareholdersData";

const ShareHoldersMain = () => {
  const { setTabValue, setDisableDirectors } = useDataContext();
  const [value, setValue] = useState<"self" | "invite" | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  return (
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
        <CardContent className="space-y-6">
          <CollapsibleContent className="CollapsibleContent">
            <ShareholdersData />
          </CollapsibleContent>
          <RadioGroup>
            <div
              className="flex items-center space-x-2 py-6"
              onClick={() => setValue("self")}
            >
              <RadioGroupItem value="self" id="r1" checked={value === "self"} />
              <Label htmlFor="r1" className="text-2xl">
                Fill in all the information for this Shareholder
              </Label>
            </div>
            <div
              className={cn({
                hidden: value === "invite" || value === null,
              })}
            >
              <Shareholders />
            </div>
            <div
              className="flex items-center space-x-2 py-6"
              onClick={() => setValue("invite")}
            >
              <RadioGroupItem
                value="invite"
                id="r2"
                checked={value === "invite"}
              />
              <Label htmlFor="r2" className="text-2xl">
                Invite a Shareholder to fill in the details.
              </Label>
            </div>
            <div
              className={cn({
                hidden: value === "self" || value === null,
              })}
            >
              <InviteGuestUsers text="Shareholder" />
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end items-center">
          <Button
            variant="destructive"
            onClick={() => {
              setDisableDirectors(false);
              setTabValue("D");
            }}
          >
            Save & Next
          </Button>
        </CardFooter>
      </Card>
    </Collapsible>
  );
};

export default ShareHoldersMain;
