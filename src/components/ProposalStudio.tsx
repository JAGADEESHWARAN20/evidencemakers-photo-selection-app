import React, { useState } from 'react';
import { 
  ProposalPackage, 
  ProposalAddon, 
  ProposalState 
} from '../types';
import { 
  PROPOSAL_PACKAGES, 
  PROPOSAL_ADDONS 
} from '../data/mockData';
import { 
  Sparkles, 
  Check, 
  Printer, 
  Share2, 
  Download, 
  FileCheck, 
  IndianRupee, 
  ShieldCheck, 
  Camera, 
  Film, 
  Award, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ChevronRight,
  Eye,
  Sliders,
  DollarSign
} from 'lucide-react';

export const ProposalStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder');

  const [formState, setFormState] = useState<ProposalState>({
    clientName: 'Ananya Sharma',
    partnerName: 'Vikramaditya Rathore',
    clientEmail: 'ananya.vikram@luxuryweddings.in',
    clientPhone: '+91 98450 12345',
    weddingLocation: 'Taj Lake Palace, Udaipur',
    weddingDate: '14 - 16 Nov 2026',
    guestCount: 350,
    selectedPackageId: 'pkg-royal',
    customPackagePrice: 400000,
    selectedAddonIds: ['add-drone', 'add-sameday', 'add-rawdrive'],
    discountPercent: 5,
    includeTax: true,
    currency: 'INR',
    notes: 'Bride requested golden hour ceremony focus and customized audio master for grandmother speech.'
  });

  const selectedPackage = PROPOSAL_PACKAGES.find((p) => p.id === formState.selectedPackageId) || PROPOSAL_PACKAGES[0];

  const handleToggleAddon = (addonId: string) => {
    setFormState((prev) => {
      const exists = prev.selectedAddonIds.includes(addonId);
      return {
        ...prev,
        selectedAddonIds: exists
          ? prev.selectedAddonIds.filter((id) => id !== addonId)
          : [...prev.selectedAddonIds, addonId]
      };
    });
  };

  // Calculations
  const basePrice = selectedPackage.price;
  const addonsTotal = PROPOSAL_ADDONS
    .filter((a) => formState.selectedAddonIds.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const subtotal = basePrice + addonsTotal;
  const discountAmount = Math.round((subtotal * formState.discountPercent) / 100);
  const netBeforeTax = subtotal - discountAmount;
  const taxAmount = formState.includeTax ? Math.round(netBeforeTax * 0.18) : 0;
  const grandTotal = netBeforeTax + taxAmount;

  const deposit40 = Math.round(grandTotal * 0.4);
  const milestone40 = Math.round(grandTotal * 0.4);
  const final20 = grandTotal - (deposit40 + milestone40);

  const formatCurrency = (amount: number) => {
    return '₹ ' + amount.toLocaleString('en-IN');
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Feature Header: Proposal Studio (Commercial Quotation Architect) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              Proposal Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              Quotation Architect
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Bespoke wedding cinema quotation designer, tiered experience packages, custom line items, and instant client deliverables schedule.
          </p>
        </div>

        {/* Tab Switcher: Builder vs Preview */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'builder'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-amber-400 shadow-sm font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Config & Packages
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-amber-400 shadow-sm font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Client Proposal</span>
            </button>
          </div>

          {activeTab === 'preview' && (
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'builder' ? (
        /* 
          FULL SPACE PROPOSAL BUILDER LAYOUT
        */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Package Selector (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Section 1: Client & Celebration Details */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#10131a] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                  1. Couple & Destination Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Bride / Partner Name
                  </label>
                  <input
                    type="text"
                    value={formState.clientName}
                    onChange={(e) => setFormState({ ...formState, clientName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Groom / Partner Name
                  </label>
                  <input
                    type="text"
                    value={formState.partnerName}
                    onChange={(e) => setFormState({ ...formState, partnerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Destination Venue & City
                  </label>
                  <input
                    type="text"
                    value={formState.weddingLocation}
                    onChange={(e) => setFormState({ ...formState, weddingLocation: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Celebration Dates & Duration
                  </label>
                  <input
                    type="text"
                    value={formState.weddingDate}
                    onChange={(e) => setFormState({ ...formState, weddingDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Signature Curated Packages */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#10131a] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-500" />
                  <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                    2. Select Signature Cinema Tier
                  </h3>
                </div>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Choose base tier</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PROPOSAL_PACKAGES.map((pkg) => {
                  const isSelected = formState.selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setFormState({ ...formState, selectedPackageId: pkg.id })}
                      className={`relative rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 ring-2 ring-amber-500/40 shadow-lg'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#141822] hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      {pkg.featured && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-sm">
                          Most Requested
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            {pkg.coverageDays} Days Coverage
                          </span>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                            isSelected ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'border-zinc-400'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <h4 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                          {pkg.name}
                        </h4>

                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {pkg.tagline}
                        </p>

                        <div className="pt-2 text-lg font-bold font-mono text-zinc-900 dark:text-amber-400">
                          {formatCurrency(pkg.price)}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Included Deliverables:</span>
                        <ul className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
                          {pkg.deliverables.slice(0, 3).map((d, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-amber-500 shrink-0" />
                              <span className="truncate">{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Bespoke Add-on Services Architect */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#10131a] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                    3. Bespoke Add-on Capabilities
                  </h3>
                </div>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  {formState.selectedAddonIds.length} Added
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROPOSAL_ADDONS.map((addon) => {
                  const isChecked = formState.selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'border-amber-500/80 bg-amber-500/5 dark:bg-amber-500/10'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-[#131620] hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                        isChecked ? 'bg-amber-500 border-amber-500 text-zinc-950 font-bold' : 'border-zinc-300 dark:border-zinc-600'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {addon.name}
                          </h5>
                          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
                            {formatCurrency(addon.price)}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {addon.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Financial Breakdown & Commercial Terms (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#10131a] p-6 shadow-xl space-y-6">
              
              <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Commercial Architecture
                </span>
                <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  Investment Summary
                </h3>
              </div>

              {/* Line items calculation */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Selected Base Tier ({selectedPackage.name})</span>
                  <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(basePrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Add-on Upgrades ({formState.selectedAddonIds.length} items)</span>
                  <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                    +{formatCurrency(addonsTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {/* Courtesy Discount */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Studio Courtesy Discount</span>
                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      -{formatCurrency(discountAmount)} ({formState.discountPercent}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={formState.discountPercent}
                    onChange={(e) => setFormState({ ...formState, discountPercent: Number(e.target.value) })}
                    className="w-full accent-amber-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Tax toggle */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="taxToggle"
                      checked={formState.includeTax}
                      onChange={(e) => setFormState({ ...formState, includeTax: e.target.checked })}
                      className="rounded accent-amber-500 w-4 h-4"
                    />
                    <label htmlFor="taxToggle" className="text-zinc-600 dark:text-zinc-400 text-xs">
                      GST (18% Statutory Tax)
                    </label>
                  </div>
                  <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                    {formState.includeTax ? `+${formatCurrency(taxAmount)}` : 'Exempt'}
                  </span>
                </div>

                {/* Total */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 mt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Total Studio Investment
                  </span>
                  <div className="text-2xl font-serif font-bold text-amber-500">
                    {formatCurrency(grandTotal)}
                  </div>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">
                    All-inclusive photography & cinema package
                  </span>
                </div>

                {/* Payment Schedule Breakdown */}
                <div className="pt-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Payment Tranche Schedule:
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
                      <span>1. Booking Retainer (40%)</span>
                      <span className="font-mono font-semibold">{formatCurrency(deposit40)}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
                      <span>2. Shoot Commencement (40%)</span>
                      <span className="font-mono font-semibold">{formatCurrency(milestone40)}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
                      <span>3. Final Master Delivery (20%)</span>
                      <span className="font-mono font-semibold">{formatCurrency(final20)}</span>
                    </div>
                  </div>
                </div>

                {/* Switch to preview button */}
                <div className="pt-4">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Generate Client Proposal</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      ) : (
        /* 
          FULL SPACE CLIENT PROPOSAL PREVIEW DOCUMENT
          High-end luxury aesthetic, ready for presentation or printing
        */
        <div className="w-full max-w-5xl mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e1017] p-8 sm:p-12 shadow-2xl space-y-10 animate-in fade-in duration-300">
          
          {/* Header of Proposal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-zinc-950 font-serif font-bold text-sm">
                  EM
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  EVIDENCE MAKERS
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 tracking-wide uppercase">
                Bespoke Cinematic Wedding & Milestone Atelier
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <p className="font-bold text-zinc-900 dark:text-zinc-200">PROPOSAL REFERENCE: EM-2026-904</p>
              <p>Issued: 29 Oct 2026 • Valid for 14 Days</p>
              <p>Lead Cinematographer: Jagadeesh</p>
            </div>
          </div>

          {/* Couple & Event Highlight Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
                Prepared Exclusively For:
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                {formState.clientName} & {formState.partnerName}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{formState.weddingLocation}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>{formState.weddingDate}</span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Selected Experience</span>
              <div className="text-lg font-serif font-bold text-amber-500">
                {selectedPackage.name}
              </div>
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                {selectedPackage.coverageDays} Days Complete Coverage
              </span>
            </div>
          </div>

          {/* Deliverables & Deliverable Matrix */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100">
              Guaranteed Deliverables & Artistry
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {selectedPackage.deliverables.map((deliv, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-zinc-800 dark:text-zinc-200">{deliv}</span>
                </div>
              ))}
              {PROPOSAL_ADDONS.filter((a) => formState.selectedAddonIds.includes(a.id)).map((addon) => (
                <div key={addon.id} className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="flex items-center justify-between w-full">
                    <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{addon.name}</span>
                    <span className="text-amber-500 font-mono text-[11px]">Upgrade</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Commercial Settlement */}
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
                  Total Commercial Investment
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-500">
                  {formatCurrency(grandTotal)}
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Inclusive of cinematic crew travel, insurance, gear logistics, and post-production.
                </p>
              </div>

              <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                <p><span className="font-semibold text-zinc-800 dark:text-zinc-200">Retainer to Lock Dates:</span> {formatCurrency(deposit40)}</p>
                <p><span className="font-semibold text-zinc-800 dark:text-zinc-200">Delivery Timeline:</span> Teaser in 10 Days • Feature in 45 Days</p>
              </div>
            </div>
          </div>

          {/* Footer of proposal */}
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <div>
              Evidence Makers Studio • Bangalore & Udaipur Hubs • info@evidencemakers.com
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('builder')}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Back to Edit
              </button>
              <button 
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-all shadow-md shadow-amber-500/20"
              >
                Confirm & Print Quote
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
