"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const icbt_routes_1 = __importDefault(require("./icbt.routes"));
const cardiff_routes_1 = __importDefault(require("./cardiff.routes"));
const verification_routes_1 = __importDefault(require("./verification.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const test_routes_1 = __importDefault(require("./test.routes"));
const router = (0, express_1.Router)();
// Mount route modules
router.use('/icbt', icbt_routes_1.default);
router.use('/cardiff', cardiff_routes_1.default);
router.use('/verify', verification_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/test', test_routes_1.default);
exports.default = router;
