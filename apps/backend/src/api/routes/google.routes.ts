import { Router } from 'express';
import oauth2Client from '../../config/google';

const router = Router();

router.get('/login', (_req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly']
  });

  res.redirect(url);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code as string;

  const { tokens } = await oauth2Client.getToken(code);

  console.log(tokens);

  res.json(tokens);
});

export default router;