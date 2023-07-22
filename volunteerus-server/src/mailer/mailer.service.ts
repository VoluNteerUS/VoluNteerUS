import { Injectable } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';
import * as dotenv from 'dotenv';
import { User } from '../users/schemas/user.schema';
import mongoose from 'mongoose';

dotenv.config();

@Injectable()
export class MailerService {
    constructor() {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    }

    public sendResetPasswordEmail(user: User, token: string): string {

        const resetPasswordLink = `${process.env.CLIENT_URL}/passwordReset?token=${token}&email=${user.email}`;

        const msg = {
            to: user.email,
            from: process.env.SENDGRID_EMAIL,
            subject: "Your VoluNteerUS account password reset request",
            html: `
            <div style="font-family: inherit; text-align: inherit padding: 25px 0px"><span style="font-size: 18px">Dear, ${user.full_name}</span></div>
            <div style="font-family: inherit; text-align: inherit padding: 40px 0px"><span style="font-size: 24px; color: #000000">We received a request to reset your account's password.</span></div>
            <div style="padding: 20px 0px">
                <div style="font-family: inherit; text-align: inherit"><span style="color: #000000"><strong>Protecting your data is important to us.</strong></span></div>
                <div style="font-family: inherit; text-align: inherit"><span style="color: #000000"><strong>Please click on the button below to begin.</strong></span></div>
            </div>
            <td align="center" bgcolor="#FF71A3" class="inner-td" style="border-radius:6px; font-size:16px; text-align:left; background-color:inherit;">
                <a href="${resetPasswordLink}" style="background-color:#FF71A3; border:1px solid #FF71A3; border-color:#FF71A3; border-radius:0px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:bold; letter-spacing:0px; line-height:normal; padding:12px 50px 12px 50px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Reset Password</a>
            </td>
            `
        }

        sendgrid.send(msg)
            .then(() => {
                return true
            })
            .catch((err) => {
                console.log(err);
                return false
            });

        return resetPasswordLink;
    }
}