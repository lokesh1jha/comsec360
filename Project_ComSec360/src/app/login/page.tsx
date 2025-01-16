import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthForm from "@/components/AuthForm";
// import Link from "next/link";
// import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[700px]">
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto grid w-[450px] gap-6 animate-in slide-in-from-left-96 delay-500 duration-700">
          <div className="mx-auto my-6">
            <Image
              src="/logo/logoFull.png"
              width={200}
              height={200}
              className="object-contain mix-blend-multiply"
              alt="logo"
            />
          </div>
          <CardHeader className="grid gap-2">
            <CardTitle className="text-3xl font-bold">Welcome to ComSec360</CardTitle>
            <CardDescription className="text-balance text-muted-foreground">
              Login to your Account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <AuthForm />
          </CardContent>
          {/* <CardFooter>
            <span className=" text-destructive">This button is only for testing purposes.</span>
            <Link href="/admin" className={buttonVariants()}>Link to Admin</Link>
          </CardFooter> */}
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
