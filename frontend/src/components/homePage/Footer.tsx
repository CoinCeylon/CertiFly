import React from 'react'

const Footer = () => {
  return (
    <div>
   {/* Professional Footer */}
<footer className="py-12 sm:py-16" style={{ backgroundColor: '#0a334a' }}>
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <img 
            src="/images/certifly-banner.png" 
            alt="CertiFly Logo" 
            className="h-10 w-[80px] rounded-lg"
            
          />
          <div>
            <div className="font-bold text-xl" style={{ color: '#fffefc' }}>CertiFly Network</div>
            <div className="text-sm" style={{ color: '#fffefc', opacity: 0.7 }}>Seamless, Secure, Certified</div>
          </div>
        </div>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: '#fffefc', opacity: 0.8 }}>
          Cardiff Metropolitan University's production blockchain network for global academic 
          credential verification. CertiFly combines Hyperledger FireFly's enterprise-grade private 
          consortium with Cardano's public blockchain infrastructure for secure, 
          privacy-preserving international education credential management.
        </p>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f68022' }}></div>
                    <span style={{ color: '#fffefc', opacity: 0.8 }}>Cardano Mainnet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#f68022' }}></div>
                    <span style={{ color: '#fffefc', opacity: 0.8 }}>FireFly Consortium</span>
                  </div>
                </div>
                <div className="text-xs" style={{ color: '#fffefc', opacity: 0.6 }}>
                  Network Status: ✅ All systems operational | SLA: 99.97% uptime
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#f68022' }}>Blockchain Infrastructure</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#fffefc', opacity: 0.8 }}>
                <li>• Cardano Public Verification</li>
                <li>• Ouroboros Proof-of-Stake</li>
                <li>• Smart Contract Security</li>
                <li>• IPFS Document Storage</li>
                <li>• Multi-signature Governance</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#f68022' }}>Enterprise Features</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#fffefc', opacity: 0.8 }}>
                <li>• Hyperledger FireFly Stack</li>
                <li>• GDPR-Compliant Privacy</li>
                <li>• Multi-party Coordination</li>
                <li>• Real-time Event Streaming</li>
                <li>• Enterprise-grade APIs</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8" style={{ borderColor: 'rgba(246, 128, 34, 0.2)' }}>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="text-sm text-center lg:text-left" style={{ color: '#fffefc', opacity: 0.7 }}>
                <p>&copy; 2024 Cardiff Metropolitan University - Global Certificate Verification Network</p>
                <p className="text-xs mt-1">
                  Production system powered by Cardano blockchain and Hyperledger FireFly | 
                  HEFCE approved | ISO 27001 certified
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: '#fffefc', opacity: 0.5 }}>
                <span>Network ID: CMU-CERT-NET-2024</span>
                <span>•</span>
                <span>Version 2.1.0</span>
                <span>•</span>
                <span>Build 20241201</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
</div>
  )
}

export default Footer
