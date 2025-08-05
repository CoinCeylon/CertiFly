// ICBTDashboard.tsx
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import MainTabs from "./components/MainTabs";
import BatchSubmissionDialog from "./components/BatchSubmissionDialog";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL; 

// Types (keeping existing interfaces)
export interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  course: string;
  graduation_date: string;
  gpa: number;
}

export interface BatchMetadata {
  batch_name: string;
  batch_description: string;
  academic_year: string;
  semester: string;
  graduation_ceremony_date: string;
  faculty: string;
  program_type: string;
  submission_deadline: string;
  contact_person: string;
  contact_email: string;
  notes: string;
}

export interface BatchSubmission {
  metadata: BatchMetadata;
  students: Student[];
}

export interface Certificate {
  messageId: string;
  batchId: string;
  batchName: string;
  studentsCount: number;
  students: Array<{
    student_id: string;
    name: string;
    certificate_id?: string;
    certificate_hash?: string;
    pdf_data_id?: string;
    pdf_data_hash?: string;
    transaction_hash: string;
    submitted?: boolean;
    certificateReceived?: boolean;
  }>;
  cardanoTxId?: string;
  batchDetails?: {
    faculty?: string;
    academic_year?: string;
    semester?: string;
  };
  issuedAt: string;
  receivedAt: string;
  status?: string;
  submittedAt?: string;
  submissionMessageId?: string;
  originalStudentsCount?: number;
  certificatesReceived?: number;
  pendingCertificates?: number;
  progressPercentage?: number;
  processingTime?: string;
}

export interface EnhancedStats {
  totalBatches: number;
  completed: number;
  partiallyCompleted: number;
  processing: number;
  submitted: number;
  totalStudents: number;
  totalCertificatesReceived: number;
  averageProcessingTime: string;
}

const ICBTDashboard = () => {
  const { toast } = useToast();
  
  // State Management
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [enhancedStats, setEnhancedStats] = useState<EnhancedStats>({
    totalBatches: 0,
    completed: 0,
    partiallyCompleted: 0,
    processing: 0,
    submitted: 0,
    totalStudents: 0,
    totalCertificatesReceived: 0,
    averageProcessingTime: 'N/A'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper functions (keeping existing logic)
  const fixCertificateData = (certificates: Certificate[]): Certificate[] => {
    return certificates.map(cert => {
      const originalCount = cert.originalStudentsCount || cert.studentsCount;
      const receivedCount = cert.certificatesReceived || 0;
      const fixedProgressPercentage = originalCount > 0 ? Math.round((receivedCount / originalCount) * 100) : 0;
      
      let fixedStatus = cert.status;
      if (receivedCount === originalCount && originalCount > 0) {
        fixedStatus = 'completed';
      } else if (receivedCount > 0) {
        fixedStatus = 'partially_completed';
      } else if (cert.status === 'certificates_issued') {
        fixedStatus = 'certificates_issued';
      }

      return {
        ...cert,
        progressPercentage: fixedProgressPercentage,
        status: fixedStatus
      };
    });
  };

  const recalculateStats = (certificates: Certificate[]): EnhancedStats => {
    const totalBatches = certificates.length;
    const completed = certificates.filter(c => c.status === 'completed').length;
    const partiallyCompleted = certificates.filter(c => c.status === 'partially_completed').length;
    const processing = certificates.filter(c => c.status === 'processing').length;
    const submitted = certificates.filter(c => c.status === 'submitted').length;
    const totalStudents = certificates.reduce((sum, c) => sum + (c.originalStudentsCount || c.studentsCount), 0);
    const totalCertificatesReceived = certificates.reduce((sum, c) => sum + (c.certificatesReceived || 0), 0);
    
    const batchesWithProcessingTime = certificates.filter(c => c.processingTime);
    const averageProcessingTime = batchesWithProcessingTime.length > 0 
      ? 'Available' 
      : 'N/A';

    return {
      totalBatches,
      completed,
      partiallyCompleted,
      processing,
      submitted,
      totalStudents,
      totalCertificatesReceived,
      averageProcessingTime
    };
  };

  // API Functions (keeping existing logic)
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${VITE_BASE_URL}/api/icbt/certificates`);
      const data = await response.json();

      console.log('Raw API response:', data);
      
      if (data.success) {
        const fixedCertificates = fixCertificateData(data.certificates);
        const correctedStats = recalculateStats(fixedCertificates);
        
        console.log('Fixed certificates:', fixedCertificates);
        console.log('Corrected stats:', correctedStats);
        
        setCertificates(fixedCertificates);
        setEnhancedStats(correctedStats);
        setError(null);
        
        toast({
          title: "Data Loaded",
          description: `Loaded ${fixedCertificates.length} batches with corrected statistics`,
        });
      } else {
        setError('Failed to fetch certificates');
      }
    } catch (err) {
      setError('Network error while fetching certificates');
      console.error('Error fetching certificates:', err);
      toast({
        title: "Error",
        description: "Failed to fetch certificate data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (batchId: string, studentId: string, studentName: string) => {
    try {
      const response = await fetch(`${VITE_BASE_URL}/api/icbt/download/student/${batchId}/${studentId}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${studentName}_Certificate.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Success",
          description: `Certificate for ${studentName} downloaded successfully!`,
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to download certificate for ${studentName}`,
        variant: "destructive"
      });
    }
  };

  const handleBatchSubmissionSuccess = (batchName: string) => {
    toast({
      title: "Success",
      description: `Batch "${batchName}" submitted successfully to Cardiff Met!`,
    });
    setShowBatchForm(false);
    setTimeout(() => {
      fetchCertificates();
    }, 1000);
  };

  // Initial data load
  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <div className="min-h-screen bg-[#fffefc]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        onNewBatch={() => setShowBatchForm(true)} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="lg:ml-64 transition-all duration-300">
        {/* Mobile header */}
        <div className="lg:hidden bg-[#0a334a] text-white p-4 flex items-center justify-between sticky top-0 z-30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg">ICBT Campus</h1>
          <div className="w-8" />
        </div>

        <div className="p-4 lg:p-8">
          <Header 
            onRefresh={fetchCertificates} 
            onNewBatch={() => setShowBatchForm(true)}
            loading={loading}
          />

          {error && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <StatsCards stats={enhancedStats} loading={loading} />

          <MainTabs 
            certificates={certificates}
            selectedCertificate={selectedCertificate}
            setSelectedCertificate={setSelectedCertificate}
            downloadCertificate={downloadCertificate}
            enhancedStats={enhancedStats}
           
          />
        </div>
      </div>

      <BatchSubmissionDialog
        open={showBatchForm}
        onOpenChange={setShowBatchForm}
        onSubmissionSuccess={handleBatchSubmissionSuccess}
        apiBaseUrl={VITE_BASE_URL}
      />
    </div>
  );
};

export default ICBTDashboard;
