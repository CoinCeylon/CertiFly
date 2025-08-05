import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Building2, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from "@/components/ui/badge";

const NetworkVisualizer = () => {
  const networkNodes = [
    {
      id: "cardiff-met",
      name: "Cardiff Met",
      type: "Hub Authority",
      position: { x: 50, y: 20 },
      status: "active",
      role: "Central Certificate Authority",
      connections: ["icbt", "tech-uni", "business-college", "arts-institute"],
      fireFlyNode: "cardiff-hub-01",
      cardanoWallet: "addr1q8x...",
      color: "#0a334a",
      route: "/cardiff-met",
      clickable: true
    },
    {
      id: "icbt",
      name: "ICBT Campus",
      type: "Partner Node",
      position: { x: 15, y: 60 },
      status: "active",
      role: "Student Data Provider",
      connections: ["cardiff-met"],
      fireFlyNode: "icbt-node-01",
      cardanoWallet: "addr1q7y...",
      color: "#f68022",
      route: "/icbt-campus",
      clickable: true
    },
    {
      id: "tech-uni",
      name: "Tech University",
      type: "Partner Node", 
      position: { x: 85, y: 60 },
      status: "active",
      role: "Student Data Provider",
      connections: ["cardiff-met"],
      fireFlyNode: "tech-node-02",
      cardanoWallet: "addr1q6z...",
      color: "#f68022",
      route: "/icbt-campus",
      clickable: true
    },
    {
      id: "business-college",
      name: "Business College",
      type: "Partner Node",
      position: { x: 30, y: 80 },
      status: "active", 
      role: "Student Data Provider",
      connections: ["cardiff-met"],
      fireFlyNode: "biz-node-03",
      cardanoWallet: "addr1q5w...",
      color: "#f68022",
      route: "/icbt-campus",
      clickable: true
    },
    {
      id: "arts-institute", 
      name: "Arts Institute",
      type: "Partner Node",
      position: { x: 70, y: 80 },
      status: "active",
      role: "Student Data Provider", 
      connections: ["cardiff-met"],
      fireFlyNode: "arts-node-04",
      cardanoWallet: "addr1q4v...",
      color: "#f68022",
      route: "/icbt-campus",
      clickable: true
    }
  ];

  const navigate = useNavigate();

  // Navigation function for network nodes
  const handleNodeClick = (nodeId: string) => {
    const routeMap: { [key: string]: string } = {
      "cardiff-met": "/cardiff-met",
      "icbt": "/icbt-campus",
      "tech-uni": "/icbt-campus",
      "business-college": "/icbt-campus",
      "arts-institute": "/icbt-campus"
    };
    
    const route = routeMap[nodeId];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div>
      {/* Network Visualization */}
      <section className="py-8 md:py-12 lg:py-20 px-4" style={{ backgroundColor: '#fffefc' }}>
        <div className="container mx-auto">
          {/* Header - Mobile Responsive */}
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6" style={{ color: '#0a334a' }}>
              Network Node Visualization
            </h2>
            <p className="text-base md:text-xl lg:text-2xl max-w-4xl mx-auto mb-6 md:mb-8 leading-relaxed px-2" style={{ color: '#0a334a', opacity: 0.8 }}>
              Interactive view of the FireFly consortium showing Cardiff Met as the central hub 
              connected to partner universities through secure, private channels
            </p>
            
            {/* Status Indicators - Mobile Stacked */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 text-sm md:text-base">
              <div 
                className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-md border w-full sm:w-auto justify-center"
                style={{ backgroundColor: '#0a334a', borderColor: '#0a334a20' }}
              >
                <span 
                  className="w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse shadow-lg"
                  style={{ backgroundColor: '#f68022' }}
                ></span>
                <span style={{ color: '#fffefc' }} className="font-medium text-xs md:text-sm">
                  Click nodes to access dashboards
                </span>
              </div>
              <div 
                className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-md border w-full sm:w-auto justify-center"
                style={{ backgroundColor: '#f68022', borderColor: '#f6802220' }}
              >
                <span 
                  className="w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse shadow-lg"
                  style={{ backgroundColor: '#fffefc' }}
                ></span>
                <span style={{ color: '#fffefc' }} className="font-medium text-xs md:text-sm">
                  Real-time network status
                </span>
              </div>
            </div>
          </div>

          {/* SVG Network Diagram - Mobile Optimized */}
          <div 
            className="rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-16 mb-8 md:mb-12 lg:mb-16 shadow-2xl border overflow-hidden"
            style={{ 
              background: `linear-gradient(to bottom right, #fffefc, #f6802205, #0a334a05)`,
              borderColor: '#0a334a20'
            }}
          >
         <div className="relative w-full mx-auto max-w-7xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[52rem]">

              <svg className="w-full h-full drop-shadow-lg" viewBox="0 0 500 550">
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#0a334a" strokeWidth="1" opacity="0.1"/>
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:"#f68022", stopOpacity:0.3}} />
                    <stop offset="50%" style={{stopColor:"#f68022", stopOpacity:0.8}} />
                    <stop offset="100%" style={{stopColor:"#f68022", stopOpacity:0.3}} />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Network Connections */}
                {networkNodes.map(node => {
                  if (node.id === "cardiff-met") {
                    return node.connections.map(targetId => {
                      const targetNode = networkNodes.find(n => n.id === targetId);
                      if (!targetNode) return null;
                      
                      const x1 = (node.position.x / 100) * 500;
                      const y1 = (node.position.y / 100) * 550;
                      const x2 = (targetNode.position.x / 100) * 500;
                      const y2 = (targetNode.position.y / 100) * 550;
                      
                      return (
                        <g key={`${node.id}-${targetId}`}>
                          {/* Connection shadow */}
                          <line 
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="#0a334a" 
                            strokeWidth="6" 
                            opacity="0.1"
                          />
                          {/* Main connection line */}
                          <line 
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="url(#connectionGradient)" 
                            strokeWidth="4" 
                            strokeDasharray="8,4"
                            opacity="0.8"
                            filter="url(#glow)"
                          >
                            <animate attributeName="stroke-dashoffset" values="0;12" dur="3s" repeatCount="indefinite"/>
                          </line>
                          {/* Connection label with background */}
                          <circle
                            cx={(x1 + x2) / 2}
                            cy={(y1 + y2) / 2 - 2}
                            r="20"
                            fill="#fffefc"
                            stroke="#f68022"
                            strokeWidth="2"
                            opacity="0.95"
                            className="drop-shadow-sm"
                          />
                          <text 
                            x={(x1 + x2) / 2} 
                            y={(y1 + y2) / 2 + 2}
                            textAnchor="middle" 
                            fontSize="11" 
                            fill="#f68022" 
                            fontWeight="600"
                            className="drop-shadow-sm"
                          >
                            FireFly
                          </text>
                        </g>
                      );
                    });
                  }
                  return null;
                })}

                {/* Network Nodes */}
                {networkNodes.map(node => {
                  const x = (node.position.x / 100) * 500;
                  const y = (node.position.y / 100) * 550;
                  const isHub = node.type === "Hub Authority";
                  
                  return (
                    <g key={node.id}>
                      {/* Node shadow */}
                      <circle
                        cx={x + 3}
                        cy={y + 3}
                        r={isHub ? 35 : 26}
                        fill="#0a334a"
                        opacity="0.2"
                      />
                      
                      {/* Node labels - Mobile responsive font sizes */}
                      {isHub ? (
                        <text 
                          x={x} 
                          y={y - 50} 
                          textAnchor="middle" 
                          fontSize="14" 
                          fontWeight="700" 
                          fill="#0a334a"
                          className="drop-shadow-sm"
                        >
                          Cardiff Metropolitan University
                        </text>
                      ) : (
                        <text 
                          x={x} 
                          y={y + 50} 
                          textAnchor="middle" 
                          fontSize="12" 
                          fontWeight="600" 
                          fill="#0a334a"
                          className="drop-shadow-sm"
                        >
                          {node.name}
                        </text>
                      )}
                      
                      {/* Clickable Node Group */}
                      <g 
                        onClick={() => handleNodeClick(node.id)}
                        style={{ cursor: node.clickable ? 'pointer' : 'default' }}
                      >
                        {/* Outer ring for hub */}
                        {isHub && (
                          <circle
                            cx={x}
                            cy={y}
                            r={42}
                            fill="none"
                            stroke="#0a334a"
                            strokeWidth="3"
                            strokeDasharray="6,3"
                            opacity="0.6"
                          >
                            <animateTransform
                              attributeName="transform"
                              attributeType="XML"
                              type="rotate"
                              from="0 250 275"
                              to="360 250 275"
                              dur="20s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                        
                        {/* Node Circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isHub ? 32 : 24}
                          fill={node.color}
                          stroke="#fffefc"
                          strokeWidth="4"
                          className="drop-shadow-2xl"
                          filter="url(#glow)"
                        >
                          {node.status === "active" && (
                            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
                          )}
                        </circle>
                        
                        {/* Node Icon */}
                        <text x={x} y={y + 6} textAnchor="middle" fontSize={isHub ? "18" : "16"} fill="#fffefc" style={{ pointerEvents: 'none' }}>
                          {isHub ? "🏛️" : "🎓"}
                        </text>
                        
                        {/* Role indicator */}
                        <text 
                          x={x} 
                          y={isHub ? y - 70 : y + 70} 
                          textAnchor="middle" 
                          fontSize="10" 
                          fontWeight="500" 
                          fill="#0a334a"
                          opacity="0.8"
                          style={{ pointerEvents: 'none' }}
                        >
                          {node.role}
                        </text>
                      </g>
                      
                      {/* Enhanced Status Indicator */}
                      <circle
                        cx={x + (isHub ? 24 : 18)}
                        cy={y - (isHub ? 24 : 18)}
                        r="6"
                        fill={node.status === "active" ? "#10b981" : "#ef4444"}
                        stroke="#fffefc"
                        strokeWidth="2"
                        style={{ pointerEvents: 'none' }}
                        className="drop-shadow-lg"
                      >
                        {node.status === "active" && (
                          <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite"/>
                        )}
                      </circle>
                      
                      {/* Click indicator */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHub ? 38 : 30}
                        fill="none"
                        stroke="#f68022"
                        strokeWidth="2"
                        opacity="0"
                        style={{ pointerEvents: 'none' }}
                      >
                        <animate attributeName="opacity" values="0;0.6;0" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="r" values={isHub ? "32;45;32" : "24;37;24"} dur="2s" repeatCount="indefinite"/>
                      </circle>
                    </g>
                  );
                })}
              </svg>
              
              {/* Network Stats Overlay - Mobile Responsive */}
              <div 
                className="absolute top-2 hidden sm:block left-2 md:top-6 md:left-6 backdrop-blur-sm rounded-lg md:rounded-2xl p-2 md:p-4 shadow-lg border max-w-[calc(100vw-2rem)] md:max-w-none"
                style={{ backgroundColor: '#fffefc90', borderColor: '#0a334a20' }}
              >
                <h3 className="text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ color: '#0a334a' }}>
                  Network Status
                </h3>
                <div className="space-y-1 md:space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span style={{ color: '#0a334a' }}>5 Active Nodes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#f68022' }}
                    ></div>
                    <span style={{ color: '#0a334a' }}>4 FireFly Connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#0a334a' }}
                    ></div>
                    <span style={{ color: '#0a334a' }}>Cardano Mainnet</span>
                  </div>
                </div>
              </div>

              {/* Legend - Mobile Responsive */}
              <div 
                className="absolute bottom-2 hidden lg:block right-2 md:bottom-6 md:right-6 backdrop-blur-sm rounded-lg md:rounded-2xl p-2 md:p-4 shadow-lg border max-w-[calc(100vw-2rem)] md:max-w-none"
                style={{ backgroundColor: '#fffefc90', borderColor: '#0a334a20' }}
              >
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-3" style={{ color: '#0a334a' }}>
                  Legend
                </h3>
                <div className="space-y-1 md:space-y-2 text-xs">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div 
                      className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: '#0a334a' }}
                    >
                      🏛️
                    </div>
                    <span style={{ color: '#0a334a' }}>Hub Authority</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div 
                      className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: '#f68022' }}
                    >
                      🎓
                    </div>
                    <span style={{ color: '#0a334a' }}>Partner Node</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div 
                      className="w-5 h-1 md:w-6 md:h-1 rounded"
                      style={{ background: 'linear-gradient(to right, #f68022, #f68022)' }}
                    ></div>
                    <span style={{ color: '#0a334a' }}>FireFly Connection</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span style={{ color: '#0a334a' }}>Active Status</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Node Details Cards - Mobile Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {networkNodes.map(node => (
              <Card 
                key={node.id} 
                className={`${node.type === "Hub Authority" ? "sm:col-span-2 lg:col-span-1" : ""} shadow-lg hover:shadow-xl transition-shadow border`}
                style={{ backgroundColor: '#fffefc', borderColor: '#0a334a20' }}
              >
                <CardHeader className="pb-2 md:pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: node.type === "Hub Authority" ? '#0a334a10' : '#f6802210' 
                      }}
                    >
                      <Building2 
                        className="h-5 w-5 md:h-6 md:w-6"
                        style={{ color: node.type === "Hub Authority" ? '#0a334a' : '#f68022' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base md:text-lg flex items-center gap-2" style={{ color: '#0a334a' }}>
                        <span className="truncate">{node.name}</span>
                        {node.type === "Hub Authority" && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{ backgroundColor: '#0a334a', color: '#fffefc' }}
                          >
                            Hub
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-xs md:text-sm truncate" style={{ color: '#0a334a', opacity: 0.7 }}>
                        {node.role}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      node.status === "active" ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}></div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 text-sm">
                    <div 
                      className="rounded-lg p-3"
                      style={{ backgroundColor: '#0a334a05' }}
                    >
                      <h4 className="font-semibold mb-2 text-sm" style={{ color: '#0a334a' }}>
                        FireFly Configuration
                      </h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span style={{ color: '#0a334a', opacity: 0.7 }}>Node ID:</span>
                          <span className="font-mono text-xs truncate ml-2" style={{ color: '#0a334a' }}>
                            {node.fireFlyNode}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span style={{ color: '#0a334a', opacity: 0.7 }}>Connections:</span>
                          <span style={{ color: '#f68022' }}>{node.connections.length} active</span>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className="rounded-lg p-3"
                      style={{ backgroundColor: '#f6802205' }}
                    >
                      <h4 className="font-semibold mb-2 text-sm" style={{ color: '#0a334a' }}>
                        Cardano Integration
                      </h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span style={{ color: '#0a334a', opacity: 0.7 }}>Wallet:</span>
                          <span className="font-mono text-xs truncate ml-2" style={{ color: '#f68022' }}>
                            {node.cardanoWallet}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span style={{ color: '#0a334a', opacity: 0.7 }}>API:</span>
                          <span style={{ color: '#f68022' }}>Blockfrost</span>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Access Button - Full width on mobile */}
                    <div className="pt-2">
                      <Button 
                        onClick={() => handleNodeClick(node.id)}
                        className="w-full text-white text-xs md:text-sm"
                        style={{ 
                          backgroundColor: node.type === "Hub Authority" ? '#0a334a' : '#f68022'
                        }}
                        size="sm"
                      >
                        <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        Access {node.name} Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default NetworkVisualizer
