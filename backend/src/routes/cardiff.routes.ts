import { Router } from 'express';
import { CardiffController } from '../controllers/cardiff.controller';

const router = Router();
const cardiffController = new CardiffController();


// CARDIFF MET ENDPOINTS
router.get('/received-batches', (req, res) => cardiffController.getReceivedBatches(req, res));
router.post('/process-batch', (req, res) => cardiffController.processBatch(req, res));
router.get('/stored-students', (req, res) => cardiffController.getStoredStudents(req, res));
router.post('/bulk-verify', (req, res) => cardiffController.bulkVerifyStudents(req, res));
router.get('/certified-students', (req, res) => cardiffController.getCertifiedStudents(req, res));
router.get('/pending-students', (req, res) => cardiffController.getPendingStudents(req, res));
router.get('/batch/:batchId/students', (req, res) => cardiffController.getBatchStudents(req, res));
router.get('/batches-with-metadata', (req, res) => cardiffController.getBatchesWithMetadata(req, res));
router.get('/batch/:batchId/full-details', (req, res) => cardiffController.getBatchFullDetails(req, res));
router.get('/inbox', (req, res) => cardiffController.getMessageInbox(req, res));
router.post('/process-message', (req, res) => cardiffController.processMessageAndIssueCertificates(req, res));
router.post('/mark-viewed', (req, res) => cardiffController.markMessageAsViewed(req, res));
router.get('/certificate/:certificateHash/download', (req, res) => cardiffController.downloadCertificatePDF(req, res));
router.get('/certificate/:certificateHash/pdf', (req, res) => cardiffController.getCertificatePDF(req, res));

// Test routes
router.get('/test/organizations', (req, res) => cardiffController.testOrganizations(req, res));

export default router;
