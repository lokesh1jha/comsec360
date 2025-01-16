export const newAccountUserEmailTemplate = (name: string, email: string, password: string) => {
    return `
       <div style="border: 1px solid #ccc; border-radius: 8px; padding: 16px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <header style="margin-bottom: 16px;">
            <h1 style="font-size: 1.5rem; margin: 0;">Welcome to ComSec360</h1>
            <p style="font-size: 1rem; color: #555; margin: 0;">
            Get Started with ComSec360 as an Account User
            </p>
        </header>
        <section style="margin-bottom: 16px;">
            <p style="margin: 0 0 8px 0;">Dear ${name},</p>
            <p style="margin: 0 0 16px 0;">
            Your account has been created successfully. Here are your Login Details.
            </p>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <h2 style="margin: 0; font-size: 1rem; font-weight: 600;">Username:</h2>
            <p style="margin: 0; padding: 4px 8px; background-color: #f0f0f0; border-radius: 4px;">
                ${email}
            </p>
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <h2 style="margin: 0; font-size: 1rem; font-weight: 600;">Password:</h2>
            <p style="margin: 0; padding: 4px 8px; background-color: #f0f0f0; border-radius: 4px;">
                ${password}
            </p>
            </div>
        </section>
        <footer>
            <div style="font-size: 0.875rem; color: #888; margin-bottom: 16px;">
            Note: The above shared details are confidential. 
            <b style="padding: 4px 8px; background-color: #f0f0f0; border-radius: 4px;">Do not share it with anyone.</b>
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
}