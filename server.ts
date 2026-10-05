import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for safe JSON parsing
function tryParseJson(text: string, fallback: any) {
  try {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return fallback;
  }
}

// 1. Adaptive Ability Diagnostic Endpoint
app.post('/api/gemini/adaptive-diagnostic', async (req: Request, res: Response) => {
  const { language, level, abilityScores, recentMistakes, completedCount } = req.body;

  if (!apiKey) {
    // High-fidelity algorithmic fallback
    const weakArea = abilityScores?.vibeNuance < 60 ? 'Vibe & Colloquial Nuance' :
                     abilityScores?.grammar < 60 ? 'Contextual Grammar Logic' :
                     abilityScores?.conversationalConfidence < 60 ? 'Spoken Dialogue Spontaneity' : 'Advanced Story Nuances';
    
    return res.json({
      status: 'fallback',
      diagnosis: {
        summary: `Adaptive assessment for ${language} (${level}): Strong baseline with targeted growth needed in ${weakArea}.`,
        weaknessDetected: weakArea,
        recommendation: `The algorithm selected an interactive scenario focusing on ${weakArea} to bypass rote drill fatigue and solidify organic comprehension.`,
        cognitiveMastery: Math.min(95, Math.round(((abilityScores?.grammar || 50) + (abilityScores?.vibeNuance || 50) + (abilityScores?.conversationalConfidence || 50) + (abilityScores?.comprehension || 50)) / 4)),
        nextSkillFocus: [
          'Authentic conversational pacing',
          'Contextual prepositions and filler words',
          'Tone alignment (polite vs casual street vibe)'
        ],
        vibeTip: `Locals in ${language} rarely speak in full textbook sentences. Lean into conversational elisions and rhythm!`
      }
    });
  }

  try {
    const prompt = `You are the adaptive cognitive learning algorithm for LinguaVibe, an intelligent language learning platform.
Evaluate this student's profile:
Target Language: ${language}
Current CEFR Level: ${level}
Ability Scores (0-100):
- Grammar Accuracy: ${abilityScores?.grammar || 50}
- Vibe & Cultural Nuance: ${abilityScores?.vibeNuance || 50}
- Conversational Confidence: ${abilityScores?.conversationalConfidence || 50}
- Story Comprehension: ${abilityScores?.comprehension || 50}
Recent Mistake Tags: ${JSON.stringify(recentMistakes || [])}
Total Lessons Completed: ${completedCount || 0}

Provide an algorithmic diagnostic recommendation that avoids rote memorization and prescribes engaging, high-context vibe or story practice.
Respond strictly in JSON with this structure:
{
  "summary": "1-2 sentence diagnostic summary of their cognitive mastery",
  "weaknessDetected": "specific linguistic or tone obstacle",
  "recommendation": "clear pedagogical reason why the algorithm picked their next challenge",
  "cognitiveMastery": 72,
  "nextSkillFocus": ["skill 1", "skill 2", "skill 3"],
  "vibeTip": "1 practical authentic cultural vibe insight for this language"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = tryParseJson(response.text || '{}', null);
    if (parsed) {
      return res.json({ status: 'ok', diagnosis: parsed });
    }
    throw new Error('Failed to parse model output');
  } catch (error: any) {
    console.error('Diagnostic error:', error);
    return res.json({
      status: 'fallback',
      diagnosis: {
        summary: `Adaptive calibration active for ${language} (${level}).`,
        weaknessDetected: 'Contextual nuance in spontaneous exchanges',
        recommendation: 'Targeted dialogue roleplay selected to bridge grammatical theory and fluid vibe intuition.',
        cognitiveMastery: 68,
        nextSkillFocus: ['Idiomatic contractions', 'Casual vs formal address', 'Listening comprehension speed'],
        vibeTip: 'Pay attention to local filler particles—they give you breathing room to think while sounding native!'
      }
    });
  }
});

// 2. Real-World Conversation Practice Endpoint
app.post('/api/gemini/conversation-turn', async (req: Request, res: Response) => {
  const { language, persona, history, userMessage } = req.body;

  if (!apiKey) {
    // Dynamic simulated response based on persona and language
    const fallbackResponses: Record<string, { reply: string; translation: string; nativeTip: string; feedback: string }> = {
      Spanish: {
        reply: '¡Hombre, qué casualidad! Oye, te recomiendo probar el café de especialidad con avena, está riquísimo. ¿Te apetece algo para picar?',
        translation: 'Hey man, what a coincidence! Listen, I recommend trying the specialty oat milk coffee, it is delicious. Do you feel like getting something to snack on?',
        nativeTip: 'Instead of saying "Quiero esto", native speakers often use "Te encargo...", "Me pones...", or "Me das..." to sound effortless.',
        feedback: 'Great confidence! Your grammar is clear and the vibe is warm and natural.'
      },
      Japanese: {
        reply: 'いらっしゃい！今日は掘り出し物がたくさん入ってきたよ。ヴィンテージのジャケットとか興味ある？',
        translation: 'Welcome! We got lots of hidden gems in today. Are you interested in vintage jackets or anything?',
        nativeTip: 'Instead of textbook "Anata wa", locals drop pronouns and use subtle sentence enders like "〜とか" or "〜ね".',
        feedback: 'Natural rhythm! Keep practicing dropping excessive subjects.'
      },
      French: {
        reply: 'Ah, salut ! Tu tombes bien, on vient tout juste de sortir les croissants aux amandes du four. Tu veux un café avec ?',
        translation: 'Ah, hi! Good timing, we just took the almond croissants out of the oven. Want a coffee with that?',
        nativeTip: 'In casual conversation, drop the "ne" in negations (say "c\'est pas" instead of "ce n\'est pas").',
        feedback: 'Super fluid! You matched the casual Parisian café tone perfectly.'
      },
      Italian: {
        reply: 'Ciao bello! Allora, il solito espresso doppio o oggi hai voglia di provare qualcosa di speciale?',
        translation: 'Ciao! So, the usual double espresso, or do you feel like trying something special today?',
        nativeTip: 'Use "Allora" or "Senti" to start questions naturally like locals in Milan and Rome.',
        feedback: 'Bellissimo! Great emotional resonance and friendly energy.'
      }
    };

    const fb = fallbackResponses[language] || {
      reply: 'Hello! That sounds great. Let\'s continue our practice together!',
      translation: 'Hello! That sounds great. Let\'s continue our practice together!',
      nativeTip: 'Focus on everyday colloquial phrases rather than dictionary translations.',
      feedback: 'Good conversational flow and natural pacing!'
    };

    return res.json({
      status: 'fallback',
      reply: fb.reply,
      translation: fb.translation,
      vibeScore: 88,
      vibeFeedback: fb.feedback,
      howNativeWouldSay: fb.nativeTip,
      grammarCorrection: null,
      culturalInsight: `In ${language}, small talk warms up any interaction before jumping into the main topic!`
    });
  }

  try {
    const prompt = `You are roleplaying as a real-world local character for an adaptive language learner.
Target Language: ${language}
Character Persona: ${JSON.stringify(persona || { name: 'Local Friend', role: 'Friendly local', setting: 'Café' })}
Conversation History: ${JSON.stringify(history || [])}
Learner's latest message in ${language}: "${userMessage}"

Tasks:
1. Reply in ${language} as this persona (keep it natural, colloquial, lively, around 1-3 sentences).
2. Provide an English translation.
3. Calculate a Vibe Score (0-100) reflecting how natural, idiomatic, and culturally apt the student's message was.
4. Provide constructive vibe feedback (praise what was good, point out if they sounded too robotic/stiff).
5. "howNativeWouldSay": Show 1 alternative sentence in ${language} that sounds like an authentic local resident.
6. "grammarCorrection": If there was a grammar error, gently explain it with zero shame. If none, set to null.
7. "culturalInsight": 1 intriguing tidbit about social etiquette or slang in this setting.

Respond strictly in JSON:
{
  "reply": "Persona's response in target language",
  "translation": "English translation of the persona's response",
  "vibeScore": 88,
  "vibeFeedback": "Why this sounded great or where it felt slightly textbook",
  "howNativeWouldSay": "More natural native expression",
  "grammarCorrection": null or "Gently formatted grammar fix",
  "culturalInsight": "Short cultural context note"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = tryParseJson(response.text || '{}', null);
    if (parsed) {
      return res.json({ status: 'ok', ...parsed });
    }
    throw new Error('Failed to parse conversation response');
  } catch (error: any) {
    console.error('Conversation error:', error);
    return res.json({
      status: 'fallback',
      reply: `¡Entendido! Me parece una excelente idea. Sigamos conversando.`,
      translation: 'Understood! Sounds like an excellent idea. Let us keep chatting.',
      vibeScore: 85,
      vibeFeedback: 'Good flow and easy to understand.',
      howNativeWouldSay: '¡De una! Me parece genial.',
      grammarCorrection: null,
      culturalInsight: 'Conversational momentum matters more than perfection!'
    });
  }
});

// 3. Dynamic Story Generator / Brancher
app.post('/api/gemini/generate-story-chapter', async (req: Request, res: Response) => {
  const { language, level, scenario, pastChoice, pastOutcome } = req.body;

  if (!apiKey) {
    return res.json({
      status: 'fallback',
      chapter: {
        title: 'The Unmarked Door in the Alley',
        sceneDescription: 'A warm neon sign buzzes softly over a brass latch. The aroma of roasted spices drifts through the door.',
        dialogue: [
          { speaker: 'Guide', text: 'Aquí es donde se juntan los músicos locales después de medianoche.', translation: 'This is where local musicians gather after midnight.' },
          { speaker: 'You', text: '¿Podemos entrar sin reserva?', translation: 'Can we enter without a reservation?' }
        ],
        choices: [
          { id: 'c1', label: 'Greet the doorkeeper with a polite local nod and smile', vibeImpact: 'Chill & Respectful (+15 Vibe)', nextScenePreview: 'The doorkeeper invites you to the stage front.' },
          { id: 'c2', label: 'Ask if they have an English cocktail menu', vibeImpact: 'Tourist Tell (-5 Vibe)', nextScenePreview: 'He smiles politely and hands you a dusty laminated card.' },
          { id: 'c3', label: 'Order the house special in confident target language', vibeImpact: 'Local Legend (+25 Vibe)', nextScenePreview: 'The bartender gives you a knowing wink and a complimentary tapas dish.' }
        ],
        challengeQuestion: {
          prompt: 'What does "juntan" mean in this sentence?',
          options: ['perform', 'gather / meet up', 'argue', 'cook'],
          correctIndex: 1,
          explanation: '"Juntarse" is a natural everyday phrasal verb meaning to meet up or hang out together.'
        }
      }
    });
  }

  try {
    const prompt = `Create an interactive story chapter for a language student.
Target Language: ${language}
Level: ${level}
Scenario Theme: ${scenario}
Previous Choice: ${pastChoice || 'Story Start'}
Previous Outcome: ${pastOutcome || 'Arriving at scene'}

Write a vivid, engaging chapter that uses natural contextual dialogue and teaches authentic vibes rather than sterile textbook sentences.
Include 2-3 dialogue lines in ${language} with English translations, a brief scene setup, 3 interactive choices with vibe tags, and 1 quick comprehension/grammar check.

Respond strictly in JSON:
{
  "title": "Evocative Chapter Title",
  "sceneDescription": "Vivid setting description in English (2 sentences)",
  "dialogue": [
    { "speaker": "Name", "text": "In target language", "translation": "In English" }
  ],
  "choices": [
    { "id": "c1", "label": "Action in English", "vibeImpact": "e.g. Street Smart (+20 Vibe)", "nextScenePreview": "Brief consequence preview" },
    { "id": "c2", "label": "Action in English", "vibeImpact": "e.g. Cautious & Polite (+10 Vibe)", "nextScenePreview": "Brief consequence preview" },
    { "id": "c3", "label": "Action in English", "vibeImpact": "e.g. Bold Local Move (+25 Vibe)", "nextScenePreview": "Brief consequence preview" }
  ],
  "challengeQuestion": {
    "prompt": "Comprehension or contextual grammar question based on the dialogue",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Clear pedagogical takeaway"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = tryParseJson(response.text || '{}', null);
    if (parsed) {
      return res.json({ status: 'ok', chapter: parsed });
    }
    throw new Error('Failed to parse story chapter');
  } catch (error: any) {
    console.error('Story generator error:', error);
    return res.json({
      status: 'fallback',
      chapter: {
        title: 'The Mysterious Order',
        sceneDescription: 'The café is humming with laughter. The menu has items handwritten in chalk with local slang.',
        dialogue: [
          { speaker: 'Barista', text: '¿Qué te pongo, cielo?', translation: 'What can I get you, darling?' },
          { speaker: 'Customer', text: 'Un cortado y lo que tengas recién horneado.', translation: 'A cortado and whatever you have fresh from the oven.' }
        ],
        choices: [
          { id: 'c1', label: 'Ask what is freshest today using local phrasing', vibeImpact: 'Authentic Local (+20 Vibe)', nextScenePreview: 'She pulls out warm pastries from the back.' },
          { id: 'c2', label: 'Point at the display case quietly', vibeImpact: 'Safe & Neutral (+5 Vibe)', nextScenePreview: 'You get a standard pastry.' }
        ],
        challengeQuestion: {
          prompt: 'How does the barista address the customer affectionately?',
          options: ['Señor', 'Cielo', 'Amigo', 'Compañero'],
          correctIndex: 1,
          explanation: '"Cielo" (literally heaven/sky) is a warm, casual term of endearment common in Spanish cafes.'
        }
      }
    });
  }
});

// Vite middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`LinguaVibe server running on http://0.0.0.0:${port}`);
  });
}

startServer();
