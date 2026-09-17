import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'farmer_inventory_super_secure_jwt_secret_key_2026';

export interface AuthPayload {
  userId: number;
  role: 'FARMER' | 'CUSTOMER';
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired session token' });
  }
};

export const requireRole = (expectedRole: 'FARMER' | 'CUSTOMER') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (req.user.role !== expectedRole) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: This resource is restricted to ${expectedRole.toLowerCase()}s only` 
      });
    }
    next();
  };
};

export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
