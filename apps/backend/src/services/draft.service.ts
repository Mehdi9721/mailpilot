// import prisma from '../database/prisma/prisma-client';

// import { generateDraft } from '../ai/ollama/generate-draft';

// import { createLog } from './log.service';

// export async function generateEmailDraft(
//   emailId: string
// ) {
//   const email = await prisma.email.findUnique({
//     where: {
//       id: emailId
//     }
//   });

//   if (!email) {
//     throw new Error('Email not found');
//   }

//   const draftContent = await generateDraft({
//     sender: email.sender,
//     subject: email.subject,
//     body: email.body,c
//     category: email.category || 'GENERAL'
//   });

//   const draft = await prisma.aiDraft.create({
//     data: {
//       emailId: email.id,
//       draftContent,
//       model: 'qwen2.5:7b'
//     }
//   });

//   await createLog({
//     emailId: email.id,
//     step: 'DRAFT_GENERATED',
//     message: 'AI draft generated'
//   });

//   return draft;
// }