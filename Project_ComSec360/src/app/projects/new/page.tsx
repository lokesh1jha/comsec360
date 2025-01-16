"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShareCapitalStore } from "@/store/ShareCapitalStore";
import { WelcomeDialog } from "../_components/Popups/WelcomeDialog";
import CompanyInfoForm from "../_components/forms/CompanyInfoForm";
import FormWrapper from "@/components/FormWrapper";
import ShareCapitalForm from "../_components/forms/ShareCapitalForm";
import ShareCapitalInfo from "@/components/datatables/ShareCapitalInfo";

const ProjectRegistrationPage = () => {
  const { shareCapitalData } = useShareCapitalStore();
  return (
    <section className="py-4 container">
      <WelcomeDialog />
      <Tabs defaultValue="Company Info">
        <TabsList className="grid w-full md:grid-cols-4 sm:grid-cols-2 grid-cols-1 sm:mb-0 mb-40">
          <TabsTrigger value="Company Info">Company Info</TabsTrigger>
          <TabsTrigger value="Shares Info">Shares Info</TabsTrigger>
          <TabsTrigger value="Directors">Directors</TabsTrigger>
          <TabsTrigger value="Company Secretary">Company Secretary</TabsTrigger>
        </TabsList>
        <TabsContent value="Company Info">
          <CompanyInfoForm />
        </TabsContent>
        <TabsContent value="Shares Info">
          <FormWrapper
            name="Share Capital"
            shareCapitalForm={<ShareCapitalForm />}
            dataTable={<ShareCapitalInfo />}
          />
          <FormWrapper name="Shareholder" dataTable={<ShareCapitalInfo />} />
        </TabsContent>
        <TabsContent value="Directors">Directors</TabsContent>
        <TabsContent value="Company Secreatary">Company Secretary</TabsContent>
      </Tabs>
    </section>
  );
};

export default ProjectRegistrationPage;
