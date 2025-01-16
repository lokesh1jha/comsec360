import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquareQuote } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { messagesContent } from "@/lib/constants";

type MessageCardProps = {
  imgSrc: string;
  name: string;
  message: string;
  time: string;
};

const MessageCard = ({ imgSrc, name, message, time }: MessageCardProps) => {
  return (
    <Card className="flex justify-start items-center gap-2 p-3 max-w-sm max-h-28">
      <Avatar>
        <AvatarImage src={imgSrc} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>
      <CardHeader>
        <CardTitle className=" font-medium text-xs">{name}</CardTitle>
        <CardDescription>{message}</CardDescription>
        <CardDescription className="text-xs font-light">{time}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const MessageDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <MessageSquareQuote />
        <div className=" bg-destructive animate-pulse delay-500 absolute top-0 rounded-full h-2 w-2 right-0" />
      </DropdownMenuTrigger>
      <DropdownMenuSeparator/>
      <DropdownMenuContent>
        <ScrollArea className=" h-48  w-72">
          <DropdownMenuLabel>Messages</DropdownMenuLabel>
          {messagesContent.map((item) => (
            <DropdownMenuItem key={item.name}>
              <MessageCard {...item} />
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageDropdown;
