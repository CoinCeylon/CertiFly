// src/routes/certificate.routes.ts
import { Router, Request, Response } from 'express';
import { CertificateService, CertificateData } from '../services/certificate.service';


const router = Router();
const certificateService = new CertificateService();

// Generate Certificate (Download)
router.post('/generate-certificate', async (req: Request, res: Response) => {
  try {
    const certificateData: CertificateData = {
      studentId: req.body.studentId || 'CM2024001',
      studentName: req.body.studentName || 'John Michael Smith',
      course: req.body.course || 'Master of Science in Computer Science',
      gpa: req.body.gpa || 3.85,
      graduationDate: req.body.graduationDate || '2024-07-15',
      university: req.body.university || 'Cardiff Metropolitan University',
      batchId: req.body.batchId || 'BATCH2024CS01',
      batchName: req.body.batchName || 'Computer Science Cohort 2024',
      academicYear: req.body.academicYear || '2023-2024',
      semester: req.body.semester || 'Summer Semester',
      faculty: req.body.faculty || 'Technology',
      issuedBy: req.body.issuedBy || 'Academic Registry',
      issuedAt: req.body.issuedAt || new Date().toISOString(),
      certificateId: req.body.certificateId || `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    const pdfBuffer = await certificateService.generateModernCertificatePDF(certificateData);
    const certificateHash = certificateService.generateCertificateHash(pdfBuffer, {
      student_id: certificateData.studentId
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificateData.studentName.replace(/\s+/g, '-')}.pdf"`);
    res.setHeader('X-Certificate-Hash', certificateHash);
    
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Certificate generation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Certificate generation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Preview Certificate in Browser
router.get('/preview/:studentName?', async (req: Request, res: Response) => {
  try {
    const studentName = req.params.studentName || 'Sample Student Name';
    
    const sampleData: CertificateData = {
      studentId: 'CM2024PREVIEW',
      studentName: decodeURIComponent(studentName),
      course: 'Master of Science in Computer Science',
      gpa: 3.85,
      graduationDate: '2024-07-15',
      university: 'Cardiff Metropolitan University',
      batchId: 'BATCH2024CS01',
      batchName: 'Computer Science Cohort 2024',
      academicYear: '2023-2024',
      semester: 'Summer Semester',
      faculty: 'Technology',
      issuedBy: 'Academic Registry',
      issuedAt: new Date().toISOString(),
      certificateId: `PREVIEW-${Date.now()}`
    };

    const pdfBuffer = await certificateService.generateModernCertificatePDF(sampleData);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="certificate-preview.pdf"');
    
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Certificate preview failed:', error);
    res.status(500).json({
      success: false,
      message: 'Certificate preview failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Web Interface to View Certificate Template
router.get('/template-viewer', (req: Request, res: Response) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificate Template Viewer</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              padding: 20px;
          }
          
          .container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              border-radius: 15px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              overflow: hidden;
          }
          
          .header {
              background: linear-gradient(135deg, #003366 0%, #004080 100%);
              color: white;
              padding: 30px;
              text-align: center;
          }
          
          .header h1 {
              font-size: 2.5rem;
              margin-bottom: 10px;
              font-weight: 300;
          }
          
          .header p {
              opacity: 0.9;
              font-size: 1.1rem;
          }
          
          .content {
              padding: 40px;
          }
          
          .form-section {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 10px;
              margin-bottom: 30px;
          }
          
          .form-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 20px;
              margin-bottom: 20px;
          }
          
          .form-group {
              display: flex;
              flex-direction: column;
          }
          
          .form-group label {
              font-weight: 600;
              color: #003366;
              margin-bottom: 8px;
              font-size: 0.9rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
          }
          
          .form-group input, .form-group select {
              padding: 12px 15px;
              border: 2px solid #e1e5e9;
              border-radius: 8px;
              font-size: 1rem;
              transition: border-color 0.3s ease;
          }
          
          .form-group input:focus, .form-group select:focus {
              outline: none;
              border-color: #DAA520;
              box-shadow: 0 0 0 3px rgba(218, 165, 32, 0.1);
          }
          
          .button-group {
              display: flex;
              gap: 15px;
              justify-content: center;
              flex-wrap: wrap;
          }
          
          .btn {
              padding: 15px 30px;
              border: none;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 8px;
          }
          
          .btn-primary {
              background: linear-gradient(135deg, #003366 0%, #004080 100%);
              color: white;
          }
          
          .btn-secondary {
              background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
              color: #003366;
          }
          
          .btn-success {
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
              color: white;
          }
          
          .btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          
          .preview-section {
              text-align: center;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 10px;
              margin-top: 20px;
          }
          
          .preview-section h3 {
              color: #003366;
              margin-bottom: 20px;
              font-size: 1.5rem;
          }
          
          .certificate-frame {
              border: 3px solid #DAA520;
              border-radius: 10px;
              padding: 10px;
              background: white;
              display: inline-block;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          
          .features {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin-top: 30px;
          }
          
          .feature-card {
              background: white;
              padding: 25px;
              border-radius: 10px;
              border-left: 4px solid #DAA520;
              box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          }
          
          .feature-card h4 {
              color: #003366;
              margin-bottom: 10px;
              font-size: 1.2rem;
          }
          
          .feature-card p {
              color: #666;
              line-height: 1.6;
          }
          
          @media (max-width: 768px) {
              .container { margin: 10px; }
              .content { padding: 20px; }
              .form-grid { grid-template-columns: 1fr; }
              .button-group { flex-direction: column; }
              .btn { width: 100%; justify-content: center; }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🎓 Certificate Template Viewer</h1>
              <p>Cardiff Metropolitan University - Professional Certificate Generator</p>
          </div>
          
          <div class="content">
              <div class="form-section">
                  <h2 style="color: #003366; margin-bottom: 20px; text-align: center;">Customize Your Certificate</h2>
                  
                  <div class="form-grid">
                      <div class="form-group">
                          <label>Student Name</label>
                          <input type="text" id="studentName" placeholder="Enter full name" value="John Michael Smith">
                      </div>
                      
                      <div class="form-group">
                          <label>Course/Program</label>
                          <select id="course">
                              <option>Master of Science in Computer Science</option>
                              <option>Bachelor of Arts in Digital Media Design</option>
                              <option>Master of Business Administration</option>
                              <option>Bachelor of Engineering</option>
                              <option>Master of Arts in Education</option>
                              <option>Bachelor of Science in Psychology</option>
                          </select>
                      </div>
                      
                      <div class="form-group">
                          <label>Faculty</label>
                          <select id="faculty">
                              <option>Technology</option>
                              <option>Arts & Design</option>
                              <option>Business</option>
                              <option>Engineering</option>
                              <option>Education</option>
                              <option>Science</option>
                          </select>
                      </div>
                      
                      <div class="form-group">
                          <label>GPA (0.0 - 4.0)</label>
                          <input type="number" id="gpa" step="0.01" min="0" max="4" value="3.85">
                      </div>
                      
                      <div class="form-group">
                          <label>Academic Year</label>
                          <input type="text" id="academicYear" placeholder="e.g., 2023-2024" value="2023-2024">
                      </div>
                      
                      <div class="form-group">
                          <label>Semester</label>
                          <select id="semester">
                              <option>Spring Semester</option>
                              <option>Summer Semester</option>
                              <option>Fall Semester</option>
                              <option>Winter Semester</option>
                          </select>
                      </div>
                  </div>
                  
                  <div class="button-group">
                      <button class="btn btn-primary" onclick="previewCertificate()">
                          👁️ Preview Certificate
                      </button>
                      <button class="btn btn-secondary" onclick="downloadCertificate()">
                          📄 Download PDF
                      </button>
                      <button class="btn btn-success" onclick="generateWithAPI()">
                          🔗 Generate via API
                      </button>
                  </div>
              </div>
              
              <div class="preview-section">
                  <h3>Certificate Preview</h3>
                  <div class="certificate-frame">
                      <iframe id="certificatePreview" width="800" height="600" style="border: none; border-radius: 5px;">
                          Click "Preview Certificate" to see your template
                      </iframe>
                  </div>
              </div>
              
              <div class="features">
                  <div class="feature-card">
                      <h4>🔒 Blockchain Verified</h4>
                      <p>Every certificate is recorded on the Cardano blockchain for permanent verification and authenticity.</p>
                  </div>
                  
                  <div class="feature-card">
                      <h4>🎨 Professional Design</h4>
                      <p>Modern, elegant design with Cardiff Metropolitan University branding and professional typography.</p>
                  </div>
                  
                  <div class="feature-card">
                      <h4>📱 Digital Security</h4>
                      <p>Includes unique certificate IDs, hashes, and digital signatures for tamper-proof verification.</p>
                  </div>
                  
                  <div class="feature-card">
                      <h4>⚡ Instant Generation</h4>
                      <p>Generate certificates instantly via API or web interface with real-time preview capabilities.</p>
                  </div>
              </div>
          </div>
      </div>

      <script>
          function previewCertificate() {
              const studentName = document.getElementById('studentName').value || 'Sample Student';
              const previewUrl = '/api/certificates/preview/' + encodeURIComponent(studentName);
              document.getElementById('certificatePreview').src = previewUrl;
          }
          
          function downloadCertificate() {
              const formData = {
                  studentName: document.getElementById('studentName').value,
                  course: document.getElementById('course').value,
                  faculty: document.getElementById('faculty').value,
                  gpa: parseFloat(document.getElementById('gpa').value),
                  academicYear: document.getElementById('academicYear').value,
                  semester: document.getElementById('semester').value
              };
              
              fetch('/api/certificates/generate-certificate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
              })
              .then(response => response.blob())
              .then(blob => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'certificate-' + formData.studentName.replace(/\\s+/g, '-') + '.pdf';
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
              });
          }
          
          function generateWithAPI() {
              const formData = {
                  studentName: document.getElementById('studentName').value,
                  course: document.getElementById('course').value,
                  faculty: document.getElementById('faculty').value,
                  gpa: parseFloat(document.getElementById('gpa').value),
                  academicYear: document.getElementById('academicYear').value,
                  semester: document.getElementById('semester').value
              };
              
              fetch('/api/certificates/generate-certificate-info', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
              })
              .then(response => response.json())
              .then(data => {
                  alert('Certificate generated!\\nCertificate ID: ' + data.data.certificateId + '\\nBlockchain Hash: ' + data.data.certificateHash);
              });
          }
          
          // Auto-preview on page load
          window.onload = function() {
              previewCertificate();
          };
      </script>
  </body>
  </html>
  `;
  
  res.send(html);
});

// Quick test endpoint
router.get('/test', async (req: Request, res: Response) => {
    console.log('🔍 Quick test endpoint hit');
  try {
    const testData: CertificateData = {
      studentId: 'TEST001',
      studentName: 'Alice Johnson',
      course: 'Master of Business Administration',
      gpa: 3.75,
      graduationDate: '2024-08-01',
      university: 'Cardiff Metropolitan University',
      batchId: 'BATCH2024MBA01',
      batchName: 'MBA Cohort 2024',
      academicYear: '2023-2024',
      semester: 'Summer Semester',
      faculty: 'Business',
      issuedBy: 'Academic Registry',
      issuedAt: new Date().toISOString(),
      certificateId: `TEST-${Date.now()}`
    };

    const pdfBuffer = await certificateService.generateModernCertificatePDF(testData);
    const hash = certificateService.generateCertificateHash(pdfBuffer, { student_id: testData.studentId });

    res.json({
      success: true,
      message: 'Test certificate generated successfully',
      certificateId: testData.certificateId,
      hash: hash,
      size: pdfBuffer.length,
      previewUrl: `/api/certificates/preview/${encodeURIComponent(testData.studentName)}`,
      downloadUrl: `/api/certificates/generate-certificate`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
