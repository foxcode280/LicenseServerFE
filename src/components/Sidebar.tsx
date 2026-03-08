import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Key, 
  PlusCircle, 
  Activity, 
  CreditCard, 
  Building2, 
  User, 
  Settings,
  ShieldCheck,
  PawPrint,
  Fingerprint  
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Key, label: 'Licenses', path: '/licenses' },
  { icon: PlusCircle, label: 'Generate', path: '/licenses/generate' },
  { icon: Activity, label: 'Activation', path: '/licenses/activate' },
  { icon: CreditCard, label: 'Subscriptions', path: '/subscriptions' },
  { icon: Building2, label: 'Companies', path: '/companies' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white lg:flex">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Fingerprint size={20} />
          </div>
          <span className="text-lg font-bold tracking-tight">Metronux</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-zinc-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3">
          <div className="h-8 w-8 rounded-full bg-zinc-200" />
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-xs font-semibold">Alex Rivera</span>
            <span className="truncate text-[10px] text-zinc-500">Admin Account</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
