"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const certificate_routes_1 = __importDefault(require("./routes/certificate.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:8081',
        'https://localhost:8081',
        'http://127.0.0.1:8081',
        'https://127.0.0.1:8081',
        'https://orange-mushroom-00b958600.1.azurestaticapps.net',
        '*' // Allow all for development
    ];
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, curl requests)
        if (!origin)
            return callback(null, true);
        // If ALLOWED_ORIGINS includes *, allow all
        if (allowedOrigins.includes('*'))
            return callback(null, true);
        // Check if origin is localhost:8081 or in allowed list
        if (origin.includes('localhost:8081') || origin.includes('127.0.0.1:8081') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        // For development, allow all origins
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
// Additional CORS headers for Azure and explicit localhost support
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Always allow localhost:8081 and Azure Static Web App
    if (origin && (origin.includes('localhost:8081') ||
        origin.includes('127.0.0.1:8081') ||
        origin === 'https://orange-mushroom-00b958600.1.azurestaticapps.net')) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
app.use(express_1.default.json());
// Routes
app.use('/api', routes_1.default);
app.use('/health', health_routes_1.default);
app.use('/api/certificates', certificate_routes_1.default);
// Simple CORS test endpoint
app.get('/cors-test', (req, res) => {
    res.json({
        message: 'CORS is working!',
        timestamp: new Date().toISOString(),
        origin: req.headers.origin,
        allowedOrigins: allowedOrigins,
        userAgent: req.headers['user-agent'],
        method: req.method,
        headers: req.headers
    });
});
app.listen(PORT, () => {
    console.log(`University Consortium Backend running on port ${PORT}`);
    console.log(`Dashboard: http://localhost:${PORT}/api/dashboard/overview`);
    console.log(`Real-time sync enabled`);
});
