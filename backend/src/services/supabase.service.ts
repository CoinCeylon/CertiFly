// src/services/supabase.service.ts - Complete Version
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Student, StudentBatch } from '../models/student.model';

export interface BatchStatistics {
  batchId: string;
  totalStudents: number;
  processedStudents: number;
  verifiedStudents: number;
  certifiedStudents: number;
  rejectedStudents: number;
  batchStatus: 'submitted' | 'received' | 'processing' | 'completed' | 'failed';
  completionPercentage: number;
}

export interface ProcessLog {
  id?: string;
  entityType: 'batch' | 'student';
  entityId: string;
  action: string;
  status: string;
  details?: any;
  performedBy?: string;
  performedAt?: string;
}

export class SupabaseService {
  private supabase: SupabaseClient;
  private realtimeChannel: RealtimeChannel | null = null;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_ANON_KEY!;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Real-time subscription setup
  setupRealTimeSync(callback: (payload: any) => void): void {
    this.realtimeChannel = this.supabase
      .channel('university-consortium')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'students' }, 
        callback
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'student_batches' }, 
        callback
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'process_logs' }, 
        callback
      )
      .subscribe();
  }

  // Student operations
  async createStudent(student: Student): Promise<Student> {
    const { data, error } = await this.supabase
      .from('students')
      .insert([student])
      .select()
      .single();

    if (error) throw new Error(`Error creating student: ${error.message}`);

    await this.logProcess('student', student.student_id, 'created', 'success', {
      university: student.university,
      course: student.course
    });

    return data;
  }

  async getStudentsByUniversity(university: string): Promise<Student[]> {
    const { data, error } = await this.supabase
      .from('students')
      .select('*')
      .eq('university', university)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching students: ${error.message}`);
    return data || [];
  }

async getStudentByHash(certificateHash: string): Promise<any | null> {
  const { data, error } = await this.supabase
    .from('student_details')
    .select(`
      *,
      batch_details!inner(
        batch_name,
        academic_year,
        semester,
        faculty,
        cardano_transaction_id
      )
    `)
    .eq('certificate_hash', certificateHash)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching student: ${error.message}`);
  }
  return data;
}


// Add to your SupabaseService class
async getBatchDetails(batchId: string): Promise<any> {
  const { data, error } = await this.supabase
    .from('batch_details')
    .select('*')
    .eq('batch_id', batchId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching batch details: ${error.message}`);
  }
  return data;
}

async getStudentById(studentId: string): Promise<any> {
  const { data, error } = await this.supabase
    .from('student_details')
    .select(`
      *,
      batch_details!inner(
        batch_name,
        academic_year,
        semester,
        faculty,
        cardano_transaction_id
      )
    `)
    .eq('student_id', studentId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching student: ${error.message}`);
  }
  return data;
}



  async updateStudentStatus(
    studentId: string, 
    status: 'pending' | 'verified' | 'certified' | 'rejected',
    certificateHash?: string,
    cardanoTxId?: string,
    verifiedBy?: string,
    notes?: string
  ): Promise<void> {
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };

    if (certificateHash) updateData.certificate_hash = certificateHash;
    if (cardanoTxId) updateData.cardano_tx_id = cardanoTxId;
    if (verifiedBy) updateData.verified_by = verifiedBy;
    if (notes) updateData.verification_notes = notes;
    if (status === 'verified' || status === 'certified') {
      updateData.verified_at = new Date().toISOString();
    }

    const { error } = await this.supabase
      .from('students')
      .update(updateData)
      .eq('student_id', studentId);

    if (error) throw new Error(`Error updating student: ${error.message}`);

    await this.logProcess('student', studentId, 'status_updated', 'success', {
      newStatus: status,
      certificateHash,
      cardanoTxId,
      verifiedBy,
      notes
    });
  }

  async getStudentsByStatus(status: string, university?: string): Promise<Student[]> {
    let query = this.supabase
      .from('students')
      .select('*')
      .eq('status', status);

    if (university) {
      query = query.eq('university', university);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching students by status: ${error.message}`);
    return data || [];
  }

  async getCertifiedStudents(university?: string): Promise<Student[]> {
    return this.getStudentsByStatus('certified', university);
  }

  async getPendingStudents(university?: string): Promise<Student[]> {
    return this.getStudentsByStatus('pending', university);
  }

  async getVerifiedStudents(university?: string): Promise<Student[]> {
    return this.getStudentsByStatus('verified', university);
  }

  async searchStudents(firstName?: string, lastName?: string, studentId?: string): Promise<Student[]> {
    let query = this.supabase
      .from('students')
      .select('*')
      .eq('status', 'certified');

    if (studentId) {
      query = query.eq('student_id', studentId);
    } else if (firstName && lastName) {
      query = query
        .ilike('first_name', `%${firstName}%`)
        .ilike('last_name', `%${lastName}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(`Error searching students: ${error.message}`);
    return data || [];
  }

  // Batch operations
async createBatch(batch: StudentBatch, fireflyMessageId?: string): Promise<void> {
  const batchData = {
    batch_id: batch.batch_id,
    firefly_message_id: fireflyMessageId,
    submitted_by: batch.submitted_by,
    total_students: batch.students ? batch.students.length : 0, // Ensure it's not null
    batch_status: 'submitted',
    submitted_at: batch.submitted_at,
    students: batch.students || [] // Ensure students array exists
  };

  console.log('📦 Creating batch with data:', batchData); // Debug log

  const { error } = await this.supabase
    .from('student_batches')
    .insert([batchData]);

  if (error) throw new Error(`Error creating batch: ${error.message}`);

  await this.logProcess('batch', batch.batch_id ?? '', 'created', 'success', {
    totalStudents: batch.students ? batch.students.length : 0,
    submittedBy: batch.submitted_by
  });
}

async getStudentDetails(studentId: string, batchId: string): Promise<any> {
  try {
    console.log(`🔍 Getting student details for: ${studentId} in batch: ${batchId}`);
    
    const { data, error } = await this.supabase
      .from('student_details')
      .select('*')
      .eq('student_id', studentId)
      .eq('batch_id', batchId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        console.log(`⚠️ No student details found for: ${studentId} in batch: ${batchId}`);
        return null;
      }
      throw new Error(`Error fetching student details: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error in getStudentDetails:', error);
    throw error;
  }
}


// Add this method to your SupabaseService class
async updateBatchCardanoTransaction(batchId: string, cardanoTxId: string): Promise<void> {
  try {
    console.log(`🔗 Updating batch ${batchId} with Cardano transaction: ${cardanoTxId}`);
    
    const { error } = await this.supabase
      .from('batch_details')
      .update({ 
        cardano_transaction_id: cardanoTxId,
        blockchain_submitted_at: new Date().toISOString(),
        status: 'completed'
      })
      .eq('batch_id', batchId);
    
    if (error) throw new Error(`Error updating batch Cardano transaction: ${error.message}`);

    // Log the update
    await this.logProcess('batch', batchId, 'cardano_transaction_added', 'success', {
      cardanoTxId: cardanoTxId,
      blockchainSubmittedAt: new Date().toISOString()
    });

    console.log(`✅ Batch ${batchId} updated with Cardano transaction: ${cardanoTxId}`);
  } catch (error) {
    console.error('❌ Error updating batch Cardano transaction:', error);
    throw error;
  }
}


  // Enhanced batch operations with metadata
  async createBatchWithMetadata(batch: StudentBatch, fireflyMessageId?: string): Promise<void> {
    try {
      // 1. Insert batch metadata
      const batchMetadata = {
        batch_id: batch.batch_id,
        batch_name: batch.metadata.batch_name,
        batch_description: batch.metadata.batch_description,
        academic_year: batch.metadata.academic_year,
        semester: batch.metadata.semester,
        graduation_ceremony_date: batch.metadata.graduation_ceremony_date,
        faculty: batch.metadata.faculty,
        program_type: batch.metadata.program_type,
        submission_deadline: batch.metadata.submission_deadline,
        contact_person: batch.metadata.contact_person,
        contact_email: batch.metadata.contact_email,
        notes: batch.metadata.notes,
        submitted_by: batch.submitted_by,
        firefly_message_id: fireflyMessageId,
        batch_status: 'received',
        submitted_at: batch.submitted_at,
        received_at: new Date().toISOString()
      };

      const { error: batchError } = await this.supabase
        .from('batch_metadata')
        .insert([batchMetadata]);

      if (batchError) throw new Error(`Error creating batch metadata: ${batchError.message}`);

      // 2. Insert students with batch reference
      if (batch.students && batch.students.length > 0) {
        const studentsData = batch.students.map(student => ({
          student_id: student.student_id,
          batch_id: batch.batch_id,
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          course: student.course,
          graduation_date: student.graduation_date,
          gpa: student.gpa,
          university: student.university,
          status: student.status || 'pending'
        }));

        const { error: studentsError } = await this.supabase
          .from('students')
          .insert(studentsData);

        if (studentsError) throw new Error(`Error creating students: ${studentsError.message}`);
      }

      // 3. Log the process
      await this.logProcess('batch', batch.batch_id!, 'created_with_metadata', 'success', {
        batchName: batch.metadata.batch_name,
        studentsCount: batch.students.length,
        faculty: batch.metadata.faculty,
        academicYear: batch.metadata.academic_year
      });

      console.log(`✅ Batch with metadata created successfully: ${batch.batch_id}`);
    } catch (error) {
      console.error('❌ Error in createBatchWithMetadata:', error);
      throw error;
    }
  }

  // Get batch with full details and students
  async getBatchWithDetails(batchId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('batch_metadata')
      .select(`
        *,
        students (*),
        batch_statistics (*)
      `)
      .eq('batch_id', batchId)
      .single();

    if (error) throw new Error(`Error fetching batch details: ${error.message}`);
    return data;
  }

  // Get all batches with metadata
  async getAllBatchesWithMetadata(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('batch_metadata')
      .select(`
        *,
        batch_statistics (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching batches: ${error.message}`);
    return data || [];
  }

  // Get batch statistics
  async getBatchStatistics(batchId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('batch_statistics')
      .select('*')
      .eq('batch_id', batchId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching batch statistics: ${error.message}`);
    }
    return data;
  }

  // Update batch status
  async updateBatchStatus(batchId: string, status: string, notes?: string): Promise<void> {
    const updateData: any = { 
      batch_status: status,
      updated_at: new Date().toISOString()
    };

    if (status === 'processing') updateData.processed_at = new Date().toISOString();
    if (status === 'completed') updateData.completed_at = new Date().toISOString();

    const { error } = await this.supabase
      .from('batch_metadata')
      .update(updateData)
      .eq('batch_id', batchId);

    if (error) throw new Error(`Error updating batch status: ${error.message}`);

    await this.logProcess('batch', batchId, 'status_updated', 'success', {
      newStatus: status,
      notes
    });
  }

  // Enhanced process logging with batch reference
  async logProcess(
    entityType: 'batch' | 'student',
    entityId: string,
    action: string,
    status: string,
    details?: any,
    performedBy?: string,
    batchId?: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from('process_logs')
      .insert([{
        entity_type: entityType,
        entity_id: entityId,
        batch_id: batchId,
        action,
        status,
        details,
        performed_by: performedBy
      }]);

    if (error) console.error('Error logging process:', error);
  }

 
  async getBatchesByUniversity(university: string): Promise<StudentBatch[]> {
    const { data, error } = await this.supabase
      .from('student_batches')
      .select('*')
      .eq('submitted_by', university)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching batches: ${error.message}`);
    return data || [];
  }

  async getAllBatches(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('student_batches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching all batches: ${error.message}`);
    return data || [];
  }

  async getBatchById(batchId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('student_batches')
      .select('*')
      .eq('batch_id', batchId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching batch: ${error.message}`);
    }
    return data;
  }

  async getStudentsByBatch(batchId: string): Promise<Student[]> {
    const { data, error } = await this.supabase
      .from('students')
      .select('*')
      .eq('batch_id', batchId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching batch students: ${error.message}`);
    return data || [];
  }



  async getProcessLogs(entityType?: string, entityId?: string, limit: number = 50): Promise<ProcessLog[]> {
    let query = this.supabase
      .from('process_logs')
      .select('*')
      .order('performed_at', { ascending: false })
      .limit(limit);

    if (entityType) query = query.eq('entity_type', entityType);
    if (entityId) query = query.eq('entity_id', entityId);

    const { data, error } = await query;
    if (error) throw new Error(`Error fetching process logs: ${error.message}`);
    
    return data || [];
  }


  // Message inbox methods
  async createMessage(messageData: any): Promise<void> {
    const { error } = await this.supabase
      .from('message_inbox')
      .insert([messageData]);
    
    if (error) throw new Error(`Error creating message: ${error.message}`);
  }

  async getMessageById(messageId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('message_inbox')
      .select('*')
      .eq('message_id', messageId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching message: ${error.message}`);
    }
    return data;
  }

  async updateMessageStatus(messageId: string, viewed: boolean, processed: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('message_inbox')
      .update({ viewed_status: viewed, processed })
      .eq('message_id', messageId);
    
    if (error) throw new Error(`Error updating message status: ${error.message}`);
  }

  // Batch details methods
  async createBatchDetails(batchData: any): Promise<void> {
    const { error } = await this.supabase
      .from('batch_details')
      .insert([batchData]);
    
    if (error) throw new Error(`Error creating batch details: ${error.message}`);
  }

  // Student details methods
  async createStudentDetails(studentData: any): Promise<void> {
    const { error } = await this.supabase
      .from('student_details')
      .insert([studentData]);
    
    if (error) throw new Error(`Error creating student details: ${error.message}`);
  }

  // Dashboard and analytics
  async getDashboardStats(): Promise<any> {
    const { data: batchStats } = await this.supabase
      .from('student_batches')
      .select('batch_status, total_students, certified_students')
      .order('created_at', { ascending: false });

    const { data: studentStats } = await this.supabase
      .from('students')
      .select('status, university')
      .order('created_at', { ascending: false });

    return {
      totalBatches: batchStats?.length || 0,
      totalStudents: studentStats?.length || 0,
      certifiedStudents: studentStats?.filter(s => s.status === 'certified').length || 0,
      pendingStudents: studentStats?.filter(s => s.status === 'pending').length || 0,
      batchStatusDistribution: this.groupBy(batchStats || [], 'batch_status'),
      studentStatusDistribution: this.groupBy(studentStats || [], 'status'),
      universityDistribution: this.groupBy(studentStats || [], 'university')
    };
  }

  private groupBy(array: any[], key: string): { [key: string]: number } {
    return array.reduce((result, item) => {
      const group = item[key] || 'unknown';
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  // Cleanup
  disconnect(): void {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }
  }
}
