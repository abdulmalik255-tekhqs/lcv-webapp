import { HiMagnifyingGlass } from "react-icons/hi2";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      <HiMagnifyingGlass className="h-8 w-8" />
    </span>
    <p className="text-sm font-semibold text-slate-700">No assets found</p>
    <p className="text-xs text-slate-500">
      Try adjusting your filters or search.
    </p>
  </div>
);

export default EmptyState;
