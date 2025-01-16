export const guestInviteEmailTemplate = (
    role: string,
    link: string,
    otp: string
  ) => {
    return `
      <div style="border: 1px solid #ccc; border-radius: 8px; padding: 16px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <header style="margin-bottom: 16px;">
          <h1 style="font-size: 1.5rem; margin: 0;">Welcome to ComSec360</h1>
          <p style="font-size: 1rem; color: #555; margin: 0;">
            Your Invitation as a ${role}
          </p>
        </header>
        <section style="margin-bottom: 16px;">
          <p style="margin: 0 0 8px 0;">Dear ${role},</p>
          <p style="margin: 0 0 16px 0;">
            You have been invited to join ComSec360 as a <strong>${role}</strong>. Below are the details to complete your registration.
          </p>
          <div style="margin-bottom: 8px;">
            <h2 style="margin: 0; font-size: 1rem; font-weight: 600;">Registration Link:</h2>
            <a 
              href="${link}" 
              style="color: #007bff; text-decoration: none; word-wrap: break-word;">
              ${link}
            </a>
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <h2 style="margin: 0; font-size: 1rem; font-weight: 600;">One-Time Password (OTP):</h2>
            <p style="margin: 0; padding: 4px 8px; background-color: #f0f0f0; border-radius: 4px;">
              ${otp}
            </p>
          </div>
          <div style="margin-bottom: 16px; color: #555;">
            <p style="margin: 0;">
              <strong>Important:</strong> The OTP is valid for <b>24 hours</b> only. Please use it before it expires.
            </p>
          </div>
        </section>
        <footer>
          <div style="font-size: 0.875rem; color: #888; margin-bottom: 16px;">
            Note: The shared link and OTP are confidential. 
            <b style="padding: 4px 8px; background-color: #f0f0f0; border-radius: 4px;">Do not share them with anyone.</b>
          </div>
          <p style="margin: 0 0 8px 0;">Thanks.</p>
          <p style="margin: 0 0 8px 0;">Yours Truly,</p>
          <p style="margin: 0; font-weight: 500;">Team ComSec360</p>
          <p style="margin: 32px 0 0 0; font-size: 0.75rem;">
            For any further queries contact at:&nbsp;
            <a
              href="mailto:support@comsec360.com"
              style="color: #007bff; text-decoration: none; font-size: 0.75rem;"
            >
              support@comsec360.com
            </a>
          </p>
        </footer>
      </div>
    `;
  };
  