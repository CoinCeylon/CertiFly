import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Shield, Building2, CheckCircle2, Users, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const localCampuses = [
    {
      id: "campus-b",
      name: "Campus B",
      description: "Engineering and Technology Campus",
      location: "North District"
    },
    {
      id: "campus-c", 
      name: "Campus C",
      description: "Medical Sciences Campus",
      location: "Central District"
    },
    {
      id: "campus-d",
      name: "Campus D", 
      description: "Business and Management Campus",
      location: "South District"
    },
    {
      id: "campus-e",
      name: "Campus E",
      description: "Arts and Humanities Campus", 
      location: "East District"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-blue-100">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CertVerify</h1>
                <p className="text-sm text-gray-600">University Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/verify">
                <Button variant="outline" size="sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Quick Verify
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              University Certificate
              <span className="text-blue-600 block">
                Verification Portal
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Secure, reliable, and transparent certificate verification system for academic credentials across all university campuses.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure Verification</h3>
              <p className="text-sm text-gray-600">Advanced encryption and digital signatures ensure certificate authenticity</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Multi-Campus</h3>
              <p className="text-sm text-gray-600">Unified system across all university campuses and departments</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">Real-time verification with immediate status updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus A Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-blue-200 bg-gradient-to-r from-white to-blue-50">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-blue-600">Campus A - Central Administration</CardTitle>
                <CardDescription className="text-lg">
                  Main administrative hub for certificate verification and approval processes
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-gray-600">Certificates Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-sm text-gray-600">System Availability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">99.9%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                </div>
                <Link to="/campus-a">
                  <Button variant="academic" size="xl">
                    <Building2 className="h-5 w-5" />
                    Log in as Campus A Admin
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Local Campuses Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Local Campuses</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access your campus-specific portal to submit requests and manage certificates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {localCampuses.map((campus, index) => (
              <Card key={campus.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{campus.name}</CardTitle>
                      <p className="text-xs text-gray-500">{campus.location}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-6 min-h-[3rem]">
                    {campus.description}
                  </CardDescription>
                  <Link to={`/${campus.id}`}>
                    <Button variant="campus" className="w-full">
                      Login to {campus.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Public Verification Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-50 to-yellow-100">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="shadow-lg border-yellow-200">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-3xl">Public Certificate Validation</CardTitle>
                <CardDescription className="text-lg">
                  Verify the authenticity of any university certificate instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-8">
                  Upload a certificate file to verify its authenticity and view detailed information about the credential.
                </p>
                <Link to="/verify">
                  <Button variant="certificate" size="xl">
                    <FileCheck className="h-5 w-5" />
                    Verify Certificate
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg">CertVerify</span>
              </div>
              <p className="text-gray-400 text-sm">
                Secure university certificate verification platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>support@cert-verify.com</li>
                <li>+1 (555) 123-4567</li>
                <li>24/7 Technical Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Security</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>ISO 27001 Certified</li>
                <li>256-bit Encryption</li>
                <li>Regular Security Audits</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 University Certificate Verification Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
