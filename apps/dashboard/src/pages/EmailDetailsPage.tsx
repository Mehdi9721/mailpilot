import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import DraftPreviewPanel from '../components/cards/DraftPreviewPanel';

import { getEmailById } from '../api/services/email-api';

export default function EmailDetailsPage() {
  const { id } = useParams();

  const [email, setEmail] = useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadEmail() {
    try {
      const response =
        await getEmailById(id as string);

      console.log(response.data);

      const emailData = response?.data;

      if (!emailData) {
        setEmail(null);
        return;
      }

      setEmail(emailData);
    } catch (error) {
      console.error(error);
      setEmail(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadEmail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-white">
        Loading...
      </div>
    );
  }

  // if (!email) {
  //   return (
  //     <div className="text-red-400">
  //       Email not found
  //     </div>
  //   );
  // }

  return (
    <div
      className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
      "
    >
      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
        "
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-slate-400">
              From
            </p>

            <h2 className="text-lg text-white font-medium">
              {email?.sender}
            </h2>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Subject
            </p>

            <h1 className="text-2xl font-bold text-white">
              {email?.subject}
            </h1>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Category
            </p>

            <span
              className="
                inline-block
                mt-2
                px-3
                py-1
                rounded-full
                bg-blue-500/20
                text-blue-400
                text-sm
              "
            >
              {email?.category}
            </span>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Status
            </p>

            <p className="text-slate-300">
              {email?.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Received
            </p>

            <p className="text-slate-300">
              {new Date(
                email?.receivedAt
              ).toLocaleString()}
            </p>
          </div>
        </div>

        <div
          className="
            mt-8
            p-5
            rounded-xl
            bg-slate-950
            border
            border-slate-800
            whitespace-pre-wrap
          "
        >
          <p className="text-slate-300 leading-7">
            {email?.body}
          </p>
        </div>
      </div>

      {/* <DraftPreviewPanel /> */}
    </div>
  );
}