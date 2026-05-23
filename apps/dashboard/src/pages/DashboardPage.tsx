const dashboardCards = [
  {
    title: 'Total Emails',
    value: '1,248'
  },
  {
    title: 'Replies Generated',
    value: '1,102'
  },
  {
    title: 'Pending Reviews',
    value: '32'
  },
  {
    title: 'Failed Replies',
    value: '12'
  }
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          AI Email Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Monitor email processing, AI replies, logs, and analytics.
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >
        {dashboardCards.map((card) => (
          <div
            key={card.title}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
            "
          >
            <h2 className="text-sm text-slate-400">
              {card.title}
            </h2>

            <p className="mt-4 text-3xl font-bold text-white">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
          min-h-[400px]
        "
      >
        <h2 className="text-xl font-semibold text-white">
          Recent Email Activity
        </h2>

        <div
          className="
            mt-6
            flex
            items-center
            justify-center
            h-64
            border
            border-dashed
            border-slate-700
            rounded-xl
          "
        >
          <span className="text-slate-500">
            Email analytics and charts will appear here.
          </span>
        </div>
      </div>
    </div>
  );
}