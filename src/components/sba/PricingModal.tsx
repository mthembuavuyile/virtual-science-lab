import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, Lock, CreditCard, Sparkles } from 'lucide-react';
import { activateLicenseKey, unlockPracticalDirect } from '../../lib/license-store';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  practicalTitle?: string;
  practicalId?: string;
  onSuccessUnlock: () => void;
}

export default function PricingModal({
  isOpen,
  onClose,
  practicalTitle,
  practicalId,
  onSuccessUnlock
}: PricingModalProps) {
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleActivateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    const res = activateLicenseKey(voucherCode);
    if (res.success) {
      setVoucherMsg({ text: res.message, isError: false });
      setTimeout(() => {
        onSuccessUnlock();
        onClose();
      }, 1200);
    } else {
      setVoucherMsg({ text: res.message, isError: true });
    }
  };

  const handleSimulatePaystackPayment = (tier: 'single' | 'grade_pass') => {
    setLoading(true);
    // In production this triggers Paystack Pop-up (Ozow/Cards/SnapScan)
    setTimeout(() => {
      if (practicalId) {
        unlockPracticalDirect(practicalId, tier);
      }
      setLoading(false);
      onSuccessUnlock();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 text-white flex justify-between items-center relative">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-300">
              Official SACAI & DBE Compliance Pass
            </span>
            <h3 className="text-lg font-extrabold text-white mt-0.5">
              Unlock Full CAPS SBA Practical Suite
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              For Homeschoolers, Distance Learners (Impaq, Brainline), and Independent Matric Candidates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Single Lab */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-blue-500 transition-all flex flex-col justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Single Practical Pass</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">R99</span>
                  <span className="text-xs text-slate-500">/ once-off</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Unlocks {practicalTitle || 'this practical task'} + unlimited 4-page certified PDF moderation downloads.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> 1 Prescribed SBA Practical
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> DBE Marking Rubric Auto-Check
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Instant PDF Dossier Export
                  </li>
                </ul>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSimulatePaystackPayment('single')}
                className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Pay R99 with Paystack (Instant EFT / Card)
              </button>
            </div>

            {/* Full Grade Pass - Recommended */}
            <div className="border-2 border-blue-600 rounded-xl p-5 relative shadow-md flex flex-col justify-between bg-blue-50/20 dark:bg-blue-950/20">
              <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                Most Popular for Homeschool
              </span>
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                  Annual Grade 10-12 Pass
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">R349</span>
                  <span className="text-xs text-slate-500">/ academic year</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Complete access to all 6 Physics & Chemistry mandatory SBA practicals for SACAI / IEB / CAPS moderation.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-300">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> All 6 Prescribed Practical Packs
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Anti-Plagiarism Unique Random Data
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Unlimited Official PDF Downloads
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Verified Security Audit Hash
                  </li>
                </ul>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSimulatePaystackPayment('grade_pass')}
                className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Unlock All Labs (R349 with Paystack)
              </button>
            </div>
          </div>

          {/* Voucher Code Activation */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Already have an activation license key or homeschool voucher?
            </h4>
            <form onSubmit={handleActivateVoucher} className="flex gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={e => setVoucherCode(e.target.value)}
                placeholder="e.g. HOMESCHOOL2026 or MATRICPASS"
                className="flex-1 px-3 py-2 text-xs uppercase font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-xs font-bold transition"
              >
                Activate Key
              </button>
            </form>

            {voucherMsg && (
              <p className={`text-xs mt-2 font-medium ${voucherMsg.isError ? 'text-rose-500' : 'text-emerald-500'}`}>
                {voucherMsg.text}
              </p>
            )}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Guaranteed SACAI / Umalusi Moderation Format
          </span>
          <span>Paystack Secured (Ozow / Cards)</span>
        </div>
      </div>
    </div>
  );
}
