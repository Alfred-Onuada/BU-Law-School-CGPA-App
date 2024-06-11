import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).send({ message: 'Access Denied' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded) {
      res.status(401).send({ message: 'Access Denied' });
      return;
    }

    next();
  } catch (error) {
    res.status(401).send({ message: 'Access Denied' });
  }
}