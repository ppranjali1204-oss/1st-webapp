import React from 'react';
import { MetricData, Language } from '../types';
import { getTranslation } from '../data/translations';
import {
  Star,
  Instagram,
  MessageCircle,
  CalendarCheck2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
} from 'lucide-react';

interface MetricCardsProps {
  metrics: MetricData;
  language: Language;
  onSelectMetric: (metricKey: 'google' | 'instagram' | 'whatsapp' | 'bookings') => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  language,
  onSelectMetric,
}) => {
  const t = getTranslation(language);

  // Calculations for arrows & trends
  const googleDiff = metrics.newGoogleReviews - metrics.prevGoogleReviews;
  const isGoogleUp = googleDiff >= 0;

  const instaReachTrend = metrics.instaReachTrendPct;
  const isInstaUp = instaReachTrend >= 0;

  const whatsappDiff = metrics.whatsappLeads - metrics.prevWhatsappLeads;
  const isWhatsappUp = whatsappDiff >= 0;

  const bookingDiff = metrics.bookingEnquiries - metrics.prevBookingEnquiries;
  const isBookingUp = bookingDiff >= 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider px-1">
        <span>{t.fourCardsTitle}</span>
        <span className="text-[11px] font-medium text-slate-500 normal-case">
          Tap card to update or act
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Card 1: Google Reviews */}
        <button
          onClick={() => onSelectMetric('google')}
          className="text-left bg-white rounded-2xl border border-slate-200 p-4 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm active:scale-[0.99] flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-blue-600 text-blue-600" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {t.googleCardTitle}
                </span>
              </div>
              <span className="text-[11px] font-semibold flex items-center gap-0.5 text-blue-700 group-hover:translate-x-0.5 transition-transform">
                Details <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {metrics.googleRating}
                <span className="text-amber-500 text-2xl font-bold ml-1">★</span>
              </span>
              <span className="text-sm font-semibold text-slate-600 tabular-nums">
                +{metrics.newGoogleReviews} {t.newReviewsLabel.toLowerCase()}
              </span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span
              className={`inline-flex items-center gap-1 font-bold tabular-nums ${
                isGoogleUp ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isGoogleUp ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
              {Math.abs(googleDiff)} {t.newReviewsLabel.toLowerCase()} {t.vsLastWeek}
            </span>
            <span className="text-slate-500 font-medium">
              {metrics.pendingReviewReplies} {t.pendingRepliesLabel}
            </span>
          </div>
        </button>

        {/* Card 2: Instagram */}
        <button
          onClick={() => onSelectMetric('instagram')}
          className="text-left bg-white rounded-2xl border border-slate-200 p-4 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm active:scale-[0.99] flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-700 flex items-center justify-center">
                  <Instagram className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {t.instaCardTitle}
                </span>
              </div>
              <span className="text-[11px] font-semibold flex items-center gap-0.5 text-pink-700 group-hover:translate-x-0.5 transition-transform">
                Details <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {(metrics.instaReach / 1000).toFixed(1)}k
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {t.reachLabel}
              </span>
              <span className="text-xs text-slate-400 font-medium ml-auto tabular-nums">
                {metrics.instaFollowers.toLocaleString()} {t.followersLabel.toLowerCase()}
              </span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span
              className={`inline-flex items-center gap-1 font-bold tabular-nums ${
                isInstaUp ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isInstaUp ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
              {Math.abs(instaReachTrend)}% {t.vsLastWeek}
            </span>
            <span className="text-slate-500 font-medium">
              Reels = 3x reach
            </span>
          </div>
        </button>

        {/* Card 3: WhatsApp Leads */}
        <button
          onClick={() => onSelectMetric('whatsapp')}
          className="text-left bg-white rounded-2xl border border-slate-200 p-4 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm active:scale-[0.99] flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {t.whatsappCardTitle}
                </span>
              </div>
              <span className="text-[11px] font-semibold flex items-center gap-0.5 text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                Details <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {metrics.whatsappLeads}
              </span>
              <span className="text-sm font-semibold text-slate-600">
                {t.chatsStartedLabel}
              </span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span
              className={`inline-flex items-center gap-1 font-bold tabular-nums ${
                isWhatsappUp ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isWhatsappUp ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
              +{whatsappDiff} chats {t.vsLastWeek}
            </span>
            <span className="text-slate-500 font-medium">
              Peak: Fri-Sat
            </span>
          </div>
        </button>

        {/* Card 4: Walk-ins & Booking Enquiries */}
        <button
          onClick={() => onSelectMetric('bookings')}
          className="text-left bg-white rounded-2xl border border-slate-200 p-4 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm active:scale-[0.99] flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {t.bookingsCardTitle}
                </span>
              </div>
              <span className="text-[11px] font-semibold flex items-center gap-0.5 text-violet-700 group-hover:translate-x-0.5 transition-transform">
                Details <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {metrics.bookingEnquiries}
              </span>
              <span className="text-sm font-semibold text-slate-600">
                {t.enquiriesLabel}
              </span>
              {metrics.estimatedRevenue && (
                <span className="text-xs font-bold text-emerald-700 ml-auto tabular-nums">
                  ₹{metrics.estimatedRevenue.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span
              className={`inline-flex items-center gap-1 font-bold tabular-nums ${
                isBookingUp ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isBookingUp ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
              +{bookingDiff} {t.vsLastWeek}
            </span>
            <span className="text-slate-500 font-medium">
              Direct conversions
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
