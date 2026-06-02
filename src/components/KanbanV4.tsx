import React, { useState, useEffect } from 'react';
import {
  Kanban, MessageSquare, FolderTree, GitBranch, Settings, History,
  Plus, Search, ChevronDown,
  Zap, Clock, CheckCircle2, GitMerge, AlertTriangle, Bot, Link2,
  Sparkles, Filter,
} from 'lucide-react';

/* ── Kald minimalisme — palett delt med Studio Pro V3 ───────────────── */
const B = '#0a0c12';
const SURF = '#0e1118';
const PANEL = '#131720';
const RAISED = '#181c26';
const BRD = 'rgba(255,255,255,0.07)';
const BRD2 = 'rgba(255,255,255,0.04)';
const T = '#ededed';
const M = '#6b6b70';
const DIM = '#3a3a3d';
const ACCENT = '#7cd4ff';
const ACCENT_DIM = 'rgba(124,212,255,0.12)';
const WARM = '#f5a96b';
const GOOD = '#88d999';
const BAD = '#f08a82';

/* ── Status-modell ──────────────────────────────────────────────────── */
type RunStatus = 'working' | 'done' | 'stuck' | 'question' | 'waiting';

const STATUS_COLOR: Record<RunStatus, string> = {
  working: GOOD, done: DIM, stuck: BAD, question: ACCENT, waiting: M,
};
const STATUS_TEXT: Record<RunStatus, string> = {
  working: T, done: DIM, stuck: BAD, question: ACCENT, waiting: M,
};
function StatusDot({ status, size = 6 }: { status: RunStatus; size?: number }) {
  const c = STATUS_COLOR[status];
  const pulse = status === 'working' || status === 'question' || status === 'stuck';
  return (
    <span className="relative flex items-center justify-center shrink-0" style={{ width: size + 4, height: size + 4 }}>
      {pulse && (
        <span
          className="absolute rounded-full"
          style={{ width: size + 4, height: size + 4, background: c, opacity: 0.18, animation: 'kbc-ping 1.8s ease-in-out infinite' }}
        />
      )}
      <span style={{ width: size, height: size, borderRadius: '50%', background: c, boxShadow: status === 'done' ? 'none' : `0 0 6px ${c}` }} />
    </span>
  );
}

/* ── Venstre ikon-rail ──────────────────────────────────────────────── */
const RAIL = [
  { icon: MessageSquare, label: 'Chat' },
  { icon: Kanban, label: 'Tavle' },
  { icon: FolderTree, label: 'Filer' },
  { icon: GitBranch, label: 'Git' },
  { icon: History, label: 'Historikk' },
  { icon: Settings, label: 'Innstillinger' },
];

function IconRail({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <aside
      style={{ width: 46, flexShrink: 0, borderRight: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${BRD}`, width: '100%' }}>
        <div style={{ width: 20, height: 20, borderRadius: 4, border: `1px solid ${ACCENT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 10px ${ACCENT_DIM}` }}>
          <Kanban size={11} color={ACCENT} strokeWidth={1.6} />
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 8 }}>
        {RAIL.map((item, i) => {
          const Icon = item.icon;
          const on = i === active;
          return (
            <button
              key={i}
              title={item.label}
              onClick={() => onSelect(i)}
              style={{ position: 'relative', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'rgba(255,255,255,0.04)' : 'none', border: 'none', borderRadius: 5, cursor: 'pointer' }}
            >
              {on && <span style={{ position: 'absolute', left: -8, top: 7, bottom: 7, width: 1.5, background: ACCENT, boxShadow: `0 0 5px ${ACCENT}` }} />}
              <Icon size={15} color={on ? T : M} strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
      <div style={{ flexShrink: 0, padding: '10px 0', borderTop: `1px solid ${BRD}`, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: T }}>B</div>
      </div>
    </aside>
  );
}

/* ── Kjøringer-panel (kontekst) ─────────────────────────────────────── */
interface Run { id: string; title: string; status: RunStatus; elapsed: string; }
const RUNS: Run[] = [
  { id: 'r1', title: 'factions.ts refactor', status: 'working', elapsed: '4m' },
  { id: 'r3', title: 'Hexcorp HQ 3D-gen', status: 'working', elapsed: '12m' },
  { id: 'r5', title: 'Marcus Vela dialog-tre', status: 'working', elapsed: '3m' },
  { id: 'r2', title: 'Live World patrol-ruter', status: 'question', elapsed: '45m' },
  { id: 'r4', title: 'Fraksjon-økonomi balanse', status: 'stuck', elapsed: '1t 2m' },
  { id: 'r9', title: 'NPC spawn test-run', status: 'stuck', elapsed: '8m' },
  { id: 'r6', title: 'Economy rebalance', status: 'done', elapsed: '18m' },
  { id: 'r7', title: 'Heat-decay system v2', status: 'waiting', elapsed: '—' },
];

function RunsPanel({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const active = RUNS.filter(r => r.status === 'working' || r.status === 'question').length;
  const stuck = RUNS.filter(r => r.status === 'stuck').length;
  return (
    <aside style={{ width: 264, flexShrink: 0, borderRight: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
        <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRD}`, borderRadius: 3, flexShrink: 0 }}>
          <Zap size={12} color={ACCENT} strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 13, color: T, lineHeight: 1.1, letterSpacing: '0.01em' }}>Kjøringer</span>
          <span style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace', lineHeight: 1.1 }}>{active} aktiv · {stuck} fast</span>
        </div>
        <button title="Ny" style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: `1px solid ${BRD}`, borderRadius: 3, color: M, cursor: 'pointer' }}>
          <Plus size={11} strokeWidth={1.5} />
        </button>
        <button title="Søk" style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
          <Search size={11} strokeWidth={1.5} />
        </button>
      </div>
      {/* Run list */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {RUNS.map(run => {
          const on = run.id === activeId;
          const c = STATUS_COLOR[run.status];
          return (
            <button
              key={run.id}
              onClick={() => onSelect(run.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '0 14px', height: 36, background: on ? `${c}0c` : 'none', border: 'none', borderLeft: `2px solid ${on ? c : 'transparent'}`, borderBottom: `1px solid ${BRD2}`, cursor: 'pointer', textAlign: 'left' }}
            >
              <StatusDot status={run.status} size={6} />
              <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: STATUS_TEXT[run.status], whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{run.title}</span>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: `${c}88`, flexShrink: 0 }}>{run.elapsed}</span>
            </button>
          );
        })}
      </div>
      {/* Footer */}
      <div style={{ flexShrink: 0, borderTop: `1px solid ${BRD}`, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', fontSize: 11, color: M, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          <Filter size={11} strokeWidth={1.5} /> Filtre
        </button>
        <button
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', height: 24, borderRadius: 3, fontSize: 11, fontWeight: 500, background: ACCENT_DIM, border: `1px solid ${ACCENT}`, color: ACCENT, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <Kanban size={11} strokeWidth={1.6} /> Kanban
        </button>
      </div>
    </aside>
  );
}

/* ── Kanban-data ────────────────────────────────────────────────────── */
interface Card { id: string; title: string; num: number; status: RunStatus; elapsed: string; blockedBy?: number; agent?: boolean; canStart?: boolean; }
interface Column { id: string; label: string; count: number; icon: React.ElementType; accent: string; cards: Card[]; }

const COLUMNS: Column[] = [
  {
    id: 'forslag', label: 'Forslag', count: 12, icon: Sparkles, accent: M,
    cards: [
      { id: 'f1', title: 'NPC Heat-decay system', num: 1048, status: 'waiting', elapsed: 'nå', agent: true, canStart: true },
      { id: 'f2', title: 'Patrol-ruter AI', num: 1049, status: 'waiting', elapsed: 'nå', agent: true, canStart: true },
      { id: 'f3', title: 'Fraksjon-økonomi balanse', num: 1052, status: 'waiting', elapsed: '2t', agent: true },
      { id: 'f4', title: 'Test-simulering økonomi', num: 1054, status: 'waiting', elapsed: '2t', agent: true },
    ],
  },
  {
    id: 'aktiv', label: 'Aktiv', count: 3, icon: Zap, accent: GOOD,
    cards: [
      { id: 'a1', title: 'Live World NPC System', num: 1047, status: 'working', elapsed: 'nå', agent: true },
      { id: 'a2', title: 'Research: NPC-tetthet', num: 1045, status: 'working', elapsed: '12 min', agent: true, blockedBy: 1047 },
      { id: 'a3', title: 'factions.ts gjennomgang', num: 1046, status: 'working', elapsed: '8 min', agent: true },
    ],
  },
  {
    id: 'ferdig', label: 'Ferdig', count: 8, icon: CheckCircle2, accent: ACCENT,
    cards: [
      { id: 'd1', title: 'Hexcorp HQ 3D-modell', num: 1044, status: 'done', elapsed: '3t' },
      { id: 'd2', title: 'Fil-utforsker redesign', num: 1043, status: 'done', elapsed: '5t' },
      { id: 'd3', title: 'Syntax highlighter', num: 1042, status: 'done', elapsed: '1d' },
    ],
  },
  {
    id: 'implementert', label: 'Implementert', count: 21, icon: GitMerge, accent: DIM,
    cards: [
      { id: 'i1', title: 'ExploreMode gallery cards', num: 1038, status: 'done', elapsed: '2d' },
      { id: 'i2', title: 'LiveWorld faction territories', num: 1036, status: 'done', elapsed: '3d' },
      { id: 'i3', title: 'Research mode', num: 1031, status: 'done', elapsed: '1u' },
    ],
  },
];

function KanbanCol({ col }: { col: Column }) {
  const Icon = col.icon;
  const hidden = col.count - col.cards.length;
  const muted = col.id === 'ferdig' || col.id === 'implementert';
  return (
    <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', minHeight: 0, borderRight: `1px solid ${BRD}` }}>
      {/* Column header */}
      <div style={{ height: 36, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
        <Icon size={12} color={col.accent} strokeWidth={1.5} />
        <span style={{ fontSize: 11.5, color: T, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', flex: 1 }}>{col.label}</span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: M, padding: '1px 6px', borderRadius: 8, border: `1px solid ${BRD}` }}>{col.count}</span>
        <button title="Ny" style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
          <Plus size={11} strokeWidth={1.5} />
        </button>
      </div>
      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
        {col.cards.map(card => (
          <div
            key={card.id}
            style={{ borderRadius: 4, border: `1px solid ${BRD}`, borderLeft: `2px solid ${STATUS_COLOR[card.status]}${muted ? '44' : ''}`, background: 'rgba(255,255,255,0.015)', padding: '9px 11px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 7 }}>
              <span style={{ marginTop: 1 }}><StatusDot status={card.status} size={5} /></span>
              <span style={{ flex: 1, fontSize: 12.5, lineHeight: 1.3, color: muted ? M : T, fontWeight: 400 }}>{card.title}</span>
            </div>
            {card.blockedBy && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                <Link2 size={10} color={WARM} strokeWidth={1.6} style={{ opacity: 0.7 }} />
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: WARM, opacity: 0.8 }}>Blokkert av #{card.blockedBy}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontFamily: 'monospace', color: DIM }}>
              {card.agent && <Bot size={11} color={ACCENT} strokeWidth={1.5} style={{ opacity: 0.55 }} />}
              <span>#{card.num}</span>
              <span style={{ flex: 1 }} />
              <Clock size={10} strokeWidth={1.5} />
              <span>{card.elapsed}</span>
            </div>
            {card.canStart && (
              <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 9px', height: 22, borderRadius: 3, fontSize: 11, fontWeight: 500, background: ACCENT_DIM, border: `1px solid ${ACCENT}`, color: ACCENT, cursor: 'pointer' }}>
                  <Zap size={10} strokeWidth={2} /> Start
                </button>
                <button style={{ display: 'flex', alignItems: 'center', padding: '0 9px', height: 22, borderRadius: 3, fontSize: 11, background: 'none', border: `1px solid ${BRD}`, color: M, cursor: 'pointer' }}>
                  Vis plan
                </button>
              </div>
            )}
          </div>
        ))}
        {hidden > 0 && (
          <button style={{ width: '100%', padding: '7px 0', borderRadius: 4, border: `1px dashed ${BRD}`, background: 'none', fontSize: 10.5, fontFamily: 'monospace', color: DIM, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <ChevronDown size={11} strokeWidth={1.5} /> {hidden} til
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Hovedkomponent ─────────────────────────────────────────────────── */
export function KanbanV4() {
  const [railActive, setRailActive] = useState(1);
  const [activeRunId, setActiveRunId] = useState('r1');
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1600);
    return () => clearInterval(id);
  }, []);

  const pendingApprovals = COLUMNS.find(c => c.id === 'aktiv')?.cards.length ?? 0;

  return (
    <div style={{ height: '100vh', width: '100%', background: B, color: T, display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      <style>{`
        @keyframes kbc-ping { 0% { transform: scale(0.7); opacity: 0.4; } 80%,100% { transform: scale(2); opacity: 0; } }
        @keyframes kbc-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        *::-webkit-scrollbar { width: 7px; height: 7px; }
        *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        *::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* ── Topp-bar ── */}
      <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, background: B }}>
        <Kanban size={14} color={ACCENT} strokeWidth={1.5} />
        <span style={{ fontSize: 13.5, color: T, letterSpacing: '0.01em' }}>Oppgave-Kanban</span>
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: M }}>Region_01 · <span style={{ color: ACCENT }}>cycle {4 + (tick % 3)}</span></span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'monospace', color: M }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOOD, boxShadow: `0 0 6px ${GOOD}`, animation: 'kbc-blink 1.6s ease-in-out infinite' }} />
            {12 + (tick % 4)}ms
          </span>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 26, borderRadius: 3, fontSize: 12, fontWeight: 500, background: ACCENT_DIM, border: `1px solid ${ACCENT}`, color: ACCENT, cursor: 'pointer' }}>
            <CheckCircle2 size={12} strokeWidth={1.6} /> Godkjenn alle ({pendingApprovals})
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        <IconRail active={railActive} onSelect={setRailActive} />
        <RunsPanel activeId={activeRunId} onSelect={setActiveRunId} />

        {/* Kanban-tavle */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, background: B }}>
          {/* Stat-stripe */}
          <div style={{ height: 26, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 18, fontFamily: 'monospace', fontSize: 11.5 }}>
            {COLUMNS.map(c => (
              <span key={c.id} style={{ color: M }}>
                <span style={{ color: c.accent === DIM || c.accent === M ? T : c.accent }}>{c.count}</span>
                <span style={{ color: DIM, marginLeft: 5, textTransform: 'lowercase' }}>{c.label}</span>
              </span>
            ))}
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: DIM }}>
              <AlertTriangle size={11} color={BAD} strokeWidth={1.5} /> 2 blokkert
            </span>
          </div>
          {/* Kolonner */}
          <div style={{ flex: 1, display: 'flex', minHeight: 0, overflowX: 'auto' }}>
            {COLUMNS.map(col => <KanbanCol key={col.id} col={col} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KanbanV4;
