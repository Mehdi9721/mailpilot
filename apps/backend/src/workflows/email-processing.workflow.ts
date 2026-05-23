import prisma from '../database/prisma/prisma-client';

import { classifyEmailCategory } from '../ai/classifiers/category-classifier';

import { shouldAutoReply } from '../ai/rules/auto-reply-engine';

import { generateDraft } from '../ai/ollama/generate-draft';

import { sendEmail } from '../email/senders/gmail.sender';

import { createLog } from '../services/log.service';

export async function processEmail(
  emailId: string
) {
  const email = await prisma.email.findUnique({
    where: {
      id: emailId
    }
  });

  if (!email) {
    throw new Error('Email not found');
  }

  const category = classifyEmailCategory(
    email.subject,
    email.body
  );
console.log("category",category);

  const rule =
    await prisma.categoryRule.findUnique({
      where: {
        category
      }
    });

  if (!rule) {
    await createLog({
      emailId,
      step: 'RULE_NOT_FOUND',
      message: 'No category rule found'
    });

    return;
  }

  // const autoReply = shouldAutoReply(
  //   email.sender,
  //   rule
  // );

  if (!rule.autoReplyEnabled) {
    await prisma.email.update({
      where: {
        id: emailId
      },

      data: {
        status: 'PENDING_APPROVAL'
      }
    });

    await createLog({
      emailId,
      step: 'MANUAL_REVIEW',
      message:
        'Email moved to manual review queue'
    });

    return;
  }

  const draft = await generateDraft({
    sender: email.sender,
    subject: email.subject,
    body: email.body,
    category,
    tone: rule.replyTone
  });

  await sendEmail({
    to: email.sender,
    subject: `Re: ${email.subject}`,
    content: draft
  });

  await prisma.email.update({
    where: {
      id: emailId
    },

    data: {
      status: 'AUTO_REPLIED'
    }
  });

  await createLog({
    emailId,
    step: 'AUTO_REPLY_SENT',
    message: draft,
  });
}