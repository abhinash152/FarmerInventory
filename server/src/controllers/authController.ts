import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { generateToken, AuthenticatedRequest } from '../middleware/auth';

export const registerFarmer = async (req: Request, res: Response) => {
  try {
    const { full_name, username, password, contact_number, farm_location } = req.body;

    if (!full_name || !username || !password) {
      return res.status(400).json({ success: false, message: 'Full name, username, and password are required' });
    }

    const existing = await prisma.farmer.findUnique({ where: { username } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Username is already taken' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const farmer = await prisma.farmer.create({
      data: {
        full_name,
        username,
        password_hash,
        contact_number,
        farm_location,
      },
    });

    const token = generateToken({
      userId: farmer.farmer_id,
      role: 'FARMER',
      username: farmer.username,
    });

    return res.status(201).json({
      success: true,
      message: 'Farmer account registered successfully',
      token,
      user: {
        id: farmer.farmer_id,
        name: farmer.full_name,
        username: farmer.username,
        role: 'FARMER',
        contact_number: farmer.contact_number,
        farm_location: farmer.farm_location,
      },
    });
  } catch (error: any) {
    console.error('Farmer registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during farmer registration' });
  }
};

export const loginFarmer = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const farmer = await prisma.farmer.findUnique({ where: { username } });
    if (!farmer) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, farmer.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = generateToken({
      userId: farmer.farmer_id,
      role: 'FARMER',
      username: farmer.username,
    });

    return res.json({
      success: true,
      message: 'Farmer logged in successfully',
      token,
      user: {
        id: farmer.farmer_id,
        name: farmer.full_name,
        username: farmer.username,
        role: 'FARMER',
        contact_number: farmer.contact_number,
        farm_location: farmer.farm_location,
      },
    });
  } catch (error: any) {
    console.error('Farmer login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during farmer login' });
  }
};

export const registerCustomer = async (req: Request, res: Response) => {
  try {
    const { customer_name, username, password, contact_number, address } = req.body;

    if (!customer_name || !username || !password) {
      return res.status(400).json({ success: false, message: 'Customer name, username, and password are required' });
    }

    const existing = await prisma.customer.findUnique({ where: { username } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Username is already taken' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: {
        customer_name,
        username,
        password_hash,
        contact_number,
        address,
      },
    });

    const token = generateToken({
      userId: customer.customer_id,
      role: 'CUSTOMER',
      username: customer.username,
    });

    return res.status(201).json({
      success: true,
      message: 'Customer account registered successfully',
      token,
      user: {
        id: customer.customer_id,
        name: customer.customer_name,
        username: customer.username,
        role: 'CUSTOMER',
        contact_number: customer.contact_number,
        address: customer.address,
      },
    });
  } catch (error: any) {
    console.error('Customer registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during customer registration' });
  }
};

export const loginCustomer = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const customer = await prisma.customer.findUnique({ where: { username } });
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, customer.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = generateToken({
      userId: customer.customer_id,
      role: 'CUSTOMER',
      username: customer.username,
    });

    return res.json({
      success: true,
      message: 'Customer logged in successfully',
      token,
      user: {
        id: customer.customer_id,
        name: customer.customer_name,
        username: customer.username,
        role: 'CUSTOMER',
        contact_number: customer.contact_number,
        address: customer.address,
      },
    });
  } catch (error: any) {
    console.error('Customer login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during customer login' });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    if (req.user.role === 'FARMER') {
      const farmer = await prisma.farmer.findUnique({
        where: { farmer_id: req.user.userId },
        select: {
          farmer_id: true,
          full_name: true,
          username: true,
          contact_number: true,
          farm_location: true,
          created_at: true,
        },
      });
      if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
      return res.json({
        success: true,
        user: {
          id: farmer.farmer_id,
          name: farmer.full_name,
          username: farmer.username,
          role: 'FARMER',
          contact_number: farmer.contact_number,
          farm_location: farmer.farm_location,
          created_at: farmer.created_at,
        },
      });
    } else {
      const customer = await prisma.customer.findUnique({
        where: { customer_id: req.user.userId },
        select: {
          customer_id: true,
          customer_name: true,
          username: true,
          contact_number: true,
          address: true,
          created_at: true,
        },
      });
      if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
      return res.json({
        success: true,
        user: {
          id: customer.customer_id,
          name: customer.customer_name,
          username: customer.username,
          role: 'CUSTOMER',
          contact_number: customer.contact_number,
          address: customer.address,
          created_at: customer.created_at,
        },
      });
    }
  } catch (error: any) {
    console.error('Get current user error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
