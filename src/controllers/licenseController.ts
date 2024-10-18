import { Request, Response } from 'express';
import { LicenseManager } from '../utils/licenseManager';
import { User } from '../utils/dbSchema';

export const generateLicense = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const licenseKey = await LicenseManager.assignLicenseKey(userId);
    res.json({ licenseKey });
  } catch (error) {
    console.error('Error generating license:', error);
    res.status(500).json({ message: 'Error generating license' });
  }
};

export const validateLicense = async (req: Request, res: Response) => {
  try {
    const { licenseKey } = req.body;
    const userId = req.userId;
    const isValid = await LicenseManager.validateLicenseKey(licenseKey, userId);
    res.json({ isValid });
  } catch (error) {
    console.error('Error validating license:', error);
    res.status(500).json({ message: 'Error validating license' });
  }
};

export const revokeLicense = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    await LicenseManager.revokeLicense(userId);
    res.json({ message: 'License revoked successfully' });
  } catch (error) {
    console.error('Error revoking license:', error);
    res.status(500).json({ message: 'Error revoking license' });
  }
};