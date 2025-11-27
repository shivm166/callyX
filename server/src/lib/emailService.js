import nodemailer from "nodemailer";
import User from "../models/User.js";

// --- Configuration ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS.replace(/\s/g, ""), // Remove spaces for robustness
  },
});

const WEBAPP_URL = process.env.WEBAPP_URL || "http://localhost:5173";

/**
 * Generates an attractive HTML template for the email content.
 * @param {string} subject - The email subject/title.
 * @param {string} bodyHtml - The main body content (paragraph text).
 * @param {string} ctaText - The text for the call-to-action button.
 * @param {string} ctaLink - The URL for the call-to-action button.
 */
function createHtmlTemplate(subject, bodyHtml, ctaText, ctaLink) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <tr>
                <td style="padding: 30px; text-align: center;">
                    <h1 style="color: #4CAF50; margin-bottom: 20px;">CallyX</h1>
                    
                    <h2 style="color: #2c3e50; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                        ${subject}
                    </h2>

                    <p style="font-size: 16px; color: #555; margin-bottom: 25px;">
                        ${bodyHtml}
                    </p>

                    <a href="${ctaLink}" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #4CAF50; border-radius: 5px; text-decoration: none; font-weight: bold; transition: background-color 0.3s;">
                        ${ctaText}
                    </a>

                </td>
            </tr>
            <tr>
                <td style="text-align: center; padding: 20px; font-size: 12px; color: #888;">
                    <p>If you have trouble clicking the button, copy and paste the URL below into your web browser:</p>
                    <p><a href="${ctaLink}" style="color: #4CAF50; text-decoration: underline;">${ctaLink}</a></p>
                    <p style="margin-top: 15px;">&copy; ${new Date().getFullYear()} CallyX. All rights reserved.</p>
                </td>
            </tr>
        </table>
    </div>
    `;
}

/**
 * 📧 Sends a friend request notification email. (To RECIPIENT)
 */
export async function sendRequestNotification(senderId, recipientId) {
  try {
    const [sender, recipient] = await Promise.all([
      User.findById(senderId).select("fullName"),
      User.findById(recipientId).select("fullName email"),
    ]);

    if (!recipient || !recipient.email) {
      console.log(
        `Email notification skipped: Recipient not found or missing email for ID: ${recipientId}`
      );
      return;
    }

    // --- Template Content for New Request ---
    const subject = `👋 New Friend Request from ${sender.fullName}`;
    const bodyHtml = `
      <p>Hello ${recipient.fullName},</p>
      <p><b>${sender.fullName}</b> wants to connect with you on CallyX!</p>
      <p>Visit your notifications to accept their request and start chatting.</p>
    `;
    const ctaText = "View Requests Now";
    const ctaLink = `${WEBAPP_URL}/notifications`; // Link directly to the notifications page

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient.email,
      subject: subject,
      html: createHtmlTemplate(subject, bodyHtml, ctaText, ctaLink),
    };

    // Send email without awaiting the result (non-blocking for performance)
    transporter
      .sendMail(mailOptions)
      .then((info) =>
        console.log(`Email sent: ${info.messageId} to ${recipient.email}`)
      )
      .catch((error) =>
        console.error(
          "Error sending friend request email asynchronously:",
          error
        )
      );
  } catch (error) {
    console.error(
      "Critical error fetching user data for request notification:",
      error
    );
  }
}

/**
 * 📧 Sends a friend request acceptance notification email. (To SENDER)
 */
export async function sendAcceptanceNotification(acceptorId, senderId) {
  try {
    const [acceptor, requestSender] = await Promise.all([
      User.findById(acceptorId).select("fullName"), // The one who accepted
      User.findById(senderId).select("fullName email"), // The one to be notified
    ]);

    if (!requestSender || !requestSender.email) {
      console.log(
        `Email notification skipped: Original sender not found or missing email for ID: ${senderId}`
      );
      return;
    }

    // --- Template Content for Accepted Request ---
    const subject = `🎉 Request Accepted by ${acceptor.fullName}!`;
    const bodyHtml = `
            <p>Hello ${requestSender.fullName},</p>
            <p>Great news! <b>${acceptor.fullName}</b> has accepted your friend request on CallyX. You are now friends!</p>
            <p>Go to your friends list to send them a message and start the conversation.</p>
        `;
    const ctaText = "Go to Friends List";
    const ctaLink = `${WEBAPP_URL}/friends`; // Link directly to the friends/chat list

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: requestSender.email,
      subject: subject,
      html: createHtmlTemplate(subject, bodyHtml, ctaText, ctaLink),
    };

    // Send email without awaiting the result (non-blocking for performance)
    transporter
      .sendMail(mailOptions)
      .then((info) =>
        console.log(`Email sent: ${info.messageId} to ${requestSender.email}`)
      )
      .catch((error) =>
        console.error("Error sending acceptance email asynchronously:", error)
      );
  } catch (error) {
    console.error(
      "Critical error fetching user data for acceptance notification:",
      error
    );
  }
}

// Ensure you restart your server after applying these changes.
