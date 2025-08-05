// components/steps/BatchSetupStep.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Info, Calendar, User, Mail, GraduationCap } from "lucide-react";
import { BatchMetadata } from "../../ICBTDashboard";

interface BatchSetupStepProps {
  batchMetadata: BatchMetadata;
  setBatchMetadata: React.Dispatch<React.SetStateAction<BatchMetadata>>;
}

const BatchSetupStep: React.FC<BatchSetupStepProps> = ({
  batchMetadata,
  setBatchMetadata
}) => {
  const updateMetadata = (field: keyof BatchMetadata, value: string) => {
    setBatchMetadata(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Batch Setup Instructions</h4>
            <p className="text-sm text-blue-700 mt-1">
              Configure your batch information first. All fields marked with <span className="text-red-500">*</span> are required.
              This information will be used to generate certificates and communicate with Cardiff Met.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Basic Batch Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="batch_name" className="flex items-center gap-1">
                Batch Name <span className="text-xs text-red-500">*</span>
              </Label>
              <Input 
                id="batch_name"
                value={batchMetadata.batch_name}
                onChange={(e) => updateMetadata('batch_name', e.target.value)}
                placeholder="e.g., Computer Science Graduation Batch 2025-A"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Choose a descriptive name that identifies this batch clearly
              </p>
            </div>

            <div>
              <Label htmlFor="academic_year" className="flex items-center gap-1">
                Academic Year <span className="text-xs text-red-500">*</span>
              </Label>
              <Input 
                id="academic_year"
                value={batchMetadata.academic_year}
                onChange={(e) => updateMetadata('academic_year', e.target.value)}
                placeholder="2025"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="semester" className="flex items-center gap-1">
                Semester <span className="text-xs text-red-500">*</span>
              </Label>
              <Select 
                value={batchMetadata.semester}
                onValueChange={(value) => updateMetadata('semester', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Semester">1st Semester</SelectItem>
                  <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="faculty" className="flex items-center gap-1">
                Faculty <span className="text-xs text-red-500">*</span>
              </Label>
              <Select 
                value={batchMetadata.faculty}
                onValueChange={(value) => updateMetadata('faculty', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computing">Computing</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Medicine">Medicine</SelectItem>
                  <SelectItem value="Multi-Faculty">Multi-Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="program_type">Program Type</Label>
              <Select 
                value={batchMetadata.program_type}
                onValueChange={(value) => updateMetadata('program_type', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="batch_description">Batch Description</Label>
            <Textarea 
              id="batch_description"
              value={batchMetadata.batch_description}
              onChange={(e) => updateMetadata('batch_description', e.target.value)}
              placeholder="Brief description of this graduation batch..."
              className="mt-2"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="graduation_ceremony_date">Graduation Ceremony Date</Label>
              <Input 
                id="graduation_ceremony_date"
                type="date"
                value={batchMetadata.graduation_ceremony_date}
                onChange={(e) => updateMetadata('graduation_ceremony_date', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="submission_deadline">Certificate Submission Deadline</Label>
              <Input 
                id="submission_deadline"
                type="date"
                value={batchMetadata.submission_deadline}
                onChange={(e) => updateMetadata('submission_deadline', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_person" className="flex items-center gap-1">
                Contact Person <span className="text-xs text-red-500">*</span>
              </Label>
              <Input 
                id="contact_person"
                value={batchMetadata.contact_person}
                onChange={(e) => updateMetadata('contact_person', e.target.value)}
                placeholder="Prof. John Smith"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="contact_email" className="flex items-center gap-1">
                Contact Email <span className="text-xs text-red-500">*</span>
              </Label>
              <Input 
                id="contact_email"
                type="email"
                value={batchMetadata.contact_email}
                onChange={(e) => updateMetadata('contact_email', e.target.value)}
                placeholder="john.smith@icbt.lk"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea 
              id="notes"
              value={batchMetadata.notes}
              onChange={(e) => updateMetadata('notes', e.target.value)}
              placeholder="Any special instructions or additional information for Cardiff Met..."
              className="mt-2"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchSetupStep;
