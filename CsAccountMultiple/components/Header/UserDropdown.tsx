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
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem('token');
      const storedType = localStorage.getItem('type');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const storedCompanyId = localStorage.getItem('companyId');
      
      setToken(storedToken);
      setType(storedType);
      setUser(storedUser);
      setCompanyId(storedCompanyId);
      console.log("storedUser", storedUser);
    }
  }, []);

  const signOut = () => {
    console.log("Signing out");
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL || "http://3.74.43.250:3000/login";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" cursor-pointer" asChild>
        <div className="flex items-center justify-end gap-2">
          <div className="sm:flex hidden flex-col justify-start items-end gap-0.5">
            <h1 className="text-base">{user ? `${user.firstName} ${user.lastName}` : "Hi"}</h1>
            <h2 className="text-xs">Account User</h2>
          </div>
          <Avatar>
            {/* <AvatarImage src="/user/user-02.png" /> */}
            <AvatarFallback>{user ? `${user.firstName.charAt(0)}` : "User"}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_CS_ACCOUNT_USER_URL ?? 'http://52.59.5.100:3000'}/preferences?token=${token}&type=${type}&user=${encodeURIComponent(JSON.stringify(user) ?? "")}&companyId=${companyId}`}>
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
            </DropdownMenuItem>
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
  );
};

export default UserDropdown;
