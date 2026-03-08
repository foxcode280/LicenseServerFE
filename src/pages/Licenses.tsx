import { Card, Badge, Button } from '../components/UI';
import { Search, Filter, Download, MoreVertical, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

const licenses = [
  { id: 'LIC-8291-XJ', company: 'Acme Corp', key: 'XXXX-XXXX-XXXX-8291', status: 'Active', tier: 'Enterprise', expires: '2025-12-31' },
  { id: 'LIC-1022-PQ', company: 'Globex Inc', key: 'XXXX-XXXX-XXXX-1022', status: 'Expired', tier: 'Pro', expires: '2024-01-15' },
  { id: 'LIC-9920-ZZ', company: 'Soylent Corp', key: 'XXXX-XXXX-XXXX-9920', status: 'Revoked', tier: 'Basic', expires: '2024-06-20' },
  { id: 'LIC-4451-MK', company: 'Initech', key: 'XXXX-XXXX-XXXX-4451', status: 'Active', tier: 'Enterprise', expires: '2026-03-10' },
  { id: 'LIC-7721-LL', company: 'Umbrella Corp', key: 'XXXX-XXXX-XXXX-7721', status: 'Active', tier: 'Pro', expires: '2025-08-22' },
];

export function Licenses() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">License Management</h1>
          <p className="text-sm text-zinc-500">View and manage all issued license keys across your client base.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download size={16} />
            Export CSV
          </Button>
          <Button variant="primary">Issue New License</Button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-zinc-100 p-4">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder="Search licenses..."
                className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <Button variant="outline" className="h-9 px-3">
              <Filter size={16} />
              Filters
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Showing 1-10 of 1,284 results</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-400">
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-[10px]">License ID</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-[10px]">Company</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-[10px]">License Key</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-[10px]">Tier</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-[10px]">Expires</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {licenses.map((license) => (
                <tr key={license.id} className="group hover:bg-zinc-50/50">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-zinc-900">{license.id}</td>
                  <td className="px-6 py-4 font-medium">{license.company}</td>
                  <td className="px-6 py-4 font-mono text-xs text-zinc-500">{license.key}</td>
                  <td className="px-6 py-4">
                    <Badge variant={license.tier === 'Enterprise' ? 'info' : 'neutral'}>{license.tier}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={
                        license.status === 'Active' ? 'success' : 
                        license.status === 'Expired' ? 'warning' : 'error'
                      }
                    >
                      {license.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{license.expires}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900">
                        <ExternalLink size={16} />
                      </button>
                      <button className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 p-4">
          <Button variant="outline" className="h-8 px-3 text-xs" disabled>Previous</Button>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 12].map((page, i) => (
              <button
                key={i}
                className={clsx(
                  'h-8 w-8 rounded-lg text-xs font-medium transition-colors',
                  page === 1 ? 'bg-emerald-600 text-white' : 'text-zinc-500 hover:bg-zinc-100'
                )}
              >
                {page}
              </button>
            ))}
          </div>
          <Button variant="outline" className="h-8 px-3 text-xs">Next</Button>
        </div>
      </Card>
    </div>
  );
}
