import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateBios, type BioTone } from '../../services/ai';
import { useAiCredits } from '../../hooks/useAiCredits';

interface Props {
  isPaidUser?: boolean;
  onSelectBio: (bio: string) => void;
  onUpgradeClick?: () => void;
}

const TONES: { value: BioTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'bold', label: 'Bold' },
  { value: 'funny', label: 'Funny' },
  { value: 'minimal', label: 'Minimal' },
];

const AiBioWriter: React.FC<Props> = ({ isPaidUser = false, onSelectBio, onUpgradeClick }) => {
  const [profession, setProfession] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState<BioTone>('professional');
  const [bios, setBios] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { canUseAI, creditsLeft, consumeCredit } = useAiCredits(isPaidUser);

  const handleGenerate = async () => {
    if (!profession.trim()) {
      toast.error('Enter your profession first');
      return;
    }
    if (!canUseAI) {
      onUpgradeClick?.();
      return;
    }
    if (!consumeCredit()) {
      onUpgradeClick?.();
      return;
    }

    setLoading(true);
    setBios([]);
    try {
      const results = await generateBios({ profession, keywords, tone });
      setBios(results);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI unavailable';
      toast.error(msg.includes('VITE_CLAUDE_API_KEY') ? 'Add VITE_CLAUDE_API_KEY to .env.local' : 'AI busy — try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-violet-500" />
          <h3 className="text-sm font-bold text-gray-800">AI Bio Writer</h3>
        </div>
        <span className="text-[10px] text-violet-600 font-medium">
          {isPaidUser ? 'Unlimited' : `${creditsLeft} free use${creditsLeft !== 1 ? 's' : ''} left`}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Your profession *
          </label>
          <input
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder="Fitness coach, Graphic designer, Home baker…"
            className="w-full text-xs border border-gray-200 bg-white rounded-xl px-3 py-2 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            USP / Keywords
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Mumbai, online courses, 500+ students…"
            className="w-full text-xs border border-gray-200 bg-white rounded-xl px-3 py-2 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Tone
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                className={`text-[10px] px-2.5 py-1 rounded-full border font-medium transition-colors ${
                  tone === t.value
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-violet-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !canUseAI}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Writing bios…
            </>
          ) : canUseAI ? (
            <>
              <Sparkles size={13} />
              Generate 5 Bios
            </>
          ) : (
            '🔒 Upgrade to use AI'
          )}
        </button>
      </div>

      {bios.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Click to apply →
          </p>
          {bios.map((bio, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onSelectBio(bio);
                toast.success('Bio applied!');
              }}
              className="w-full text-left text-xs text-gray-700 bg-white border border-gray-200 rounded-xl p-3 hover:border-violet-400 hover:bg-violet-50 transition-all leading-relaxed"
            >
              {bio}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiBioWriter;
