import { useEffect, useState } from 'react';
import { getLogs } from '../api/services/log-api';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);

  async function loadLogs() {
    try {
      const response = await getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // initial fetch
    loadLogs();

    // auto refresh every 30 seconds
    const interval = setInterval(() => {
      loadLogs();
    }, 30000);

    // cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          System Logs
        </h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {logs.map((log: any) => (
          <div
            key={log.id}
            className="p-5 border-b border-slate-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-white font-medium">
                {log.step} (message: {log.emailId})
              </h2>

              <span className="text-sm text-slate-500">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="mt-2 text-slate-400 text-sm">
              {log.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}