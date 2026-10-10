import React from 'react';
import { Language, MetricData } from '../types';
import { getTranslation } from '../data/translations';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface HealthScoreCardProps {
  score: number;
  summary: string;
  metrics: MetricData;
  language: Language;
  onOpenDetails?: () => void;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  score,
  summary,
  metrics,
  language,
  onOpenDetails,
}) => {
  const t = getTranslation(language);

  // Dynamic status evaluation
  const isHigh = score >= 75;
  const isModerate = score >= 50 && score < 75;

  const scoreLabel =
    language === 'hi'
      ? isHigh
        ? 'मजबूत बढ़त'
        : isModerate
        ? 'स्थिर गति'
        : 'ध्यान देने की जरूरत'
      : language === 'hinglish'
      ? isHigh
        ? 'Solid Growth'
        : isModerate
        ? 'Steady Pace'
        : 'Needs Attention'
      : isHigh
      ? 'Strong Growth'
      : isModerate
      ? 'Steady Growth'
      : 'Needs Attention';

  // SVG circular gauge geometry
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300">
      <div className="flex items-start justify-between gap-4">
        {/* Left side: Score and title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{t.healthScoreTitle}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">{scoreLabel}</span>
          </div>

          {/* Plain-language one-line summary */}
          <p className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug tracking-tight">
            {summary}
          </p>

          {/* Unboxed metadata row with typographic separators */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-2 font-medium">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold tabular-nums">
              <TrendingUp className="w-3.5 h-3.5" />
              +5 {t.ptsVsLastWeek}
            </span>
            <span aria-hidden="true">·</span>
            <span>Google 4.8★</span>
            <span aria-hidden="true">·</span>
            <span>{metrics.whatsappLeads} WhatsApp chats</span>
          </div>
        </div>

        {/* Right side: Circular Progress Gauge */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              className="text-slate-100"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={isHigh ? 'text-emerald-600' : isModerate ? 'text-amber-500' : 'text-rose-500'}
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
              {score}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase -mt-1">
              /100
            </span>
          </div>
        </div>
      </div>

      {/* Mini 4-channel health meter */}
      <div className="grid grid-cols-4 gap-2 pt-4 mt-4 border-t border-slate-100 text-[11px]">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium truncate">Google</span>
            <span className="font-bold text-slate-800 tabular-nums">85%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium truncate">Insta</span>
            <span className="font-bold text-slate-800 tabular-nums">64%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '64%' }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium truncate">WhatsApp</span>
            <span className="font-bold text-slate-800 tabular-nums">90%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '90%' }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium truncate">Enquiries</span>
            <span className="font-bold text-slate-800 tabular-nums">78%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '78%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
