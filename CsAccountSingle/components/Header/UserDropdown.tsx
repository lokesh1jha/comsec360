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
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parseduser = JSON.parse(user);
      setUserName(parseduser.firstName + " " + parseduser.lastName);
    }
  }, []);
  
  const logoutUser = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("type");
      localStorage.removeItem("user");
    }
    catch (e) {
      console.log("Error in removing local storage", e);
    }
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL ?? 'http://3.74.43.250:3000/login';
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" cursor-pointer" asChild>
        <div className="flex items-center justify-end gap-2">
          <div className="sm:flex hidden flex-col justify-start items-end gap-0.5">
            <h1 className="text-base">{userName}</h1>
            <h2 className="text-xs">Account User</h2>
          </div>
          <Avatar>
            {/* <AvatarImage src="/user/user-01.png" /> */}
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/preferences'}>
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
            </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-destructive" onClick={() => logoutUser()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
