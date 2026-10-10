import React, { useState, useEffect } from 'react';
import { BusinessProfile, MetricData, ActionItem, Language, BusinessType } from './types';
import { BUSINESS_PRESETS } from './data/presets';
import { getTranslation } from './data/translations';
import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { HealthScoreCard } from './components/HealthScoreCard';
import { MetricCards } from './components/MetricCards';
import { WeeklyActionsCard } from './components/WeeklyActionsCard';
import { UpdateMetricsModal } from './components/UpdateMetricsModal';
import { QuickToolsDrawer } from './components/QuickToolsDrawer';
import {
  Sparkles,
  SlidersHorizontal,
  Share2,
  MessageSquare,
  Gift,
  ArrowRight,
  Info,
  CheckCircle,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEYS = {
  PROFILE: 'localpulse_business_profile_v1',
  METRICS: 'localpulse_metrics_data_v1',
  ACTIONS: 'localpulse_weekly_actions_v1',
  SCORE: 'localpulse_health_score_v1',
};

export default function App() {
  // Initialize state from localStorage or defaults
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {}
    const defaultPreset = BUSINESS_PRESETS.salon;
    return {
      name: defaultPreset.defaultName,
      type: 'salon',
      city: defaultPreset.defaultCity,
      language: 'hinglish',
      isSampleData: true,
      onboarded: false, // will show onboarding modal first if not yet completed
    };
  });

  const [metrics, setMetrics] = useState<MetricData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.METRICS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return BUSINESS_PRESETS.salon.metrics;
  });

  const [actions, setActions] = useState<ActionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return BUSINESS_PRESETS.salon.defaultActions.hinglish;
  });

  const [healthScore, setHealthScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCORE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return BUSINESS_PRESETS.salon.healthScore;
  });

  // Modal / Drawer states
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!profile.onboarded);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showToolsDrawer, setShowToolsDrawer] = useState<boolean>(false);
  const [toolsDrawerTab, setToolsDrawerTab] = useState<'review' | 'promo' | 'share'>('review');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync profile & storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
    } catch {}
  }, [metrics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));
    } catch {}
  }, [actions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCORE, JSON.stringify(healthScore));
    } catch {}
  }, [healthScore]);

  const t = getTranslation(profile.language);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute dynamic weekly summary based on metrics
  const getWeeklySummary = (): string => {
    const preset = BUSINESS_PRESETS[profile.type] || BUSINESS_PRESETS.other;
    if (profile.isSampleData) {
      if (profile.language === 'hi') return preset.summaryHi;
      if (profile.language === 'hinglish') return preset.summaryHinglish;
      return preset.summaryEn;
    }

    // Dynamic real numbers summary
    const googleUp = metrics.newGoogleReviews >= metrics.prevGoogleReviews;
    const instaUp = metrics.instaReachTrendPct >= 0;

    if (profile.language === 'hi') {
      if (googleUp && instaUp) {
        return `शानदार हफ्ता: ${metrics.newGoogleReviews} नए गूगल रिव्यू और इंस्टाग्राम रीच में तेजी दर्ज हुई!`;
      }
      if (googleUp && !instaUp) {
        return `अच्छा हफ्ता: ${metrics.newGoogleReviews} नए गूगल रिव्यू मिले, लेकिन इंस्टाग्राम रीच में थोड़ी गिरावट आई।`;
      }
      return `सामान्य हफ्ता: व्हाट्सएप पर ${metrics.whatsappLeads} चैट आए, गूगल रिव्यूज बढ़ाने पर ध्यान दें।`;
    }

    if (profile.language === 'hinglish') {
      if (googleUp && instaUp) {
        return `Super week: ${metrics.newGoogleReviews} new Google reviews aur Instagram reach bhi solid badhi!`;
      }
      if (googleUp && !instaUp) {
        return `Good week: ${metrics.newGoogleReviews} new Google reviews aaye, lekin Instagram reach thodi drop hui.`;
      }
      return `Decent week: ${metrics.whatsappLeads} WhatsApp inquiries aayi, reviews aur reels par focus karein.`;
    }

    if (googleUp && instaUp) {
      return `Strong week: ${metrics.newGoogleReviews} new Google reviews and Instagram reach expanded!`;
    }
    if (googleUp && !instaUp) {
      return `Good week: ${metrics.newGoogleReviews} new Google reviews, but Instagram reach dropped.`;
    }
    return `Steady week: ${metrics.whatsappLeads} WhatsApp leads received, focus on replying to reviews.`;
  };

  // Recalculate health score dynamically
  const calculateScore = (data: MetricData, acts: ActionItem[]): number => {
    let score = 50;
    // Google rating weight
    if (data.googleRating >= 4.8) score += 15;
    else if (data.googleRating >= 4.5) score += 10;
    else if (data.googleRating >= 4.0) score += 5;

    // Review velocity
    if (data.newGoogleReviews >= 10) score += 10;
    else if (data.newGoogleReviews >= 5) score += 6;

    // WhatsApp lead velocity
    if (data.whatsappLeads >= 35) score += 12;
    else if (data.whatsappLeads >= 20) score += 8;

    // Bookings / enquiries
    if (data.bookingEnquiries >= 25) score += 8;
    else if (data.bookingEnquiries >= 15) score += 5;

    // Actions completion bonus (+5 per action completed)
    const completedActionsCount = acts.filter((a) => a.completed).length;
    score += completedActionsCount * 3;

    return Math.min(100, Math.max(30, score));
  };

  // Handle Onboarding Completion
  const handleOnboardingComplete = (newProfile: BusinessProfile) => {
    const preset = BUSINESS_PRESETS[newProfile.type] || BUSINESS_PRESETS.other;
    setProfile(newProfile);
    setMetrics(preset.metrics);

    // Pick correct actions language
    const initialActions =
      preset.defaultActions[newProfile.language] || preset.defaultActions.en;
    setActions(initialActions);
    setHealthScore(preset.healthScore);
    setShowOnboarding(false);
    showToast(`Loaded sample data for ${newProfile.name}!`);
  };

  // Language change
  const handleLanguageChange = (newLang: Language) => {
    setProfile((prev) => ({ ...prev, language: newLang }));
    // Update default actions if unedited
    const preset = BUSINESS_PRESETS[profile.type] || BUSINESS_PRESETS.other;
    const localizedActions = preset.defaultActions[newLang] || preset.defaultActions.en;
    setActions((prev) =>
      localizedActions.map((item, idx) => ({
        ...item,
        completed: prev[idx]?.completed || false,
      }))
    );
  };

  // Toggle Action item
  const handleToggleAction = (id: string) => {
    setActions((prev) => {
      const updated = prev.map((act) =>
        act.id === id ? { ...act, completed: !act.completed } : act
      );
      const newScore = calculateScore(metrics, updated);
      setHealthScore(newScore);
      return updated;
    });
  };

  // AI Actions Generator
  const handleGenerateAIActions = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/actions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: profile.name,
          businessType: profile.type,
          city: profile.city,
          language: profile.language,
          metrics,
          healthScore,
        }),
      });

      const data = await res.json();
      if (data?.actions && Array.isArray(data.actions) && data.actions.length > 0) {
        setActions(data.actions);
        showToast('Fresh 3 weekly actions generated!');
      } else {
        showToast('Generated fresh actions for this week.');
      }
    } catch (err) {
      console.error('Error generating AI actions:', err);
      showToast('Offline fallback actions loaded.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Save updated numbers
  const handleSaveMetrics = (newMetrics: MetricData, isSample: boolean) => {
    setMetrics(newMetrics);
    setProfile((prev) => ({ ...prev, isSampleData: isSample }));
    const newScore = calculateScore(newMetrics, actions);
    setHealthScore(newScore);
    showToast(isSample ? 'Numbers updated!' : 'Switched to Real Business Numbers!');
  };

  // Reset back to sample data
  const handleResetToSample = () => {
    const preset = BUSINESS_PRESETS[profile.type] || BUSINESS_PRESETS.other;
    setMetrics(preset.metrics);
    setProfile((prev) => ({ ...prev, isSampleData: true }));
    setActions(preset.defaultActions[profile.language] || preset.defaultActions.en);
    setHealthScore(preset.healthScore);
    setShowUpdateModal(false);
    showToast('Reset to realistic sample data.');
  };

  // Metric card click router
  const handleMetricCardClick = (metricKey: 'google' | 'instagram' | 'whatsapp' | 'bookings') => {
    if (metricKey === 'google') {
      setToolsDrawerTab('review');
      setShowToolsDrawer(true);
    } else if (metricKey === 'whatsapp') {
      setToolsDrawerTab('promo');
      setShowToolsDrawer(true);
    } else {
      setShowUpdateModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-24 sm:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        profile={profile}
        language={profile.language}
        onLanguageChange={handleLanguageChange}
        onOpenUpdateModal={() => setShowUpdateModal(true)}
        onOpenQuickTools={() => {
          setToolsDrawerTab('review');
          setShowToolsDrawer(true);
        }}
      />

      {/* Main Single-Scrollable Mobile-First Canvas */}
      <main className="max-w-3xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 space-y-3.5">
        {/* Sample Data Callout Banner */}
        {profile.isSampleData && (
          <div className="bg-amber-500/10 border border-amber-300/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-amber-950 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-semibold tracking-tight truncate">
                {t.sampleDataBanner}
              </p>
            </div>
            <button
              onClick={() => setShowUpdateModal(true)}
              className="shrink-0 min-h-[38px] px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span>{t.sampleDataAction}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 1. Weekly Health Score Card */}
        <HealthScoreCard
          score={healthScore}
          summary={getWeeklySummary()}
          metrics={metrics}
          language={profile.language}
          onOpenDetails={() => setShowUpdateModal(true)}
        />

        {/* 2. Four Performance Metric Cards */}
        <MetricCards
          metrics={metrics}
          language={profile.language}
          onSelectMetric={handleMetricCardClick}
        />

        {/* 3. This Week's 3 Actions Card */}
        <WeeklyActionsCard
          actions={actions}
          language={profile.language}
          onToggleAction={handleToggleAction}
          onGenerateAI={handleGenerateAIActions}
          isGenerating={isGeneratingAI}
          onOpenQuickResponder={(category, initialText) => {
            if (category === 'whatsapp') setToolsDrawerTab('promo');
            else setToolsDrawerTab('review');
            setShowToolsDrawer(true);
          }}
        />

        {/* Quick Helper Tools Grid (Everyday tools for Indian owners) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {t.quickToolsTitle}
              </h3>
              <p className="text-[11px] text-slate-500">
                1-tap shortcuts for WhatsApp & Google Reviews
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => {
                setToolsDrawerTab('review');
                setShowToolsDrawer(true);
              }}
              className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white text-left transition-all active:scale-[0.99] flex flex-col justify-between min-h-[82px] cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {t.toolReviewReplyTitle}
                </span>
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {t.toolReviewReplyDesc}
              </p>
            </button>

            <button
              onClick={() => {
                setToolsDrawerTab('promo');
                setShowToolsDrawer(true);
              }}
              className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white text-left transition-all active:scale-[0.99] flex flex-col justify-between min-h-[82px] cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {t.toolWhatsappPromoTitle}
                </span>
                <Gift className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {t.toolWhatsappPromoDesc}
              </p>
            </button>

            <button
              onClick={() => {
                setToolsDrawerTab('share');
                setShowToolsDrawer(true);
              }}
              className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white text-left transition-all active:scale-[0.99] flex flex-col justify-between min-h-[82px] cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {t.toolShareSummaryTitle}
                </span>
                <Share2 className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {t.toolShareSummaryDesc}
              </p>
            </button>
          </div>
        </div>

        {/* Business Settings & Reset footer card */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="truncate">
            <span className="font-semibold text-slate-700">{profile.name}</span>
            <span className="mx-1.5">·</span>
            <span>{profile.city}</span>
          </div>
          <button
            onClick={() => setShowOnboarding(true)}
            className="text-emerald-700 font-bold hover:underline shrink-0 min-h-[36px] flex items-center px-2 cursor-pointer"
          >
            {t.editBusiness}
          </button>
        </div>
      </main>

      {/* Floating Bottom Quick Bar for Mobile Ergonomics (under 15% sticky cap) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 sm:hidden">
        <div className="max-w-3xl mx-auto grid grid-cols-4 gap-1 text-center">
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex flex-col items-center justify-center py-1 min-h-[44px] text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-[10px] font-semibold mt-0.5">Edit Data</span>
          </button>
          <button
            onClick={() => {
              setToolsDrawerTab('review');
              setShowToolsDrawer(true);
            }}
            className="flex flex-col items-center justify-center py-1 min-h-[44px] text-slate-600 hover:text-blue-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[10px] font-semibold mt-0.5">Reviews</span>
          </button>
          <button
            onClick={() => {
              setToolsDrawerTab('promo');
              setShowToolsDrawer(true);
            }}
            className="flex flex-col items-center justify-center py-1 min-h-[44px] text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <Gift className="w-4 h-4" />
            <span className="text-[10px] font-semibold mt-0.5">WhatsApp</span>
          </button>
          <button
            onClick={() => {
              setToolsDrawerTab('share');
              setShowToolsDrawer(true);
            }}
            className="flex flex-col items-center justify-center py-1 min-h-[44px] text-slate-600 hover:text-purple-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-[10px] font-semibold mt-0.5">Report</span>
          </button>
        </div>
      </nav>

      {/* Onboarding Flow Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      {/* Update Numbers Bottom Sheet / Modal */}
      <UpdateMetricsModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        metrics={metrics}
        profile={profile}
        language={profile.language}
        onSaveMetrics={handleSaveMetrics}
        onResetToSample={handleResetToSample}
      />

      {/* Quick Helpers Drawer */}
      <QuickToolsDrawer
        isOpen={showToolsDrawer}
        onClose={() => setShowToolsDrawer(false)}
        profile={profile}
        metrics={metrics}
        healthScore={healthScore}
        language={profile.language}
        initialTab={toolsDrawerTab}
      />
    </div>
  );
}
