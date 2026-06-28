import { Resend } from "resend";

// Resend client — only usable when RESEND_API_KEY is set
const getResend = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
};

const FROM_EMAIL = "Maharashtra Adventures <noreply@maharashtra-adventures.com>";

export const sendBookingConfirmation = async (email: string, bookingRef: string, listingTitle: string, amount: number) => {
  const resend = getResend();
  if (!resend) {
    console.log(`[Email Mock] Booking confirmation → ${email} | Ref: ${bookingRef}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Booking Confirmed: ${listingTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Adventure Awaits! ⛰️</h2>
          <p>Thank you for booking with Maharashtra Adventures.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Booking Ref:</strong> ${bookingRef}</p>
            <p><strong>Adventure:</strong> ${listingTitle}</p>
            <p><strong>Total Paid:</strong> ₹${amount}</p>
          </div>
          <p>You can view your full itinerary and contact the operator from your dashboard.</p>
          <br/>
          <p>Happy trails,</p>
          <p><strong>The Maharashtra Adventures Team</strong></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string, baseUrl: string) => {
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  const resend = getResend();

  if (!resend) {
    console.log(`[Email Mock] Password reset link for ${email}: ${resetUrl}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your Maharashtra Adventures password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #059669; font-size: 28px; margin: 0;">🏔️ Maharashtra Adventures</h1>
          </div>
          <h2 style="color: #111827; font-size: 22px;">Reset your password</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Someone requested a password reset for your account. If this was you, click the button below.
            This link is valid for <strong>1 hour</strong>.
          </p>
          <div style="text-align: center; margin: 36px 0;">
            <a href="${resetUrl}"
               style="background-color: #059669; color: white; padding: 14px 32px; border-radius: 8px;
                      text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">
            If you didn't request this, you can safely ignore this email. Your password won't change.
          </p>
          <p style="color: #9ca3af; font-size: 12px;">
            Or copy this link: <a href="${resetUrl}" style="color: #059669;">${resetUrl}</a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
};

export const sendReminderEmail = async (email: string, listingTitle: string, date: string) => {
  const resend = getResend();
  if (!resend) {
    console.log(`[Email Mock] Reminder → ${email} for ${listingTitle}`);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Reminder: Upcoming Trip to ${listingTitle}`,
      html: `<p>Just a quick reminder that your adventure <strong>${listingTitle}</strong> is coming up on ${date}. Don't forget your gear!</p>`,
    });
  } catch (error) {
    console.error("Failed to send reminder email:", error);
  }
};
