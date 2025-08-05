import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  CheckCircle2, 
  XCircle, 
  FileCheck, 
  Hash,
  Calendar,
  User,
  GraduationCap,
  Building2,
  Shield,
  AlertTriangle,
  Mail,
  Phone,
  ExternalLink,
  Network,
  Blocks,
  Zap,
  Database,
  Key,
  Layers,
  Globe,
  Cpu,
  Lock,
  Star,
  Sparkles,
  Activity,
  Award,
  Clock,
  Download,
  QrCode,
  Eye,
  Camera,
  Search,
  Info,
  HelpCircle,
  ChevronRight,
  MapPin,
  CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/verificationPage/Header";
import HeroSection from "@/components/verificationPage/HeroSection";
import SecuritySection from "@/components/verificationPage/Security";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const VerificationPage = () => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('upload');
  const [certificateId, setCertificateId] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file only.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const certificateHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const response = await fetch(`${VITE_BASE_URL}/api/verify/certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificateHash })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.isValid && data.certificate) {
        setVerificationResult({
          valid: true,
          ...data.certificate,
          verificationSteps: data.verificationSteps,
          blockchainDetails: data.blockchainDetails,
          message: data.message
        });
        
        toast({
          title: "Certificate Verified ✓",
          description: "This Cardiff Met certificate is authentic and verified on Cardano blockchain.",
        });
      } else {
        setVerificationResult({
          valid: false,
          reason: data.message || "Certificate verification failed",
          verificationSteps: data.verificationSteps
        });
        
        toast({
          title: "Verification Failed",
          description: data.message || "This certificate could not be verified.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      setVerificationResult({
        valid: false,
        reason: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContactSubmit = () => {
    toast({
      title: "Message Sent",
      description: "Your inquiry has been submitted to Cardiff Met. We'll respond within 24 hours.",
    });
  };

  const handleCertificateIdVerification = async () => {
    if (!certificateId.trim()) {
      toast({
        title: "Certificate ID Required",
        description: "Please enter a valid certificate ID.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const response = await fetch(`${VITE_BASE_URL}/api/verify/certificate-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificateId: certificateId.trim() })
      });

      const data = await response.json();

      if (data.isValid && data.certificate) {
        setVerificationResult({
          valid: true,
          ...data.certificate,
          verificationSteps: data.verificationSteps,
          blockchainDetails: data.blockchainDetails,
          message: data.message
        });
        
        toast({
          title: "Certificate Verified ✓",
          description: "This Cardiff Met certificate is authentic and verified.",
        });
      } else {
        setVerificationResult({
          valid: false,
          reason: data.message || "Certificate ID not found",
          verificationSteps: data.verificationSteps
        });
        
        toast({
          title: "Verification Failed",
          description: data.message || "Certificate ID could not be verified.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      setVerificationResult({
        valid: false,
        reason: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const viewOnBlockchain = (txId: string) => {
    if (txId) {
      window.open(`https://preprod.cardanoscan.io/transaction/${txId}`, '_blank');
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#fffefc' }}
    >
      <Header />
      
      {/* Official Status Banner */}
      <div 
        className="text-white shadow-lg"
        style={{ backgroundColor: '#0a334a' }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: '#f68022' }}
              ></div>
              <span className="font-semibold">🇬🇧 Cardiff Metropolitan University</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Blockchain Verification System: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm">Cardano Network: Connected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <HeroSection/>

          {/* University Credentials Section */}
          <div className="mb-8">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div 
                className="p-4 sm:p-6 text-white"
                style={{ backgroundColor: '#0a334a' }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Official Certificate Verification Portal</h2>
                    <p className="text-sm sm:text-base opacity-90 mb-3">
                      Authorized by Cardiff Metropolitan University Registry Office
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ backgroundColor: '#f68022', color: 'white' }}
                      >
                        QAA Approved
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        UK Government Recognized
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        ISO 27001 Compliant
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-xs sm:text-sm opacity-75">
                    <p>Registry Office</p>
                    <p>Cardiff, Wales, UK</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Verification Method Selection */}
          <Card className="shadow-lg mb-8 border-0 overflow-hidden">
            <CardHeader 
              className="text-white"
              style={{ backgroundColor: '#0a334a' }}
            >
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                Certificate Verification Methods
              </CardTitle>
              <p className="text-sm sm:text-base opacity-90">
                Choose your preferred verification method below
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setVerificationMethod('upload')}
                  className={`p-4 sm:p-6 rounded-xl border-2 transition-all text-left ${
                    verificationMethod === 'upload'
                      ? 'border-orange-400 text-white shadow-lg'
                      : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                  style={verificationMethod === 'upload' ? { backgroundColor: '#f68022' } : {}}
                >
                  <Upload className="h-6 w-6 sm:h-8 sm:w-8 mb-3" />
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Upload PDF Certificate</h3>
                  <p className="text-xs sm:text-sm opacity-80">
                    Upload your official Cardiff Met certificate PDF for instant verification
                  </p>
                </button>

                <button
                  onClick={() => setVerificationMethod('certificate-id')}
                  className={`p-4 sm:p-6 rounded-xl border-2 transition-all text-left ${
                    verificationMethod === 'certificate-id'
                      ? 'border-orange-400 text-white shadow-lg'
                      : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                  style={verificationMethod === 'certificate-id' ? { backgroundColor: '#f68022' } : {}}
                >
                  <Hash className="h-6 w-6 sm:h-8 sm:w-8 mb-3" />
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Certificate ID Lookup</h3>
                  <p className="text-xs sm:text-sm opacity-80">
                    Enter your unique certificate reference number
                  </p>
                </button>

                <button
                  onClick={() => setVerificationMethod('qr')}
                  className={`p-4 sm:p-6 rounded-xl border-2 transition-all text-left ${
                    verificationMethod === 'qr'
                      ? 'border-orange-400 text-white shadow-lg'
                      : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                  style={verificationMethod === 'qr' ? { backgroundColor: '#f68022' } : {}}
                >
                  <QrCode className="h-6 w-6 sm:h-8 sm:w-8 mb-3" />
                  <h3 className="font-semibold text-base sm:text-lg mb-2">QR Code Scanner</h3>
                  <p className="text-xs sm:text-sm opacity-80">
                    Scan the QR code on your certificate
                  </p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Upload Method */}
          {verificationMethod === 'upload' && (
            <Card className="shadow-lg mb-8 border-0 overflow-hidden">
              <CardHeader 
                className="text-white"
                style={{ backgroundColor: '#0a334a' }}
              >
                <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                  <Upload className="h-5 w-5 sm:h-6 sm:w-6" />
                  PDF Certificate Upload
                </CardTitle>
                <p className="text-sm sm:text-base opacity-90">
                  Secure verification using SHA-256 cryptographic hashing and blockchain validation
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                <div
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-12 text-center transition-all ${
                    dragActive 
                      ? 'border-orange-400 bg-orange-50' 
                      : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
                  } ${isVerifying ? 'pointer-events-none opacity-50' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="mb-6 sm:mb-8">
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6"
                      style={{ backgroundColor: isVerifying ? '#f68022' : '#0a334a' }}
                    >
                      {isVerifying ? (
                        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-white" />
                      ) : (
                        <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      )}
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                      {isVerifying ? 'Verifying Your Certificate...' : 'Upload Your Cardiff Met Certificate'}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                      {isVerifying 
                        ? 'Please wait while we verify your certificate against our blockchain records'
                        : 'Drag and drop your official PDF certificate here, or click to browse'
                      }
                    </p>
                    
                    {!isVerifying && (
                      <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>Bank-Grade Security</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span>Zero Data Retention</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Instant Results</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!isVerifying && (
                    <Button 
                      size="lg"
                      onClick={() => document.getElementById('fileInput')?.click()}
                      className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 text-white shadow-lg hover:shadow-xl transition-all"
                      style={{ backgroundColor: '#f68022' }}
                    >
                      <Upload className="h-5 w-5 mr-3" />
                      Select PDF Certificate
                    </Button>
                  )}
                  
                  <input
                    id="fileInput"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  />
                  
                  {!isVerifying && (
                    <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <FileCheck className="h-5 w-5 mx-auto mb-2" style={{ color: '#f68022' }} />
                        <p className="font-medium">PDF Files Only</p>
                        <p className="text-gray-600">Maximum 10MB</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <Lock className="h-5 w-5 text-green-600 mx-auto mb-2" />
                        <p className="font-medium">Secure Processing</p>
                        <p className="text-gray-600">Auto-deleted after verification</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <Zap className="h-5 w-5 mx-auto mb-2" style={{ color: '#f68022' }} />
                        <p className="font-medium">Instant Verification</p>
                        <p className="text-gray-600">Results in under 3 seconds</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certificate ID Method */}
          {verificationMethod === 'certificate-id' && (
            <Card className="shadow-lg mb-8 border-0 overflow-hidden">
              <CardHeader 
                className="text-white"
                style={{ backgroundColor: '#0a334a' }}
              >
                <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                  <Hash className="h-5 w-5 sm:h-6 sm:w-6" />
                  Certificate ID Verification
                </CardTitle>
                <p className="text-sm sm:text-base opacity-90">
                  Enter your unique Cardiff Met certificate identification number
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <Label htmlFor="certificateId" className="text-base sm:text-lg font-semibold text-gray-900 mb-3 block">
                      Certificate Reference Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="certificateId"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        placeholder="e.g., CMET-2024-BSC-001234"
                        className="text-center text-base sm:text-lg font-mono py-3 sm:py-4 pr-12 border-2 focus:border-orange-400"
                        disabled={isVerifying}
                      />
                      <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center">
                      This number is printed on your certificate document or graduation letter
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleCertificateIdVerification}
                    disabled={isVerifying || !certificateId.trim()}
                    className="w-full text-base sm:text-lg py-3 sm:py-4 text-white shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: '#f68022' }}
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        Verifying Certificate...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-3" />
                        Verify Certificate ID
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* QR Code Method */}
          {verificationMethod === 'qr' && (
            <Card className="shadow-lg mb-8 border-0 overflow-hidden">
              <CardHeader 
                className="text-white"
                style={{ backgroundColor: '#0a334a' }}
              >
                <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                  <QrCode className="h-5 w-5 sm:h-6 sm:w-6" />
                  QR Code Verification
                </CardTitle>
                <p className="text-sm sm:text-base opacity-90">
                  Scan the secure QR code printed on your Cardiff Met certificate
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-gray-300">
                    <Camera className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">QR Code Scanner</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Position your certificate's QR code within the camera frame for automatic verification
                  </p>
                  <Button 
                    className="text-white shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: '#f68022' }}
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Activate Camera Scanner
                  </Button>
                  <p className="text-xs sm:text-sm text-gray-500 mt-4">
                    Camera access required • Available on certificates issued after 2023
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Verification Result */}
          {verificationResult && (
            <Card className={`shadow-2xl mb-8 border-0 overflow-hidden ${
              verificationResult.valid 
                ? 'ring-2 ring-green-300' 
                : 'ring-2 ring-red-300'
            }`}>
              <CardHeader className={`py-6 sm:py-8 text-white ${
                verificationResult.valid
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                  : 'bg-gradient-to-r from-red-600 to-rose-600'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  {verificationResult.valid ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <XCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl sm:text-3xl font-bold mb-2">
                      {verificationResult.valid ? '✓ Certificate Authenticated' : '✗ Verification Failed'}
                    </CardTitle>
                    <p className="text-base sm:text-lg opacity-90 mb-3">
                      {verificationResult.valid 
                        ? 'This is an authentic Cardiff Metropolitan University certificate, verified on blockchain'
                        : verificationResult.reason || 'Certificate could not be authenticated in our records'
                      }
                    </p>
                    {verificationResult.valid && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          Official Cardiff Met Certificate
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          Blockchain Verified
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          Registry Authenticated
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {verificationResult.valid && (
                <CardContent className="p-4 sm:p-8">
                  {/* Certificate Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    <div className="space-y-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#0a334a' }}>
                        <User className="h-5 w-5" />
                        Graduate Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4" style={{ borderLeftColor: '#f68022' }}>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Full Name</p>
                          <p className="text-lg sm:text-xl font-bold text-gray-900">{verificationResult.studentName}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Student ID</p>
                          <p className="font-mono text-base sm:text-lg text-gray-900">{verificationResult.studentId}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Graduation Date</p>
                          <p className="text-base sm:text-lg text-gray-900">{verificationResult.graduationDate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#0a334a' }}>
                        <GraduationCap className="h-5 w-5" />
                        Academic Qualification
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="rounded-lg p-4 border-2" style={{ backgroundColor: '#fffefc', borderColor: '#f68022' }}>
                          <p className="text-sm font-semibold mb-1" style={{ color: '#f68022' }}>Degree Programme</p>
                          <p className="text-lg sm:text-xl font-bold" style={{ color: '#0a334a' }}>{verificationResult.course}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-semibold text-gray-600 mb-1">School/Faculty</p>
                          <p className="text-base sm:text-lg text-gray-900">{verificationResult.faculty}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Final Grade</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{verificationResult.gpa}</p>
                            <Star className="h-5 w-5 text-yellow-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cardiff Met Official Authentication */}
                  <div className="rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border-2" style={{ backgroundColor: '#fffefc', borderColor: '#0a334a' }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0a334a' }}>
                        <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg sm:text-xl font-bold mb-1" style={{ color: '#0a334a' }}>Cardiff Metropolitan University</h4>
                        <p className="text-base sm:text-lg font-semibold mb-2" style={{ color: '#f68022' }}>Prifysgol Fetropolitan Caerdydd</p>
                        <p className="text-sm sm:text-base text-gray-700 mb-3">
                          This certificate is officially issued under the authority of Cardiff Metropolitan University Registry Office, Wales, United Kingdom
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge style={{ backgroundColor: '#f68022', color: 'white' }}>QAA Assured</Badge>
                          <Badge style={{ backgroundColor: '#0a334a', color: 'white' }}>UKVI Approved</Badge>
                          <Badge variant="outline" style={{ borderColor: '#0a334a', color: '#0a334a' }}>Royal Charter</Badge>
                        </div>
                      </div>
                      <div className="text-right text-xs sm:text-sm text-gray-600">
                        <p className="font-semibold">Verified:</p>
                        <p>{new Date().toLocaleDateString()}</p>
                        <p className="mt-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Cardiff, Wales
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Blockchain Details */}
                  {verificationResult.cardanoTxId && (
                    <div className="rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border" style={{ backgroundColor: '#fffefc', borderColor: '#0a334a' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0a334a' }}>
                          <span className="text-white font-bold text-lg sm:text-2xl">₳</span>
                        </div>
                        <div>
                          <h4 className="text-lg sm:text-xl font-bold" style={{ color: '#0a334a' }}>Cardano Blockchain Verification</h4>
                          <p className="text-sm sm:text-base" style={{ color: '#f68022' }}>Immutable cryptographic proof of authenticity</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4 border">
                          <p className="text-sm font-semibold text-gray-600 mb-2">Transaction Hash</p>
                          <p className="text-xs sm:text-sm font-mono text-gray-500 break-all">{verificationResult.cardanoTxId}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                          <p className="text-sm font-semibold text-gray-600 mb-2">Blockchain Status</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <p className="text-sm font-semibold text-green-600">Confirmed on Mainnet</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewOnBlockchain(verificationResult.cardanoTxId)}
                          className="border text-white hover:bg-opacity-90"
                          style={{ backgroundColor: '#f68022', borderColor: '#f68022' }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Cardano Explorer
                        </Button>
                        <div className="flex items-center gap-2 text-sm" style={{ color: '#0a334a' }}>
                          <Shield className="h-4 w-4" />
                          <span className="font-semibold">Ouroboros Protocol Secured</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Verification Steps */}
                  {verificationResult.verificationSteps && (
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        Verification Process Completed Successfully
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {Object.entries(verificationResult.verificationSteps).map(([step, passed]) => (
                          <div key={step} className="flex items-center gap-2 text-sm bg-white rounded-lg p-3 border">
                            {passed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            )}
                            <span className="capitalize text-gray-700 font-medium">
                              {step.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )}

          {/* Cardiff Met Support Section */}
          <Card className="shadow-lg mb-8 border-0 overflow-hidden">
            <CardHeader 
              className="text-white"
              style={{ backgroundColor: '#0a334a' }}
            >
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Cardiff Metropolitan University Registry Support
              </CardTitle>
              <p className="text-sm sm:text-base opacity-90">
                Need assistance with certificate verification? Our dedicated registry team is here to help.
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contactName" className="text-sm font-semibold text-gray-700">Full Name</Label>
                    <Input id="contactName" placeholder="Enter your full name" className="mt-1 border-2 focus:border-orange-400" />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail" className="text-sm font-semibold text-gray-700">Email Address</Label>
                    <Input id="contactEmail" type="email" placeholder="your.email@example.com" className="mt-1 border-2 focus:border-orange-400" />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone" className="text-sm font-semibold text-gray-700">Phone Number (Optional)</Label>
                    <Input id="contactPhone" type="tel" placeholder="+44 29 2041 6070" className="mt-1 border-2 focus:border-orange-400" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="issueType" className="text-sm font-semibold text-gray-700">Inquiry Type</Label>
                    <select 
                      id="issueType" 
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-orange-400"
                    >
                      <option>Certificate Verification Issue</option>
                      <option>Duplicate Certificate Request</option>
                      <option>Academic Transcript Request</option>
                      <option>Technical Support</option>
                      <option>Registry Office Inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="issueDescription" className="text-sm font-semibold text-gray-700">Message</Label>
                    <Textarea
                      id="issueDescription" 
                      placeholder="Please provide details about your inquiry..."
                      className="mt-1 h-24 border-2 focus:border-orange-400"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">Response time: Within 24 hours (working days)</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Registry Office: +44 29 2041 6070</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>registry@cardiffmet.ac.uk</span>
                  </p>
                </div>
                <Button 
                  className="text-white shadow-lg hover:shadow-xl transition-all px-6 py-3"
                  style={{ backgroundColor: '#f68022' }}
                  onClick={handleContactSubmit}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send to Registry Office
                </Button>
              </div>
            </CardContent>
          </Card>

          <SecuritySection/>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
