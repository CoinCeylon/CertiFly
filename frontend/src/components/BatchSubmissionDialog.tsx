// components/BatchSubmissionDialog.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  Users, 
  Check,
  Info
} from "lucide-react";
import { BatchMetadata, Student, BatchSubmission } from "../ICBTDashboard";
import BatchSetupStep from "./steps/BatchSetupStep";
import StudentEntryStep from "./steps/StudentEntryStep";
import ReviewStep from "./steps/ReviewStep";

interface BatchSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmissionSuccess: (batchName: string) => void;
  apiBaseUrl: string;
}

type StepType = 'setup' | 'students' | 'review';

const STEPS = [
  { id: 'setup', title: 'Batch Setup', icon: FileText, description: 'Configure batch information' },
  { id: 'students', title: 'Add Students', icon: Users, description: 'Enter student details' },
  { id: 'review', title: 'Review & Submit', icon: Check, description: 'Verify and submit' }
];

const BatchSubmissionDialog: React.FC<BatchSubmissionDialogProps> = ({
  open,
  onOpenChange,
  onSubmissionSuccess,
  apiBaseUrl
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepType>('setup');
  
  const [batchMetadata, setBatchMetadata] = useState<BatchMetadata>({
    batch_name: '',
    batch_description: '',
    academic_year: new Date().getFullYear().toString(),
    semester: '',
    graduation_ceremony_date: '',
    faculty: '',
    program_type: 'undergraduate',
    submission_deadline: '',
    contact_person: '',
    contact_email: '',
    notes: ''
  });
  
  const [students, setStudents] = useState<Student[]>([]);

  const getCurrentStepIndex = () => STEPS.findIndex(step => step.id === currentStep);
  const progressPercentage = ((getCurrentStepIndex() + 1) / STEPS.length) * 100;

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'setup':
        if (!batchMetadata.batch_name || !batchMetadata.academic_year || 
            !batchMetadata.semester || !batchMetadata.faculty ||
            !batchMetadata.contact_person || !batchMetadata.contact_email) {
          toast({
            title: "Incomplete Information",
            description: "Please fill in all required fields marked with *",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 'students':
        if (students.length === 0) {
          toast({
            title: "No Students Added",
            description: "Please add at least one student to continue.",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id as StepType);
    }
  };

  const prevStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id as StepType);
    }
  };

  const submitBatch = async () => {
    if (!validateCurrentStep()) return;

    try {
      setLoading(true);
      const batchSubmission: BatchSubmission = {
        metadata: batchMetadata,
        students: students
      };

      const response = await fetch(`${apiBaseUrl}/api/icbt/submit-batch-with-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchSubmission),
      });

      const data = await response.json();
      
      if (data.success) {
        onSubmissionSuccess(data.batchName);
        resetForm();
        onOpenChange(false);
      } else {
        toast({
          title: "Submission Failed",
          description: data.message || 'Failed to submit batch to Cardiff Met',
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: 'Failed to connect to server. Please try again.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep('setup');
    setStudents([]);
    setBatchMetadata({
      batch_name: '',
      batch_description: '',
      academic_year: new Date().getFullYear().toString(),
      semester: '',
      graduation_ceremony_date: '',
      faculty: '',
      program_type: 'undergraduate',
      submission_deadline: '',
      contact_person: '',
      contact_email: '',
      notes: ''
    });
  };

  const handleDialogClose = () => {
    if (students.length > 0 || batchMetadata.batch_name) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        resetForm();
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'setup':
        return (
          <BatchSetupStep 
            batchMetadata={batchMetadata}
            setBatchMetadata={setBatchMetadata}
          />
        );
      case 'students':
        return (
          <StudentEntryStep 
            students={students}
            setStudents={setStudents}
            batchMetadata={batchMetadata}
          />
        );
      case 'review':
        return (
          <ReviewStep 
            batchMetadata={batchMetadata}
            students={students}
            onEdit={(step) => setCurrentStep(step)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">Submit New Student Batch to Cardiff Met</DialogTitle>
          
          {/* Progress Indicator */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = getCurrentStepIndex() > index;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isCompleted
                        ? 'bg-green-100 text-green-700'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-5 w-5" />
                      <div className="hidden md:block">
                        <p className="font-medium text-sm">{step.title}</p>
                        <p className="text-xs opacity-70">{step.description}</p>
                      </div>
                    </div>
                    {index < STEPS.length - 1 && (
                      <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </DialogHeader>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto px-1">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="flex-shrink-0 border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Step {getCurrentStepIndex() + 1} of {STEPS.length}
              </Badge>
              {students.length > 0 && (
                <Badge variant="secondary">
                  {students.length} student{students.length !== 1 ? 's' : ''} added
                </Badge>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={getCurrentStepIndex() === 0 ? handleDialogClose : prevStep}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {getCurrentStepIndex() === 0 ? 'Cancel' : 'Previous'}
              </Button>

              {currentStep === 'review' ? (
                <Button 
                  onClick={submitBatch}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit to Cardiff Met
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchSubmissionDialog;
