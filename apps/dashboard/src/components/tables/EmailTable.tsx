import { useNavigate } from 'react-router-dom';

interface Email {
  id: string;

  sender: string;

  subject: string;

  category: string;

  status: string;

  receivedAt: string;
}

interface Props {
  emails: Email[];
}

export default function EmailTable({
  emails
}: Props) {


  console.table(emails);
  

  const navigate = useNavigate();

  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        overflow-hidden
      "
    >
      <table className="w-full">
        <thead className="bg-slate-800">
          <tr>
            <th className="text-left p-4 text-sm text-slate-300">
              Sender
            </th>

            <th className="text-left p-4 text-sm text-slate-300">
              Subject
            </th>

            <th className="text-left p-4 text-sm text-slate-300">
              Category
            </th>

            <th className="text-left p-4 text-sm text-slate-300">
              Status
            </th>

            <th className="text-left p-4 text-sm text-slate-300">
              Received
            </th>
          </tr>
        </thead>

        <tbody>
          {emails?.filter((e)=>e.sender!="syedmohd3433@gmail.com")?.map((email) => (
            <tr
              key={email.id}
              onClick={() =>
                navigate(`/emails/${email.id}`)
              }
              className="
                border-t
                border-slate-800
                hover:bg-slate-800/50
                transition-all
                cursor-pointer
              "
            >
              <td className="p-4 text-white text-sm">
                {email.sender}
              </td>

              <td className="p-4 text-slate-300 text-sm">
                {email.subject}
              </td>

              <td className="p-4">
                <span
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-blue-500/20
                    text-blue-400
                    text-xs
                  "
                >
                  {email.category}
                </span>
              </td>

              <td className="p-4">
                <span
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-emerald-500/20
                    text-emerald-400
                    text-xs
                  "
                >
                  {email.status}
                </span>
              </td>

              <td className="p-4 text-slate-400 text-sm">
                {new Date(
                  email.receivedAt
                ).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}