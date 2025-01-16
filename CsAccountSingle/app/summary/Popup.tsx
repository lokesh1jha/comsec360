import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

const SharesPopup = ({
  numberOfShares,
  classOfShares,
  details,
}: {
  numberOfShares: number;
  classOfShares: string;
  details?: { classOfShares: string; noOfShares: number }[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">{numberOfShares}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{classOfShares} Shares</DialogTitle>
          <DialogDescription>
            Here are the details of shareholders with {classOfShares} Shares
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableCaption>Total Shares {numberOfShares}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Shareholder</TableHead>
              <TableHead>No of Shares</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {details &&
              details.map((item) => (
                <TableRow key={item.classOfShares}>
                  <TableCell>{item.classOfShares}</TableCell>
                  <TableCell>{item.noOfShares}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default SharesPopup;
