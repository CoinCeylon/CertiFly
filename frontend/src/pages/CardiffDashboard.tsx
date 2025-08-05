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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2,
  Users,
  FileText,
  BarChart3,
  Bell,
  LogOut,
  Home,
  Settings,
  RefreshCw,
  Download,
  Mail,
  MailOpen,
  AlertCircle,
  Award,
  Menu,
  X,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  Calendar,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
  university: string;
}

interface BatchDetails {
  batchId: string;
  batchName: string;
  academicYear: string;
  semester: string;
  faculty: string;
  contactPerson: string;
  contactEmail: string;
  notes: string;
}

interface Message {
  messageId: string;
  heading: string;
  sender: string;
  receivedAt: string;
  viewed: boolean;
  processed: boolean;
  batchDetails: BatchDetails;
  students: Student[];
  studentsCount: number;
}

interface ApiResponse {
  success: boolean;
  messages: Message[];
  count: number;
  filter: {
    viewed: boolean | null;
    appliedFilter: string;
  };
}

const CardiffDashboard = () => {
  // State Management
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalMessages: 0,
    unviewedMessages: 0,
    processedToday: 0,
    totalStudents: 0
  });

  // API Functions
  const fetchMessages = async (viewedFilter?: boolean) => {
    try {
      setLoading(true);
      const url = viewedFilter !== undefined 
        ? `${VITE_BASE_URL}/api/cardiff/inbox?viewed=${viewedFilter}`
        : `${VITE_BASE_URL}/api/cardiff/inbox`;
      
      const response = await fetch(url);
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
        setFilteredMessages(data.messages);
        calculateStats(data.messages);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (err) {
      setError('Network error while fetching messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const processMessage = async (messageId: string) => {
    try {
      setProcessing(messageId);
      const response = await fetch(`${VITE_BASE_URL}/api/cardiff/process-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the processed status locally
        setMessages(prev => prev.map(msg => 
          msg.messageId === messageId ? { ...msg, processed: true } : msg
        ));
        setFilteredMessages(prev => prev.map(msg => 
          msg.messageId === messageId ? { ...msg, processed: true } : msg
        ));
        
        // Enhanced toast notification
        toast({
          title: "🎉 Certificates Issued Successfully!",
          description: (
            <div className="space-y-2">
              <p>All certificates have been generated and recorded on the blockchain.</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Transaction ID:</span>
                <code className="text-xs bg-[#0a334a]/10 px-2 py-1 rounded border border-[#0a334a]/20">{data.cardanoTxId}</code>
                <button
                  onClick={() => window.open(`https://preprod.cardanoscan.io/transaction/${data.cardanoTxId}`, '_blank')}
                  className="text-[#f68022] hover:text-[#f68022]/80 text-xs font-medium"
                >
                  View on Explorer →
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {data.studentsProcessed} students processed successfully
              </p>
            </div>
          ),
          duration: 8000,
        });
        
        await fetchMessages();
      } else {
        toast({
          title: "Processing Failed",
          description: data.message || "Failed to process message",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error while processing message",
        variant: "destructive"
      });
      console.error('Error processing message:', err);
    } finally {
      setProcessing(null);
    }
  };

  // Utility Functions
  const calculateStats = (messages: Message[]) => {
    const today = new Date().toISOString().split('T')[0];
    
    setStats({
      totalMessages: messages.length,
      unviewedMessages: messages.filter(m => !m.viewed).length,
      processedToday: messages.filter(m => 
        m.processed && m.receivedAt.startsWith(today)
      ).length,
      totalStudents: messages.reduce((sum, m) => sum + m.studentsCount, 0)
    });
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

  const getStatusBadge = (message: Message) => {
    if (message.processed) {
      return <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Processed
      </Badge>;
    }
    if (message.viewed) {
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
        <Eye className="h-3 w-3 mr-1" />
        Viewed
      </Badge>;
    }
    return <Badge className="bg-[#f68022]/10 text-[#f68022] border-[#f68022]/20 hover:bg-[#f68022]/20">
      <Clock className="h-3 w-3 mr-1" />
      New
    </Badge>;
  };

  // Filter Functions
  useEffect(() => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(msg =>
        msg.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.batchDetails.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.students.some(student => 
          `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(msg => {
        switch (statusFilter) {
          case "new":
            return !msg.viewed && !msg.processed;
          case "viewed":
            return msg.viewed && !msg.processed;
          case "processed":
            return msg.processed;
          default:
            return true;
        }
      });
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, statusFilter]);

  // Initial data load and responsive handling
  useEffect(() => {
    fetchMessages();
    
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dashboardStats = [
    { 
      title: "Total Messages", 
      value: stats.totalMessages.toString(), 
      icon: Mail, 
      change: "+12%",
      color: "bg-gradient-to-br from-[#0a334a] to-[#0a334a]/80",
      textColor: "text-white"
    },
    { 
      title: "New Messages", 
      value: stats.unviewedMessages.toString(), 
      icon: MailOpen, 
      change: "+8%",
      color: "bg-gradient-to-br from-[#f68022] to-[#f68022]/80",
      textColor: "text-white"
    },
    { 
      title: "Processed Today", 
      value: stats.processedToday.toString(), 
      icon: CheckCircle2, 
      change: "+15%",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-white"
    },
    { 
      title: "Total Students", 
      value: stats.totalStudents.toString(), 
      icon: Users, 
      change: "+5%",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-white"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffefc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#0a334a] to-[#f68022] rounded-full flex items-center justify-center mb-4 mx-auto">
            <RefreshCw className="h-8 w-8 animate-spin text-white" />
          </div>
          <p className="text-[#0a334a] font-medium">Loading certificate requests...</p>
          <p className="text-gray-500 text-sm mt-2">Connecting to university consortium</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffefc]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6">
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden absolute right-4 top-4"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-[#0a334a] to-[#f68022] rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[#0a334a]">Cardiff Metropolitan</h1>
              <p className="text-sm text-gray-600">Certificate Authority</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 bg-[#0a334a]/10 text-[#0a334a] hover:bg-[#0a334a]/20 border border-[#0a334a]/20"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100">
              <Mail className="h-4 w-4" />
              Messages 
              {stats.unviewedMessages > 0 && (
                <Badge className="ml-auto bg-[#f68022] text-white hover:bg-[#f68022]/80">
                  {stats.unviewedMessages}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100">
              <Award className="h-4 w-4" />
              Certificates
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100">
              <Shield className="h-4 w-4" />
              Blockchain Verification
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Link to="/">
            <Button 
              variant="outline" 
              className="w-full gap-2 border-[#0a334a]/20 text-[#0a334a] hover:bg-[#0a334a]/5"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#0a334a] to-[#f68022] rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-[#0a334a]">Cardiff CA</span>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
            {stats.unviewedMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#f68022] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {stats.unviewedMessages}
              </span>
            )}
          </Button>
        </div>

        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#0a334a] mb-2">
                Cardiff Certificate Authority
              </h1>
              <p className="text-gray-600">Manage university consortium certificate requests</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchMessages()}
                className="border-[#0a334a]/20 text-[#0a334a] hover:bg-[#0a334a]/5"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Refresh</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-[#f68022]/20 text-[#f68022] hover:bg-[#f68022]/5 relative"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Notifications</span>
                {stats.unviewedMessages > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-[#f68022] text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {stats.unviewedMessages}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {dashboardStats.map((stat, index) => (
              <Card key={stat.title} className="shadow-lg border-0 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className={`${stat.color} p-6 ${stat.textColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium opacity-90 mb-1">{stat.title}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl lg:text-3xl font-bold">{stat.value}</p>
                          <div className="flex items-center">
                            <TrendingUp className="h-3 w-3 opacity-75" />
                            <span className="text-xs font-medium opacity-75 ml-1">
                              {stat.change}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="messages" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="messages"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0a334a] data-[state=active]:shadow-sm"
              >
                <Mail className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Certificate Messages</span>
                <span className="sm:hidden">Messages</span>
              </TabsTrigger>
              <TabsTrigger 
                value="processed"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0a334a] data-[state=active]:shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Processed</span>
                <span className="sm:hidden">Done</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0a334a] data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-[#0a334a]/5 to-[#f68022]/5 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <CardTitle className="text-xl text-[#0a334a] flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Certificate Batch Messages
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search messages, batches, or students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-64 border-gray-300 focus:border-[#0a334a] focus:ring-[#0a334a]"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-40 border-gray-300 focus:border-[#0a334a] focus:ring-[#0a334a]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Messages</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="viewed">Viewed</SelectItem>
                          <SelectItem value="processed">Processed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Mobile Card View */}
                  <div className="block lg:hidden">
                    {filteredMessages.map((message) => (
                      <div key={message.messageId} className="p-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-[#0a334a] mb-1">
                              {message.batchDetails.batchName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {message.batchDetails.academicYear} - {message.batchDetails.semester}
                            </p>
                          </div>
                          {getStatusBadge(message)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">Sender:</span>
                            <p className="font-medium text-[#0a334a] flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {message.sender}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Students:</span>
                            <p className="font-medium">{message.studentsCount}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Faculty:</span>
                            <p className="font-medium">{message.batchDetails.faculty}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Received:</span>
                            <p className="font-medium">{formatDate(message.receivedAt)}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedMessage(message)}
                                className="flex-1 border-[#0a334a]/20 text-[#0a334a] hover:bg-[#0a334a]/5"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mx-4">
                              <DialogHeader>
                                <DialogTitle className="text-[#0a334a]">
                                  Batch Details - {selectedMessage?.batchDetails.batchName}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedMessage && (
                                <div className="space-y-6">
                                  {/* Batch Information */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-[#0a334a]/5 to-[#f68022]/5 rounded-lg border border-gray-200">
                                    <div>
                                      <label className="text-sm font-medium text-[#0a334a]">Batch ID</label>
                                      <p className="text-sm text-gray-600 font-mono bg-white px-2 py-1 rounded mt-1">
                                        {selectedMessage.batchDetails.batchId}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-[#0a334a]">Academic Year</label>
                                      <p className="text-sm text-gray-600 mt-1">{selectedMessage.batchDetails.academicYear}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-[#0a334a]">Contact Person</label>
                                      <p className="text-sm text-gray-600 mt-1">{selectedMessage.batchDetails.contactPerson}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-[#0a334a]">Contact Email</label>
                                      <p className="text-sm text-gray-600 mt-1">{selectedMessage.batchDetails.contactEmail}</p>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                      <label className="text-sm font-medium text-[#0a334a]">Notes</label>
                                      <p className="text-sm text-gray-600 mt-1 bg-white p-2 rounded">
                                        {selectedMessage.batchDetails.notes}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Students List */}
                                  <div>
                                    <h4 className="text-lg font-semibold text-[#0a334a] mb-4 flex items-center gap-2">
                                      <Users className="h-5 w-5" />
                                      Students ({selectedMessage.studentsCount})
                                    </h4>
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                      <div className="overflow-x-auto">
                                        <Table>
                                          <TableHeader>
                                            <TableRow className="bg-gray-50">
                                              <TableHead className="font-semibold text-[#0a334a]">Student ID</TableHead>
                                              <TableHead className="font-semibold text-[#0a334a]">Name</TableHead>
                                              <TableHead className="font-semibold text-[#0a334a]">Course</TableHead>
                                              <TableHead className="font-semibold text-[#0a334a]">GPA</TableHead>
                                              <TableHead className="font-semibold text-[#0a334a]">Graduation Date</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {selectedMessage.students.map((student) => (
                                              <TableRow key={student.student_id} className="hover:bg-gray-50">
                                                <TableCell className="font-mono text-sm">{student.student_id}</TableCell>
                                                <TableCell className="font-medium">{student.first_name} {student.last_name}</TableCell>
                                                <TableCell>{student.course}</TableCell>
                                                <TableCell>
                                                  <Badge variant="outline" className="font-mono">
                                                    {student.gpa}
                                                  </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(student.graduation_date).toLocaleDateString()}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                                    {!selectedMessage.processed ? (
                                      <Button 
                                        onClick={() => processMessage(selectedMessage.messageId)}
                                        disabled={processing === selectedMessage.messageId}
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                                      >
                                        {processing === selectedMessage.messageId ? (
                                          <>
                                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                            Processing...
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Process & Issue Certificates
                                          </>
                                        )}
                                      </Button>
                                    ) : (
                                      <div className="flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-lg border border-green-200">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span className="font-medium">Certificates Issued</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          {!message.processed && (
                            <Button 
                              size="sm"
                              onClick={() => processMessage(message.messageId)}
                              disabled={processing === message.messageId}
                              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                            >
                              {processing === message.messageId ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

        {/* Desktop Table View */}
<div className="hidden lg:block overflow-x-auto">
  <Table>
    <TableHeader>
      <TableRow className="bg-gray-50 hover:bg-gray-50">
        <TableHead className="font-semibold text-[#0a334a]">Batch Details</TableHead>
        <TableHead className="font-semibold text-[#0a334a]">Sender</TableHead>
        <TableHead className="font-semibold text-[#0a334a]">Students</TableHead>
        <TableHead className="font-semibold text-[#0a334a]">Faculty</TableHead>
        <TableHead className="font-semibold text-[#0a334a]">Received</TableHead>
        <TableHead className="font-semibold text-[#0a334a]">Status</TableHead>
        <TableHead className="font-semibold text-[#0a334a]">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {filteredMessages.map((message) => (
        <TableRow key={message.messageId} className="hover:bg-gray-50">
          <TableCell>
            <div>
              <div className="font-medium text-[#0a334a]">{message.batchDetails.batchName}</div>
              <div className="text-sm text-gray-500">
                {message.batchDetails.academicYear} - {message.batchDetails.semester}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#f68022]" />
              <span className="capitalize">{message.sender.replace('-', ' ')}</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="outline" className="border-[#0a334a]/20 text-[#0a334a]">
              {message.studentsCount} students
            </Badge>
          </TableCell>
          <TableCell className="font-medium">{message.batchDetails.faculty}</TableCell>
          <TableCell className="text-sm">{formatDate(message.receivedAt)}</TableCell>
          <TableCell>{getStatusBadge(message)}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedMessage(message)}
                    className="border-[#0a334a]/20 text-[#0a334a] hover:bg-[#0a334a]/5"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-[#0a334a]">
                      Batch Details - {selectedMessage?.batchDetails.batchName}
                    </DialogTitle>
                  </DialogHeader>
                  {selectedMessage && (
                    <div className="space-y-6">
                      {/* Batch Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-[#0a334a]/5 to-[#f68022]/5 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-[#0a334a]">Batch ID</label>
                          <p className="text-sm text-gray-600 font-mono bg-white px-2 py-1 rounded mt-1">
                            {selectedMessage.batchDetails.batchId}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#0a334a]">Academic Year</label>
                          <p className="text-sm text-gray-600 mt-1">{selectedMessage.batchDetails.academicYear}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#0a334a]">Contact Person</label>
                          <p className="text-sm text-gray-600 mt-1">{selectedMessage.batchDetails.contactPerson}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#0a334a]">Contact Email</label>
                          <p className="text-sm text-gray-600 mt-1">{selectedMessage.batchDetails.contactEmail}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="text-sm font-medium text-[#0a334a]">Notes</label>
                          <p className="text-sm text-gray-600 mt-1 bg-white p-2 rounded">
                            {selectedMessage.batchDetails.notes}
                          </p>
                        </div>
                      </div>

                      {/* Students List */}
                      <div>
                        <h4 className="text-lg font-semibold text-[#0a334a] mb-4 flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Students ({selectedMessage.studentsCount})
                        </h4>
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50">
                                  <TableHead className="font-semibold text-[#0a334a]">Student ID</TableHead>
                                  <TableHead className="font-semibold text-[#0a334a]">Name</TableHead>
                                  <TableHead className="font-semibold text-[#0a334a]">Course</TableHead>
                                  <TableHead className="font-semibold text-[#0a334a]">GPA</TableHead>
                                  <TableHead className="font-semibold text-[#0a334a]">Graduation Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedMessage.students.map((student) => (
                                  <TableRow key={student.student_id} className="hover:bg-gray-50">
                                    <TableCell className="font-mono text-sm">{student.student_id}</TableCell>
                                    <TableCell className="font-medium">{student.first_name} {student.last_name}</TableCell>
                                    <TableCell>{student.course}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="font-mono">
                                        {student.gpa}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(student.graduation_date).toLocaleDateString()}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                        {!selectedMessage.processed ? (
                          <Button 
                            onClick={() => processMessage(selectedMessage.messageId)}
                            disabled={processing === selectedMessage.messageId}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                          >
                            {processing === selectedMessage.messageId ? (
                              <>
                                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Process & Issue Certificates
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-lg border border-green-200">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="font-medium">Certificates Issued</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              {!message.processed && (
                <Button 
                  size="sm"
                  onClick={() => processMessage(message.messageId)}
                  disabled={processing === message.messageId}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                >
                  {processing === message.messageId ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Process
                    </>
                  )}
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>

{filteredMessages.length === 0 && (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
    <p className="text-gray-500 mb-2">No messages found matching your criteria.</p>
    <p className="text-sm text-gray-400">Try adjusting your search terms or filters.</p>
  </div>
)}

                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processed">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
                  <CardTitle className="text-xl text-[#0a334a] flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Processed Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#0a334a] to-[#f68022] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#0a334a] mb-2">Certificate Archive</h3>
                    <p className="text-gray-600 mb-4">
                      Processed certificates will be displayed here.
                    </p>
                    <p className="text-sm text-gray-500">
                      Integration with certificate storage API and blockchain verification pending.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-[#0a334a]/5 to-[#f68022]/5 border-b border-gray-200">
                    <CardTitle className="text-lg text-[#0a334a] flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Processing Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-[#0a334a]">Total Messages</span>
                        <span className="font-bold text-xl text-[#0a334a]">{stats.totalMessages}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-green-700">Processed</span>
                        <span className="font-bold text-xl text-green-700">
                          {messages.filter(m => m.processed).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#f68022]/10 rounded-lg">
                        <span className="font-medium text-[#f68022]">Pending</span>
                        <span className="font-bold text-xl text-[#f68022]">
                          {messages.filter(m => !m.processed).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium text-blue-700">Processing Rate</span>
                        <span className="font-bold text-xl text-blue-700">
                          {messages.length > 0 
                            ? ((messages.filter(m => m.processed).length / messages.length) * 100).toFixed(1)
                            : 0
                          }%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-[#0a334a]/5 to-[#f68022]/5 border-b border-gray-200">
                    <CardTitle className="text-lg text-[#0a334a] flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      University Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {Array.from(new Set(messages.map(m => m.sender))).map((sender) => {
                        const senderMessages = messages.filter(m => m.sender === sender);
                        const totalStudents = senderMessages.reduce((sum, m) => sum + m.studentsCount, 0);
                        return (
                          <div key={sender} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-[#0a334a] to-[#f68022] rounded-lg flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-medium text-[#0a334a] capitalize">
                                {sender.replace('-', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="border-[#0a334a]/20 text-[#0a334a]">
                                {senderMessages.length} batches
                              </Badge>
                              <span className="text-sm font-medium text-gray-600">
                                {totalStudents} students
                              </span>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CardiffDashboard;
