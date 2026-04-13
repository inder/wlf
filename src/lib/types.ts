export type EntityType = 'person' | 'organization' | 'country' | 'government_body' | 'pac' | 'company';

export type RelationType = 'financial' | 'political' | 'familial' | 'advisory' | 'employment' | 'lobbying' | 'diplomatic' | 'criminal';

export type ClaimType = 'documented' | 'reported' | 'alleged' | 'inferred';

export type SourceTier = 'official' | 'major_publication' | 'specialist' | 'social';

export type DatePrecision = 'day' | 'month' | 'year' | 'approximate';

export interface Entity {
  id: string;
  slug: string;
  name: string;
  type: EntityType;
  bio: string;
  photo_url?: string;
  role?: string;
  one_liner: string;
  metadata?: Record<string, unknown>;
}

export interface Relationship {
  id: string;
  source_id: string;
  target_id: string;
  type: RelationType;
  claim_type: ClaimType;
  description: string;
  amount_cents?: number;
  currency?: string;
  date_start?: string;
  date_end?: string;
  date_precision: DatePrecision;
  source_ids: string[];
}

export interface Source {
  id: string;
  url: string;
  title: string;
  publisher: string;
  date: string;
  tier: SourceTier;
  excerpt?: string;
}

export interface TimelineEvent {
  id: string;
  entity_id: string;
  date: string;
  date_precision: DatePrecision;
  event: string;
  source_ids: string[];
}

// Derived types for the graph
export interface GraphNode {
  id: string;
  slug: string;
  name: string;
  type: EntityType;
  role?: string;
  one_liner: string;
  photo_url?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: RelationType;
  claim_type: ClaimType;
  description: string;
  amount_cents?: number;
}

// Visual category mapping (3 categories max per plan)
export type VisualCategory = 'money' | 'power' | 'personal';

export const RELATION_TO_VISUAL: Record<RelationType, VisualCategory> = {
  financial: 'money',
  lobbying: 'money',
  political: 'power',
  diplomatic: 'power',
  employment: 'power',
  advisory: 'power',
  familial: 'personal',
  criminal: 'personal',
};

export const VISUAL_COLORS: Record<VisualCategory, string> = {
  money: '#ef4444',   // red
  power: '#3b82f6',   // blue
  personal: '#22c55e', // green
};

export const SOURCE_TIER_CONFIG: Record<SourceTier, { label: string; color: string; badge: string }> = {
  official: { label: 'Official Record', color: '#eab308', badge: 'gold' },
  major_publication: { label: 'Major Publication', color: '#9ca3af', badge: 'silver' },
  specialist: { label: 'Specialist', color: '#cd7f32', badge: 'bronze' },
  social: { label: 'Social/Self-Published', color: '#6b7280', badge: 'none' },
};

export const CLAIM_TYPE_LABELS: Record<ClaimType, string> = {
  documented: 'Documented',
  reported: 'Reported',
  alleged: 'Alleged',
  inferred: 'Inferred',
};

export const ALL_FILTER_TYPES: RelationType[] = [
  'financial', 'political', 'familial', 'advisory',
  'employment', 'lobbying', 'diplomatic', 'criminal',
];

export const COUNTRY_FLAGS: Record<string, string> = {
  'c-uae': '\u{1F1E6}\u{1F1EA}',
  'c-israel': '\u{1F1EE}\u{1F1F1}',
  'c-saudi': '\u{1F1F8}\u{1F1E6}',
  'c-qatar': '\u{1F1F6}\u{1F1E6}',
  'c-pakistan': '\u{1F1F5}\u{1F1F0}',
  'c-china': '\u{1F1E8}\u{1F1F3}',
  'c-cambodia': '\u{1F1F0}\u{1F1ED}',
};

export const TRUMP_FAMILY_IDS = ['e-donald-trump', 'e-eric-trump', 'e-don-jr', 'e-barron-trump', 'e-melania-trump'];
