import { Router } from 'express';

import prisma from '../../database/prisma/prisma-client';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const emails = await prisma.email.findMany({
      orderBy: {
        receivedAt: 'desc'
      }
    });

    return res.json({
      success: true,
      data: emails
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch emails'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    console.log(req.params.id," req.params.id");
    
    const email = await prisma.email.findUnique({
      where: {
        gmailMessageId: req.params.id
      },
      // include: {
      //   drafts: true,
      //   logs: {
      //     orderBy: {
      //       createdAt: 'desc'
      //     }
      //   }
      // }
    });
    console.table(email + "email");


    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    return res.json({
      success: true,
      data: email
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch email'
    });
  }
});

export default router;