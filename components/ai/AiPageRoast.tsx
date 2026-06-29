import React, { useState } from 'react';
import { Flame, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { roastPage, type RoastResult } from '../../services/ai';
import { useAiCredits } from '../../hooks/useAiCredits';

interface Props {
  bio: string;
  blockTypes: string[];
  totalBlocks: number;
  isPaidUser?: boolean;
  onUpgradeClick?: () => void;
}

const AiPageRoast: React.FC<Props> = ({
  bio,
  blockTypes,
  totalBlocks,
  isPaidUser = false,
  onUpgradeClick,
}) => {
  const [result, setResult] = useState<RoastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { canUseAI, creditsLeft, consumeCredit } = useAiCredits(isPaidUser);

  const handleRoast = async () => {
    if (!canUseAI) { onUpgradeClick?.(); return; }
    if (!consumeCredit()) { onUpgradeClick?.(); return; }
    setLoading(true);
    setResult(null);
    try {
      const data = await roastPage({ bio, blockTypes, totalBlocks });
      setResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      toast.error(msg.includes('VITE_CLAUDE_API_KEY') ? 'Add VITE_CLAUDE_API_KEY to .env.local' : 'Could not analyse page — try again');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.score >= 8 ? 'text-green-600' : result.score >= 5 ? 'text-amber-600' : 'text-red-600'
    : '';

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 border border-red-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-red-500" />
          <h3 className="text-sm font-bold text-gray-800">AI Page Roast</h3>
        </div>
        <span className="text-[10px] text-red-600 font-medium">
          {isPaidUser ? 'Unlimited' : `${creditsLeft} free use${creditsLeft !== 1 ? 's' : ''} left`}
        </span>
      </div>

      <p className="text-[11px] text-gray-500 leading-relaxed">
        Get brutally honest AI feedback on your current page — score, problems, and how to fix them.
      </p>

      <button
        type="button"
        onClick={handleRoast}
        disabled={loading || !canUseAI}
        className="w-full flex items-center justify-center gap-2 bg-red-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            Analysing page…
          </>
        ) : canUseAI ? (
          <>
            <Flame size={13} />
            Roast My Page
          </>
        ) : (
          '🔒 Upgrade to use AI'
        )}
      </button>

      {result && (
        <div className="space-y-3">
          <div className="text-center py-2">
            <span className={`text-4xl font-black ${scoreColor}`}>{result.score}</span>
            <span className="text-gray-400 text-xl font-bold">/10</span>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">❌ Problems</p>
            {result.issues.map((issue, i) => (
              <div key={i} className="text-xs text-gray-700 bg-red-100 rounded-xl px-3 py-2 leading-snug">
                {issue}
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">✅ How to fix</p>
            {result.fixes.map((fix, i) => (
              <div key={i} className="text-xs text-gray-700 bg-green-100 rounded-xl px-3 py-2 leading-snug">
                {fix}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiPageRoast;
