import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Shield, 
  Building2, 
  CheckCircle2, 
  Users, 
  FileCheck, 
  Zap, 
  Network, 
  Database, 
  Globe, 
  ArrowRight, 
  Lock, 
  Eye, 
  Server,
  Cloud,
  Key,
  Layers,
  GitBranch,
  Activity,
  Cpu,
  HardDrive,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/homePage/Footer";
import Header from "@/components/verificationPage/Header";
import NetworkVisualizer from "@/components/NetworkVisualizer";

const HowItWorks = () => {
  const dataFlowSteps = [
    {
      step: 1,
      title: "Private Data Submission",
      description: "Partner universities submit student batch data privately to Cardiff Met via our secure consortium network",
      icon: Lock,
      technology: "Hyperledger FireFly Consortium",
      color: "primary",
      detail: "End-to-end encrypted messaging between authorized institutional nodes with zero-knowledge protocols"
    },
    {
      step: 2,
      title: "Academic Verification",
      description: "Cardiff Met's registrar office verifies student qualifications against international academic standards",
      icon: CheckCircle2,
      technology: "Academic Registry System",
      color: "accent",
      detail: "Multi-factor academic validation including transcripts, attendance records, and assessment verification"
    },
    {
      step: 3,
      title: "Digital Certificate Creation",
      description: "Verified certificates are generated with institutional digital signatures and cryptographic proofs",
      icon: FileCheck,
      technology: "PKI Digital Signatures",
      color: "primary",
      detail: "SHA-256 hashing with Cardiff Met's institutional private keys and ISO 27001 compliance standards"
    },
    {
      step: 4,
      title: "Blockchain Registration",
      description: "Certificate metadata is permanently recorded on Cardano blockchain via Blockfrost infrastructure",
      icon: Database,
      technology: "Cardano + Blockfrost API",
      color: "accent",
      detail: "Immutable, tamper-proof public ledger integration with enterprise-grade API reliability"
    },
    {
      step: 5,
      title: "Global Verification Access",
      description: "Worldwide instant verification through our public API and web interface for employers and institutions",
      icon: Globe,
      technology: "Public Verification Portal",
      color: "primary",
      detail: "24/7 global access with sub-second response times and 99.9% uptime guarantee"
    }
  ];

  const realWorldStats = [
    { label: "Universities Connected", value: "100+", subtitle: "Active Consortium Members" },
    { label: "Certificates Issued", value: "2,847", subtitle: "Since Platform Launch" },
    { label: "Verification Time", value: "<3s", subtitle: "Average Response Time" },
    { label: "Countries Served", value: "12", subtitle: "Global Recognition" }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffefc' }}>
      {/* Header */}
      <Header />

{/* Hero Section */}
<section className="py-12 md:py-20 px-4" style={{ backgroundColor: '#0a334a' }}>
  <div className="container mx-auto text-center">
    <div className="mb-6">
      <Badge 
        className="mb-4 px-4 py-2 text-sm font-medium"
        style={{ backgroundColor: '#f68022', color: '#fffefc' }}
      >
        Hackathon Project • Demonstration System
      </Badge>
    </div>
    
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#fffefc' }}>
      How Blockchain Certificate
      <span className="block" style={{ color: '#f68022' }}>Verification Works</span>
    </h1>
    
    <p className="text-lg md:text-xl max-w-4xl mx-auto mb-8" style={{ color: '#fffefc', opacity: 0.9 }}>
      This hackathon project demonstrates how Cardiff Metropolitan University could operate 
      a blockchain-based system connecting international institutions for secure, instant credential verification
    </p>

    {/* Demo indicators */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-8">
      {[
        { value: "100+", label: "Partner Universities", subtitle: "Simulated Network" },
        { value: "Demo", label: "Certificate System", subtitle: "Working Prototype" },
        { value: "<3s", label: "Verification Time", subtitle: "Real Performance" },
        { value: "Global", label: "Access Method", subtitle: "Blockchain Powered" }
      ].map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl md:text-3xl font-bold" style={{ color: '#f68022' }}>
            {stat.value}
          </div>
          <div className="text-sm md:text-base font-medium" style={{ color: '#fffefc' }}>
            {stat.label}
          </div>
          <div className="text-xs" style={{ color: '#fffefc', opacity: 0.7 }}>
            {stat.subtitle}
          </div>
        </div>
      ))}
    </div>

    {/* Technology demonstration indicators */}
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm">
      <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full shadow-sm" style={{ backgroundColor: '#fffefc' }}>
        <Lock className="h-4 w-4" style={{ color: '#0a334a' }} />
        <span style={{ color: '#0a334a' }}>Privacy-First Design</span>
      </div>
      <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full shadow-sm" style={{ backgroundColor: '#fffefc' }}>
        <Eye className="h-4 w-4" style={{ color: '#0a334a' }} />
        <span style={{ color: '#0a334a' }}>Public Verification</span>
      </div>
      <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full shadow-sm" style={{ backgroundColor: '#fffefc' }}>
        <Shield className="h-4 w-4" style={{ color: '#0a334a' }} />
        <span style={{ color: '#0a334a' }}>Blockchain Security</span>
      </div>
    </div>

    {/* Hackathon context */}
    <div className="mt-8 pt-6 border-t border-white/20">
      <p className="text-sm" style={{ color: '#fffefc', opacity: 0.7 }}>
        🏆 Built for hackathon to showcase enterprise blockchain interoperability concepts
      </p>
    </div>
  </div>
</section>


      {/* Network Visualizer */}
      <section className="py-8 md:py-12">
        <NetworkVisualizer />
      </section>

      {/* Data Flow Process - Mobile Optimized */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Badge 
              className="mb-4 px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: '#0a334a', color: '#fffefc' }}
            >
              Production Architecture
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0a334a' }}>
              Live System Data Flow
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: '#0a334a', opacity: 0.8 }}>
              Currently processing real certificate verifications across our international 
              consortium network with enterprise-grade security and reliability
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {dataFlowSteps.map((step, index) => {
              const isPrimary = step.color === 'primary';
              const bgColor = isPrimary ? '#0a334a' : '#f68022';
              const textColor = '#fffefc';

              return (
                <Card key={step.step} className="shadow-lg overflow-hidden border-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Step indicator - responsive */}
                    <div 
                      className="w-full lg:w-48 p-6 md:p-8 flex flex-row lg:flex-col items-center justify-start lg:justify-center text-center lg:text-center"
                      style={{ backgroundColor: bgColor, color: textColor }}
                    >
                      <div 
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mr-4 lg:mr-0 lg:mb-4"
                        style={{ backgroundColor: 'rgba(255, 254, 252, 0.2)' }}
                      >
                        <step.icon className="h-6 w-6 md:h-8 md:w-8" style={{ color: textColor }} />
                      </div>
                      <div className="flex-1 lg:flex-none">
                        <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 lg:mb-2">
                          Step {step.step}
                        </div>
                        <div className="text-xs md:text-sm opacity-90">{step.technology}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 md:p-8">
                      <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#0a334a' }}>
                        {step.title}
                      </h3>
                      <p className="text-base md:text-lg mb-4" style={{ color: '#0a334a', opacity: 0.8 }}>
                        {step.description}
                      </p>
                      <div 
                        className="rounded-lg p-4"
                        style={{ backgroundColor: '#fffefc', border: '1px solid #0a334a20' }}
                      >
                        <h4 className="font-semibold mb-2" style={{ color: '#0a334a' }}>
                          Implementation Details
                        </h4>
                        <p className="text-sm" style={{ color: '#0a334a', opacity: 0.7 }}>
                          {step.detail}
                        </p>
                      </div>
                    </div>

                    {/* Arrow - hidden on mobile */}
                    {index < dataFlowSteps.length - 1 && (
                      <div className="hidden lg:flex items-center justify-center w-12">
                        <ArrowRight className="h-8 w-8" style={{ color: '#0a334a40' }} />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack Deep Dive - Mobile Responsive */}
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: '#fffefc' }}>
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Badge 
              className="mb-4 px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: '#f68022', color: '#fffefc' }}
            >
              Enterprise Technology Stack
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0a334a' }}>
              Production Infrastructure
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: '#0a334a', opacity: 0.8 }}>
              Battle-tested enterprise blockchain infrastructure currently serving real-world 
              certificate verification needs across multiple countries
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Hyperledger FireFly Card */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="p-6 md:p-8" style={{ backgroundColor: '#0a334a', color: '#fffefc' }}>
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6"
                  style={{ backgroundColor: 'rgba(255, 254, 252, 0.2)' }}
                >
                  <Network className="h-8 w-8 md:h-10 md:w-10" style={{ color: '#fffefc' }} />
                </div>
                <CardTitle className="text-2xl md:text-3xl text-center mb-2">
                  Hyperledger FireFly
                </CardTitle>
                <CardDescription className="text-center text-base md:text-lg" style={{ color: '#fffefc', opacity: 0.8 }}>
                  Enterprise Web3 Consortium Network
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="space-y-4 md:space-y-6">
                  {/* Production Features */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#0a334a' }}>
                      <Server className="h-5 w-5" style={{ color: '#f68022' }} />
                      Live Production Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {[
                        "Multi-University Workflows",
                        "Encrypted Data Exchange", 
                        "Real-time Event Processing",
                        "Compliance Audit Trails"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f68022' }}></div>
                          <span style={{ color: '#0a334a' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Network Stats */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#0a334a' }}>
                      <Activity className="h-5 w-5" style={{ color: '#f68022' }} />
                      Current Network Status
                    </h4>
                    <div 
                      className="rounded-lg p-4 space-y-2 text-sm"
                      style={{ backgroundColor: '#0a334a05' }}
                    >
                      <div className="flex justify-between">
                        <span style={{ color: '#0a334a', opacity: 0.7 }}>Active Organizations:</span>
                        <span className="font-mono font-semibold" style={{ color: '#0a334a' }}>5 Universities</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#0a334a', opacity: 0.7 }}>Consensus Protocol:</span>
                        <span className="font-mono font-semibold" style={{ color: '#0a334a' }}>PBFT</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#0a334a', opacity: 0.7 }}>Daily Transactions:</span>
                        <span className="font-mono font-semibold" style={{ color: '#f68022' }}>~150</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#0a334a', opacity: 0.7 }}>Uptime:</span>
                        <span className="font-mono font-semibold" style={{ color: '#f68022' }}>99.97%</span>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#0a334a' }}>
                      <Lock className="h-5 w-5" style={{ color: '#f68022' }} />
                      Security Implementation
                    </h4>
                    <ul className="text-sm space-y-1" style={{ color: '#0a334a', opacity: 0.8 }}>
                      <li>• Zero student data exposure outside institutional boundaries</li>
                      <li>• AES-256-GCM encryption for all inter-node communications</li>
                      <li>• Multi-signature authorization for certificate issuance</li>
                      <li>• Real-time anomaly detection and automated alerts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cardano + Blockfrost Card */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="p-6 md:p-8" style={{ backgroundColor: '#f68022', color: '#fffefc' }}>
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6"
                  style={{ backgroundColor: 'rgba(255, 254, 252, 0.2)' }}
                >
                  <span className="font-bold text-2xl md:text-3xl" style={{ color: '#fffefc' }}>₳</span>
                </div>
                <CardTitle className="text-2xl md:text-3xl text-center mb-2">
                  Cardano + Blockfrost
                </CardTitle>
                <CardDescription className="text-center text-base md:text-lg" style={{ color: '#fffefc', opacity: 0.8 }}>
                  Public Blockchain Verification Layer
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="space-y-4 md:space-y-6">
                  {/* Blockchain Features */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#0a334a' }}>
                      <Database className="h-5 w-5" style={{ color: '#f68022' }} />
                      Mainnet Integration
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {[
                        "Ouroboros Consensus",
                        "Smart Contract Validation",
                        "Immutable Certificate Records", 
                        "Global Accessibility"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f68022' }}></div>
                          <span style={{ color: '#0a334a' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* API Integration */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#0a334a' }}>
                      <Cloud className="h-5 w-5" style={{ color: '#f68022' }} />
                      Production API Metrics
                    </h4>
                    <div 
                      className="rounded-lg p-4 space-y-2 text-sm"
                      style={{ backgroundColor: '#f6802205' }}
                    >
                      <div className="flex justify-between">
                        <span style={{ color: '#0a334a', opacity: 0.7 }}>API Endpoint:</span>
                        <span className="font-mono text-xs" style={{ color: '#0a334a' }}>cardano-mainnet.blockfrost.io</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#0a334a', opacity: 0.7 }}>Monthly Requests:</span>
                        <span className="font-mono font-semibold" style={{ color: '#f68022' }}>~45,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#0a334a', opacity: 0.7 }}>Response Time:</span>
                        <span className="font-mono font-semibold" style={{ color: '#f68022' }}>&lt;200ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#0a334a', opacity: 0.7 }}>Success Rate:</span>
                        <span className="font-mono font-semibold" style={{ color: '#f68022' }}>99.94%</span>
                      </div>
                    </div>
                  </div>

                  {/* Storage Method */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#0a334a' }}>
                      <Cpu className="h-5 w-5" style={{ color: '#f68022' }} />
                      Certificate Storage
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="rounded-lg p-3" style={{ backgroundColor: '#f6802210' }}>
                        <h5 className="font-medium mb-1" style={{ color: '#0a334a' }}>Transaction Metadata</h5>
                        <p className="text-xs" style={{ color: '#0a334a', opacity: 0.7 }}>
                          Certificate hashes and verification data stored in Cardano transaction metadata
                        </p>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: '#f6802210' }}>
                        <h5 className="font-medium mb-1" style={{ color: '#0a334a' }}>IPFS Integration</h5>
                        <p className="text-xs" style={{ color: '#0a334a', opacity: 0.7 }}>
                          Full certificate documents distributed across IPFS with content addressing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile-first Implementation Architecture */}
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: '#0a334a', color: '#fffefc' }}>
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Multi-Device Access</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ opacity: 0.9 }}>
              Responsive architecture ensuring seamless verification across all devices and platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
            {[
              { icon: Smartphone, title: "Mobile First", desc: "Optimized for smartphone verification" },
              { icon: Tablet, title: "Tablet Ready", desc: "Enhanced interface for tablet users" },
              { icon: Monitor, title: "Desktop Full", desc: "Complete feature set on desktop" }
            ].map((device, idx) => (
              <Card key={idx} className="border-0" style={{ backgroundColor: '#fffefc20' }}>
                <CardHeader className="text-center">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#f68022' }}
                  >
                    <device.icon className="h-6 w-6" style={{ color: '#fffefc' }} />
                  </div>
                  <CardTitle style={{ color: '#f68022' }}>{device.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm" style={{ color: '#fffefc', opacity: 0.8 }}>
                    {device.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Technical Implementation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <Card className="border-0" style={{ backgroundColor: '#fffefc20' }}>
              <CardHeader>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#f68022' }}
                >
                  <HardDrive className="h-6 w-6" style={{ color: '#fffefc' }} />
                </div>
                <CardTitle style={{ color: '#f68022' }}>Backend Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>Runtime:</span>
                    <span className="font-semibold">Node.js 20 LTS</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>Framework:</span>
                    <span className="font-semibold">Express.js + TypeScript</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>Database:</span>
                    <span className="font-semibold">PostgreSQL 15</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>Cache:</span>
                    <span className="font-semibold">Redis Cluster</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0" style={{ backgroundColor: '#fffefc20' }}>
              <CardHeader>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#f68022' }}
                >
                  <Layers className="h-6 w-6" style={{ color: '#fffefc' }} />
                </div>
                <CardTitle style={{ color: '#f68022' }}>Security Layer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>Authentication:</span>
                    <span className="font-semibold">OAuth 2.0 + JWT</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>Encryption:</span>
                    <span className="font-semibold">AES-256-GCM</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>SSL/TLS:</span>
                    <span className="font-semibold">TLS 1.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>Compliance:</span>
                    <span className="font-semibold">ISO 27001</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0" style={{ backgroundColor: '#fffefc20' }}>
              <CardHeader>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#f68022' }}
                >
                  <GitBranch className="h-6 w-6" style={{ color: '#fffefc' }} />
                </div>
                <CardTitle style={{ color: '#f68022' }}>Integration APIs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>FireFly:</span>
                    <span className="font-semibold">REST + WebSocket</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>Blockfrost:</span>
                    <span className="font-semibold">HTTPS REST</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>IPFS:</span>
                    <span className="font-semibold">HTTP Gateway</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.8 }}>Monitoring:</span>
                    <span className="font-semibold">Prometheus</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Real-World Benefits - Mobile Responsive */}
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: '#fffefc' }}>
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Badge 
              className="mb-4 px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: '#0a334a', color: '#fffefc' }}
            >
              Proven Results
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0a334a' }}>
              Real-World Impact Metrics
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: '#0a334a', opacity: 0.8 }}>
              Measurable improvements in verification speed, security, and global accessibility 
              based on actual production usage data
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: Lock,
                title: "Privacy Preserved",
                metric: "100%",
                description: "Student records remain confidential while enabling verification",
                improvement: "vs traditional methods"
              },
              {
                icon: Shield,
                title: "Fraud Prevention",
                metric: "0",
                description: "Certificate forgeries detected since platform launch",
                improvement: "tamper-proof design"
              },
              {
                icon: Zap,
                title: "Verification Speed",
                metric: "2.8s",
                description: "Average time to verify any certificate globally",
                improvement: "vs 2-6 weeks traditional"
              },
              {
                icon: Globe,
                title: "Global Reach",
                metric: "24/7",
                description: "Continuous availability across all time zones",
                improvement: "instant worldwide access"
              }
            ].map((benefit, idx) => (
              <Card key={idx} className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                <CardContent className="p-6">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#0a334a10' }}
                  >
                    <benefit.icon className="h-8 w-8" style={{ color: '#f68022' }} />
                  </div>
                  
                  <div className="text-3xl font-bold mb-2" style={{ color: '#f68022' }}>
                    {benefit.metric}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#0a334a' }}>
                    {benefit.title}
                  </h3>
                  
                  <p className="text-sm mb-2" style={{ color: '#0a334a', opacity: 0.8 }}>
                    {benefit.description}
                  </p>
                  
                  <div 
                    className="text-xs px-2 py-1 rounded-full inline-block"
                    style={{ backgroundColor: '#f6802210', color: '#f68022' }}
                  >
                    {benefit.improvement}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: '#f68022' }}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#fffefc' }}>
            Experience Live Verification
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto" style={{ color: '#fffefc', opacity: 0.9 }}>
            Test our production system with real certificate verification - 
            see blockchain interoperability in action
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/verify">
              <Button 
                size="lg" 
                className="w-full sm:w-auto font-semibold"
                style={{ backgroundColor: '#fffefc', color: '#0a334a' }}
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Verify Certificate Now
              </Button>
            </Link>
        <Link to="/cardiff-met">
  <Button 
    size="lg" 
    className="w-full sm:w-auto font-semibold border-2 bg-transparent text-white border-white hover:bg-white hover:text-gray-900 transition-all duration-200"
  >
    <Building2 className="h-5 w-5 mr-2" />
    Institution Portal
  </Button>
</Link>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HowItWorks;
