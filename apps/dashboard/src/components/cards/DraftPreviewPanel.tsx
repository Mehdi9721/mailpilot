export default function DraftPreviewPanel() {
  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-6
      "
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          AI Draft Reply
        </h2>

        <span
          className="
            px-3
            py-1
            rounded-full
            text-xs
            bg-emerald-500/20
            text-emerald-400
          "
        >
          Draft Ready
        </span>
      </div>

      <div
        className="
          mt-6
          p-4
          rounded-xl
          bg-slate-950
          border
          border-slate-800
          min-h-[250px]
        "
      >
        <p className="text-sm leading-7 text-slate-300">
          Hello,

          <br />
          <br />

          Thank you for reaching out regarding your
          refund request.

          <br />
          <br />

          Our support team is reviewing your case and
          will update you shortly.

          <br />
          <br />

          Best regards,
          <br />
          AI Support Team
        </p>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          className="
            px-5
            py-3
            rounded-xl
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            font-medium
            transition-all
          "
        >
          Approve Draft
        </button>

        <button
          className="
            px-5
            py-3
            rounded-xl
            bg-red-600
            hover:bg-red-700
            text-white
            font-medium
            transition-all
          "
        >
          Reject Draft
        </button>

        <button
          className="
            px-5
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-medium
            transition-all
          "
        >
          Send Email
        </button>
      </div>
    </div>
  );
}