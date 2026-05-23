import { Router } from 'express';

import { fetchEmails } from '../../services/gmail.service';
import { syncEmails } from '../../services/email-sync.service';

const router = Router();

router.get('/emails', async (_req, res) => {
  try {
    const emails = await fetchEmails();

    return res.json({
      success: true,
      data: emails
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false
    });
  }
});

router.post('/sync', async (_req, res) => {
  try {
    await syncEmails();

    return res.json({
      success: true,
      message: 'Emails synced'
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false
    });
  }
});
export default router;