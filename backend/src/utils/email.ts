import nodemailer from 'nodemailer';


const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};


export const emailTemplates = {
  passwordReset: (name: string, resetUrl: string) => ({
    subject: 'Reset Your Password - E-Learning Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">E-Learning Platform</h1>
          <p style="color: #6b7280; margin: 5px 0;">Nursing Education</p>
        </div>
        
        <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
        
        <p style="color: #4b5563; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
        
        <p style="color: #4b5563; line-height: 1.6;">
          You requested to reset your password. Click the button below to create a new password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 30px; background-color: #2563eb; color: white; 
                    text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Reset Your Password
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          This link will expire in 1 hour for security reasons.
        </p>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 6px;">
          <p style="color: #374151; margin: 0; font-size: 14px;">
            <strong>Note:</strong> If you didn't request this password reset, please ignore this email. 
            Your account remains secure.
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <span style="color: #2563eb; word-break: break-all;">${resetUrl}</span>
          </p>
        </div>
      </div>
    `,
  }),

  passwordResetSuccess: (name: string) => ({
    subject: 'Password Reset Successful - E-Learning Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">E-Learning Platform</h1>
          <p style="color: #6b7280; margin: 5px 0;">Nursing Education</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #d1fae5; color: #065f46; padding: 20px; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 40px;">✓</span>
          </div>
          <h2 style="color: #059669; margin-bottom: 10px;">Password Reset Successful</h2>
        </div>
        
        <p style="color: #4b5563; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Your password has been successfully reset. You can now log in to your account using your new password.
        </p>
        
        <div style="margin: 25px 0; padding: 16px; background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px;">
          <p style="color: #0369a1; margin: 0; font-size: 14px;">
            <strong>Security Tip:</strong> For your security, we recommend:
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Using a strong, unique password</li>
              <li>Not sharing your password with anyone</li>
              <li>Enabling two-factor authentication if available</li>
            </ul>
          </p>
        </div>
        
        <p style="color: #4b5563; line-height: 1.6;">
          If you didn't make this change, please contact our support team immediately.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
             style="display: inline-block; padding: 10px 25px; background-color: #059669; color: white; 
                    text-decoration: none; border-radius: 6px; font-weight: bold;">
            Login to Your Account
          </a>
        </div>
      </div>
    `,
  }),

  passwordChanged: (name: string) => ({
    subject: 'Password Changed - E-Learning Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">E-Learning Platform</h1>
          <p style="color: #6b7280; margin: 5px 0;">Nursing Education</p>
        </div>
        
        <h2 style="color: #1f2937; margin-bottom: 20px;">Password Changed Successfully</h2>
        
        <p style="color: #4b5563; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Your password has been changed successfully. You are now logged out of all other sessions for security.
        </p>
        
        <div style="margin: 25px 0; padding: 16px; background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            <strong>Important:</strong> If you didn't make this change, please contact our support team immediately 
            and reset your password using the "Forgot Password" feature.
          </p>
        </div>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Thank you for helping us keep your account secure.
        </p>
      </div>
    `,
  }),
};


export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"E-Learning Platform" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};


export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server configuration error:', error);
    return false;
  }
};