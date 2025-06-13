import crypto from 'crypto'
import { ValidationError } from '../../../../packages/middleware/error-handler';
import redis from '../../../../packages/libs/radis';
import { sendEmail } from './sendMail';
import { NextFunction } from 'express';
 
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
    const {name, email, password, phone_number, country} = data;

    if(!name || !email || !password || (userType === 'seller' && (!phone_number || !country))){
        throw new ValidationError(`Missing required fields!`) 
    }

    if(!emailRegex.test(email)){
        throw new ValidationError("Invalid email format!");
    }
}

export const checkOtpRestrictions = async (email:string, next:NextFunction) => {
    if(await redis.get(`otp_lock${email}`)){
        return next(new ValidationError("Account locked due to multiple failed attempts! Try again after 30 minutes"))
    };

    if(await redis.get(`otp_spam_lock:${email}`)){
        return next( new ValidationError("Too many OTP requests! Please wait for 1 hour before requesting again."))
    };

    if(await redis.get(`otp_cooldown:${email}`)){
        return next(new ValidationError("Please wait for 1 minute before requesting a new OTP!"))
    };

}

export const trackOtpRequests = async(email: string, next: NextFunction) => {
    const optRequestKey = `otp_request_count: ${email}`;
    const otpRequests = parseInt((await redis.get(optRequestKey)) || "0");
    if(otpRequests>=2){
        await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600 );
        return next(
            new ValidationError("Too many OTP requests. Please wait 1 hour before requesting again.")
        )
    }
}

export const sendOtp = async (name:string, email:string, template: string) => {
    const otp = crypto.randomInt(1000, 9999).toString();
    await sendEmail(email, "Verify Your Email", template, {name, otp});
    await redis.set(`otp:${email}`, otp, "EX", 300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
}