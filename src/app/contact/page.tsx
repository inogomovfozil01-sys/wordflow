import React from 'react';
import { Mail, MessageSquare, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Contact the WordFlow Team
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Have feedback, found a typo in a word entry, or want to partner with us? We’d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Card className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Mail size={20} />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Email Support</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              support@wordflow.app
            </p>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Community Forum</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              discord.gg/wordflow
            </p>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="p-6 sm:p-8 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Send a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Your Name" placeholder="Alex Rivera" required />
                <Input label="Your Email" type="email" placeholder="alex@example.com" required />
              </div>
              <Input label="Subject" placeholder="Vocabulary suggestion or inquiry" required />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <Button type="button" variant="primary" size="md">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
