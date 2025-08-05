"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICBTController = void 0;
const firefly_service_1 = require("../services/firefly.service");
const supabase_service_1 = require("../services/supabase.service");
class ICBTController {
    constructor() {
        this.fireflyService = new firefly_service_1.FireFlyService(process.env.ICBT_FIREFLY_URL);
        this.supabaseService = new supabase_service_1.SupabaseService();
    }
    async submitStudentBatchWithMetadata(req, res) {
        try {
            console.log('📥 Received student batch submission with metadata from ICBT');
            const { metadata, students } = req.body;
            // Validate batch metadata
            if (!metadata) {
                console.log('No batch metadata provided');
                res.status(400).json({ error: 'Batch metadata is required' });
                return;
            }
            // Validate required metadata fields
            const requiredFields = ['batch_name', 'academic_year', 'semester', 'graduation_ceremony_date', 'faculty', 'contact_person', 'contact_email'];
            const missingFields = requiredFields.filter(field => !metadata[field]);
            if (missingFields.length > 0) {
                res.status(400).json({
                    error: 'Missing required metadata fields',
                    missingFields
                });
                return;
            }
            // Validate students array
            if (!students || students.length === 0) {
                console.log('No students provided in batch');
                res.status(400).json({ error: 'At least one student is required in the batch' });
                return;
            }
            const studentErrors = [];
            students.forEach((student, index) => {
                const requiredStudentFields = ['student_id', 'first_name', 'last_name', 'email', 'course', 'graduation_date', 'gpa'];
                const missingStudentFields = requiredStudentFields.filter(field => !student[field]);
                if (missingStudentFields.length > 0) {
                    studentErrors.push({ studentIndex: index, missingFields: missingStudentFields });
                }
            });
            if (studentErrors.length > 0) {
                res.status(400).json({
                    error: 'Invalid student data',
                    studentErrors
                });
                return;
            }
            console.log(`Processing batch "${metadata.batch_name}" with ${students.length} students from ICBT`);
            // Create enhanced batch record
            const batch = {
                batch_id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                submitted_by: 'icbt-campus',
                submitted_at: new Date().toISOString(),
                metadata: metadata,
                students: students.map(s => ({
                    ...s,
                    university: 'icbt-campus',
                    status: 'pending'
                }))
            };
            console.log(`Created batch: ${batch.batch_id} - "${metadata.batch_name}"`);
            // Send private message to Cardiff Met via FireFly
            try {
                console.log('Sending private message to Cardiff Met via FireFly...');
                await this.fireflyService.sendPrivateMessage({
                    type: 'STUDENT_BATCH_SUBMISSION_WITH_METADATA',
                    batch: batch,
                    from: 'icbt-campus',
                    to: 'cardiff-met',
                    summary: {
                        batchName: metadata.batch_name,
                        academicYear: metadata.academic_year,
                        semester: metadata.semester,
                        faculty: metadata.faculty,
                        studentsCount: students.length,
                        contactPerson: metadata.contact_person
                    }
                }, 'cardiff-met');
                console.log('Private message sent successfully to Cardiff Met');
            }
            catch (fireflyError) {
                console.error(' FireFly error:', fireflyError);
                throw new Error(`Failed to send message to Cardiff Met: ${fireflyError}`);
            }
            res.json({
                success: true,
                message: `Student batch "${metadata.batch_name}" submitted successfully to Cardiff Met via FireFly`,
                batchId: batch.batch_id,
                batchName: metadata.batch_name,
                studentsCount: students.length,
                academicYear: metadata.academic_year,
                semester: metadata.semester,
                sentTo: 'cardiff-met',
                submittedAt: batch.submitted_at
            });
        }
        catch (error) {
            console.error('Error submitting student batch with metadata:', error);
            res.status(500).json({
                error: 'Failed to submit student batch',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async getStudents(req, res) {
        try {
            console.log('Fetching ICBT students...');
            res.json({
                students: [],
                message: 'ICBT sends students directly to Cardiff via FireFly. Check sent batches for submission history.',
                note: 'Students are not stored locally at ICBT campus'
            });
        }
        catch (error) {
            console.error('Error fetching students:', error);
            res.status(500).json({ error: 'Failed to fetch students' });
        }
    }
    async getSentBatches(req, res) {
        try {
            console.log('Fetching sent batches from ICBT...');
            // Get messages sent by ICBT via FireFly
            const messages = await this.fireflyService.getMessages(50);
            // Filter messages sent by ICBT
            const sentBatches = [];
            for (const message of messages) {
                if (message.data && message.data.length > 0 && message.local) { // local = sent by this node
                    try {
                        const data = await this.fireflyService.retrieveData(message.data);
                        const messageData = JSON.parse(data[0].value);
                        console.log('🔍 Checking message data:', messageData);
                        if (messageData.type === 'STUDENT_BATCH_SUBMISSION_WITH_METADATA' && messageData.from === 'icbt-campus') {
                            sentBatches.push({
                                messageId: message.header.id,
                                batchId: messageData.batch.batch_id,
                                batchName: messageData.batch.metadata.batch_name,
                                studentsCount: messageData.batch.students.length,
                                sentAt: message.header.created,
                                sentTo: messageData.to,
                                faculty: messageData.batch.metadata.faculty,
                                academicYear: messageData.batch.metadata.academic_year,
                                semester: messageData.batch.metadata.semester,
                                status: 'sent'
                            });
                        }
                    }
                    catch (parseError) {
                        console.warn('Could not parse message data:', parseError);
                    }
                }
            }
            console.log(`Found ${sentBatches.length} sent batches`);
            res.json({
                success: true,
                batches: sentBatches,
                count: sentBatches.length
            });
        }
        catch (error) {
            console.error('Error fetching sent batches:', error);
            res.status(500).json({ error: 'Failed to fetch sent batches' });
        }
    }
    async getStudentStatus(req, res) {
        try {
            const { studentId } = req.params;
            console.log(`Checking status for student: ${studentId}`);
            // Try to get student status from Cardiff (where students are processed)
            try {
                const student = await this.supabaseService.getStudentById(studentId);
                if (student) {
                    res.json({
                        studentId,
                        status: student.status,
                        firstName: student.first_name,
                        lastName: student.last_name,
                        course: student.course,
                        university: student.university,
                        certificateHash: student.certificate_hash,
                        cardanoTxId: student.cardano_tx_id,
                        lastUpdated: student.updated_at
                    });
                }
                else {
                    res.json({
                        studentId,
                        status: 'not_found',
                        message: 'Student not found. Please check if the batch has been processed by Cardiff Met.'
                    });
                }
            }
            catch (dbError) {
                // If database query fails, return basic status
                res.json({
                    studentId,
                    status: 'submitted',
                    message: 'Student batch submitted to Cardiff Met via FireFly',
                    note: 'Status tracking requires Cardiff Met to process the batch first'
                });
            }
        }
        catch (error) {
            console.error('Error checking student status:', error);
            res.status(500).json({ error: 'Failed to check student status' });
        }
    }
    async getBatchStatus(req, res) {
        try {
            const { batchId } = req.params;
            console.log(`🔍 Checking status for batch: ${batchId}`);
            // Try to get batch status from database
            try {
                const batchStats = await this.supabaseService.getBatchStatistics(batchId);
                if (batchStats) {
                    res.json({
                        success: true,
                        batchId,
                        statistics: batchStats,
                        message: 'Batch status retrieved successfully'
                    });
                }
                else {
                    res.json({
                        success: false,
                        batchId,
                        status: 'not_processed',
                        message: 'Batch not yet processed by Cardiff Met',
                        note: 'Check sent batches to confirm submission'
                    });
                }
            }
            catch (dbError) {
                res.json({
                    success: false,
                    batchId,
                    status: 'unknown',
                    message: 'Batch status unavailable. Please check with Cardiff Met.',
                    error: dbError instanceof Error ? dbError.message : 'Unknown error'
                });
            }
        }
        catch (error) {
            console.error('❌ Error checking batch status:', error);
            res.status(500).json({ error: 'Failed to check batch status' });
        }
    }
    async testFireFlyConnection(req, res) {
        try {
            console.log('Testing ICBT FireFly connection...');
            console.log('FireFly URL:', process.env.ICBT_FIREFLY_URL);
            const orgs = await this.fireflyService.getOrgs();
            res.json({
                success: true,
                fireflyUrl: process.env.ICBT_FIREFLY_URL,
                organizations: orgs.map(o => ({ name: o.name, did: o.did })),
                message: 'ICBT FireFly connection successful'
            });
        }
        catch (error) {
            console.error('ICBT FireFly connection failed:', error);
            res.status(500).json({
                error: 'ICBT FireFly connection failed',
                details: error instanceof Error ? error.message : 'Unknown error',
                fireflyUrl: process.env.ICBT_FIREFLY_URL
            });
        }
    }
    async downloadStudentPDF(req, res) {
        try {
            const { studentId, batchId } = req.params;
            console.log(`Downloading PDF for student: ${studentId} in batch: ${batchId}`);
            // Fallback: Get PDF from database
            console.log(` Attempting database fallback for student: ${studentId} in batch: ${batchId}`);
            const studentDetails = await this.supabaseService.getStudentDetails(studentId, batchId);
            if (studentDetails && studentDetails.certificate_pdf) {
                console.log(`Found PDF in database for student: ${studentId}`);
                // Convert base64 to buffer
                const pdfBuffer = Buffer.from(studentDetails.certificate_pdf, 'base64');
                // Set PDF headers for download
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="certificate_${studentDetails.first_name}_${studentDetails.last_name}.pdf"`);
                res.setHeader('Content-Length', pdfBuffer.length);
                // Send PDF
                res.send(pdfBuffer);
                return;
            }
            res.status(404).json({ error: 'Student certificate PDF not found in FireFly or database' });
        }
        catch (error) {
            console.error('Error downloading student PDF:', error);
            res.status(500).json({ error: 'Failed to download student PDF' });
        }
    }
    async getReceivedCertificates(req, res) {
        try {
            console.log('Fetching comprehensive batch status from ICBT submissions and Cardiff responses...');
            // Get both types of messages
            const [receivedMessages, sentMessages] = await Promise.all([
                this.fireflyService.getPrivateMessages(100), // Cardiff → ICBT (certificate messages)
                this.fireflyService.getMessages(100) // ICBT → Cardiff (submission messages)
            ]);
            const submissionMap = new Map();
            const certificates = [];
            console.log(`Processing ${sentMessages.length} sent messages and ${receivedMessages.length} received messages`);
            // 1. First, collect all ICBT submissions (same as before)
            for (const message of sentMessages) {
                if (message.local) {
                    try {
                        const data = await this.fireflyService.retrieveData(message.data);
                        if (data && data.length > 0 && data[0].value) {
                            const messageData = JSON.parse(data[0].value);
                            console.log(`🔍 Checking sent message: ${message.header.id}`, {
                                type: messageData.type,
                                hasBatch: !!messageData.batch,
                                hasMetadata: !!messageData.metadata,
                                hasStudents: !!messageData.students
                            });
                            // Look for batch submission messages - be more flexible
                            let batchInfo = null;
                            if (messageData.batch && messageData.batch.batch_id) {
                                batchInfo = {
                                    batchId: messageData.batch.batch_id,
                                    batchName: messageData.batch.metadata.batch_name,
                                    faculty: messageData.batch.metadata.faculty,
                                    academicYear: messageData.batch.metadata.academic_year,
                                    semester: messageData.batch.metadata.semester,
                                    students: messageData.batch.students
                                };
                            }
                            else if (messageData.metadata && messageData.students) {
                                const generatedId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                                batchInfo = {
                                    batchId: generatedId,
                                    batchName: messageData.metadata.batch_name,
                                    faculty: messageData.metadata.faculty,
                                    academicYear: messageData.metadata.academic_year,
                                    semester: messageData.metadata.semester,
                                    students: messageData.students
                                };
                            }
                            else if (messageData.batchId || messageData.batch_id) {
                                batchInfo = {
                                    batchId: messageData.batchId || messageData.batch_id,
                                    batchName: messageData.batchName || messageData.batch_name,
                                    faculty: messageData.faculty,
                                    academicYear: messageData.academic_year || messageData.academicYear,
                                    semester: messageData.semester,
                                    students: messageData.students || []
                                };
                            }
                            if (batchInfo && batchInfo.students && batchInfo.students.length > 0) {
                                console.log(`Found submission: ${batchInfo.batchName} with ${batchInfo.students.length} students`);
                                submissionMap.set(batchInfo.batchId, {
                                    batchId: batchInfo.batchId,
                                    batchName: batchInfo.batchName,
                                    faculty: batchInfo.faculty,
                                    academicYear: batchInfo.academicYear,
                                    semester: batchInfo.semester,
                                    submittedAt: message.header.created,
                                    submissionMessageId: message.header.id,
                                    originalStudentsCount: batchInfo.students.length,
                                    submittedStudents: batchInfo.students.map((s) => ({
                                        student_id: s.student_id,
                                        name: `${s.first_name} ${s.last_name}`,
                                        course: s.course,
                                        gpa: s.gpa,
                                        submitted: true
                                    })),
                                    status: 'submitted'
                                });
                            }
                        }
                    }
                    catch (parseError) {
                        console.warn('Error parsing submission message:', parseError);
                    }
                }
            }
            console.log(`Found ${submissionMap.size} submitted batches`);
            for (const message of receivedMessages) {
                if (!message.local && message.data && message.data.length > 0) {
                    try {
                        const data = await this.fireflyService.retrieveData(message.data);
                        if (data && data.length > 0 && data[0].value) {
                            const messageData = JSON.parse(data[0].value);
                            // Look for certificate issuance messages from Cardiff
                            if (messageData.type === 'CERTIFICATE_PDFS_ISSUED' &&
                                messageData.from === 'cardiff-met' &&
                                messageData.to === 'icbt-campus') {
                                const submissionInfo = submissionMap.get(messageData.batch_id);
                                console.log(`Processing certificate message for batch: ${messageData.batch_id}`);
                                const studentsWithCertificates = messageData.certificate_pdf_refs?.map((cert) => ({
                                    student_id: cert.student_id,
                                    name: cert.student_name,
                                    certificate_id: cert.certificate_id,
                                    certificate_hash: cert.certificate_hash,
                                    pdf_data_id: cert.pdf_data_id,
                                    pdf_data_hash: cert.pdf_data_hash,
                                    transaction_hash: messageData.cardano_tx_id,
                                    certificateReceived: true,
                                    submitted: submissionInfo?.submittedStudents.some((s) => s.student_id === cert.student_id) || false
                                })) || [];
                                // Calculate status based on submission vs certificates received
                                let batchStatus = 'unknown';
                                let progressPercentage = 0;
                                let processingTime = null;
                                if (submissionInfo) {
                                    const originalCount = submissionInfo.originalStudentsCount;
                                    const receivedCount = studentsWithCertificates.length;
                                    progressPercentage = Math.round((receivedCount / originalCount) * 100);
                                    if (receivedCount === originalCount) {
                                        batchStatus = 'completed';
                                    }
                                    else if (receivedCount > 0) {
                                        batchStatus = 'partially_completed';
                                    }
                                    else {
                                        batchStatus = 'processing';
                                    }
                                    const submittedTime = new Date(submissionInfo.submittedAt);
                                    const issuedTime = new Date(messageData.issued_at);
                                    const diffMs = issuedTime.getTime() - submittedTime.getTime();
                                    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
                                    const diffDays = Math.floor(diffHours / 24);
                                    if (diffDays > 0) {
                                        processingTime = `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours % 24}h`;
                                    }
                                    else {
                                        processingTime = `${diffHours}h`;
                                    }
                                    submissionMap.set(messageData.batch_id, {
                                        ...submissionInfo,
                                        status: batchStatus,
                                        certificatesReceived: receivedCount,
                                        pendingCertificates: originalCount - receivedCount,
                                        progressPercentage: progressPercentage,
                                        processingTime: processingTime,
                                        issuedAt: messageData.issued_at,
                                        receivedAt: message.header.created,
                                        cardanoTxId: messageData.cardano_tx_id,
                                        certificateMessageId: message.header.id
                                    });
                                }
                                else {
                                    batchStatus = 'certificates_issued';
                                }
                                // Add to certificates array
                                certificates.push({
                                    messageId: message.header.id,
                                    batchId: messageData.batch_id,
                                    batchName: messageData.batch_name,
                                    studentsCount: messageData.total_certificates,
                                    students: studentsWithCertificates,
                                    cardanoTxId: messageData.cardano_tx_id,
                                    batchDetails: {
                                        faculty: messageData.batch_details?.faculty || submissionInfo?.faculty,
                                        academic_year: messageData.batch_details?.academic_year || submissionInfo?.academicYear,
                                        semester: messageData.batch_details?.semester || submissionInfo?.semester
                                    },
                                    issuedAt: messageData.issued_at,
                                    receivedAt: message.header.created,
                                    // Enhanced status tracking
                                    status: batchStatus,
                                    submittedAt: submissionInfo?.submittedAt,
                                    submissionMessageId: submissionInfo?.submissionMessageId,
                                    originalStudentsCount: submissionInfo?.originalStudentsCount || messageData.total_certificates,
                                    certificatesReceived: studentsWithCertificates.length,
                                    pendingCertificates: Math.max(0, (submissionInfo?.originalStudentsCount || messageData.total_certificates) - studentsWithCertificates.length),
                                    progressPercentage: progressPercentage,
                                    processingTime: processingTime
                                });
                            }
                        }
                    }
                    catch (parseError) {
                        console.warn('Error parsing certificate message:', parseError);
                    }
                }
            }
            // 3. Add submitted batches that haven't received certificates yet
            for (const [batchId, submission] of submissionMap) {
                if (!certificates.find(cert => cert.batchId === batchId)) {
                    console.log(`📝 Adding submitted batch without certificates: ${submission.batchName}`);
                    certificates.push({
                        messageId: null,
                        batchId: batchId,
                        batchName: submission.batchName,
                        studentsCount: submission.originalStudentsCount,
                        students: submission.submittedStudents.map((s) => ({
                            ...s,
                            certificate_id: null,
                            certificate_hash: null,
                            pdf_data_id: null,
                            transaction_hash: null,
                            certificateReceived: false
                        })),
                        cardanoTxId: null,
                        batchDetails: {
                            faculty: submission.faculty,
                            academic_year: submission.academicYear,
                            semester: submission.semester
                        },
                        issuedAt: null,
                        receivedAt: null,
                        // Status for submitted but not processed
                        status: 'submitted',
                        submittedAt: submission.submittedAt,
                        submissionMessageId: submission.submissionMessageId,
                        originalStudentsCount: submission.originalStudentsCount,
                        certificatesReceived: 0,
                        pendingCertificates: submission.originalStudentsCount,
                        progressPercentage: 0,
                        processingTime: null
                    });
                }
            }
            const enhancedStats = {
                totalBatches: certificates.length,
                submitted: certificates.filter(c => c.status === 'submitted').length,
                processing: certificates.filter(c => c.status === 'processing').length,
                completed: certificates.filter(c => c.status === 'completed').length,
                partiallyCompleted: certificates.filter(c => c.status === 'partially_completed').length,
                totalStudents: certificates.reduce((sum, c) => sum + (c.originalStudentsCount || c.studentsCount), 0),
                totalCertificatesReceived: certificates.reduce((sum, c) => sum + (c.certificatesReceived || 0), 0),
                averageProcessingTime: this.calculateAverageProcessingTime(certificates.filter(c => c.processingTime))
            };
            // Sort by most recent activity
            certificates.sort((a, b) => {
                const dateA = new Date(a.submittedAt || a.receivedAt || a.issuedAt || '');
                const dateB = new Date(b.submittedAt || b.receivedAt || b.issuedAt || '');
                return dateB.getTime() - dateA.getTime();
            });
            console.log(`📋 Enhanced tracking: ${certificates.length} batches found`);
            console.log(`📊 Stats: ${enhancedStats.submitted} submitted, ${enhancedStats.processing} processing, ${enhancedStats.completed} completed`);
            res.json({
                success: true,
                certificates,
                count: certificates.length,
                enhancedStats
            });
        }
        catch (error) {
            console.error('❌ Error fetching enhanced certificate status:', error);
            res.status(500).json({ error: 'Failed to fetch comprehensive batch status' });
        }
    }
    async debugSubmissionMessages(req, res) {
        try {
            console.log('🔍 Debugging ALL messages (not just local)...');
            const messages = await this.fireflyService.getMessages(100);
            const debugInfo = [];
            const submissionMessages = [];
            for (const message of messages) {
                const messageInfo = {
                    messageId: message.header.id,
                    created: message.header.created,
                    author: message.header.author,
                    local: message.local,
                    hasData: message.data && message.data.length > 0,
                    messageType: undefined,
                    from: undefined,
                    to: undefined,
                    batchName: undefined,
                    studentsCount: undefined,
                    rawStructure: undefined
                };
                if (message.data && message.data.length > 0) {
                    try {
                        const data = await this.fireflyService.retrieveData(message.data);
                        const messageData = JSON.parse(data[0].value);
                        messageInfo.messageType = messageData.type;
                        messageInfo.from = messageData.from;
                        messageInfo.to = messageData.to;
                        messageInfo.batchName = messageData.batch?.metadata?.batch_name || messageData.metadata?.batch_name;
                        messageInfo.studentsCount = messageData.batch?.students?.length || messageData.students?.length;
                        messageInfo.rawStructure = Object.keys(messageData);
                        if (messageData.from === 'icbt-campus' ||
                            messageData.type === 'STUDENT_BATCH_SUBMISSION_WITH_METADATA' ||
                            messageInfo.author?.includes('icbt')) {
                            submissionMessages.push({
                                ...messageInfo,
                                fullData: messageData
                            });
                        }
                    }
                    catch (e) {
                        messageInfo.parseError = typeof e === 'object' && e !== null && 'message' in e ? e.message : String(e);
                    }
                }
                debugInfo.push(messageInfo);
            }
            res.json({
                success: true,
                totalMessages: messages.length,
                totalLocalMessages: messages.filter(m => m.local).length,
                totalICBTSubmissions: submissionMessages.length,
                debugInfo: debugInfo.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()),
                icbtSubmissions: submissionMessages,
                organizationInfo: {
                    currentNode: process.env.ICBT_FIREFLY_URL,
                    expectedAuthor: 'icbt-campus'
                }
            });
        }
        catch (error) {
            console.error('❌ Error debugging messages:', error);
            res.status(500).json({
                error: 'Failed to debug messages',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async getAllBatchDetails(req, res) {
        try {
            console.log('📊 Fetching all submitted batch details with certificate status...');
            // Get all messages to track complete lifecycle
            const [sentMessages, receivedMessages] = await Promise.all([
                this.fireflyService.getMessages(200), // ICBT → Cardiff (submissions)
                this.fireflyService.getPrivateMessages(200) // Cardiff → ICBT (certificates)
            ]);
            const batchDetailsMap = new Map();
            const allBatchDetails = [];
            // 1. Process all ICBT submissions - Use content-based detection instead of message.local
            for (const message of sentMessages) {
                if (message.data && message.data.length > 0) {
                    try {
                        const data = await this.fireflyService.retrieveData(message.data);
                        if (data && data.length > 0 && data[0].value) {
                            const messageData = JSON.parse(data[0].value);
                            // Content-based detection for ICBT submissions
                            if (messageData.from === 'icbt-campus' ||
                                messageData.type === 'STUDENT_BATCH_SUBMISSION_WITH_METADATA' ||
                                (message.header && message.header.author === 'did:firefly:org/icbt-campus')) {
                                console.log(`✅ Found ICBT submission: ${message.header.id}`);
                                // Look for batch submissions with flexible parsing
                                let batchInfo = null;
                                if (messageData.batch && messageData.batch.batch_id) {
                                    batchInfo = {
                                        batchId: messageData.batch.batch_id,
                                        batchName: messageData.batch.metadata.batch_name,
                                        metadata: messageData.batch.metadata,
                                        students: messageData.batch.students,
                                        submissionType: messageData.type
                                    };
                                }
                                else if (messageData.metadata && messageData.students) {
                                    const generatedId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                                    batchInfo = {
                                        batchId: generatedId,
                                        batchName: messageData.metadata.batch_name,
                                        metadata: messageData.metadata,
                                        students: messageData.students,
                                        submissionType: 'DIRECT_SUBMISSION'
                                    };
                                }
                                else if (messageData.batch_id || messageData.batchId) {
                                    batchInfo = {
                                        batchId: messageData.batch_id || messageData.batchId,
                                        batchName: messageData.batch_name || messageData.batchName,
                                        metadata: messageData.metadata || {},
                                        students: messageData.students || [],
                                        submissionType: messageData.type || 'UNKNOWN'
                                    };
                                }
                                if (batchInfo && batchInfo.students && batchInfo.students.length > 0) {
                                    // Calculate initial statistics
                                    const studentsWithDetails = batchInfo.students.map((student) => ({
                                        student_id: student.student_id,
                                        first_name: student.first_name,
                                        last_name: student.last_name,
                                        full_name: `${student.first_name} ${student.last_name}`,
                                        email: student.email,
                                        course: student.course,
                                        graduation_date: student.graduation_date,
                                        gpa: student.gpa,
                                        university: student.university || 'icbt-campus',
                                        status: 'submitted',
                                        // Certificate fields (initially null)
                                        certificate_id: null,
                                        certificate_hash: null,
                                        pdf_data_id: null,
                                        pdf_data_hash: null,
                                        transaction_hash: null,
                                        certificate_issued: false,
                                        certificate_received_at: null
                                    }));
                                    const batchDetail = {
                                        // Basic batch information
                                        batchId: batchInfo.batchId,
                                        batchName: batchInfo.batchName,
                                        submissionMessageId: message.header.id,
                                        submittedAt: message.header.created,
                                        submittedBy: 'icbt-campus',
                                        submissionType: batchInfo.submissionType,
                                        // Batch metadata
                                        metadata: {
                                            batch_name: batchInfo.metadata.batch_name,
                                            batch_description: batchInfo.metadata.batch_description || '',
                                            academic_year: batchInfo.metadata.academic_year,
                                            semester: batchInfo.metadata.semester,
                                            graduation_ceremony_date: batchInfo.metadata.graduation_ceremony_date,
                                            faculty: batchInfo.metadata.faculty,
                                            program_type: batchInfo.metadata.program_type || 'undergraduate',
                                            contact_person: batchInfo.metadata.contact_person,
                                            contact_email: batchInfo.metadata.contact_email,
                                            notes: batchInfo.metadata.notes || ''
                                        },
                                        // Student details
                                        students: studentsWithDetails,
                                        // Status tracking
                                        status: 'submitted',
                                        totalStudents: studentsWithDetails.length,
                                        certificatesIssued: 0,
                                        certificatesPending: studentsWithDetails.length,
                                        progressPercentage: 0,
                                        // Certificate information (initially null)
                                        certificateMessageId: null,
                                        certificatesIssuedAt: null,
                                        certificatesReceivedAt: null,
                                        cardanoTxId: null,
                                        processingTime: null,
                                        // Timeline
                                        timeline: [
                                            {
                                                event: 'Batch Submitted',
                                                timestamp: message.header.created,
                                                description: `Batch "${batchInfo.batchName}" submitted to Cardiff Met with ${studentsWithDetails.length} students`,
                                                status: 'completed'
                                            }
                                        ]
                                    };
                                    batchDetailsMap.set(batchInfo.batchId, batchDetail);
                                }
                            }
                        }
                    }
                    catch (parseError) {
                        console.warn('Error parsing submission message:', parseError);
                    }
                }
            }
            // 2. Process Cardiff certificate responses and update batch details
            for (const message of receivedMessages) {
                if (!message.local && message.data && message.data.length > 0) {
                    try {
                        const data = await this.fireflyService.retrieveData(message.data);
                        if (data && data.length > 0 && data[0].value) {
                            const messageData = JSON.parse(data[0].value);
                            if (messageData.type === 'CERTIFICATE_PDFS_ISSUED' &&
                                messageData.from === 'cardiff-met' &&
                                messageData.to === 'icbt-campus') {
                                const existingBatch = batchDetailsMap.get(messageData.batch_id);
                                if (existingBatch) {
                                    // Update students with certificate information
                                    const updatedStudents = existingBatch.students.map((student) => {
                                        const certificateRef = messageData.certificate_pdf_refs?.find((cert) => cert.student_id === student.student_id);
                                        if (certificateRef) {
                                            return {
                                                ...student,
                                                status: 'certificate_issued',
                                                certificate_id: certificateRef.certificate_id,
                                                certificate_hash: certificateRef.certificate_hash,
                                                pdf_data_id: certificateRef.pdf_data_id,
                                                pdf_data_hash: certificateRef.pdf_data_hash,
                                                transaction_hash: certificateRef.certificate_hash,
                                                certificate_issued: true,
                                                certificate_received_at: message.header.created
                                            };
                                        }
                                        return student;
                                    });
                                    const certificatesIssued = updatedStudents.filter((s) => s.certificate_issued).length;
                                    const progressPercentage = Math.round((certificatesIssued / existingBatch.totalStudents) * 100);
                                    // Determine batch status
                                    let batchStatus = 'submitted';
                                    if (certificatesIssued === existingBatch.totalStudents) {
                                        batchStatus = 'completed';
                                    }
                                    else if (certificatesIssued > 0) {
                                        batchStatus = 'partially_completed';
                                    }
                                    else {
                                        batchStatus = 'processing';
                                    }
                                    // Calculate processing time
                                    let processingTime = null;
                                    if (existingBatch.submittedAt && messageData.issued_at) {
                                        const submittedTime = new Date(existingBatch.submittedAt);
                                        const issuedTime = new Date(messageData.issued_at);
                                        const diffMs = issuedTime.getTime() - submittedTime.getTime();
                                        const diffHours = Math.round(diffMs / (1000 * 60 * 60));
                                        const diffDays = Math.floor(diffHours / 24);
                                        if (diffDays > 0) {
                                            processingTime = `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours % 24}h`;
                                        }
                                        else {
                                            processingTime = `${diffHours}h`;
                                        }
                                    }
                                    // Update timeline
                                    const updatedTimeline = [...existingBatch.timeline];
                                    if (!updatedTimeline.find(t => t.event === 'Certificates Issued')) {
                                        updatedTimeline.push({
                                            event: 'Certificates Issued',
                                            timestamp: messageData.issued_at,
                                            description: `${certificatesIssued} certificates issued by Cardiff Met and recorded on Cardano blockchain`,
                                            status: 'completed'
                                        });
                                        updatedTimeline.push({
                                            event: 'Certificates Received',
                                            timestamp: message.header.created,
                                            description: `Certificate PDFs received via FireFly private message`,
                                            status: 'completed'
                                        });
                                    }
                                    // Update the batch details
                                    batchDetailsMap.set(messageData.batch_id, {
                                        ...existingBatch,
                                        students: updatedStudents,
                                        status: batchStatus,
                                        certificatesIssued: certificatesIssued,
                                        certificatesPending: existingBatch.totalStudents - certificatesIssued,
                                        progressPercentage: progressPercentage,
                                        certificateMessageId: message.header.id,
                                        certificatesIssuedAt: messageData.issued_at,
                                        certificatesReceivedAt: message.header.created,
                                        cardanoTxId: messageData.cardano_tx_id,
                                        processingTime: processingTime,
                                        timeline: updatedTimeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                                    });
                                }
                                else {
                                    // Certificate received but no submission found - create partial record
                                    console.warn(`Certificate received for unknown batch: ${messageData.batch_id}`);
                                    const studentsFromCerts = messageData.certificate_pdf_refs?.map((cert) => ({
                                        student_id: cert.student_id,
                                        first_name: cert.student_name.split(' ')[0],
                                        last_name: cert.student_name.split(' ').slice(1).join(' '),
                                        full_name: cert.student_name,
                                        email: 'unknown@icbt.lk',
                                        course: 'Unknown',
                                        graduation_date: 'Unknown',
                                        gpa: 0,
                                        university: 'icbt-campus',
                                        status: 'certificate_issued',
                                        certificate_id: cert.certificate_id,
                                        certificate_hash: cert.certificate_hash,
                                        pdf_data_id: cert.pdf_data_id,
                                        pdf_data_hash: cert.pdf_data_hash,
                                        transaction_hash: cert.certificate_hash,
                                        certificate_issued: true,
                                        certificate_received_at: message.header.created
                                    })) || [];
                                    batchDetailsMap.set(messageData.batch_id, {
                                        batchId: messageData.batch_id,
                                        batchName: messageData.batch_name || 'Unknown Batch',
                                        submissionMessageId: null,
                                        submittedAt: null,
                                        submittedBy: 'icbt-campus',
                                        submissionType: 'UNKNOWN',
                                        metadata: {
                                            batch_name: messageData.batch_name || 'Unknown Batch',
                                            academic_year: messageData.batch_details?.academic_year || 'Unknown',
                                            semester: messageData.batch_details?.semester || 'Unknown',
                                            faculty: messageData.batch_details?.faculty || 'Unknown'
                                        },
                                        students: studentsFromCerts,
                                        status: 'certificates_issued',
                                        totalStudents: studentsFromCerts.length,
                                        certificatesIssued: studentsFromCerts.length,
                                        certificatesPending: 0,
                                        progressPercentage: 100,
                                        certificateMessageId: message.header.id,
                                        certificatesIssuedAt: messageData.issued_at,
                                        certificatesReceivedAt: message.header.created,
                                        cardanoTxId: messageData.cardano_tx_id,
                                        processingTime: null,
                                        timeline: [
                                            {
                                                event: 'Certificates Received',
                                                timestamp: message.header.created,
                                                description: 'Certificates received without submission record',
                                                status: 'completed'
                                            }
                                        ]
                                    });
                                }
                            }
                        }
                    }
                    catch (parseError) {
                        console.warn('Error parsing certificate message:', parseError);
                    }
                }
            }
            // Convert map to array and sort by submission date
            allBatchDetails.push(...Array.from(batchDetailsMap.values()));
            allBatchDetails.sort((a, b) => {
                const dateA = new Date(a.submittedAt || a.certificatesReceivedAt || '');
                const dateB = new Date(b.submittedAt || b.certificatesReceivedAt || '');
                return dateB.getTime() - dateA.getTime();
            });
            // Calculate overall statistics
            const overallStats = {
                totalBatches: allBatchDetails.length,
                totalStudents: allBatchDetails.reduce((sum, batch) => sum + batch.totalStudents, 0),
                totalCertificatesIssued: allBatchDetails.reduce((sum, batch) => sum + batch.certificatesIssued, 0),
                totalCertificatesPending: allBatchDetails.reduce((sum, batch) => sum + batch.certificatesPending, 0),
                statusBreakdown: {
                    submitted: allBatchDetails.filter(b => b.status === 'submitted').length,
                    processing: allBatchDetails.filter(b => b.status === 'processing').length,
                    partially_completed: allBatchDetails.filter(b => b.status === 'partially_completed').length,
                    completed: allBatchDetails.filter(b => b.status === 'completed').length,
                    certificates_issued: allBatchDetails.filter(b => b.status === 'certificates_issued').length
                },
                successRate: allBatchDetails.length > 0
                    ? Math.round((allBatchDetails.filter(b => b.status === 'completed').length / allBatchDetails.length) * 100)
                    : 0,
                averageProcessingTime: this.calculateAverageProcessingTime(allBatchDetails.filter(b => b.processingTime)),
                facultyBreakdown: this.getFacultyBreakdown(allBatchDetails),
                academicYearBreakdown: this.getAcademicYearBreakdown(allBatchDetails)
            };
            console.log(`📊 Retrieved ${allBatchDetails.length} batch details with comprehensive status tracking`);
            res.json({
                success: true,
                batchDetails: allBatchDetails,
                overallStats: overallStats,
                count: allBatchDetails.length,
                message: 'All batch details retrieved successfully with certificate status'
            });
        }
        catch (error) {
            console.error('❌ Error fetching batch details:', error);
            res.status(500).json({
                error: 'Failed to fetch batch details',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    calculateAverageProcessingTime(certificates) {
        if (certificates.length === 0)
            return 'N/A';
        const totalMs = certificates.reduce((sum, cert) => {
            if (cert.submittedAt && cert.certificatesIssuedAt) {
                const submitted = new Date(cert.submittedAt);
                const issued = new Date(cert.certificatesIssuedAt);
                return sum + (issued.getTime() - submitted.getTime());
            }
            return sum;
        }, 0);
        const avgMs = totalMs / certificates.length;
        const avgHours = Math.round(avgMs / (1000 * 60 * 60));
        const avgDays = Math.floor(avgHours / 24);
        if (avgDays > 0) {
            return `${avgDays} day${avgDays > 1 ? 's' : ''} ${avgHours % 24}h`;
        }
        return `${avgHours}h`;
    }
    getFacultyBreakdown(batches) {
        const breakdown = {};
        batches.forEach(batch => {
            const faculty = batch.metadata?.faculty || 'Unknown';
            breakdown[faculty] = (breakdown[faculty] || 0) + 1;
        });
        return breakdown;
    }
    getAcademicYearBreakdown(batches) {
        const breakdown = {};
        batches.forEach(batch => {
            const year = batch.metadata?.academic_year || 'Unknown';
            breakdown[year] = (breakdown[year] || 0) + 1;
        });
        return breakdown;
    }
}
exports.ICBTController = ICBTController;
