import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InvitationTemplate,
  Reminder,
  Completion,
} from "@/app/admin/_components/templates";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <section className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>E-mail Template Preview</CardTitle>
          <CardDescription>
            This is the preview of E-mail Template which will be sent to new
            account users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {params.id === "1" && <InvitationTemplate type="Shareholder" href="#" />}
          {params.id === "2" && <InvitationTemplate type="Director" href="#" />}
          {params.id === "3" && <InvitationTemplate type="Guest User" href="#" />}
          {params.id === "4" && <Reminder type="Shareholder" href="#" />}
          {params.id === "5" && <Reminder type="Director" href="#" />}
          {params.id === "6" && <Reminder type="Guest User" href="#" />}
          {params.id === "7" && <Completion type="Shareholder" href="#" />}
          {params.id === "8" && <Completion type="Director" href="#" />}
          {params.id === "9" && <Completion type="You" href="#" />}
        </CardContent>
        <CardFooter>
          <small>Note: This is only preview of the E-mail Template</small>
        </CardFooter>
      </Card>
    </section>
  );
};

export default page;
