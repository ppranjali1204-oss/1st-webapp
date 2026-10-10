export type Language = 'en' | 'hi' | 'hinglish';

export type BusinessType =
  | 'salon'
  | 'clinic'
  | 'coaching'
  | 'photo'
  | 'gym'
  | 'cafe'
  | 'boutique'
  | 'other';

export interface BusinessProfile {
  name: string;
  type: BusinessType;
  city: string;
  language: Language;
  isSampleData: boolean;
  onboarded: boolean;
}

export interface MetricData {
  // Google
  googleRating: number;
  newGoogleReviews: number;
  prevGoogleReviews: number;
  pendingReviewReplies: number;

  // Instagram
  instaFollowers: number;
  instaReach: number; // e.g. 6200
  prevInstaReach: number;
  instaReachTrendPct: number; // e.g. -8%

  // WhatsApp
  whatsappLeads: number;
  prevWhatsappLeads: number;

  // Walk-ins / bookings
  bookingEnquiries: number;
  prevBookingEnquiries: number;
  estimatedRevenue?: number;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: 'google_reviews' | 'whatsapp' | 'instagram' | 'walk_in';
  impact: string;
  estimatedMinutes: number;
  suggestedTemplate: string;
  completed?: boolean;
}

export interface BusinessPreset {
  type: BusinessType;
  labelEn: string;
  labelHi: string;
  labelHinglish: string;
  iconName: string;
  defaultName: string;
  defaultCity: string;
  metrics: MetricData;
  healthScore: number;
  summaryEn: string;
  summaryHi: string;
  summaryHinglish: string;
  defaultActions: {
    en: ActionItem[];
    hi: ActionItem[];
    hinglish: ActionItem[];
  };
}
