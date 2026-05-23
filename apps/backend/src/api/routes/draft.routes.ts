import { Router } from 'express';

import { generateEmailDraft } from '../../services/draft.service';

const router = Router();

router.post('/:emailId', async (req, res) => {
  try {
    const draft = await generateEmailDraft(
      req.params.emailId
    );

    return res.json({
      success: true,
      data: draft
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false
    });
  }
});

export default router;