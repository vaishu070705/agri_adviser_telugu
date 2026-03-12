import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const botResponses: Record<string, string> = {
  'crop': 'For crop recommendations, go to the Crop Recommendation tab and enter your soil nutrients, weather conditions, and season. The AI will suggest the best crop for your region.\n\nపంట సిఫార్సుల కోసం, పంట సిఫార్సు ట్యాబ్‌కి వెళ్లి మీ నేల పోషకాలు, వాతావరణ పరిస్థితులు మరియు సీజన్‌ను నమోదు చేయండి.',
  'disease': 'Upload a clear image of the affected crop leaf in the Disease Detection tab. Ensure good lighting and focus for accurate results.\n\nవ్యాధి గుర్తింపు ట్యాబ్‌లో ప్రభావిత పంట ఆకు యొక్క స్పష్టమైన చిత్రాన్ని అప్‌లోడ్ చేయండి.',
  'fertilizer': 'Check the Fertilizer Advisor tab for personalized fertilizer recommendations based on your soil nutrients and crop type.\n\nఎరువుల సలహాదారు ట్యాబ్‌లో మీ నేల పోషకాలు ఆధారంగా వ్యక్తిగతీకరించిన ఎరువుల సిఫార్సులను చూడండి.',
  'weather': 'Current weather data is used in crop recommendations. Enter temperature, humidity, and rainfall in the Crop Recommendation section.\n\nపంట సిఫార్సులలో ప్రస్తుత వాతావరణ డేటా ఉపయోగించబడుతుంది.',
  'price': 'Check the Farm Economics tab to estimate revenue based on current MSP (Minimum Support Price) rates.\n\nప్రస్తుత MSP రేట్ల ఆధారంగా ఆదాయాన్ని అంచనా వేయడానికి వ్యవసాయ ఆర్థికశాస్త్రం ట్యాబ్‌ను చూడండి.',
  'worker': 'Visit the Workers tab to find available farm workers in your area. You can contact them directly.\n\nమీ ప్రాంతంలో అందుబాటులో ఉన్న వ్యవసాయ కార్మికులను కనుగొనడానికి కార్మికులు ట్యాబ్‌ను సందర్శించండి.',
  'help': 'I can help with:\n• Crop recommendations\n• Disease detection\n• Fertilizer advice\n• Yield prediction\n• Farm economics\n• Finding workers\n\nJust type your question!\n\nనేను సహాయం చేయగలను:\n• పంట సిఫార్సులు\n• వ్యాధి గుర్తింపు\n• ఎరువుల సలహా\n• దిగుబడి అంచనా',
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response;
  }
  return 'I can help you with crop recommendations, disease detection, fertilizer advice, yield prediction, and more. Try asking about any of these topics!\n\nనేను పంట సిఫార్సులు, వ్యాధి గుర్తింపు, ఎరువుల సలహా, దిగుబడి అంచనా మరియు మరిన్నింటిలో మీకు సహాయం చేయగలను. ఈ అంశాలలో ఏదైనా గురించి అడగండి!';
}

export default function ChatBot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: t('chat.welcome') }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input };
    const botMsg: Message = { role: 'bot', text: getBotResponse(input) };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center animate-pulse-glow hover:scale-105 transition-transform"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-card border border-border rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="bg-primary text-primary-foreground px-4 py-3 font-semibold text-sm">
            🌾 {t('chat.title')}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-lg text-xs whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={t('chat.placeholder')}
              className="flex-1 px-3 py-2 rounded border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button onClick={send} className="p-2 rounded bg-primary text-primary-foreground hover:opacity-90">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
