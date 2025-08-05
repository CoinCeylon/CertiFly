// components/StudentsTable.tsx
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Student } from "../ICBTDashboard";

interface StudentsTableProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const StudentsTable: React.FC<StudentsTableProps> = ({ students, setStudents }) => {
  const removeStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Students in Batch ({students.length})</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setStudents([])}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>GPA</TableHead>
            <TableHead>Graduation Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={student.student_id}>
              <TableCell className="font-medium">{student.student_id}</TableCell>
              <TableCell>{student.first_name} {student.last_name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.course}</TableCell>
              <TableCell>{student.gpa}</TableCell>
              <TableCell>
                {student.graduation_date ? 
                  new Date(student.graduation_date).toLocaleDateString() : 
                  'N/A'
                }
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeStudent(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentsTable;
