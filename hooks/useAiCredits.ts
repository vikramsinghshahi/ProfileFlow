import { useState, useEffect } from 'react';

const FREE_CREDITS = 3;
const STORAGE_KEY = 'profileflow_ai_credits_used';

export function useAiCredits(isPaidUser: boolean = false) {
  const [creditsUsed, setCreditsUsed] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    setCreditsUsed(stored);
  }, []);

  const canUseAI = isPaidUser || creditsUsed < FREE_CREDITS;
  const creditsLeft = isPaidUser ? Infinity : Math.max(0, FREE_CREDITS - creditsUsed);

  const consumeCredit = (): boolean => {
    if (isPaidUser) return true;
    if (creditsUsed >= FREE_CREDITS) return false;
    const next = creditsUsed + 1;
    setCreditsUsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    return true;
  };

  return { canUseAI, creditsLeft, consumeCredit, isUnlimited: isPaidUser };
}
