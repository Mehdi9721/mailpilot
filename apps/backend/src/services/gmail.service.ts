import { google } from 'googleapis';

import oauth2Client from '../config/google';

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client
});

export async function fetchEmails() {
  const response =
    await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10
    });

  const messages =
    response.data.messages || [];

  const fullEmails = await Promise.all(
    messages.map(async (message) => {
      const email =
        await gmail.users.messages.get({
          userId: 'me',
          id: message.id!
        });

      return email.data;
    })
  );

  return fullEmails;
}