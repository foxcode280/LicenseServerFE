import { Card, Button, Badge } from '../components/UI';
import { Activity, ShieldCheck, Smartphone, Laptop, Monitor, AlertCircle } from 'lucide-react';

const devices = [
  { id: 'DEV-9921', type: 'Laptop', name: 'MacBook Pro 16"', ip: '192.168.1.42', activated: '2024-03-01', status: 'Active' },
  { id: 'DEV-4410', type: 'Monitor', name: 'Dell UltraSharp', ip: '192.168.1.15', activated: '2024-03-05', status: 'Active' },
  { id: 'DEV-0012', type: 'Smartphone', name: 'iPhone 15 Pro', ip: '10.0.0.12', activated: '2024-02-15', status: 'Inactive' },
];

export function LicenseActivation() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">License Activation</h1>
          <p className="text-sm text-zinc-500">Monitor device-level activations and manage hardware IDs.</p>
        </div>
        <Button variant="outline">
          <Activity size={16} />
          Live Logs
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-6 font-semibold">Active Devices</h3>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between rounded-xl border border-zinc-100 p-4 hover:bg-zinc-50/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                    {device.type === 'Laptop' && <Laptop size={20} />}
                    {device.type === 'Smartphone' && <Smartphone size={20} />}
                    {device.type === 'Monitor' && <Monitor size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{device.name}</h4>
                    <p className="text-xs text-zinc-500">{device.id} • {device.ip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-medium">Activated</p>
                    <p className="text-[10px] text-zinc-500">{device.activated}</p>
                  </div>
                  <Badge variant={device.status === 'Active' ? 'success' : 'neutral'}>{device.status}</Badge>
                  <button className="text-zinc-400 hover:text-red-600">
                    <AlertCircle size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="mt-6 w-full">View All Devices</Button>
        </Card>

        <div className="space-y-6">
          <Card className="bg-zinc-900 text-white">
            <h3 className="mb-2 font-semibold">Activation Quota</h3>
            <p className="mb-6 text-xs text-zinc-400">You have used 84% of your total activation capacity.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Total Capacity</span>
                <span>842 / 1,000</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full w-[84%] bg-emerald-500" />
              </div>
            </div>
            <Button variant="outline" className="mt-6 w-full border-zinc-700 bg-transparent text-white hover:bg-zinc-800">
              Upgrade Quota
            </Button>
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold">Manual Activation</h3>
            <p className="mb-4 text-xs text-zinc-500">Enter a hardware ID to manually authorize a device.</p>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Hardware ID (e.g. HW-XXXX)"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500"
              />
              <Button variant="secondary" className="w-full">
                <ShieldCheck size={16} />
                Authorize Device
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
