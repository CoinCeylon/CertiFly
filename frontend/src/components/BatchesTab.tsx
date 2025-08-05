// components/BatchesTab.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Award,
  Eye,
  ExternalLink,
  RefreshCw,
  Calendar,
  Users,
  FileText,
  X,
  User,
  Mail,
  GraduationCap,
  Hash,
  Download
} from "lucide-react";

// Keep your existing interfaces...
interface BatchStudent {
  student_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  course: string;
  graduation_date: string;
  gpa: number;
  status: string;
  certificate_issued: boolean;
  certificate_id?: string;
  certificate_hash?: string;
  pdf_data_id?: string;
  certificate_received_at?: string;
}

interface BatchDetails {
  batchId: string;
  batchName: string;
  submittedAt?: string;
  submittedBy: string;
  submissionType: string;
  metadata: {
    batch_name: string;
    academic_year: string;
    semester: string;
    faculty: string;
    contact_person: string;
    contact_email: string;
    graduation_ceremony_date?: string;
    notes?: string;
  };
  students: BatchStudent[];
  status: string;
  totalStudents: number;
  certificatesIssued: number;
  certificatesPending: number;
  progressPercentage: number;
  certificatesIssuedAt?: string;
  certificatesReceivedAt?: string;
  cardanoTxId?: string;
  processingTime?: string;
  timeline: Array<{
    event: string;
    timestamp: string;
    description: string;
    status: string;
  }>;
}

interface BatchDetailsResponse {
  success: boolean;
  batchDetails: BatchDetails[];
  overallStats: {
    totalBatches: number;
    totalStudents: number;
    totalCertificatesIssued: number;
    totalCertificatesPending: number;
    statusBreakdown: {
      submitted: number;
      processing: number;
      partially_completed: number;
      completed: number;
      certificates_issued: number;
    };
    successRate: number;
    averageProcessingTime: string;
    facultyBreakdown: { [key: string]: number };
    academicYearBreakdown: { [key: string]: number };
  };
  count: number;
}
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const BatchesTab: React.FC = () => {
  const { toast } = useToast();
  const [batchDetails, setBatchDetails] = useState<BatchDetails[]>([]);
  const [overallStats, setOverallStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<BatchDetails | null>(null);

  // Keep all your existing helper functions...
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'submitted':
        return <Upload className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'certificates_issued':
        return <Award className="h-4 w-4 text-purple-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'partially_completed':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      'submitted': { className: 'bg-blue-100 text-blue-800', label: 'Submitted' },
      'processing': { className: 'bg-yellow-100 text-yellow-800', label: 'Processing' },
      'certificates_issued': { className: 'bg-purple-100 text-purple-800', label: 'Certificates Issued' },
      'completed': { className: 'bg-green-100 text-green-800', label: 'Completed' },
      'partially_completed': { className: 'bg-orange-100 text-orange-800', label: 'Partially Completed' },
      'unknown': { className: 'bg-gray-100 text-gray-800', label: 'Unknown' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['unknown'];
    
    return (
      <Badge className={config.className}>
        {getStatusIcon(status)}
        <span className="ml-1">{config.label}</span>
      </Badge>
    );
  };

  const viewOnCardano = (txId: string) => {
    const cardanoExplorerUrl = `https://preprod.cardanoscan.io/transaction/${txId}`;
    window.open(cardanoExplorerUrl, '_blank');
  };

  // Function to download student certificate
  const downloadStudentCertificate = async (batchId: string, studentId: string, studentName: string) => {
    try {
      const response = await fetch(`${VITE_BASE_URL}/api/icbt/download/student/${batchId}/${studentId}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${studentName.replace(/\s+/g, '_')}_Certificate.pdf`;
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

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${VITE_BASE_URL}/api/icbt/batch-details`);
      const data: BatchDetailsResponse = await response.json();
      
      if (data.success) {
        setBatchDetails(data.batchDetails);
        setOverallStats(data.overallStats);
        toast({
          title: "Success",
          description: `Loaded ${data.count} batch details successfully`,
        });
      } else {
        setError('Failed to fetch batch details');
        toast({
          title: "Error",
          description: "Failed to fetch batch details",
          variant: "destructive"
        });
      }
    } catch (err) {
      setError('Network error while fetching batch details');
      console.error('Error fetching batch details:', err);
      toast({
        title: "Error",
        description: "Network error while fetching batch details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchDetails();
  }, []);

  const stats = {
    total: batchDetails.length,
    completed: batchDetails.filter(b => b.status === 'completed').length,
    processing: batchDetails.filter(b => b.status === 'processing' || b.status === 'submitted').length,
    partiallyCompleted: batchDetails.filter(b => b.status === 'partially_completed').length,
    totalStudents: batchDetails.reduce((sum, b) => sum + b.totalStudents, 0),
    certificatesReceived: batchDetails.reduce((sum, b) => sum + b.certificatesIssued, 0)
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading batch details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Keep all your existing summary stats and table code... */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Submitted to Cardiff</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Across all batches</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Fully processed</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
                <p className="text-xs text-muted-foreground">Being processed</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {overallStats?.averageProcessingTime ? `Avg: ${overallStats.averageProcessingTime}` : 'Processing time'}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Batch Submission Timeline & Status</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchBatchDetails}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batches Status Table */}
      <Card className="shadow-card">
        <CardContent>
          {batchDetails.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Processing Time</TableHead>
                  <TableHead>Blockchain</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchDetails.map((batch) => (
                  <TableRow key={batch.batchId}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{batch.batchName}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {batch.batchId}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {batch.metadata.faculty}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {batch.metadata.academic_year} - {batch.metadata.semester}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(batch.status)}
                    </TableCell>

                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {batch.certificatesIssued}/{batch.totalStudents}
                          </span>
                          <span className="text-muted-foreground">
                            {batch.progressPercentage}%
                          </span>
                        </div>
                        <Progress 
                          value={batch.progressPercentage} 
                          className="h-2"
                        />
                        {batch.certificatesPending > 0 && (
                          <div className="text-xs text-orange-600">
                            {batch.certificatesPending} pending
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {batch.submittedAt && (
                          <div className="flex items-center gap-1">
                            <Upload className="h-3 w-3 text-blue-500" />
                            <span className="text-xs">
                              Submitted: {formatDate(batch.submittedAt)}
                            </span>
                          </div>
                        )}
                        {batch.certificatesIssuedAt && (
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3 text-purple-500" />
                            <span className="text-xs">
                              Issued: {formatDate(batch.certificatesIssuedAt)}
                            </span>
                          </div>
                        )}
                        {batch.certificatesReceivedAt && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span className="text-xs">
                              Received: {formatDate(batch.certificatesReceivedAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {batch.processingTime ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-orange-500" />
                          <span className="text-sm font-medium">
                            {batch.processingTime}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {batch.cardanoTxId ? (
                        <div className="space-y-1">
                          <code className="text-xs bg-muted px-2 py-1 rounded block">
                            {batch.cardanoTxId.substring(0, 12)}...
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => viewOnCardano(batch.cardanoTxId!)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Pending</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedBatch(batch)}
                        >
                          <Eye className="h-4 w-4" />
                          Details
                        </Button>
                        {batch.status === 'completed' && (
                          <Button variant="outline" size="sm" className="text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No Batch Details Found</h3>
              <p className="text-sm">
                {error 
                  ? "There was an error loading batch details. Please try refreshing."
                  : "Batch submissions will appear here once you start submitting student batches to Cardiff Met."
                }
              </p>
              {error && (
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={fetchBatchDetails}
                >
                  Try Again
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keep your existing status legend... */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Status Legend & Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Batch Status Types</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Submitted to Cardiff</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Certificates Issued</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Partially Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">View on Blockchain</span>
                </div>
              </div>
            </div>

            {overallStats?.facultyBreakdown && (
              <div>
                <h4 className="font-medium mb-3">Faculty Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(overallStats.facultyBreakdown).map(([faculty, count]) => (
                    <div key={faculty} className="flex justify-between items-center">
                      <span className="text-sm">{faculty}</span>
                      <Badge variant="outline">{String(count)} batches</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {overallStats && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-600">{overallStats.totalCertificatesIssued}</p>
                  <p className="text-xs text-muted-foreground">Certificates Issued</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-600">{overallStats.totalCertificatesPending}</p>
                  <p className="text-xs text-muted-foreground">Certificates Pending</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{overallStats.successRate}%</p>
                  <p className="text-xs text-muted-foreground">Overall Success Rate</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">{overallStats.averageProcessingTime}</p>
                  <p className="text-xs text-muted-foreground">Avg Processing Time</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* NEW: Batch Details Modal */}
      <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">
                Batch Details: {selectedBatch?.batchName}
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBatch(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedBatch && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="students">Students ({selectedBatch.totalStudents})</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Batch Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Batch Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Batch ID</p>
                          <p className="font-mono text-sm">{selectedBatch.batchId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Status</p>
                          {getStatusBadge(selectedBatch.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Faculty</p>
                          <p className="text-sm">{selectedBatch.metadata.faculty}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                          <p className="text-sm">{selectedBatch.metadata.academic_year} - {selectedBatch.metadata.semester}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Submitted At</p>
                          <p className="text-sm">{formatDate(selectedBatch.submittedAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Processing Time</p>
                          <p className="text-sm">{selectedBatch.processingTime || 'N/A'}</p>
                        </div>
                      </div>
                      
                      {selectedBatch.metadata.notes && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                          <p className="text-sm bg-muted p-3 rounded">{selectedBatch.metadata.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{selectedBatch.metadata.contact_person}</p>
                          <p className="text-sm text-muted-foreground">Contact Person</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{selectedBatch.metadata.contact_email}</p>
                          <p className="text-sm text-muted-foreground">Email Address</p>
                        </div>
                      </div>
                      {selectedBatch.metadata.graduation_ceremony_date && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {formatDate(selectedBatch.metadata.graduation_ceremony_date)}
                            </p>
                            <p className="text-sm text-muted-foreground">Graduation Ceremony</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Certificate Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedBatch.certificatesIssued}/{selectedBatch.totalStudents} ({selectedBatch.progressPercentage}%)
                        </span>
                      </div>
                      <Progress value={selectedBatch.progressPercentage} className="h-3" />
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{selectedBatch.totalStudents}</p>
                          <p className="text-sm text-muted-foreground">Total Students</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{selectedBatch.certificatesIssued}</p>
                          <p className="text-sm text-muted-foreground">Certificates Issued</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{selectedBatch.certificatesPending}</p>
                          <p className="text-sm text-muted-foreground">Pending</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Students in This Batch ({selectedBatch.totalStudents})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student Details</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>GPA</TableHead>
                            <TableHead>Certificate Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedBatch.students.map((student, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{student.full_name}</p>
                                  <p className="text-sm text-muted-foreground">{student.student_id}</p>
                                  <p className="text-xs text-muted-foreground">{student.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm">{student.course}</p>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{student.gpa.toFixed(2)}</Badge>
                              </TableCell>
                              <TableCell>
                                {student.certificate_issued ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Issued
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {student.certificate_issued && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadStudentCertificate(
                                      selectedBatch.batchId,
                                      student.student_id,
                                      student.full_name
                                    )}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Batch Processing Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedBatch.timeline.map((event, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            event.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{event.event}</h4>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(event.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="blockchain" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Blockchain Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedBatch.cardanoTxId ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Transaction ID</p>
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-3 py-2 rounded text-sm flex-1">
                              {selectedBatch.cardanoTxId}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewOnCardano(selectedBatch.cardanoTxId!)}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View on Explorer
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Certificates on Chain</p>
                            <p className="text-2xl font-bold text-green-600">{selectedBatch.certificatesIssued}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Issued At</p>
                            <p className="text-sm">{formatDate(selectedBatch.certificatesIssuedAt)}</p>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Blockchain Verified</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            All certificates in this batch have been successfully recorded on the Cardano blockchain 
                            and can be independently verified.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">Blockchain Processing Pending</h3>
                        <p className="text-sm text-muted-foreground">
                          Certificates are being processed and will be recorded on the blockchain soon.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BatchesTab;
