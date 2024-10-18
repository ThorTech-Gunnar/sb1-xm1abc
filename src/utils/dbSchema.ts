import { Schema, model, Document } from 'mongoose';
import { Theme, defaultTheme } from './theme';

// ... (keep existing interfaces and schemas)

interface IUser extends Document {
  email: string;
  password: string;
  role: 'superadmin' | 'admin' | 'manager' | 'staff';
  franchise?: string;
  firstName: string;
  lastName: string;
  trialStartDate: Date;
  trialEndDate: Date;
  isTrialExpired: boolean;
  licenseKey?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'canceled';
  subscriptionId?: string;
  stripeCustomerId?: string;
}

const userSchema = new Schema<IUser>({
  // ... (keep existing fields)
  trialStartDate: { type: Date, default: Date.now },
  trialEndDate: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  isTrialExpired: { type: Boolean, default: false },
  licenseKey: { type: String },
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'canceled'] },
  subscriptionId: { type: String },
  stripeCustomerId: { type: String },
});

userSchema.methods.checkTrialStatus = function() {
  const now = new Date();
  this.isTrialExpired = now > this.trialEndDate;
  return this.isTrialExpired;
};

export const User = model<IUser>('User', userSchema);

// ... (keep other existing exports)