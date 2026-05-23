import prisma from '../database/prisma/prisma-client';

interface CreateEmailPayload {
  sender: string;
  subject: string;
  body: string;
}

export async function createEmail(
  payload: CreateEmailPayload
) {
  return prisma.email.create({
    data: payload
  });
}