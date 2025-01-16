"use client";

import {
  Card,
  CardContent,
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
import { shareCapitalRows } from "@/lib/constants";
import { useShareCapitalStore } from "@/store/shareCapitalDataStore";
import SharesPopup from "../Popup";

const ShareCapitalCard = () => {
  const shareCapitalData = useShareCapitalStore(
    (state) => state.shareCapitalData
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Capital</CardTitle>
        <CardDescription>Here are the details on ShareCapital</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {shareCapitalRows.map((row) => (
                <TableHead key={row.for}>{row.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {shareCapitalData && shareCapitalData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.class}</TableCell>
                <TableCell>{item.totalProposed}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell>{item.unitPrice}</TableCell>
                <TableCell>
                  {item.total}
                </TableCell>
                <TableCell>
                <SharesPopup
                    numberOfShares={item.paid}
                    classOfShares={item.class}
                  />
                </TableCell>
                <TableCell>{item.unpaid}</TableCell>
                <TableCell>{item.rightsAttached}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShareCapitalCard;
