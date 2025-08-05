// components/steps/BulkStudentEntry.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Download,
  Info
} from "lucide-react";
import { Student, BatchMetadata } from "../../ICBTDashboard";

interface BulkStudentEntryProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  batchMetadata: BatchMetadata;
}

interface ParsedStudent extends Student {
  isValid: boolean;
  errors: string[];
}

const BulkStudentEntry: React.FC<BulkStudentEntryProps> = ({
  students,
  setStudents,
  batchMetadata
}) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedStudents, setParsedStudents] = useState<ParsedStudent[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const validateStudent = (student: any, rowIndex: number): ParsedStudent => {
    const errors: string[] = [];
    
    // Check required fields
    if (!student.student_id?.trim()) errors.push("Student ID is required");
    if (!student.first_name?.trim()) errors.push("First name is required");
    if (!student.last_name?.trim()) errors.push("Last name is required");
    if (!student.email?.trim()) errors.push("Email is required");
    if (!student.course?.trim()) errors.push("Course is required");

    // Validate email format
    if (student.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
      errors.push("Invalid email format");
    }

    // Validate GPA
    const gpa = parseFloat(student.gpa) || 0;
    if (gpa < 0 || gpa > 4.0) {
      errors.push("GPA must be between 0 and 4.0");
    }

    // Check for duplicate student ID in existing students
    const existingIds = students.map(s => s.student_id);
    if (existingIds.includes(student.student_id)) {
      errors.push("Student ID already exists in batch");
    }

    return {
      student_id: student.student_id?.trim() || '',
      first_name: student.first_name?.trim() || '',
      last_name: student.last_name?.trim() || '',
      email: student.email?.trim() || '',
      course: student.course?.trim() || '',
      graduation_date: student.graduation_date || batchMetadata.graduation_ceremony_date || '',
      gpa: gpa,
      isValid: errors.length === 0,
      errors
    };
  };

  const parseCSVContent = (csvContent: string): ParsedStudent[] => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error("CSV file must contain at least a header and one data row");
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    // Expected headers mapping
    const headerMapping: { [key: string]: string } = {
      'student_id': 'student_id',
      'studentid': 'student_id',
      'id': 'student_id',
      'first_name': 'first_name',
      'firstname': 'first_name',
      'fname': 'first_name',
      'last_name': 'last_name',
      'lastname': 'last_name',
      'lname': 'last_name',
      'email': 'email',
      'email_address': 'email',
      'course': 'course',
      'program': 'course',
      'major': 'course',
      'graduation_date': 'graduation_date',
      'graduationdate': 'graduation_date',
      'grad_date': 'graduation_date',
      'gpa': 'gpa',
      'grade': 'gpa'
    };

    // Map headers to expected field names
    const fieldIndexes: { [key: string]: number } = {};
    headers.forEach((header, index) => {
      const mappedField = headerMapping[header];
      if (mappedField) {
        fieldIndexes[mappedField] = index;
      }
    });

    // Validate required headers
    const requiredFields = ['student_id', 'first_name', 'last_name', 'email', 'course'];
    const missingFields = requiredFields.filter(field => fieldIndexes[field] === undefined);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required columns: ${missingFields.join(', ')}`);
    }

    // Parse data rows
    const parsedStudents: ParsedStudent[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length < headers.length) continue; // Skip incomplete rows
      
      const studentData: any = {};
      
      // Map values to fields
      Object.entries(fieldIndexes).forEach(([field, index]) => {
        studentData[field] = values[index] || '';
      });
      
      const validatedStudent = validateStudent(studentData, i);
      parsedStudents.push(validatedStudent);
    }

    return parsedStudents;
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file only.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
      });

      const parsed = parseCSVContent(fileContent);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setParsedStudents(parsed);
      
      const validStudents = parsed.filter(s => s.isValid);
      const invalidCount = parsed.length - validStudents.length;
      
      if (invalidCount > 0) {
        toast({
          title: "Validation Issues Found",
          description: `${validStudents.length} valid students found, ${invalidCount} have errors. Review and fix issues before adding.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "File Processed Successfully",
          description: `${validStudents.length} students ready to be added to the batch.`,
        });
      }
      
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Failed to process CSV file",
        variant: "destructive"
      });
      setParsedStudents([]);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const addValidStudents = () => {
    const validStudents = parsedStudents.filter(s => s.isValid);
    
    if (validStudents.length === 0) {
      toast({
        title: "No Valid Students",
        description: "Please fix validation errors before adding students.",
        variant: "destructive"
      });
      return;
    }

    // Remove validation fields before adding
    const cleanStudents: Student[] = validStudents.map(({ isValid, errors, ...student }) => student);
    
    setStudents(prev => [...prev, ...cleanStudents]);
    setParsedStudents([]);
    
    toast({
      title: "Students Added Successfully",
      description: `${validStudents.length} students have been added to the batch.`,
    });
  };

  const clearPreview = () => {
    setParsedStudents([]);
    setUploadProgress(0);
  };

  const downloadTemplate = () => {
    const csvContent = [
      "student_id,first_name,last_name,email,course,graduation_date,gpa",
      "CS2025001,John,Doe,john.doe@example.com,Computer Science,2025-12-15,3.75",
      "CS2025002,Jane,Smith,jane.smith@example.com,Computer Science,2025-12-15,3.85",
      "EN2025001,Mike,Johnson,mike.johnson@example.com,Engineering,2025-12-15,3.60"
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_batch_template_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">CSV Upload Instructions</h4>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>• Download the template below to see the required format</p>
              <p>• Required columns: student_id, first_name, last_name, email, course</p>
              <p>• Optional columns: graduation_date, gpa</p>
              <p>• Maximum file size: 5MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h3 className="text-lg font-medium mb-2">Drop CSV file here or click to browse</h3>
                <p className="text-muted-foreground text-sm">
                  Upload a CSV file with student information
                </p>
              </div>
              
              <div className="flex justify-center gap-3">
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('csvFileInput')?.click()}
                  disabled={isProcessing}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
              
              <input
                id="csvFileInput"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
            </div>
          </div>

          {/* Upload Progress */}
          {isProcessing && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing CSV file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Results */}
      {parsedStudents.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Preview Results</h3>
                <Button variant="outline" size="sm" onClick={clearPreview}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>

              {/* Summary Stats */}
              <div className="flex gap-4">
                <Badge variant="outline" className="text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {parsedStudents.filter(s => s.isValid).length} Valid
                </Badge>
                {parsedStudents.filter(s => !s.isValid).length > 0 && (
                  <Badge variant="outline" className="text-red-700 border-red-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {parsedStudents.filter(s => !s.isValid).length} Invalid
                  </Badge>
                )}
              </div>

              {/* Preview Table */}
              <div className="max-h-64 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Student ID</th>
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Course</th>
                      <th className="text-left p-3">Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedStudents.map((student, index) => (
                      <tr key={index} className={`border-t ${!student.isValid ? 'bg-red-50' : ''}`}>
                        <td className="p-3">
                          {student.isValid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </td>
                        <td className="p-3 font-mono text-xs">{student.student_id}</td>
                        <td className="p-3">{student.first_name} {student.last_name}</td>
                        <td className="p-3 text-xs">{student.email}</td>
                        <td className="p-3">{student.course}</td>
                        <td className="p-3">
                          {student.errors.length > 0 && (
                            <div className="text-xs text-red-600">
                              {student.errors.join(', ')}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={clearPreview}>
                  Cancel
                </Button>
                <Button 
                  onClick={addValidStudents}
                  disabled={parsedStudents.filter(s => s.isValid).length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Add {parsedStudents.filter(s => s.isValid).length} Valid Students
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkStudentEntry;
