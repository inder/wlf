import Link from "next/link";
import { getStats, formatAmount } from "@/lib/data";
import ShareButtons from "@/components/ShareButtons";

const STORY_CARDS = [
  {
    title: "The $500M Spy Sheikh Deal",
    description:
      "UAE's National Security Advisor secretly bought 49% of WLF days before Trump's inauguration. $187M went directly to Trump family entities.",
    focus: "tahnoun-bin-zayed",
    tag: "Foreign Influence",
    tagColor: "text-red-700 bg-red-50 border-red-200",
  },
  {
    title: "The Con Men Who Built WLF",
    description:
      "A convicted felon and a pick-up artist co-founded Trump's crypto venture. Their previous DeFi project was hacked for $2.1M. They collected $65M.",
    focus: "chase-herro",
    tag: "Criminal History",
    tagColor: "text-orange-700 bg-orange-50 border-orange-200",
  },
  {
    title: "Like Father, Like Sons",
    description:
      "Steve Witkoff negotiates Middle East peace while his sons profit from the same governments. He hasn't divested from WLF. He donated $2M+ to Trump PACs.",
    focus: "steve-witkoff",
    tag: "Conflicts of Interest",
    tagColor: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    title: "Cambridge Analytica\u2019s Crypto Sequel",
    description:
      "A WLF advisor was a director of Emerdata, Cambridge Analytica's successor. Connected to Erik Prince's Chinese state-owned military contractor.",
    focus: "sandy-peng",
    tag: "Data & Surveillance",
    tagColor: "text-purple-700 bg-purple-50 border-purple-200",
  },
];

export default function Home() {
  const stats = getStats();

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#e0dcd4]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            WLF<span className="text-red-700">.</span>investigation
          </span>
          <div className="flex gap-5 text-sm">
            <Link href="/graph" className="text-gray-500 hover:text-gray-900 transition-colors">
              Network Graph
            </Link>
            <Link href="/flows" className="text-gray-500 hover:text-gray-900 transition-colors">
              Money Flows
            </Link>
            <Link href="/timeline" className="text-gray-500 hover:text-gray-900 transition-colors">
              Timeline
            </Link>
            <Link href="/melania" className="text-gray-500 hover:text-gray-900 transition-colors">
              $MELANIA
            </Link>
            <Link href="/methodology" className="text-gray-500 hover:text-gray-900 transition-colors">
              Methodology
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Thin red accent line */}
          <div className="w-16 h-0.5 bg-red-700 mx-auto mb-8" />
          <p className="text-sm font-medium tracking-widest uppercase text-gray-500 mb-4">
            An Interactive Investigation
          </p>
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-gray-900">
            Follow the Money Behind Trump&apos;s Crypto Empire
          </h1>
          <hr className="editorial-rule-double max-w-xs mx-auto" />
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 mt-6 leading-relaxed">
            Mapping the people, foreign government connections, and money flows
            behind World Liberty Financial and the $TRUMP memecoin.
            Every claim is sourced.
          </p>
          <Link
            href="/graph"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-sm text-lg transition-colors"
          >
            Explore the Network
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <ShareButtons className="mt-6 justify-center" variant="light" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-6 border-y border-[#e0dcd4]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-headline font-bold text-gray-900">{stats.people}</div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">People Mapped</div>
          </div>
          <div>
            <div className="text-3xl font-headline font-bold text-red-700">
              {formatAmount(stats.totalFlow)}
            </div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Total Money Flows</div>
          </div>
          <div>
            <div className="text-3xl font-headline font-bold text-gray-900">
              {stats.countries}
            </div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Foreign Governments</div>
          </div>
          <div>
            <div className="text-3xl font-headline font-bold text-gray-900">
              {stats.totalRelationships}
            </div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Documented Connections</div>
          </div>
        </div>
      </section>

      {/* Story cards */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-headline text-3xl font-bold mb-2 text-center text-gray-900">
            Key Investigations
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10">
            Select an investigation to read the full dossier with sourced evidence.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {STORY_CARDS.map((card) => (
              <Link
                key={card.focus}
                href={`/person/${card.focus}`}
                className="block p-6 bg-white border border-[#e0dcd4] hover:border-gray-400 transition-all group hover:shadow-sm"
              >
                <span className={`inline-block text-xs font-medium px-2 py-0.5 border rounded-sm mb-3 ${card.tagColor}`}>
                  {card.tag}
                </span>
                <h3 className="font-headline text-xl font-bold mb-2 text-gray-900 group-hover:text-red-700 transition-colors leading-snug">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
                <span className="inline-block mt-4 text-sm text-red-700 font-medium">
                  Read the dossier &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology callout */}
      <section className="py-12 px-6 border-t border-[#e0dcd4]">
        <div className="max-w-3xl mx-auto text-center">
          <hr className="editorial-rule-thick max-w-[60px] mx-auto mb-6" />
          <h3 className="font-headline text-xl font-semibold mb-3 text-gray-900">Methodology</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Every claim on this site is linked to its source. We use a four-tier
            evidence system: official records (court filings, SEC, FEC, blockchain),
            major publications (NYT, WSJ, Reuters, CoinDesk), specialist journalism,
            and social media. Inferred connections are explicitly labeled.
          </p>
          <Link
            href="/methodology"
            className="text-red-700 hover:text-red-600 text-sm font-medium"
          >
            Read our full methodology &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#e0dcd4] text-center text-sm text-gray-500">
        <p className="max-w-2xl mx-auto">
          This is an independent investigation. Not affiliated with any political
          party, government, or organization. All data is sourced from public records
          and published reporting.
        </p>
        <ShareButtons className="mt-4 justify-center" variant="light" />
      </footer>
    </div>
  );
}
