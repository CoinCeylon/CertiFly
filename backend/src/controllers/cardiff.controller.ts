// src/controllers/cardiff.controller.ts
import { Request, Response } from 'express';
import { FireFlyService } from '../services/firefly.service';
import { CardanoService } from '../services/cardano.service';
import { SupabaseService } from '../services/supabase.service';
import { createHash } from 'crypto';
import { CertificateService } from '../services/certificate.service';

export class CardiffController {
  private fireflyService: FireFlyService;
  private cardanoService: CardanoService;
  private supabaseService: SupabaseService;

  constructor() {
    this.fireflyService = new FireFlyService(process.env.CARDIFF_FIREFLY_URL!);
    this.cardanoService = new CardanoService();
    this.supabaseService = new SupabaseService();
  }


async processBatch(req: Request, res: Response): Promise<void> {
  try {
    const { messageId } = req.body;
    console.log(`🔄 Processing batch from message: ${messageId}`);

    const messages = await this.fireflyService.getMessages(100);
    const targetMessage = messages.find(m => m.header.id === messageId);

    if (!targetMessage || !targetMessage.data || targetMessage.data.length === 0) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    const data = await this.fireflyService.retrieveData(targetMessage.data);
    const messageData = JSON.parse(data[0].value);

    // Support both old and new message types
    if (!['STUDENT_BATCH_SUBMISSION', 'STUDENT_BATCH_SUBMISSION_WITH_METADATA'].includes(messageData.type)) {
      res.status(400).json({ error: 'Invalid message type' });
      return;
    }

    const batch = messageData.batch;

    console.log(' Processing batch with metadata:', {
      batchId: batch.batch_id,
      batchName: batch.metadata?.batch_name || 'No name',
      studentsCount: batch.students ? batch.students.length : 0,
      faculty: batch.metadata?.faculty || 'Not specified'
    });

    if (!batch.students || !Array.isArray(batch.students)) {
      console.error('Invalid batch structure - students array missing');
      res.status(400).json({ error: 'Invalid batch structure - students array missing' });
      return;
    }

    // Create batch with metadata using new method
    if (batch.metadata) {
      // Enhanced batch with metadata
      await this.supabaseService.createBatchWithMetadata(batch, messageId);
      console.log(`Batch with metadata processed: "${batch.metadata.batch_name}"`);
    } else {
      // Fallback for old batch format
      await this.supabaseService.createBatch(batch, messageId);
      console.log(`Legacy batch processed: ${batch.batch_id}`);
    }

    // Update batch status to processing
    await this.supabaseService.updateBatchStatus(batch.batch_id, 'processing');

    res.json({
      success: true,
      message: batch.metadata 
        ? `Batch "${batch.metadata.batch_name}" processed and stored successfully`
        : 'Batch processed and stored successfully',
      batchId: batch.batch_id,
      batchName: batch.metadata?.batch_name,
      studentsCount: batch.students.length,
      faculty: batch.metadata?.faculty,
      academicYear: batch.metadata?.academic_year,
      semester: batch.metadata?.semester,
      contactPerson: batch.metadata?.contact_person,
      messageId
    });
  } catch (error) {
    console.error('Error processing batch:', error);
    res.status(500).json({ error: 'Failed to process batch' });
  }
}



async getMessageInbox(req: Request, res: Response): Promise<void> {
  try {
    console.log('📥 Fetching Cardiff message inbox...');
    
    const { viewed } = req.query;
    const viewedFilter = viewed !== undefined ? viewed === 'true' : null;
    
    const fireflyMessages = await this.fireflyService.getMessages(50);
    const inboxMessages = [];

    for (const message of fireflyMessages) {
      if (message.data && message.data.length > 0 && !message.local) {
        try {
          const data = await this.fireflyService.retrieveData(message.data);
          const messageData = JSON.parse(data[0].value);
          
          if (messageData.type === 'STUDENT_BATCH_SUBMISSION_WITH_METADATA' && messageData.to === 'cardiff-met') {
            const existingMessage = await this.supabaseService.getMessageById(message.header.id);
            
            if (!existingMessage) {
              await this.supabaseService.createMessage({
                message_id: message.header.id,
                message_heading: `New Batch: ${messageData.batch.metadata.batch_name}`,
                sender: messageData.from,
                viewed_status: false,
                message_type: messageData.type,
                received_at: message.header.created
              });
            }

            const messageViewedStatus = existingMessage?.viewed_status || false;
            
            if (viewedFilter === null || messageViewedStatus === viewedFilter) {
              interface BatchMetadata {
                batch_name: string;
                academic_year: string;
                semester: string;
                faculty: string;
                contact_person: string;
                contact_email: string;
                notes?: string;
              }

              interface StudentDetails {
                student_id: string;
                first_name: string;
                last_name: string;
                email: string;
                course: string;
                graduation_date: string;
                gpa: number;
                university: string;
              }

              interface InboxMessage {
                messageId: string;
                heading: string;
                sender: string;
                receivedAt: string;
                viewed: boolean;
                processed: boolean;
                batchDetails: {
                  batchId: string;
                  batchName: string;
                  academicYear: string;
                  semester: string;
                  faculty: string;
                  contactPerson: string;
                  contactEmail: string;
                  notes?: string;
                };
                students: StudentDetails[];
                studentsCount: number;
              }

              inboxMessages.push({
                messageId: message.header.id,
                heading: `New Batch: ${messageData.batch.metadata.batch_name}`,
                sender: messageData.from,
                receivedAt: message.header.created,
                viewed: messageViewedStatus,
                processed: existingMessage?.processed || false,

                // Batch metadata for review
                batchDetails: {
                  batchId: messageData.batch.batch_id,
                  batchName: messageData.batch.metadata.batch_name,
                  academicYear: messageData.batch.metadata.academic_year,
                  semester: messageData.batch.metadata.semester,
                  faculty: messageData.batch.metadata.faculty,
                  contactPerson: messageData.batch.metadata.contact_person,
                  contactEmail: messageData.batch.metadata.contact_email,
                  notes: messageData.batch.metadata.notes
                },

                // Student details for Cardiff review
                students: messageData.batch.students.map((student: StudentDetails) => ({
                  student_id: student.student_id,
                  first_name: student.first_name,
                  last_name: student.last_name,
                  email: student.email,
                  course: student.course,
                  graduation_date: student.graduation_date,
                  gpa: student.gpa,
                  university: student.university
                })),

                studentsCount: messageData.batch.students.length
              } as InboxMessage);
            }
          }
        } catch (parseError) {
          console.warn('Could not parse message:', parseError);
        }
      }
    }

    res.json({
      success: true,
      messages: inboxMessages,
      count: inboxMessages.length,
      filter: {
        viewed: viewedFilter,
        appliedFilter: viewedFilter !== null ? `Showing ${viewedFilter ? 'viewed' : 'unviewed'} messages` : 'Showing all messages'
      }
    });
  } catch (error) {
    console.error('Error fetching inbox:', error);
    res.status(500).json({ error: 'Failed to fetch message inbox' });
  }
}


 
async processMessageAndIssueCertificates(req: Request, res: Response): Promise<void> {
  try {
    const { messageId } = req.body;
    console.log(`Processing message and issuing certificates: ${messageId}`);

    // Steps 1-2: Get message data and create batch details (same as before)
    const messages = await this.fireflyService.getMessages(100);
    const targetMessage = messages.find(m => m.header.id === messageId);

    if (!targetMessage) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    const data = await this.fireflyService.retrieveData(targetMessage.data);
    const messageData = JSON.parse(data[0].value);
    const batch = messageData.batch;

    // Ensure message exists in message_inbox table first
    const existingMessage = await this.supabaseService.getMessageById(messageId);
    if (!existingMessage) {
      await this.supabaseService.createMessage({
        message_id: messageId,
        message_heading: `New Batch: ${batch.metadata.batch_name}`,
        sender: messageData.from,
        viewed_status: false,
        message_type: messageData.type,
        received_at: targetMessage.header.created
      });
    }

    await this.supabaseService.createBatchDetails({
      batch_id: batch.batch_id,
      message_id: messageId,
      batch_name: batch.metadata.batch_name,
      academic_year: batch.metadata.academic_year,
      semester: batch.metadata.semester,
      faculty: batch.metadata.faculty,
      contact_person: batch.metadata.contact_person,
      contact_email: batch.metadata.contact_email
    });

    // 3. Process students: Generate PDFs and collect certificate hashes
    const certificateService = new CertificateService();
    const processedStudents = [];
    const certificateHashes = [];
    const studentCertificateMap = new Map(); // Track student -> certificate hash mapping

    for (const student of batch.students) {
      console.log(`Processing student: ${student.first_name} ${student.last_name}`);

      const certificateId = `CERT_${batch.batch_id}_${student.student_id}_${Date.now()}`;

      const certificateData = {
        studentId: student.student_id,
        studentName: `${student.first_name} ${student.last_name}`,
        course: student.course,
        gpa: student.gpa,
        graduationDate: student.graduation_date,
        university: student.university,
        batchId: batch.batch_id,
        batchName: batch.metadata.batch_name,
        academicYear: batch.metadata.academic_year,
        semester: batch.metadata.semester,
        faculty: batch.metadata.faculty,
        issuedBy: 'Cardiff Metropolitan University',
        issuedAt: new Date().toISOString(),
        certificateId: certificateId
      };

      // Generate PDF and certificate hash
      const pdfBuffer = await certificateService.generateModernCertificatePDF(certificateData);
      const certificateHash = certificateService.generateCertificateHash(pdfBuffer, student);

      // Store mapping for later use
      studentCertificateMap.set(student.student_id, {
        student,
        certificateId,
        certificateHash,
        pdfBuffer,
        certificateData
      });

      // Collect certificate hashes for Cardano submission
      certificateHashes.push(certificateHash);
    }

    // 4. Submit certificate hashes to Cardano FIRST and get transaction hash
    console.log('🔗 Submitting certificate hashes to Cardano blockchain...');
    const cardanoTxId = await this.cardanoService.submitCertificateHashesToCardano(
      batch.batch_id,
      batch.metadata.batch_name,
      certificateHashes,
      batch.metadata.academic_year,
      batch.metadata.semester,
      batch.metadata.faculty
    );

    console.log(`✅ Cardano transaction successful: ${cardanoTxId}`);

    // 5. NOW store student details with the REAL transaction hash
    const pdfDataRefs = [];
    
    for (const [studentId, data] of studentCertificateMap) {
      const { student, certificateId, certificateHash, pdfBuffer } = data;

      // Store student details with REAL Cardano transaction hash
      await this.supabaseService.createStudentDetails({
        student_id: student.student_id,
        batch_id: batch.batch_id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        course: student.course,
        graduation_date: student.graduation_date,
        gpa: student.gpa,
        certificate_hash: certificateHash,      
        transaction_hash: cardanoTxId,          
        certificate_id: certificateId,
        certificate_pdf: pdfBuffer.toString('base64'),
        certified_at: new Date().toISOString()
      });

      // Upload PDF to FireFly
      console.log(`Uploading PDF to FireFly for student: ${student.student_id}`);
      const pdfDataResponse = await this.fireflyService.uploadPDFBlob(pdfBuffer, {
        filename: `certificate_${student.student_id}.pdf`,
        studentId: student.student_id,
        certificateId: certificateId,
        metadata: {
          studentName: `${student.first_name} ${student.last_name}`,
          course: student.course,
          batchId: batch.batch_id,
          certificateHash: certificateHash
        }
      });

      // Store PDF data reference for messaging
      pdfDataRefs.push({
        student_id: student.student_id,
        student_name: `${student.first_name} ${student.last_name}`,
        certificate_id: certificateId,
        certificate_hash: certificateHash,
        pdf_data_id: pdfDataResponse.id,
        pdf_data_hash: pdfDataResponse.hash
      });

      processedStudents.push({
        student_id: student.student_id,
        name: `${student.first_name} ${student.last_name}`,
        certificate_hash: certificateHash,    
        transaction_hash: cardanoTxId,       
        certificate_id: certificateId,
        pdf_data_id: pdfDataResponse.id
      });
    }

    // 6. Update batch details with Cardano transaction
    await this.supabaseService.updateBatchCardanoTransaction(batch.batch_id, cardanoTxId);

    // 7. Mark message as processed
    await this.supabaseService.updateMessageStatus(messageId, true, true);

    // 8. Send PDF references to ICBT
    console.log('📤 Sending certificate PDF references to ICBT via private message...');
    await this.fireflyService.sendPrivateMessageWithPDFRefs({
      type: 'CERTIFICATE_PDFS_ISSUED',
      batch_id: batch.batch_id,
      batch_name: batch.metadata.batch_name,
      cardano_tx_id: cardanoTxId,
      total_certificates: pdfDataRefs.length,
      certificate_pdf_refs: pdfDataRefs,
      batch_details: {
        faculty: batch.metadata.faculty,
        academic_year: batch.metadata.academic_year,
        semester: batch.metadata.semester
      },
      from: 'cardiff-met',
      to: 'icbt-campus',
      issued_at: new Date().toISOString()
    }, 'icbt-campus');

    res.json({
      success: true,
      message: 'Certificates issued successfully with real Cardano transaction hash',
      batchId: batch.batch_id,
      batchName: batch.metadata.batch_name,
      studentsProcessed: processedStudents.length,
      cardanoTxId: cardanoTxId,
      blockchainExplorer: `https://${process.env.CARDANO_NETWORK === 'mainnet' ? '' : 'preprod.'}cardanoscan.io/transaction/${cardanoTxId}`,
      students: processedStudents
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message and issue certificates' });
  }
}



// Add to Cardiff controller
async downloadCertificatePDF(req: Request, res: Response): Promise<void> {
  try {
    const { certificateHash } = req.params;
    console.log(`Downloading PDF for certificate: ${certificateHash}`);

    // Get student record with PDF from database
    const student = await this.supabaseService.getStudentByHash(certificateHash);
    
    if (!student || !student.certificate_pdf) {
      res.status(404).json({ error: 'Certificate PDF not found' });
      return;
    }

    // Convert base64 back to PDF buffer
    const pdfBuffer = Buffer.from(student.certificate_pdf, 'base64');
    
    // Set PDF headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate_${student.student_id}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error(' Error downloading certificate PDF:', error);
    res.status(500).json({ error: 'Failed to download certificate PDF' });
  }
}


// Add to Cardiff controller
async getCertificatePDF(req: Request, res: Response): Promise<void> {
  try {
    const { certificateHash } = req.params;
    
    const student = await this.supabaseService.getStudentByHash(certificateHash);
    
    if (!student || !student.certificate_pdf) {
      res.status(404).json({ error: 'Certificate PDF not found' });
      return;
    }

    res.json({
      success: true,
      student: {
        studentId: student.student_id,
        studentName: `${student.first_name} ${student.last_name}`,
        course: student.course,
        certificateId: student.certificate_id
      },
      pdfBase64: student.certificate_pdf, 
      downloadUrl: `/api/cardiff/certificate/${certificateHash}/download`
    });
  } catch (error) {
    console.error(' Error getting certificate PDF:', error);
    res.status(500).json({ error: 'Failed to get certificate PDF' });
  }
}


  // Mark message as viewed
  async markMessageAsViewed(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.body;
      await this.supabaseService.updateMessageStatus(messageId, true, false);
      
      res.json({
        success: true,
        message: 'Message marked as viewed'
      });
    } catch (error) {
      console.error('Error marking message as viewed:', error);
      res.status(500).json({ error: 'Failed to mark message as viewed' });
    }
  }

  // Generate unique transaction hash for each student
  private generateTransactionHash(student: any): string {
    const studentData = `${student.student_id}-${student.first_name}-${student.last_name}-${Date.now()}`;
    return `tx_${createHash('sha256').update(studentData).digest('hex').substring(0, 16)}`;
  }



  async bulkVerifyStudents(req: Request, res: Response): Promise<void> {
    try {
      const { studentVerifications } = req.body;
      // studentVerifications: [{ studentId, verified, notes }]
      
      const results = [];
      for (const verification of studentVerifications) {
        try {
          // Process each student verification
          const result = await this.processStudentVerification(verification);
          results.push({ ...verification, result: 'success', data: result });
        } catch (error) {
          results.push({ 
            ...verification, 
            result: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }

      res.json({
        success: true,
        message: 'Bulk verification completed',
        results,
        successCount: results.filter(r => r.result === 'success').length,
        errorCount: results.filter(r => r.result === 'error').length
      });
    } catch (error) {
      console.error('❌ Error in bulk verification:', error);
      res.status(500).json({ error: 'Failed to perform bulk verification' });
    }
  }

  private async processStudentVerification(verification: any): Promise<any> {
   
  }

 async getReceivedBatches(req: Request, res: Response): Promise<void> {
  try {
    console.log('Fetching received batches at Cardiff Met...');
    const messages = await this.fireflyService.getMessages(100); 
    const receivedBatches = [];

    for (const message of messages) {
      if (message.data && message.data.length > 0 && !message.local) {
        try {
          const data = await this.fireflyService.retrieveData(message.data);
          const messageData = JSON.parse(data[0].value);
          
        
          if (['STUDENT_BATCH_SUBMISSION', 'STUDENT_BATCH_SUBMISSION_WITH_METADATA'].includes(messageData.type) && 
              messageData.to === 'cardiff-met') {
            receivedBatches.push({
              messageId: message.header.id,
              author: message.header.author,
              created: message.header.created,
              batch: messageData.batch,
              from: messageData.from,
              processed: false,
              messageType: messageData.type,
              hasMetadata: !!messageData.batch.metadata,
              summary: messageData.summary || null
            });
          }
        } catch (parseError) {
          console.warn('Could not parse message data:', parseError);
        }
      }
    }

    console.log(`Found ${receivedBatches.length} received batches`);
    res.json({ batches: receivedBatches });
  } catch (error) {
    console.error('Error fetching received batches:', error);
    res.status(500).json({ error: 'Failed to fetch received batches' });
  }
}


  async getBatchesWithMetadata(req: Request, res: Response): Promise<void> {
  try {
    console.log('Fetching batches with metadata from Cardiff...');
    
    const batches = await this.supabaseService.getAllBatchesWithMetadata();
    
    console.log(`Found ${batches.length} batches with metadata`);
    res.json({
      success: true,
      batches,
      count: batches.length,
      message: 'Batches with metadata retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching batches with metadata:', error);
    res.status(500).json({ error: 'Failed to fetch batches with metadata' });
  }
}


async getBatchFullDetails(req: Request, res: Response): Promise<void> {
  try {
    const { batchId } = req.params;
    console.log(`Fetching full details for batch: ${batchId}`);
    
    const batchDetails = await this.supabaseService.getBatchWithDetails(batchId);
    
    if (!batchDetails) {
      res.status(404).json({ error: 'Batch not found' });
      return;
    }
    
    console.log(`Retrieved full details for batch: ${batchId}`);
    res.json({
      success: true,
      batch: batchDetails,
      message: 'Batch details retrieved successfully'
    });
  } catch (error) {
    console.error(' Error fetching batch full details:', error);
    res.status(500).json({ error: 'Failed to fetch batch details' });
  }
}
  async getStoredStudents(req: Request, res: Response): Promise<void> {
    try {
      console.log('Fetching stored students at Cardiff...');
      
      const allStudents = await this.supabaseService.getStudentsByUniversity('icbt-campus');
      
      console.log(`Found ${allStudents.length} stored students`);
      res.json({ 
        students: allStudents,
        count: allStudents.length,
        message: 'Students retrieved successfully'
      });
    } catch (error) {
      console.error('error fetching stored students:', error);
      res.status(500).json({ error: 'Failed to fetch stored students' });
    }
  }


  async getCertifiedStudents(req: Request, res: Response): Promise<void> {
    try {
      console.log('🎓 Fetching certified students...');
      const certifiedStudents = await this.supabaseService.getCertifiedStudents();
      
      res.json({ 
        students: certifiedStudents,
        count: certifiedStudents.length
      });
    } catch (error) {
      console.error(' Error fetching certified students:', error);
      res.status(500).json({ error: 'Failed to fetch certified students' });
    }
  }

  async getPendingStudents(req: Request, res: Response): Promise<void> {
    try {
      console.log('Fetching pending students...');
      const pendingStudents = await this.supabaseService.getPendingStudents();
      
      console.log(`Found ${pendingStudents.length} pending students`);
      res.json({ 
        students: pendingStudents,
        count: pendingStudents.length,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error fetching pending students:', error);
      res.status(500).json({ error: 'Failed to fetch pending students' });
    }
  }

  async getBatchStudents(req: Request, res: Response): Promise<void> {
    try {
      const { batchId } = req.params;
      console.log(`Fetching students for batch: ${batchId}`);
      
      const students = await this.supabaseService.getStudentsByBatch(batchId);
      
      console.log(`Found ${students.length} students in batch ${batchId}`);
      res.json({
        batchId,
        students,
        count: students.length,
        message: 'Batch students retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching batch students:', error);
      res.status(500).json({ error: 'Failed to fetch batch students' });
    }
  }

  async updateBatchStatus(req: Request, res: Response): Promise<void> {
    try {
      const { batchId } = req.params;
      const { status, notes } = req.body;
      
      console.log(`Updating batch ${batchId} status to: ${status}`);
      
      await this.supabaseService.updateBatchStatus(batchId, status, notes);
      
      res.json({
        success: true,
        batchId,
        newStatus: status,
        notes,
        message: 'Batch status updated successfully'
      });
    } catch (error) {
      console.error('Error updating batch status:', error);
      res.status(500).json({ error: 'Failed to update batch status' });
    }
  }

  async testOrganizations(req: Request, res: Response): Promise<void> {
    try {
      console.log('Testing FireFly organizations from Cardiff...');
      
      const orgs = await this.fireflyService.getOrgs();
      console.log('Available organizations:', orgs);
      
      res.json({
        success: true,
        organizations: orgs.map(o => ({ name: o.name, did: o.did })),
        message: 'Organizations retrieved successfully'
      });
    } catch (error) {
      console.error('Error testing organizations:', error);
      res.status(500).json({ 
        error: 'Failed to test organizations', 
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
