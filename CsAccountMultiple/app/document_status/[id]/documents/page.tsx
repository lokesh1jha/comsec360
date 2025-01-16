import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { data } from "@/lib/constants";
import { Slash } from "lucide-react";
import Main from "./Main";

const page = ({ params }: { params: { id: string } }) => {
  const projectToFetch = data.find((project) => project.id === params.id);

  return (
    <Card className="my-6 container">
      <Breadcrumb className="py-4 px-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{projectToFetch?.company}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>
              Project - {projectToFetch?.project} (id: {params.id})
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CardHeader>
        <CardTitle> Project - {projectToFetch?.project} Completion</CardTitle>
        <CardDescription>
          The application form and documents are submitted to Companies
          Registry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Main/>
      </CardContent>
    </Card>
  );
};

export default page;
