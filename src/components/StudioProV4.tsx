import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Send, Sparkles, Globe2, Users, Map, Cpu, Package, TrendingUp,
  ChevronRight, Plus, Loader2, CheckCircle2, GitMerge, AlertTriangle,
  Clock, Wand2, Kanban, MessageSquare, FolderTree, GitBranch, Settings,
  History, Layers, Search, MoreHorizontal, Box, Zap, FileCode,
  Eye, Gamepad2, Play, PanelLeftClose, PanelLeftOpen, ArrowRight, Sword, Shield,
  Home, TreePine, Bell, BookOpen, Wrench, FileText, Database, Lock,
  Upload, Bot, FlaskConical, Network, X, Star, LayoutGrid,
} from 'lucide-react';

/* ─── Auto-handling context ──────────────────── */
const AutoCtx = React.createContext<{
  auto: Set<string>;
  toggle: (key: string) => void;
}>({ auto: new Set(), toggle: () => {} });

const B      = '#0a0c12';
const SURF   = '#0e1118';
const PANEL  = '#131720';
const RAISED = '#181c26';
const BRD    = 'rgba(255,255,255,0.07)';
const BRD2   = 'rgba(255,255,255,0.04)';
const T      = '#ededed';
const M      = '#6b6b70';
const DIM    = '#3a3a3d';
const ACCENT = '#7cd4ff';
const ADIM   = 'rgba(124,212,255,0.12)';
const WARM   = '#f5a96b';
const WDIM   = 'rgba(245,169,107,0.12)';
const GOOD   = '#88d999';
const BAD    = '#f08a82';

/* ─── Progress Ring ─────────────────────────── */
function Ring({ pct, size = 28, stroke = 2.4, color = ACCENT }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off  = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={BRD} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${circ}`} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  );
}

/* ─── Content Delivery Cards ─────────────────── */
function NpcCard({ name, archetype, tags, dialog, onOpen }: {
  name: string; archetype: string; tags: string[]; dialog: string; onOpen?: () => void;
}) {
  const { auto } = React.useContext(AutoCtx);
  const isAuto = auto.has('npc.place');
  return (
    <div style={{ border: `1px solid ${BRD}`, borderRadius: 3, overflow: 'hidden', borderLeft: isAuto ? `2px solid ${GOOD}` : undefined }}>
      <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Users size={10} color={ACCENT} strokeWidth={1.5} />
        <span style={{ fontSize: 10, color: ACCENT, fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>NPC</span>
        <span style={{ fontSize: 12, color: T, fontWeight: 500, marginLeft: 4 }}>{name}</span>
        <span style={{ fontSize: 10.5, color: WARM, background: WDIM, borderRadius: 2, padding: '0 4px', marginLeft: 2 }}>{archetype}</span>
        <div style={{ flex: 1 }} />
        {isAuto && <span style={{ fontSize: 10, color: GOOD, fontFamily: 'monospace', letterSpacing: '0.04em' }}>auto</span>}
        {tags.slice(0, 2).map(t => (
          <span key={t} style={{ fontSize: 10, color: DIM, fontFamily: 'monospace' }}>{t}</span>
        ))}
      </div>
      <div style={{ padding: '5px 8px 4px' }}>
        <div style={{ fontSize: 11.5, color: M, fontStyle: 'italic', lineHeight: 1.45 }}>"{dialog}"</div>
      </div>
      <div style={{ padding: '7px 10px 8px', display: 'flex', gap: 5, borderTop: `1px solid ${BRD}`, alignItems: 'center', background: 'rgba(255,255,255,0.015)' }}>
        <Btn label="Åpne" onClick={onOpen} />
        <Btn label="→ Verden" accent autoKey="npc.place" />
      </div>
    </div>
  );
}

function ZoneCard({ name, areal, npcCount, heat, biome }: {
  name: string; areal: string; npcCount: number; heat: number; biome: string;
}) {
  const { auto } = React.useContext(AutoCtx);
  const isAuto = auto.has('zone.view');
  return (
    <div style={{ border: `1px solid ${BRD}`, borderRadius: 3, overflow: 'hidden', borderLeft: isAuto ? `2px solid ${GOOD}` : undefined }}>
      <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Map size={10} color={GOOD} strokeWidth={1.5} />
        <span style={{ fontSize: 10, color: GOOD, fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Zone</span>
        <span style={{ fontSize: 12, color: T, fontWeight: 500, marginLeft: 4 }}>{name}</span>
        <span style={{ fontSize: 10.5, color: M, marginLeft: 4 }}>{biome}</span>
        <div style={{ flex: 1 }} />
        {isAuto && <span style={{ fontSize: 10, color: GOOD, fontFamily: 'monospace', letterSpacing: '0.04em' }}>auto</span>}
      </div>
      <div style={{ padding: '5px 8px', display: 'flex', gap: 14, fontFamily: 'monospace', fontSize: 11 }}>
        <span><span style={{ color: DIM }}>areal </span><span style={{ color: T }}>{areal}</span></span>
        <span><span style={{ color: DIM }}>npc </span><span style={{ color: T }}>{npcCount}</span></span>
        <span><span style={{ color: DIM }}>heat </span><span style={{ color: heat > 15 ? WARM : T }}>{heat}%</span></span>
      </div>
      <div style={{ padding: '7px 10px 8px', display: 'flex', gap: 5, borderTop: `1px solid ${BRD}`, alignItems: 'center', background: 'rgba(255,255,255,0.015)' }}>
        <Btn label="Se i verden" accent autoKey="zone.view" />
        <Btn label="Rediger" dim />
      </div>
    </div>
  );
}

function FactionCard({ name, tagline, color: fCol, treasury, members, influence }: {
  name: string; tagline: string; color: string; treasury: string; members: number; influence: number;
}) {
  const { auto } = React.useContext(AutoCtx);
  const isAuto = auto.has('faction.place');
  return (
    <div style={{ border: `1px solid ${BRD}`, borderRadius: 3, overflow: 'hidden', borderLeft: isAuto ? `2px solid ${GOOD}` : undefined }}>
      <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Shield size={10} color={WARM} strokeWidth={1.5} />
        <span style={{ fontSize: 10, color: WARM, fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Fraksjon</span>
        <span style={{ fontSize: 12, color: T, fontWeight: 500, marginLeft: 4 }}>{name}</span>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: fCol, flexShrink: 0, marginLeft: 4 }} />
        <div style={{ flex: 1 }} />
        {isAuto && <span style={{ fontSize: 10, color: GOOD, fontFamily: 'monospace', letterSpacing: '0.04em' }}>auto</span>}
      </div>
      <div style={{ padding: '4px 8px 5px' }}>
        <div style={{ fontSize: 11.5, color: M, marginBottom: 4 }}>{tagline}</div>
        <div style={{ display: 'flex', gap: 12, fontFamily: 'monospace', fontSize: 11 }}>
          <span><span style={{ color: DIM }}>kasse </span><span style={{ color: T }}>{treasury}</span></span>
          <span><span style={{ color: DIM }}>med. </span><span style={{ color: T }}>{members}</span></span>
          <span><span style={{ color: DIM }}>innfl. </span><span style={{ color: T }}>{influence}%</span></span>
        </div>
      </div>
      <div style={{ padding: '7px 10px 8px', display: 'flex', gap: 5, borderTop: `1px solid ${BRD}`, alignItems: 'center', background: 'rgba(255,255,255,0.015)' }}>
        <Btn label="Åpne" />
        <Btn label="Plasser i verden" accent autoKey="faction.place" />
      </div>
    </div>
  );
}

function AssetCard({ name, type, size, polycount }: { name: string; type: string; size: string; polycount?: string }) {
  const { auto } = React.useContext(AutoCtx);
  const isAuto = auto.has('asset.scene');
  return (
    <div style={{ border: `1px solid ${BRD}`, borderRadius: 3, overflow: 'hidden', borderLeft: isAuto ? `2px solid ${GOOD}` : undefined }}>
      <div style={{ padding: '4px 8px', borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Box size={10} color={M} strokeWidth={1.5} />
        <span style={{ fontSize: 10, color: M, fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Asset</span>
        <span style={{ fontSize: 12, color: T, fontFamily: 'monospace', fontWeight: 500, marginLeft: 4 }}>{name}</span>
        <div style={{ flex: 1 }} />
        {isAuto && <span style={{ fontSize: 10, color: GOOD, fontFamily: 'monospace', letterSpacing: '0.04em' }}>auto</span>}
      </div>
      <div style={{ padding: '5px 8px', display: 'flex', gap: 12, fontSize: 11, fontFamily: 'monospace' }}>
        <span style={{ color: DIM }}>{type}</span>
        <span style={{ color: M }}>{size}</span>
        {polycount && <span style={{ color: DIM }}>{polycount} poly</span>}
      </div>
      <div style={{ padding: '7px 10px 8px', display: 'flex', gap: 5, borderTop: `1px solid ${BRD}`, alignItems: 'center', background: 'rgba(255,255,255,0.015)' }}>
        <Btn label="Legg til scene" accent autoKey="asset.scene" />
        <Btn label="Forhåndsvis" dim />
      </div>
    </div>
  );
}

/* ─── Shared mini-button (with optional auto-toggle) ── */
function Btn({ label, accent, dim, onClick, autoKey }: {
  label: string; accent?: boolean; dim?: boolean; onClick?: () => void; autoKey?: string;
}) {
  const { auto, toggle } = React.useContext(AutoCtx);
  const isAuto = autoKey ? auto.has(autoKey) : false;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, flex: accent ? 1 : undefined }}>
      <button onClick={onClick} style={{
        padding: '6px 12px', fontSize: 12, borderRadius: 4, cursor: 'pointer',
        border: '1px solid',
        background: accent
          ? (isAuto ? 'rgba(136,217,153,0.12)' : 'rgba(124,212,255,0.09)')
          : dim ? 'transparent' : 'rgba(255,255,255,0.03)',
        borderColor: accent
          ? (isAuto ? 'rgba(136,217,153,0.45)' : 'rgba(124,212,255,0.38)')
          : dim ? 'transparent' : BRD,
        color: accent ? (isAuto ? GOOD : ACCENT) : dim ? DIM : M,
        fontFamily: 'inherit', fontWeight: accent ? 500 : 400,
        display: 'flex', alignItems: 'center', gap: 5, width: '100%',
        justifyContent: 'center',
        transition: 'all 0.15s',
        letterSpacing: accent ? '0.01em' : undefined,
      }}>
        {isAuto && <Zap size={11} strokeWidth={2} style={{ flexShrink: 0 }} />}
        {label}
      </button>
      {autoKey && (
        <button
          onClick={() => toggle(autoKey)}
          title={isAuto ? 'Fjern auto' : 'Alltid automatisk'}
          style={{
            width: 26, height: 30, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isAuto ? 'rgba(136,217,153,0.1)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${isAuto ? 'rgba(136,217,153,0.4)' : BRD}`,
            borderRadius: 4, cursor: 'pointer',
            color: isAuto ? GOOD : DIM,
            transition: 'all 0.15s',
          }}
        >
          <Zap size={11} strokeWidth={isAuto ? 2 : 1.5} />
        </button>
      )}
    </div>
  );
}

/* ─── V3-style chat helpers ──────────────────── */
function CAvatar() {
  return (
    <div style={{ width: 20, height: 20, flexShrink: 0, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRD}`, marginTop: 2 }}>
      <Sparkles size={10} color={M} strokeWidth={1.5} />
    </div>
  );
}

function CCode({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 12, color: T, padding: '1px 4px', background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>{children}</span>
  );
}

function CDayDiv({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0 6px' }}>
      <div style={{ flex: 1, height: 1, background: BRD }} />
      <span style={{ fontSize: 10, color: DIM, fontFamily: 'monospace', letterSpacing: '0.06em' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: BRD }} />
    </div>
  );
}

/* ─── Tool steps for reasoning trace ─────────── */
type ToolStep = {
  icon: 'read' | 'search' | 'edit' | 'run' | 'think' | 'write' | 'check';
  label: string;
  detail: string;
  result?: string;
  ms?: number;
};

const STEP_VERB: Record<ToolStep['icon'], string> = {
  read:   'leser',
  search: 'søker',
  edit:   'redigerer',
  run:    'kjører',
  think:  'vurderer',
  write:  'skriver',
  check:  'sjekker',
};

/* ─── V3-style collapsible reasoning trace ───── */
function ReasonTrace({ steps, totalMs, label, live }: { steps: ToolStep[]; totalMs: number; label: string; live?: boolean }) {
  const [open, setOpen] = useState(false);

  if (live) {
    /* ── In-progress state: spinner + pulsing label ── */
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: M, fontFamily: 'monospace', letterSpacing: '0.04em' }}>
        <Loader2 size={11} color={ACCENT} style={{ animation: 'v4-spin 1s linear infinite', flexShrink: 0 }} />
        <span style={{ animation: 'v4-pulse 1.6s ease-in-out infinite' }}>
          tenker{steps.length > 0 ? ` · ${steps.length} steg` : '…'}
        </span>
      </div>
    );
  }

  /* ── Done state: Cpu icon + label (past tense) + collapsible ── */
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 0, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11.5, color: M, fontFamily: 'monospace', letterSpacing: '0.04em' }}
      >
        <ChevronRight size={11} color={DIM} style={{ transform: open ? 'rotate(90deg)' : undefined, transition: 'transform 0.15s' }} />
        <Cpu size={10} color={DIM} />
        <span style={{ color: DIM }}>{label}</span>
        <span style={{ color: DIM, opacity: 0.6 }}>· {totalMs}ms</span>
      </button>
      {open && (
        <div style={{ marginTop: 6, padding: '8px 0 8px 10px', borderLeft: `1px solid ${BRD}`, fontSize: 12, color: M, lineHeight: 1.5 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '3px 0' }}>
              <span style={{ flexShrink: 0, fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase', color: DIM, padding: '1px 5px', border: `1px solid ${BRD}`, borderRadius: 2, lineHeight: 1.3 }}>
                {STEP_VERB[s.icon]}
              </span>
              <span style={{ color: M, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <CCode>{s.detail}</CCode>
                {s.result && <span style={{ color: DIM }}> → {s.result}</span>}
              </span>
              {s.ms && <span style={{ fontSize: 10, fontFamily: 'monospace', color: DIM, flexShrink: 0 }}>{s.ms}ms</span>}
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px dashed ${BRD}`, color: DIM, fontSize: 11, fontFamily: 'monospace', display: 'flex', gap: 10 }}>
            <span>gpt-fast</span><span>·</span><span>economy</span><span>·</span><span>${(totalMs * 0.0000003).toFixed(4)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── V3-style live dots (streaming) ─────────── */
function StreamDots({ lines, done }: { lines: string[]; done?: boolean }) {
  if (done) return <div style={{ fontSize: 13, color: M, lineHeight: 1.65 }}>{lines.join(' ')}</div>;
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 20 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: M, opacity: 0.5, animation: `v4-blink ${0.8 + i * 0.15}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}

/* ─── Chat messages ──────────────────────────── */
type ChatMsg =
  | { kind: 'user'; text: string }
  | { kind: 'agent'; text: string }
  | { kind: 'stream'; lines: string[]; done?: boolean }
  | { kind: 'think'; steps: ToolStep[]; totalMs: number; label: string; live?: boolean }
  | { kind: 'npc'; name: string; archetype: string; tags: string[]; dialog: string }
  | { kind: 'zone'; name: string; areal: string; npcCount: number; heat: number; biome: string }
  | { kind: 'faction'; name: string; tagline: string; color: string; treasury: string; members: number; influence: number }
  | { kind: 'asset'; name: string; type: string; size: string; polycount?: string }
  | { kind: 'thinking'; text: string };

const INITIAL_MESSAGES: ChatMsg[] = [
  {
    kind: 'user',
    text: 'Jeg vil ha en neo-noir antagonist som er leder av Hexcorp. Og bygg ut ZONE_β til en industrihavn.',
  },
  {
    kind: 'think',
    label: 'Analyserte verdensdata og NPC-maler',
    totalMs: 1840,
    steps: [
      { icon: 'read',   label: 'les',    detail: 'world_state.json',          result: 'ZONE_β: 0 NPC-er, tomt, biome=havn', ms: 42 },
      { icon: 'search', label: 'søk',    detail: 'npc_templates (antagonist)', result: '3 treff: Handler, Fixer, Korporat', ms: 118 },
      { icon: 'read',   label: 'les',    detail: 'npc_templates/Handler.ts',   result: 'Arketyp klar, 6 dialog-slots', ms: 31 },
      { icon: 'read',   label: 'les',    detail: 'zone_schema.ts',             result: 'biome[], heatMap, npcSlots max=20', ms: 28 },
      { icon: 'think',  label: 'tenk',   detail: '"Neo-noir handler + Hexcorp-CEO → Marcus Vela"', ms: 940 },
      { icon: 'search', label: 'søk',    detail: 'factions (corporate)',       result: 'Ingen Hexcorp ennå — oppretter ny', ms: 87 },
      { icon: 'write',  label: 'skriv',  detail: 'npc/marcus_vela.ts',         result: 'Opprettet med 5 dialog-grener', ms: 594 },
    ],
  },
  {
    kind: 'agent',
    text: 'Genererer Hexcorp-lederen og planlegger ZONE_β. Starter med karakteren:',
  },
  {
    kind: 'npc',
    name: 'Marcus Vela', archetype: 'Antagonist',
    tags: ['Neo-noir', 'Hexcorp', 'Protagonist', 'Handler'],
    dialog: 'Hexcorp holder ikke avtaler — vi er avtalen.',
  },
  {
    kind: 'think',
    label: 'Bygget ZONE_β — havnedistrikt',
    totalMs: 2210,
    steps: [
      { icon: 'read',   label: 'les',   detail: 'region_01/zones.json',        result: 'ZONE_β allokert, ingen bygninger', ms: 38 },
      { icon: 'read',   label: 'les',   detail: 'biome_templates/havn.ts',     result: 'Kaier, kran, lagerbygg, tunnel', ms: 44 },
      { icon: 'think',  label: 'tenk',  detail: '"Industri + undervann-tunneler passer neo-noir"', ms: 810 },
      { icon: 'write',  label: 'skriv', detail: 'zones/zone_beta.ts',          result: '4.2 km², 14 NPC-slots, heat 18%', ms: 712 },
      { icon: 'run',    label: 'kjør',  detail: 'heatmap_sim.ts --zone ZONE_β', result: 'Stabil, ingen hotspots', ms: 606 },
    ],
  },
  {
    kind: 'agent',
    text: 'Bra. Bygger nå ut ZONE_β som industrihavn:',
  },
  {
    kind: 'zone',
    name: 'ZONE_β — Havnedistrikt', areal: '4.2 km²', npcCount: 14, heat: 18,
    biome: 'Industri · Kaier · Undervann-tunneler',
  },
  {
    kind: 'user',
    text: 'Perfekt. Legg til Hexcorp som fraksjon og generer et byggningsasset til havna.',
  },
  {
    kind: 'think',
    label: 'Opprettet fraksjon + genererte 3D-asset',
    totalMs: 3120,
    steps: [
      { icon: 'read',   label: 'les',    detail: 'faction_schema.ts',           result: 'FactionId, treasury, influence, members', ms: 29 },
      { icon: 'search', label: 'søk',    detail: 'existing factions',           result: 'Black Lotus, Ferals — ingen Hexcorp', ms: 94 },
      { icon: 'think',  label: 'tenk',   detail: '"Hexcorp: korporat, kontrakt-basert makt"', ms: 720 },
      { icon: 'write',  label: 'skriv',  detail: 'factions/hexcorp.ts',         result: 'treasury=$84k, members=47, influence=62%', ms: 540 },
      { icon: 'search', label: 'søk',    detail: 'asset_templates (warehouse)', result: '2 maler: standard, industrihavn', ms: 77 },
      { icon: 'read',   label: 'les',    detail: 'asset_templates/warehouse_harbor.ts', result: 'GLB-mal, 12k poly, tekstur-slots', ms: 35 },
      { icon: 'run',    label: 'kjør',   detail: 'asset_gen.ts --template harbor --brand hexcorp', result: 'hexcorp_warehouse_A.glb, 3.2 MB', ms: 1625 },
    ],
  },
  {
    kind: 'faction',
    name: 'Hexcorp Industries', tagline: 'Kontroll gjennom kontrakter',
    color: '#7cd4ff', treasury: '$84k', members: 47, influence: 62,
  },
  {
    kind: 'asset',
    name: 'hexcorp_warehouse_A.glb', type: '3D Model', size: '3.2 MB', polycount: '12k',
  },
  {
    kind: 'stream',
    done: true,
    lines: [
      'Alt er plassert i verden. Marcus Vela er tilknyttet',
      'Hexcorp og patruljerer ZONE_β. Vil du at jeg skriver',
      'intro-dialog mellom ham og spilleren?',
    ],
  },
  /* ── Run 3: pågående — viser live spinner ── */
  {
    kind: 'user',
    text: 'Ja, skriv intro-dialogen. Gjør Marcus truende men profesjonell.',
  },
  {
    kind: 'think',
    live: true,
    label: 'Skriver dialog',
    totalMs: 0,
    steps: [
      { icon: 'read',  label: 'les',   detail: 'npc/marcus_vela.ts',           result: '5 dialog-grener', ms: 31 },
      { icon: 'read',  label: 'les',   detail: 'dialog_schema.ts',             result: 'Format: trigger, line, response_slots', ms: 28 },
      { icon: 'think', label: 'tenk',  detail: '"Truende + profesjonell → implisitt makt"', ms: 640 },
    ],
  },
];

/* ─── Agent runs ─────────────────────────────── */
type RunStatus = 'running' | 'awaiting_accept' | 'awaiting_merge' | 'queued' | 'done';
interface Run { id: string; title: string; sub: string; status: RunStatus; pct?: number; depth: number }

const RUNS: Run[] = [
  { id: 'r1', title: 'Marcus Vela · dialog', sub: 'skriv 5 grener', status: 'running', pct: 38, depth: 0 },
  { id: 'r2', title: 'ZONE_β patrol-ruter', sub: '7 ruter · 3 NPC-er', status: 'running', pct: 71, depth: 0 },
  { id: 'r3', title: 'Hexcorp AI-logikk', sub: 'patrol + deal-AI', status: 'queued', depth: 1 },
  { id: 'r4', title: 'Fraksjoner · 3 generert', sub: 'Hexcorp, Black Lotus, Ferals', status: 'awaiting_merge', depth: 0 },
  { id: 'r5', title: 'Warehouse asset pack', sub: '4 varianter klar', status: 'awaiting_accept', depth: 0 },
  { id: 'r6', title: 'Economy-balanse test', sub: '50 simuleringer', status: 'done', depth: 0 },
];

const STATUS_META: Record<RunStatus, { dot: string; label: string }> = {
  running:         { dot: ACCENT, label: 'kjører'   },
  awaiting_accept: { dot: WARM,   label: 'godkjenn' },
  awaiting_merge:  { dot: WARM,   label: 'merge'    },
  queued:          { dot: DIM,    label: 'kø'       },
  done:            { dot: GOOD,   label: 'ferdig'   },
};

/* ─── Player-perspective canvas ──────────────── */
function WorldCanvas({ tick }: { tick: number }) {
  const shimmer = (t: number, amp: number, off: number) => 0.4 + Math.sin((t + off) * 0.6) * amp;
  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#010508' }}>
      {/* Sky gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #020d1a 0%, #010508 45%, #000 100%)' }} />

      {/* Stars */}
      {[...Array(28)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 37 + 11) % 100}%`,
          top: `${(i * 29 + 5) % 38}%`,
          width: i % 3 === 0 ? 2 : 1,
          height: i % 3 === 0 ? 2 : 1,
          borderRadius: '50%',
          background: '#fff',
          opacity: shimmer(tick, 0.3, i * 1.7),
          transition: 'opacity 1s',
        }} />
      ))}

      {/* Horizon glow */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '38%', height: 80, background: 'radial-gradient(ellipse 80% 60px at 50% 50%, rgba(124,212,255,0.07) 0%, transparent 100%)' }} />

      {/* Building silhouettes — far */}
      <svg style={{ position: 'absolute', bottom: '38%', left: 0, right: 0, width: '100%', height: 200 }} viewBox="0 0 1000 200" preserveAspectRatio="xMidYMax meet">
        {/* Far-distance towers */}
        <rect x="30"  y="80"  width="18" height="120" fill="#0a1520" />
        <rect x="34"  y="40"  width="10" height="120" fill="#0a1520" />
        <rect x="80"  y="60"  width="22" height="140" fill="#0a1520" />
        <rect x="130" y="90"  width="16" height="110" fill="#0a1520" />
        <rect x="160" y="50"  width="28" height="150" fill="#0b1626" />
        <rect x="167" y="30"  width="14" height="80"  fill="#0b1626" />
        <rect x="240" y="70"  width="20" height="130" fill="#0a1520" />
        <rect x="290" y="40"  width="34" height="160" fill="#0d1a2a" />
        <rect x="296" y="10"  width="22" height="80"  fill="#0d1a2a" />
        <rect x="370" y="65"  width="18" height="135" fill="#0a1520" />
        <rect x="430" y="50"  width="26" height="150" fill="#0b1626" />
        <rect x="490" y="30"  width="40" height="170" fill="#0e1c2e" />
        <rect x="498" y="0"   width="24" height="60"  fill="#0e1c2e" />
        <rect x="570" y="55"  width="22" height="145" fill="#0a1520" />
        <rect x="620" y="45"  width="30" height="155" fill="#0b1626" />
        <rect x="680" y="70"  width="16" height="130" fill="#0a1520" />
        <rect x="730" y="35"  width="36" height="165" fill="#0e1c2e" />
        <rect x="738" y="10"  width="20" height="60"  fill="#0e1c2e" />
        <rect x="800" y="60"  width="24" height="140" fill="#0b1626" />
        <rect x="860" y="80"  width="18" height="120" fill="#0a1520" />
        <rect x="900" y="55"  width="28" height="145" fill="#0a1520" />
        <rect x="950" y="40"  width="22" height="160" fill="#0b1626" />
        {/* Window lights — scattered */}
        {[70,74,78,164,168,172,294,300,306,494,500,506,512,734,740,746,804,810].map((x, i) => (
          <rect key={x+i} x={x} y={30 + (i % 5) * 18} width="3" height="5" fill={i % 3 === 0 ? '#7cd4ff' : i % 3 === 1 ? '#f5a96b' : '#88d999'} opacity={shimmer(tick, 0.25, i)} />
        ))}
        {/* Hexcorp tower beacon */}
        <circle cx="307" cy="8" r="3" fill={ACCENT} opacity={shimmer(tick, 0.4, 0)} style={{ transition: 'opacity 1s' }} />
        <circle cx="307" cy="8" r="6" fill="none" stroke={ACCENT} strokeWidth="0.8" opacity={shimmer(tick, 0.2, 2)} />
        <text x="298" y="24" fontSize="6" fill={ACCENT} opacity="0.7" fontFamily="monospace">HEXCORP</text>
      </svg>

      {/* Midground — docks & warehouses */}
      <svg style={{ position: 'absolute', bottom: '26%', left: 0, right: 0, width: '100%', height: 150 }} viewBox="0 0 1000 150" preserveAspectRatio="xMidYMax meet">
        <rect x="0"   y="50"  width="200" height="100" fill="#050c15" />
        <rect x="60"  y="20"  width="80"  height="80"  fill="#060e18" />
        <rect x="220" y="40"  width="140" height="110" fill="#050c15" />
        <rect x="380" y="60"  width="240" height="90"  fill="#060e18" />
        <rect x="390" y="30"  width="60"  height="60"  fill="#060e18" />
        <rect x="640" y="45"  width="180" height="105" fill="#050c15" />
        <rect x="830" y="55"  width="170" height="95"  fill="#060e18" />
        {/* Crane */}
        <line x1="500" y1="0" x2="500" y2="60" stroke={DIM} strokeWidth="1.5" />
        <line x1="480" y1="0" x2="560" y2="0" stroke={DIM} strokeWidth="1.5" />
        <line x1="560" y1="0" x2="560" y2="30" stroke={DIM} strokeWidth="1" />
        <rect x="555" y="28" width="10" height="8" fill={WARN} opacity="0.6" />
        {/* NPC tokens on ground */}
        <circle cx="300" cy="138" r="3.5" fill={ACCENT} opacity={shimmer(tick, 0.2, 1)} />
        <circle cx="450" cy="140" r="3"   fill={WARM}   opacity={shimmer(tick, 0.2, 3)} />
        <circle cx="680" cy="136" r="3.5" fill={GOOD}   opacity={shimmer(tick, 0.2, 5)} />
      </svg>

      {/* Ground / water plane perspective */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: '32%' }} viewBox="0 0 1000 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a26" />
            <stop offset="100%" stopColor="#010508" />
          </linearGradient>
        </defs>
        <rect width="1000" height="200" fill="url(#waterGrad)" />
        {/* Reflections */}
        {[0.1, 0.28, 0.48, 0.62, 0.78, 0.92].map((x, i) => (
          <line key={i} x1={x * 1000} y1="0" x2={x * 1000 + (i % 2 === 0 ? 20 : -15)} y2="200"
            stroke="rgba(124,212,255,0.06)" strokeWidth={i % 3 === 0 ? 1.5 : 0.8} />
        ))}
        {/* Water shimmer lines */}
        {[20, 50, 80, 120, 160].map((y, i) => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y}
            stroke="rgba(124,212,255,0.04)" strokeWidth="0.8"
            strokeDasharray={`${40 + i * 10} ${60 + i * 8}`}
            strokeDashoffset={tick * (i % 2 === 0 ? 2 : -3)} />
        ))}
        {/* Hex beacon reflection */}
        <ellipse cx="307" cy="20" rx="8" ry="3" fill={ACCENT} opacity={shimmer(tick, 0.08, 0) * 0.3} />
      </svg>

      {/* Zone label overlay */}
      <div style={{ position: 'absolute', bottom: '33%', left: '26%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
        <div style={{ fontSize: 10, color: WARM, fontFamily: 'monospace', letterSpacing: '0.12em', opacity: 0.8 }}>ZONE_α</div>
      </div>
      <div style={{ position: 'absolute', bottom: '33%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
        <div style={{ fontSize: 10, color: GOOD, fontFamily: 'monospace', letterSpacing: '0.12em', opacity: 0.8 }}>ZONE_β · HAVN</div>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: GOOD, margin: '3px auto 0', boxShadow: `0 0 6px ${GOOD}` }} />
      </div>

      {/* HUD overlays */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
        {[{ l: 'heat', v: '18%', c: WARM }, { l: 'NPC-er', v: '14', c: T }, { l: 'frak.', v: '3', c: T }].map(s => (
          <div key={s.l} style={{ padding: '3px 8px', background: 'rgba(0,0,0,0.72)', border: `1px solid ${BRD}`, borderRadius: 3, backdropFilter: 'blur(4px)' }}>
            <span style={{ fontSize: 11.5, fontFamily: 'monospace', color: s.c }}>{s.v}</span>
            <span style={{ fontSize: 10, color: DIM, marginLeft: 4 }}>{s.l}</span>
          </div>
        ))}
      </div>
      {/* Canvas tab buttons */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 3 }}>
        {[{ Icon: Eye, label: 'Utsyn' }, { Icon: Gamepad2, label: 'Spill' }, { Icon: Globe2, label: 'Kart' }].map(({ Icon, label }) => (
          <button key={label} title={label} style={{ width: 26, height: 26, background: 'rgba(0,0,0,0.72)', border: `1px solid ${BRD}`, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M, backdropFilter: 'blur(4px)' }}>
            <Icon size={12} strokeWidth={1.4} />
          </button>
        ))}
      </div>
    </div>
  );
}

const WARN = '#f5a96b'; // alias

/* ─── Code editor view ─────────────────────── */
function CodeView({ tick }: { tick: number }) {
  const curLine = Math.min(Math.floor(tick * 0.85) + 4, 16);
  const CODE: [number, string, string][] = [
    [1,  'kw', 'import { NPC, Zone, Route } from "../world";'],
    [2,  '',   ''],
    [3,  'cm', '// patrol_ai.ts · Marcus Vela · ZONE_β'],
    [4,  '',   ''],
    [5,  'kw', 'export const patrolConfig = {'],
    [6,  'fd', '  npc:           "marcus_vela",'],
    [7,  'fd', '  zone:          "ZONE_β",'],
    [8,  'fd', '  behavior:      "threaten_approach",'],
    [9,  'nb', '  speed:         1.4,'],
    [10, 'nb', '  alert_radius:  18,'],
    [11, 'kw', '} satisfies PatrolConfig;'],
    [12, '',   ''],
    [13, 'fn', 'export function onEnterZone(npc: NPC, zone: Zone) {'],
    [14, 'bd', '  npc.setDialog(patrolConfig.dialog);'],
    [15, 'bd', '  npc.startPatrol(patrolConfig.routes);'],
    [16, 'cl', '}'],
  ];
  const colorMap: Record<string, string> = {
    kw: ACCENT, cm: DIM, fn: WARM, fd: M, bd: T, nb: WARM, cl: T, '': M,
  };
  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', background: '#020507', fontFamily: '"Fira Code",monospace' }}>
      {/* Gutter */}
      <div style={{ width: 44, flexShrink: 0, padding: '14px 0', borderRight: `1px solid ${BRD}` }}>
        {CODE.map(([n], i) => (
          <div key={n} style={{ height: 22, lineHeight: '22px', paddingRight: 12, textAlign: 'right', fontSize: 11.5, color: i < curLine ? DIM : 'transparent', transition: 'color 0.25s' }}>{n}</div>
        ))}
      </div>
      {/* Code */}
      <div style={{ flex: 1, padding: '14px 18px', overflowY: 'auto' }}>
        {CODE.map(([n, cls, content], i) => (
          <div key={n} style={{ height: 22, lineHeight: '22px', display: 'flex', alignItems: 'center', opacity: i < curLine ? 1 : 0.08, transition: 'opacity 0.3s ease' }}>
            {i === curLine - 1 && (
              <span style={{ width: 2, height: 14, background: ACCENT, display: 'inline-block', marginRight: 2, flexShrink: 0, animation: 'v4-blink 1s step-end infinite' }} />
            )}
            <span style={{ fontSize: 12.5, color: colorMap[cls] ?? M }}>{content}</span>
          </div>
        ))}
      </div>
      {/* Minimap */}
      <div style={{ width: 52, flexShrink: 0, borderLeft: `1px solid ${BRD}`, padding: '14px 6px', opacity: 0.35 }}>
        {CODE.map(([n, cls], i) => (
          <div key={n} style={{ height: 4, marginBottom: 1.5, borderRadius: 1, background: i < curLine ? colorMap[cls] ?? DIM : BRD, opacity: i < curLine ? 0.7 : 0.3, transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Terminal view ─────────────────────────── */
function TerminalView({ tick }: { tick: number }) {
  const LINES = [
    { c: ACCENT, s: '$ pnpm test patrol_ai.ts --reporter=verbose' },
    { c: DIM,    s: '  Running 8 tests · patrol_ai.test.ts' },
    { c: GOOD,   s: '  ✓  patrolConfig has required fields (12ms)' },
    { c: GOOD,   s: '  ✓  onEnterZone calls setDialog (8ms)' },
    { c: GOOD,   s: '  ✓  onEnterZone calls startPatrol (6ms)' },
    { c: GOOD,   s: '  ✓  speed within valid bounds [0.5, 3.0] (4ms)' },
    { c: GOOD,   s: '  ✓  alert_radius within bounds (5ms)' },
    { c: GOOD,   s: '  ✓  behavior enum is a valid value (3ms)' },
    { c: M,      s: '  ⌛ zone_integration.test.ts …' },
  ];
  const visible = Math.min(tick + 2, LINES.length);
  return (
    <div style={{ flex: 1, overflow: 'hidden', background: '#020507', fontFamily: '"Fira Code",monospace', fontSize: 12.5, lineHeight: 1.75 }}>
      {/* Tab bar */}
      <div style={{ height: 28, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 3 }}>
        {['patrol_ai', 'zone_integration', 'economy'].map((f, i) => (
          <span key={f} style={{ padding: '2px 10px', fontSize: 11, fontFamily: 'monospace', borderRadius: 2, background: i === 0 ? ADIM : 'none', color: i === 0 ? ACCENT : DIM, cursor: 'pointer' }}>{f}</span>
        ))}
      </div>
      <div style={{ padding: '12px 18px' }}>
        {LINES.slice(0, visible).map((l, i) => (
          <div key={i} style={{ color: l.c, animation: i === visible - 1 ? 'v4-slide 0.25s ease-out' : undefined }}>{l.s}</div>
        ))}
        {visible < LINES.length && (
          <span style={{ color: M, animation: 'v4-blink 1.2s step-end infinite' }}>▌</span>
        )}
        {visible === LINES.length && (
          <div style={{ marginTop: 12, color: DIM }}>
            <span style={{ color: ACCENT, animation: 'v4-blink 1.2s step-end infinite' }}>$ </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────── */
export default function StudioProV4() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1600);
    return () => clearInterval(id);
  }, []);

  /* left sidebar */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  /* panel widths */
  const [runsW, setRunsW] = useState(220);
  const [chatW, setChatW] = useState(340);
  const [assetW, setAssetW] = useState(220);
  const [dragging, setDragging] = useState<'runs' | 'chat' | 'asset' | null>(null);

  const onDragStart = useCallback((which: typeof dragging) => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(which);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (dragging === 'runs') {
        setRunsW(w => Math.max(160, Math.min(340, w + e.movementX)));
      } else if (dragging === 'chat') {
        setChatW(w => Math.max(240, Math.min(540, w + e.movementX)));
      } else if (dragging === 'asset') {
        setAssetW(w => Math.max(160, Math.min(360, w - e.movementX)));
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragging]);

  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<ChatMsg[]>(INITIAL_MESSAGES);
  const [chatMode, setChatMode] = useState<'Sparring' | 'Plan' | 'Build'>('Plan');
  const [autoActions, setAutoActions] = useState<Set<string>>(new Set());
  const toggleAuto = useCallback((key: string) => {
    setAutoActions(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const sendMsg = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, { kind: 'user', text: input }]);
    setInput('');
    setTimeout(() => setMsgs(m => [...m, { kind: 'thinking', text: 'Analyserer…' }]), 400);
    setTimeout(() => setMsgs(m => [...m.filter(x => x.kind !== 'thinking'), { kind: 'agent', text: 'Forstått. Jeg jobber med det nå.' }]), 1800);
  };

  const [activeRail, setActiveRail] = useState(0);
  const railIcons = [MessageSquare, Kanban, FolderTree, GitBranch, Settings, History];
  const railLabels = ['Chat', 'Kanban', 'Filer', 'Git', 'Innstillinger', 'Historikk'];

  const [rightKind, setRightKind] = useState<'assets' | 'inspector' | 'layers'>('assets');
  const [assetsOpen, setAssetsOpen] = useState(true);
  const rightIcons = [{ k: 'assets' as const, I: Package, l: 'Assets' }, { k: 'inspector' as const, I: Wrench, l: 'Inspektør' }, { k: 'layers' as const, I: Layers, l: 'Lag' }];

  const [centerView, setCenterView] = useState<'world' | 'code' | 'terminal'>('world');
  const [showPanelPicker, setShowPanelPicker] = useState(false);
  const centerTabs = [
    { id: 'world'    as const, Icon: Globe2,   label: 'Verden'   },
    { id: 'code'     as const, Icon: FileCode, label: 'Kode'     },
    { id: 'terminal' as const, Icon: Play,     label: 'Terminal' },
  ];

  const [topTab, setTopTab] = useState<'Build' | 'Content' | 'Systems' | 'Region' | 'Director' | 'Liv'>('Build');

  const DragHandle = ({ which, side }: { which: typeof dragging; side: 'left' | 'right' }) => (
    <div
      className={`v4-dh${dragging === which ? ' active' : ''}`}
      onMouseDown={onDragStart(which)}
      style={{
        position: 'absolute', top: 0, bottom: 0, width: 10, zIndex: 20,
        cursor: 'col-resize',
        [side]: -5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div className="v4-dh-bar" style={{ width: 1, height: 28, background: BRD, borderRadius: 2, transition: 'all 0.15s ease' }} />
    </div>
  );

  const liveRuns = RUNS.map(r => ({
    ...r,
    pct: r.pct !== undefined ? Math.min(100, r.pct + (tick % 5 === 0 ? 2 : 0)) : undefined,
  }));

  return (
    <AutoCtx.Provider value={{ auto: autoActions, toggle: toggleAuto }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: B, color: T, fontFamily: 'ui-sans-serif,system-ui,sans-serif', fontSize: 13, overflow: 'hidden' }}>
        <style>{`
          @keyframes v4-blink   { 0%,100%{opacity:1} 50%{opacity:0.2} }
          @keyframes v4-spin    { to{transform:rotate(360deg)} }
          @keyframes v4-slide   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
          @keyframes v4-pulse   { 0%,100%{opacity:0.6} 50%{opacity:1} }
          ::-webkit-scrollbar   { width:4px; height:4px }
          ::-webkit-scrollbar-track  { background:transparent }
          ::-webkit-scrollbar-thumb  { background:${DIM}; border-radius:2px }
          .v4-dh                { transition: background 0.12s }
          .v4-dh:hover          { background: rgba(124,212,255,0.07) !important }
          .v4-dh:hover .v4-dh-bar { background: rgba(124,212,255,0.55) !important; height: 52px !important; width: 2px !important }
          .v4-dh.active         { background: rgba(124,212,255,0.13) !important }
          .v4-dh.active .v4-dh-bar { background: ${ACCENT} !important; height: 52px !important; width: 2px !important; box-shadow: 0 0 6px ${ACCENT} }
        `}</style>

        {/* ── Header ─────────────────────────────── */}
        <header
          style={{ height: 44, flexShrink: 0, borderBottom: `1px solid ${BRD}`, background: B, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 0 }}
          className="pt-[9px] pb-[9px] mt-[3px] mb-[3px]">
          <img
            src="/__mockup/images/asteon-wordmark-white.png"
            alt="ASTEON"
            style={{ height: 22, opacity: 0.88, userSelect: 'none', marginRight: 28 }}
            draggable={false}
            className="mt-[7px] pt-[0px] pb-[0px] mb-[0px]" />
          <nav style={{ display: 'flex', height: '100%', gap: 0, marginRight: 'auto' }}>
            {(['Build', 'Content', 'Systems', 'Region', 'Director', 'Liv'] as const).map(tab => {
              const active = topTab === tab;
              return (
                <button key={tab} onClick={() => setTopTab(tab)} style={{ position: 'relative', padding: '0 14px', height: '100%', fontSize: 13, fontWeight: active ? 500 : 400, color: active ? T : M, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.01em' }}>
                  {tab}
                  {active && <div style={{ position: 'absolute', bottom: 0, left: '18%', right: '18%', height: 1, background: ACCENT, borderRadius: 1 }} />}
                </button>
              );
            })}
          </nav>
          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: 2, padding: '3px 4px', border: `1px solid ${BRD}`, borderRadius: 5, marginRight: 12 }}>
            {['Full AI', 'Manuell'].map((m, i) => (
              <button key={m} style={{ padding: '4px 10px', borderRadius: 3, fontSize: 12, fontWeight: i === 0 ? 500 : 400, background: i === 0 ? 'rgba(124,212,255,0.1)' : 'none', color: i === 0 ? ACCENT : M, border: 'none', cursor: 'pointer' }}>{m}</button>
            ))}
          </div>
          <button
            style={{ padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: ACCENT, color: B, border: 'none', cursor: 'pointer', marginRight: 8 }}
            className="pt-[4px] pb-[4px]">Spill</button>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(124,212,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: ACCENT }}>AS</div>
        </header>

        {/* ── Body row ───────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── Unified left sidebar: nav + AI runs ─ */}
          <div style={{ width: sidebarOpen ? runsW : 44, flexShrink: 0, borderRight: `1px solid ${BRD}`, display: 'flex', flexDirection: 'column', background: SURF, position: 'relative', transition: 'width 0.18s ease' }}>
            {sidebarOpen && <DragHandle which="runs" side="right" />}

            {/* Sidebar header */}
            <div style={{ height: 44, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: sidebarOpen ? '0 10px 0 12px' : '0', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: 8 }}>
              {sidebarOpen && <>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg,rgba(124,212,255,0.25),rgba(245,169,107,0.18))', border: `1px solid rgba(124,212,255,0.22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: ACCENT, flexShrink: 0, letterSpacing: '-0.5px' }}>NX</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: T, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Project Neon</span>
                <span style={{ fontSize: 10, color: ACCENT, background: ADIM, padding: '2px 5px', borderRadius: 3, flexShrink: 0, fontFamily: 'monospace' }}>PRO</span>
              </>}
              <button
                onClick={() => setSidebarOpen(o => !o)}
                title={sidebarOpen ? 'Kollaps sidebar' : 'Utvid sidebar'}
                style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: `1px solid ${BRD}`, borderRadius: 4, cursor: 'pointer', color: M, flexShrink: 0 }}
              >
                {sidebarOpen
                  ? <PanelLeftClose size={13} strokeWidth={1.5} />
                  : <PanelLeftOpen  size={13} strokeWidth={1.5} />}
              </button>
            </div>

            {sidebarOpen ? (
              <>
                {/* ── Nav section ── */}
                <div style={{ padding: '6px 0', borderBottom: `1px solid ${BRD}`, flexShrink: 0 }}>
                  {[
                    { Icon: MessageSquare, label: 'Chat',          badge: '3',  active: activeRail === 0 },
                    { Icon: Kanban,        label: 'Oppgave-kanban',badge: '',   active: activeRail === 1 },
                    { Icon: FolderTree,    label: 'Filer',         badge: '24', active: activeRail === 2 },
                    { Icon: GitBranch,     label: 'Git',           badge: '2',  active: activeRail === 3 },
                    { Icon: Settings,      label: 'Innstillinger', badge: '',   active: activeRail === 4 },
                    { Icon: History,       label: 'Historikk',     badge: '',   active: activeRail === 5 },
                  ].map(({ Icon, label, badge, active }, i) => (
                    <button
                      key={label}
                      onClick={() => setActiveRail(i)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                        padding: '7px 14px',
                        background: active ? ADIM : 'none',
                        border: 'none',
                        borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent',
                        cursor: 'pointer',
                        color: active ? ACCENT : M,
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        transition: 'background 0.1s',
                      }}
                    >
                      <Icon size={13} strokeWidth={active ? 2 : 1.5} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                      {badge && (
                        <span style={{ fontSize: 10, fontFamily: 'monospace', color: active ? ACCENT : DIM, background: active ? ADIM : BRD2, padding: '1px 5px', borderRadius: 8, flexShrink: 0 }}>{badge}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* ── AI Runs section ── */}
                <div style={{ padding: '8px 14px 6px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <Bot size={11} color={ACCENT} strokeWidth={1.5} />
                  <span style={{ fontSize: 11.5, fontWeight: 500, color: T, flex: 1, letterSpacing: '0.01em' }}>AI-kjøringer</span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: ACCENT, background: ADIM, padding: '2px 6px', borderRadius: 8 }}>2 aktive</span>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {liveRuns.map(r => {
                    const isRunning      = r.status === 'running';
                    const isMerge        = r.status === 'awaiting_merge';
                    const isAccept       = r.status === 'awaiting_accept';
                    const needsAction    = isAccept || isMerge;
                    const rowColor       = isMerge ? ACCENT : isAccept ? GOOD : null;
                    const rowBg          = isMerge ? 'rgba(124,212,255,0.07)' : isAccept ? 'rgba(136,217,153,0.07)' : 'transparent';
                    const rowBorder      = rowColor ? `2px solid ${rowColor}` : '2px solid transparent';
                    return (
                      <div key={r.id} style={{
                        padding: `6px 14px 6px ${14 + r.depth * 10}px`,
                        borderBottom: `1px solid ${BRD2}`,
                        display: 'flex', flexDirection: 'column', gap: 5,
                        background: rowBg,
                        borderLeft: rowBorder,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {isRunning && r.pct !== undefined ? (
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                              <Ring pct={r.pct} size={22} stroke={2} color={ACCENT} />
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7.5, fontFamily: 'monospace', color: ACCENT }}>{r.pct}%</div>
                            </div>
                          ) : isRunning ? (
                            <Loader2 size={14} color={ACCENT} strokeWidth={2} style={{ flexShrink: 0, animation: 'v4-spin 1s linear infinite' }} />
                          ) : isMerge ? (
                            <GitMerge size={14} color={ACCENT} strokeWidth={2} style={{ flexShrink: 0, animation: 'v4-pulse 1.4s ease-in-out infinite' }} />
                          ) : isAccept ? (
                            <CheckCircle2 size={14} color={GOOD} strokeWidth={2} style={{ flexShrink: 0, animation: 'v4-pulse 1.4s ease-in-out infinite' }} />
                          ) : r.status === 'done' ? (
                            <CheckCircle2 size={14} color={GOOD} strokeWidth={2} style={{ flexShrink: 0 }} />
                          ) : (
                            <Clock size={14} color={DIM} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, color: needsAction ? T : M, fontWeight: needsAction ? 500 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                            <div style={{ fontSize: 10.5, color: DIM, marginTop: 1, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub}</div>
                          </div>
                        </div>
                        {needsAction && (
                          <div style={{ display: 'flex', gap: 4 }}>
                            {isMerge ? (
                              <button style={{ flex: 1, padding: '4px 0', fontSize: 11, background: 'rgba(124,212,255,0.13)', border: `1px solid rgba(124,212,255,0.35)`, borderRadius: 3, color: ACCENT, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                                Merge
                              </button>
                            ) : (
                              <button style={{ flex: 1, padding: '4px 0', fontSize: 11, background: 'rgba(136,217,153,0.13)', border: `1px solid rgba(136,217,153,0.35)`, borderRadius: 3, color: GOOD, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                                Godkjenn
                              </button>
                            )}
                            <button style={{ padding: '4px 8px', fontSize: 11, background: 'none', border: `1px solid ${BRD}`, borderRadius: 3, color: DIM, cursor: 'pointer', fontFamily: 'inherit' }}>Avvis</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Kanban shortcut */}
                <div style={{ borderTop: `1px solid ${BRD}`, padding: '6px 10px', flexShrink: 0 }}>
                  <button
                    onClick={() => { setActiveRail(1); setSidebarOpen(true); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', background: 'none', border: `1px solid ${BRD}`, borderRadius: 4, cursor: 'pointer', color: M, fontSize: 11.5, fontFamily: 'inherit' }}
                  >
                    <Kanban size={11} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, textAlign: 'left' }}>Oppgave-kanban</span>
                    <ChevronRight size={10} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Live event strip */}
                <div style={{ height: 26, borderTop: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6, fontFamily: 'monospace', fontSize: 10.5, color: DIM, flexShrink: 0 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOOD, boxShadow: `0 0 5px ${GOOD}`, animation: 'v4-blink 2s ease-in-out infinite', flexShrink: 0 }} />
                  <span key={tick} style={{ animation: 'v4-slide 0.4s ease-out', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{['α→β rute etablert', 'Karavan ankommer', 'Deal signert', 'NPC spawnet', 'Heat spike'][tick % 5]}</span>
                </div>
              </>
            ) : (
              /* ── Collapsed: nav icons + task status stack ── */
              (<div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0 8px', gap: 1, overflowY: 'auto' }}>
                {/* Nav icons */}
                {[MessageSquare, Kanban, FolderTree, GitBranch, Settings, History].map((Icon, i) => {
                  const active = activeRail === i;
                  return (
                    <button key={i} onClick={() => { setActiveRail(i); setSidebarOpen(true); }} title={['Chat','Oppgave-kanban','Filer','Git','Innstillinger','Historikk'][i]} style={{ position: 'relative', width: 32, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? ADIM : 'none', border: active ? `1px solid ${BRD}` : '1px solid transparent', borderRadius: 5, cursor: 'pointer', color: active ? ACCENT : M }}>
                      <Icon size={13} strokeWidth={active ? 2 : 1.5} />
                      {i === 0 && <span style={{ position: 'absolute', top: 2, right: 2, width: 5, height: 5, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 4px ${ACCENT}` }} />}
                    </button>
                  );
                })}
                {/* Divider */}
                <div style={{ width: 24, height: 1, background: BRD, margin: '6px 0' }} />
                {/* Task status micro-indicators */}
                <div style={{ fontSize: 9, color: DIM, fontFamily: 'monospace', letterSpacing: '0.04em', marginBottom: 4, opacity: 0.7 }}>AI</div>
                {liveRuns.map(r => {
                  const isRunning   = r.status === 'running';
                  const needsAction = r.status === 'awaiting_accept' || r.status === 'awaiting_merge';
                  const isDone      = r.status === 'done';
                  const isQueued    = r.status === 'queued';
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSidebarOpen(true)}
                      title={r.title}
                      style={{ width: 32, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: needsAction ? WDIM : 'none', border: needsAction ? `1px solid rgba(245,169,107,0.25)` : '1px solid transparent', borderRadius: 5, cursor: 'pointer', position: 'relative' }}
                    >
                      {isRunning && r.pct !== undefined && (
                        <div style={{ position: 'relative' }}>
                          <Ring pct={r.pct} size={18} stroke={2} color={ACCENT} />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5, fontFamily: 'monospace', color: ACCENT }}>{r.pct}%</div>
                        </div>
                      )}
                      {isRunning && r.pct === undefined && (
                        <Loader2 size={13} color={ACCENT} strokeWidth={2} style={{ animation: 'v4-spin 1s linear infinite' }} />
                      )}
                      {needsAction && (
                        <AlertTriangle size={13} color={WARM} strokeWidth={2} style={{ animation: 'v4-pulse 1.4s ease-in-out infinite' }} />
                      )}
                      {isDone && (
                        <CheckCircle2 size={13} color={GOOD} strokeWidth={2} />
                      )}
                      {isQueued && (
                        <Clock size={13} color={DIM} strokeWidth={1.5} />
                      )}
                      {/* Depth indent dot */}
                      {r.depth > 0 && (
                        <div style={{ position: 'absolute', left: 3, top: '50%', transform: 'translateY(-50%)', width: 3, height: 3, borderRadius: '50%', background: DIM }} />
                      )}
                    </button>
                  );
                })}
              </div>)
            )}
          </div>

          {/* ── Chat panel ───────────────────────── */}
          <div style={{ width: chatW, flexShrink: 0, borderRight: `1px solid ${BRD}`, display: 'flex', flexDirection: 'column', background: B, position: 'relative' }}>
            <DragHandle which="chat" side="right" />

            {/* Chat header — V3 style */}
            <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
              <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRD}`, borderRadius: 3, flexShrink: 0 }}>
                <MessageSquare size={12} color={ACCENT} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, color: T, lineHeight: 1.1, letterSpacing: '0.01em' }}>Chat</span>
                  {autoActions.size > 0 && (
                    <span style={{ fontSize: 10, color: GOOD, background: 'rgba(136,217,153,0.12)', border: `1px solid rgba(136,217,153,0.3)`, borderRadius: 8, padding: '1px 6px', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                      {autoActions.size} auto
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace', lineHeight: 1.1 }}>gpt-fast · Region_01</span>
              </div>
              <button title="Ny" style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: `1px solid ${BRD}`, borderRadius: 3, color: M, cursor: 'pointer' }}>
                <Plus size={11} strokeWidth={1.5} />
              </button>
              <button title="Søk" style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
                <Search size={11} strokeWidth={1.5} />
              </button>
              <button title="Mer" style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
                <MoreHorizontal size={12} strokeWidth={1.5} />
              </button>
            </div>

            {/* Messages — grouped by run, avatar shown once per AI block */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column' }}>
              <CDayDiv label="I dag · 14:15" />
              {(() => {
                // Split into runs — each new 'user' message starts a new run
                const runs: ChatMsg[][] = [];
                msgs.forEach(msg => {
                  if (msg.kind === 'user' || runs.length === 0) runs.push([msg]);
                  else runs[runs.length - 1].push(msg);
                });

                const renderAiItem = (msg: ChatMsg, i: number): React.ReactNode => {
                  if (msg.kind === 'agent') return (
                    <div key={i} style={{ fontSize: 13, color: M, lineHeight: 1.65 }}>{msg.text}</div>
                  );
                  if (msg.kind === 'think') return (
                    <div key={i}><ReasonTrace steps={msg.steps} totalMs={msg.totalMs} label={msg.label} live={msg.live} /></div>
                  );
                  if (msg.kind === 'stream') return (
                    <div key={i}><StreamDots lines={msg.lines} done={msg.done} /></div>
                  );
                  if (msg.kind === 'thinking') return (
                    <div key={i} style={{ display: 'flex', gap: 3, alignItems: 'center', height: 20 }}>
                      {[0,1,2].map(j => (
                        <div key={j} style={{ width: 3, height: 3, borderRadius: '50%', background: M, opacity: 0.5, animation: `v4-blink ${0.8 + j*0.15}s ease-in-out infinite` }} />
                      ))}
                    </div>
                  );
                  if (msg.kind === 'npc') return (
                    <div key={i}><NpcCard name={msg.name} archetype={msg.archetype} tags={msg.tags} dialog={msg.dialog} /></div>
                  );
                  if (msg.kind === 'zone') return (
                    <div key={i}><ZoneCard name={msg.name} areal={msg.areal} npcCount={msg.npcCount} heat={msg.heat} biome={msg.biome} /></div>
                  );
                  if (msg.kind === 'faction') return (
                    <div key={i}><FactionCard name={msg.name} tagline={msg.tagline} color={msg.color} treasury={msg.treasury} members={msg.members} influence={msg.influence} /></div>
                  );
                  if (msg.kind === 'asset') return (
                    <div key={i}><AssetCard name={msg.name} type={msg.type} size={msg.size} polycount={msg.polycount} /></div>
                  );
                  return null;
                };

                return runs.map((run, ri) => {
                  const userMsg = run.find(m => m.kind === 'user');
                  const aiMsgs = run.filter(m => m.kind !== 'user');
                  return (
                    <div key={ri} style={{ marginTop: ri === 0 ? 4 : 28 }}>
                      {/* User bubble */}
                      {userMsg && userMsg.kind === 'user' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 10 }}>
                          <div style={{ maxWidth: '82%', background: 'rgba(255,255,255,0.04)', borderRadius: 3, padding: '8px 11px', fontSize: 13, color: T, lineHeight: 1.55 }}>
                            {userMsg.text}
                          </div>
                        </div>
                      )}
                      {/* AI block: avatar + thread line + content column */}
                      {aiMsgs.length > 0 && (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          {/* Left: avatar + vertical thread */}
                          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
                            <CAvatar />
                            {aiMsgs.length > 1 && (
                              <div style={{ width: 1, flex: 1, background: BRD, marginTop: 5 }} />
                            )}
                          </div>
                          {/* Right: all AI content stacked */}
                          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {aiMsgs.map((msg, i) => renderAiItem(msg, i))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
              <div ref={chatEndRef} />
            </div>

            {/* Input — V3 style */}
            <div style={{ padding: '10px 14px 12px', borderTop: `1px solid ${BRD}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                {(['Sparring', 'Plan', 'Build'] as const).map(m => (
                  <button key={m} onClick={() => setChatMode(m)} style={{ padding: 0, fontSize: 12, fontWeight: 400, color: chatMode === m ? ACCENT : DIM, background: 'none', border: 'none', cursor: 'pointer', borderBottom: chatMode === m ? `1px solid ${ACCENT}` : '1px solid transparent', paddingBottom: 2 }}>
                    {m}
                  </button>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BRD}`, borderRadius: 3, padding: '8px 10px' }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                  placeholder="Beskriv hva du vil bygge…"
                  rows={2}
                  style={{ width: '100%', background: 'none', border: 'none', color: T, fontSize: 13, resize: 'none', outline: 'none', lineHeight: 1.55, fontFamily: 'inherit', marginBottom: 4, minHeight: 36 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: DIM }}>economy</span>
                  <button onClick={sendMsg} style={{ width: 18, height: 18, background: 'none', color: M, border: 'none', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Send size={11} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Center panel — Verden / Kode / Terminal ── */}
          <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
            {/* Topbar with view tabs */}
            <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'stretch', padding: '0 4px 0 0', gap: 0, position: 'relative', zIndex: showPanelPicker ? 200 : 1 }}>
              {/* View tabs */}
              {centerTabs.map(({ id, Icon, label }) => {
                const active = centerView === id;
                return (
                  <button
                    key={id}
                    onClick={() => setCenterView(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '0 14px', height: '100%',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: active ? T : M, fontSize: 12, position: 'relative',
                      borderRight: `1px solid ${BRD}`,
                      transition: 'color 0.12s',
                    }}
                  >
                    <Icon size={11} strokeWidth={active ? 2 : 1.5} />
                    <span style={{ fontWeight: active ? 500 : 400 }}>{label}</span>
                    {active && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: ACCENT, borderRadius: '1px 1px 0 0' }} />}
                  </button>
                );
              })}

              {/* + Panel picker button */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => setShowPanelPicker(p => !p)}
                  title="Åpne panel"
                  style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: showPanelPicker ? ADIM : 'none', border: `1px solid ${showPanelPicker ? BRD : 'transparent'}`, borderRadius: 4, cursor: 'pointer', color: showPanelPicker ? ACCENT : M, margin: '0 4px' }}
                >
                  <Plus size={13} strokeWidth={1.5} />
                </button>

                {/* Dropdown panel picker */}
                {showPanelPicker && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: 200, background: '#0e0e12', border: `1px solid ${BRD}`, borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.6)', zIndex: 999, overflow: 'hidden' }}>
                    <div style={{ padding: '8px 12px 6px', fontSize: 10.5, color: DIM, fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${BRD}` }}>Verktøy-paneler</div>
                    {[
                      { Icon: FileCode,    label: 'Kode',       sub: 'Koderedigering'    },
                      { Icon: Play,        label: 'Terminal',   sub: 'Shell / kjøretid'  },
                      { Icon: GitBranch,   label: 'Git',        sub: 'Versjonshistorikk' },
                      { Icon: Lock,        label: 'Secrets',    sub: 'Miljøvariabler'    },
                      { Icon: Database,    label: 'Database',   sub: 'SQL / skjema'      },
                      { Icon: Network,     label: 'Nettverk',   sub: 'HTTP / WS-logger'  },
                      { Icon: FlaskConical,label: 'Tester',     sub: 'Enhet / e2e'       },
                      { Icon: Bot,         label: 'AI-agent',   sub: 'Kjøringer / logg'  },
                      { Icon: BookOpen,    label: 'Docs',       sub: 'Referanse'         },
                      { Icon: TrendingUp,  label: 'Profiler',   sub: 'Ytelse / flamme'   },
                    ].map(({ Icon, label, sub }) => (
                      <button
                        key={label}
                        onClick={() => setShowPanelPicker(false)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: `1px solid ${BRD2}` }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <Icon size={12} color={M} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 12, color: T }}>{label}</div>
                          <div style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace' }}>{sub}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }} />
              {/* World-specific status */}
              {centerView === 'world' && (
                <>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: DIM, alignSelf: 'center', paddingRight: 10 }}>58 FPS</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOOD, boxShadow: `0 0 5px ${GOOD}`, animation: 'v4-blink 2.4s ease-in-out infinite', alignSelf: 'center', marginRight: 14 }} />
                </>
              )}
              {/* Code-specific status */}
              {centerView === 'code' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 14 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: GOOD, background: 'rgba(136,217,153,0.1)', padding: '2px 7px', borderRadius: 3 }}>AI skriver</span>
                  <Loader2 size={10} color={ACCENT} style={{ animation: 'v4-spin 1s linear infinite' }} />
                </div>
              )}
              {/* Terminal-specific status */}
              {centerView === 'terminal' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 14 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: GOOD }}>6 / 8 bestått</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, animation: 'v4-blink 1.6s ease-in-out infinite' }} />
                </div>
              )}
            </div>

            {/* View content */}
            {centerView === 'world'    && <WorldCanvas tick={tick} />}
            {centerView === 'code'     && <CodeView tick={tick} />}
            {centerView === 'terminal' && <TerminalView tick={tick} />}

            {/* Bottom status bar — context-aware */}
            <div style={{ height: 28, borderTop: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: 'monospace', fontSize: 11.5, color: M, gap: 10, overflow: 'hidden', flexShrink: 0 }}>
              {centerView === 'world' && (
                <span key={tick} style={{ animation: 'v4-slide 0.4s ease-out' }}>
                  <span style={{ color: GOOD, marginRight: 4 }}>✓</span>
                  {['α→β rute etablert', 'NPC spawnet i ZONE_β', 'Hexcorp deal signert', 'Karavan ankom havna', 'Marcus Vela patruljerer'][tick % 5]}
                </span>
              )}
              {centerView === 'code' && (
                <>
                  <span style={{ color: DIM }}>patrol_ai.ts</span>
                  <span style={{ color: BRD }}>·</span>
                  <span style={{ color: DIM }}>TypeScript</span>
                  <span style={{ color: BRD }}>·</span>
                  <span style={{ color: ACCENT }}>AI · economy</span>
                  <div style={{ flex: 1 }} />
                  <span style={{ color: DIM }}>Ln {Math.min(Math.floor(tick * 0.85) + 4, 16)}, Col 1</span>
                </>
              )}
              {centerView === 'terminal' && (
                <>
                  <span style={{ color: GOOD }}>✓ 6 bestått</span>
                  <span style={{ color: DIM }}>·</span>
                  <span style={{ color: M }}>⌛ 2 kjører</span>
                  <div style={{ flex: 1 }} />
                  <span style={{ color: DIM, fontSize: 11 }}>node v22 · tsx</span>
                </>
              )}
            </div>
          </div>

          {/* ── Right panel ──────────────────────── */}
          <div style={{ width: assetsOpen ? assetW : 0, flexShrink: 0, borderLeft: assetsOpen ? `1px solid ${BRD}` : 'none', display: 'flex', flexDirection: 'column', background: B, position: 'relative', overflow: 'hidden', transition: 'width 0.18s ease' }}>
            <DragHandle which="asset" side="left" />

            {/* Header with kind tabs */}
            <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 3 }}>
              {rightIcons.map(({ k, I, l }) => {
                const active = rightKind === k;
                return (
                  <button key={k} onClick={() => setRightKind(k)} title={l} style={{ flex: 1, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: active ? ADIM : 'none', border: active ? `1px solid ${BRD}` : '1px solid transparent', borderRadius: 4, cursor: 'pointer', color: active ? ACCENT : M }}>
                    <I size={11} strokeWidth={1.5} />
                    <span style={{ fontSize: 11, display: assetW > 200 ? 'inline' : 'none' }}>{l}</span>
                  </button>
                );
              })}
            </div>

            {/* Assets list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              {rightKind === 'assets' && [
                { icon: Users,    n: 'Character_Marcus', size: '8.1mb',  cat: 'Modell', accent: ACCENT },
                { icon: Box,      n: 'hexcorp_wh_A.glb', size: '3.2mb',  cat: 'Modell', accent: M },
                { icon: Zap,      n: 'FX_Ammo',          size: '412kb',  cat: 'FX',     accent: WARM },
                { icon: Shield,   n: 'hexcorp_logo.svg', size: '18kb',   cat: 'Grafikk',accent: ACCENT },
                { icon: FileCode, n: 'patrol_ai.ts',     size: '4.2kb',  cat: 'Skript', accent: GOOD },
                { icon: FileCode, n: 'economy.ts',       size: '12kb',   cat: 'Skript', accent: GOOD },
                { icon: Box,      n: 'Stone_dock_01',    size: '3.4mb',  cat: 'Tekstur',accent: M },
              ].map(a => (
                <div key={a.n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderBottom: `1px solid ${BRD2}`, cursor: 'pointer' }}>
                  <a.icon size={11} color={a.accent} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: T, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.n}</div>
                    <div style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace' }}>{a.cat} · {a.size}</div>
                  </div>
                </div>
              ))}
              {rightKind === 'inspector' && (
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: DIM, fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Marcus Vela</div>
                    {[['Type', 'Historiekarakter'], ['Fraksjon', 'Hexcorp'], ['Ambisjon', '95'], ['Sone', 'ZONE_β']].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${BRD2}`, fontSize: 12 }}>
                        <span style={{ color: M }}>{k}</span>
                        <span style={{ color: T }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {rightKind === 'layers' && (
                <div style={{ padding: '8px 0' }}>
                  {['Karakterer · 6', 'Fraksjoner · 3', 'Soner · 2', 'Ruter · 7', 'Assets · 14'].map(l => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderBottom: `1px solid ${BRD2}` }}>
                      <Layers size={10} color={M} strokeWidth={1.5} />
                      <span style={{ fontSize: 12, color: T }}>{l}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Deliverables summary */}
            <div style={{ borderTop: `1px solid ${BRD}`, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, color: DIM, fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Dagens leveranser</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ v: '3', l: 'NPC-er', c: ACCENT }, { v: '2', l: 'Soner', c: GOOD }, { v: '1', l: 'Fraksjon', c: WARM }].map(s => (
                  <div key={s.l} style={{ flex: 1, textAlign: 'center', padding: '6px 4px', background: BRD2, border: `1px solid ${BRD}`, borderRadius: 4 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: DIM, marginTop: 1 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right icon rail */}
          <div
            style={{ width: 48, flexShrink: 0, borderLeft: `1px solid ${BRD}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 4, background: B }}
            className="bg-[#07070a]">
            {/* Assets panel toggle */}
            <button
              onClick={() => setAssetsOpen(o => !o)}
              title={assetsOpen ? 'Kollaps assets-panel' : 'Åpne assets-panel'}
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: assetsOpen ? ADIM : 'none', border: `1px solid ${assetsOpen ? BRD : 'transparent'}`, borderRadius: 5, cursor: 'pointer', color: assetsOpen ? ACCENT : M }}
            >
              <Package size={14} strokeWidth={1.5} />
            </button>
            {/* Divider */}
            <div style={{ width: 20, height: 1, background: BRD, margin: '2px 0' }} />
            {[Layers, Wrench, Box, Users, Star, Bell].map((Icon, i) => (
              <button key={i} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid transparent', borderRadius: 5, cursor: 'pointer', color: M }}>
                <Icon size={14} strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AutoCtx.Provider>
  );
}
