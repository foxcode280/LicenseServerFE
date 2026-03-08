import { Card, Button, Badge } from '../components/UI';
import { Settings as SettingsIcon, Bell, Shield, Globe, Database, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export function Settings() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-sm text-zinc-500">Configure global parameters and system-wide preferences.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <nav className="space-y-1">
          {[
            { icon: SettingsIcon, label: 'General' },
            { icon: Bell, label: 'Notifications' },
            { icon: Shield, label: 'Security' },
            { icon: Globe, label: 'Localization' },
            { icon: Database, label: 'Data & Privacy' },
            { icon: Zap, label: 'Integrations' },
          ].map((item, i) => (
            <button
              key={item.label}
              className={clsx(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                i === 0 ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3 space-y-6">
          <Card className="space-y-6">
            <h3 className="font-semibold">General Configuration</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500">System Name</label>
                <input 
                  type="text" 
                  defaultValue="Metronux License Manager"
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@lumina.io"
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-sm font-semibold">Maintenance Mode</h4>
                  <p className="text-xs text-zinc-500">Disable all license activations temporarily.</p>
                </div>
                <div className="h-6 w-11 rounded-full bg-zinc-200 p-1">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="primary">Save Configuration</Button>
            </div>
          </Card>

          <Card className="space-y-6">
            <h3 className="font-semibold">License Defaults</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500">Default Expiration (Days)</label>
                <input 
                  type="number" 
                  defaultValue={365}
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500">Default Activation Limit</label>
                <input 
                  type="number" 
                  defaultValue={3}
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500" 
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
