// components/AnalyticsTab.tsx
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Award,
  Activity
} from "lucide-react";
import { Certificate, EnhancedStats } from "../ICBTDashboard";

interface AnalyticsTabProps {
  certificates: Certificate[];
  enhancedStats: EnhancedStats;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ certificates, enhancedStats }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate additional analytics
  const analytics = useMemo(() => {
    const totalCertificatesIssued = certificates.reduce((sum, cert) => 
      sum + (cert.certificatesReceived || 0), 0
    );
    
    const completionRate = enhancedStats.totalBatches > 0 
      ? (enhancedStats.completed / enhancedStats.totalBatches) * 100 
      : 0;

    const averageStudentsPerBatch = enhancedStats.totalBatches > 0 
      ? Math.round(enhancedStats.totalStudents / enhancedStats.totalBatches)
      : 0;

    // Monthly data simulation
    const monthlyData = [
      { month: 'Oct', batches: 8, students: 180, completion: 85 },
      { month: 'Nov', batches: 12, students: 250, completion: 92 },
      { month: 'Dec', batches: 6, students: 120, completion: 88 },
      { month: 'Jan', batches: enhancedStats.totalBatches, students: enhancedStats.totalStudents, completion: Math.round(completionRate) }
    ];

    // Faculty distribution
    const facultyDistribution = certificates.reduce((acc, cert) => {
      const faculty = cert.batchDetails?.faculty || 'Unknown';
      acc[faculty] = (acc[faculty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCertificatesIssued,
      completionRate,
      averageStudentsPerBatch,
      monthlyData,
      facultyDistribution
    };
  }, [certificates, enhancedStats]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-yellow-600';
      case 'partially_completed': return 'text-orange-600';
      case 'submitted': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'partially_completed': return 'bg-orange-500';
      case 'submitted': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-[#0a334a]/10 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-[#0a334a]">
                  {analytics.completionRate.toFixed(1)}%
                </p>
                <Progress 
                  value={analytics.completionRate} 
                  className="mt-2 h-2" 
                />
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#f68022]/10 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates Issued</p>
                <p className="text-2xl font-bold text-[#f68022]">
                  {analytics.totalCertificatesIssued}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {enhancedStats.totalStudents - analytics.totalCertificatesIssued} pending
                </p>
              </div>
              <div className="w-12 h-12 bg-[#f68022]/10 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-[#f68022]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Students/Batch</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.averageStudentsPerBatch}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Across {enhancedStats.totalBatches} batches
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Time</p>
                <p className="text-2xl font-bold text-purple-600">
                  {enhancedStats.averageProcessingTime}
                </p>
                <p className="text-xs text-gray-500 mt-1">Average duration</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Statistics */}
        <Card className="border-2 border-[#0a334a]/10 shadow-lg">
          <CardHeader className="border-b border-[#0a334a]/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0a334a]/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-[#0a334a]" />
              </div>
              <CardTitle className="text-[#0a334a]">Batch Status Breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { label: 'Completed', value: enhancedStats.completed, total: enhancedStats.totalBatches, color: 'green' },
                { label: 'Partially Completed', value: enhancedStats.partiallyCompleted, total: enhancedStats.totalBatches, color: 'orange' },
                { label: 'Processing', value: enhancedStats.processing, total: enhancedStats.totalBatches, color: 'yellow' },
                { label: 'Submitted Only', value: enhancedStats.submitted, total: enhancedStats.totalBatches, color: 'blue' }
              ].map((item) => {
                const percentage = enhancedStats.totalBatches > 0 ? (item.value / item.total) * 100 : 0;
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{item.value}</span>
                        <Badge variant="secondary" className="text-xs">
                          {percentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Faculty Distribution */}
        <Card className="border-2 border-[#f68022]/10 shadow-lg">
          <CardHeader className="border-b border-[#f68022]/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#f68022]/10 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-[#f68022]" />
              </div>
              <CardTitle className="text-[#0a334a]">Faculty Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Object.entries(analytics.facultyDistribution).map(([faculty, count]) => {
                const percentage = enhancedStats.totalBatches > 0 ? (count / enhancedStats.totalBatches) * 100 : 0;
                return (
                  <div key={faculty} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#f68022] rounded-full"></div>
                      <span className="font-medium">{faculty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{count}</span>
                      <Badge variant="outline" className="text-xs">
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card className="border-2 border-[#0a334a]/10 shadow-lg">
        <CardHeader className="border-b border-[#0a334a]/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0a334a]/10 rounded-lg flex items-center justify-center">
              <Activity className="h-4 w-4 text-[#0a334a]" />
            </div>
            <CardTitle className="text-[#0a334a]">Recent Batch Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {certificates.slice(0, 8).map((cert, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-all duration-200">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${getStatusBg(cert.status)}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-[#0a334a] truncate">{cert.batchName}</h3>
                      <Badge variant="outline" className="text-xs">
                        {cert.batchDetails?.faculty || 'N/A'}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatDate(cert.receivedAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{cert.certificatesReceived || 0}</span> of{' '}
                      <span className="font-medium">{cert.originalStudentsCount || cert.studentsCount}</span> certificates received
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${getStatusColor(cert.status)}`}>
                        {cert.status?.replace('_', ' ').toUpperCase()}
                      </span>
                      {cert.progressPercentage !== undefined && (
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#f68022] transition-all duration-300" 
                              style={{ width: `${cert.progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8 text-right">
                            {cert.progressPercentage}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {certificates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-500">Submit your first batch to see analytics here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
