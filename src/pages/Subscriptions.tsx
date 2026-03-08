import { Card, Button, Badge } from '../components/UI';
import { CreditCard, Check, Zap, Crown, ArrowRight, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

const plans = [
  {
    name: 'Basic',
    price: '$499',
    period: '/year',
    description: 'Perfect for small teams and startups.',
    features: ['Up to 10 licenses', 'Standard support', 'Basic analytics', '1 activation per license'],
    icon: Zap,
    color: 'emerald',
  },
  {
    name: 'Pro',
    price: '$1,299',
    period: '/year',
    description: 'Advanced features for growing businesses.',
    features: ['Up to 50 licenses', 'Priority support', 'Advanced analytics', '3 activations per license', 'Custom branding'],
    icon: Crown,
    color: 'blue',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Full control for large scale operations.',
    features: ['Unlimited licenses', '24/7 Dedicated support', 'Real-time monitoring', 'Unlimited activations', 'On-premise deployment', 'SLA Guarantee'],
    icon: ShieldCheck,
    color: 'zinc',
  },
];

export function Subscriptions() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Subscription Plans</h1>
        <p className="text-sm text-zinc-500">Choose the right tier for your enterprise licensing needs.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={clsx(
              'relative flex flex-col gap-6 transition-all hover:shadow-md',
              plan.popular ? 'border-emerald-500 ring-1 ring-emerald-500' : ''
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Most Popular
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className={clsx(
                'flex h-12 w-12 items-center justify-center rounded-2xl',
                plan.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                plan.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-600'
              )}>
                <plan.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold">{plan.name}</h3>
                <p className="text-xs text-zinc-500">{plan.description}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
              <span className="text-sm text-zinc-500">{plan.period}</span>
            </div>

            <div className="flex-1 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-zinc-600">
                  <Check size={16} className="text-emerald-500" />
                  {feature}
                </div>
              ))}
            </div>

            <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">
              {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              <ArrowRight size={16} />
            </Button>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-50">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <CreditCard size={24} className="text-zinc-400" />
            </div>
            <div>
              <h4 className="font-semibold">Need a custom plan?</h4>
              <p className="text-sm text-zinc-500">We can tailor a solution specifically for your business requirements.</p>
            </div>
          </div>
          <Button variant="secondary">Talk to an Expert</Button>
        </div>
      </Card>
    </div>
  );
}
