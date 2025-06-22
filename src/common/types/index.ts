import { Request } from "express";

export interface AuthCookie {
    accessToken: string;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
        tenantId: string;
    };
}

export const ROLES = {
    ADMIN: "admin",
    CUSTOMER: "customer",
    MANAGER: "manager",
} as const;
