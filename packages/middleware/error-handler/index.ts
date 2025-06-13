export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message: string, statusCode: number, isOpreational=true, details?:any){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOpreational;
        this.details = details;
        Error.captureStackTrace(this);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message = "Invalid request data", details?: any){
        super(message, 400, true, details);
    }
}

export class ForbiddenError extends AppError {
    constructor(message="Forbidden Access"){
        super(message, 403);
    }
}

export class DatabaseError extends AppError {
    constructor(message="Database error", details?:any){
        super(message, 500, true, details);
    }
}

export class RateLimitError extends AppError {
    constructor(message="TToo many requests, please try again later"){
        super(message, 429);
    }
}