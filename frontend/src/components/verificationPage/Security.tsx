import { Network, Shield, Lock, Award, Globe, Database, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const SecuritySection = () => {
  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <div 
        className="p-4 sm:p-6 text-white text-center"
        style={{ backgroundColor: '#0a334a' }}
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Secure & Trusted Verification System</h3>
        <p className="text-sm sm:text-base opacity-90">
          Enterprise-grade security backed by blockchain technology and UK university standards
        </p>
      </div>
      
      <CardContent className="p-4 sm:p-8" style={{ backgroundColor: '#fffefc' }}>
        <div className="text-center mb-6 sm:mb-8">
          <div 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#f68022' }}
          >
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#0a334a' }}>
            Military-Grade Security Architecture
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
            Cardiff Metropolitan University employs cutting-edge blockchain technology, cryptographic hashing, 
            and zero-knowledge verification to ensure the highest levels of security and authenticity for all certificate verifications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="text-center bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-100 hover:shadow-lg transition-all">
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4"
              style={{ backgroundColor: '#0a334a' }}
            >
              <span className="text-white font-bold text-lg sm:text-2xl">₳</span>
            </div>
            <h4 className="font-bold text-base sm:text-lg mb-2" style={{ color: '#0a334a' }}>
              Cardano Blockchain
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Proof-of-stake consensus with peer-reviewed security protocols
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Mathematically Proven</span>
            </div>
          </div>
          
          <div className="text-center bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-100 hover:shadow-lg transition-all">
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4"
              style={{ backgroundColor: '#f68022' }}
            >
              <Network className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h4 className="font-bold text-base sm:text-lg mb-2" style={{ color: '#0a334a' }}>
              FireFly Consortium
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Enterprise-grade multiparty system for educational institutions
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>ISO 27001 Certified</span>
            </div>
          </div>
          
          <div className="text-center bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-100 hover:shadow-lg transition-all sm:col-span-2 lg:col-span-1">
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4"
              style={{ backgroundColor: '#0a334a' }}
            >
              <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h4 className="font-bold text-base sm:text-lg mb-2" style={{ color: '#0a334a' }}>
              Zero Data Retention
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Files automatically deleted after SHA-256 hash verification
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>

        {/* Additional Security Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center border">
            <Database className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" style={{ color: '#f68022' }} />
            <p className="text-xs sm:text-sm font-semibold text-gray-700">256-bit Encryption</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center border">
            <Globe className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" style={{ color: '#f68022' }} />
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Global CDN</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center border">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" style={{ color: '#f68022' }} />
            <p className="text-xs sm:text-sm font-semibold text-gray-700">DDoS Protection</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center border">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" style={{ color: '#f68022' }} />
            <p className="text-xs sm:text-sm font-semibold text-gray-700">SOC 2 Audited</p>
          </div>
        </div>

        {/* UK Authority Section */}
        <div 
          className="rounded-xl p-4 sm:p-6 text-white text-center border-2"
          style={{ backgroundColor: '#0a334a', borderColor: '#f68022' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3">
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#f68022' }}
            >
              <Award className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-lg sm:text-xl mb-1">🇬🇧 Official UK University Authority</h4>
              <p className="text-xs sm:text-sm opacity-90">
                Fully accredited under UK higher education standards
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-xs sm:text-sm font-semibold mb-1">QAA Assured</p>
              <p className="text-xs opacity-75">Quality Assurance Agency</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-xs sm:text-sm font-semibold mb-1">UKVI Approved</p>
              <p className="text-xs opacity-75">Home Office Recognized</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-xs sm:text-sm font-semibold mb-1">Royal Charter</p>
              <p className="text-xs opacity-75">Crown Authority</p>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm opacity-80 mt-4 max-w-2xl mx-auto">
            Cardiff Metropolitan University operates under UK educational regulations and standards. 
            All certificates are issued in compliance with Higher Education and Research Act 2017 
            and recognized by ENIC-NARIC UK for international credential evaluation.
          </p>
        </div>

        {/* Technical Specifications */}
        <div className="mt-6 sm:mt-8 bg-gray-50 rounded-xl p-4 sm:p-6 border">
          <h4 className="font-bold text-base sm:text-lg mb-4 text-center" style={{ color: '#0a334a' }}>
            Technical Security Specifications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <p className="font-semibold text-gray-700 mb-2">Cryptographic Standards:</p>
              <ul className="space-y-1 text-gray-600">
                <li>• SHA-256 hashing algorithm</li>
                <li>• ECDSA digital signatures</li>
                <li>• AES-256 data encryption</li>
                <li>• RSA-4096 key exchange</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Compliance & Auditing:</p>
              <ul className="space-y-1 text-gray-600">
                <li>• SOC 2 Type II certified</li>
                <li>• ISO 27001:2013 compliant</li>
                <li>• GDPR data protection</li>
                <li>• Annual security audits</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SecuritySection;
