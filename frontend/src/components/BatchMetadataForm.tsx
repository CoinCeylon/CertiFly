// components/BatchMetadataForm.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BatchMetadata } from "../ICBTDashboard";

interface BatchMetadataFormProps {
  batchMetadata: BatchMetadata;
  setBatchMetadata: React.Dispatch<React.SetStateAction<BatchMetadata>>;
}

const BatchMetadataForm: React.FC<BatchMetadataFormProps> = ({
  batchMetadata,
  setBatchMetadata
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Batch Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="batch_name">Batch Name *</Label>
          <Input 
            id="batch_name"
            value={batchMetadata.batch_name}
            onChange={(e) => setBatchMetadata({...batchMetadata, batch_name: e.target.value})}
            placeholder="e.g., Computer Science Batch 2025-A"
          />
        </div>
        <div>
          <Label htmlFor="academic_year">Academic Year *</Label>
          <Input 
            id="academic_year"
            value={batchMetadata.academic_year}
            onChange={(e) => setBatchMetadata({...batchMetadata, academic_year: e.target.value})}
            placeholder="2025"
          />
        </div>
        <div>
          <Label htmlFor="semester">Semester *</Label>
          <Select 
            value={batchMetadata.semester}
            onValueChange={(value) => setBatchMetadata({...batchMetadata, semester: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st Semester">1st Semester</SelectItem>
              <SelectItem value="2nd Semester">2nd Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="faculty">Faculty *</Label>
          <Select 
            value={batchMetadata.faculty}
            onValueChange={(value) => setBatchMetadata({...batchMetadata, faculty: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computing">Computing</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Medicine">Medicine</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="graduation_ceremony_date">Graduation Ceremony Date</Label>
          <Input 
            id="graduation_ceremony_date"
            type="date"
            value={batchMetadata.graduation_ceremony_date}
            onChange={(e) => setBatchMetadata({...batchMetadata, graduation_ceremony_date: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="submission_deadline">Submission Deadline</Label>
          <Input 
            id="submission_deadline"
            type="date"
            value={batchMetadata.submission_deadline}
            onChange={(e) => setBatchMetadata({...batchMetadata, submission_deadline: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="contact_person">Contact Person *</Label>
          <Input 
            id="contact_person"
            value={batchMetadata.contact_person}
            onChange={(e) => setBatchMetadata({...batchMetadata, contact_person: e.target.value})}
            placeholder="Prof. John Smith"
          />
        </div>
        <div>
          <Label htmlFor="contact_email">Contact Email *</Label>
          <Input 
            id="contact_email"
            type="email"
            value={batchMetadata.contact_email}
            onChange={(e) => setBatchMetadata({...batchMetadata, contact_email: e.target.value})}
            placeholder="john.smith@icbt.lk"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="batch_description">Batch Description</Label>
        <Textarea 
          id="batch_description"
          value={batchMetadata.batch_description}
          onChange={(e) => setBatchMetadata({...batchMetadata, batch_description: e.target.value})}
          placeholder="Describe the batch..."
        />
      </div>
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea 
          id="notes"
          value={batchMetadata.notes}
          onChange={(e) => setBatchMetadata({...batchMetadata, notes: e.target.value})}
          placeholder="Any additional information..."
        />
      </div>
    </div>
  );
};

export default BatchMetadataForm;
