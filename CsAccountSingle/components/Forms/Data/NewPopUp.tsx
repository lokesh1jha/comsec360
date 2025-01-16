import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const NewPopup = ({
  name,
  surname,
  details
}: {
  name: string;
  surname: string;
  details?: { type: string; noOfShares: number, shareCertificateUrl: string }[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">View Shares</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {name} {surname === "-" ? " " : surname}
          </DialogTitle>
          <DialogDescription>
            Here are the share details of {name}{" "}
            {surname === "-" ? " " : surname}:
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableCaption>
            Share Details of {name} {surname === "-" ? " " : surname}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Class of Shares</TableHead>
              <TableHead>No of Shares</TableHead>
              <TableHead>Share Certificates</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {details?.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail.type}</TableCell>
                  <TableCell>{detail.noOfShares}</TableCell>
                  <TableCell>
                    <Link
                      href={detail.shareCertificateUrl || "/docs/certificate.pdf"}
                      target="_blank"
                      className={buttonVariants({ variant: "outline" })}
                    >
                      Preview
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default NewPopup;
