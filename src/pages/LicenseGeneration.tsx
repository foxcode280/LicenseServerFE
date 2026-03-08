import { Card, Button } from '../components/UI';
import { ShieldCheck, Copy, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function LicenseGeneration() {
  const [generatedKey, setGeneratedKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const parts = Array.from({ length: 4 }, () => 
        Math.random().toString(36).substring(2, 6).toUpperCase()
      );
      setGeneratedKey(parts.join('-'));
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Generate New License</h1>
        <p className="text-sm text-zinc-500">Create a secure, unique license key for your enterprise customers.</p>
      </div>

      <Card className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Company</label>
            <select className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500">
              <option>Select a company...</option>
              <option>Acme Corp</option>
              <option>Globex Inc</option>
              <option>Soylent Corp</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Subscription Tier</label>
            <select className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500">
              <option>Basic</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Expiration Date</label>
            <input 
              type="date" 
              className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Max Activations</label>
            <input 
              type="number" 
              defaultValue={1}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">License Key</label>
          <div className="flex gap-2">
            <div className="flex h-12 flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 font-mono text-lg font-bold tracking-widest text-zinc-400">
              {generatedKey || 'XXXX-XXXX-XXXX-XXXX'}
            </div>
            <Button 
              variant="secondary" 
              className="h-12 w-12 p-0" 
              onClick={generateKey}
              disabled={isGenerating}
            >
              <RefreshCw size={20} className={isGenerating ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="primary" className="h-12 w-full text-base" disabled={!generatedKey}>
            <ShieldCheck size={20} />
            Issue License Key
          </Button>
        </div>
      </Card>

      {generatedKey && (
        <Card className="border-emerald-100 bg-emerald-50/30">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-emerald-900">License ready to issue</h4>
              <p className="text-sm text-emerald-700">
                This key will be sent to the company administrator and logged in the system.
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="h-8 border-emerald-200 bg-white px-3 text-xs text-emerald-700 hover:bg-emerald-50">
                  <Copy size={14} />
                  Copy Key
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
