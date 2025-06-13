//Register a new user

import { NextFunction, Request, Response } from "express"
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validateRegistrationData } from "../utils/auth.helper";
import { ValidationError } from "../../../../packages/middleware/error-handler";
import prisma from "../../../../packages/libs/prisma";

export const userRegistration = async(req: Request, res: Response, next: NextFunction) => {
    try{
        validateRegistrationData(req.body, "user");
        const {name, email} = req.body;

        const existingUser = await prisma.users.findUnique({ where: email });

        if(existingUser) {
            return next(new ValidationError("User already exists with this email!"))
        };

        await checkOtpRestrictions(name, next);
        await trackOtpRequests(email, next);
        await sendOtp(email, name, "user-activation-mail");

        res.status(200).json({
            message: "OTP sent to email. Please verify your account.",
        });
    } catch(error) {
        return next(error);
    }
}