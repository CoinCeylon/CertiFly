// components/steps/ManualStudentEntry.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save } from "lucide-react";
import { Student, BatchMetadata } from "../../ICBTDashboard";

interface ManualStudentEntryProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  batchMetadata: BatchMetadata;
}

const ManualStudentEntry: React.FC<ManualStudentEntryProps> = ({
  students,
  setStudents,
  batchMetadata
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Student>({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    course: '',
    graduation_date: batchMetadata.graduation_ceremony_date || '',
    gpa: 0
  });

  const updateFormData = (field: keyof Student, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addStudent = () => {
    // Validation
    if (!formData.student_id || !formData.first_name || !formData.last_name || 
        !formData.email || !formData.course) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate student ID
    if (students.some(s => s.student_id === formData.student_id)) {
      toast({
        title: "Duplicate Student ID",
        description: "A student with this ID already exists",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Validate GPA
    if (formData.gpa < 0 || formData.gpa > 4.0) {
      toast({
        title: "Invalid GPA",
        description: "GPA must be between 0 and 4.0",
        variant: "destructive"
      });
      return;
    }

    setStudents(prev => [...prev, formData]);
    
    // Reset form but keep graduation date
    setFormData({
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      course: formData.course, // Keep same course for convenience
      graduation_date: formData.graduation_date,
      gpa: 0
    });

    toast({
      title: "Student Added",
      description: `${formData.first_name} ${formData.last_name} has been added to the batch`,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="student_id">Student ID *</Label>
            <Input
              id="student_id"
              value={formData.student_id}
              onChange={(e) => updateFormData('student_id', e.target.value)}
              placeholder="e.g., CS2025001"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="course">Course *</Label>
            <Input
              id="course"
              value={formData.course}
              onChange={(e) => updateFormData('course', e.target.value)}
              placeholder="e.g., Computer Science"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => updateFormData('first_name', e.target.value)}
              placeholder="e.g., John"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => updateFormData('last_name', e.target.value)}
              placeholder="e.g., Doe"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="e.g., john.doe@example.com"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="graduation_date">Graduation Date</Label>
            <Input
              id="graduation_date"
              type="date"
              value={formData.graduation_date}
              onChange={(e) => updateFormData('graduation_date', e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="gpa">GPA (0.0 - 4.0)</Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={formData.gpa}
              onChange={(e) => updateFormData('gpa', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 3.75"
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={addStudent} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualStudentEntry;
