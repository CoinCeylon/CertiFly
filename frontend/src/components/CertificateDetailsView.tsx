// components/CertificateDetailsView.tsx
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Award, Clock, Eye, AlertCircle } from "lucide-react";
import { Certificate } from "../ICBTDashboard";

interface CertificateDetailsViewProps {
  certificate: Certificate | null;
  downloadCertificate: (batchId: string, studentId: string, studentName: string) => void;
  formatDate: (dateString: string) => string;
}

const CertificateDetailsView: React.FC<CertificateDetailsViewProps> = ({
  certificate,
  downloadCertificate,
  formatDate
}) => {
  if (!certificate) return null;

  const viewOnCardano = (transactionHash: string) => {
    const cardanoExplorerUrl = `https://preprod.cardanoscan.io/transaction/${transactionHash}`;
    window.open(cardanoExplorerUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Status Timeline */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-3">Batch Timeline</h4>
        <div className="space-y-2">
          {certificate.submittedAt && (
            <div className="flex items-center gap-2 text-sm">
              <Upload className="h-4 w-4 text-blue-500" />
              <span>Submitted: {formatDate(certificate.submittedAt)}</span>
            </div>
          )}
          {certificate.issuedAt && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-purple-500" />
              <span>Certificates Issued: {formatDate(certificate.issuedAt)}</span>
            </div>
          )}
          {certificate.processingTime && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>Processing Time: {certificate.processingTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {certificate.originalStudentsCount || certificate.studentsCount}
          </div>
          <div className="text-sm text-blue-600">Submitted</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {certificate.certificatesReceived || certificate.studentsCount}
          </div>
          <div className="text-sm text-green-600">Completed</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {certificate.pendingCertificates || 0}
          </div>
          <div className="text-sm text-orange-600">Pending</div>
        </div>
      </div>

      {/* Batch Information */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
        <div>
          <label className="text-sm font-medium">Batch ID</label>
          <p className="text-sm text-muted-foreground">{certificate.batchId}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Faculty</label>
          <p className="text-sm text-muted-foreground">
            {certificate.batchDetails?.faculty || 'N/A'}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Academic Year</label>
          <p className="text-sm text-muted-foreground">
            {certificate.batchDetails?.academic_year} - {certificate.batchDetails?.semester}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Cardano Transaction</label>
          <p className="text-sm text-muted-foreground font-mono">
            {certificate.cardanoTxId || 'N/A'}
          </p>
        </div>
      </div>

      {/* Students List */}
      <div>
        <h4 className="text-lg font-medium mb-4">
          Student Certificates ({certificate.studentsCount})
        </h4>
        
        {certificate.students.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Certificate ID</TableHead>
                <TableHead>Certificate Hash</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificate.students.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell className="font-medium">
                    {student.student_id}
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    {student.certificate_id ? (
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {student.certificate_id.substring(0, 20)}...
                      </code>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.certificate_hash ? (
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {student.certificate_hash.substring(0, 16)}...
                      </code>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {student.pdf_data_id && (
                        <Button 
                          size="sm"
                          onClick={() => downloadCertificate(
                            certificate.batchId, 
                            student.student_id, 
                            student.name
                          )}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download PDF
                        </Button>
                      )}
                      {student.transaction_hash && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => viewOnCardano(student.transaction_hash)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View on Cardano
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No student data available for this batch</p>
            <p className="text-sm">This might be an older batch format</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateDetailsView;
