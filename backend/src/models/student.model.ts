// src/models/student.model.ts 
export interface Student {
  id?: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  course: string;
  graduation_date: string;
  gpa: number;
  university?: string;
  status?: 'pending' | 'verified' | 'certified' | 'rejected';
  certificate_hash?: string;
  cardano_tx_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BatchMetadata {
  batch_name: string;
  batch_description: string;
  academic_year: string;
  semester: string;
  graduation_ceremony_date: string;
  faculty: string;
  program_type: string; // "undergraduate", "postgraduate", "diploma"
  submission_deadline: string;
  contact_person: string;
  contact_email: string;
  notes?: string;
}

export interface StudentBatch {
  // Auto-generated fields
  batch_id?: string;
  submitted_by?: string;
  submitted_at?: string;
  
  // Metadata filled by ICBT
  metadata: BatchMetadata;
  
  // Students added to the batch
  students: Student[];
}


export interface CertificateVerification {
  student_id: string;
  certificate_hash: string;
  is_valid: boolean;
  issued_by: string;
  issued_date: string;
  cardano_tx_id: string;
}
