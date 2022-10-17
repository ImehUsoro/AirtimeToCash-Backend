import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRETE as string;
import { UserInstance } from '../models/users';

export async function auth(req: Request, res: Response, next: NextFunction): Promise<unknown> {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        error: 'Please sign in',
      });
    }
    const token = authorization?.slice(7, authorization.length) as string;

    let verified = jwt.verify(token, secret);

    if (!verified) {
      return res.status(401).json({
        error: 'User not verified, access denied',
      });
    }

    const { id } = verified as { [key: string]: string };

    const user = await UserInstance.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({
        error: 'User not verified',
      });
    }
    req.user = id;
    next();
  } catch (error) {
    res.status(403).json({
      error: 'User not logged in',
    });
    throw new Error(`${error}`);
  }
}
