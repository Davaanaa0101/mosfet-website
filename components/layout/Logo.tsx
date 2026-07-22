import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 font-bold text-slate-950">
        M
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-wider">
          MOSFET
        </h1>

        <p className="text-xs text-slate-400">
          Engineering Smarter Systems
        </p>
      </div>
    </Link>
  );
}