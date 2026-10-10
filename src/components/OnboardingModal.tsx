import React, { useState } from 'react';
import { BusinessProfile, BusinessType, Language } from '../types';
import { BUSINESS_PRESETS } from '../data/presets';
import { getTranslation } from '../data/translations';
import {
  Scissors,
  Stethoscope,
  GraduationCap,
  Camera,
  Dumbbell,
  Coffee,
  ShoppingBag,
  Store,
  Sparkles,
  ArrowRight,
  MapPin,
  Check,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: BusinessProfile) => void;
}

const BUSINESS_TYPE_OPTIONS: {
  type: BusinessType;
  labelEn: string;
  labelHi: string;
  labelHinglish: string;
  icon: React.ReactNode;
}[] = [
  {
    type: 'salon',
    labelEn: 'Salon & Spa',
    labelHi: 'सैलून और स्पा',
    labelHinglish: 'Salon & Parlour',
    icon: <Scissors className="w-5 h-5 text-pink-600" />,
  },
  {
    type: 'clinic',
    labelEn: 'Clinic & Doctor',
    labelHi: 'क्लिनिक / डॉक्टर',
    labelHinglish: 'Dental & Clinic',
    icon: <Stethoscope className="w-5 h-5 text-blue-600" />,
  },
  {
    type: 'coaching',
    labelEn: 'Coaching & Tuition',
    labelHi: 'कोचिंग सेंटर',
    labelHinglish: 'Tuition & Classes',
    icon: <GraduationCap className="w-5 h-5 text-amber-600" />,
  },
  {
    type: 'photo',
    labelEn: 'Photo Studio',
    labelHi: 'फोटो स्टूडियो',
    labelHinglish: 'Photo & Wedding',
    icon: <Camera className="w-5 h-5 text-purple-600" />,
  },
  {
    type: 'gym',
    labelEn: 'Gym & Fitness',
    labelHi: 'जिम / फिटनेस',
    labelHinglish: 'Gym & Fitness',
    icon: <Dumbbell className="w-5 h-5 text-red-600" />,
  },
  {
    type: 'cafe',
    labelEn: 'Cafe & Bakery',
    labelHi: 'कैफे / बेकरी',
    labelHinglish: 'Cafe & Fast Food',
    icon: <Coffee className="w-5 h-5 text-amber-700" />,
  },
  {
    type: 'boutique',
    labelEn: 'Boutique & Retail',
    labelHi: 'कपड़ों की दुकान',
    labelHinglish: 'Fashion Boutique',
    icon: <ShoppingBag className="w-5 h-5 text-emerald-600" />,
  },
  {
    type: 'other',
    labelEn: 'Other Business',
    labelHi: 'अन्य व्यापार',
    labelHinglish: 'Other Local Shop',
    icon: <Store className="w-5 h-5 text-slate-600" />,
  },
];

const POPULAR_CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Ahmedabad',
  'Hyderabad',
  'Indore',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [language, setLanguage] = useState<Language>('hinglish');
  const [businessType, setBusinessType] = useState<BusinessType>('salon');
  const [businessName, setBusinessName] = useState('Royal Looks Unisex Salon');
  const [city, setCity] = useState('Bandra, Mumbai');

  if (!isOpen) return null;

  const t = getTranslation(language);

  const handleTypeSelect = (type: BusinessType) => {
    setBusinessType(type);
    const preset = BUSINESS_PRESETS[type];
    if (preset) {
      setBusinessName(preset.defaultName);
      setCity(preset.defaultCity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      name: businessName.trim() || 'My Business',
      type: businessType,
      city: city.trim() || 'Local City',
      language,
      isSampleData: true,
      onboarded: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header banner */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Under 60 seconds setup</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Local<span className="text-emerald-400">Pulse</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {t.onboardingSub}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Step 1: Language selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              1. {t.languageLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all min-h-[44px] flex flex-col items-center justify-center ${
                  language === 'en'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>English</span>
                <span className="text-[10px] text-slate-500">Simple English</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hinglish')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all min-h-[44px] flex flex-col items-center justify-center ${
                  language === 'hinglish'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Hinglish</span>
                <span className="text-[10px] text-emerald-600 font-medium">Easy & Natural</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all min-h-[44px] flex flex-col items-center justify-center ${
                  language === 'hi'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>हिन्दी</span>
                <span className="text-[10px] text-slate-500">सरल हिन्दी</span>
              </button>
            </div>
          </div>

          {/* Step 2: Business Type */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              2. {t.businessTypeLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BUSINESS_TYPE_OPTIONS.map((opt) => {
                const isSelected = businessType === opt.type;
                const label =
                  language === 'hi'
                    ? opt.labelHi
                    : language === 'hinglish'
                    ? opt.labelHinglish
                    : opt.labelEn;

                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => handleTypeSelect(opt.type)}
                    className={`p-2.5 rounded-xl border text-left transition-all min-h-[58px] flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {opt.icon}
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[11px] font-semibold tracking-tight truncate mt-1">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Business Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              3. {t.businessNameLabel}
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Royal Looks Salon, Sharma Clinic"
              required
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            />
          </div>

          {/* Step 4: City */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                4. {t.cityLabel}
              </label>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> India
              </span>
            </div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Bandra, Mumbai or Indiranagar, Bengaluru"
              required
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white mb-2"
            />
            {/* Quick city suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${
                    city.includes(c)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <span>{t.startDashboard}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Loads pre-filled sample data. You can edit with 1 tap anytime.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
