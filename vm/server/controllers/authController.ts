import { NextFunction, Request, Response } from 'express';
import { query } from '../models/appModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signUp = async (req: Request, res: Response) => {
  const { email, password, account_type } = req.body;

  try {
    // Hash and salt needed
    const result = await query(`INSERT INTO users (email, password, account_type) VALUES ($1, $2, $3) RETURNING *`, [email, password, account_type]);

    const user = result.rows[0];
    const token = jwt.sign({ email: user.email, id: user.user_id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.status(200).json({ message: 'User signed up', email: user.email, token });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Error signing up', error: err.message });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await query(`SELECT * FROM users WHERE email = $1 AND password = $2`, [email, password]);
    
    const user = result.rows[0];
    if (user) {
      const token = jwt.sign({ email: user.email, id: user.user_id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      res.status(200).json({ message: 'User logged in', email: user.email, token });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Error logging in', error: err.message });
    }
  }
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};