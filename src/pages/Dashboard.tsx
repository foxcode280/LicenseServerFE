import { Card, Badge, Button } from '../components/UI';
import { 
  Users, 
  Key, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { clsx } from 'clsx';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1100 },
];

const stats = [
  { label: 'Active Licenses', value: '1,284', change: 12.5, trend: 'up', icon: Key },
  { label: 'Total Companies', value: '42', change: 4.2, trend: 'up', icon: Users },
  { label: 'Revenue (MRR)', value: '$12,400', change: 8.1, trend: 'up', icon: TrendingUp },
  { label: 'Avg. Activation Time', value: '1.2s', change: -2.4, trend: 'down', icon: Clock },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
          <p className="text-sm text-zinc-500">Monitor your enterprise license ecosystem in real-time.</p>
        </div>
        <Button variant="secondary">Download Report</Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-600">
                <stat.icon size={20} />
              </div>
              <div className={clsx(
                'flex items-center gap-1 text-xs font-medium',
                stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              )}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold">License Activations</h3>
            <select className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#71717a' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#71717a' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-6 font-semibold">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-zinc-100" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium">
                    <span className="font-bold">Acme Corp</span> activated a new license key.
                  </p>
                  <span className="text-[10px] text-zinc-400">2 hours ago</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="mt-6 w-full">View All Activity</Button>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold">Top Performing Companies</h3>
          <Button variant="outline" className="h-8 px-3 text-xs">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400">
                <th className="pb-3 font-medium uppercase tracking-wider text-[10px]">Company</th>
                <th className="pb-3 font-medium uppercase tracking-wider text-[10px]">Tier</th>
                <th className="pb-3 font-medium uppercase tracking-wider text-[10px]">Licenses</th>
                <th className="pb-3 font-medium uppercase tracking-wider text-[10px]">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {[
                { name: 'Stripe', tier: 'Enterprise', count: 124, status: 'Active' },
                { name: 'Vercel', tier: 'Pro', count: 42, status: 'Active' },
                { name: 'Linear', tier: 'Enterprise', count: 89, status: 'Active' },
                { name: 'Raycast', tier: 'Basic', count: 12, status: 'Warning' },
              ].map((company) => (
                <tr key={company.name} className="group hover:bg-zinc-50/50">
                  <td className="py-4 font-medium">{company.name}</td>
                  <td className="py-4">
                    <Badge variant={company.tier === 'Enterprise' ? 'info' : 'neutral'}>{company.tier}</Badge>
                  </td>
                  <td className="py-4">{company.count}</td>
                  <td className="py-4">
                    <Badge variant={company.status === 'Active' ? 'success' : 'warning'}>{company.status}</Badge>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-zinc-400 hover:text-zinc-900">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
