import React from 'react';
import Link from 'next/link';
import { Car, ShieldCheck, Zap, Headphones, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Value Proposition Bar */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">150-Point Inspection</h4>
                <p className="mt-1 text-sm text-slate-400">
                  Every listed vehicle passes strict certification, history audit & mechanical check.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Instant Online Financing</h4>
                <p className="mt-1 text-sm text-slate-400">
                  Get pre-approved in under 2 minutes with zero impact to your credit score.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Dedicated Concierge</h4>
                <p className="mt-1 text-sm text-slate-400">
                  Direct live expert assistance from vehicle test drive to home delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Car className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black text-white">
                AUTO<span className="text-brand-500">MART</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              The next-generation automotive marketplace connecting verified dealers, individual sellers, and discerning car buyers worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="email"
                placeholder="Subscribe for price drop alerts..."
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 transition">
                Join
              </button>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h5>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/vehicles" className="hover:text-white transition">All Inventory</Link></li>
              <li><Link href="/vehicles?fuelType=Electric" className="hover:text-white transition">Electric Vehicles</Link></li>
              <li><Link href="/vehicles?bodyType=SUV" className="hover:text-white transition">SUVs & Crossovers</Link></li>
              <li><Link href="/vehicles?condition=Certified+Pre-Owned" className="hover:text-white transition">Certified Pre-Owned</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-white">For Sellers</h5>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/seller" className="hover:text-white transition">List Your Vehicle</Link></li>
              <li><Link href="/seller/pricing" className="hover:text-white transition">Instant Valuation</Link></li>
              <li><Link href="/seller/dealer" className="hover:text-white transition">Dealer Partner Portal</Link></li>
              <li><Link href="/seller/faq" className="hover:text-white transition">Seller Protection</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-white">Support & Legal</h5>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-white transition">Security & Trust</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AutoMart Technologies Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Engineered with Next.js 14 App Router & Cloud CDN Pipeline</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
