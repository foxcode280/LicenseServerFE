import { Bell, Search, Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <div className="flex items-center gap-4 lg:hidden">
        <button className="text-zinc-500">
          <Menu size={20} />
        </button>
        <span className="text-lg font-bold">Metronux</span>
      </div>
      
      <div className="flex flex-1 items-center gap-4 lg:ml-0">
        <div className="relative hidden w-full max-w-md lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            placeholder="Search licenses, companies..."
            className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-zinc-500 hover:text-zinc-900">
          <Bell size={20} />
          <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>
        <div className="h-8 w-px bg-zinc-200" />
        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-medium lg:block">v2.4.0</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600">
            AR
          </div>
        </div>
      </div>
    </header>
  );
}
