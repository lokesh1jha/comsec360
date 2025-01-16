import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const AdminEmailsPage = () => {
  return (
    <section className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>E-mail Template Preview for New Account Users</CardTitle>
          <CardDescription>
            This is the preview of E-mail Template which will be sent to new
            account users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle>Welcome to ComSec360</CardTitle>
              <CardDescription>
                Get Started with ComSec360 as an Account User
              </CardDescription>
            </CardHeader>
            <CardContent>
              <article className="space-y-6">
                <article>
                  <p>Dear James Bond,</p>
                  <p>
                    Your account has been created successfully. Here are your
                    Login Details.
                  </p>
                </article>
                <article className="flex gap-3">
                  <h1 className=" font-semibold">Username: </h1>
                  <p className="bg-muted rounded">jamesbond007@gmail.com</p>
                </article>
                <article className="flex gap-3">
                  <h1 className=" font-semibold">Password: </h1>
                  <p className="bg-muted rounded">jY-A4y467/H|</p>
                </article>
              </article>
            </CardContent>
            <CardFooter className="flex-col items-start">
              <div className="text-sm text-muted-foreground">
                Note: The above shared details are confidential.&nbsp;
                <b className="bg-muted rounded">Do not share it with anyone.</b>
              </div>
              <p className="mb-6">Thanks.</p>
              <p>Yours Truly,</p>
              <p className=" font-medium">Team ComSec360</p>
              <p className="mt-12 text-xs">
                For any further queries contact at:&nbsp;
                <Link
                  href="mailto:support@comsec360.com"
                  className={buttonVariants({
                    variant: "link",
                    className: "text-xs",
                  })}
                >
                  support@comsec360.com
                </Link>
              </p>
            </CardFooter>
          </Card>
        </CardContent>
        <CardFooter>
          <small>Note: This is only preview of the E-mail Template</small>
        </CardFooter>
      </Card>
    </section>
  );
};

export default AdminEmailsPage;
