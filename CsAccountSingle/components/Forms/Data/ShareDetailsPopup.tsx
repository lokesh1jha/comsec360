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
import { Button } from "@/components/ui/button";

const ShareDetailsPopup = ({
  name,
  surname,
  details,
}: {
  name: string;
  surname: string;
  details?: { type?: string; classOfShares?: string; noOfShares: number }[];
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
            Here are the share details of {name} {surname === "-" ? " " : surname}:
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
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {details ? details.map((details) => (
                <>
                  <TableCell>{details.type || details.classOfShares}</TableCell>
                  <TableCell>{details.noOfShares}</TableCell>
                </>
              )) : (
                <TableCell colSpan={2}>No data available</TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDetailsPopup;
