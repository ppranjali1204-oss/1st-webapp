import React, { useState } from 'react';
import { BusinessProfile, MetricData, Language } from '../types';
import { getTranslation } from '../data/translations';
import {
  X,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Send,
  Share2,
  Gift,
  RefreshCw,
} from 'lucide-react';

interface QuickToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BusinessProfile;
  metrics: MetricData;
  healthScore: number;
  language: Language;
  initialTab?: 'review' | 'promo' | 'share';
}

export const QuickToolsDrawer: React.FC<QuickToolsDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  metrics,
  healthScore,
  language,
  initialTab = 'review',
}) => {
  if (!isOpen) return null;

  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'review' | 'promo' | 'share'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // States for review tool
  const [reviewRating, setReviewRating] = useState<'5' | '4' | 'critical'>('5');
  const [reviewText, setReviewText] = useState(
    language === 'hi'
      ? `${profile.name} में आने और हमें 5-स्टार देने के लिए दिल से शुक्रिया! अगली बार आने पर यह मैसेज दिखाएं और 10% विशेष छूट पाएं।`
      : language === 'hinglish'
      ? `Thank you so much for the 5-star review! ${profile.name} team aapke support ke liye bohot grateful hai. Looking forward to welcoming you back soon! ✨`
      : `Thank you so much for the 5-star rating and kind review for ${profile.name}! We look forward to serving you again soon!`
  );

  // States for WhatsApp promo tool
  const [promoType, setPromoType] = useState<'weekend' | 'festive' | 'midweek'>('weekend');
  const [promoText, setPromoText] = useState(
    language === 'hi'
      ? `नमस्ते जी! ${profile.name} की तरफ से इस वीकेंड खास ऑफर: सभी प्रमुख सेवाओं पर 15% की छूट। सिर्फ पहले 20 बुकिंग्स के लिए। अभी रिप्लाई करके अपना स्लॉट बुक करें! 🎁✨`
      : language === 'hinglish'
      ? `Hello! ${profile.name} special weekend alert 🎉 Book your appointment in advance and get flat 15% discount. Limited slots available! Reply to confirm now 📲`
      : `Special weekend alert from ${profile.name}! 🌟 Enjoy 15% off when you pre-book your appointment this weekend. Reply here to lock in your preferred time!`
  );

  // Compile WhatsApp Weekly Summary
  const compileWeeklySummary = () => {
    return `📊 *LocalPulse Weekly Growth Report*
🏢 *${profile.name}* (${profile.city})
📅 Week Ending: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}

⭐ *Google Reviews*: ${metrics.googleRating}★ (+${metrics.newGoogleReviews} new reviews)
📲 *WhatsApp Leads*: ${metrics.whatsappLeads} client chats
📸 *Instagram Reach*: ${(metrics.instaReach / 1000).toFixed(1)}k accounts reached
🎯 *Bookings / Walk-ins*: ${metrics.bookingEnquiries} visitors
🏆 *Weekly Health Score*: ${healthScore}/100

💡 *Focus for Next Week*: Keep replying to Google reviews and follow up with WhatsApp inquiries!
_Generated via LocalPulse Dashboard_`;
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSendWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // Generate dynamic response using server API
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const endpoint = '/api/helper/generate';
      const kind = activeTab === 'review' ? 'review_reply' : 'whatsapp_promo';
      const context =
        activeTab === 'review'
          ? `Customer gave ${reviewRating}-star review for ${profile.type}`
          : `Promo theme: ${promoType} for ${profile.type}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          businessName: profile.name,
          businessType: profile.type,
          language,
          context,
        }),
      });

      const data = await res.json();
      if (data?.text) {
        if (activeTab === 'review') setReviewText(data.text);
        if (activeTab === 'promo') setPromoText(data.text);
      }
    } catch (err) {
      console.error('Failed to generate AI helper text:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Top Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t.quickToolsTitle}
            </h2>
            <p className="text-xs text-slate-500">
              1-tap helpers to answer reviews & bring clients
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

        {/* Tab switcher */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setActiveTab('review')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
              activeTab === 'review'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate">Review Reply</span>
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
              activeTab === 'promo'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate">WhatsApp Promo</span>
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
              activeTab === 'share'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-purple-600" />
            <span className="truncate">Weekly Report</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Tab 1: Review Reply */}
          {activeTab === 'review' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                  Customer Review Rating
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewRating('5')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-bold text-center transition-all min-h-[36px] ${
                      reviewRating === '5'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    ⭐⭐⭐⭐⭐ 5-Star
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewRating('4')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-bold text-center transition-all min-h-[36px] ${
                      reviewRating === '4'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    ⭐⭐⭐⭐ 4-Star
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewRating('critical')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-bold text-center transition-all min-h-[36px] ${
                      reviewRating === 'critical'
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    Critical / Feedback
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Ready-to-Paste Reply
                  </label>
                  <button
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>Generate AI variation</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 bg-slate-50 leading-relaxed font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleCopyText(reviewText)}
                  className="flex-1 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{t.copiedToast}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{t.copyText}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: WhatsApp Promo */}
          {activeTab === 'promo' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                  Broadcast Occasion
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPromoType('weekend')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-bold text-center transition-all min-h-[36px] ${
                      promoType === 'weekend'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    Weekend Special
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromoType('festive')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-bold text-center transition-all min-h-[36px] ${
                      promoType === 'festive'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    Festive Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromoType('midweek')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-bold text-center transition-all min-h-[36px] ${
                      promoType === 'midweek'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    Slow Weekday Boost
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    WhatsApp Message Text
                  </label>
                  <button
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>Generate fresh text</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={promoText}
                  onChange={(e) => setPromoText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 bg-slate-50 leading-relaxed font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleCopyText(promoText)}
                  className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{t.copiedToast}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{t.copyText}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleSendWhatsApp(promoText)}
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.openWhatsApp}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Share Weekly Report */}
          {activeTab === 'share' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Forward this clean growth summary to your business partner, store manager, or family on WhatsApp:
              </p>

              <div className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-xs whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
                {compileWeeklySummary()}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleCopyText(compileWeeklySummary())}
                  className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{t.copiedToast}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{t.copyText}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleSendWhatsApp(compileWeeklySummary())}
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Share via WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
