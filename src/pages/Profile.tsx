import { Card, Button, Badge } from '../components/UI';
import { User, Mail, Shield, Camera, Github, Twitter, Globe, Key } from 'lucide-react';

export function Profile() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
        <p className="text-sm text-zinc-500">Manage your personal information and account security.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6">
          <Card className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full bg-zinc-100 ring-4 ring-white shadow-sm" />
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700">
                <Camera size={14} />
              </button>
            </div>
            <h3 className="text-lg font-bold">Alex Rivera</h3>
            <p className="text-sm text-zinc-500">Senior Administrator</p>
            <div className="mt-6 flex w-full flex-col gap-2">
              <Button variant="outline" className="w-full">Edit Profile</Button>
              <Button variant="ghost" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700">Sign Out</Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Connected Accounts</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Github size={16} className="text-zinc-600" />
                  GitHub
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Twitter size={16} className="text-zinc-600" />
                  Twitter
                </div>
                <Button variant="ghost" className="h-7 px-2 text-xs">Connect</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            <h3 className="font-semibold">Personal Information</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Alex Rivera"
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="alex@lumina.io"
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500">Job Title</label>
                <input 
                  type="text" 
                  defaultValue="Senior Administrator"
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500">Location</label>
                <input 
                  type="text" 
                  defaultValue="San Francisco, CA"
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-500" 
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>

          <Card className="space-y-6">
            <h3 className="font-semibold">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-zinc-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Two-Factor Authentication</h4>
                    <p className="text-xs text-zinc-500">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <Button variant="outline" className="h-9">Enable</Button>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-zinc-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                    <Key size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Change Password</h4>
                    <p className="text-xs text-zinc-500">Last updated 3 months ago.</p>
                  </div>
                </div>
                <Button variant="outline" className="h-9">Update</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
