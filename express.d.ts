import { Request } from 'express';
import { JwtPayload } from './src/jwt.helper';

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

