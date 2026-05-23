import { useEffect, useState } from 'react';

import EmailTable from '../components/tables/EmailTable';

import {
  getEmails,
  syncEmails
} from '../api/services/email-api';

export default function InboxPage() {
  const [emails, setEmails] = useState([]);

  const [loading, setLoading] =
    useState(false);

 async function loadEmails() {
  try {
    const response = await getEmails();

    const formattedEmails = response.data.map(
      (email: any) => {
        const headers =
          email.payload?.headers || [];

        const getHeader = (name: string) =>
          headers.find(
            (h: any) =>
              h.name.toLowerCase() ===
              name.toLowerCase()
          )?.value || '';

        return {
          id: email.id,

          sender: getHeader('From'),

          subject: getHeader('Subject'),

          category:
            email.labelIds
              ?.find((label: string) =>
                label.startsWith('CATEGORY_')
              )
              ?.replace('CATEGORY_', '') ||
            'PRIMARY',

          status:
            email.labelIds?.includes(
              'UNREAD'
            )
              ? 'Unread'
              : 'Read',

          receivedAt: getHeader('Date')
        };
      }
    );

    setEmails(formattedEmails);
  } catch (error) {
    console.error(error);
  }
}
  async function handleSyncEmails() {
    try {
      setLoading(true);

      await syncEmails();

      await loadEmails();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmails();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Inbox
          </h1>

          <p className="mt-2 text-slate-400">
            AI email orchestration center
          </p>
        </div>

        <button
          onClick={handleSyncEmails}
          disabled={loading}
          className="
            px-5
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            transition-all
            text-white
            font-medium
          "
        >
          {loading
            ? 'Syncing...'
            : 'Sync Emails'}
        </button>
      </div>

      <EmailTable emails={emails} />
    </div>
  );
}