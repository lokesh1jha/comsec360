import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shareholdersRows } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCompanySecretaryStore } from "@/store/CompanySecretaryStore";

const CompanySecretaryCard = () => {
  const companySecretaryData = useCompanySecretaryStore(
    (state) => state.companySecretaryData
  );
  console.log("companySecretaryData", companySecretaryData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Secretary</CardTitle>
        <CardDescription>
          Here are the details on Company Secretary
        </CardDescription>
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
            <TableHead>TCSP License No.</TableHead>
            <TableHead>TCSP License Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companySecretaryData && Object.keys(companySecretaryData).length > 0 ? (
            <TableRow>
              <TableCell>{companySecretaryData.type}</TableCell>
              <TableCell>{companySecretaryData.surname ?? "-"}</TableCell>
              <TableCell>{companySecretaryData.name}</TableCell>
              <TableCell>{companySecretaryData.idNo}</TableCell>
              <TableCell>{companySecretaryData.address}</TableCell>
              <TableCell>{companySecretaryData.email}</TableCell>
              <TableCell>{companySecretaryData.phone?.substring(0, companySecretaryData.phone.length - 10)}XXXXXXXXXX</TableCell>
              <TableCell>{companySecretaryData.tcspLicenseNo ?? "-"}</TableCell>
              <TableCell>{companySecretaryData.tcspReason ?? "-"}</TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center">No company secretary data available.</TableCell> {/* Fallback UI */}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default CompanySecretaryCard;
