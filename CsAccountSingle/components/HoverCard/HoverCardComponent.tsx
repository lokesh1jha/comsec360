import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";
const HoverCardComponent = ({
  content,
  size,
}: {
  content: React.ReactNode;
  size: number;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <InfoIcon size={size} />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {content}
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardComponent;
