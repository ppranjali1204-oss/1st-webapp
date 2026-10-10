import React, { useState } from 'react';
import { MetricData, Language, BusinessProfile } from '../types';
import { getTranslation } from '../data/translations';
import {
  X,
  Star,
  Instagram,
  MessageCircle,
  CalendarCheck2,
  Plus,
  Minus,
  Check,
  RotateCcw,
} from 'lucide-react';

interface UpdateMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: MetricData;
  profile: BusinessProfile;
  language: Language;
  onSaveMetrics: (newMetrics: MetricData, isSampleData: boolean) => void;
  onResetToSample: () => void;
}

export const UpdateMetricsModal: React.FC<UpdateMetricsModalProps> = ({
  isOpen,
  onClose,
  metrics,
  profile,
  language,
  onSaveMetrics,
  onResetToSample,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(language);

  const [formData, setFormData] = useState<MetricData>({ ...metrics });
  const [isSample, setIsSample] = useState(profile.isSampleData);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMetrics(formData, false); // Mark as real numbers once saved!
    onClose();
  };

  const increment = (field: keyof MetricData, delta: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, Number(prev[field] || 0) + delta),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Top Drag Handle on Mobile */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t.updateModalTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.updateModalSub}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable form fields */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Quick Increment Banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block mb-1">
              ⚡ Quick 1-Tap Log for Today:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => increment('newGoogleReviews', 1)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                +1 Google Review
              </button>
              <button
                type="button"
                onClick={() => increment('whatsappLeads', 2)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                +2 WhatsApp Chats
              </button>
              <button
                type="button"
                onClick={() => increment('bookingEnquiries', 1)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                +1 Walk-in / Booking
              </button>
            </div>
          </div>

          {/* Field 1: Google Rating & New Reviews */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Google Reviews</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Overall Rating (★)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={formData.googleRating}
                  onChange={(e) =>
                    setFormData({ ...formData, googleRating: parseFloat(e.target.value) || 4.5 })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  New Reviews This Week
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => increment('newGoogleReviews', -1)}
                    className="w-10 h-10 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={formData.newGoogleReviews}
                    onChange={(e) =>
                      setFormData({ ...formData, newGoogleReviews: parseInt(e.target.value) || 0 })
                    }
                    className="w-full h-10 text-center border-y border-slate-300 text-sm font-bold text-slate-900 tabular-nums focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => increment('newGoogleReviews', 1)}
                    className="w-10 h-10 rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Field 2: Instagram Followers & Reach */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Instagram className="w-4 h-4 text-pink-600" />
              <span>Instagram Activity</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Followers Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.instaFollowers}
                  onChange={(e) =>
                    setFormData({ ...formData, instaFollowers: parseInt(e.target.value) || 0 })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Accounts Reached (Week)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.instaReach}
                  onChange={(e) =>
                    setFormData({ ...formData, instaReach: parseInt(e.target.value) || 0 })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Field 3: WhatsApp Leads */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Customer Chats</span>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => increment('whatsappLeads', -1)}
                className="w-12 h-10 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                value={formData.whatsappLeads}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappLeads: parseInt(e.target.value) || 0 })
                }
                className="w-full h-10 text-center border-y border-slate-300 text-base font-bold text-slate-900 tabular-nums focus:outline-none"
              />
              <button
                type="button"
                onClick={() => increment('whatsappLeads', 1)}
                className="w-12 h-10 rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Field 4: Walk-ins & Bookings */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <CalendarCheck2 className="w-4 h-4 text-violet-600" />
              <span>Walk-ins & Bookings This Week</span>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => increment('bookingEnquiries', -1)}
                className="w-12 h-10 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                value={formData.bookingEnquiries}
                onChange={(e) =>
                  setFormData({ ...formData, bookingEnquiries: parseInt(e.target.value) || 0 })
                }
                className="w-full h-10 text-center border-y border-slate-300 text-base font-bold text-slate-900 tabular-nums focus:outline-none"
              />
              <button
                type="button"
                onClick={() => increment('bookingEnquiries', 1)}
                className="w-12 h-10 rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{t.saveChanges}</span>
            </button>

            <button
              type="button"
              onClick={onResetToSample}
              className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetToSample}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
