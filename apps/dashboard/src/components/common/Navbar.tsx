export default function Navbar() {
  return (
    <header
      className="
        h-16
        border-b
        border-slate-800
        bg-slate-900
        flex
        items-center
        justify-between
        px-6
      "
    >
      <div>
        <h2 className="text-lg font-semibold text-white">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="
            w-3
            h-3
            rounded-full
            bg-green-500
          "
        />

        <span className="text-sm text-slate-300">
          System Active
        </span>
      </div>
    </header>
  );
}