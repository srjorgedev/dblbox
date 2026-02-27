import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      role?: number;
    }

    interface Request {
      userId?: string;
      userFromJwt?: {
          id: string;
          role?: number;
      }
    }
  }
}