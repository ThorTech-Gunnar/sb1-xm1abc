import express from 'express';
import { isAuthenticated, isSuperAdmin } from '../middleware/authMiddleware';
import { generateLicense, validateLicense, revokeLicense } from '../controllers/licenseController';

const router = express.Router();

router.post('/generate', isAuthenticated, isSuperAdmin, generateLicense);
router.post('/validate', isAuthenticated, validateLicense);
router.post('/revoke', isAuthenticated, isSuperAdmin, revokeLicense);

export default router;