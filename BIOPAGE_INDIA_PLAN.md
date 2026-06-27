# BioPage India — Complete Build Plan
> Fork of openbento (MIT License) → Indianised + AI-powered + Monetised
> Hand this file to Claude Code in VS Code and say: "Execute this plan sprint by sprint"

---

## Project Overview

**What we are building:** A hosted link-in-bio SaaS for Indian creators, coaches, and small businesses. Built on top of the open-source `openbento` project (MIT licensed). We add Indian payment blocks, AI features powered by Claude API, user auth, hosted pages, and Razorpay billing.

**Live URL target:** `biopage.in` (or `linkbento.in`)
**Stack:** React + Vite + TypeScript + Tailwind + Supabase + Claude API + Razorpay
**Timeline:** 4 sprints over 2 weekends

---

## Environment Variables Needed

Create a `.env.local` file in the project root with these values before starting:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic Claude API
VITE_CLAUDE_API_KEY=your_claude_api_key

# Razorpay
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# App
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=BioPage India
```

---

## Sprint 0 — Setup (30 minutes)

### Step 0.1 — Clone and run openbento

```bash
git clone https://github.com/yoanbernabeu/openbento.git biopage-india
cd biopage-india
npm install
npm run dev
```

Verify it runs on `http://localhost:5173` — you should see the drag-and-drop editor.

### Step 0.2 — Install additional dependencies

```bash
npm install @supabase/supabase-js
npm install qrcode
npm install @types/qrcode --save-dev
npm install razorpay
npm install react-router-dom
npm install @anthropic-ai/sdk
npm install react-hot-toast
npm install zustand
```

### Step 0.3 — Rename branding

Find and replace across entire project:
- `OpenBento` → `BioPage India`
- `openbento` → `biopage-india`
- `bento` (in UI text only, not variable names) → `page`

Update `package.json`:
```json
{
  "name": "biopage-india",
  "version": "1.0.0"
}
```

Update `index.html`:
```html
<title>BioPage India — Link in Bio for Indian Creators</title>
<meta name="description" content="Create your beautiful bio page in minutes. UPI payments, WhatsApp chat, AI bio writer. Made for Indian creators.">
```

---

## Sprint 1 — Indian Block Types (Saturday Morning, 4 hours)

### Goal
Add 3 India-specific blocks that do not exist in openbento: UPI Payment, WhatsApp Chat, and Razorpay Pay Button. These are the core differentiators from Linktree.

---

### Step 1.1 — Add UPI Payment Block

**File to create:** `src/components/blocks/UpiBlock.tsx`

```typescript
import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface UpiBlockProps {
  upiId: string
  name: string
  amount?: string
  note?: string
  backgroundColor?: string
}

export const UpiBlock: React.FC<UpiBlockProps> = ({
  upiId,
  name,
  amount,
  note,
  backgroundColor = '#f0fdf4'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !upiId) return

    // Build UPI deep link
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}${amount ? `&am=${amount}` : ''}&cu=INR${note ? `&tn=${encodeURIComponent(note)}` : ''}`

    QRCode.toCanvas(canvasRef.current, upiUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff'
      }
    })
  }, [upiId, name, amount, note])

  const handlePay = () => {
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}${amount ? `&am=${amount}` : ''}&cu=INR${note ? `&tn=${encodeURIComponent(note)}` : ''}`
    window.open(upiUrl, '_blank')
  }

  return (
    <div
      className="flex flex-col items-center justify-center p-4 rounded-xl h-full gap-3"
      style={{ backgroundColor }}
    >
      <p className="text-sm font-medium text-gray-700">Pay via UPI</p>
      <canvas ref={canvasRef} className="rounded-lg" />
      <p className="text-xs text-gray-500 font-mono">{upiId}</p>
      {amount && (
        <p className="text-lg font-bold text-green-700">₹{amount}</p>
      )}
      <button
        onClick={handlePay}
        className="w-full bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
      >
        Pay Now →
      </button>
      {note && (
        <p className="text-xs text-gray-400 text-center">{note}</p>
      )}
    </div>
  )
}
```

---

### Step 1.2 — Add WhatsApp Chat Block

**File to create:** `src/components/blocks/WhatsappBlock.tsx`

```typescript
import React from 'react'

interface WhatsappBlockProps {
  phone: string
  message?: string
  label?: string
  backgroundColor?: string
}

export const WhatsappBlock: React.FC<WhatsappBlockProps> = ({
  phone,
  message = 'Hi! I found you on BioPage.',
  label = 'Chat on WhatsApp',
  backgroundColor = '#dcfce7'
}) => {
  // Strip all non-digits, add 91 if not present
  const cleanPhone = phone.replace(/\D/g, '')
  const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
  const waUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center h-full p-4 rounded-xl gap-3 hover:opacity-90 transition-opacity"
      style={{ backgroundColor }}
    >
      {/* WhatsApp SVG icon */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#25D366"/>
        <path d="M20 10C14.477 10 10 14.477 10 20c0 1.99.58 3.84 1.58 5.4L10 30l4.73-1.55A9.96 9.96 0 0020 30c5.523 0 10-4.477 10-10S25.523 10 20 10zm4.9 13.6c-.2.56-1.18 1.08-1.62 1.14-.44.06-.86.28-2.9-.6-2.44-1.04-4-3.56-4.12-3.72-.12-.16-.96-1.28-.96-2.44 0-1.16.6-1.72.82-1.96.2-.24.44-.3.58-.3h.42c.14 0 .32-.04.5.38.2.46.66 1.6.72 1.72.06.12.1.28.02.44-.08.16-.12.26-.24.4-.12.14-.26.32-.36.42-.12.12-.26.26-.12.5.14.24.62 1.02 1.34 1.66.92.82 1.7 1.08 1.94 1.2.24.12.38.1.52-.04.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.14z" fill="white"/>
      </svg>
      <span className="text-sm font-medium text-green-800">{label}</span>
      <span className="text-xs text-green-600">{phone}</span>
    </a>
  )
}
```

---

### Step 1.3 — Add Razorpay Pay Button Block

**File to create:** `src/components/blocks/RazorpayBlock.tsx`

```typescript
import React from 'react'

interface RazorpayBlockProps {
  paymentLink: string
  label?: string
  amount?: string
  description?: string
  backgroundColor?: string
}

export const RazorpayBlock: React.FC<RazorpayBlockProps> = ({
  paymentLink,
  label = 'Pay / Buy Now',
  amount,
  description,
  backgroundColor = '#fef3c7'
}) => {
  return (
    <a
      href={paymentLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center h-full p-4 rounded-xl gap-2 hover:opacity-90 transition-opacity"
      style={{ backgroundColor }}
    >
      <div className="text-2xl">💳</div>
      {amount && (
        <p className="text-xl font-bold text-amber-800">₹{amount}</p>
      )}
      <p className="text-sm font-medium text-amber-900 text-center">{label}</p>
      {description && (
        <p className="text-xs text-amber-700 text-center">{description}</p>
      )}
      <div className="bg-amber-600 text-white text-xs font-medium py-1.5 px-4 rounded-full mt-1">
        Pay via Razorpay →
      </div>
    </a>
  )
}
```

---

### Step 1.4 — Register new block types

Find the file that defines block types (likely `src/types/bento.ts` or similar). Add the new types:

```typescript
// Add to existing BlockType enum/union
export type BlockType =
  | 'link'
  | 'media'
  | 'youtube'
  | 'text'
  | 'social'
  | 'map'
  | 'spacer'
  | 'upi'        // NEW
  | 'whatsapp'   // NEW
  | 'razorpay'   // NEW
```

Find the block renderer (likely `src/components/BentoBlock.tsx` or similar) and add cases:

```typescript
import { UpiBlock } from './blocks/UpiBlock'
import { WhatsappBlock } from './blocks/WhatsappBlock'
import { RazorpayBlock } from './blocks/RazorpayBlock'

// Inside the switch/if-else that renders blocks:
case 'upi':
  return <UpiBlock {...block.data} />
case 'whatsapp':
  return <WhatsappBlock {...block.data} />
case 'razorpay':
  return <RazorpayBlock {...block.data} />
```

---

### Step 1.5 — Add new blocks to the block picker UI

Find the block picker/toolbar component (where user clicks to add a new block). Add three new buttons in an "India" section:

```typescript
const INDIA_BLOCKS = [
  {
    type: 'upi',
    label: 'UPI Payment',
    icon: '₹',
    description: 'Accept UPI payments with QR code',
    defaultData: {
      upiId: 'yourname@upi',
      name: 'Your Name',
      backgroundColor: '#f0fdf4'
    }
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp Chat',
    icon: '💬',
    description: 'Let visitors chat with you directly',
    defaultData: {
      phone: '9999999999',
      message: 'Hi! I found you on your bio page.',
      label: 'Chat on WhatsApp',
      backgroundColor: '#dcfce7'
    }
  },
  {
    type: 'razorpay',
    label: 'Razorpay Pay',
    icon: '💳',
    description: 'Add a payment button for products',
    defaultData: {
      paymentLink: 'https://rzp.io/l/yourlink',
      label: 'Buy Now',
      backgroundColor: '#fef3c7'
    }
  }
]
```

---

## Sprint 2 — AI Features (Saturday Afternoon, 4 hours)

### Goal
Add Claude API powered AI features. These are the features behind the paywall. Free users get 3 total uses. Paid users get unlimited.

---

### Step 2.1 — Create AI service

**File to create:** `src/services/ai.ts`

```typescript
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'

async function callClaude(prompt: string, systemPrompt: string): Promise<string> {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  if (!response.ok) throw new Error('AI service error')
  const data = await response.json()
  return data.content[0].text
}

// ── AI Feature 1: Bio Writer ──────────────────────────────────────────────────

export async function generateBios(input: {
  profession: string
  keywords: string
  tone: 'professional' | 'casual' | 'funny' | 'bold' | 'minimal'
}): Promise<string[]> {
  const system = `You are a professional bio writer for Indian creators, coaches, and entrepreneurs. 
You write short, punchy bio page descriptions (2-3 lines max each).
You understand Indian context — festivals, family values, regional pride, cricket, Bollywood.
Always write in English but make it feel warm and Indian.
Return ONLY a JSON array of 5 bio strings. No explanation, no markdown.`

  const prompt = `Write 5 different bios for this person:
Profession: ${input.profession}
Keywords/USP: ${input.keywords}
Preferred tone: ${input.tone}

Each bio should be 2-3 lines. Make them distinct from each other.
Return as JSON array: ["bio1", "bio2", "bio3", "bio4", "bio5"]`

  const result = await callClaude(prompt, system)
  try {
    const cleaned = result.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return [result]
  }
}

// ── AI Feature 2: Page Roast ──────────────────────────────────────────────────

export async function roastPage(pageData: {
  bio: string
  blocks: Array<{ type: string; label?: string }>
  totalBlocks: number
}): Promise<{ score: number; issues: string[]; fixes: string[] }> {
  const system = `You are a brutally honest but helpful bio page consultant for Indian creators.
You review link-in-bio pages and give specific, actionable feedback.
Be direct. No fluff. Point out real problems.
Return ONLY valid JSON. No explanation outside the JSON.`

  const prompt = `Review this bio page:
Bio text: "${pageData.bio}"
Number of blocks: ${pageData.totalBlocks}
Block types: ${pageData.blocks.map(b => b.type).join(', ')}

Give a score out of 10 and list 3 specific problems and 3 specific fixes.
Return as JSON: { "score": 7, "issues": ["issue1", "issue2", "issue3"], "fixes": ["fix1", "fix2", "fix3"] }`

  const result = await callClaude(prompt, system)
  try {
    const cleaned = result.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return { score: 5, issues: ['Could not analyse page'], fixes: ['Try again'] }
  }
}

// ── AI Feature 3: Headline Generator ─────────────────────────────────────────

export async function generateHeadlines(input: {
  profession: string
  audience: string
}): Promise<string[]> {
  const system = `You generate catchy one-liner headlines for Indian creator bio pages.
Headlines should be 5-10 words. Punchy. Memorable. Use active voice.
Return ONLY a JSON array of 10 headline strings.`

  const prompt = `Generate 10 catchy one-line headlines for:
Profession: ${input.profession}
Target audience: ${input.audience}

Return as JSON array: ["headline1", "headline2", ...]`

  const result = await callClaude(prompt, system)
  try {
    const cleaned = result.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return ['Your page headline here']
  }
}

// ── AI Feature 4: Link Title Writer ──────────────────────────────────────────

export async function generateLinkTitle(url: string): Promise<string> {
  const system = `You write short, catchy link titles for bio pages.
5-7 words max. Add one relevant emoji at the start.
Return ONLY the title string. Nothing else.`

  const prompt = `Write a catchy link title for this URL: ${url}
If you cannot access the URL, make a good guess from the URL itself.
Example output: "📱 Free Workout Plan PDF"`

  return await callClaude(prompt, system)
}

// ── AI Feature 5: Weekly Insights Writer ─────────────────────────────────────

export async function generateWeeklyInsight(stats: {
  pageViews: number
  topLink: string
  topLinkClicks: number
  upiTaps: number
  whatsappClicks: number
}): Promise<string> {
  const system = `You write short, friendly weekly performance summaries for Indian creators.
3-4 sentences. Positive but honest. Give one specific actionable tip.
Write like a friendly business advisor texting them on WhatsApp.`

  const prompt = `Write a weekly summary for this creator's bio page:
Page views this week: ${stats.pageViews}
Most clicked link: "${stats.topLink}" with ${stats.topLinkClicks} clicks
UPI payment button taps: ${stats.upiTaps}
WhatsApp button clicks: ${stats.whatsappClicks}

Give them a 3-4 sentence summary and one specific tip to improve next week.`

  return await callClaude(prompt, system)
}
```

---

### Step 2.2 — Create AI usage tracker (free tier gate)

**File to create:** `src/hooks/useAiCredits.ts`

```typescript
import { useState, useEffect } from 'react'

const FREE_CREDITS = 3
const STORAGE_KEY = 'biopage_ai_credits_used'

export function useAiCredits(isPaidUser: boolean) {
  const [creditsUsed, setCreditsUsed] = useState(0)

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) || '0')
    setCreditsUsed(stored)
  }, [])

  const canUseAI = isPaidUser || creditsUsed < FREE_CREDITS
  const creditsLeft = isPaidUser ? Infinity : Math.max(0, FREE_CREDITS - creditsUsed)

  const useCredit = () => {
    if (isPaidUser) return true
    if (creditsUsed >= FREE_CREDITS) return false
    const newCount = creditsUsed + 1
    setCreditsUsed(newCount)
    localStorage.setItem(STORAGE_KEY, newCount.toString())
    return true
  }

  return { canUseAI, creditsLeft, useCredit, isUnlimited: isPaidUser }
}
```

---

### Step 2.3 — Create AI Bio Writer UI Component

**File to create:** `src/components/ai/AiBioWriter.tsx`

```typescript
import React, { useState } from 'react'
import { generateBios } from '../../services/ai'
import { useAiCredits } from '../../hooks/useAiCredits'
import toast from 'react-hot-toast'

interface AiBioWriterProps {
  isPaidUser: boolean
  onSelectBio: (bio: string) => void
  onUpgradeClick: () => void
}

export const AiBioWriter: React.FC<AiBioWriterProps> = ({
  isPaidUser,
  onSelectBio,
  onUpgradeClick
}) => {
  const [profession, setProfession] = useState('')
  const [keywords, setKeywords] = useState('')
  const [tone, setTone] = useState<'professional' | 'casual' | 'funny' | 'bold' | 'minimal'>('professional')
  const [bios, setBios] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { canUseAI, creditsLeft, useCredit } = useAiCredits(isPaidUser)

  const handleGenerate = async () => {
    if (!profession.trim()) {
      toast.error('Please enter your profession')
      return
    }

    if (!canUseAI) {
      onUpgradeClick()
      return
    }

    if (!useCredit()) {
      onUpgradeClick()
      return
    }

    setLoading(true)
    try {
      const results = await generateBios({ profession, keywords, tone })
      setBios(results)
      toast.success('5 bios generated!')
    } catch {
      toast.error('AI is busy — try again in a moment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            ✨ AI Bio Writer
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {isPaidUser ? 'Unlimited uses' : `${creditsLeft} free ${creditsLeft === 1 ? 'use' : 'uses'} left`}
          </p>
        </div>
        {!isPaidUser && creditsLeft === 0 && (
          <button
            onClick={onUpgradeClick}
            className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-full font-medium"
          >
            Upgrade ₹99/mo
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">
            Your profession *
          </label>
          <input
            type="text"
            value={profession}
            onChange={e => setProfession(e.target.value)}
            placeholder="e.g. Fitness coach, Graphic designer, Home baker"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">
            Your USP / keywords
          </label>
          <input
            type="text"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder="e.g. Mumbai, women's fitness, 10kg in 3 months"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Tone</label>
          <div className="flex gap-2 flex-wrap">
            {(['professional', 'casual', 'funny', 'bold', 'minimal'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  tone === t
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'border-gray-200 text-gray-600 hover:border-purple-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || (!canUseAI)}
          className="w-full bg-purple-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '✨ Writing...' : canUseAI ? '✨ Generate 5 Bios' : '🔒 Upgrade to Use'}
        </button>
      </div>

      {bios.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-gray-600">Click to use →</p>
          {bios.map((bio, i) => (
            <button
              key={i}
              onClick={() => {
                onSelectBio(bio)
                toast.success('Bio added to your page!')
              }}
              className="w-full text-left text-sm text-gray-700 bg-white border border-gray-200 rounded-xl p-3 hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              {bio}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

### Step 2.4 — Create AI Page Roast UI Component

**File to create:** `src/components/ai/AiPageRoast.tsx`

```typescript
import React, { useState } from 'react'
import { roastPage } from '../../services/ai'
import { useAiCredits } from '../../hooks/useAiCredits'
import toast from 'react-hot-toast'

interface AiPageRoastProps {
  pageData: { bio: string; blocks: Array<{ type: string }>; totalBlocks: number }
  isPaidUser: boolean
  onUpgradeClick: () => void
}

export const AiPageRoast: React.FC<AiPageRoastProps> = ({
  pageData,
  isPaidUser,
  onUpgradeClick
}) => {
  const [result, setResult] = useState<{ score: number; issues: string[]; fixes: string[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const { canUseAI, creditsLeft, useCredit } = useAiCredits(isPaidUser)

  const handleRoast = async () => {
    if (!canUseAI) { onUpgradeClick(); return }
    if (!useCredit()) { onUpgradeClick(); return }
    setLoading(true)
    try {
      const data = await roastPage(pageData)
      setResult(data)
    } catch {
      toast.error('Could not analyse page — try again')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = result
    ? result.score >= 8 ? 'text-green-600' : result.score >= 5 ? 'text-amber-600' : 'text-red-600'
    : ''

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 border border-red-200">
      <h3 className="font-semibold text-gray-800 mb-1">🔥 AI Page Roast</h3>
      <p className="text-xs text-gray-500 mb-4">
        Get brutally honest feedback on your page
        {!isPaidUser && ` · ${creditsLeft} uses left`}
      </p>

      <button
        onClick={handleRoast}
        disabled={loading || !canUseAI}
        className="w-full bg-red-500 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '🔍 Analysing...' : canUseAI ? '🔥 Roast My Page' : '🔒 Upgrade to Roast'}
      </button>

      {result && (
        <div className="mt-4 space-y-3">
          <div className="text-center">
            <span className={`text-4xl font-bold ${scoreColor}`}>{result.score}</span>
            <span className="text-gray-400 text-lg">/10</span>
          </div>

          <div>
            <p className="text-xs font-semibold text-red-700 mb-2">❌ Problems found</p>
            <ul className="space-y-1">
              {result.issues.map((issue, i) => (
                <li key={i} className="text-xs text-gray-700 bg-red-100 rounded-lg px-3 py-2">
                  {issue}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-green-700 mb-2">✅ How to fix</p>
            <ul className="space-y-1">
              {result.fixes.map((fix, i) => (
                <li key={i} className="text-xs text-gray-700 bg-green-100 rounded-lg px-3 py-2">
                  {fix}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## Sprint 3 — Auth + Hosting + Payments (Sunday Morning, 4 hours)

### Goal
Add Supabase auth so users can save their pages. Add Razorpay subscription billing. Host pages at `biopage.in/username`.

---

### Step 3.1 — Supabase setup

**Create these tables in Supabase SQL editor:**

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'creator', 'pro')),
  plan_expires_at TIMESTAMPTZ,
  razorpay_subscription_id TEXT,
  ai_credits_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pages table
CREATE TABLE public.pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  page_slug TEXT NOT NULL DEFAULT 'main',
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme JSONB DEFAULT '{}',
  blocks JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, page_slug)
);

-- Analytics table
CREATE TABLE public.page_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'link_click', 'upi_tap', 'whatsapp_click')),
  block_id TEXT,
  referrer TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view published pages" ON public.pages FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Users can manage own pages" ON public.pages FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert analytics" ON public.page_analytics FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can view own analytics" ON public.page_analytics FOR SELECT
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    LOWER(SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### Step 3.2 — Supabase client

**File to create:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export type Plan = 'free' | 'creator' | 'pro'

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}

export async function savePage(pageData: {
  userId: string
  username: string
  pageSlug?: string
  title?: string
  bio?: string
  avatarUrl?: string
  theme?: object
  blocks: object[]
}) {
  const { data, error } = await supabase
    .from('pages')
    .upsert({
      user_id: pageData.userId,
      username: pageData.username,
      page_slug: pageData.pageSlug || 'main',
      title: pageData.title,
      bio: pageData.bio,
      avatar_url: pageData.avatarUrl,
      theme: pageData.theme || {},
      blocks: pageData.blocks,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,page_slug' })
    .select()
    .single()

  return { data, error }
}

export async function getPageByUsername(username: string, slug = 'main') {
  const { data, error } = await supabase
    .from('pages')
    .select('*, profiles(*)')
    .eq('username', username)
    .eq('page_slug', slug)
    .eq('is_published', true)
    .single()

  return { data, error }
}

export async function trackAnalytics(event: {
  pageId: string
  eventType: 'view' | 'link_click' | 'upi_tap' | 'whatsapp_click'
  blockId?: string
  referrer?: string
}) {
  await supabase.from('page_analytics').insert({
    page_id: event.pageId,
    event_type: event.eventType,
    block_id: event.blockId,
    referrer: event.referrer || document.referrer,
    created_at: new Date().toISOString()
  })
}
```

---

### Step 3.3 — Add React Router for public pages

**Update `src/main.tsx`:**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { App } from './App'
import { PublicPage } from './pages/PublicPage'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { PricingPage } from './pages/PricingPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/:username" element={<PublicPage />} />
        <Route path="/:username/:slug" element={<PublicPage />} />
      </Routes>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  </React.StrictMode>
)
```

---

### Step 3.4 — Public page renderer

**File to create:** `src/pages/PublicPage.tsx`

```typescript
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPageByUsername, trackAnalytics } from '../lib/supabase'
import { UpiBlock } from '../components/blocks/UpiBlock'
import { WhatsappBlock } from '../components/blocks/WhatsappBlock'
import { RazorpayBlock } from '../components/blocks/RazorpayBlock'

export const PublicPage: React.FC = () => {
  const { username, slug } = useParams<{ username: string; slug?: string }>()
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      if (!username) return
      const { data, error } = await getPageByUsername(username, slug || 'main')
      if (error || !data) {
        setNotFound(true)
      } else {
        setPage(data)
        // Track page view
        trackAnalytics({ pageId: data.id, eventType: 'view' })
      }
      setLoading(false)
    }
    load()
  }, [username, slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-700">Page not found</h1>
      <a href="/" className="text-purple-600 underline">Create your own BioPage →</a>
    </div>
  )

  const isPaidUser = page.profiles?.plan !== 'free'

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">

        {/* Profile header */}
        {page.avatar_url && (
          <div className="text-center mb-6">
            <img
              src={page.avatar_url}
              alt={page.title || username}
              className="w-24 h-24 rounded-full mx-auto mb-3 object-cover ring-4 ring-white shadow-lg"
            />
            {page.title && (
              <h1 className="text-xl font-bold text-gray-900">{page.title}</h1>
            )}
            {page.bio && (
              <p className="text-sm text-gray-600 mt-2 max-w-xs mx-auto">{page.bio}</p>
            )}
          </div>
        )}

        {/* Bento grid */}
        <div className="grid grid-cols-2 gap-3">
          {(page.blocks || []).map((block: any) => (
            <div
              key={block.id}
              className={`rounded-2xl overflow-hidden shadow-sm ${
                block.size === 'wide' ? 'col-span-2' : ''
              }`}
              style={{ minHeight: '120px' }}
            >
              {renderBlock(block, page.id)}
            </div>
          ))}
        </div>

        {/* Footer */}
        {!isPaidUser && (
          <div className="text-center mt-8">
            <a href="/" className="text-xs text-gray-400 hover:text-purple-500">
              Made with BioPage India ✨
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function renderBlock(block: any, pageId: string) {
  const track = (type: string) =>
    trackAnalytics({ pageId, eventType: type as any, blockId: block.id })

  switch (block.type) {
    case 'upi':
      return <div onClick={() => track('upi_tap')}><UpiBlock {...block.data} /></div>
    case 'whatsapp':
      return <div onClick={() => track('whatsapp_click')}><WhatsappBlock {...block.data} /></div>
    case 'razorpay':
      return <RazorpayBlock {...block.data} />
    case 'link':
      return (
        <a
          href={block.data.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('link_click')}
          className="flex items-center justify-between h-full p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-800">{block.data.title}</span>
          <span className="text-gray-400">→</span>
        </a>
      )
    default:
      return null
  }
}
```

---

### Step 3.5 — Razorpay subscription integration

**File to create:** `src/services/payments.ts`

```typescript
declare global {
  interface Window { Razorpay: any }
}

const PLANS = {
  creator: {
    name: 'Creator Plan',
    amount: 9900, // paise (₹99)
    description: 'Unlimited AI, custom domain, analytics'
  },
  pro: {
    name: 'Pro Plan',
    amount: 29900, // paise (₹299)
    description: 'Everything in Creator + A/B testing, team access'
  }
}

export async function initiatePayment(
  plan: 'creator' | 'pro',
  user: { id: string; email: string; name: string },
  onSuccess: (paymentId: string) => void,
  onFailure: () => void
) {
  // Load Razorpay script dynamically
  if (!window.Razorpay) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve()
      script.onerror = () => reject()
      document.head.appendChild(script)
    })
  }

  const planData = PLANS[plan]

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: planData.amount,
    currency: 'INR',
    name: 'BioPage India',
    description: planData.description,
    prefill: {
      email: user.email,
      name: user.name
    },
    theme: { color: '#7c3aed' },
    handler: (response: any) => {
      onSuccess(response.razorpay_payment_id)
    },
    modal: {
      ondismiss: onFailure
    }
  }

  const razorpay = new window.Razorpay(options)
  razorpay.open()
}
```

---

## Sprint 4 — Landing Page + Polish + Deploy (Sunday Afternoon, 3 hours)

### Step 4.1 — Landing page

**File to create:** `src/pages/LandingPage.tsx`

The landing page must show:
1. Hero — "Your bio page. Built for India." with demo GIF or screenshot
2. Three demo pages — fitness coach, home baker, freelancer
3. Feature highlights — UPI block, WhatsApp block, AI bio writer
4. Pricing table — Free / Creator ₹99/mo / Pro ₹299/mo
5. FAQ — 5 common questions
6. CTA — "Start free — no credit card needed"

Use Tailwind. Keep it one page. Mobile-first (most visitors will be on phone).

---

### Step 4.2 — Vercel deployment config

**Create `vercel.json` in project root:**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

### Step 4.3 — Deploy commands

```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
npm run build
vercel --prod

# Or connect GitHub repo for auto-deploy
# Push to main → Vercel auto-deploys

# Set environment variables in Vercel dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
# VITE_CLAUDE_API_KEY
# VITE_RAZORPAY_KEY_ID
# VITE_APP_URL (set to your domain)
```

---

### Step 4.4 — Custom domain

```bash
# In Vercel dashboard:
# Project → Settings → Domains → Add → biopage.in
# Point your domain DNS to Vercel nameservers
# SSL auto-configured in < 5 minutes
```

---

## Post-launch — Week 2 features (add after first 50 users)

### Feature: Per-link analytics dashboard

Show user:
- Total page views (last 7 days, 30 days)
- Clicks per link block
- UPI button taps
- WhatsApp clicks
- Top referrers

Query to add in Supabase:

```sql
-- Get analytics summary for a page
SELECT
  event_type,
  block_id,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as day
FROM page_analytics
WHERE page_id = $1
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY event_type, block_id, day
ORDER BY day DESC;
```

---

### Feature: WhatsApp weekly report

Set up a cron job (use Supabase Edge Functions or a free cron service like cron-job.org) that runs every Monday morning:

1. Query all paid users
2. For each user, get last 7 days analytics
3. Call `generateWeeklyInsight()` from `src/services/ai.ts`
4. Send via WhatsApp Business API to their registered number

---

### Feature: Verified creator badge

Add a `is_verified` boolean to the `profiles` table. Paid users automatically get it. Show a small blue checkmark on their public page next to their name. Purely cosmetic but people love it.

---

## Launch checklist

```
□ npm run build — zero errors
□ npm run type-check — zero errors
□ Test UPI block on real Android phone
□ Test WhatsApp block — opens wa.me link correctly
□ Test AI bio writer — 5 bios returned
□ Test AI page roast — score and feedback returned
□ Test Razorpay payment — test mode first
□ Test public page at /username
□ Analytics tracking on page view
□ Analytics tracking on UPI tap
□ Deploy to Vercel
□ Custom domain working with HTTPS
□ Share link in 10 WhatsApp groups
□ Post on LinkedIn — "built this in a weekend"
□ Post on Twitter/X — show demo video
□ Submit to ProductHunt — schedule for Tuesday 12:01am IST
```

---

## Revenue milestones

| Users | Free | Paid (₹99/mo) | Monthly Revenue |
|-------|------|---------------|-----------------|
| Month 1 | 500 | 25 | ₹2,475 |
| Month 2 | 2,000 | 100 | ₹9,900 |
| Month 3 | 5,000 | 250 | ₹24,750 |
| Month 6 | 15,000 | 750 | ₹74,250 |

**Server costs:** Vercel (free) + Supabase (free up to 50,000 users) + Claude API (~₹5 per 100 AI uses) = effectively ₹0 until 1,000+ paid users.

---

## How to use this file with Claude Code

Open VS Code. Open Claude Code extension. Say:

> "Read BIOPAGE_INDIA_PLAN.md and execute Sprint 0 completely. After each step confirm it is done before moving to the next step. Ask me before installing anything not in the plan."

Then after Sprint 0 is done:

> "Sprint 0 is complete. Now execute Sprint 1 — create all three India block files exactly as specified in the plan."

And so on for each sprint. Claude Code will handle all the file creation, imports, and wiring.
