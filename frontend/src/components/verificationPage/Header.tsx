import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Building2, Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header 
      className="border-b shadow-lg sticky top-0 z-50"
      style={{ backgroundColor: '#fffefc', borderBottomColor: '#0a334a' }}
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between py-2 sm:py-0">
          {/* Logo and University Name */}
          <Link to="/" className="flex items-center gap-1 sm:gap-2 md:gap-4 min-w-0 flex-1">
            {/* CertiFly Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/images/certifly-logo.png" 
                alt="CertiFly Logo" 
                className="w-[60px] h-[42px] sm:w-[80px] sm:h-[56px] md:w-[100px] md:h-[70px] object-contain"
              />
            </div>
            
            {/* University Information */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-col">
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold truncate leading-tight" style={{ color: '#0a334a' }}>
                  Cardiff Metropolitan University
                </h1>
                <div className="flex flex-col xs:flex-row xs:items-center xs:gap-2 sm:gap-3">
                  <p className="text-xs sm:text-sm font-semibold leading-tight" style={{ color: '#f68022' }}>
                    Certificate Verification Portal
                  </p>
                  <div className="hidden xs:block w-px h-3 bg-gray-300"></div>
                  <p className="text-xs text-gray-600 hidden xs:block">
                    Powered by CertiFly
                  </p>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Right Side - Actions Only */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Status Indicator - Only on larger screens */}
            <div className="hidden xl:flex items-center gap-3 text-sm mr-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-600">System Online</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" style={{ color: '#f68022' }} />
                <span className="font-semibold" style={{ color: '#f68022' }}>Secure</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile Menu Button */}
              <Button 
                variant="outline" 
                size="sm"
                className="sm:hidden border-2 text-white h-8 w-8 p-1"
                style={{ backgroundColor: '#0a334a', borderColor: '#0a334a' }}
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              {/* Back to Network Button - Desktop */}
              <Link to="/" className="hidden lg:block">
                <Button 
                  variant="outline" 
                  className="shadow-lg border-2 hover:shadow-xl transition-all text-white px-4"
                  style={{ 
                    backgroundColor: '#f68022', 
                    borderColor: '#f68022',
                  }}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Back to Network
                </Button>
              </Link>
              
              {/* Back to Network Button - Tablet */}
              <Link to="/" className="hidden sm:block lg:hidden">
                <Button 
                  variant="outline" 
                  className="shadow-lg border-2 hover:shadow-xl transition-all text-white px-3"
                  style={{ 
                    backgroundColor: '#f68022', 
                    borderColor: '#f68022',
                  }}
                >
                  <Building2 className="h-4 w-4 mr-1" />
                  Network
                </Button>
              </Link>
              
              {/* Mobile Back Button */}
              <Link to="/" className="sm:hidden">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-2 text-white h-8 w-8 p-1"
                  style={{ 
                    backgroundColor: '#f68022', 
                    borderColor: '#f68022',
                  }}
                >
                  <Building2 className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Status Bar */}
        <div className="flex sm:hidden items-center justify-center gap-3 py-2 border-t border-gray-200">
          <div className="flex items-center gap-1 text-xs">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-green-600">Online</span>
          </div>
          <div className="w-px h-3 bg-gray-300"></div>
          <div className="flex items-center gap-1 text-xs">
            <Shield className="h-3 w-3" style={{ color: '#f68022' }} />
            <span className="font-semibold" style={{ color: '#f68022' }}>Secured</span>
          </div>
          <div className="w-px h-3 bg-gray-300"></div>
          <div className="flex items-center gap-1 text-xs">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0a334a' }}></div>
            <span className="font-semibold" style={{ color: '#0a334a' }}>Verified</span>
          </div>
        </div>
        
        {/* Tablet Status Bar */}
        <div className="hidden sm:flex lg:hidden items-center justify-center gap-4 py-2 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-green-600">System Online</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4" style={{ color: '#f68022' }} />
            <span className="font-semibold" style={{ color: '#f68022' }}>Blockchain Secured</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
