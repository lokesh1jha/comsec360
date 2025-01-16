"use client"
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { changePassword } from "@/lib/api/company";
import { toast } from "@/components/ui/use-toast";
import { useDataContext } from "@/context/ContextProvider";

const SettingsPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { setCompanyId, companyId } = useDataContext();
  
    useEffect(() => {
      if (typeof window !== "undefined") { // Ensure window is defined
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const type = params.get('type');
        const user = params.get('user') ? decodeURIComponent(params.get('user')!) : null;
        const companyId = params.get('companyId');
  
        if (token && type && user && companyId) {
          console.log("companyId", companyId);
          localStorage.clear();
        }
  
        if (token) localStorage.setItem('token', token);
        if (type) localStorage.setItem('type', type);
        if (user) localStorage.setItem('user', user);
        
        // Update companyId in context and localStorage
        if (companyId) {
          setCompanyId(companyId); // Update context state
          localStorage.setItem('companyId', companyId); // Update localStorage directly if needed
        }
        if (!localStorage.getItem('token') || !localStorage.getItem('type') || !localStorage.getItem('user') || !localStorage.getItem('companyId')) {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL ?? 'http://3.74.43.250:3000/login'}`;
        }
        // Clear the URL parameters
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());
      }
    }, [setCompanyId]); // Add setCompanyId as a dependency
  
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleChangePassword = async () => {
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);
    const response = await changePassword(oldPassword, newPassword);
    if (response.success) {
      toast({
        title: "Success",
        description: "Password changed successfully"
      });
      handleClosePopup();
    }
    else {
      toast({
        title: "Error",
        description: response.message
      });
    }
  };

  return (
    <div className="md:container w-full py-6 md:px-0 px-6">
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>{language === "en" ? "Preferences" : "偏好"}</CardTitle>
          <CardDescription>
            {language === "en"
              ? "You can change your language settings from here"
              : "您可以从此处更改您的语言设置"}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-5">
          <Select defaultValue="en" onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{language === "en" ? "Language Preferences" : "语言首选项"}</SelectLabel>
                <SelectItem value="en">English (英语)</SelectItem>
                <SelectItem value="chi">Chinese (中国人)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <CardDescription>
            {language === "en"
              ? "Copyright © 2012 - 2024 ComSec360®. All rights reserved."
              : "版权所有 © 2012 - 2024 ComSec360®。保留所有权利。"}
          </CardDescription>
        </CardFooter>
      </Card>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>{language === "en" ? "Account Details" : "账户详细信息"}</CardTitle>
          <CardDescription>
            {language === "en"
              ? "You can change your password from here."
              : "您可以从此处更改密码。"}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-5">
          <CardDescription>Email: example@gmail.com</CardDescription>
          <Button onClick={handleOpenPopup}>
            {language === "en" ? "Change Password" : "更改密码"}
          </Button>
        </CardContent>
        <CardFooter>
          <CardDescription>
            {language === "en"
              ? "Copyright © 2012 - 2024 ComSec360®. All rights reserved."
              : "版权所有 © 2012 - 2024 ComSec360®。保留所有权利。"}
          </CardDescription>
        </CardFooter>
      </Card>
      {isPopupOpen && (
        <AlertDialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
          <AlertDialogContent>
            <input
              type="password"
              placeholder={language === "en" ? "Old Password" : "旧密码"}
              className="w-full mb-2 p-2 border rounded"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder={language === "en" ? "New Password" : "新密码"}
              className="w-full mb-2 p-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleClosePopup} className="mr-2 w-20">
                {language === "en" ? "Cancel" : "取消"}
              </Button>
              <Button onClick={handleChangePassword} className="w-20 bg-blue-500 text-white">
                {language === "en" ? "Submit" : "提交"}
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default SettingsPage;
