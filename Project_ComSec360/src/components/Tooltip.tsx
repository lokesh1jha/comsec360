import {
    Tooltip as TooltipWrapper,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import { InfoIcon } from "lucide-react";
  
  const Tooltip= ({
    content,
    className,
  }: {
    content: string;
    className?: string;
  }) => {
    return (
      <TooltipProvider>
        <TooltipWrapper>
          <TooltipTrigger>
            <InfoIcon size={20}/>
          </TooltipTrigger>
          <TooltipContent className={className}>
            <p>{content}</p>
          </TooltipContent>
        </TooltipWrapper>
      </TooltipProvider>
    );
  };
  
  export default Tooltip;