import nodemailer from 'nodemailer';

const brandColor = '#059669';
const brandName = 'ImpactFund';

// Reusable email wrapper
const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:${brandColor};padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">💚 ${brandName}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
              <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">This is an automated message, please do not reply.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // 1. Welcome email on registration
  async sendWelcomeEmail(email, name) {
    try {
      const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Welcome to ${brandName}! 🎉`,
        html: emailWrapper(`
          <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">Welcome aboard, ${name}! 👋</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Thank you for joining <strong>${brandName}</strong>. We're thrilled to have you as part of our community of changemakers.
          </p>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 24px;">Here's what you can do:</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="padding:12px 16px;background:#ecfdf5;border-radius:8px;margin-bottom:8px;">
                <p style="margin:0;color:#065f46;font-size:14px;">🚀 <strong>Create a campaign</strong> and start raising funds</p>
              </td>
            </tr>
            <tr><td style="height:8px;"></td></tr>
            <tr>
              <td style="padding:12px 16px;background:#eff6ff;border-radius:8px;">
                <p style="margin:0;color:#1e40af;font-size:14px;">💖 <strong>Donate</strong> to campaigns you care about</p>
              </td>
            </tr>
          </table>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display:inline-block;background:${brandColor};color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Go to Dashboard →</a>
        `)
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  // 2. Login notification
  async sendLoginNotification(email, name) {
    try {
      const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'New Login Detected 🔐',
        html: emailWrapper(`
          <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">Hello ${name},</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            We noticed a new login to your ${brandName} account.
          </p>
          <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin-bottom:16px;">
            <p style="margin:0;color:#374151;font-size:14px;">📅 <strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0;">
            If this was you, no action is needed. If you didn't authorize this login, please secure your account immediately.
          </p>
        `)
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending login notification email:', error);
    }
  }

  // 3. Campaign created (submitted for review)
  async sendCampaignCreation(email, campaignTitle) {
    try {
      const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Campaign Submitted for Review 📋',
        html: emailWrapper(`
          <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">Campaign Submitted! 🎯</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Your campaign <strong>"${campaignTitle}"</strong> has been successfully submitted.
          </p>
          <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin-bottom:16px;">
            <p style="margin:0;color:#92400e;font-size:14px;">⏳ <strong>Status:</strong> Pending Admin Review</p>
          </div>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0;">
            Our team will review your campaign shortly. You'll receive an email once it's approved and live for donations.
          </p>
        `)
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending campaign creation email:', error);
    }
  }

  // 4. Campaign approved
  async sendCampaignApproval(email, campaignTitle) {
    try {
      const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Campaign Approved! 🎉',
        html: emailWrapper(`
          <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">Congratulations! 🥳</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Your campaign <strong>"${campaignTitle}"</strong> has been <span style="color:${brandColor};font-weight:700;">approved</span> and is now live!
          </p>
          <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:16px;margin-bottom:16px;">
            <p style="margin:0;color:#065f46;font-size:14px;">✅ <strong>Status:</strong> Live & Accepting Donations</p>
          </div>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
            Share your campaign link with friends, family, and social media to start receiving donations.
          </p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/campaigns" style="display:inline-block;background:${brandColor};color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">View Campaign →</a>
        `)
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending campaign approval email:', error);
    }
  }

  // 5. Campaign rejected
  async sendCampaignRejection(email, campaignTitle, reason) {
    try {
      const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Campaign Status Update',
        html: emailWrapper(`
          <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">Campaign Update</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Your campaign <strong>"${campaignTitle}"</strong> has been reviewed by our team.
          </p>
          <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:16px;margin-bottom:16px;">
            <p style="margin:0;color:#991b1b;font-size:14px;">❌ <strong>Status:</strong> Not Approved</p>
            <p style="margin:8px 0 0;color:#991b1b;font-size:13px;"><strong>Reason:</strong> ${reason || 'Please review our guidelines and try again.'}</p>
          </div>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0;">
            You can update your campaign details and resubmit it for review from your dashboard.
          </p>
        `)
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending campaign rejection email:', error);
    }
  }

  // 6. Donation confirmation to donor
  async sendDonationConfirmation(email, donorName, campaignTitle, amount) {
    try {
      const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thank You for Your Donation! 💚',
        html: emailWrapper(`
          <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">Thank You, ${donorName}! 💖</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Your generous donation has been successfully processed.
          </p>
          <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:20px;margin-bottom:16px;text-align:center;">
            <p style="margin:0;color:#065f46;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Donation Amount</p>
            <p style="margin:8px 0 0;color:${brandColor};font-size:32px;font-weight:800;">₹${Number(amount).toLocaleString('en-IN')}</p>
            <p style="margin:8px 0 0;color:#065f46;font-size:14px;">to <strong>"${campaignTitle}"</strong></p>
          </div>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0;">
            Your support makes a real difference. Thank you for being a changemaker! 🙌
          </p>
        `)
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending donation confirmation:', error);
    }
  }

  // 7. Notify campaign owner when they receive a donation
  async sendDonationReceivedNotification(email, ownerName, donorName, campaignTitle, amount, totalRaised) {
    try {
      const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `New Donation Received! ₹${Number(amount).toLocaleString('en-IN')} 🎉`,
        html: emailWrapper(`
          <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">You received a donation! 🎁</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Hi ${ownerName}, great news! Your campaign received a new contribution.
          </p>
          <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:20px;margin-bottom:16px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:4px 0;"><span style="color:#6b7280;font-size:13px;">Campaign</span></td>
                <td style="text-align:right;padding:4px 0;"><strong style="color:#111827;font-size:14px;">${campaignTitle}</strong></td>
              </tr>
              <tr>
                <td style="padding:4px 0;"><span style="color:#6b7280;font-size:13px;">Donor</span></td>
                <td style="text-align:right;padding:4px 0;"><strong style="color:#111827;font-size:14px;">${donorName}</strong></td>
              </tr>
              <tr>
                <td style="padding:4px 0;"><span style="color:#6b7280;font-size:13px;">Amount</span></td>
                <td style="text-align:right;padding:4px 0;"><strong style="color:${brandColor};font-size:18px;">₹${Number(amount).toLocaleString('en-IN')}</strong></td>
              </tr>
              <tr>
                <td colspan="2" style="padding:12px 0 4px;"><hr style="border:none;border-top:1px solid #d1fae5;margin:0;"></td>
              </tr>
              <tr>
                <td style="padding:4px 0;"><span style="color:#6b7280;font-size:13px;">Total Raised</span></td>
                <td style="text-align:right;padding:4px 0;"><strong style="color:#111827;font-size:16px;">₹${Number(totalRaised).toLocaleString('en-IN')}</strong></td>
              </tr>
            </table>
          </div>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/user-dashboard" style="display:inline-block;background:${brandColor};color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">View Dashboard →</a>
        `)
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending donation received notification:', error);
    }
  }

  // Milestone update
  async sendMilestoneUpdate(email, campaignTitle, milestoneTitle) {
    try {
      const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Milestone Achieved! 🏆',
        html: emailWrapper(`
          <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">Milestone Achieved! 🏆</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Congratulations! Your campaign <strong>"${campaignTitle}"</strong> has reached the milestone:
          </p>
          <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:16px;margin-bottom:16px;text-align:center;">
            <p style="margin:0;color:${brandColor};font-size:18px;font-weight:700;">🎯 ${milestoneTitle}</p>
          </div>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0;">
            Funds for this milestone have been released. Keep going!
          </p>
        `)
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending milestone update:', error);
    }
  }

  // 8. Goal reached notification
  async sendGoalReachedNotification(email, ownerName, campaignTitle, goalAmount) {
    try {
      const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Campaign Goal Reached! 🎉 Campaign "${campaignTitle}" has hit its target!`,
        html: emailWrapper(`
          <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">Congratulations, ${ownerName}! 🥳🏆</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Incredible news! Your campaign <strong>"${campaignTitle}"</strong> has successfully reached its fundraising goal of <strong>₹${Number(goalAmount).toLocaleString('en-IN')}</strong>!
          </p>
          <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:20px;margin-bottom:16px;text-align:center;">
            <p style="margin:0;color:#065f46;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Goal Achieved</p>
            <p style="margin:8px 0 0;color:${brandColor};font-size:32px;font-weight:800;">₹${Number(goalAmount).toLocaleString('en-IN')}</p>
          </div>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
            Thank you for your incredible effort and dedication to making a difference. You can now manage your campaign updates and milestone releases from your dashboard.
          </p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/user-dashboard" style="display:inline-block;background:${brandColor};color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Go to Dashboard →</a>
        `)
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending goal reached notification:', error);
    }
  }

  // 9. Send verification email
  async sendVerificationEmail(email, name, token) {
    try {
      const verifyUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/verify-email/${token}`;
      const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Verify your email for ${brandName} 🔐`,
        html: emailWrapper(`
          <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">Hello ${name},</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Thank you for registering on <strong>${brandName}</strong>. Please click the button below to verify your email address and activate your account:
          </p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${verifyUrl}" style="display:inline-block;background:${brandColor};color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;box-shadow:0 4px 12px rgba(5,150,105,0.2);">Verify Email Address</a>
          </div>
          <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 10px;">
            If the button doesn't work, copy and paste this URL into your browser:
          </p>
          <p style="color:#6b7280;font-size:13px;word-break:break-all;background:#f3f4f6;padding:12px;border-radius:8px;">
            ${verifyUrl}
          </p>
          <p style="color:#9ca3af;font-size:13px;margin:20px 0 0;">
            If you did not create this account, you can safely ignore this email.
          </p>
        `)
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email verification link:', error);
      const verifyUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/verify-email/${token}`;
      console.log(`\n==================================================`);
      console.log(`[DEVELOPMENT FALLBACK] Verification link for ${email}:`);
      console.log(`${verifyUrl}`);
      console.log(`==================================================\n`);
    }
  }
}

export default new EmailService();