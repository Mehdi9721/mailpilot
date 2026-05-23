import { Router } from 'express';
import prisma from '../../database/prisma/prisma-client';

const router = Router();

// GET all rules
router.get('/', async (_req, res) => {
  try {
    const rules = await prisma.categoryRule.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: rules });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch rules' });
  }
});

// CREATE new rule
router.post('/', async (req, res) => {
  try {
    const { category, autoReplyEnabled, replyTone, replyStyle, allowedDomains, blockedDomains } = req.body;
    const newRule = await prisma.categoryRule.create({
      data: { category, autoReplyEnabled, replyTone, replyStyle, allowedDomains, blockedDomains },
    });
    return res.json({ success: true, data: newRule });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to create rule' });
  }
});

// UPDATE existing rule
router.put('/:id', async (req, res) => {
  try {
    const { autoReplyEnabled, replyTone, replyStyle, allowedDomains, blockedDomains } = req.body;
    const updatedRule = await prisma.categoryRule.update({
      where: { id: req.params.id },
      data: { autoReplyEnabled, replyTone, replyStyle, allowedDomains, blockedDomains },
    });
    return res.json({ success: true, data: updatedRule });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to update rule' });
  }
});

// DELETE rule
router.delete('/:id', async (req, res) => {
  try {
    await prisma.categoryRule.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'Rule deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to delete rule' });
  }
});

export default router;