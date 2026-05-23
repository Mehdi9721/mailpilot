import { Router } from 'express';

import prisma from '../../database/prisma/prisma-client';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const logs = await prisma.log.findMany({
      orderBy: {
        createdAt: 'desc'
      },

      take: 100
    });

    return res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch logs'
    });
  }
});

export default router;