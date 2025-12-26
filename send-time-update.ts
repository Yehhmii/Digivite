/**
 * Script to send wedding mass time update emails to all guests
 * 
 * IMPORTANT: Read the README.md file first for setup instructions and best practices
 * 
 * Usage:
 *   npx tsx send-time-update.ts [--dry-run] [--batch-size=20] [--delay=2000]
 * 
 * Options:
 *   --dry-run         Test mode - shows what would be sent without actually sending
 *   --batch-size=N    Number of emails per batch (default: 20, recommended: 10-30)
 *   --delay=N         Milliseconds between emails (default: 2000, recommended: 2000-5000)
 */

import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import path from 'path';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_BATCH_SIZE = 20;  // Emails per batch
const DEFAULT_EMAIL_DELAY = 2000;  // 2 seconds between emails
const BATCH_PAUSE = 60000;  // 1 minute pause between batches

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const batchSize = parseInt(args.find(a => a.startsWith('--batch-size='))?.split('=')[1] ?? `${DEFAULT_BATCH_SIZE}`);
const emailDelay = parseInt(args.find(a => a.startsWith('--delay='))?.split('=')[1] ?? `${DEFAULT_EMAIL_DELAY}`);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function env(name: string): string {
  return process.env[name] ?? '';
}

async function createTransporter() {
  const host = env('SMTP_HOST') || 'smtp.gmail.com';
  const port = Number(env('SMTP_PORT') || 587);
  const secure = env('SMTP_SECURE') === 'true';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: env('SMTP_USER'),
      pass: env('SMTP_PASS'),
    },
    tls: {
      minVersion: 'TLSv1.2',
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// EMAIL TEMPLATE
// ============================================================================

function getEmailHtml(guestName: string | null): string {
  const displayName = guestName || 'Beloved Guest';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A44 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 1px;">
            #OURFOREVERBEGINS
          </h1>
        </div>
        
        <!-- Main Content -->
        <div style="background-color: #ffffff; padding: 40px 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
          
          <!-- Greeting -->
          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Good day, <strong>${displayName}</strong>,
          </p>
          
          <!-- Important Notice Box -->
          <div style="background-color: #FFF4E6; border-left: 4px solid #722F37; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <h2 style="color: #722F37; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
              📅 Important Time Update
            </h2>
            <p style="color: #333333; font-size: 15px; line-height: 1.7; margin: 0;">
              We wish to inform you that the time for our wedding Mass has been adjusted to <strong style="color: #722F37; font-size: 17px;">12:00 noon</strong> due to a church activity scheduled for the morning, which came to our notice late.
            </p>
          </div>
          
          <!-- Event Details -->
          <div style="background-color: #F9F9F9; padding: 20px; margin: 25px 0; border-radius: 6px; border: 1px solid #E5E5E5;">
            <h3 style="color: #722F37; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
              Updated Event Details
            </h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                  <strong>Date:</strong>
                </td>
                <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                  December 20th, 2025
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                  <strong>Mass Time:</strong>
                </td>
                <td style="padding: 8px 0; color: #722F37; font-size: 15px; font-weight: 600;">
                  12:00 noon
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                  <strong>Reception:</strong>
                </td>
                <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                  Immediately after Mass
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Apology and Closing -->
          <p style="color: #333333; font-size: 15px; line-height: 1.7; margin: 20px 0;">
            We sincerely apologize for any inconvenience this may cause and warmly look forward to welcoming you to celebrate with us at 12:00 noon on December 20th, 2025.
          </p>
          
          <p style="color: #333333; font-size: 15px; line-height: 1.7; margin: 20px 0;">
            The reception will follow immediately after the Mass.
          </p>
          
          <p style="color: #333333; font-size: 15px; line-height: 1.7; margin: 20px 0;">
            Thank you very much for your understanding and love.
          </p>
          
          <!-- Signature -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #E5E5E5;">
            <p style="color: #722F37; font-size: 16px; font-weight: 600; margin: 0;">
              Yours truly,
            </p>
            <p style="color: #722F37; font-size: 18px; font-weight: 700; margin: 5px 0 0 0; font-style: italic;">
              OurForeverBegins
            </p>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 20px; padding: 20px; text-align: center; color: #999999; font-size: 12px; line-height: 1.6;">
          <p style="margin: 0 0 8px 0;">
            This is an important update regarding your invitation to our wedding.
          </p>
          <p style="margin: 0; color: #BBBBBB;">
            Sent via DigiVite Event Management System
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
}

function getPlainTextVersion(guestName: string | null): string {
  const displayName = guestName || 'Beloved Guest';
  
  return `
#OURFOREVERBEGINS

Good day, ${displayName},

IMPORTANT TIME UPDATE

We wish to inform you that the time for our wedding Mass has been adjusted to 12:00 noon due to a church activity scheduled for the morning, which came to our notice late.

UPDATED EVENT DETAILS:
- Date: December 20th, 2025
- Mass Time: 12:00 noon
- Reception: Immediately after Mass

We sincerely apologize for any inconvenience this may cause and warmly look forward to welcoming you to celebrate with us at 12:00 noon on December 20th, 2025.

The reception will follow immediately after the Mass.

Thank you very much for your understanding and love.

Yours truly,
OurForeverBegins

---
This is an important update regarding your invitation to our wedding.
Sent via DigiVite Event Management System
  `.trim();
}

// ============================================================================
// EMAIL SENDING FUNCTION
// ============================================================================

async function sendUpdateEmail(
  transporter: nodemailer.Transporter,
  to: string,
  guestName: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const mailOptions = {
      from: {
        name: 'OurForeverBegins Wedding',
        address: env('EMAIL_FROM') || env('SMTP_USER'),
      },
      to,
      subject: 'Important Update: Wedding Mass Time Changed to 12:00 Noon',
      html: getEmailHtml(guestName),
      text: getPlainTextVersion(guestName),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'DigiVite Event System',
      },
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

// ============================================================================
// MAIN SCRIPT
// ============================================================================

async function main() {
  console.log('============================================');
  console.log('Wedding Mass Time Update Email Script');
  console.log('============================================\n');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No emails will be sent\n');
  }

  console.log('Configuration:');
  console.log(`  - Batch Size: ${batchSize} emails`);
  console.log(`  - Email Delay: ${emailDelay}ms`);
  console.log(`  - Batch Pause: ${BATCH_PAUSE}ms\n`);

  // Fetch all guests with confirmed RSVPs (have email)
  console.log('📊 Fetching guest list...\n');
  
  const guests = await prisma.guest.findMany({
    where: {
      email: {
        not: null,
      },
      OR: [
        { rsvpStatus: 'ACCEPTED' },
        { status: 'ACCEPTED' },
      ],
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      rsvpAt: true,
    },
    orderBy: {
      fullName: 'asc',
    },
  });

  console.log(`Found ${guests.length} guests with confirmed RSVPs\n`);

  if (guests.length === 0) {
    console.log('No guests to email. Exiting.');
    return;
  }

  // Preview
  console.log('First 5 guests:');
  guests.slice(0, 5).forEach((guest, idx) => {
    console.log(`  ${idx + 1}. ${guest.fullName} <${guest.email}>`);
  });
  if (guests.length > 5) {
    console.log(`  ... and ${guests.length - 5} more\n`);
  }

  if (isDryRun) {
    console.log('\n✅ Dry run complete. Run without --dry-run to send emails.');
    return;
  }

  // Confirm before sending
  console.log('\n⚠️  WARNING: This will send emails to all guests listed above.');
  console.log('Press Ctrl+C within 10 seconds to cancel...\n');
  await sleep(10000);

  console.log('🚀 Starting email send...\n');

  // Create transporter
  const transporter = await createTransporter();

  // Track results
  let sent = 0;
  let failed = 0;
  const failures: Array<{ guest: string; email: string; error: string }> = [];

  // Send in batches
  const totalBatches = Math.ceil(guests.length / batchSize);
  
  for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
    const batchStart = batchNum * batchSize;
    const batchEnd = Math.min(batchStart + batchSize, guests.length);
    const batch = guests.slice(batchStart, batchEnd);

    console.log(`\n📧 Batch ${batchNum + 1}/${totalBatches} (${batchStart + 1}-${batchEnd} of ${guests.length})`);

    for (let i = 0; i < batch.length; i++) {
      const guest = batch[i];
      
      if (!guest.email) {
        continue;
      }

      process.stdout.write(`  Sending to ${guest.fullName} <${guest.email}>... `);

      const result = await sendUpdateEmail(transporter, guest.email, guest.fullName);

      if (result.success) {
        console.log('✅');
        sent++;
      } else {
        console.log(`❌ ${result.error}`);
        failed++;
        failures.push({
          guest: guest.fullName || 'Unknown',
          email: guest.email,
          error: result.error || 'Unknown error',
        });
      }

      // Delay between emails (except for last email in batch)
      if (i < batch.length - 1) {
        await sleep(emailDelay);
      }
    }

    // Pause between batches (except for last batch)
    if (batchNum < totalBatches - 1) {
      console.log(`\n⏸️  Pausing for ${BATCH_PAUSE / 1000} seconds before next batch...`);
      await sleep(BATCH_PAUSE);
    }
  }

  // Summary
  console.log('\n============================================');
  console.log('SUMMARY');
  console.log('============================================');
  console.log(`✅ Successfully sent: ${sent}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${guests.length}`);

  if (failures.length > 0) {
    console.log('\n❌ Failed emails:');
    failures.forEach(({ guest, email, error }) => {
      console.log(`  - ${guest} <${email}>: ${error}`);
    });
  }

  console.log('\n✅ Email send complete!\n');
}

// ============================================================================
// RUN
// ============================================================================

main()
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });