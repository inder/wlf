# WLF: World Liberty Financial Investigation App

## Problem Statement

A viral post captured what millions are thinking: who are the non-Trump people behind $TRUMP coin and World Liberty Financial, what are their backgrounds, and what are their connections to foreign governments, lobbying organizations, and political entities? The information exists scattered across news articles, SEC filings, FARA registrations, FEC records, and blockchain data, but no single tool lets you explore it as a connected graph.

This app makes the invisible visible. It's ProPublica meets a force-directed graph.

## Core Concept

A web app that maps the people, organizations, financial flows, and foreign government connections behind World Liberty Financial and the $TRUMP memecoin. Two views:

1. **Interactive Network Graph** - Force-directed graph with countries (Israel, Saudi Arabia, Qatar, UAE, Pakistan) as root nodes, people as connected nodes, organizations as clusters. Click any node to see the dossier. Filter by connection type (financial, political, familial, advisory).

2. **Dossier View** - Deep profile pages for each person: background, role in WLF/$TRUMP, political donations, foreign connections, lobbying ties, timeline of key events, source citations.

## Target Users

- Journalists investigating Trump crypto connections
- Researchers and academics studying corruption/influence
- Citizens who want to understand who profits from presidential crypto
- Congressional staffers preparing oversight hearings

## Key People (Non-Trump Family, researched)

### Co-Founders & Operators
1. **Chase Herro** - Co-founder, "Data & Strategies Lead". Criminal record (drug charges, theft). Co-founded Dough Finance (hacked for $2.1M, fraud litigation). Collected ~$65M from WLF.
2. **Zak Folkman** (aka Zack Bauer) - Co-founder, "Head of Operations". Former pick-up artist ("Date Hotter Girls LLC"). Co-founded Dough Finance. Collected ~$65M from WLF.
3. **Zach Witkoff** - Co-founder. Son of Steve Witkoff (Trump's Middle East envoy). Named his son "Don James" after Trump. Negotiated Pakistan stablecoin deal. Applied for US banking license.
4. **Alex Witkoff** - Co-founder. CEO of Witkoff Group. Solicited Gulf state investments while his father negotiated with the same governments as envoy.

### Key Advisor (Co-Founder Emeritus)
5. **Steve Witkoff** - US Special Envoy to the Middle East. $2M+ to Trump PACs. Jewish. Key fundraiser. Has NOT fully divested from WLF while serving as envoy. Connected to Israel, Saudi Arabia, Qatar (sold Park Lane Hotel to QIA for $623M), UAE (Tahnoun deal), Pakistan.

### Advisors & Insiders
6. **Justin Sun** - Largest external investor ($75M+). Chinese-born, St. Kitts citizen. TRON founder. SEC case dropped after Trump inauguration. Former Grenada WTO ambassador.
7. **Corey Caplan** - CTO. Co-founded Dolomite. WLF borrowed $75M from Dolomite (his own protocol), trapping depositors. The CoinDesk story.
8. **Sandy Peng** - Advisor. Director of Emerdata Limited (Cambridge Analytica successor). Connected to Erik Prince (Blackwater) via Johnson Chun Shun Ko. Chinese state connections via Frontier Services Group (CITIC Group).
9. **Luke Pearson** - Advisor. GP at Polychain Capital.
10. **Rafael Yakobi** - Advisor. Managing Partner at The Crypto Lawyers.
11. **Alexei Dulub** - Advisor. Founder of Web3 Antivirus and PixelPlex.
12. **Ogle** (pseudonymous) - Key Advisor. Co-founder of Glue blockchain.
13. **Ryan Fang** - Advisor. Founder of Tomo Wallet, Co-founder of Ankr.
14. **Matt L Morgan** - Advisor. CEO of Mixie Studios.

### $TRUMP Memecoin Operator
15. **Bill Zanker** - Operates Fight Fight Fight LLC (controls $TRUMP). Longtime Trump associate. $350M in fees. Planning $200M fundraise. Subject of Senate inquiry.

### Foreign Sovereign Entities
16. **Sheikh Tahnoun bin Zayed Al Nahyan** - UAE National Security Advisor ("The Spy Sheikh"). Bought secret 49% stake for $500M. $187M went to Trump family entities. Connected to AI chip deal for UAE.
17. **AB DAO** - WLF partner linked to sanctioned Cambodian network (Prince Group, human trafficking).

### Countries as Root Nodes
- **Israel** - Steve Witkoff ceasefire negotiations, fundraising connections
- **Saudi Arabia** - Witkoff normalization push, Gulf investment solicitation
- **Qatar** - QIA bought Park Lane Hotel ($623M), lobbying targeting Witkoff
- **UAE** - Tahnoun 49% stake ($500M), MGX $2B USD1 deal with Binance, AI chip access
- **Pakistan** - Zach Witkoff stablecoin deal, SC Financial Technologies
- **China** - Justin Sun (born), Sandy Peng / Frontier Services Group / CITIC Group
- **Cambodia** - AB DAO / Prince Group sanctioned network
- **Grenada** - Justin Sun former WTO ambassador

## Technical Architecture

### Stack
- **Frontend**: Next.js 15 (App Router), TypeScript
- **Graph Visualization**: D3.js force-directed graph (or vis.js/Cytoscape.js)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL) - entities, relationships, sources
- **Hosting**: Vercel

### Data Model

```
entities (id, name, type, bio, photo_url, metadata)
  type: person | organization | country | government_body | pac | company

relationships (id, source_id, target_id, type, description, amount, date, sources)
  type: financial | political | familial | advisory | employment | lobbying | diplomatic | criminal

sources (id, url, title, publisher, date, excerpt)

entity_sources (entity_id, source_id)
relationship_sources (relationship_id, source_id)

timelines (id, entity_id, date, event, source_id)
```

### Key Features

1. **Network Graph View**
   - Force-directed layout with physics simulation
   - Country nodes as large anchors, people as medium nodes, orgs as small nodes
   - Edge colors by relationship type (red = financial, blue = political, green = familial, etc.)
   - Click node to expand connections + show mini-dossier
   - Filter panel: by country, by relationship type, by person type
   - Search bar to find and focus any entity
   - Zoom/pan with minimap

2. **Dossier Pages**
   - `/person/[slug]` - Full profile with background, connections list, timeline, sources
   - `/country/[slug]` - Country page showing all connected people and money flows
   - `/org/[slug]` - Organization page

3. **Money Flow View**
   - Sankey diagram showing dollar amounts flowing between entities
   - "$500M from Tahnoun -> WLF -> $187M to Trump entities -> $31M to Witkoff entities"

4. **Timeline View**
   - Horizontal timeline of key events
   - Filter by person or entity
   - Shows correlation between political events and financial transactions

5. **Source Attribution**
   - Every claim linked to a source (news article, filing, public record)
   - Source quality indicators (major publication, court filing, blockchain data, etc.)

### MCP Tools (AI-queryable)
- `get_entity(name)` - Get full dossier for any person/org
- `get_connections(entity, type?)` - Get all connections, optionally filtered
- `get_money_flows(entity?)` - Get financial flows
- `get_timeline(entity?)` - Get timeline of events
- `search_entities(query)` - Full-text search across all entities
- `get_country_connections(country)` - All connections to a specific country

## Implementation Plan

### Phase 1: Data Layer + Seed Data (Day 1)
- Supabase schema (entities, relationships, sources, timelines)
- Seed database with all 17+ people, 8 countries, key organizations
- All relationships with source citations
- RLS policies (public read, admin write)

### Phase 2: Network Graph (Day 1-2)
- D3.js force-directed graph component
- Node rendering (size by importance, color by type)
- Edge rendering (color by relationship type, thickness by financial amount)
- Click interactions (expand, focus, mini-dossier popup)
- Filter panel
- Responsive (works on mobile with touch gestures)

### Phase 3: Dossier Pages (Day 2)
- Person profile pages with all sections
- Country overview pages
- Organization pages
- Source citations throughout

### Phase 4: Money Flow + Timeline (Day 2-3)
- Sankey diagram for financial flows
- Timeline component
- Cross-linking between views

### Phase 5: Polish + Deploy (Day 3)
- SEO (OG images, meta tags)
- Performance optimization (lazy loading graph data)
- Deploy to Vercel
- MCP server endpoints

## Open Questions
- Should we include Trump family members in the graph (for completeness) or strictly exclude them per the original prompt?
- Do we want a data contribution mechanism (submit tips/sources)?
- Should the graph be embeddable (iframe for journalists)?
- Real-time blockchain monitoring for new WLF transactions?
