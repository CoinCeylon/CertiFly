// components/StatsCards.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, CheckCircle2, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { EnhancedStats } from "../ICBTDashboard";

interface StatsCardsProps {
  stats: EnhancedStats;
  loading?: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  const dashboardStats = [
    { 
      title: "Total Batches", 
      value: stats.totalBatches.toString(), 
      icon: FileText, 
      change: "+5",
      changeType: "positive",
      description: `${stats.completed} completed`,
      color: "text-[#0a334a]",
      bgColor: "bg-[#0a334a]/10",
      borderColor: "border-[#0a334a]/20"
    },
    { 
      title: "Total Students", 
      value: stats.totalStudents.toString(), 
      icon: Users, 
      change: "+12",
      changeType: "positive",
      description: `${stats.totalCertificatesReceived} certificates received`,
      color: "text-[#f68022]",
      bgColor: "bg-[#f68022]/10",
      borderColor: "border-[#f68022]/20"
    },
    { 
      title: "Success Rate", 
      value: stats.totalBatches > 0 
        ? `${Math.round((stats.completed / stats.totalBatches) * 100)}%`
        : "0%", 
      icon: CheckCircle2, 
      change: "+2%",
      changeType: "positive",
      description: "Completion rate",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    { 
      title: "Avg Processing", 
      value: stats.averageProcessingTime, 
      icon: Clock, 
      change: "-1h",
      changeType: "positive",
      description: "Processing time",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      {dashboardStats.map((stat) => (
        <Card 
          key={stat.title} 
          className={`shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${stat.borderColor} bg-white/80 backdrop-blur-sm`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-inner`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
