import { getCompanyDirectors } from "@/api/guestDirector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { directorsRows } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface DirectorsDataProps {
  id: string;
  type: "PERSON" | "COMPANY" | "You";
  surname?: string;
  name: string;
  idNo: string;
  address: string;
  email: string;
  phone: string;
}


const DirectorsData = () => {
  const [directorsContent, setDirectorsContent] = useState<DirectorsDataProps[]>([]);
  const [companyId, setCompanyId] = useState("");
  useEffect(() => {
    if(typeof window !== "undefined") {
      const company_id = localStorage.getItem("companyId");
      if(company_id)  setCompanyId(company_id);
    }
  }, []);

  useEffect(() => {
    if(companyId) {
      // fetch directors data using companyId
    const fetchDirectorsData = async (id: string) => {
      try {
        const response = await getCompanyDirectors(id);
        setDirectorsContent(response.data);
      } catch (error) {
        console.error("Failed to fetch directors data", error);
      }
    };

    fetchDirectorsData(companyId);
    }
  }, [companyId]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {directorsRows.map((item) => (
            <TableHead key={item.for}>{item.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {directorsContent.map((item) => (
          <TableRow key={item.id} className={cn({
            "text-destructive" : item.type === "You"
          })}>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.surname && item.surname.length ? item.surname : "-"}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.idNo}</TableCell>
            <TableCell>{item.address}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.phone}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DirectorsData;
