"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "../AuthProvider";

type UserDropdownProps = {
  name: string;
  userType: "Admin" | "Guest" | "Account";
  profileImage: string;
  email: string;
};

const userDropdownLinks = [
  {
    title: "Profile",
    icon: <User className="mr-2 h-4 w-4" />,
    href: "/settings/#profile",
  },
  {
    title: "Account Settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    href: "/settings/#account",
  },
] as const;

const UserDropdown = ({
  name,
  userType,
  profileImage,
  email,
}: UserDropdownProps) => {
  const { logout } = useAuthContext()

  const signOut = () => {
    console.log("Signing out");
    logout();
  };

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <div className="flex items-center justify-end gap-2">
          <article className="sm:flex hidden flex-col justify-start items-end gap-0.5">
            <h1 className="text-base">{name}</h1>
            <small className="text-muted-foreground">{userType} User</small>
          </article>
          <Avatar>
            {/* <AvatarImage src={profileImage} /> */}
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {userDropdownLinks.map((item) => (
            <DropdownMenuItem key={item.title}>
              <Link href={item.href} className="flex gap-1.5 items-center">
                {item.icon}
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={signOut} className="text-destructive hover:bg-destructive hover:text-foreground">
            <form
              className="flex gap-1.5 items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </form>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
};

export default UserDropdown;
