import { Request, Response, NextFunction } from 'express';
import { AppError } from "@/utils/AppError";

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        console.error('UNEXPECTED ERROR:', err);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};
