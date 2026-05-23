import prisma from '../database/prisma/prisma-client';

interface CreateLogPayload {
  emailId?: string;
  step: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export async function createLog(
  payload: CreateLogPayload
) {
  return prisma.log.create({
    data: payload
  });
}