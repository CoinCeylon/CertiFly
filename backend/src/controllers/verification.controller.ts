import { Request, Response } from 'express';
import { SupabaseService } from '../services/supabase.service';
import { CardanoService } from '../services/cardano.service';

export class VerificationController {
  private supabaseService: SupabaseService;
  private cardanoService: CardanoService;

  constructor() {
    this.supabaseService = new SupabaseService();
    this.cardanoService = new CardanoService();
  }

  async verifyCertificate(req: Request, res: Response): Promise<void> {
    try {
      const { certificateHash } = req.body;
      console.log(`Verifying certificate hash: ${certificateHash}`);

      if (!certificateHash) {
        res.status(400).json({ error: 'Certificate hash is required' });
        return;
      }

      // Step 1: Find student by certificate hash in Supabase
      const student = await this.supabaseService.getStudentByHash(certificateHash);

      if (!student) {
        console.log('Certificate not found in database');
        res.json({
          isValid: false,
          message: 'Certificate not found in university records',
          verificationSteps: {
            databaseCheck: false,
            blockchainCheck: false,
            hashMatch: false
          }
        });
        return;
      }

      console.log(`Certificate found in database for student: ${student.first_name} ${student.last_name}`);

      // Step 2: Get Cardano transaction ID from database
      const cardanoTxId = student.cardano_tx_id || 
                         (await this.getBatchCardanoTxId(student.batch_id));

      if (!cardanoTxId) {
        console.log(' No Cardano transaction ID found');
        res.json({
          isValid: false,
          message: 'Certificate not recorded on blockchain',
          verificationSteps: {
            databaseCheck: true,
            blockchainCheck: false,
            hashMatch: false
          }
        });
        return;
      }

      console.log(`🔗 Found Cardano transaction: ${cardanoTxId}`);

      // Step 3: Retrieve metadata from actual Cardano blockchain
      const blockchainMetadata = await this.cardanoService.getTransactionMetadata(cardanoTxId);

      if (!blockchainMetadata) {
        console.log(' Transaction not found on Cardano blockchain');
        res.json({
          isValid: false,
          message: 'Transaction not found on Cardano blockchain',
          verificationSteps: {
            databaseCheck: true,
            blockchainCheck: false,
            hashMatch: false
          }
        });
        return;
      }

      console.log('Retrieved metadata from Cardano blockchain');

      console.log('Raw blockchain metadata:', JSON.stringify(blockchainMetadata, null, 2));

      // Step 4: Extract certificate hashes from blockchain metadata
      const blockchainHashes = this.extractCertificateHashes(blockchainMetadata);

      console.log('📝 Extracted hashes from blockchain:', blockchainHashes);
console.log('🔍 Looking for hash:', certificateHash);
      
      // Step 5: Match the provided hash with blockchain hashes
      const hashMatch = blockchainHashes.includes(certificateHash);

      console.log(`🔐 Hash match result: ${hashMatch}`);

      // Step 6: Additional validations
      const batchMatch = this.validateBatchDetails(blockchainMetadata, student);
      const issuerValid = this.validateIssuer(blockchainMetadata);

      const isValid = hashMatch && batchMatch && issuerValid;

      // Step 7: Return comprehensive verification result
      res.json({
        isValid,
        certificate: isValid ? {
          studentName: `${student.first_name} ${student.last_name}`,
          studentId: student.student_id,
          course: student.course,
          gpa: student.gpa,
          graduationDate: student.graduation_date,
          university: student.university,
          batchName: student.batch_details?.batch_name,
          faculty: student.batch_details?.faculty,
          academicYear: student.batch_details?.academic_year,
          semester: student.batch_details?.semester,
          certificateId: student.certificate_id,
          issuedBy: 'Cardiff Metropolitan University',
          cardanoTxId: cardanoTxId,
          blockchainExplorer: `https://${process.env.CARDANO_NETWORK === 'mainnet' ? '' : 'preprod.'}cardanoscan.io/transaction/${cardanoTxId}`
        } : null,
        verificationSteps: {
          databaseCheck: !!student,
          blockchainCheck: !!blockchainMetadata,
          hashMatch: hashMatch,
          batchMatch: batchMatch,
          issuerValid: issuerValid
        },
        blockchainDetails: {
          transactionId: cardanoTxId,
          blockHeight: blockchainMetadata?.block_height,
          timestamp: blockchainMetadata?.block_time,
          confirmations: blockchainMetadata?.confirmations || 0
        },
        message: isValid ? 'Certificate is valid and verified on Cardano blockchain' : 'Certificate verification failed'
      });

    } catch (error) {
      console.error('❌ Error verifying certificate:', error);
      res.status(500).json({ 
        error: 'Failed to verify certificate',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Helper method to get batch Cardano transaction ID
  private async getBatchCardanoTxId(batchId: string): Promise<string | null> {
    try {
      const batchDetails = await this.supabaseService.getBatchDetails(batchId);
      return batchDetails?.cardano_transaction_id || null;
    } catch (error) {
      console.error('Error getting batch Cardano transaction ID:', error);
      return null;
    }
  }



private extractCertificateHashes(metadata: any): string[] {
  try {
    console.log('🔍 Extracting hashes from metadata structure...');
    
    let certificateData;
    
    // Check if metadata is wrapped in "674" key
    if (metadata['674']) {
      certificateData = metadata['674'];
      console.log('📦 Found metadata wrapped in "674" key');
    } else if (metadata.type === 'certificate-batch-hashes') {

      certificateData = metadata;
      console.log('📄 Found direct metadata format');
    } else if (Array.isArray(metadata) && metadata.length > 0) {
 
      const metadataItem = metadata.find(item => 
        item['674'] || item.type === 'certificate-batch-hashes'
      );
      certificateData = metadataItem?.['674'] || metadataItem;
      console.log('📋 Found metadata in array format');
    }
    
    if (!certificateData) {
      console.log('❌ No certificate data found in metadata');
      return [];
    }
    
    console.log('📄 Certificate data found:', JSON.stringify(certificateData, null, 2));
    
    // Extract hashes from the certificate data
    if (certificateData.hashes && Array.isArray(certificateData.hashes)) {
      console.log(`✅ Extracted ${certificateData.hashes.length} hashes`);
      return certificateData.hashes;
    }
    
    console.log('❌ No hashes array found in certificate data');
    return [];
  } catch (error) {
    console.error('❌ Error extracting certificate hashes:', error);
    return [];
  }
}


private validateBatchDetails(metadata: any, student: any): boolean {
  try {

    let certificateData;
    if (metadata['674']) {
      certificateData = metadata['674'];
    } else if (metadata.type === 'certificate-batch-hashes') {
      certificateData = metadata;
    }
    
    if (!certificateData) return false;

    // Validate batch information
    const batchMatch = certificateData.batch_id === student.batch_id;
    const issuerMatch = certificateData.issuer === 'Cardiff Metropolitan University';
    
    console.log(`🔍 Batch validation - batchMatch: ${batchMatch}, issuerMatch: ${issuerMatch}`);
    
    return batchMatch && issuerMatch;
  } catch (error) {
    console.error('Error validating batch details:', error);
    return false;
  }
}


private validateIssuer(metadata: any): boolean {
  try {
    let certificateData;
    if (metadata['674']) {
      certificateData = metadata['674'];
    } else if (metadata.type === 'certificate-batch-hashes') {
      certificateData = metadata;
    }
    
    const issuerValid = certificateData?.issuer === 'Cardiff Metropolitan University';
    const authorityValid = certificateData?.authority === 'Cardiff Met Academic Registry';
    
    console.log(`🔍 Issuer validation - issuer: ${issuerValid}, authority: ${authorityValid}`);
    
    return issuerValid && authorityValid;
  } catch (error) {
    console.error('Error validating issuer:', error);
    return false;
  }
}




  async searchCertificate(req: Request, res: Response): Promise<void> {
    try {
      const { studentId, firstName, lastName } = req.query;

      if (!studentId && (!firstName || !lastName)) {
        res.status(400).json({ 
          error: 'Either student ID or both first name and last name are required' 
        });
        return;
      }

      // Search in student_details table (updated from your schema)
      let matchedStudent: any = null;

      if (studentId) {
        matchedStudent = await this.supabaseService.getStudentById(studentId as string);
      } else {
        const students = await this.supabaseService.searchStudents(
          firstName as string, 
          lastName as string
        );
        matchedStudent = students.length > 0 ? students[0] : null;
      }

      if (matchedStudent && matchedStudent.certified_at) {
        res.json({
          found: true,
          certificate: {
            studentName: `${matchedStudent.first_name} ${matchedStudent.last_name}`,
            studentId: matchedStudent.student_id,
            course: matchedStudent.course,
            graduationDate: matchedStudent.graduation_date,
            university: matchedStudent.university || 'icbt-campus',
            certificateHash: matchedStudent.transaction_hash,
            certificateId: matchedStudent.certificate_id,
            issuedBy: 'Cardiff Metropolitan University',
            verificationUrl: `/api/verify/certificate/hash/${matchedStudent.transaction_hash}`
          }
        });
      } else {
        res.json({
          found: false,
          message: 'No certified student found with the provided information'
        });
      }
    } catch (error) {
      console.error('❌ Error searching certificate:', error);
      res.status(500).json({ error: 'Failed to search certificate' });
    }
  }

  // Get student certificate by ID
  async getStudentCertificate(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      
      const student = await this.supabaseService.getStudentById(studentId);
      
      if (!student || !student.certified_at) {
        res.status(404).json({ error: 'Certified student not found' });
        return;
      }

      res.json({
        success: true,
        certificate: {
          studentName: `${student.first_name} ${student.last_name}`,
          studentId: student.student_id,
          course: student.course,
          graduationDate: student.graduation_date,
          certificateHash: student.transaction_hash,
          certificateId: student.certificate_id,
          verificationUrl: `/api/verify/certificate`,
          downloadUrl: student.certificate_pdf ? `/api/cardiff/certificate/${student.transaction_hash}/download` : null
        }
      });
    } catch (error) {
      console.error('❌ Error getting student certificate:', error);
      res.status(500).json({ error: 'Failed to get student certificate' });
    }
  }
}
