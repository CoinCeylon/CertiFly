// src/services/certificate.service.ts
import jsPDF from 'jspdf';
import { createHash } from 'crypto';

export interface CertificateData {
  studentId: string;
  studentName: string;
  course: string;
  gpa: number;
  graduationDate: string;
  university: string;
  batchId: string;
  batchName: string;
  academicYear: string;
  semester: string;
  faculty: string;
  issuedBy: string;
  issuedAt: string;
  certificateId: string;
}

export class CertificateService {
  async generateModernCertificatePDF(certificateData: CertificateData): Promise<Buffer> {
    try {
      console.log(`📜 Generating professional PDF certificate for ${certificateData.studentName}`);

      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Professional color scheme
      const primaryBlue = '#003366';    // Deep navy blue
      const accentGold = '#DAA520';     // Professional gold
      const textDark = '#2C3E50';       // Professional dark gray
      const textLight = '#5D6D7E';      // Subtle gray
      const backgroundColor = '#F8F9FA'; // Off-white background

      // Set background
      doc.setFillColor(backgroundColor);
      doc.rect(0, 0, 297, 210, 'F');

      // === HEADER SECTION ===
      // Top border with gradient effect
      doc.setFillColor(primaryBlue);
      doc.rect(0, 0, 297, 8, 'F');
      doc.setFillColor(accentGold);
      doc.rect(0, 8, 297, 2, 'F');

      // University name header
      doc.setTextColor(primaryBlue);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('CARDIFF METROPOLITAN UNIVERSITY', 148.5, 25, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textLight);
      doc.text('Academic Registry & Student Records', 148.5, 32, { align: 'center' });

      // === CERTIFICATE TITLE ===
      // Title background with subtle shadow effect
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(60, 45, 177, 20, 2, 2, 'F');
      doc.setDrawColor(accentGold);
      doc.setLineWidth(0.5);
      doc.roundedRect(60, 45, 177, 20, 2, 2);

      doc.setTextColor(primaryBlue);
      doc.setFontSize(28);
      doc.setFont('times', 'bold');
      doc.text('CERTIFICATE OF COMPLETION', 148.5, 58, { align: 'center' });

      // Decorative elements
      doc.setDrawColor(accentGold);
      doc.setLineWidth(1);
      doc.line(80, 70, 217, 70);
      
      // Small decorative diamonds
      for (let i = 0; i < 5; i++) {
        const x = 125 + (i * 12);
        doc.setFillColor(accentGold);
        doc.rect(x, 68, 2, 4, 'F');
      }

      // === MAIN CONTENT ===
      doc.setTextColor(textDark);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('This is to certify that', 148.5, 85, { align: 'center' });

      // Student name with elegant styling
      doc.setFillColor(250, 250, 255);
      doc.roundedRect(70, 90, 157, 15, 1, 1, 'F');
      
      doc.setTextColor(primaryBlue);
      doc.setFontSize(26);
      doc.setFont('times', 'bold');
      doc.text(certificateData.studentName.toUpperCase(), 148.5, 100, { align: 'center' });

      // Course completion text
      doc.setTextColor(textDark);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'normal');
      doc.text('has successfully completed the degree program in', 148.5, 112, { align: 'center' });

      // Course name
      doc.setTextColor(primaryBlue);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(certificateData.course, 148.5, 125, { align: 'center' });

      // Academic details section
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(50, 135, 197, 25, 2, 2, 'F');
      
      doc.setTextColor(textDark);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Faculty of ${certificateData.faculty}`, 148.5, 145, { align: 'center' });
      doc.text(`Academic Year: ${certificateData.academicYear} • ${certificateData.semester}`, 148.5, 152, { align: 'center' });
      
      // GPA with distinction
      const gpaText = `Grade Point Average: ${certificateData.gpa}/4.0`;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(accentGold);
      doc.text(gpaText, 148.5, 159, { align: 'center' });

      // Graduation date
      doc.setTextColor(textDark);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      const graduationText = `Conferred on ${new Date(certificateData.graduationDate).toLocaleDateString('en-GB', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      })}`;
      doc.text(graduationText, 148.5, 170, { align: 'center' });

      // === BLOCKCHAIN VERIFICATION SECTION (MANDATORY) ===
      // Prominent blockchain verification box
      doc.setFillColor(primaryBlue);
      doc.roundedRect(60, 175, 177, 15, 2, 2, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('BLOCKCHAIN VERIFIED CERTIFICATE', 148.5, 182, { align: 'center' });
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('This certificate is recorded on the Cardano blockchain for verification', 148.5, 187, { align: 'center' });

      // === FOOTER SECTION ===
      // Footer background
      doc.setFillColor(245, 245, 245);
      doc.rect(0, 192, 297, 18, 'F');

      // Certificate metadata
      doc.setTextColor(textLight);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      // Left side
      doc.text(`Certificate ID: C_${certificateData.studentId}`, 15, 198);
      doc.text(`Batch: ${certificateData.batchName}`, 15, 203);
      
      // Right side
      doc.text(`Student ID: ${certificateData.studentId}`, 200, 198);
      doc.text(`Issued: ${new Date(certificateData.issuedAt).toLocaleDateString('en-GB')}`, 200, 203);

      // Digital signature section
      doc.setTextColor(textDark);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('Digitally Verified & Authenticated by Cardiff Metropolitan University', 148.5, 198, { align: 'center' });
      
      // Security features notice
      doc.setFontSize(7);
      doc.setTextColor(textLight);
      doc.text('This document contains security features and blockchain verification for authenticity', 148.5, 203, { align: 'center' });

      // Bottom border
      doc.setFillColor(accentGold);
      doc.rect(0, 208, 297, 2, 'F');

      // Convert to buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      console.log(`✅ Professional PDF certificate generated for ${certificateData.studentName}`);
      
      return pdfBuffer;
    } catch (error) {
      console.error('❌ Error generating professional PDF certificate:', error);
      throw new Error('Failed to generate professional PDF certificate');
    }
  }

  generateCertificateHash(pdfBuffer: Buffer, studentData: any): string {
    try {
      // Create hash from PDF content ONLY
      const hash = createHash('sha256')
        .update(pdfBuffer)  // Use raw PDF buffer directly
        .digest('hex');

      console.log(`🔐 Certificate hash generated for ${studentData.student_id}: ${hash}`);
      return hash;
    } catch (error) {
      console.error('❌ Error generating certificate hash:', error);
      throw new Error('Failed to generate certificate hash');
    }
  }
}
