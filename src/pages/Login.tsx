import { Card, Button } from '../components/UI';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Metronux</h1>
          <p className="mt-2 text-sm text-zinc-500">Enterprise License Management Dashboard</p>
        </div>

        <Card className="space-y-6 p-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input
                  type="email"
                  placeholder="admin@lumina.io"
                  className="h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Password</label>
                <button className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
            <label htmlFor="remember" className="text-xs text-zinc-600">Remember this device for 30 days</label>
          </div>

          <Button variant="primary" className="h-11 w-full text-base" onClick={onLogin}>
            Sign In to Dashboard
            <ArrowRight size={18} />
          </Button>
        </Card>

        <p className="text-center text-xs text-zinc-500">
          By signing in, you agree to our <span className="font-semibold text-zinc-900 underline underline-offset-4">Terms of Service</span> and <span className="font-semibold text-zinc-900 underline underline-offset-4">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
