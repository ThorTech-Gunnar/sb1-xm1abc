import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './dbSchema';

// ... (keep existing functions)

export const createToken = (user: any) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      role: user.role,
      isTrialExpired: user.isTrialExpired
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
};

export const checkTrialStatus = async (userId: string) => {
  const user = await User.findById(userId);
  if (user) {
    return user.checkTrialStatus();
  }
  return true; // Assume trial expired if user not found
};