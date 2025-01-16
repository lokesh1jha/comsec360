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

type Props = {
  type: string;
  href: string;
};

const OTPGuestUser = ({ type, href }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to ComSec360</CardTitle>
        <CardDescription>
          Get Started with ComSec360 as a {type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <article className="space-y-6">
          <article>
            <p>Dear James Bond,</p>
            <p>
              You have been invited for submitting data required for the process
              of filling NNC1 Form as a {type}.
            </p>
            <p>
              Click on the button below and enter the given OTP to get started
              with submitting data:
            </p>
          </article>
          <Link
            href={href}
            target="_blank"
            className={buttonVariants({ size: "lg" })}
          >
            Accept Invitation
          </Link>
          <article className="flex gap-3">
            <h1 className=" font-semibold">OTP: </h1>
            <span className=" font-extrabold">9614</span>
          </article>
        </article>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <div className="text-sm text-muted-foreground">
          Note: The above shared details are confidential.&nbsp;
          <b className="bg-muted rounded">Do not share it with anyone.</b>
        </div>
        <p className="mb-6">Thanks.</p>
        <p>Yours truly,</p>
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
  );
};

export default OTPGuestUser;
