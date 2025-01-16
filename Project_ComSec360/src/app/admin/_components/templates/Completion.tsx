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

const Completion = ({ type, href }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Congratulations!! Your Project has been Completed.
        </CardTitle>
        <CardDescription>
          Here&nbsp;
          {type === "Shareholder" ? (
            <span> are the Share Certificate and </span>
          ) : (
            <span>is the </span>
          )}
          published link&nbsp;for&nbsp;{type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <article className="space-y-6">
          <article>
            <p>Dear James Bond,</p>
            <p>
              Congratulations on completing your project. Here are your final
              formalities associated with your project.
            </p>
          </article>
          <Link
            href={href}
            target="_blank"
            className={buttonVariants({ size: "lg" })}
          >
            Published Documents
          </Link>
          {type === "Shareholder" && (
            <Link
              href="https://comsecaccount.netlify.app/docs/certificate.pdf"
              target="_blank"
              className={buttonVariants({ size: "lg", className: "mx-4" })}
            >
              Share Certificate
            </Link>
          )}
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

export default Completion;
