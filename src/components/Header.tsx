import React from 'react';
import { Language, BusinessProfile } from '../types';
import { getTranslation } from '../data/translations';
import { Globe, SlidersHorizontal, Share2 } from 'lucide-react';

interface HeaderProps {
  profile: BusinessProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenUpdateModal: () => void;
  onOpenQuickTools: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  language,
  onLanguageChange,
  onOpenUpdateModal,
  onOpenQuickTools,
}) => {
  const t = getTranslation(language);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
              Local<span className="text-emerald-600">Pulse</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">|</span>
            <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px] sm:max-w-[200px]">
              {profile.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
            <span>{profile.city}</span>
            <span aria-hidden="true">·</span>
            <span className={profile.isSampleData ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}>
              {profile.isSampleData ? t.sampleDataBadge : t.liveDataBadge}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher Segmented Control */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-md transition-all min-h-[36px] ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hinglish')}
              className={`px-2 py-1 rounded-md transition-all min-h-[36px] ${
                language === 'hinglish'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Hinglish"
            >
              Hinglish
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 rounded-md transition-all min-h-[36px] ${
                language === 'hi'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="हिन्दी"
            >
              हिन्दी
            </button>
          </div>

          {/* Quick Edit Numbers Button */}
          <button
            onClick={onOpenUpdateModal}
            className="min-h-[40px] px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors active:scale-95"
            title={t.updateModalTitle}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">{t.updateModalTitle.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
