import { Award, Building2, Globe, Shield, Users, Clock, CheckCircle2 } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="text-center mb-8 sm:mb-12">
      {/* Hero Icon */}
      <div 
        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl"
        style={{ backgroundColor: '#f68022' }}
      >
        <Award className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
      </div>
      
      {/* Main Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
        Official Certificate
        <span className="block mt-1 sm:mt-2" style={{ color: '#f68022' }}>
          Verification Portal
        </span>
      </h1>
      
      {/* Subtitle */}
      <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto mb-6 sm:mb-8 px-4 leading-relaxed">
        Cardiff Metropolitan University's secure blockchain-powered verification system. 
        Instantly authenticate any Cardiff Met degree, diploma, or certificate issued since 2020 
        with military-grade cryptographic security.
      </p>
      
      {/* University Credentials Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm mb-6 sm:mb-8 px-4">
        <div 
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full shadow-lg border-2 transition-all hover:shadow-xl"
          style={{ backgroundColor: '#fffefc', borderColor: '#0a334a' }}
        >
          <Building2 className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#0a334a' }} />
          <span className="font-semibold" style={{ color: '#0a334a' }}>UK University</span>
        </div>
        
        <div 
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full shadow-lg border-2 transition-all hover:shadow-xl"
          style={{ backgroundColor: '#fffefc', borderColor: '#f68022' }}
        >
          <Shield className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#f68022' }} />
          <span className="font-semibold" style={{ color: '#f68022' }}>Blockchain Secured</span>
        </div>
        
        <div 
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full shadow-lg border-2 transition-all hover:shadow-xl"
          style={{ backgroundColor: '#fffefc', borderColor: '#0a334a' }}
        >
          <Globe className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#0a334a' }} />
          <span className="font-semibold" style={{ color: '#0a334a' }}>Globally Recognized</span>
        </div>
        
        <div 
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full shadow-lg border-2 transition-all hover:shadow-xl"
          style={{ backgroundColor: '#fffefc', borderColor: '#f68022' }}
        >
          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#f68022' }} />
          <span className="font-semibold" style={{ color: '#f68022' }}>QAA Approved</span>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="max-w-5xl mx-auto px-4">
        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#0a334a' }}>
          Trusted Verification Platform
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div 
            className="text-center p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg border-2 hover:shadow-xl transition-all"
            style={{ backgroundColor: '#fffefc', borderColor: '#f68022' }}
          >
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2" style={{ color: '#f68022' }}>
              2,847+
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-600">
              Certificates Verified
            </div>
          </div>
          
          <div 
            className="text-center p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg border-2 hover:shadow-xl transition-all"
            style={{ backgroundColor: '#fffefc', borderColor: '#0a334a' }}
          >
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2" style={{ color: '#0a334a' }}>
              99.98%
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-600">
              Accuracy Rate
            </div>
          </div>
          
          <div 
            className="text-center p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg border-2 hover:shadow-xl transition-all"
            style={{ backgroundColor: '#fffefc', borderColor: '#f68022' }}
          >
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2" style={{ color: '#f68022' }}>
              &lt;1.2s
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-600">
              Avg Response Time
            </div>
          </div>
          
          <div 
            className="text-center p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg border-2 hover:shadow-xl transition-all"
            style={{ backgroundColor: '#fffefc', borderColor: '#0a334a' }}
          >
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2" style={{ color: '#0a334a' }}>
              24/7
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-600">
              System Uptime
            </div>
          </div>
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Trusted by 50+ employers</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Available 24/7</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
