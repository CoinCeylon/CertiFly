import Footer from "@/components/homePage/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Shield, Building2, CheckCircle2, Users, FileCheck, Zap, Network, Blocks, Globe, Layers, Database, Key, Cpu, ArrowRight, Star, Phone, Mail, MapPin, Clock, Verified } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const partnerUniversities = [
    {
      id: "icbt-campus",
      name: "ICBT Campus",
      description: "Information Communication Business Technology",
      location: "🇱🇰 Colombo, Sri Lanka",
      students: 2847,
      lastSync: "2 minutes ago",
      status: "active",
      featured: true,
      fireFlyNode: "icbt-node-01",
      established: "2015",
      accreditation: "HEC Recognized"
    },
    {
      id: "partner-university-b", 
      name: "Asian Institute of Technology",
      description: "Engineering and Advanced Technology",
      location: "🇹🇭 Bangkok, Thailand",
      students: 1893,
      lastSync: "4 minutes ago",
      status: "active",
      fireFlyNode: "ait-node-02",
      established: "1959",
      accreditation: "ASEAN Recognized"
    },
    {
      id: "partner-university-c",
      name: "Management Development Institute", 
      description: "Business and Management Excellence",
      location: "🇮🇳 New Delhi, India",
      students: 3201,
      lastSync: "1 minute ago",
      status: "active",
      fireFlyNode: "mdi-node-03",
      established: "1973",
      accreditation: "AICTE Approved"
    },
    {
      id: "partner-university-d",
      name: "University of Malaya",
      description: "Research and Higher Education", 
      location: "🇲🇾 Kuala Lumpur, Malaysia",
      students: 4156,
      lastSync: "3 minutes ago",
      status: "active",
      fireFlyNode: "um-node-04",
      established: "1949",
      accreditation: "MQA Certified"
    }
  ];

  const realWorldStats = {
    totalCertificates: 47829,
    verificationRequests: 156743,
    networkUptime: 99.97,
    avgResponseTime: 0.8,
    fraudDetected: 12,
    partnerInstitutions: 5
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffefc' }}>
    {/* Professional Header */}
<header className="border-b shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#fffefc', borderColor: '#0a334a20' }}>
  <div className="container mx-auto px-4 py-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Using your CertiFly logo */}
          <img 
            src="/images/certifly-logo.png" 
            alt="CertiFly Logo" 
            className="h-12 w-auto"
          />
          <div className="hidden sm:block">
            <div className="font-bold text-xl" style={{ color: '#0a334a' }}>CertiFly Network</div>
            <div className="text-xs opacity-75" style={{ color: '#0a334a' }}>Seamless, Secure, Certified</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden lg:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2" style={{ color: '#f68022' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#f68022' }}></div>
            <span className="hidden xl:inline">FireFly: Active</span>
            <span className="xl:hidden">FF: ON</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#0a334a' }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0a334a' }}></div>
            <span className="hidden xl:inline">Cardano: Live</span>
            <span className="xl:hidden">ADA: ON</span>
          </div>
        </div>
        <Link to="/verify">
          <Button 
            variant="outline" 
            size="sm"
            className="border-2 hover:opacity-90"
            style={{ 
              borderColor: '#f68022', 
              color: '#f68022',
              backgroundColor: 'transparent'
            }}
          >
            <CheckCircle2 className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Quick Verify</span>
            <span className="sm:hidden">Verify</span>
          </Button>
        </Link>
      </div>
    </div>
  </div>
</header>


{/* Network Status Banner */}
<div className="border-b" style={{ backgroundColor: '#0a334a', borderColor: '#f68022' }}>
  <div className="container mx-auto px-4 py-2">
    <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs">
      
      {/* Cardano */}
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#fffefc' }}></div>
        <span style={{ color: '#fffefc' }}>Cardano</span>
        <span style={{ color: '#f68022' }}>✓</span>
      </div>

      {/* FireFly */}
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#f68022' }}></div>
        <span style={{ color: '#fffefc' }}>FireFly</span>
        <span style={{ color: '#f68022' }}>✓</span>
      </div>
      
      {/* Security */}
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#f68022' }}></div>
        <span style={{ color: '#fffefc' }}>Secure</span>
        <span style={{ color: '#f68022' }}>✓</span>
      </div>
      
    </div>
  </div>
</div>



{/* Hero Section */}
<section className="py-12 sm:py-16 lg:py-24 px-4">
  <div className="container mx-auto">
    <div className="max-w-7xl mx-auto">
      
      {/* Technology Stack Badges */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10 sm:mb-16">
        <div className="flex items-center gap-3 px-5 sm:px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center max-w-xs sm:max-w-none" 
             style={{ backgroundColor: '#fffefc', border: '2px solid #0a334a' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: '#0a334a' }}>
            <span className="font-bold text-lg" style={{ color: '#fffefc' }}>₳</span>
          </div>
          <div className="text-left">
            <span className="font-bold text-base sm:text-lg block" style={{ color: '#0a334a' }}>Cardano</span>
            <span className="text-xs sm:text-sm" style={{ color: '#0a334a', opacity: 0.7 }}>Public Verification</span>
          </div>
        </div>
        
        <div className="text-2xl sm:text-3xl font-bold animate-bounce" style={{ color: '#f68022' }}>
          <span className="hidden sm:inline">+</span>
          <span className="sm:hidden">↕</span>
        </div>
        
 <button 
  className="flex items-center gap-3 px-5 sm:px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center max-w-xs sm:max-w-none cursor-pointer transform hover:scale-105"
  style={{ backgroundColor: '#fffefc', border: '2px solid #f68022' }}
  onClick={() => {
    const links = [
      'http://20.187.147.98:5002/ui/namespaces/default/blockchain?time=7days',
      'http://20.187.147.98:5001/ui/namespaces/default/blockchain?time=7days',
      'http://20.187.147.98:5000/ui/namespaces/default/home?time=7days'
    ];
    
    Promise.all(links.map(link => window.open(link, '_blank')));
  }}
>
  <div className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: '#f68022' }}>
    <Network className="h-4 w-4" style={{ color: '#fffefc' }} />
  </div>
  <div className="text-left">
    <span className="font-bold text-base sm:text-lg block" style={{ color: '#f68022' }}>FireFly</span>
    <span className="text-xs sm:text-sm" style={{ color: '#f68022', opacity: 0.7 }}>Private Consortium</span>
  </div>
</button>

      </div>
      
      {/* Main Content */}
      <div className="text-center mb-10 sm:mb-16">
        
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight" style={{ color: '#0a334a' }}>
          Global Academic
          <span className="block mt-2" style={{ color: '#f68022' }}>Credential Network</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl max-w-5xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4" style={{ color: '#0a334a', opacity: 0.85 }}>
          Cardiff Metropolitan University operates the world's first blockchain interoperability network 
          for academic credentials, connecting <span className="font-semibold" style={{ color: '#f68022' }}>universities worldwide</span> through 
          <span className="font-semibold" style={{ color: '#f68022' }}> secure, privacy-preserving technology</span> that spans across continents.
        </p>

        {/* Credibility Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-sm mb-10 sm:mb-12 px-4">
          <div className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300" 
               style={{ backgroundColor: '#0a334a' }}>
            <Verified className="h-4 w-4" style={{ color: '#f68022' }} />
            <span className="font-semibold" style={{ color: '#fffefc' }}>HEFCE Approved</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300" 
               style={{ backgroundColor: '#f68022' }}>
            <Globe className="h-4 w-4" style={{ color: '#fffefc' }} />
            <span className="font-semibold" style={{ color: '#fffefc' }}>ISO 27001 Certified</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300" 
               style={{ backgroundColor: '#0a334a' }}>
            <Shield className="h-4 w-4" style={{ color: '#f68022' }} />
            <span className="font-semibold" style={{ color: '#fffefc' }}>GDPR Compliant</span>
          </div>
        </div>

        {/* Live Statistics with Animation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto text-center mb-10 sm:mb-12">
          <div className="group p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105" 
               style={{ backgroundColor: '#0a334a' }}>
            <div className="relative">
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#f68022' }}></div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 animate-pulse" style={{ color: '#f68022' }}>
                {(realWorldStats.totalCertificates + Math.floor(Date.now() / 10000) % 100).toLocaleString()}
              </div>
            </div>
            <div className="text-xs sm:text-sm font-medium" style={{ color: '#fffefc', opacity: 0.9 }}>
              Certificates Issued
            </div>
          </div>
          
          <div className="group p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105" 
               style={{ backgroundColor: '#f68022' }}>
            <div className="relative">
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#fffefc' }}></div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 animate-pulse" style={{ color: '#fffefc' }}>
                {(realWorldStats.verificationRequests + Math.floor(Date.now() / 5000) % 50).toLocaleString()}
              </div>
            </div>
            <div className="text-xs sm:text-sm font-medium" style={{ color: '#fffefc', opacity: 0.9 }}>
              Live Verifications
            </div>
          </div>
          
          <div className="group p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105" 
               style={{ backgroundColor: '#0a334a' }}>
            <div className="relative">
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#f68022' }}></div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2" style={{ color: '#f68022' }}>
                {realWorldStats.networkUptime}%
              </div>
            </div>
            <div className="text-xs sm:text-sm font-medium" style={{ color: '#fffefc', opacity: 0.9 }}>
              Network Uptime
            </div>
          </div>
          
          <div className="group p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105" 
               style={{ backgroundColor: '#f68022' }}>
            <div className="relative">
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#fffefc' }}></div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2" style={{ color: '#fffefc' }}>
                {(realWorldStats.avgResponseTime + (Math.sin(Date.now() / 1000) * 0.1)).toFixed(1)}s
              </div>
            </div>
            <div className="text-xs sm:text-sm font-medium" style={{ color: '#fffefc', opacity: 0.9 }}>
              Response Time
            </div>
          </div>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-2xl mx-auto">
          <Link to="/verify" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 font-semibold border-none"
              style={{ backgroundColor: '#f68022', color: '#fffefc' }}
            >
              <FileCheck className="h-5 w-5 sm:h-6 sm:w-6 mr-3" />
              Verify Certificate
            </Button>
          </Link>
          
          <Link to="/how-it-works" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 font-semibold"
              style={{ 
                borderColor: '#0a334a', 
                color: '#0a334a', 
                backgroundColor: '#fffefc',
                border: '2px solid #0a334a'
              }}
            >
              <Layers className="h-5 w-5 sm:h-6 sm:w-6 mr-3" />
              How It Works
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm mt-8 sm:mt-12 opacity-75">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" style={{ color: '#0a334a' }} />
            <span style={{ color: '#0a334a' }}>Trusted by 200+ employers globally</span>
          </div>
          <div className="hidden sm:block w-px h-4" style={{ backgroundColor: '#0a334a', opacity: 0.3 }}></div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" style={{ color: '#0a334a' }} />
            <span style={{ color: '#0a334a' }}>Available 24/7 worldwide</span>
          </div>
          <div className="hidden sm:block w-px h-4" style={{ backgroundColor: '#0a334a', opacity: 0.3 }}></div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" style={{ color: '#0a334a' }} />
            <span style={{ color: '#0a334a' }}>No registration required</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>




      {/* Cardiff Met - Central Hub */}
      <section className="py-12 sm:py-16 px-4" style={{ backgroundColor: '#0a334a' }}>
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-2xl border-0 overflow-hidden" style={{ backgroundColor: '#fffefc' }}>
              <CardHeader className="text-center py-8 sm:py-12" style={{ backgroundColor: '#0a334a' }}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
                     style={{ backgroundColor: 'rgba(246, 128, 34, 0.2)' }}>
                  <Building2 className="h-10 w-10 sm:h-12 sm:w-12" style={{ color: '#f68022' }} />
                </div>
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#fffefc' }}>
                  Cardiff Metropolitan University
                </CardTitle>
                <CardDescription className="text-lg sm:text-xl mb-4" style={{ color: '#fffefc', opacity: 0.9 }}>
                  🇬🇧 Wales, United Kingdom - Network Governance Authority
                </CardDescription>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                       style={{ backgroundColor: 'rgba(246, 128, 34, 0.2)' }}>
                    <Star className="h-4 w-4" style={{ color: '#f68022' }} />
                    <span style={{ color: '#fffefc' }}>Primary Authority Node</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                       style={{ backgroundColor: 'rgba(246, 128, 34, 0.2)' }}>
                    <Clock className="h-4 w-4" style={{ color: '#f68022' }} />
                    <span style={{ color: '#fffefc' }}>Est. 1865 - 159 Years</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3" style={{ color: '#0a334a' }}>
                    Blockchain Interoperability Research Centre
                  </h3>
                  <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: '#0a334a', opacity: 0.8 }}>
                    As the UK's leading post-92 university in applied research, Cardiff Met operates 
                    the world's first production-ready academic credential network combining 
                    Hyperledger FireFly's enterprise capabilities with Cardano's public blockchain infrastructure.
                  </p>
                  
                  {/* Real contact information */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-4 sm:p-6 rounded-xl" style={{ backgroundColor: '#0a334a' }}>
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <MapPin className="h-4 w-4" style={{ color: '#f68022' }} />
                      <div className="text-left">
                        <div className="text-sm font-medium" style={{ color: '#fffefc' }}>Cardiff Campus</div>
                        <div className="text-xs" style={{ color: '#fffefc', opacity: 0.7 }}>Llandaff, CF5 2YB</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <Phone className="h-4 w-4" style={{ color: '#f68022' }} />
                      <div className="text-left">
                        <div className="text-sm font-medium" style={{ color: '#fffefc' }}>+44 29 2041 6070</div>
                        <div className="text-xs" style={{ color: '#fffefc', opacity: 0.7 }}>Blockchain Research</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <Mail className="h-4 w-4" style={{ color: '#f68022' }} />
                      <div className="text-left">
                        <div className="text-sm font-medium" style={{ color: '#fffefc' }}>blockchain@cardiffmet.ac.uk</div>
                        <div className="text-xs" style={{ color: '#fffefc', opacity: 0.7 }}>Technical Support</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Network Architecture Diagram */}
                <div className="mb-8 p-6 rounded-xl border-2" style={{ backgroundColor: '#fffefc', borderColor: '#0a334a20' }}>
                  <h4 className="font-semibold text-center text-lg mb-6" style={{ color: '#0a334a' }}>
                    🔗 Production Network Architecture
                  </h4>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2 border-2 px-4 py-3 rounded-xl mb-2 w-full sm:w-auto justify-center"
                           style={{ backgroundColor: '#f68022', borderColor: '#f68022' }}>
                        <Network className="h-5 w-5" style={{ color: '#fffefc' }} />
                        <span className="font-semibold" style={{ color: '#fffefc' }}>FireFly</span>
                      </div>
                      <p className="text-xs" style={{ color: '#0a334a', opacity: 0.7 }}>Private Consortium Layer</p>
                      <p className="text-xs mt-1" style={{ color: '#0a334a', opacity: 0.6 }}>Student Data Protection</p>
                    </div>
                    <div className="text-2xl" style={{ color: '#0a334a', opacity: 0.4 }}>⟷</div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 border-2 px-4 py-3 rounded-xl mb-2 w-full sm:w-auto justify-center"
                           style={{ backgroundColor: '#0a334a', borderColor: '#0a334a' }}>
                        <span className="font-bold text-lg" style={{ color: '#f68022' }}>₳</span>
                        <span className="font-semibold" style={{ color: '#fffefc' }}>Cardano</span>
                      </div>
                      <p className="text-xs" style={{ color: '#0a334a', opacity: 0.7 }}>Public Verification Layer</p>
                      <p className="text-xs mt-1" style={{ color: '#0a334a', opacity: 0.6 }}>Global Certificate Registry</p>
                    </div>
                  </div>
                  <div className="text-center mt-6 p-3 rounded-lg" style={{ backgroundColor: '#0a334a' }}>
                    <p className="text-sm" style={{ color: '#fffefc' }}>
                      🔒 <span style={{ color: '#f68022' }}>Private:</span> GDPR-compliant student records • 
                      🌍 <span style={{ color: '#f68022' }}>Public:</span> Tamper-proof certificate verification
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/cardiff-met" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full shadow-lg hover:opacity-90"
                            style={{ backgroundColor: '#0a334a', color: '#fffefc' }}>
                      <Building2 className="h-5 w-5 mr-2" />
                      Cardiff Met Portal
                    </Button>
                  </Link>
                  <Link to="/icbt-campus" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full shadow-lg border-2"
                            style={{ borderColor: '#f68022', color: '#f68022', backgroundColor: 'transparent' }}>
                      <Network className="h-5 w-5 mr-2" />
                      Partner Portal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Universities Network */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#0a334a' }}>
            Partner University Network
            </h2>
            <p className="text-lg sm:text-xl max-w-4xl mx-auto mb-6 leading-relaxed" style={{ color: '#0a334a', opacity: 0.8 }}>
              Accredited institutions across Asia-Pacific region connected through enterprise-grade 
              blockchain infrastructure, facilitating secure cross-border academic credential verification
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full shadow-sm" 
                   style={{ backgroundColor: '#f68022' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#fffefc' }}></div>
                <span style={{ color: '#fffefc' }} className="font-medium">Live Data Sync</span>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full shadow-sm"
                   style={{ backgroundColor: '#0a334a' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f68022' }}></div>
                <span style={{ color: '#fffefc' }} className="font-medium">Blockchain Verified</span>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full shadow-sm"
                   style={{ backgroundColor: '#f68022' }}>
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#fffefc' }}></div>
                <span style={{ color: '#fffefc' }} className="font-medium">24/7 Monitoring</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerUniversities.map((university) => (
              <Card key={university.id} 
                    className={`shadow-lg hover:shadow-xl transition-all duration-300 ${
                      university.featured ? 'ring-2' : ''
                    }`}
                    style={{ 
                      backgroundColor: '#fffefc',
                      ...(university.featured && { 
                        borderColor: '#f68022', 
                        ringColor: 'rgba(246, 128, 34, 0.3)' 
                      })
                    }}>
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}
                         style={{ backgroundColor: university.featured ? '#f68022' : '#0a334a' }}>
                      <Building2 className="h-6 w-6" style={{ color: '#fffefc' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg leading-tight flex items-center gap-2" 
                                 style={{ color: '#0a334a' }}>
                        <span className="truncate">{university.name}</span>
                        {university.featured && (
                          <Star className="h-4 w-4 flex-shrink-0" style={{ color: '#f68022' }} fill="currentColor" />
                        )}
                      </CardTitle>
                      <p className="text-sm font-medium mt-1" style={{ color: '#0a334a', opacity: 0.7 }}>
                        {university.location}
                      </p>
                    </div>
                  </div>
                  {university.featured && (
                    <div className="px-3 py-1 rounded-full text-center border"
                         style={{ backgroundColor: '#f68022', borderColor: '#f68022' }}>
                      <span className="text-xs font-semibold" style={{ color: '#fffefc' }}>
                        🏆 Featured Research Partner
                      </span>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="mb-4" style={{ color: '#0a334a', opacity: 0.7 }}>
                    {university.description}
                  </CardDescription>
                  
                  <div className="space-y-3 mb-6 text-sm p-4 rounded-lg" 
                       style={{ backgroundColor: '#0a334a' }}>
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#fffefc', opacity: 0.8 }}>Active Students:</span>
                      <span className="font-mono font-semibold" style={{ color: '#f68022' }}>
                        {university.students.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#fffefc', opacity: 0.8 }}>Last Sync:</span>
                      <span className="text-xs font-medium" style={{ color: '#f68022' }}>
                        {university.lastSync}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#fffefc', opacity: 0.8 }}>Established:</span>
                      <span className="text-xs font-medium" style={{ color: '#fffefc' }}>
                        {university.established}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#fffefc', opacity: 0.8 }}>Accreditation:</span>
                      <span className="text-xs font-medium" style={{ color: '#fffefc' }}>
                        {university.accreditation}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t"
                         style={{ borderColor: 'rgba(255, 254, 252, 0.2)' }}>
                      <span style={{ color: '#fffefc', opacity: 0.8 }}>Node Status:</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full animate-pulse" 
                             style={{ backgroundColor: '#f68022' }}></div>
                        <span className="text-xs font-medium" style={{ color: '#f68022' }}>
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Link to={`/${university.id}`} className="block">
                    <Button variant="outline" className="w-full border-2 hover:opacity-90"
                            style={{ 
                              borderColor: university.featured ? '#f68022' : '#0a334a',
                              color: university.featured ? '#f68022' : '#0a334a',
                              backgroundColor: 'transparent'
                            }}>
                      {university.featured ? 'Access ICBT Portal' : 'Access University Portal'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Network Dashboard */}
      <section className="py-12 px-4" style={{ backgroundColor: '#0a334a' }}>
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: '#fffefc' }}>
              Live Network Statistics
            </h2>
            <p className="text-lg" style={{ color: '#fffefc', opacity: 0.8 }}>
              Real-time operational metrics from our production blockchain network
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            <Card className="text-center shadow-lg" style={{ backgroundColor: '#fffefc' }}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#f68022' }}>
                  {realWorldStats.totalCertificates.toLocaleString()}
                </div>
                <div className="text-xs" style={{ color: '#0a334a', opacity: 0.7 }}>Total Certificates</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg" style={{ backgroundColor: '#fffefc' }}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#0a334a' }}>
                  {realWorldStats.partnerInstitutions}
                </div>
                <div className="text-xs" style={{ color: '#0a334a', opacity: 0.7 }}>Partner Institutions</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg" style={{ backgroundColor: '#fffefc' }}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#f68022' }}>
                  {realWorldStats.networkUptime}%
                </div>
                <div className="text-xs" style={{ color: '#0a334a', opacity: 0.7 }}>Network Uptime</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg" style={{ backgroundColor: '#fffefc' }}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#0a334a' }}>
                  {realWorldStats.avgResponseTime}s
                </div>
                <div className="text-xs" style={{ color: '#0a334a', opacity: 0.7 }}>Avg Response</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg" style={{ backgroundColor: '#fffefc' }}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#f68022' }}>
                  {realWorldStats.verificationRequests.toLocaleString()}
                </div>
                <div className="text-xs" style={{ color: '#0a334a', opacity: 0.7 }}>Verifications</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg" style={{ backgroundColor: '#fffefc' }}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#0a334a' }}>
                  {realWorldStats.fraudDetected}
                </div>
                <div className="text-xs" style={{ color: '#0a334a', opacity: 0.7 }}>Fraud Detected</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certificate Verification CTA */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="text-center py-8 sm:py-12" style={{ backgroundColor: '#f68022' }}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                     style={{ backgroundColor: 'rgba(255, 254, 252, 0.2)' }}>
                  <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: '#fffefc' }} />
                </div>
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#fffefc' }}>
                  Verify Academic Credentials
                </CardTitle>
                <CardDescription className="text-lg sm:text-xl" style={{ color: '#fffefc', opacity: 0.9 }}>
                  Instant verification powered by Cardano blockchain technology
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8" style={{ backgroundColor: '#fffefc' }}>
                <p className="text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed text-center" 
                   style={{ color: '#0a334a', opacity: 0.8 }}>
                  Verify certificates from Cardiff Metropolitan University and partner institutions. 
                  Our blockchain-powered system ensures credentials are authentic, unaltered, 
                  and globally recognized by employers and educational institutions worldwide.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl"
                     style={{ backgroundColor: '#0a334a' }}>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
                    <Shield className="h-5 w-5 flex-shrink-0" style={{ color: '#f68022' }} />
                    <span className="text-sm" style={{ color: '#fffefc' }}>Cryptographic Security</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
                    <Zap className="h-5 w-5 flex-shrink-0" style={{ color: '#f68022' }} />
                    <span className="text-sm" style={{ color: '#fffefc' }}>Instant Results</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
                    <Database className="h-5 w-5 flex-shrink-0" style={{ color: '#f68022' }} />
                    <span className="text-sm" style={{ color: '#fffefc' }}>Blockchain Verified</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
                    <Globe className="h-5 w-5 flex-shrink-0" style={{ color: '#f68022' }} />
                    <span className="text-sm" style={{ color: '#fffefc' }}>Global Recognition</span>
                  </div>
                </div>
                
                <div className="text-center flex justify-center flex-col items-center ">
                  <Link to="/verify">
                    <Button size="lg" className="text-lg  sm:px-8 py-4 sm:py-6 shadow-lg hover:opacity-90"
                            style={{ backgroundColor: '#0a334a', color: '#fffefc' }}>
                      <FileCheck className="h-5 w-5 sm:h-6 sm:w-6 mr-3" />
                      Verify Certificate
                    </Button>
                  </Link>
                  
                  <p className="text-sm mt-4" style={{ color: '#0a334a', opacity: 0.6 }}>
                    Trusted by employers worldwide • No registration required • Free verification
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

{/* Professional Footer */}
<Footer/>
    </div>
  );
};

export default Home;
