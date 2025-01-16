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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SharesAllotment = ({
  numberOfShares,
  classOfShares,
  details,
}: {
  numberOfShares: number;
  classOfShares: string;
  details?: { shareholder: string; noOfShares: number }[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">{numberOfShares}</Button>
      </DialogTrigger>
      {!details ? (
        <DialogContent>
          <DialogTitle>No Shares Allotted!!</DialogTitle>
          <DialogDescription>
            Allot shares to Shareholders to see this info.
          </DialogDescription>
        </DialogContent>
      ) : (
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
              {details?.map((item) => (
                <TableRow key={item.shareholder}>
                  <TableCell>{item.shareholder}</TableCell>
                  <TableCell>{item.noOfShares}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default SharesAllotment;
