import { shareCapitalRows, shareCapitalContent } from "@/lib/constants";
import React from "react";
import {
    Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";

const ShareCapitalData = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {shareCapitalRows.map((item) => (
            <TableHead key={item.for}>{item.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {shareCapitalContent.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.class}</TableCell>
            <TableCell>{item.totalProposed}</TableCell>
            <TableCell>{item.currency}</TableCell>
            <TableCell>{item.unitPrice}</TableCell>
            <TableCell>{item.total}</TableCell>
            <TableCell>{item.paid}</TableCell>
            <TableCell>{item.unpaid}</TableCell>
            <TableCell>{item.rightsAttached}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ShareCapitalData;
