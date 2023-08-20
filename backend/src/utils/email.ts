import { createTransport } from "nodemailer";
import env from "../env";

const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port:587,
    auth:{
        user:"grabnar.luka@gmail.com",
        pass:env.SMTP_PASSWORD,
    },
});

export async function sendVerificationCode(toEmail:string, verificationCode:string) {
    await transporter.sendMail({
        from:"noreply@blogApp.com",
        to: toEmail,
        subject:"Your verification code for Blog App",
        html: `<p>This verification code will expire in 10 minutes</p><strong>${verificationCode}</strong>`
    })
}