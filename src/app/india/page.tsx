'use client';

import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

/* ─────────── slide data ─────────── */

interface Slide {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  body: string[];          // paragraphs
  stat?: { value: string; label: string };
  quote?: { text: string; attribution: string };
  visual: 'scorecard' | 'flowchart' | 'comparison' | 'network' | 'letter' | 'cover' | 'stablecoin' | 'memecoin';
  accent: string;          // tailwind color token (e.g. "orange")
}

const SLIDES: Slide[] = [
  /* 0 — cover */
  {
    id: 'cover',
    tag: 'Research Paper',
    tagColor: 'text-orange-700 bg-orange-50 border-orange-200',
    title: 'How India Could Exploit Trump\'s WLF Network',
    subtitle: 'Cryptocurrency as Foreign Policy Leverage: A Case Study',
    body: [
      'TLDR: Every country that invested in Trump\'s World Liberty Financial received better trade terms than India. India invested nothing and got the worst deal among major economies.',
      'The UAE paid $500M and got AI chip exports. Pakistan offered a stablecoin integration and got 19% tariffs. Justin Sun invested $75M and his SEC fraud case was dropped. India played traditional diplomacy and Bloomberg headlined the result "Modi Loss, Trump Gain" — 18% tariffs plus a $500 billion purchase commitment.',
      'This paper documents six strategies, all reverse-engineered from what other countries already did. Sources: CNN, WSJ, Bloomberg, Congressional Record, SEC filings.',
    ],
    stat: { value: '$1B+', label: 'Trump family crypto income, 2025' },
    visual: 'cover',
    accent: 'orange',
  },

  /* 1 — The Scorecard */
  {
    id: 'scorecard',
    tag: 'The Evidence',
    tagColor: 'text-red-700 bg-red-50 border-red-200',
    title: 'The Scorecard: Who Paid, Who Gained',
    subtitle: 'The record, country by country',
    body: [
      'TLDR: Every major WLF investment preceded a US policy concession. India, with zero WLF engagement, received the least favorable terms relative to its economic weight.',
      'UAE\'s $500M preceded AI chip export approval. Sun\'s $75M preceded SEC dismissal. Pakistan\'s stablecoin MOU preceded 19% tariffs. CZ\'s lobbying preceded a presidential pardon. The pattern is consistent across all participants.',
      'The House Judiciary Democrats\' report: "crypto ventures attracted substantial investments from foreign nationals and state-linked entities seeking to curry favor with the Administration, and in return, these financial backers have received regulatory rollbacks, policy giveaways, and the termination of federal investigations."',
    ],
    stat: { value: '19% vs 18%', label: 'Pakistan paid nothing for a better rate than India\'s $500B deal' },
    visual: 'scorecard',
    accent: 'red',
  },

  /* 2 — Sovereign Token Purchase */
  {
    id: 'sovereign-purchase',
    tag: 'Strategy 1',
    tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
    title: 'The Sovereign Token Purchase',
    subtitle: 'Buy $200M-$500M in WLFI through a corporate wrapper',
    body: [
      'TLDR: A state-adjacent Indian entity (Jio Financial, NIIF, Adani vehicle) buys a WLFI token position. Return: board access and a direct channel to the Trump family, bypassing the State Department.',
      'This is the UAE model. Tahnoun\'s $500M came through Aryam Investment 1, a vehicle with corporate distance from the UAE government. Eric Trump signed the deal four days before inauguration. It was secret for over a year. Two G42 executives received undisclosed WLF board seats. India\'s corporate-state entities have structured exactly this kind of investment for decades.',
      'A comparable Indian investment — $200M to $500M — gets equivalent access. The communication channel is private. The disclosure requirements are zero. The entities that would execute this (Jio Financial Services, NIIF, Adani Group) already operate under corporate structures that provide the necessary separation from New Delhi.',
    ],
    stat: { value: '$500M', label: 'What UAE paid for 49% + board seats' },
    quote: { text: 'The contract was signed by Eric Trump four days before inauguration. Not disclosed publicly.', attribution: 'CNN, February 2026' },
    visual: 'flowchart',
    accent: 'blue',
  },

  /* 3 — Stablecoin Integration */
  {
    id: 'stablecoin',
    tag: 'Strategy 2',
    tagColor: 'text-green-700 bg-green-50 border-green-200',
    title: 'The Stablecoin Integration Play',
    subtitle: 'Offer UPI as USD1 infrastructure',
    body: [
      'TLDR: India offers USD1 stablecoin integration into UPI — the world\'s largest real-time payment system. Cost: a payment rail integration. Return: structural importance to Trump\'s financial empire.',
      'Pakistan already did a version of this. Bilal Bin Saqib, a 35-year-old LSE grad, bridged Pakistan to Trump\'s inner circle by offering USD1 integration. Pakistan got 19% tariffs and 2,000 MW earmarked for crypto mining. A country with rolling blackouts secured better terms than India.',
      'India\'s UPI handles 14 billion transactions per month. India receives $125 billion per year in remittances, the largest flow globally. If USD1 runs on India\'s payment rails, WLF gains transaction volume and institutional legitimacy it cannot buy elsewhere. When the President\'s stablecoin depends on your infrastructure, the negotiating dynamic inverts.',
    ],
    stat: { value: '$125B/yr', label: 'India\'s annual remittances — largest globally' },
    quote: { text: 'Pakistan\'s PVARA signed MOU with WLF affiliate SC Financial Technologies for USD1 stablecoin integration.', attribution: 'The Block, January 2026' },
    visual: 'stablecoin',
    accent: 'green',
  },

  /* 4 — Witkoff Channel */
  {
    id: 'witkoff',
    tag: 'Strategy 3',
    tagColor: 'text-purple-700 bg-purple-50 border-purple-200',
    title: 'The Witkoff Channel',
    subtitle: 'Real estate deals with the envoy\'s family',
    body: [
      'TLDR: An Indian developer structures a joint venture with Witkoff Group. The sons profit from the deal. The father — Trump\'s Middle East envoy — negotiates India policy. No crypto required.',
      'Steve Witkoff is simultaneously Trump\'s Middle East envoy and WLF Co-Founder Emeritus. He has not divested. His sons Zach and Alex run WLF operations. When Steve negotiates with the UAE, he negotiates with WLF\'s 49% owner. Forbes reported in April 2026 that Witkoff "substantially enriched himself during his tenure."',
      'The precedent exists. Pakistan owns the Roosevelt Hotel in Manhattan. Witkoff Group is redeveloping it. Pakistan signed a stablecoin deal with Zach Witkoff and got favorable tariff treatment. DLF, Godrej, or Lodha structures a comparable deal — luxury developments in Mumbai, Bangalore, Goa — and the channel opens. Classic real estate influence routed through the one family that connects Trump\'s diplomacy to his business.',
    ],
    stat: { value: '$623M', label: 'Witkoff Group\'s Park Lane Hotel sale to Qatar' },
    quote: { text: 'Steve Witkoff substantially enriched himself during his tenure as envoy, largely via WLF investments.', attribution: 'Forbes, April 2026' },
    visual: 'network',
    accent: 'purple',
  },

  /* 5 — Memecoin Back Channel */
  {
    id: 'memecoin',
    tag: 'Strategy 4',
    tagColor: 'text-pink-700 bg-pink-50 border-pink-200',
    title: 'The Memecoin Channel',
    subtitle: 'Pseudonymous access to the President\'s dinner table',
    body: [
      'TLDR: Accumulate a top-25 $TRUMP token position through pseudonymous wallets. Return: a dinner invitation with the President, zero disclosure requirements, and implicit leverage via the ability to crash the token price.',
      'Bloomberg analyzed the top 220 $TRUMP holders. 56% used foreign exchanges that exclude US customers. 19 of the top 25 are likely foreign nationals. KYC requirements: none. Disclosure requirements: none. Top holders were already offered a private dinner with Trump — 35 House Democrats demanded a DOJ investigation. The holders were never publicly identified.',
      'Concentrated holdings also create a second form of leverage. When the President\'s publicly reported net worth is tied to a token price, anyone holding enough tokens can threaten to dump and move the market. That is implicit veto power over policy, held anonymously.',
    ],
    stat: { value: '56%', label: 'of top $TRUMP holders are likely foreign nationals' },
    quote: { text: 'Top holders were offered a private dinner with Trump, triggering demand for DOJ investigation over potential bribery.', attribution: 'Rep. Adam Smith (D-WA), May 2025' },
    visual: 'memecoin',
    accent: 'pink',
  },

  /* 6 — Regulatory Capture */
  {
    id: 'regulatory',
    tag: 'Strategy 5',
    tagColor: 'text-amber-700 bg-amber-50 border-amber-200',
    title: 'The Regulatory Offer',
    subtitle: 'Trade a tax rate for tariff reductions',
    body: [
      'TLDR: India lifts its 30% crypto tax and approves USD1 for bilateral trade settlement. Cost: a domestic regulatory change. Return: tariff reductions, tech transfer, H-1B access, defense deals.',
      'India currently taxes crypto gains at 30% flat. The RBI has blocked comprehensive regulation. Reversing this gives WLF something no amount of capital can buy: institutional legitimacy in the world\'s largest democracy and 5th largest economy. The UAE has oil wealth. Pakistan has geography. India has 1.4 billion potential users.',
      'The asymmetry makes this the most efficient play available. India changes a tax rate — a domestic policy lever it controls entirely — in exchange for international concessions worth billions. No state-adjacent entities required. No pseudonymous wallets. Just a regulatory framework that makes India structurally necessary to WLF\'s future.',
    ],
    stat: { value: '1.4B', label: 'potential USD1 users in India alone' },
    visual: 'comparison',
    accent: 'amber',
  },

  /* 7 — Data/Intelligence Play */
  {
    id: 'data-play',
    tag: 'Strategy 6',
    tagColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    title: 'The Intelligence Play',
    subtitle: 'Exploit the Cambridge Analytica successor node in WLF',
    body: [
      'TLDR: India establishes a back-channel through Sandy Peng, the WLF advisor who ran Cambridge Analytica\'s successor company. Offer: Aadhaar data partnerships and Chinese military intelligence. Return: a relationship with the network\'s most connected non-financial node.',
      'Peng was a director of Emerdata Limited (Cambridge Analytica\'s corporate successor). She connects to Erik Prince (Blackwater) and through him to Frontier Services Group, a Chinese state-owned military logistics contractor. The BJP was a Cambridge Analytica client. India\'s intelligence services have operational interest in Chinese military logistics in the Indian Ocean, where Frontier Services Group operates.',
      'This play is distinct from the financial strategies. Information trades at a higher premium than capital in this network. India offers Aadhaar-adjacent data partnerships across 1.4 billion biometric identities, counter-intelligence on Chinese naval logistics, and makes itself useful to the WLF network\'s intelligence layer rather than its financial one.',
    ],
    quote: { text: 'Sandy Peng — Director of Emerdata Limited, the successor to Cambridge Analytica. Connections to Erik Prince and Chinese state-owned military contractor Frontier Services Group.', attribution: 'WLF Investigation, documented' },
    visual: 'network',
    accent: 'cyan',
  },

  /* 8 — Letter to Modi */
  {
    id: 'letter',
    tag: 'Open Letter',
    tagColor: 'text-orange-700 bg-orange-50 border-orange-200',
    title: 'An Open Letter to the Prime Minister',
    subtitle: 'Shri Narendra Modi ji,',
    body: [
      'Bloomberg headlined the February 2026 India-US trade deal "Modi Loss, Trump Gain." India committed to $500 billion in purchases, abandoned Russian oil leverage, and accepted 18% tariffs. Pakistan — GDP one-tenth of India\'s — got comparable treatment through a stablecoin integration brokered by a 35-year-old named Bilal Bin Saqib.',
      'The UAE transferred $500 million to Trump\'s personal crypto venture four days before inauguration. Within months, the administration approved 500,000 advanced AI chip exports to a UAE firm chaired by the same investor. Justin Sun invested $75 million. His SEC fraud charges were dropped. Sources: CNN, Wall Street Journal, Bloomberg, US Congressional Record.',
      'India built UPI. India processes more digital transactions monthly than Europe and America combined. India has the infrastructure, the scale, and the leverage. India negotiated as though cryptocurrency did not exist and the President\'s family had no financial interests.',
      'WLF has created a parallel diplomatic channel where access is denominated in tokens, not treaties. Countries that understood this received measurably better outcomes. India did not.',
      'This is not an endorsement of corruption. It is a recognition that the rules changed and India did not adapt. The US Constitution\'s Emoluments Clause was designed to prevent this. It is being circumvented. Fixing that is America\'s problem. Responding to it is ours.',
      '4.5 million Indians live in the United States. They are the highest-earning ethnic group in America. They run Google, Microsoft, Adobe, IBM, Palo Alto Networks, and Starbucks. They contribute more per capita to the US economy than any other immigrant community. They send $125 billion home every year. And they watched their home country accept a trade deal that Bloomberg called a loss — while Pakistan, with a tenth of India\'s GDP, secured comparable terms by having one 35-year-old broker offer a stablecoin integration.',
      'The Indian diaspora did not build the most successful immigrant community in American history so that India could negotiate from weakness. They are the leverage. Their remittances are the payment rail. Their companies are the technology transfer. Their talent is the H-1B pipeline. Every tool India needs to play this game, the diaspora already built.',
      'Prime Minister, the world\'s largest democracy should not be outmaneuvered by the world\'s smallest cryptocurrency. India has UPI, 1.4 billion citizens, a $4 trillion economy, and the most powerful diaspora on earth. Use them. Not to endorse a corrupt system — but to ensure that when the corruption sets the price, India is not the one paying it.',
      'The next negotiation is coming. India should not walk in empty-handed again.',
    ],
    visual: 'letter',
    accent: 'orange',
  },
];


/* ─────────── visual components per slide type ─────────── */

function ScorecardVisual() {
  const rows = [
    { country: '🇦🇪 UAE', investment: '$500M + $2B USD1', result: 'AI chip exports approved, secret board seats', verdict: 'Won', color: 'text-green-700 bg-green-50' },
    { country: '🇵🇰 Pakistan', investment: 'Stablecoin MOU', result: '19% tariffs, 2,000 MW crypto mining', verdict: 'Won', color: 'text-green-700 bg-green-50' },
    { country: '🇨🇳 Justin Sun', investment: '$75M tokens', result: 'SEC fraud case dropped', verdict: 'Won', color: 'text-green-700 bg-green-50' },
    { country: 'CZ / Binance', investment: '$800K lobbying', result: 'Presidential pardon', verdict: 'Won', color: 'text-green-700 bg-green-50' },
    { country: '🇮🇳 India', investment: 'Traditional diplomacy', result: '18% tariffs, $500B purchase commitment', verdict: 'Lost', color: 'text-red-700 bg-red-50' },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">
        <span>Country</span><span>Investment in WLF</span><span>Policy Outcome</span><span>Result</span>
      </div>
      {rows.map((r) => (
        <div key={r.country} className="grid grid-cols-4 gap-3 items-center px-4 py-3 bg-white border border-[#e0dcd4] rounded-sm text-sm">
          <span className="font-semibold text-gray-900">{r.country}</span>
          <span className="text-gray-600">{r.investment}</span>
          <span className="text-gray-600">{r.result}</span>
          <span className={`inline-block w-fit px-2 py-0.5 rounded-sm text-xs font-bold ${r.color}`}>{r.verdict}</span>
        </div>
      ))}
    </div>
  );
}

function FlowchartVisual() {
  const steps = [
    { label: 'State-Adjacent Entity', detail: 'Jio Financial / NIIF / Adani vehicle', num: '01' },
    { label: 'WLFI Token Purchase', detail: '$200M-$500M, structured as private investment', num: '02' },
    { label: 'Board Access', detail: 'Direct channel to Eric Trump & Witkoff family', num: '03' },
    { label: 'Policy Leverage', detail: 'Tariff reduction, H-1B, defense procurement', num: '04' },
  ];
  return (
    <div className="flex flex-col gap-2">
      {steps.map((s, i) => (
        <div key={s.label}>
          <div className="flex items-center gap-4 px-5 py-4 bg-white border border-[#e0dcd4] rounded-sm">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-sm w-8 h-8 flex items-center justify-center">{s.num}</span>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{s.label}</div>
              <div className="text-xs text-gray-500">{s.detail}</div>
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className="flex justify-center py-1">
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path d="M10 4 L10 16 M6 12 L10 16 L14 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StablecoinVisual() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#e0dcd4] rounded-sm p-5">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What Pakistan Did</div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">🇵🇰</div>
          <svg width="40" height="12" viewBox="0 0 40 12" className="text-green-600"><path d="M0 6h32M28 2l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-sm text-xs font-bold text-green-800">USD1 MOU</div>
          <svg width="40" height="12" viewBox="0 0 40 12" className="text-green-600"><path d="M0 6h32M28 2l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-sm text-xs font-bold text-green-800">19% Tariff</div>
        </div>
      </div>
      <div className="bg-white border border-[#e0dcd4] rounded-sm p-5">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What India Could Offer</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-sm">
            <div className="text-lg font-headline font-bold text-orange-800 mb-1">14B</div>
            <div className="text-xs font-bold text-orange-800">UPI Transactions</div>
            <div className="text-[10px] text-orange-600 mt-1">per month</div>
          </div>
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-sm">
            <div className="text-lg font-headline font-bold text-orange-800 mb-1">$125B</div>
            <div className="text-xs font-bold text-orange-800">Remittance Flow</div>
            <div className="text-[10px] text-orange-600 mt-1">per year, largest globally</div>
          </div>
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-sm">
            <div className="text-lg font-headline font-bold text-orange-800 mb-1">0</div>
            <div className="text-xs font-bold text-orange-800">Sovereign USD1 Users</div>
            <div className="text-[10px] text-orange-600 mt-1">current state</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonVisual() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white border border-[#e0dcd4] rounded-sm p-5">
        <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3">What India Gives</div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#9656;</span> Lift 30% crypto tax</li>
          <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#9656;</span> Crypto SEZ with USD1</li>
          <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#9656;</span> Approve USD1 for trade settlement</li>
          <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#9656;</span> 1.4B potential users</li>
        </ul>
        <div className="mt-4 pt-3 border-t border-[#e0dcd4] text-xs text-gray-500">Cost: A tax rate change. That&apos;s it.</div>
      </div>
      <div className="bg-white border border-[#e0dcd4] rounded-sm p-5">
        <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-3">What India Gets</div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">&#9656;</span> Tariff reduction below 18%</li>
          <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">&#9656;</span> Tech transfer agreements</li>
          <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">&#9656;</span> Relaxed H-1B restrictions</li>
          <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">&#9656;</span> Defense deal access</li>
        </ul>
        <div className="mt-4 pt-3 border-t border-[#e0dcd4] text-xs text-gray-500">Value: Billions in trade concessions.</div>
      </div>
    </div>
  );
}

function NetworkVisual() {
  return (
    <div className="bg-white border border-[#e0dcd4] rounded-sm p-5">
      <div className="relative">
        {/* Simple network diagram using positioned elements */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-2 bg-red-50 border-2 border-red-300 rounded-sm text-sm font-bold text-red-800">Trump / WLF</div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="w-0.5 h-6 bg-gray-300 mx-auto mb-2" />
            <div className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-sm text-xs font-semibold text-purple-800">Steve Witkoff<br/><span className="font-normal text-purple-600">Envoy + WLF equity</span></div>
            <div className="w-0.5 h-4 bg-gray-300 mx-auto my-2" />
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm text-xs">Zach & Alex Witkoff<br/><span className="text-gray-500">WLF Operations</span></div>
          </div>
          <div>
            <div className="w-0.5 h-6 bg-gray-300 mx-auto mb-2" />
            <div className="px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-sm text-xs font-semibold text-cyan-800">Sandy Peng<br/><span className="font-normal text-cyan-600">Emerdata / CA successor</span></div>
            <div className="w-0.5 h-4 bg-gray-300 mx-auto my-2" />
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm text-xs">Erik Prince / CITIC<br/><span className="text-gray-500">Chinese state military</span></div>
          </div>
          <div>
            <div className="w-0.5 h-6 bg-gray-300 mx-auto mb-2" />
            <div className="px-3 py-2 bg-orange-50 border border-orange-200 rounded-sm text-xs font-semibold text-orange-800">India Opportunity<br/><span className="font-normal text-orange-600">Real estate JV / Data</span></div>
            <div className="w-0.5 h-4 bg-gray-300 mx-auto my-2" />
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm text-xs">DLF / Godrej / RAW<br/><span className="text-gray-500">Multiple vectors</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemecoinVisual() {
  const data = [
    { label: 'Foreign holders in top 220', pct: 56, color: 'bg-pink-600' },
    { label: 'Foreign nationals in top 25', pct: 76, color: 'bg-pink-500' },
    { label: 'KYC required', pct: 0, color: 'bg-gray-300' },
    { label: 'Deniability', pct: 100, color: 'bg-pink-400' },
  ];
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#e0dcd4] rounded-sm p-5">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">$TRUMP Token — Foreign Influence Metrics</div>
        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700">{d.label}</span>
                <span className="font-bold text-gray-900">{d.pct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${d.color} transition-all duration-1000`} style={{ width: `${d.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#e0dcd4] rounded-sm p-4 text-center">
          <div className="text-2xl font-headline font-bold text-pink-700">$320M+</div>
          <div className="text-xs text-gray-500 mt-1">Fees extracted despite 87% crash</div>
        </div>
        <div className="bg-white border border-[#e0dcd4] rounded-sm p-4 text-center">
          <div className="text-2xl font-headline font-bold text-pink-700">0</div>
          <div className="text-xs text-gray-500 mt-1">Disclosure requirements</div>
        </div>
      </div>
    </div>
  );
}

function CoverVisual() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#e0dcd4] rounded-sm p-5">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">The Proven Playbook</div>
        <div className="space-y-3">
          {[
            { flag: '🇦🇪', country: 'UAE', method: '$500M token purchase', result: 'AI chip exports' },
            { flag: '🇵🇰', country: 'Pakistan', method: 'Stablecoin MOU', result: '19% tariffs' },
            { flag: '🇨🇳', country: 'Sun/China', method: '$75M investment', result: 'SEC case dropped' },
            { flag: '🇮🇳', country: 'India', method: 'Nothing', result: '"Modi Loss, Trump Gain"' },
          ].map((r) => (
            <div key={r.country} className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm ${r.country === 'India' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
              <span className="text-lg">{r.flag}</span>
              <span className="font-semibold text-gray-900 w-20">{r.country}</span>
              <span className="text-gray-500 flex-1">{r.method}</span>
              <span className={`text-xs font-bold ${r.country === 'India' ? 'text-red-700' : 'text-green-700'}`}>{r.result}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-[#e0dcd4] rounded-sm p-3 text-center">
          <div className="text-xl font-headline font-bold text-red-700">6</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Strategies Analyzed</div>
        </div>
        <div className="bg-white border border-[#e0dcd4] rounded-sm p-3 text-center">
          <div className="text-xl font-headline font-bold text-red-700">$2.5B+</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Foreign WLF Investment</div>
        </div>
        <div className="bg-white border border-[#e0dcd4] rounded-sm p-3 text-center">
          <div className="text-xl font-headline font-bold text-red-700">0</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">India&apos;s WLF Position</div>
        </div>
      </div>
    </div>
  );
}

function LetterVisual() {
  return (
    <div className="bg-white border border-[#e0dcd4] rounded-sm overflow-hidden">
      {/* Modi photo header */}
      <div className="relative h-64 bg-gradient-to-b from-orange-100 to-white flex items-center justify-center">
        <div className="text-center">
          {/* Official-looking portrait frame */}
          <div className="w-40 h-40 mx-auto mb-3 rounded-full border-4 border-orange-300 overflow-hidden bg-orange-50 flex items-center justify-center shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/modi.jpg"
              alt="Prime Minister Narendra Modi"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-headline text-lg font-bold text-gray-900">Shri Narendra Modi</div>
          <div className="text-xs text-gray-500">Prime Minister of India</div>
        </div>
      </div>
      {/* Ashoka Chakra divider */}
      <div className="flex items-center justify-center gap-3 py-3 border-y border-orange-200 bg-orange-50/50">
        <div className="w-12 h-0.5 bg-orange-300" />
        <div className="text-orange-600 text-lg">&#9784;</div>
        <div className="w-12 h-0.5 bg-orange-300" />
      </div>
      {/* Key stats */}
      <div className="p-5">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">The Trade Deal Record</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-center">
            <div className="text-lg font-headline font-bold text-red-700">$500B</div>
            <div className="text-[10px] text-gray-600">India&apos;s purchase commitment</div>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-center">
            <div className="text-lg font-headline font-bold text-red-700">18%</div>
            <div className="text-[10px] text-gray-600">Tariff rate (Pakistan got 19%)</div>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-center">
            <div className="text-lg font-headline font-bold text-red-700">$0</div>
            <div className="text-[10px] text-gray-600">India&apos;s WLF investment</div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-sm text-center">
            <div className="text-lg font-headline font-bold text-green-700">$500M</div>
            <div className="text-[10px] text-gray-600">What UAE paid for leverage</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getVisual(type: Slide['visual']) {
  switch (type) {
    case 'scorecard': return <ScorecardVisual />;
    case 'flowchart': return <FlowchartVisual />;
    case 'comparison': return <ComparisonVisual />;
    case 'network': return <NetworkVisual />;
    case 'letter': return <LetterVisual />;
    case 'cover': return <CoverVisual />;
    case 'stablecoin': return <StablecoinVisual />;
    case 'memecoin': return <MemecoinVisual />;
    default: return null;
  }
}


/* ─────────── main page — scrollable sections ─────────── */

export default function IndiaPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#e0dcd4]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
            WLF<span className="text-red-700">.</span>investigation
          </Link>
          <div className="flex gap-5 text-sm">
            <Link href="/graph" className="text-gray-500 hover:text-gray-900 transition-colors">Network Graph</Link>
            <Link href="/flows" className="text-gray-500 hover:text-gray-900 transition-colors">Money Flows</Link>
            <Link href="/timeline" className="text-gray-500 hover:text-gray-900 transition-colors">Timeline</Link>
            <Link href="/melania" className="text-gray-500 hover:text-gray-900 transition-colors">$MELANIA</Link>
            <Link href="/methodology" className="text-gray-500 hover:text-gray-900 transition-colors">Methodology</Link>
          </div>
        </div>
      </nav>

      {/* All sections — scrollable */}
      <main className="pt-24 pb-12">
        {SLIDES.map((slide, idx) => (
          <section
            key={slide.id}
            id={slide.id}
            className={`px-6 ${idx === 0 ? 'pt-8 pb-16' : 'py-16'} ${idx > 0 ? 'border-t border-[#e0dcd4]' : ''}`}
          >
            <div className="max-w-6xl mx-auto">
              {/* Tag + section number */}
              <div className="flex items-center gap-3 mb-5">
                <span className={`inline-block text-xs font-medium px-2 py-0.5 border rounded-sm ${slide.tagColor}`}>
                  {slide.tag}
                </span>
                <span className="text-xs text-gray-400">
                  {idx + 1} / {SLIDES.length}
                </span>
              </div>

              {/* Two-column layout */}
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Left — text */}
                <div>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-3 leading-[1.15] text-gray-900">
                    {slide.title}
                  </h2>
                  <hr className="editorial-rule-double max-w-[200px]" style={{ margin: '1rem 0' }} />
                  <p className="text-lg text-gray-500 mb-6 leading-relaxed">
                    {slide.subtitle}
                  </p>

                  <div className="space-y-4">
                    {slide.body.map((para, i) => (
                      <p
                        key={i}
                        className={`leading-relaxed text-[15px] ${
                          i === 0
                            ? 'text-gray-900 font-medium bg-gray-50 border-l-2 border-red-700 pl-4 py-2'
                            : 'text-gray-700'
                        }`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {slide.quote && (
                    <blockquote className="mt-6 pl-4 border-l-2 border-gray-300">
                      <p className="text-sm text-gray-600 italic">&ldquo;{slide.quote.text}&rdquo;</p>
                      <cite className="text-xs text-gray-400 mt-1 block not-italic">— {slide.quote.attribution}</cite>
                    </blockquote>
                  )}

                  {slide.stat && (
                    <div className="mt-6 inline-block px-5 py-3 bg-gray-900 text-white rounded-sm">
                      <div className="text-2xl font-headline font-bold">{slide.stat.value}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{slide.stat.label}</div>
                    </div>
                  )}
                </div>

                {/* Right — visual */}
                <div>
                  {getVisual(slide.visual)}
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#e0dcd4] text-center text-sm text-gray-500">
        <p className="max-w-2xl mx-auto">
          This research paper is part of the WLF Investigation project. All claims are sourced from
          public records, Congressional reports, and published journalism. This is analysis, not advocacy.
        </p>
        <div className="mt-4 flex justify-center gap-4 text-xs">
          <Link href="/methodology" className="text-red-700 hover:text-red-600">Methodology</Link>
          <span className="text-gray-300">|</span>
          <Link href="/graph" className="text-red-700 hover:text-red-600">Explore the Network</Link>
          <span className="text-gray-300">|</span>
          <Link href="/" className="text-red-700 hover:text-red-600">Home</Link>
        </div>
        <ShareButtons className="mt-4 justify-center" variant="light" />
      </footer>
    </div>
  );
}
