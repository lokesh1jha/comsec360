export const getDocumentSignedTemplate = (name: string, links: string[], documentPage?: string) => {
    const linksHtml = links.map(link => `<li><a href="${link}" style="color: #007bff; text-decoration: none;">Download Document</a></li>`).join('');
    const documentPageHtml = documentPage ? `<p style="margin: 0 0 16px 0;">You can also visit the following page to sign the other documents: <a href="${documentPage}" style="color: #007bff; text-decoration: none;">Sign Documents</a></p>` : '';

    return `
       <div style="border: 1px solid #ccc; border-radius: 8px; padding: 16px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <header style="margin-bottom: 16px;">
            <h1 style="font-size: 1.5rem; margin: 0;">Important Document Links</h1>
            <p style="font-size: 1rem; color: #555; margin: 0;">
            Action Required: Please Sign and Return
            </p>
        </header>
        <section style="margin-bottom: 16px;">
            <p style="margin: 0 0 8px 0;">Dear ${name},</p>
            <p style="margin: 0 0 16px 0;">
            We have provided links to company-related documents that require your signature. Please review, sign, and return the documents at your earliest convenience.
            </p>
            <ul style="margin: 0 0 16px 0; padding-left: 20px;">
                ${linksHtml}
            </ul>
            ${documentPageHtml}
            <p style="margin: 0 0 16px 0;">
            Your prompt attention to this matter is greatly appreciated.
            </p>
        </section>
        <footer>
            <div style="font-size: 0.875rem; color: #888; margin-bottom: 16px;">
            Note: The documents contain confidential information. 
            <b style="padding: 4px 8px; background-color: #f0f0f0; border-radius: 4px;">Do not share them with anyone.</b>
            </div>
            <p style="margin: 0 0 8px 0;">Thank you.</p>
            <p style="margin: 0 0 8px 0;">Best Regards,</p>
            <p style="margin: 0; font-weight: 500;">Team ComSec360</p>
            <p style="margin: 32px 0 0 0; font-size: 0.75rem;">
            For any further queries, contact us at:&nbsp;
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
