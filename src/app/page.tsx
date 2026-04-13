import Link from "next/link";
import { getStats, formatAmount } from "@/lib/data";
import ShareButtons from "@/components/ShareButtons";

const STORY_CARDS = [
  {
    title: "The $500M Spy Sheikh Deal",
    description:
      "UAE's National Security Advisor secretly bought 49% of WLF days before Trump's inauguration. $187M went directly to Trump family entities.",
    focus: "tahnoun-bin-zayed",
    color: "from-red-900/40 to-red-950/40",
    border: "border-red-800/30",
  },
  {
    title: "The Con Men Who Built WLF",
    description:
      "A convicted felon and a pick-up artist co-founded Trump's crypto venture. Their previous DeFi project was hacked for $2.1M. They collected $65M.",
    focus: "chase-herro",
    color: "from-orange-900/40 to-orange-950/40",
    border: "border-orange-800/30",
  },
  {
    title: "Like Father, Like Sons",
    description:
      "Steve Witkoff negotiates Middle East peace while his sons profit from the same governments. He hasn't divested from WLF. He donated $2M+ to Trump PACs.",
    focus: "steve-witkoff",
    color: "from-blue-900/40 to-blue-950/40",
    border: "border-blue-800/30",
  },
  {
    title: "Cambridge Analytica's Crypto Sequel",
    description:
      "A WLF advisor was a director of Emerdata, Cambridge Analytica's successor. Connected to Erik Prince's Chinese state-owned military contractor.",
    focus: "sandy-peng",
    color: "from-purple-900/40 to-purple-950/40",
    border: "border-purple-800/30",
  },
];

export default function Home() {
  const stats = getStats();

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            WLF<span className="text-orange-500">.</span>investigation
          </span>
          <div className="flex gap-4 text-sm">
            <Link href="/graph" className="text-gray-400 hover:text-white transition-colors">
              Network Graph
            </Link>
            <Link href="/flows" className="text-gray-400 hover:text-white transition-colors">
              Money Flows
            </Link>
            <Link href="/timeline" className="text-gray-400 hover:text-white transition-colors">
              Timeline
            </Link>
            <Link href="/melania" className="text-pink-400 hover:text-pink-300 transition-colors">
              $MELANIA
            </Link>
            <Link href="/methodology" className="text-gray-400 hover:text-white transition-colors">
              Methodology
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Follow the Money
            <br />
            <span className="text-orange-500">Behind Trump&apos;s Crypto Empire</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            An interactive investigation mapping the people, foreign government
            connections, and money flows behind World Liberty Financial and the
            $TRUMP memecoin. Every claim is sourced.
          </p>
          <Link
            href="/graph"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl text-lg transition-colors"
          >
            Explore the Network
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <ShareButtons className="mt-6 justify-center" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-8 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-white">{stats.people}</div>
            <div className="text-sm text-gray-500">People Mapped</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-400">
              {formatAmount(stats.totalFlow)}
            </div>
            <div className="text-sm text-gray-500">Total Money Flows</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">
              {stats.countries}
            </div>
            <div className="text-sm text-gray-500">Foreign Governments</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-400">
              {stats.totalRelationships}
            </div>
            <div className="text-sm text-gray-500">Documented Connections</div>
          </div>
        </div>
      </section>

      {/* Story cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Key Investigations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {STORY_CARDS.map((card) => (
              <Link
                key={card.focus}
                href={`/person/${card.focus}`}
                className={`block p-6 rounded-xl bg-gradient-to-br ${card.color} border ${card.border} hover:border-gray-600 transition-all group`}
              >
                <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {card.description}
                </p>
                <span className="inline-block mt-4 text-sm text-orange-500 font-medium">
                  Read the dossier &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology callout */}
      <section className="py-12 px-6 border-t border-gray-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-lg font-semibold mb-3">Methodology</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Every claim on this site is linked to its source. We use a four-tier
            evidence system: official records (court filings, SEC, FEC, blockchain),
            major publications (NYT, WSJ, Reuters, CoinDesk), specialist journalism,
            and social media. Inferred connections are explicitly labeled.
          </p>
          <Link
            href="/methodology"
            className="text-orange-500 hover:text-orange-400 text-sm font-medium"
          >
            Read our full methodology &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800/50 text-center text-sm text-gray-600">
        <p>
          This is an independent investigation. Not affiliated with any political
          party, government, or organization. All data is sourced from public records
          and published reporting.
        </p>
        <ShareButtons className="mt-4 justify-center" />
      </footer>
    </div>
  );
}
