import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to: string, subject: string, html: string) {
    if (!resend) {
        console.warn('Resend is not initialized. Emails will not be sent.');
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }

        console.log('Email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Error in sendEmail:', error);
        throw error;
    }
}

export async function sendVerificationEmail(email: string, code: string) {
    return sendEmail(
        email,
        'Verify your email',
        `
      <h1>Verify Your Email</h1>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>Please enter this code on the verification page to complete your registration.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `
    );
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${token}`;
    return sendEmail(
        email,
        'Reset your password',
        `
      <h1>Reset Your Password</h1>
      <p>You have requested to reset your password. Please click the link below to proceed:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `
    );
}

export async function sendWelcomeEmail(email: string) {
    return sendEmail(
        email,
        'Welcome to Our Platform!',
        `
      <h1>Welcome!</h1>
      <p>Thank you for verifying your email and joining our platform.</p>
      <p>We're excited to have you on board. If you have any questions, feel free to reply to this email.</p>
    `
    );
}