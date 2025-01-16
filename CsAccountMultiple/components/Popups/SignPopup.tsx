import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface DocumentStatus {
  [key: string]: {
    type: string;
    NNC1: string;
    minutes?: string;
    ordinaryShareAgreement?: string;
    [key: string]: string | undefined;
  };
}

type Props = {
  text: string;
  status: DocumentStatus;
  name: string;
};

export function SignPopup({ text, status, name }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <span
            className={cn({
              "text-muted-foreground": text === "No Sign Needed",
              "text-destructive": text.includes("Unsigned"),
              "text-foreground": text.includes("Signed"),
            })}
          >
            {text}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{text}</DialogTitle>
          <DialogDescription>User&lsquo;s signing status</DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Signed</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(status).map(([key, value]) => {
              if (
              (name === "minutes" && value.type !== "director") ||
              (name === "ordinaryShareAgreement" && value.type !== "shareholder")
              ) {
              return null;
              }
              return (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{value.type}</TableCell>
                <TableCell
                className={cn("font-medium", {
                  "text-green-600": value[name] === "signed",
                  "text-destructive": value[name] === "unsigned",
                })}
                >
                {value[name] === "signed" ? <Check /> : <X />}
                </TableCell>
                <TableCell>
                {value[name] === "signed" ? (
                  <Button>Download</Button>
                ) : (
                  <Button variant="outline">Resend</Button>
                )}
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
