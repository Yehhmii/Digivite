/**
 * Manual Retry Script - Hardcoded Failed Guests
 * 
 * For retrying specific guests by email address
 * 
 * Usage:
 *   npx tsx retry-manual.ts [--dry-run] [--delay=5000]
 */

import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

// ============================================================================
// MANUAL LIST - Add the failed email addresses here
// ============================================================================

const FAILED_EMAILS = [
  'Mrs Unice Maurice',
  'Mrs Yomi oyenubi', 
  'Mrs motherloventina Desola',
  'Odinaka okeke',
  'Pastor Daniel Okhionkpamwonyi',
  'Philip Obuh',
  'Prince Babatunde Vincent',
  'Samuel Obi',
  'Wisdom Abraham'
];

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_EMAIL_DELAY = 5000;  // 5 seconds between emails

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
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
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
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
        
        <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A44 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 1px;">
            #OURFOREVERBEGINS
          </h1>
        </div>
        
        <div style="background-color: #ffffff; padding: 40px 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
          
          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Good day, <strong>${displayName}</strong>,
          </p>
          
          <div style="background-color: #FFF4E6; border-left: 4px solid #722F37; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <h2 style="color: #722F37; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
              📅 Important Time Update
            </h2>
            <p style="color: #333333; font-size: 15px; line-height: 1.7; margin: 0;">
              We wish to inform you that the time for our wedding Mass has been adjusted to <strong style="color: #722F37; font-size: 17px;">12:00 noon</strong> due to a church activity scheduled for the morning, which came to our notice late.
            </p>
          </div>
          
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
          
          <p style="color: #333333; font-size: 15px; line-height: 1.7; margin: 20px 0;">
            We sincerely apologize for any inconvenience this may cause and warmly look forward to welcoming you to celebrate with us at 12:00 noon on December 20th, 2025.
          </p>
          
          <p style="color: #333333; font-size: 15px; line-height: 1.7; margin: 20px 0;">
            The reception will follow immediately after the Mass.
          </p>
          
          <p style="color: #333333; font-size: 15px; line-height: 1.7; margin: 20px 0;">
            Thank you very much for your understanding and love.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #E5E5E5;">
            <p style="color: #722F37; font-size: 16px; font-weight: 600; margin: 0;">
              Yours truly,
            </p>
            <p style="color: #722F37; font-size: 18px; font-weight: 700; margin: 5px 0 0 0; font-style: italic;">
              OurForeverBegins
            </p>
          </div>
          
        </div>
        
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
// EMAIL SENDING
// ============================================================================

async function sendUpdateEmail(
  transporter: nodemailer.Transporter,
  to: string,
  guestName: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    await transporter.sendMail({
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
    });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('============================================');
  console.log('Manual Retry for Failed Guests');
  console.log('============================================\n');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No emails will be sent\n');
  }

  console.log(`Configuration:`);
  console.log(`  - Email Delay: ${emailDelay}ms\n`);

  // Fetch guests by name
  console.log('📊 Fetching guests from manual list...\n');
  
  const guests = await prisma.guest.findMany({
    where: {
      fullName: {
        in: FAILED_EMAILS,
      },
      email: {
        not: null,
      },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
    orderBy: {
      fullName: 'asc',
    },
  });

  console.log(`Found ${guests.length} of ${FAILED_EMAILS.length} guests in database\n`);

  if (guests.length === 0) {
    console.log('❌ No guests found. Check the names in FAILED_EMAILS array.');
    return;
  }

  // Show list
  console.log('Guests to retry:');
  guests.forEach((guest, idx) => {
    console.log(`  ${idx + 1}. ${guest.fullName} <${guest.email}>`);
  });
  
  // Show any not found
  const foundNames = guests.map(g => g.fullName);
  const notFound = FAILED_EMAILS.filter(name => !foundNames.includes(name));
  if (notFound.length > 0) {
    console.log('\n⚠️  Not found in database:');
    notFound.forEach(name => console.log(`  - ${name}`));
  }
  console.log('');

  if (isDryRun) {
    console.log('✅ Dry run complete. Run without --dry-run to send.');
    return;
  }

  console.log('⚠️  Ready to send. Press Ctrl+C within 5 seconds to cancel...\n');
  await sleep(5000);

  console.log('🚀 Sending...\n');

  const transporter = await createTransporter();

  let sent = 0;
  let failed = 0;
  const failures: Array<{ guest: string; email: string; error: string }> = [];

  for (let i = 0; i < guests.length; i++) {
    const guest = guests[i];
    
    if (!guest.email) continue;

    process.stdout.write(`  ${i + 1}/${guests.length} ${guest.fullName} <${guest.email}>... `);

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

    if (i < guests.length - 1) {
      await sleep(emailDelay);
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
    console.log('\n💡 Try waiting longer or send manually.');
  } else {
    console.log('\n🎉 All retries successful!');
  }

  console.log('');
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