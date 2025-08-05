import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2,
  Send,
  FileText,
  Bell,
  LogOut,
  Home,
  Eye,
  Edit,
  RefreshCw,
  Plus,
  Users,
  Trash2,
  Calendar,
  Award,
  Mail,
  MailOpen,
  AlertCircle,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// API Configuration
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

// Types
interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  course: string;
  graduation_date: string;
  gpa: number;
}

interface BatchMetadata {
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

interface BatchSubmission {
  metadata: BatchMetadata;
  students: Student[];
}

interface SubmittedBatch {
  batchId: string;
  batchName: string;
  studentsCount: number;
  academicYear: string;
  semester: string;
  sentTo: string;
  submittedAt: string;
}

interface Certificate {
  messageId: string;
  batchId: string;
  batchName: string;
  studentsCount: number;
  students: Array<{
    student_id: string;
    name: string;
    transaction_hash: string;
  }>;
  issuedAt: string;
  receivedAt: string;
}

const ICBTDashboard = () => {
  const { toast } = useToast();
  
  // State Management
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [submittedBatches, setSubmittedBatches] = useState<SubmittedBatch[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  
  // Form State
  const [batchMetadata, setBatchMetadata] = useState<BatchMetadata>({
    batch_name: '',
    batch_description: '',
    academic_year: new Date().getFullYear().toString(),
    semester: '',
    graduation_ceremony_date: '',
    faculty: '',
    program_type: 'undergraduate',
    submission_deadline: '',
    contact_person: '',
    contact_email: '',
    notes: ''
  });
  
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState<Student>({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    course: '',
    graduation_date: '',
    gpa: 0
  });

  const [stats, setStats] = useState({
    totalBatches: 0,
    totalStudents: 0,
    certificatesReceived: 0,
    pendingBatches: 0
  });

  // Add these state variables to your component
const [jsonInput, setJsonInput] = useState('');

// CSV Upload Handler
const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    parseCSV(text);
  };
  reader.readAsText(file);
};

// CSV Parser
const parseCSV = (csvText: string) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const expectedHeaders = ['student_id', 'first_name', 'last_name', 'email', 'course', 'graduation_date', 'gpa'];
  
  // Validate headers
  const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
  if (missingHeaders.length > 0) {
    toast({
      title: "CSV Format Error",
      description: `Missing required columns: ${missingHeaders.join(', ')}`,
      variant: "destructive"
    });
    return;
  }

  const parsedStudents: Student[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;
    
    const student: Student = {
      student_id: values[headers.indexOf('student_id')],
      first_name: values[headers.indexOf('first_name')],
      last_name: values[headers.indexOf('last_name')],
      email: values[headers.indexOf('email')],
      course: values[headers.indexOf('course')],
      graduation_date: values[headers.indexOf('graduation_date')],
      gpa: parseFloat(values[headers.indexOf('gpa')]) || 0
    };
    
    parsedStudents.push(student);
  }
  
  setStudents(parsedStudents);
  toast({
    title: "Success",
    description: `Imported ${parsedStudents.length} students from CSV`,
  });
};

// JSON Upload Handler
const handleJSONUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    parseJSONData(text);
  };
  reader.readAsText(file);
};

// JSON Parser
const parseJSONInput = () => {
  parseJSONData(jsonInput);
};

const parseJSONData = (jsonText: string) => {
  try {
    const data = JSON.parse(jsonText);
    
    // If it's a complete batch submission format
    if (data.metadata && data.students) {
      setBatchMetadata(data.metadata);
      setStudents(data.students);
      toast({
        title: "Success",
        description: `Imported batch metadata and ${data.students.length} students from JSON`,
      });
    } 
    // If it's just students array
    else if (Array.isArray(data)) {
      setStudents(data);
      toast({
        title: "Success",
        description: `Imported ${data.length} students from JSON`,
      });
    }
    else {
      throw new Error("Invalid JSON format");
    }
    
    setJsonInput('');
  } catch (error) {
    toast({
      title: "JSON Parse Error",
      description: "Invalid JSON format. Please check your data.",
      variant: "destructive"
    });
  }
};

// Download CSV Template
const downloadCSVTemplate = () => {
  const csvContent = `student_id,first_name,last_name,email,course,graduation_date,gpa
CS2025001,Alice,Johnson,alice.johnson@icbt.lk,Computer Science,2025-08-01,3.8
CS2025002,Bob,Smith,bob.smith@icbt.lk,Software Engineering,2025-08-01,3.9
EN2025001,Carol,Davis,carol.davis@icbt.lk,Electrical Engineering,2025-08-01,3.7`;

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'student_batch_template.csv';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

// Load JSON Example
const loadJSONExample = () => {
  const exampleJSON = {
    metadata: {
      batch_name: "Computer Science Batch 2025-A",
      batch_description: "Final year computer science students",
      academic_year: "2025",
      semester: "1st Semester",
      graduation_ceremony_date: "2025-08-20",
      faculty: "Computing",
      program_type: "undergraduate",
      submission_deadline: "2025-08-15",
      contact_person: "Prof. John Smith",
      contact_email: "john.smith@icbt.lk",
      notes: "All students have completed their final projects"
    },
    students: [
      {
        student_id: "CS2025001",
        first_name: "Alice",
        last_name: "Johnson",
        email: "alice.johnson@icbt.lk",
        course: "Computer Science",
        graduation_date: "2025-08-01",
        gpa: 3.8
      },
      {
        student_id: "CS2025002",
        first_name: "Bob",
        last_name: "Smith",
        email: "bob.smith@icbt.lk",
        course: "Software Engineering",
        graduation_date: "2025-08-01",
        gpa: 3.9
      },
      {
        student_id: "CS2025003",
        first_name: "Carol",
        last_name: "Davis",
        email: "carol.davis@icbt.lk",
        course: "Computer Science",
        graduation_date: "2025-08-01",
        gpa: 3.7
      }
    ]
  };
  
  setJsonInput(JSON.stringify(exampleJSON, null, 2));
};


  // API Functions
  const fetchCertificates = async () => {
    try {
      const response = await fetch(`${VITE_BASE_URL}/api/icbt/batch-details`);
      const data = await response.json();
      
      if (data.success) {
        setCertificates(data.certificates);
        calculateStats(data.certificates);
      } else {
        setError('Failed to fetch certificates');
      }
    } catch (err) {
      setError('Network error while fetching certificates');
      console.error('Error fetching certificates:', err);
    }
  };

  const submitBatch = async () => {
    if (students.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one student to the batch.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const batchSubmission: BatchSubmission = {
        metadata: batchMetadata,
        students: students
      };

      const response = await fetch(`${VITE_BASE_URL}/api/icbt/submit-batch-with-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchSubmission),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Batch "${data.batchName}" submitted successfully to Cardiff Met!`,
        });
        
        // Reset form
        setShowBatchForm(false);
        setStudents([]);
        setBatchMetadata({
          batch_name: '',
          batch_description: '',
          academic_year: new Date().getFullYear().toString(),
          semester: '',
          graduation_ceremony_date: '',
          faculty: '',
          program_type: 'undergraduate',
          submission_deadline: '',
          contact_person: '',
          contact_email: '',
          notes: ''
        });
        
        // Refresh data
        await fetchCertificates();
      } else {
        setError('Failed to submit batch');
      }
    } catch (err) {
      setError('Error submitting batch');
      console.error('Error submitting batch:', err);
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

  // Utility Functions
  const calculateStats = (certificates: Certificate[]) => {
    const totalCertificates = certificates.reduce((sum, cert) => sum + cert.studentsCount, 0);
    
    setStats({
      totalBatches: certificates.length,
      totalStudents: totalCertificates,
      certificatesReceived: totalCertificates,
      pendingBatches: 0 // This would come from submitted batches vs received certificates
    });
  };

  const addStudent = () => {
    if (!newStudent.student_id || !newStudent.first_name || !newStudent.last_name) {
      toast({
        title: "Error",
        description: "Please fill in all required student fields.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate student ID
    if (students.find(s => s.student_id === newStudent.student_id)) {
      toast({
        title: "Error",
        description: "Student ID already exists in this batch.",
        variant: "destructive"
      });
      return;
    }

    setStudents([...students, newStudent]);
    setNewStudent({
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      course: '',
      graduation_date: '',
      gpa: 0
    });

    toast({
      title: "Success",
      description: "Student added to batch successfully!",
    });
  };

  const removeStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Initial data load
  useEffect(() => {
    fetchCertificates();
  }, []);

  const dashboardStats = [
    { title: "Total Batches", value: stats.totalBatches.toString(), icon: FileText, change: "+5" },
    { title: "Total Students", value: stats.totalStudents.toString(), icon: Users, change: "+12" },
    { title: "Certificates Received", value: stats.certificatesReceived.toString(), icon: Award, change: "+8" },
    { title: "Success Rate", value: "95%", icon: CheckCircle2, change: "+2%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r shadow-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">ICBT Campus</h1>
              <p className="text-sm text-muted-foreground">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3 bg-primary/10 text-primary">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3"
              onClick={() => setShowBatchForm(true)}
            >
              <Send className="h-4 w-4" />
              Submit Batch
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Mail className="h-4 w-4" />
              Messages
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Award className="h-4 w-4" />
              Certificates
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Link to="/">
            <Button variant="outline" className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ICBT Campus Dashboard</h1>
            <p className="text-muted-foreground">Manage student batches and certificate submissions</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={fetchCertificates}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => setShowBatchForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4" />
              New Batch
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat) => (
            <Card key={stat.title} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="certificates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="certificates">Received Certificates</TabsTrigger>
            <TabsTrigger value="batches">Submitted Batches</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="certificates">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Received Certificates from Cardiff Met</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Name</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Issued Date</TableHead>
                      <TableHead>Received Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificates.map((certificate) => (
                      <TableRow key={certificate.messageId}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{certificate.batchName}</div>
                            <div className="text-sm text-muted-foreground">ID: {certificate.batchId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{certificate.studentsCount} students</Badge>
                        </TableCell>
                        <TableCell>{formatDate(certificate.issuedAt)}</TableCell>
                        <TableCell>{formatDate(certificate.receivedAt)}</TableCell>
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
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Certificate Details - {selectedCertificate?.batchName}</DialogTitle>
                              </DialogHeader>
                              {selectedCertificate && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                                    <div>
                                      <label className="text-sm font-medium">Batch ID</label>
                                      <p className="text-sm text-muted-foreground">{selectedCertificate.batchId}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Students Count</label>
                                      <p className="text-sm text-muted-foreground">{selectedCertificate.studentsCount}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Issued At</label>
                                      <p className="text-sm text-muted-foreground">{formatDate(selectedCertificate.issuedAt)}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Received At</label>
                                      <p className="text-sm text-muted-foreground">{formatDate(selectedCertificate.receivedAt)}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-lg font-medium mb-4">Student Certificates</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Student ID</TableHead>
                                          <TableHead>Name</TableHead>
                                          <TableHead>Transaction Hash</TableHead>
                                          <TableHead>Actions</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedCertificate.students.map((student) => (
                                          <TableRow key={student.student_id}>
                                            <TableCell className="font-medium">{student.student_id}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>
                                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                                {student.transaction_hash}
                                              </code>
                                            </TableCell>
                                            <TableCell>
                                              <Button 
                                                size="sm"
                                                onClick={() => downloadCertificate(
                                                  selectedCertificate.batchId, 
                                                  student.student_id, 
                                                  student.name
                                                )}
                                                className="bg-green-600 hover:bg-green-700"
                                              >
                                                <Download className="h-4 w-4 mr-1" />
                                                Download PDF
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              )}
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
          </TabsContent>

          <TabsContent value="batches">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Submitted Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Submitted batch history will be displayed here.
                  <br />
                  Integration with batch tracking API pending.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Messages & Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Messages from Cardiff Met will be displayed here.
                  <br />
                  Integration with messaging API pending.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Submission Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Batches Submitted</span>
                      <span className="font-bold">{stats.totalBatches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Students</span>
                      <span className="font-bold">{stats.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Certificates Received</span>
                      <span className="font-bold text-green-600">{stats.certificatesReceived}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-bold">
                        {stats.totalStudents > 0 
                          ? ((stats.certificatesReceived / stats.totalStudents) * 100).toFixed(1)
                          : 0
                        }%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {certificates.slice(0, 5).map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <div>
                            <p className="text-sm font-medium">{cert.batchName}</p>
                            <p className="text-xs text-muted-foreground">
                              {cert.studentsCount} certificates received
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(cert.receivedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Batch Submission Form Dialog */}
      {/* Batch Submission Form Dialog */}
<Dialog open={showBatchForm} onOpenChange={setShowBatchForm}>
  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Submit New Student Batch</DialogTitle>
    </DialogHeader>
    <div className="space-y-6">
      {/* Batch Metadata */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Batch Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="batch_name">Batch Name *</Label>
            <Input 
              id="batch_name"
              value={batchMetadata.batch_name}
              onChange={(e) => setBatchMetadata({...batchMetadata, batch_name: e.target.value})}
              placeholder="e.g., Computer Science Batch 2025-A"
            />
          </div>
          <div>
            <Label htmlFor="academic_year">Academic Year *</Label>
            <Input 
              id="academic_year"
              value={batchMetadata.academic_year}
              onChange={(e) => setBatchMetadata({...batchMetadata, academic_year: e.target.value})}
              placeholder="2025"
            />
          </div>
          <div>
            <Label htmlFor="semester">Semester *</Label>
            <Select 
              value={batchMetadata.semester}
              onValueChange={(value) => setBatchMetadata({...batchMetadata, semester: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st Semester">1st Semester</SelectItem>
                <SelectItem value="2nd Semester">2nd Semester</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="faculty">Faculty *</Label>
            <Select 
              value={batchMetadata.faculty}
              onValueChange={(value) => setBatchMetadata({...batchMetadata, faculty: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computing">Computing</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Medicine">Medicine</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="graduation_ceremony_date">Graduation Ceremony Date</Label>
            <Input 
              id="graduation_ceremony_date"
              type="date"
              value={batchMetadata.graduation_ceremony_date}
              onChange={(e) => setBatchMetadata({...batchMetadata, graduation_ceremony_date: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="submission_deadline">Submission Deadline</Label>
            <Input 
              id="submission_deadline"
              type="date"
              value={batchMetadata.submission_deadline}
              onChange={(e) => setBatchMetadata({...batchMetadata, submission_deadline: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="contact_person">Contact Person *</Label>
            <Input 
              id="contact_person"
              value={batchMetadata.contact_person}
              onChange={(e) => setBatchMetadata({...batchMetadata, contact_person: e.target.value})}
              placeholder="Prof. John Smith"
            />
          </div>
          <div>
            <Label htmlFor="contact_email">Contact Email *</Label>
            <Input 
              id="contact_email"
              type="email"
              value={batchMetadata.contact_email}
              onChange={(e) => setBatchMetadata({...batchMetadata, contact_email: e.target.value})}
              placeholder="john.smith@icbt.lk"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="batch_description">Batch Description</Label>
          <Textarea 
            id="batch_description"
            value={batchMetadata.batch_description}
            onChange={(e) => setBatchMetadata({...batchMetadata, batch_description: e.target.value})}
            placeholder="Describe the batch..."
          />
        </div>
        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea 
            id="notes"
            value={batchMetadata.notes}
            onChange={(e) => setBatchMetadata({...batchMetadata, notes: e.target.value})}
            placeholder="Any additional information..."
          />
        </div>
      </div>

      {/* Student Input Options */}
      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold">Add Students</h3>
        
        {/* Input Method Tabs */}
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="csv">CSV Upload</TabsTrigger>
            <TabsTrigger value="json">JSON Upload</TabsTrigger>
          </TabsList>

          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="student_id">Student ID *</Label>
                <Input 
                  id="student_id"
                  value={newStudent.student_id}
                  onChange={(e) => setNewStudent({...newStudent, student_id: e.target.value})}
                  placeholder="STU-2025-001"
                />
              </div>
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input 
                  id="first_name"
                  value={newStudent.first_name}
                  onChange={(e) => setNewStudent({...newStudent, first_name: e.target.value})}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input 
                  id="last_name"
                  value={newStudent.last_name}
                  onChange={(e) => setNewStudent({...newStudent, last_name: e.target.value})}
                  placeholder="Smith"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="john.smith@icbt.lk"
                />
              </div>
              <div>
                <Label htmlFor="course">Course</Label>
                <Input 
                  id="course"
                  value={newStudent.course}
                  onChange={(e) => setNewStudent({...newStudent, course: e.target.value})}
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <Label htmlFor="graduation_date">Graduation Date</Label>
                <Input 
                  id="graduation_date"
                  type="date"
                  value={newStudent.graduation_date}
                  onChange={(e) => setNewStudent({...newStudent, graduation_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="gpa">GPA</Label>
                <Input 
                  id="gpa"
                  type="number"
                  step="0.1"
                  min="0"
                  max="4.0"
                  value={newStudent.gpa}
                  onChange={(e) => setNewStudent({...newStudent, gpa: parseFloat(e.target.value) || 0})}
                  placeholder="3.8"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addStudent} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* CSV Upload Tab */}
          <TabsContent value="csv" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Upload CSV File</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a CSV file with student data
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => document.getElementById('csv-upload')?.click()}
                  >
                    Choose CSV File
                  </Button>
                </div>
              </div>
              
              {/* CSV Format Guide */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Your CSV file should have the following columns (header row required):
                </p>
                <code className="text-xs bg-background p-2 rounded block">
                  student_id,first_name,last_name,email,course,graduation_date,gpa
                </code>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto mt-2"
                  onClick={downloadCSVTemplate}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download CSV Template
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* JSON Upload Tab */}
          <TabsContent value="json" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Upload JSON File or Paste JSON Data</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a JSON file with complete batch data
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleJSONUpload}
                    className="hidden"
                    id="json-upload"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => document.getElementById('json-upload')?.click()}
                  >
                    Choose JSON File
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="json-paste">Or Paste JSON Data</Label>
                <Textarea 
                  id="json-paste"
                  placeholder="Paste your JSON data here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="h-32 font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={parseJSONInput}
                >
                  Parse JSON Data
                </Button>
              </div>

              {/* JSON Format Guide */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">JSON Format Example:</h4>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto mb-2"
                  onClick={loadJSONExample}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Load Example JSON
                </Button>
                <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`{
  "metadata": {
    "batch_name": "Computer Science Batch 2025-A",
    "academic_year": "2025",
    "semester": "1st Semester",
    "faculty": "Computing",
    ...
  },
  "students": [
    {
      "student_id": "CS2025001",
      "first_name": "Alice",
      "last_name": "Johnson",
      "email": "alice.johnson@icbt.lk",
      "course": "Computer Science",
      "graduation_date": "2025-08-01",
      "gpa": 3.8
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Students List */}
      {students.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Students in Batch ({students.length})</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setStudents([])}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student.student_id}>
                  <TableCell className="font-medium">{student.student_id}</TableCell>
                  <TableCell>{student.first_name} {student.last_name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.gpa}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeStudent(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="outline" onClick={() => setShowBatchForm(false)}>
          Cancel
        </Button>
        <Button 
          onClick={submitBatch}
          disabled={loading || students.length === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Batch to Cardiff Met
            </>
          )}
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default ICBTDashboard;
