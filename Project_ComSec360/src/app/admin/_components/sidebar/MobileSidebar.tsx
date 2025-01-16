"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LayoutGrid, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

const MobileSidebar = () => {
  const currentPath = usePathname();
  const [admin, setAdmin] = useState(false);
  const [incorporation, setIncorporation] = useState(false);
  const [annualReturn, setAnnualReturn] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleCollapsibleChange = useCallback(
    (title: string) => {
      if (title === "Admin") {
        setAdmin((prev) => !prev);
      } else if (title === "Incorporation") {
        setIncorporation((prev) => !prev);
      } else if (title === "Annual Return") {
        setAnnualReturn((prev) => !prev);
      }
    },
    [setAdmin, setIncorporation, setAnnualReturn],
  );
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <Image
            src="/logo/logoFull.png"
            width={100}
            height={100}
            alt="logo-img"
            className="object-contain size-[50%]"
          />
          <SheetDescription className="text-left">
            Admin Dashboard
          </SheetDescription>
        </SheetHeader>
        <nav className="grid items-start text-sm font-medium gap-4 mt-6">
          <Link
            href="/admin"
            className={cn("sidebar-button", {
              "bg-muted text-primary": "/admin" === currentPath,
            })}
          >
            <LayoutGrid className="size-4" /> Dashboard
          </Link>
          <h1 className="text-lg font-medium mt-4">Projects</h1>
          {navItems.map((item) => (
            <Collapsible
              key={item.title}
              open={
                item.title === "Admin"
                  ? admin
                  : item.title === "Incorporation"
                    ? incorporation
                    : annualReturn
              }
              onOpenChange={() => handleCollapsibleChange(item.title)}
              className="ml-3"
            >
              <CollapsibleTrigger
                className={buttonVariants({
                  variant: "ghost",
                  className: "flex gap-3 mb-2",
                })}
              >
                {item.icon} {item.title}
              </CollapsibleTrigger>
              <CollapsibleContent className="CollapsibleContent">
                <div className="px-4 flex flex-col space-y-3">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn("sidebar-button", {
                        "bg-muted text-primary": subItem.href === currentPath,
                      })}
                    >
                      {subItem.icon} {subItem.title}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
