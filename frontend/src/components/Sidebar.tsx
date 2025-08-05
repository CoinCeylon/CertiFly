// components/Sidebar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Building2, Home, Send, Mail, Award, Bell, LogOut, X 
} from "lucide-react";

interface SidebarProps {
  onNewBatch: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewBatch, isOpen, onClose }) => {
  return (
    <>
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-[#0a334a] text-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden p-4 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-[#f68022] to-orange-400 rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">ICBT Campus</h1>
              <p className="text-sm text-white/70">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 bg-[#f68022]/20 text-white hover:bg-[#f68022]/30 border-l-4 border-[#f68022]"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              onClick={() => {
                onNewBatch();
                onClose();
              }}
            >
              <Send className="h-4 w-4" />
              Submit Batch
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              Messages
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Award className="h-4 w-4" />
              Certificates
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Link to="/">
            <Button 
              variant="outline" 
              className="w-full gap-2 bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
