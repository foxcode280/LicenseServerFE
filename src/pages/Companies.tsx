import { Card, Button, Badge } from '../components/UI';
import { Search, Plus, Building2, Mail, MapPin, Globe, MoreHorizontal } from 'lucide-react';

const companies = [
  { id: '1', name: 'Acme Corporation', email: 'admin@acme.com', location: 'San Francisco, CA', website: 'acme.com', tier: 'Enterprise', status: 'Active' },
  { id: '2', name: 'Globex Inc', email: 'contact@globex.io', location: 'London, UK', website: 'globex.io', tier: 'Pro', status: 'Active' },
  { id: '3', name: 'Soylent Corp', email: 'billing@soylent.com', location: 'New York, NY', website: 'soylent.com', tier: 'Basic', status: 'Inactive' },
  { id: '4', name: 'Initech', email: 'support@initech.net', location: 'Austin, TX', website: 'initech.net', tier: 'Enterprise', status: 'Active' },
];

export function Companies() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
          <p className="text-sm text-zinc-500">Manage your client organizations and their account status.</p>
        </div>
        <Button variant="primary">
          <Plus size={16} />
          Add Company
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            placeholder="Search companies..."
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {companies.map((company) => (
          <Card key={company.id} className="group relative transition-all hover:border-zinc-300">
            <div className="absolute right-4 top-4">
              <button className="text-zinc-400 hover:text-zinc-900">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                <Building2 size={24} />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{company.name}</h3>
                    <Badge variant={company.status === 'Active' ? 'success' : 'neutral'}>{company.status}</Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Mail size={12} />
                      {company.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      {company.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe size={12} />
                      {company.website}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-50 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Subscription</span>
                    <span className="text-sm font-medium">{company.tier} Plan</span>
                  </div>
                  <Button variant="outline" className="h-8 px-3 text-xs">View Account</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
