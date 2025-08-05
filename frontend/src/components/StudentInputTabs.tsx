// components/StudentInputTabs.tsx
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Student, BatchMetadata } from "../ICBTDashboard";

interface StudentInputTabsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  batchMetadata: BatchMetadata;
  setBatchMetadata: React.Dispatch<React.SetStateAction<BatchMetadata>>;
}

const StudentInputTabs: React.FC<StudentInputTabsProps> = ({
  students,
  setStudents,
  batchMetadata,
  setBatchMetadata
}) => {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState('');
  
  const [newStudent, setNewStudent] = useState<Student>({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    course: '',
    graduation_date: '',
    gpa: 0
  });

  const addStudent = () => {
    if (!newStudent.student_id || !newStudent.first_name || !newStudent.last_name) {
      toast({
        title: "Error",
        description: "Please fill in all required student fields.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate student ID
    if (students.find(s => s.student_id === newStudent.student_id)) {
      toast({
        title: "Error",
        description: "Student ID already exists in this batch.",
        variant: "destructive"
      });
      return;
    }

    setStudents([...students, newStudent]);
    setNewStudent({
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      course: '',
      graduation_date: '',
      gpa: 0
    });

    toast({
      title: "Success",
      description: "Student added to batch successfully!",
    });
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const expectedHeaders = ['student_id', 'first_name', 'last_name', 'email', 'course', 'graduation_date', 'gpa'];
    
    // Validate headers
    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      toast({
        title: "CSV Format Error",
        description: `Missing required columns: ${missingHeaders.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    const parsedStudents: Student[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) continue;
      
      const student: Student = {
        student_id: values[headers.indexOf('student_id')],
        first_name: values[headers.indexOf('first_name')],
        last_name: values[headers.indexOf('last_name')],
        email: values[headers.indexOf('email')],
        course: values[headers.indexOf('course')],
        graduation_date: values[headers.indexOf('graduation_date')],
        gpa: parseFloat(values[headers.indexOf('gpa')]) || 0
      };
      
      parsedStudents.push(student);
    }
    
    setStudents(parsedStudents);
    toast({
      title: "Success",
      description: `Imported ${parsedStudents.length} students from CSV`,
    });
  };

  const handleJSONUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseJSONData(text);
    };
    reader.readAsText(file);
  };

  const parseJSONInput = () => {
    parseJSONData(jsonInput);
  };

  const parseJSONData = (jsonText: string) => {
    try {
      const data = JSON.parse(jsonText);
      
      // If it's a complete batch submission format
      if (data.metadata && data.students) {
        setBatchMetadata(data.metadata);
        setStudents(data.students);
        toast({
          title: "Success",
          description: `Imported batch metadata and ${data.students.length} students from JSON`,
        });
      } 
      // If it's just students array
      else if (Array.isArray(data)) {
        setStudents(data);
        toast({
          title: "Success",
          description: `Imported ${data.length} students from JSON`,
        });
      }
      else {
        throw new Error("Invalid JSON format");
      }
      
      setJsonInput('');
    } catch (error) {
      toast({
        title: "JSON Parse Error",
        description: "Invalid JSON format. Please check your data.",
        variant: "destructive"
      });
    }
  };

  const downloadCSVTemplate = () => {
    const csvContent = `student_id,first_name,last_name,email,course,graduation_date,gpa
CS2025001,Alice,Johnson,alice.johnson@icbt.lk,Computer Science,2025-08-01,3.8
CS2025002,Bob,Smith,bob.smith@icbt.lk,Software Engineering,2025-08-01,3.9
EN2025001,Carol,Davis,carol.davis@icbt.lk,Electrical Engineering,2025-08-01,3.7`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'student_batch_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const loadJSONExample = () => {
    const exampleJSON = {
      metadata: {
        batch_name: "Computer Science Batch 2025-A",
        batch_description: "Final year computer science students",
        academic_year: "2025",
        semester: "1st Semester",
        graduation_ceremony_date: "2025-08-20",
        faculty: "Computing",
        program_type: "undergraduate",
        submission_deadline: "2025-08-15",
        contact_person: "Prof. John Smith",
        contact_email: "john.smith@icbt.lk",
        notes: "All students have completed their final projects"
      },
      students: [
        {
          student_id: "CS2025001",
          first_name: "Alice",
          last_name: "Johnson",
          email: "alice.johnson@icbt.lk",
          course: "Computer Science",
          graduation_date: "2025-08-01",
          gpa: 3.8
        },
        {
          student_id: "CS2025002",
          first_name: "Bob",
          last_name: "Smith",
          email: "bob.smith@icbt.lk",
          course: "Software Engineering",
          graduation_date: "2025-08-01",
          gpa: 3.9
        }
      ]
    };
    
    setJsonInput(JSON.stringify(exampleJSON, null, 2));
  };

  return (
    <div className="border-t pt-6 space-y-4">
      <h3 className="text-lg font-semibold">Add Students</h3>
      
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="csv">CSV Upload</TabsTrigger>
          <TabsTrigger value="json">JSON Upload</TabsTrigger>
        </TabsList>

        {/* Manual Entry Tab */}
        <TabsContent value="manual" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="student_id">Student ID *</Label>
              <Input 
                id="student_id"
                value={newStudent.student_id}
                onChange={(e) => setNewStudent({...newStudent, student_id: e.target.value})}
                placeholder="STU-2025-001"
              />
            </div>
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input 
                id="first_name"
                value={newStudent.first_name}
                onChange={(e) => setNewStudent({...newStudent, first_name: e.target.value})}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input 
                id="last_name"
                value={newStudent.last_name}
                onChange={(e) => setNewStudent({...newStudent, last_name: e.target.value})}
                placeholder="Smith"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                placeholder="john.smith@icbt.lk"
              />
            </div>
            <div>
              <Label htmlFor="course">Course</Label>
              <Input 
                id="course"
                value={newStudent.course}
                onChange={(e) => setNewStudent({...newStudent, course: e.target.value})}
                placeholder="Computer Science"
              />
            </div>
            <div>
              <Label htmlFor="graduation_date">Graduation Date</Label>
              <Input 
                id="graduation_date"
                type="date"
                value={newStudent.graduation_date}
                onChange={(e) => setNewStudent({...newStudent, graduation_date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="gpa">GPA</Label>
              <Input 
                id="gpa"
                type="number"
                step="0.1"
                min="0"
                max="4.0"
                value={newStudent.gpa}
                onChange={(e) => setNewStudent({...newStudent, gpa: parseFloat(e.target.value) || 0})}
                placeholder="3.8"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addStudent} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* CSV Upload Tab */}
        <TabsContent value="csv" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Upload CSV File</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a CSV file with student data
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => document.getElementById('csv-upload')?.click()}
                >
                  Choose CSV File
                </Button>
              </div>
            </div>
            
            {/* CSV Format Guide */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Your CSV file should have the following columns (header row required):
              </p>
              <code className="text-xs bg-background p-2 rounded block">
                student_id,first_name,last_name,email,course,graduation_date,gpa
              </code>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto mt-2"
                onClick={downloadCSVTemplate}
              >
                <Download className="h-4 w-4 mr-1" />
                Download CSV Template
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* JSON Upload Tab */}
        <TabsContent value="json" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Upload JSON File or Paste JSON Data</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a JSON file with complete batch data
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleJSONUpload}
                  className="hidden"
                  id="json-upload"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => document.getElementById('json-upload')?.click()}
                >
                  Choose JSON File
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="json-paste">Or Paste JSON Data</Label>
              <Textarea 
                id="json-paste"
                placeholder="Paste your JSON data here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="h-32 font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={parseJSONInput}
              >
                Parse JSON Data
              </Button>
            </div>

            {/* JSON Format Guide */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">JSON Format Example:</h4>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto mb-2"
                onClick={loadJSONExample}
              >
                <Eye className="h-4 w-4 mr-1" />
                Load Example JSON
              </Button>
              <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`{
  "metadata": {
    "batch_name": "Computer Science Batch 2025-A",
    "academic_year": "2025",
    "semester": "1st Semester",
    "faculty": "Computing",
    ...
  },
  "students": [
    {
      "student_id": "CS2025001",
      "first_name": "Alice",
      "last_name": "Johnson",
      "email": "alice.johnson@icbt.lk",
      "course": "Computer Science",
      "graduation_date": "2025-08-01",
      "gpa": 3.8
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentInputTabs;
