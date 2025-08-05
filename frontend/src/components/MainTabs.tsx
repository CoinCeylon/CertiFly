// components/MainTabs.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CertificatesTab from "./CertificatesTab";
import BatchesTab from "./BatchesTab";
import MessagesTab from "./MessagesTab";
import AnalyticsTab from "./AnalyticsTab";
import { Certificate, EnhancedStats } from "../ICBTDashboard";

interface MainTabsProps {
  certificates: Certificate[];
  selectedCertificate: Certificate | null;
  setSelectedCertificate: (cert: Certificate | null) => void;
  downloadCertificate: (batchId: string, studentId: string, studentName: string) => void;
  enhancedStats: EnhancedStats;
}

const MainTabs: React.FC<MainTabsProps> = ({
  certificates,
  selectedCertificate,
  setSelectedCertificate,
  downloadCertificate,
  enhancedStats
}) => {
  return (
    <Tabs defaultValue="certificates" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="certificates">Received Certificates</TabsTrigger>
        <TabsTrigger value="batches">Submitted Batches</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="certificates">
        <CertificatesTab
          certificates={certificates}
          selectedCertificate={selectedCertificate}
          setSelectedCertificate={setSelectedCertificate}
          downloadCertificate={downloadCertificate}
        />
      </TabsContent>

      <TabsContent value="batches">
        <BatchesTab />
      </TabsContent>

      <TabsContent value="messages">
        <MessagesTab />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsTab certificates={certificates} enhancedStats={enhancedStats} />
      </TabsContent>
    </Tabs>
  );
};

export default MainTabs;
