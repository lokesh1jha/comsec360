import NewPopup from "@/components/Forms/Data/NewPopUp";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shareholdersRows } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useShareHolderStore } from "@/store/shareHolderDataStore";
import Link from "next/link";

const NewShareholdersCard = () => {
  const shareholdersData = useShareHolderStore((state) => state.shareHolderData);
  console.log("shareholdersData------------", shareholdersData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shareholders</CardTitle>
        <CardDescription>Here are the details on Shareholders</CardDescription>
      </CardHeader>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {shareholdersRows.map((row) => (
              <TableHead
                key={row.for}
                className={cn({
                  hidden: row.for === "classOfShares" || row.for === "totalShares",
                })}
              >
                {row.label}
              </TableHead>
            ))}
            <TableHead>Share Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shareholdersData && shareholdersData.length > 0 ? (
            shareholdersData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.surname}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.idNo}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone.substring(0, item.phone.length - 10)}XXXXXXXXXX</TableCell>
                <TableCell>
                  <NewPopup
                  name={item.name}
                  surname={item.surname}
                  details={item.sharesDetails?.map(detail => ({
                    type: detail.classOfShares ?? "",
                    noOfShares: detail.noOfShares,
                    shareCertificateUrl: detail.shareCertificateUrl ?? ""
                  }))}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">No shareholders found.</TableCell> {/* Fallback UI */}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default NewShareholdersCard;
