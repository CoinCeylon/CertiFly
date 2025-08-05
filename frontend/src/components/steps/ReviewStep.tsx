// components/steps/ReviewStep.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  FileText, 
  Users, 
  Calendar, 
  Mail, 
  User,
  GraduationCap,
  Building2
} from "lucide-react";
import { Student, BatchMetadata } from "../../ICBTDashboard";

interface ReviewStepProps {
  batchMetadata: BatchMetadata;
  students: Student[];
  onEdit: (step: 'setup' | 'students') => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  batchMetadata,
  students,
  onEdit
}) => {
  return (
    <div className="space-y-6">
      {/* Final Review Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Final Review</h4>
            <p className="text-sm text-blue-700 mt-1">
              Please review all information carefully before submitting to Cardiff Met. 
              You can edit any section by clicking the edit button.
            </p>
          </div>
        </div>
      </div>

      {/* Batch Information Review */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Batch Information
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit('setup')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Batch Name</p>
                  <p className="text-sm text-muted-foreground">{batchMetadata.batch_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Faculty</p>
                  <p className="text-sm text-muted-foreground">{batchMetadata.faculty}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Academic Year & Semester</p>
                  <p className="text-sm text-muted-foreground">
                    {batchMetadata.academic_year} - {batchMetadata.semester}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contact Person</p>
                  <p className="text-sm text-muted-foreground">{batchMetadata.contact_person}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contact Email</p>
                  <p className="text-sm text-muted-foreground">{batchMetadata.contact_email}</p>
                </div>
              </div>

              {batchMetadata.graduation_ceremony_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Graduation Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(batchMetadata.graduation_ceremony_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {batchMetadata.batch_description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-1">Description</p>
              <p className="text-sm text-muted-foreground">{batchMetadata.batch_description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students Review */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Students ({students.length})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit('students')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="flex gap-4">
              <Badge variant="secondary">{students.length} Total Students</Badge>
              <Badge variant="outline">
                Avg GPA: {(students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)}
              </Badge>
            </div>

            {/* Students List */}
            <div className="max-h-64 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left p-3">Student ID</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Course</th>
                    <th className="text-left p-3">GPA</th>
                    <th className="text-left p-3">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3 font-mono text-xs">{student.student_id}</td>
                      <td className="p-3">{student.first_name} {student.last_name}</td>
                      <td className="p-3">{student.course}</td>
                      <td className="p-3">{student.gpa.toFixed(2)}</td>
                      <td className="p-3 text-xs">{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Ready for Submission</h3>
            <p className="text-green-700 mb-4">
              Your batch with <strong>{students.length} students</strong> is ready to be submitted to Cardiff Met
              for certificate processing and blockchain verification.
            </p>
            <div className="text-sm text-green-600">
              <p>✓ Batch information complete</p>
              <p>✓ All students validated</p>
              <p>✓ Ready for Cardiff Met processing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
