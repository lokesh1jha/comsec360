"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";

const UserDropdown = () => {
    const [userName, setUserName] = useState({ firstName: "", surname: "" });

    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setUserName({ firstName: storedUser.firstName || "", surname: storedUser.surname || "" });
    }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" cursor-pointer" asChild>
        <div className="flex items-center justify-end gap-2">
          <div className="sm:flex hidden flex-col justify-start items-end gap-0.5">
            <h1 className="text-base">{userName.firstName} {userName.surname}</h1>
            <h2 className="text-xs">Shareholder</h2>
          </div>
          <Avatar>
            {/* <AvatarImage src="/user/user-05.png" /> */}
            <AvatarFallback>{userName.firstName.charAt(0) ?? "User"}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
