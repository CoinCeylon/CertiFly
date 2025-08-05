import crypto from 'crypto';
import { Student } from '../models/student.model';

export class HashUtil {
  static generateStudentHash(student: Student): string {
    const dataToHash = {
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      course: student.course,
      graduation_date: student.graduation_date,
      gpa: student.gpa,
      university: student.university
    };
    
    const jsonString = JSON.stringify(dataToHash, Object.keys(dataToHash).sort());
    return crypto.createHash('sha256').update(jsonString).digest('hex');
  }

  static generateBatchHash(students: Student[]): string {
    const studentHashes = students.map(student => this.generateStudentHash(student));
    const combinedHash = studentHashes.join('');
    return crypto.createHash('sha256').update(combinedHash).digest('hex');
  }

  static verifyCertificate(student: Student, providedHash: string): boolean {
    const calculatedHash = this.generateStudentHash(student);
    return calculatedHash === providedHash;
  }
}
