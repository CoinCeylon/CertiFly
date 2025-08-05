// components/steps/StudentEntryStep.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Upload, Users, AlertCircle, Download } from "lucide-react";
import { Student, BatchMetadata } from "../../ICBTDashboard";
import ManualStudentEntry from "./ManualStudentEntry";
import BulkStudentEntry from "./BulkStudentEntry";
import StudentsTable from "../StudentsTable";

interface StudentEntryStepProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  batchMetadata: BatchMetadata;
}

const StudentEntryStep: React.FC<StudentEntryStepProps> = ({
  students,
  setStudents,
  batchMetadata
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'bulk'>('manual');

  const downloadTemplate = () => {
    const csvContent = "student_id,first_name,last_name,email,course,graduation_date,gpa\n" +
                      "CS2025001,John,Doe,john.doe@example.com,Computer Science,2025-12-15,3.75\n" +
                      "CS2025002,Jane,Smith,jane.smith@example.com,Computer Science,2025-12-15,3.85";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_batch_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">Add Student Details</h4>
            <p className="text-sm text-green-700 mt-1">
              Choose how you want to add students: manually one by one, or upload a CSV file with multiple students.
              For batch: <strong>{batchMetadata.batch_name}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Entry Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Student Entry Methods</span>
            {students.length > 0 && (
              <Badge variant="secondary" className="text-sm">
                {students.length} student{students.length !== 1 ? 's' : ''} added
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'manual' | 'bulk')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Bulk Upload (CSV)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Add Students Manually</h3>
                  <Button variant="outline" size="sm" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV Template
                  </Button>
                </div>
                <ManualStudentEntry 
                  students={students}
                  setStudents={setStudents}
                  batchMetadata={batchMetadata}
                />
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Upload Student Data (CSV)</h3>
                  <Button variant="outline" size="sm" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
                <BulkStudentEntry 
                  students={students}
                  setStudents={setStudents}
                  batchMetadata={batchMetadata}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Students List */}
      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Students in This Batch ({students.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StudentsTable 
              students={students}
              setStudents={setStudents}
            />
          </CardContent>
        </Card>
      )}

      {/* No Students Warning */}
      {students.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">No Students Added Yet</h4>
              <p className="text-sm text-yellow-700 mt-1">
                You need to add at least one student to continue. Use either manual entry or CSV upload above.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEntryStep;
