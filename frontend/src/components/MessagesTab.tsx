// components/MessagesTab.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  MailOpen, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  Filter,
  Archive,
  Trash2,
  RefreshCw,
  MessageSquare
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'submission' | 'certificate' | 'notification' | 'system';
  attachments?: number;
}

const MessagesTab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "1",
        sender: "Cardiff Metropolitan University",
        subject: "Batch Processing Complete - CS2024-SEM1",
        preview: "Your submitted batch CS2024-SEM1 has been successfully processed. All 25 certificates are ready for distribution.",
        timestamp: "2024-01-15T10:30:00Z",
        read: false,
        priority: "high",
        category: "certificate",
        attachments: 1
      },
      {
        id: "2",
        sender: "System Administrator",
        subject: "Scheduled Maintenance Notification",
        preview: "The certificate submission system will undergo scheduled maintenance on January 20th from 2:00 AM to 4:00 AM GMT.",
        timestamp: "2024-01-14T16:45:00Z",
        read: true,
        priority: "medium",
        category: "system"
      },
      {
        id: "3",
        sender: "Cardiff Met Academic Registry",
        subject: "New Submission Guidelines Available",
        preview: "Updated guidelines for batch submissions are now available. Please review the new requirements before your next submission.",
        timestamp: "2024-01-12T09:15:00Z",
        read: false,
        priority: "medium",
        category: "notification",
        attachments: 2
      },
      {
        id: "4",
        sender: "Cardiff Metropolitan University",
        subject: "Certificate Quality Check Failed - ENG2024-SEM1",
        preview: "Some certificates in batch ENG2024-SEM1 require resubmission due to formatting issues. Please check the detailed report.",
        timestamp: "2024-01-10T14:20:00Z",
        read: true,
        priority: "high",
        category: "submission"
      },
      {
        id: "5",
        sender: "Cardiff Met IT Support",
        subject: "API Rate Limits Updated",
        preview: "We've increased the API rate limits for certificate submissions to improve your experience.",
        timestamp: "2024-01-08T11:00:00Z",
        read: true,
        priority: "low",
        category: "system"
      }
    ];
    setMessages(mockMessages);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'certificate': return CheckCircle2;
      case 'submission': return AlertCircle;
      case 'notification': return MessageSquare;
      case 'system': return Clock;
      default: return Mail;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "unread" && !message.read) ||
                         (selectedFilter === "priority" && message.priority === "high") ||
                         message.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card className="border-2 border-[#0a334a]/10 shadow-lg">
        <CardHeader className="border-b border-[#0a334a]/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0a334a]/10 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-[#0a334a]" />
              </div>
              <div>
                <CardTitle className="text-[#0a334a]">Messages & Notifications</CardTitle>
                <p className="text-sm text-gray-600">
                  {unreadCount} unread messages
                </p>
              </div>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              size="sm"
              className="border-[#0a334a]/20 text-[#0a334a] hover:bg-[#0a334a]/5"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline ml-2">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#0a334a]/20 focus:border-[#f68022] focus:ring-[#f68022]/20"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'unread', 'priority', 'certificate', 'submission', 'notification', 'system'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={selectedFilter === filter 
                    ? "bg-[#f68022] hover:bg-[#e5721f] text-white"
                    : "border-[#0a334a]/20 text-[#0a334a] hover:bg-[#0a334a]/5"
                  }
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-3">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => {
                const CategoryIcon = getCategoryIcon(message.category);
                return (
                  <Card 
                    key={message.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 ${
                      message.read 
                        ? 'border-l-gray-200 bg-white' 
                        : 'border-l-[#f68022] bg-[#f68022]/5 shadow-sm'
                    }`}
                    onClick={() => markAsRead(message.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            message.read ? 'bg-gray-100' : 'bg-[#f68022]/10'
                          }`}>
                            {message.read ? (
                              <MailOpen className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Mail className="h-4 w-4 text-[#f68022]" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CategoryIcon className="h-4 w-4 text-[#0a334a]" />
                            <span className="font-medium text-[#0a334a] truncate">
                              {message.sender}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(message.priority)}`}
                            >
                              {message.priority}
                            </Badge>
                            {message.attachments && (
                              <Badge variant="secondary" className="text-xs">
                                {message.attachments} attachment{message.attachments > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className={`text-sm mb-1 ${
                            message.read ? 'font-medium text-gray-900' : 'font-semibold text-[#0a334a]'
                          }`}>
                            {message.subject}
                          </h3>
                          
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {message.preview}
                          </p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-500">
                              {formatDate(message.timestamp)}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Archive className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-700">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'You\'re all caught up!'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesTab;
