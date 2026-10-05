import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lightbulb, 
  User, 
  Bot,
  MapPin
} from 'lucide-react';
import { RoleplayPersona, ConversationTurn, LearnerProfile } from '../types';
import { ROLEPLAY_PERSONAS } from '../data/curriculum';
import { playProceduralSound, speakText, isSpeechRecognitionSupported, createSpeechRecognizer } from '../utils/audio';

interface ConversationViewProps {
  profile: LearnerProfile;
  initialPersonaId?: string;
  onBack: () => void;
  onCompleteSession: (xp: number, personaId: string) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  profile,
  initialPersonaId,
  onBack,
  onCompleteSession,
}) => {
  const personas = ROLEPLAY_PERSONAS[profile.targetLanguage] || ROLEPLAY_PERSONAS['es'];
  
  const [selectedPersona, setSelectedPersona] = useState<RoleplayPersona>(() => {
    if (initialPersonaId) {
      const found = personas.find(p => p.id === initialPersonaId);
      if (found) return found;
    }
    return personas[0];
  });

  const [messages, setMessages] = useState<ConversationTurn[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Latest feedback panel
  const [latestFeedback, setLatestFeedback] = useState<{
    vibeScore: number;
    feedback: string;
    howNativeWouldSay: string;
    grammarFix: string | null;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognizerRef = useRef<any>(null);

  // Initialize conversation with selected persona starter
  useEffect(() => {
    setMessages([
      {
        id: 'starter',
        sender: 'persona',
        text: selectedPersona.starterMessage,
        translation: selectedPersona.starterTranslation,
        timestamp: Date.now(),
      }
    ]);
    setLatestFeedback(null);
  }, [selectedPersona]);

  useEffect(() => {
    setSpeechSupported(isSpeechRecognitionSupported());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, latestFeedback]);

  const handlePlayAudio = (text: string) => {
    speakText(text, profile.targetLanguage);
  };

  const handleToggleVoiceInput = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. You can type your reply below!');
      return;
    }

    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
    } else {
      setIsListening(true);
      playProceduralSound('tap', profile.soundEnabled);

      const recognizer = createSpeechRecognizer(
        profile.targetLanguage,
        (transcript) => {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
          playProceduralSound('success', profile.soundEnabled);
        },
        (err) => {
          console.warn('Speech rec error', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );

      recognizerRef.current = recognizer;
      try {
        recognizer?.start();
      } catch (e) {
        console.warn('Failed to start speech rec', e);
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isSending) return;

    playProceduralSound('tap', profile.soundEnabled);
    const userTurn: ConversationTurn = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userTurn];
    setMessages(newHistory);
    setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/gemini/conversation-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: profile.targetLanguage,
          persona: selectedPersona,
          history: newHistory.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', content: m.text })),
          userMessage: textToSend.trim(),
        }),
      });

      const data = await res.json();
      
      const personaTurn: ConversationTurn = {
        id: `p-${Date.now()}`,
        sender: 'persona',
        text: data.reply || '¡Qué bien! Sigamos conversando.',
        translation: data.translation,
        timestamp: Date.now(),
        vibeScore: data.vibeScore || 85,
        vibeFeedback: data.vibeFeedback,
        nativeAlternative: data.howNativeWouldSay,
        grammarFix: data.grammarCorrection,
      };

      setMessages((prev) => [...prev, personaTurn]);

      setLatestFeedback({
        vibeScore: data.vibeScore || 85,
        feedback: data.vibeFeedback || 'Natural conversational tone!',
        howNativeWouldSay: data.howNativeWouldSay || '¡De una! Suena genial.',
        grammarFix: data.grammarCorrection,
      });

      if ((data.vibeScore || 85) >= 80) {
        playProceduralSound('vibe-sparkle', profile.soundEnabled);
      } else {
        playProceduralSound('success', profile.soundEnabled);
      }
    } catch (e) {
      console.error('Conversation turn error', e);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `p-${Date.now()}`,
          sender: 'persona',
          text: '¡Entendido! Me parece genial. ¿Y qué más me cuentas?',
          translation: 'Understood! Sounds great to me. And what else can you tell me?',
          timestamp: Date.now(),
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFinish = () => {
    playProceduralSound('level-up', profile.soundEnabled);
    onCompleteSession(30, selectedPersona.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            playProceduralSound('tap', profile.soundEnabled);
            onBack();
          }}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Hub</span>
        </button>

        <div className="flex items-center gap-2">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => {
                playProceduralSound('tap', profile.soundEnabled);
                setSelectedPersona(persona);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                selectedPersona.id === persona.id
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <span>{persona.avatar}</span>
              <span>{persona.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Chat on Left, Real-time Vibe Coaching on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Stream (2 cols on lg) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col h-[650px] shadow-2xl overflow-hidden">
          {/* Persona Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-xl">
                {selectedPersona.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-sm">
                    {selectedPersona.name}
                  </h3>
                  <span className="text-[11px] text-pink-400 font-mono">
                    ({selectedPersona.role})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{selectedPersona.setting}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
            >
              Finish & Claim XP
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isPersona = msg.sender === 'persona';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isPersona ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 space-y-1.5 shadow-md ${
                      isPersona
                        ? 'bg-slate-950/90 border border-slate-800/80 text-white rounded-tl-sm'
                        : 'bg-emerald-600/90 text-white rounded-tr-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-bold text-slate-400 font-mono">
                        {isPersona ? selectedPersona.name : 'You'}
                      </span>
                      {isPersona && (
                        <button
                          onClick={() => handlePlayAudio(msg.text)}
                          className="p-1 rounded text-slate-400 hover:text-white transition"
                          title="Listen to native voice"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-sm font-medium leading-relaxed">
                      {msg.text}
                    </p>

                    {msg.translation && (
                      <p className="text-xs text-slate-400 italic pt-0.5 border-t border-slate-800/50">
                        {msg.translation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2 italic">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-400" />
                <span>{selectedPersona.name} is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick reply hints */}
          <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
            <span className="shrink-0 text-slate-500 font-semibold">Suggested Vibe:</span>
            {selectedPersona.id === 'mateo-madrid' && (
              <>
                <button
                  onClick={() => handleSendMessage('¿Me pones un café con leche y una tostada, por favor?')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  "¿Me pones un café con leche...?"
                </button>
                <button
                  onClick={() => handleSendMessage('¿Qué café de especialidad me recomiendas hoy?')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  "¿Qué me recomiendas hoy?"
                </button>
              </>
            )}
            {selectedPersona.id === 'yuki-shibuya' && (
              <>
                <button
                  onClick={() => handleSendMessage('レトロなジャケットを探しています。おすすめありますか？')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  "ジャケットを探しています..."
                </button>
              </>
            )}
            {selectedPersona.id === 'luc-paris' && (
              <>
                <button
                  onClick={() => handleSendMessage('Je cherche un bon roman contemporain, tu me conseilles quoi ?')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  "Je cherche un bon roman..."
                </button>
              </>
            )}
            {selectedPersona.id === 'marco-napoli' && (
              <>
                <button
                  onClick={() => handleSendMessage('Ciao Marco! Mi piacerebbe provare la pizza margherita classica.')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  "Mi piacerebbe provare..."
                </button>
              </>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={handleToggleVoiceInput}
              className={`p-3 rounded-xl transition ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={isListening ? 'Listening... tap to stop' : 'Tap to speak via microphone'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Reply to ${selectedPersona.name} in ${profile.targetLanguage}...`}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isSending}
              className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Vibe Coaching & Native Feedback (Right col) */}
        <div className="space-y-4">
          {/* Persona Vibe Guide */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-pink-400">
              <Sparkles className="w-4 h-4" />
              <span>Persona Vibe Brief</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedPersona.vibeGuide}
            </p>
          </div>

          {/* Dynamic Turn Analysis */}
          {latestFeedback ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Turn Feedback
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Vibe Score:</span>
                  <span className={`font-mono text-sm font-bold ${
                    latestFeedback.vibeScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {latestFeedback.vibeScore}/100
                  </span>
                </div>
              </div>

              {/* Vibe Critique */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Naturalness & Tone
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {latestFeedback.feedback}
                </p>
              </div>

              {/* How a Native Would Say It */}
              {latestFeedback.howNativeWouldSay && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>How a Native Would Say It</span>
                  </div>
                  <p className="text-xs text-white font-medium italic">
                    "{latestFeedback.howNativeWouldSay}"
                  </p>
                </div>
              )}

              {/* Grammar Check */}
              {latestFeedback.grammarFix && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Gentle Grammar Note</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {latestFeedback.grammarFix}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center space-y-2">
              <Lightbulb className="w-6 h-6 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                Send a message to receive real-time vibe score, native colloquial alternatives, and grammar coaching.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
