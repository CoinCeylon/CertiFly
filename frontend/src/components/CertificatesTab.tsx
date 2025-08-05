// components/CertificatesTab.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Upload, Clock, CheckCircle2, AlertCircle, Award } from "lucide-react";
import { Certificate } from "../ICBTDashboard";
import CertificateDetailsView from "./CertificateDetailsView";

interface CertificatesTabProps {
  certificates: Certificate[];
  selectedCertificate: Certificate | null;
  setSelectedCertificate: (cert: Certificate | null) => void;
  downloadCertificate: (batchId: string, studentId: string, studentName: string) => void;
}

const CertificatesTab: React.FC<CertificatesTabProps> = ({
  certificates,
  selectedCertificate,
  setSelectedCertificate,
  downloadCertificate
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      'submitted': { className: 'bg-blue-100 text-blue-800', label: 'Submitted', icon: Upload },
      'processing': { className: 'bg-yellow-100 text-yellow-800', label: 'Processing', icon: Clock },
      'certificates_issued': { className: 'bg-purple-100 text-purple-800', label: 'Certificates Issued', icon: Award },
      'completed': { className: 'bg-green-100 text-green-800', label: 'Completed', icon: CheckCircle2 },
      'partially_completed': { className: 'bg-orange-100 text-orange-800', label: 'Partially Completed', icon: AlertCircle },
      'unknown': { className: 'bg-gray-100 text-gray-800', label: 'Unknown', icon: Eye }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['unknown'];
    const IconComponent = config.icon;
    
    return (
      <Badge className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Received Certificates from Cardiff Met</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{certificates.length} batches</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead>Cardano TX</TableHead>
              <TableHead>Received Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((certificate) => (
              <TableRow key={certificate.messageId || certificate.batchId}>
                <TableCell>
                  <div>
                    <div className="font-medium">{certificate.batchName}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {certificate.batchId}
                    </div>
                    {certificate.processingTime && (
                      <div className="text-xs text-blue-600">
                        Processed in {certificate.processingTime}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {getStatusBadge(certificate.status)}
                    {certificate.progressPercentage !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300" 
                            style={{ width: `${certificate.progressPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {certificate.progressPercentage}%
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {certificate.batchDetails?.faculty || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="secondary">
                      {certificate.certificatesReceived || certificate.studentsCount}/{certificate.originalStudentsCount || certificate.studentsCount} students
                    </Badge>
                
                  </div>
                </TableCell>
                <TableCell>
                  {certificate.batchDetails?.academic_year} - {certificate.batchDetails?.semester}
                </TableCell>
                <TableCell>
                  {certificate.cardanoTxId && (
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {certificate.cardanoTxId.substring(0, 12)}...
                    </code>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {certificate.submittedAt && (
                      <div>Submitted: {formatDate(certificate.submittedAt)}</div>
                    )}
                    {certificate.issuedAt && (
                      <div>Issued: {formatDate(certificate.issuedAt)}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCertificate(certificate)}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          <div className="flex items-center gap-2">
                            {certificate.batchName}
                            {getStatusBadge(certificate.status)}
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      <CertificateDetailsView 
                        certificate={selectedCertificate}
                        downloadCertificate={downloadCertificate}
                        formatDate={formatDate}
                      />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {certificates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No certificates received yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificatesTab;
