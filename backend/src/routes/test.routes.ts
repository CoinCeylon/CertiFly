import { Router } from 'express';
import { ICBTController } from '../controllers/icbt.controller';

const router = Router();
const icbtController = new ICBTController();


// TEST ENDPOINTS
router.get('/icbt-firefly', (req, res) => icbtController.testFireFlyConnection(req, res));
router.get('/firefly-connection', (req, res) => icbtController.testFireFlyConnection(req, res));

export default router;
