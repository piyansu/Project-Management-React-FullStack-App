// utils/mailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp, options = {}) => {
  const {
    userName = 'User',
    // Using online image links as defaults
    logoPath = 'https://governing-apricot-ivvvnfasyg.edgeone.app/logo.png',
    profilePath = 'https://outrageous-maroon-sz7emsquk1.edgeone.app/my.jpg',
  } = options;
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Your OTP Code for Registration',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 40px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <tr>
                  <td style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="text-align: left; vertical-align: middle;">
                          <img src="${logoPath}" 
                               alt="Project Logo" 
                               style="height: 40px; width: auto; display: block;" />
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                          <img src="${profilePath}" 
                               alt="Profile Photo" 
                               style="height: 50px; width: 50px; border-radius: 50%; border: 2px solid #ffffff; display: block;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 40px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 30px 0 20px 0;">
                          <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #1a202c; text-align: center; line-height: 1.2;">
                            Email Verification
                          </h1>
                          <p style="margin: 10px 0 0 0; font-size: 16px; color: #718096; text-align: center; line-height: 1.5;">
                            Welcome ${userName}! We're excited to have you on board.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 20px 0;">
                          <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 30px; text-align: center; border: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 15px 0; font-size: 16px; color: #4a5568; line-height: 1.5;">
                              Please use the following One-Time Password to complete your registration:
                            </p>
                            
                            <div style="background-color: #ffffff; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
                              <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; text-align: center; display: block;">
                                ${otp}
                              </span>
                            </div>
                            
                            <p style="margin: 15px 0 0 0; font-size: 14px; color: #718096;">
                              This code expires in <strong>10 minutes</strong>
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 20px 0 30px 0;">
                          <div style="background-color: #f0f8ff; border-left: 4px solid #667eea; padding: 20px; border-radius: 0 8px 8px 0;">
                            <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #2d3748;">
                              📋 Next Steps:
                            </h3>
                            <ol style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.6;">
                              <li>Copy the OTP code above</li>
                              <li>Return to your registration page</li>
                              <li>Paste the code in the verification field</li>
                              <li>Complete your registration</li>
                            </ol>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 30px 40px 40px 40px; background-color: #f8fafc; border-radius: 0 0 12px 12px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="text-align: center;">
                          <p style="margin: 0 0 10px 0; font-size: 12px; color: #a0aec0; line-height: 1.4;">
                            If you didn't request this verification, please ignore this email.
                          </p>
                          <p style="margin: 0; font-size: 12px; color: #a0aec0; line-height: 1.4;">
                            This is an automated message, please do not reply to this email.
                          </p>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="text-align: center; padding-top: 20px;">
                          <p style="margin: 0 0 10px 0; font-size: 12px; color: #718096;">
                            Follow us on:
                          </p>
                          <a href="#" style="text-decoration: none; margin: 0 10px;">
                            <img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" style="height: 24px; width: 24px;" />
                          </a>
                          <a href="#" style="text-decoration: none; margin: 0 10px;">
                            <img src="https://img.icons8.com/color/48/twitter--v1.png" alt="Twitter" style="height: 24px; width: 24px;" />
                          </a>
                          <a href="#" style="text-decoration: none; margin: 0 10px;">
                            <img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" style="height: 24px; width: 24px;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 20px auto 0 auto;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #a0aec0; line-height: 1.4;">
                      © 2024 Your Company Name. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
    return { success: true, message: 'OTP email sent successfully' };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, message: 'Failed to send OTP email', error };
  }
};

export default sendOTPEmail;