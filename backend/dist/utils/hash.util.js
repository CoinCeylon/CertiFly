"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashUtil = void 0;
const crypto_1 = __importDefault(require("crypto"));
class HashUtil {
    static generateStudentHash(student) {
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
        return crypto_1.default.createHash('sha256').update(jsonString).digest('hex');
    }
    static generateBatchHash(students) {
        const studentHashes = students.map(student => this.generateStudentHash(student));
        const combinedHash = studentHashes.join('');
        return crypto_1.default.createHash('sha256').update(combinedHash).digest('hex');
    }
    static verifyCertificate(student, providedHash) {
        const calculatedHash = this.generateStudentHash(student);
        return calculatedHash === providedHash;
    }
}
exports.HashUtil = HashUtil;
