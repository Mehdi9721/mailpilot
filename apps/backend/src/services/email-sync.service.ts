import prisma from '../database/prisma/prisma-client';

import { fetchEmails } from './gmail.service';

import { parseGmailEmail } from '../email/parsers/gmail.parser';

import { classifyEmailCategory } from '../ai/classifiers/category-classifier';

import { createLog } from './log.service';

import { runEmailWorker } from '../workers/email.worker';

import logger from '../logger/logger';
import { log } from 'node:console';

export async function syncEmails() {
  const MY_EMAIL = process.env.MAIL_USER;
  try {
    logger.info(
      'Starting Gmail synchronization'
    );

    const rawEmails = await fetchEmails();

    logger.info(
      `Fetched ${rawEmails.length} emails from Gmail`
    );

    for (const rawEmail of rawEmails) {
      try {
        const parsedEmail =
          parseGmailEmail(rawEmail);
if (parsedEmail.sender === MY_EMAIL) {
  logger.info(`Skipping self email: ${parsedEmail.gmailMessageId}`);
  continue;
}

const isSystemEmail =
  parsedEmail.headers['x-mailpilot'] === 'true';

if (isSystemEmail) {
  logger.info(`Skipping system email: ${parsedEmail.gmailMessageId}`);
  continue;
}

        logger.info({
          gmailMessageId:
            parsedEmail.gmailMessageId,

          subject: parsedEmail.subject
        });

        const existingEmail =
          await prisma.email.findUnique({
            where: {
              gmailMessageId:
                parsedEmail.gmailMessageId
            }
          });

        if (existingEmail) {
          logger.info(
            `Duplicate email skipped: ${parsedEmail.gmailMessageId}`
          );

          continue;
        }

        const category =
          classifyEmailCategory(
            parsedEmail.subject,
            parsedEmail.body
          );
        function cleanEmailBody(html: string) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  }

console.log('INSERT PAYLOAD', {
  gmailMessageId: parsedEmail.gmailMessageId,
  threadId: parsedEmail.threadId,
  sender: parsedEmail.sender,
  subject: parsedEmail.subject,
  bodyLength: parsedEmail.body?.length,
  receivedAt: parsedEmail.receivedAt
});


        const savedEmail =
          await prisma.email.create({
            data: {
              gmailMessageId:
                parsedEmail.gmailMessageId,

              threadId:
                parsedEmail.threadId,

              sender:
                parsedEmail.sender,

              subject:
                parsedEmail.subject,

              body:
                cleanEmailBody(parsedEmail.body),

              category,

              status: 'RECEIVED',

              receivedAt:
               new Date(parsedEmail.receivedAt)
            }
          });

        logger.info(
          `Email saved: ${savedEmail.id}`
        );

        await createLog({
          emailId: savedEmail.id,

          step: 'EMAIL_SYNCED',

          message:
            'Email synced successfully',

          metadata: {
            sender:
              parsedEmail.sender,

            category
          }
        });

        logger.info(
          `Log created for email: ${savedEmail.id}`
        );

        await runEmailWorker(
          savedEmail.id
        );

        logger.info(
          `Async workflow triggered for: ${savedEmail.id}`
        );
      } catch (emailError) {
        logger.error(emailError);

        await createLog({
          step: 'EMAIL_SYNC_FAILED',

          message:
            'Failed to process email',

          metadata: {
            error: String(emailError)
          }
        });
      }
    }

    logger.info(
      'Gmail synchronization completed'
    );

    return {
      success: true
    };
  } catch (error) {
    logger.error(error);

    await createLog({
      step: 'SYNC_FAILED',

      message:
        'Complete email sync failed',

      metadata: {
        error: String(error)
      }
    });

    throw error;
  }
}