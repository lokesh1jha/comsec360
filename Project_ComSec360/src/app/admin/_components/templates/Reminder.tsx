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

const Reminder = ({ type, href }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminder To Submit Signature!!</CardTitle>
        <CardDescription>
          A Gentle reminder to submit signature as a {type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <article className="space-y-6">
          <article>
            <p>Dear James Bond,</p>
            <p>
              You have been invited for submitting Signature required for the
              process of filling NNC1 Form as a {type}.
            </p>
            <p>
              Click on the button below to get started with submitting
              Signature:
            </p>
          </article>
          <Link
            href={href}
            target="_blank"
            className={buttonVariants({ size: "lg" })}
          >
            Submit your Signature
          </Link>
        </article>
      </CardContent>
      <CardFooter className="flex-col items-start">
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

export default Reminder;
