import { Router } from 'express';
import { ICBTController } from '../controllers/icbt.controller';

const router = Router();
const icbtController = new ICBTController();


// ICBT CAMPUS ENDPOINTS


// Student Batch Management

router.post('/submit-batch-with-metadata', (req, res) => icbtController.submitStudentBatchWithMetadata(req, res));
router.get('/sent-batches', (req, res) => icbtController.getSentBatches(req, res));
router.get('/batch/:batchId/status', (req, res) => icbtController.getBatchStatus(req, res));

// Student Management
router.get('/students', (req, res) => icbtController.getStudents(req, res));
router.get('/student/:studentId/status', (req, res) => icbtController.getStudentStatus(req, res));

// Certificate Management (Received from Cardiff)
router.get('/certificates', (req, res) => icbtController.getReceivedCertificates(req, res));


router.get('/batch-details', icbtController.getAllBatchDetails.bind(icbtController));
// Add this line to your routes file
router.get('/debug/submissions', icbtController.debugSubmissionMessages.bind(icbtController));



// PDF DOWNLOAD ENDPOINTS


// Individual Student PDF Downloads
router.get('/download/student/:batchId/:studentId', (req, res) => icbtController.downloadStudentPDF(req, res));





// Test routes
router.get('/test/firefly', (req, res) => icbtController.testFireFlyConnection(req, res));



export default router;
