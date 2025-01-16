"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyRevise from "./CompanyRevise";
import ObtainDocuments from "./ObtainDocuments";
import ShareCertificate from "./ShareCertificate";
import Other from "./Other";

const Main = () => {
  const [changeTab, setChangeTab] = useState("revise");

  return (
    <Tabs value={changeTab} onValueChange={setChangeTab}>
      <TabsList>
        <TabsTrigger value="revise">Revise Details</TabsTrigger>
        <TabsTrigger value="documents">Obtain Documents</TabsTrigger>
        <TabsTrigger value="certificate">Share Certificate</TabsTrigger>
        <TabsTrigger value="other">Published Documents</TabsTrigger>
      </TabsList>
      <TabsContent value="revise">
        <CompanyRevise setChangeTab={setChangeTab} />
      </TabsContent>
      <TabsContent value="documents">
        <ObtainDocuments setChangeTab={setChangeTab} />
      </TabsContent>
      <TabsContent value="certificate">
        <ShareCertificate setChangeTab={setChangeTab} />
      </TabsContent>
      <TabsContent value="other">
        <Other />
      </TabsContent>
    </Tabs>
  );
};

export default Main;
