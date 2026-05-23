import cron from 'node-cron';

import { syncEmails } from '../services/email-sync.service';

export function startEmailScheduler() {
  console.log('Email scheduler started...');

  // every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('Running scheduled Gmail sync...');

      await syncEmails();

      console.log('Scheduled sync completed');
    } catch (err) {
      console.error('Scheduled sync failed:', err);
    }
  });
}