import prisma from '../database/prisma/prisma-client';

export async function getCategoryRule(
  category: string
) {
  return prisma.categoryRule.findUnique({
    where: {
      category
    }
  });
}