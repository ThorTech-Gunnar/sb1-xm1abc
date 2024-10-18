import crypto from 'crypto';
import { User } from './dbSchema';

const LICENSE_KEY_LENGTH = 32;
const SECRET_KEY = process.env.LICENSE_SECRET_KEY || 'thor-tech-solutions-secret-key';

export class LicenseManager {
  static generateLicenseKey(userId: string): string {
    const data = `${userId}-${Date.now()}-thor-tech-solutions`;
    const hash = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
    return hash.slice(0, LICENSE_KEY_LENGTH);
  }

  static async validateLicenseKey(licenseKey: string, userId: string): Promise<boolean> {
    const user = await User.findById(userId);
    if (!user) {
      return false;
    }

    return user.licenseKey === licenseKey;
  }

  static async assignLicenseKey(userId: string): Promise<string> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const licenseKey = this.generateLicenseKey(userId);
    user.licenseKey = licenseKey;
    user.isTrialExpired = false;
    await user.save();

    return licenseKey;
  }

  static async revokeLicense(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.licenseKey = undefined;
    user.isTrialExpired = true;
    await user.save();
  }
}