import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-init Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback recommendations if AI is offline or without API key
function getFallbackActions(businessType: string, language: 'en' | 'hi' | 'hinglish') {
  if (language === 'hi') {
    return [
      {
        id: 'action-1',
        title: 'Google Reviews का उत्तर दें',
        description: 'इस हफ्ते आए 4 बिना जवाब वाले रिव्यूज का शुक्रिया अदा करें।',
        category: 'google_reviews',
        impact: 'उच्च प्रभाव',
        estimatedMinutes: 5,
        suggestedTemplate: 'नमस्ते! हमारी सेवा पसंद करने के लिए बहुत धन्यवाद। अगली बार आने पर 10% छूट पाएं!',
      },
      {
        id: 'action-2',
        title: 'WhatsApp पर वीकेंड ऑफर भेजें',
        description: 'पुराने 30 ग्राहकों को वीकेंड स्लॉट बुक करने का मैसेज ब्रॉडकास्ट करें।',
        category: 'whatsapp',
        impact: 'तुरंत बुकिंग',
        estimatedMinutes: 3,
        suggestedTemplate: 'नमस्ते जी! इस शनिवार और रविवार हमारे पास सीमित स्लॉट उपलब्ध हैं। अभी बुक करें और स्पेशल गिफ्ट पाएं!',
      },
      {
        id: 'action-3',
        title: 'Instagram पर ट्रांसफॉर्मेशन या काम की रील पोस्ट करें',
        description: 'आज के बेस्ट काम का 15 सेकंड का वीडियो बनाएं और लोकेशन टैग करें।',
        category: 'instagram',
        impact: 'नई पहुंच',
        estimatedMinutes: 10,
        suggestedTemplate: 'आज का स्पेशल काम! अपने शहर में बेस्ट सर्विस के लिए DM करें या WhatsApp पर संपर्क करें।',
      },
    ];
  }

  if (language === 'hinglish') {
    return [
      {
        id: 'action-1',
        title: 'Google Reviews ka reply karein',
        description: 'Unanswered reviews ko polite thank you message bhejein taaki Google ranking improve ho.',
        category: 'google_reviews',
        impact: 'High Impact',
        estimatedMinutes: 5,
        suggestedTemplate: 'Thank you so much for your kind words! Aapka support hamare liye bahut important hai. See you again soon! ✨',
      },
      {
        id: 'action-2',
        title: 'WhatsApp pe Weekend Slot broadcast bhejein',
        description: 'Last 30 customers ko Saturday-Sunday slots pehle se reserve karne ka reminder dein.',
        category: 'whatsapp',
        impact: 'Instant Bookings',
        estimatedMinutes: 3,
        suggestedTemplate: 'Hey! Is weekend ke appointment slots fast fill ho rahe hain. Agar visit plan kar rahe hain toh pehle hi book kar lijiye! 📲',
      },
      {
        id: 'action-3',
        title: 'Trending audio ke sath 1 Reel post karein',
        description: 'Behind-the-scenes ya customer result ka 15-second video post karein local city tag ke sath.',
        category: 'instagram',
        impact: 'New Reach',
        estimatedMinutes: 10,
        suggestedTemplate: 'Quality you can trust! DM us or tap the WhatsApp button in bio for quick appointment. 📍 Local city',
      },
    ];
  }

  return [
    {
      id: 'action-1',
      title: 'Reply to 4 pending Google reviews',
      description: 'Thank recent customers warmly to boost local search ranking and trust.',
      category: 'google_reviews',
      impact: 'High Impact',
      estimatedMinutes: 5,
      suggestedTemplate: 'Thank you for choosing us! We are thrilled to serve you. Looking forward to welcoming you back!',
    },
    {
      id: 'action-2',
      title: 'Send a weekend broadcast on WhatsApp',
      description: 'Remind your top 25 customers to reserve their slot before weekend rush.',
      category: 'whatsapp',
      impact: 'Fast Bookings',
      estimatedMinutes: 3,
      suggestedTemplate: 'Hello! Weekend bookings are now open. Reserve your time slot today to skip the wait.',
    },
    {
      id: 'action-3',
      title: 'Post a 15-second customer work reel',
      description: 'Showcase your latest results with your local city and area geotag.',
      category: 'instagram',
      impact: 'New Reach',
      estimatedMinutes: 10,
      suggestedTemplate: 'Fresh results of the day! Message us on WhatsApp to book your consultation.',
    },
  ];
}

// API: Generate Weekly Actions
app.post('/api/actions/generate', async (req: Request, res: Response) => {
  try {
    const { businessName, businessType, city, language = 'hinglish', metrics, healthScore } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({ actions: getFallbackActions(businessType, language) });
    }

    const languageInstruction =
      language === 'hi'
        ? 'Generate all titles, descriptions, and templates in clean, friendly everyday Hindi (Devanagari script).'
        : language === 'hinglish'
        ? 'Generate all titles, descriptions, and templates in authentic, simple Indian Hinglish (Latin alphabet with Hindi phrasing, very natural for an Indian shop owner).'
        : 'Generate all titles, descriptions, and templates in simple, jargon-free English for a small shop owner.';

    const prompt = `You are an expert local business growth advisor in India helping a busy local business owner.
Business Name: "${businessName || 'Local Business'}"
Business Category: "${businessType || 'General Store'}"
City: "${city || 'Local City'}"
Current Weekly Stats:
- Google Rating: ${metrics?.googleRating || 4.7} (${metrics?.newGoogleReviews || 8} new reviews this week)
- Instagram Followers: ${metrics?.instaFollowers || 2400} (${metrics?.instaReach || '5.2k'} reach)
- WhatsApp Leads: ${metrics?.whatsappLeads || 28} chats
- Booking/Walk-in Enquiries: ${metrics?.bookingEnquiries || 18}
- Health Score: ${healthScore || 78}/100

Language rule: ${languageInstruction}

Task:
Generate exactly 3 specific, bite-sized, practical action items for this week.
Every action must be realistic to complete within 5-15 minutes by a solo owner or staff on WhatsApp, Google Maps, or Instagram.
One must target Google Reviews, one must target WhatsApp engagement, and one must target Instagram reach or Walk-in promotion.

Provide:
1. title: punchy action title (max 6 words)
2. description: single clear sentence on what to do and why
3. category: one of ["google_reviews", "whatsapp", "instagram", "walk_in"]
4. impact: 2-word impact summary (e.g., "High Impact", "Instant Bookings", "New Reach")
5. estimatedMinutes: number between 3 and 15
6. suggestedTemplate: a ready-to-copy WhatsApp message, review reply, or reel caption/hook.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            actions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  estimatedMinutes: { type: Type.NUMBER },
                  suggestedTemplate: { type: Type.STRING },
                },
                required: ['title', 'description', 'category', 'impact', 'estimatedMinutes', 'suggestedTemplate'],
              },
            },
          },
          required: ['actions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed?.actions && Array.isArray(parsed.actions) && parsed.actions.length > 0) {
      const actionsWithIds = parsed.actions.map((act: any, idx: number) => ({
        ...act,
        id: act.id || `ai-action-${Date.now()}-${idx}`,
      }));
      return res.json({ actions: actionsWithIds.slice(0, 3) });
    }

    return res.json({ actions: getFallbackActions(businessType, language) });
  } catch (err: any) {
    console.error('Error in /api/actions/generate:', err);
    return res.json({ actions: getFallbackActions(req.body.businessType, req.body.language || 'hinglish') });
  }
});

// API: Generate Ready-to-Use Response or WhatsApp Promo
app.post('/api/helper/generate', async (req: Request, res: Response) => {
  try {
    const { kind, businessName, businessType, language = 'hinglish', context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      if (kind === 'review_reply') {
        return res.json({
          text: language === 'hi'
            ? `नमस्ते! ${businessName} में आने और हमें इतना अच्छा रिव्यू देने के लिए बहुत शुक्रिया। अगली बार आने पर हमें बताएं, आपके लिए स्पेशल सेवा तैयार रहेगी!`
            : language === 'hinglish'
            ? `Thank you so much! ${businessName} me aane aur hume itna positive review dene ke liye dil se shukriya. Aapka satisfaction hamara reward hai! ✨`
            : `Thank you so much for visiting ${businessName}! We deeply appreciate your review and look forward to serving you again soon!`,
        });
      }
      return res.json({
        text: language === 'hi'
          ? `नमस्ते! ${businessName} की तरफ से स्पेशल ऑफर: इस हफ्ते प्री-बुकिंग पर 15% की छूट। तुरंत WhatsApp पर रिप्लाई करके स्लॉट बुक करें!`
          : language === 'hinglish'
          ? `Hello ji! ${businessName} special weekend alert: Pehle 20 bookings par flat 15% discount! Abhi reply karke apna time slot confirm karein. 🎁`
          : `Special Offer from ${businessName}! Book your weekend appointment in advance and enjoy 15% off. Reply here to secure your slot!`,
      });
    }

    const langRule =
      language === 'hi'
        ? 'Write in everyday conversational Hindi in Devanagari script.'
        : language === 'hinglish'
        ? 'Write in authentic Indian Hinglish (Latin script) that feels warm and respectful, exactly like Indian shop owners message regular clients on WhatsApp.'
        : 'Write in friendly, warm, non-corporate English.';

    const prompt = `You are a local marketing assistant for an Indian business: "${businessName}" (${businessType}).
Format requested: ${kind === 'review_reply' ? 'A Google review reply' : kind === 'whatsapp_promo' ? 'A WhatsApp broadcast message with emojis' : 'An Instagram Reel hook and caption with hashtags'}
Context/details: ${context || 'General weekly boost'}
Language requirement: ${langRule}

Write a ready-to-copy text (under 60 words, warm, respectful, with clear call-to-action). Return only the text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ text: response.text?.trim() || '' });
  } catch (err: any) {
    console.error('Error in /api/helper/generate:', err);
    return res.status(500).json({ error: 'Failed to generate text' });
  }
});

// Start Express server and bind Vite in dev mode
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LocalPulse running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
