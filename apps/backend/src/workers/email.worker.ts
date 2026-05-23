import { processEmail } from '../workflows/email-processing.workflow';

export async function runEmailWorker(
  emailId: string
) {
  setImmediate(async () => {
    try {
      await processEmail(emailId);
    } catch (error) {
      console.error(error);
    }
  });
}