"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadAuthFromLocalStorage } from "@/lib/localStorage";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    loadAuthFromLocalStorage();
  }, [])
  return (
    <div className="container lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[700px]">
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto grid w-[350px] border-none shadow-2xl gap-6 px-4 animate-in slide-in-from-left-96 delay-500 duration-700">
          <div className="my-6">
            <Image
              src="/logo/logoFull.png"
              width={200}
              height={200}
              className="object-contain mix-blend-multiply"
              alt="logo"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">ComSec360</CardTitle>
            <CardDescription className="text-balance text-muted-foreground">
              Welcome to ComSec360
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>The modern way to fill NNC1 Forms</p>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "gooeyLeft",
                className: "w-full",
              })}
            >
              Login To Continue
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:block animate-in slide-in-from-right-96 delay-500 duration-700">
        <Image
          src="/illustrations/formFilling.png"
          alt="Image"
          width={1920}
          height={1080}
          priority
          className="h-full w-full object-contain mix-blend-multiply dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
