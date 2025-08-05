// components/Header.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Calendar } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  onNewBatch: () => void;
  loading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, onNewBatch, loading }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#0a334a]/70">
            <Calendar className="h-4 w-4" />
            {currentDate}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0a334a] leading-tight">
            Certificate Management Dashboard
          </h1>
          <p className="text-[#0a334a]/70 text-sm lg:text-base">
            Manage student batches and track certificate submissions to Cardiff Metropolitan University
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={loading}
            className="border-[#0a334a]/20 text-[#0a334a] hover:bg-[#0a334a]/5 hover:border-[#0a334a]/40"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline ml-2">Refresh</span>
          </Button>
          <Button 
            onClick={onNewBatch} 
            className="bg-[#f68022] hover:bg-[#e5721f] text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">New Batch</span>
          </Button>
        </div>
      </div>
      
      {/* Decorative gradient line */}
      <div className="mt-6 h-1 bg-gradient-to-r from-[#0a334a] via-[#f68022] to-[#0a334a] rounded-full opacity-20"></div>
    </div>
  );
};

export default Header;
