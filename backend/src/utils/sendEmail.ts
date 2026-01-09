import dotenv from "dotenv";
dotenv.config()
import nodemailer from 'nodemailer';

// SMTP configuration
const SMTP_SERVER = 'smtp.gmail.com';
const PORT = 465;

// Credentials from environment variables
const USERNAME = process.env.EMAIL_USER;
const PASSWORD = process.env.EMAIL_PASS;

// Email recipients (unique)



export async function sendEmails(recipient:string[],subject:string,body:string) {
    try {
        const recipients = Array.from(new Set([
    ...recipient
    ]));
        const transporter = nodemailer.createTransport({
            host: SMTP_SERVER,
            port: PORT,
            secure: true,
            auth: {
                user: USERNAME,
                pass: PASSWORD
            }
        });

        for (const recipient of recipients) {
            const  info = await transporter.sendMail({
                from: USERNAME,
                to: recipient,
                subject: subject,
                html: body
            });

            console.log(`✅ Email sent to ${recipient}: ${info.messageId}`);
        }

        console.log("✅✅✅ All emails sent successfully!");

    } catch (err) {
        console.error(`❌ Error sending emails: ${err.message}`);
    }
}

