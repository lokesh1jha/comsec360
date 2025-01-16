import { notificationContent } from "@/lib/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";

type MessageCardProps = {
  title: string;
  description: string;
  date: string;
};

const NotificationCard = ({ title, description, date }: MessageCardProps) => {
  return (
    <Card className="flex justify-start items-center gap-2 p-3 max-w-sm max-h-28">
      <CardHeader>
        <CardTitle className="font-medium text-xs">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardDescription className="text-xs font-light mt-2">
          {date}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

const NotificationsDropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <Bell />
        <div className=" bg-destructive animate-pulse delay-500 absolute top-0 rounded-full h-2 w-2 right-0" />
      </DropdownMenuTrigger>
      <DropdownMenuSeparator />
      <DropdownMenuContent>
        <ScrollArea className=" h-48  w-72">
          <DropdownMenuLabel>Messages</DropdownMenuLabel>
          {notificationContent.map((item) => (
            <DropdownMenuItem key={item.title}>
              <NotificationCard {...item} />
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropDown;
