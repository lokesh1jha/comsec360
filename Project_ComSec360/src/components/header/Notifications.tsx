import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notificationContent } from "@/lib/constants";
import { Bell } from "lucide-react";

type NotificationCardProps = {
  title: string;
  description: string;
  date: string;
};

const NotificationCard = ({
  title,
  description,
  date,
}: NotificationCardProps) => {
  return (
    <div className="max-w-sm max-h-36 space-y-3">
      <article>
        <h1 className=" text-sm font-semibold">{title}</h1>
        <p className=" text-xs font-light">{description}</p>
      </article>
      <small className="text-muted-foreground font-light">{date}</small>
    </div>
  );
};

const NotificationsDropDown = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="relative" asChild>
          <Button variant="ghost" size="icon">
            <Bell />
            <div className="bg-destructive animate-pulse delay-500 absolute top-0 rounded-full size-2 right-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <ScrollArea className="h-48 w-72">
            <DropdownMenuLabel className="text-base">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notificationContent.map((item) => (
              <DropdownMenuItem key={item.title}>
                <NotificationCard {...item} />
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default NotificationsDropDown;
