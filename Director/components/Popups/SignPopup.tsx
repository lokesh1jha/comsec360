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

type Props = {
  text: string;
};

export function SignPopup({ text }: Props) {
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
              <TableHead>Status</TableHead>
              <TableHead>Reminder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ma Heauteng</TableCell>
              <TableCell>Shareholder 1</TableCell>
              <TableCell className=" font-medium text-green-600">
                Signed
              </TableCell>
              <TableCell>
                <Button variant="outline" disabled>
                  Resend
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ma Heauteng</TableCell>
              <TableCell>Director 1</TableCell>
              <TableCell className=" font-medium text-green-600">
                Signed
              </TableCell>
              <TableCell>
                <Button variant="outline" disabled>
                  Resend
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Way To Web Pvt Ltd.</TableCell>
              <TableCell>Director 1</TableCell>
              <TableCell className=" font-medium text-destructive">
                Unsigned
              </TableCell>
              <TableCell>
                <Button variant="outline">Resend</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
