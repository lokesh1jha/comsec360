"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Popup() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className=" pb-3 flex items-center gap-2">
            <Image
              src="/logo/logo.png"
              width={36}
              height={36}
              alt="logo"
              priority
              className="h-auto w-auto"
            />
            <span>
              <AlertDialogTitle className="mb-0.5">ComSec360</AlertDialogTitle>
              <AlertDialogDescription>
                Company Secretarial Management
              </AlertDialogDescription>
            </span>
          </div>
          <AlertDialogTitle>
            You do not have any project or company yet!!
          </AlertDialogTitle>
          <AlertDialogDescription>
            Project - Company Incorporate Starts.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setOpen(false)}>OK</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
