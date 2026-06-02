import React, { useState, useCallback, useEffect } from 'react';
import {
  Play, Sparkles, Save, Search, FileCode, FolderOpen, Folder,
  GitBranch, Settings, Terminal as TerminalIcon,
  ChevronRight, ChevronDown, CircleDot, Send, X,
  AlertCircle, CheckCircle2, Plus,
  MessageSquare, FolderTree, Cpu, History,
  PanelLeftClose, PanelLeftOpen, Loader2, GitMerge, AlertTriangle,
  CornerDownRight, Clock, Wand2, FileText,
  ListTree, Bug, Wrench, BookOpen, MoreHorizontal,
  Hash, Type, Box,
  Monitor, Database, Network, Workflow, KeyRound,
  Shield, BarChart3, Lock, Image as ImageIcon,
  TerminalSquare, Rocket, Globe,
} from 'lucide-react';

const B = '#0a0c12';
const SURF = '#0e1118';
const PANEL = '#131720';
const RAISED = '#181c26';
const BRD = 'rgba(255,255,255,0.07)';
const BRD2 = 'rgba(255,255,255,0.04)';
const T = '#ededed';
const M = '#6b6b70';
const DIM = '#3a3a3d';
const ICE = '#ffffff';
const ACCENT = '#7cd4ff';
const ACCENT_DIM = 'rgba(124,212,255,0.12)';
const WARM = '#f5a96b';
const GOOD = '#88d999';
const BAD = '#f08a82';

const KW = '#c891ff';
const STR = '#a8d99a';
const NUM = '#f5a96b';
const COM = '#5a5a5e';
const FN = '#7cd4ff';
const PROP = '#ededed';

type TopTab = 'Build' | 'Content' | 'Systems' | 'Region' | 'Director' | 'Liv';
type RailKind = 'chat' | 'files' | 'git' | 'systems' | 'settings' | 'history';

type FileNode = {
  id: string;
  label: string;
  kind: 'dir' | 'file';
  depth: number;
  expanded?: boolean;
  modified?: boolean;
};

const TREE: FileNode[] = [
  { id: 'src',         label: 'src',                  kind: 'dir',  depth: 0, expanded: true },
  { id: 'systems',     label: 'systems',              kind: 'dir',  depth: 1, expanded: true },
  { id: 'econ',        label: 'economy.ts',           kind: 'file', depth: 2, modified: true },
  { id: 'traffic',     label: 'traffic.ts',           kind: 'file', depth: 2 },
  { id: 'weather',     label: 'weather.ts',           kind: 'file', depth: 2 },
  { id: 'npcs',        label: 'npcs',                 kind: 'dir',  depth: 1, expanded: false },
  { id: 'zones',       label: 'zones',                kind: 'dir',  depth: 1, expanded: true },
  { id: 'zalpha',      label: 'zone_alpha.json',      kind: 'file', depth: 2 },
  { id: 'zbeta',       label: 'zone_beta.json',       kind: 'file', depth: 2 },
  { id: 'index',       label: 'index.ts',             kind: 'file', depth: 1 },
  { id: 'assets',      label: 'assets',               kind: 'dir',  depth: 0, expanded: false },
  { id: 'pkg',         label: 'package.json',         kind: 'file', depth: 0 },
  { id: 'readme',      label: 'README.md',            kind: 'file', depth: 0 },
];

type OpenTab = { id: string; label: string; dirty?: boolean };

const OPEN_TABS: OpenTab[] = [
  { id: 'econ',    label: 'economy.ts',      dirty: true },
  { id: 'traffic', label: 'traffic.ts' },
  { id: 'zalpha',  label: 'zone_alpha.json' },
];

type Diag = { line: number; col: number; sev: 'err' | 'warn'; msg: string };

const DIAGS: Diag[] = [
  { line: 14, col: 23, sev: 'warn', msg: "'priceCap' is declared but its value is never read." },
  { line: 38, col: 12, sev: 'err',  msg: "Type 'string' is not assignable to type 'number'." },
];

type RunStatus = 'running' | 'awaiting_accept' | 'awaiting_merge' | 'awaiting_confirm' | 'queued' | 'done';
type Run = { id: string; title: string; sub?: string; status: RunStatus; progress?: number; step?: string; depth: number };

const AGENT_RUNS: Run[] = [
  { id: 'r1',  title: 'Refaktor economy.ts',        sub: 'fix type på priceCap', status: 'running', progress: 67, step: '8/12', depth: 0 },
  { id: 'r1a', title: 'Kjør tsc --noEmit',          sub: 'venter på r1', status: 'queued', depth: 1 },
  { id: 'r1b', title: 'Oppdater tester',            sub: 'venter på r1', status: 'queued', depth: 1 },
  { id: 'r2',  title: 'Generer traffic-modul',      sub: 'Plan-runde · 5 steg', status: 'running', progress: 32, step: '4/12', depth: 0 },
  { id: 'r3',  title: 'Refaktor zone-loader',       sub: 'patch klar — 6 filer', status: 'awaiting_merge', depth: 0 },
  { id: 'r4',  title: 'Skriv om weather.ts',        sub: 'patch klar — 2 filer', status: 'awaiting_accept', depth: 0 },
  { id: 'r5',  title: 'Slett gammel zone_test',     sub: 'destruktiv — krever bekreftelse', status: 'awaiting_confirm', depth: 0 },
];

const STATUS_META: Record<RunStatus, { label: string; Icon: React.ElementType; dot: string }> = {
  running:          { label: 'kjører',   Icon: Loader2,       dot: ACCENT },
  awaiting_accept:  { label: 'godkjenn', Icon: ChevronRight,  dot: WARM },
  awaiting_merge:   { label: 'merge',    Icon: GitMerge,      dot: WARM },
  awaiting_confirm: { label: 'bekreft',  Icon: AlertTriangle, dot: WARM },
  queued:           { label: 'i kø',     Icon: Clock,         dot: DIM },
  done:             { label: 'ferdig',   Icon: CheckCircle2,  dot: GOOD },
};

export default function StudioProV4Code() {
  const [topTab, setTopTab] = useState<TopTab>('Build');
  const [activeRailItem, setActiveRailItem] = useState(0);
  const [railExpanded, setRailExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('econ');
  const [tree, setTree] = useState<FileNode[]>(TREE);
  const [chatInput, setChatInput] = useState('');
  const [chatW, setChatW] = useState(296);
  const [rightW, setRightW] = useState(280);
  const [dragging, setDragging] = useState<null | 'chat' | 'right'>(null);
  const [termTab, setTermTab] = useState<'problems' | 'terminal' | 'output'>('problems');
  const [rightKind, setRightKind] = useState<'outline' | 'problems' | 'changes' | 'snippets' | 'notes'>('outline');
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [launcherQ, setLauncherQ] = useState('');

  useEffect(() => {
    if (!launcherOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLauncherOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [launcherOpen]);

  const visibleTree = computeVisible(tree);

  function toggleDir(id: string) {
    setTree(prev => prev.map(n => n.id === id ? { ...n, expanded: !n.expanded } : n));
  }

  const onDragStart = useCallback((which: 'chat' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(which);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const which = dragging;
    const onMove = (e: MouseEvent) => {
      if (which === 'chat') {
        setChatW(prev => Math.max(220, Math.min(520, prev + e.movementX)));
      } else {
        setRightW(prev => Math.max(220, Math.min(480, prev - e.movementX)));
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

  const railIcons = [MessageSquare, FolderTree, GitBranch, Cpu, Settings, History];
  const railLabels = ['Chat', 'Files', 'Git', 'Systems', 'Settings', 'History'];
  const railKinds: RailKind[] = ['chat', 'files', 'git', 'systems', 'settings', 'history'];
  const activeKind = railKinds[activeRailItem];
  const railMeta: ({ badge: string } | null)[] = [{ badge: '3' }, { badge: '24' }, { badge: '1' }, null, null, null];

  const tk: ChatTk = { B, BRD, BRD2, T, M, DIM, ICE, ACCENT, ACCENT_DIM, WARM, GOOD, BAD };

  return (
    <div className="sp3c-root" style={{
      width: '100%', height: '100vh', background: B, color: T,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
      fontSize: 13, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        .sp3c-root *::-webkit-scrollbar { width: 8px; height: 8px; }
        .sp3c-root *::-webkit-scrollbar-track { background: transparent; }
        .sp3c-root *::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: content-box;
          transition: background 0.15s;
        }
        .sp3c-root *::-webkit-scrollbar-thumb:hover {
          background: ${ACCENT_DIM};
          background-clip: content-box;
        }
        .sp3c-root *::-webkit-scrollbar-thumb:active {
          background: ${ACCENT};
          background-clip: content-box;
        }
        .sp3c-root *::-webkit-scrollbar-corner { background: transparent; }
        .sp3c-root * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent; }
        .sp3c-root *:hover { scrollbar-color: ${ACCENT_DIM} transparent; }
        @keyframes sp3c-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>
      {/* ============ TOP BAR ============ */}
      <header style={{ height: 44, flexShrink: 0, borderBottom: `1px solid ${BRD}`, background: B, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: '100%' }}>
          <img src="/__mockup/images/asteon-wordmark-white.png" alt="ASTEON" style={{ height: 23, opacity: 0.85, userSelect: 'none', marginRight: 28 }} draggable={false} />
          <nav style={{ display: 'flex', height: '100%', gap: 0 }}>
            {(['Build', 'Content', 'Systems', 'Region', 'Director', 'Liv'] as const).map(t => {
              const active = topTab === t;
              return (
                <button key={t} onClick={() => setTopTab(t)}
                  style={{ position: 'relative', padding: '0 14px', height: '100%', fontSize: 13, fontWeight: active ? 500 : 400, color: active ? T : M, background: 'none', border: 'none', cursor: 'pointer' }}>
                  {t}
                  {active && <span style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 1, background: ACCENT, boxShadow: `0 0 5px ${ACCENT}` }} />}
                </button>
              );
            })}
            <button style={{ position: 'relative', padding: '0 14px', height: '100%', fontSize: 13, fontWeight: 500, color: T, background: 'none', border: 'none', cursor: 'pointer' }}>
              Kode-editor
              <span style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 1, background: ACCENT, boxShadow: `0 0 5px ${ACCENT}` }} />
            </button>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: WARM, fontSize: 12 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: WARM }} /> Ulagrede endringer
          </span>
          <span title="Budget · tokens" style={{ fontFamily: 'monospace', fontSize: 12, color: M }}>
            <span style={{ color: T }}>$0.42</span>
            <span style={{ color: DIM, margin: '0 6px' }}>·</span>
            <span style={{ color: T }}>500</span>
          </span>
          <button title="Søk i filer (⌘P)" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 9px 4px 8px', height: 24, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}`, borderRadius: 3, color: M, cursor: 'pointer', fontSize: 12 }}>
            <Search size={11} strokeWidth={1.5} />
            <span style={{ color: DIM }}>Søk i filer…</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10.5, color: DIM, border: `1px solid ${BRD}`, padding: '0 4px', borderRadius: 2 }}>⌘P</span>
          </button>
          <button title="Kjør" style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
            <Play size={13} strokeWidth={1.5} />
          </button>
          <button title="AI" style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
            <Sparkles size={13} strokeWidth={1.5} />
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px', height: 26, background: ICE, color: B, fontSize: 13, fontWeight: 600, borderRadius: 4, border: 'none', cursor: 'pointer' }}>
            <Save size={12} /> Save
          </button>
        </div>
      </header>

      {/* ============ BELOW-HEADER ROW ============ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', minHeight: 0 }}>

        {/* ============ LEFT RAIL (V3-style: collapsible) ============ */}
        <aside style={{ width: railExpanded ? 240 : 44, flexShrink: 0, borderRight: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column', transition: 'width 0.18s ease', overflow: 'hidden' }}>

          {/* Rail header */}
          <div style={{ height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: railExpanded ? 'space-between' : 'center', padding: railExpanded ? '0 10px 0 14px' : 0 }}>
            {railExpanded && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: T }}>{railLabels[activeRailItem]}</span>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
              </div>
            )}
            <button
              onClick={() => setRailExpanded(v => !v)}
              title={railExpanded ? 'Kollaps' : 'Utvid'}
              style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: DIM, cursor: 'pointer' }}
            >
              {railExpanded ? <PanelLeftClose size={12} /> : <PanelLeftOpen size={12} />}
            </button>
          </div>

          {/* Context tabs */}
          {!railExpanded ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0', gap: 1 }}>
              {railIcons.map((Icon, i) => (
                <button
                  key={i}
                  onClick={() => setActiveRailItem(i)}
                  title={railLabels[i]}
                  style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: activeRailItem === i ? T : DIM, cursor: 'pointer', position: 'relative' }}
                >
                  <Icon size={14} strokeWidth={1.4} />
                  {railMeta[i] && (
                    <span style={{ position: 'absolute', top: 4, right: 4, fontSize: 9, fontFamily: 'monospace', color: M }}>{railMeta[i]!.badge}</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2px 8px 6px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {railIcons.map((Icon, i) => (
                <button
                  key={i}
                  onClick={() => setActiveRailItem(i)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', background: 'none', border: 'none', color: activeRailItem === i ? T : M, cursor: 'pointer', textAlign: 'left', width: '100%', position: 'relative' }}
                >
                  {activeRailItem === i && (
                    <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1.5, background: ACCENT, boxShadow: `0 0 4px ${ACCENT}` }} />
                  )}
                  <Icon size={13} strokeWidth={1.4} color={activeRailItem === i ? T : M} />
                  <span style={{ fontSize: 13, fontWeight: activeRailItem === i ? 500 : 400, flex: 1 }}>{railLabels[i]}</span>
                  {railMeta[i] && (
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: DIM }}>{railMeta[i]!.badge}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Runs */}
          {railExpanded && (
            <>
              <div style={{ padding: '14px 14px 6px', marginTop: 6, borderTop: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: M, fontWeight: 500 }}>Runs</span>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: DIM }}>{AGENT_RUNS.length}</span>
              </div>

              <div style={{ flex: 1, overflow: 'auto', padding: '2px 8px 12px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {AGENT_RUNS.map((run) => {
                  const meta = STATUS_META[run.status];
                  const Icon = meta.Icon;
                  const isChild = run.depth > 0;
                  return (
                    <div key={run.id} style={{ display: 'flex', gap: 4, paddingLeft: isChild ? 16 : 0, position: 'relative' }}>
                      {isChild && (
                        <CornerDownRight size={9} color={DIM} style={{ position: 'absolute', left: 4, top: 11 }} />
                      )}
                      <div style={{ flex: 1, padding: '7px 8px', borderRadius: 3, cursor: 'pointer', minWidth: 0, borderBottom: `1px solid ${BRD2}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <Icon size={10} color={meta.dot} strokeWidth={1.5} className={run.status === 'running' ? 'animate-spin' : ''} />
                          <span style={{ fontSize: 12.5, color: T, fontWeight: 400, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{run.title}</span>
                          <span style={{ fontSize: 10, fontFamily: 'monospace', color: M, letterSpacing: '0.04em' }}>{meta.label}</span>
                        </div>
                        {run.sub && (
                          <div style={{ fontSize: 11.5, color: M, fontFamily: run.status === 'running' ? 'monospace' : 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.4, paddingLeft: 16 }}>{run.sub}</div>
                        )}
                        {run.status === 'running' && run.progress !== undefined && (
                          <div style={{ marginTop: 5, marginLeft: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ flex: 1, height: 1, background: BRD, overflow: 'hidden' }}>
                              <div style={{ width: `${run.progress}%`, height: '100%', background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
                            </div>
                            <span style={{ fontSize: 10, fontFamily: 'monospace', color: DIM }}>{run.step}</span>
                          </div>
                        )}
                        {(run.status === 'awaiting_accept' || run.status === 'awaiting_merge' || run.status === 'awaiting_confirm') && (
                          <div style={{ marginTop: 5, marginLeft: 16, display: 'flex', gap: 4 }}>
                            <button style={{ fontSize: 11, padding: '2px 8px', color: B, fontWeight: 500, background: ICE, border: 'none', borderRadius: 2, cursor: 'pointer' }}>
                              {run.status === 'awaiting_accept' && 'Godkjenn'}
                              {run.status === 'awaiting_merge' && 'Merge'}
                              {run.status === 'awaiting_confirm' && 'Bekreft'}
                            </button>
                            <button style={{ fontSize: 11, padding: '2px 8px', color: M, background: 'none', border: 'none', cursor: 'pointer' }}>Avvis</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Footer — avatar */}
          <div style={{ flexShrink: 0, padding: railExpanded ? '10px 14px' : '10px 0', borderTop: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', gap: 9, justifyContent: railExpanded ? 'flex-start' : 'center' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.06)', border: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: T }}>B</div>
            {railExpanded && (
              <div style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
                <div style={{ fontSize: 12.5, color: T, fontWeight: 400 }}>Builder</div>
                <div style={{ fontSize: 11, color: DIM, fontFamily: 'monospace' }}>gpt-fast</div>
              </div>
            )}
          </div>
        </aside>

        {/* ============ CONTEXT PANEL (chat / files / etc) ============ */}
        <aside style={{ width: chatW, flexShrink: 0, borderRight: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            onMouseDown={onDragStart('chat')}
            title="Dra for å justere"
            style={{ position: 'absolute', top: 0, right: -3, bottom: 0, width: 6, cursor: 'col-resize', zIndex: 10, background: dragging === 'chat' ? 'rgba(255,255,255,0.12)' : 'transparent', transition: 'background 0.12s' }}
          />

          {/* ── Context-aware panel header ── */}
          {(() => {
            const HeaderIcon = railIcons[activeRailItem];
            const sub: Record<RailKind, string> = {
              chat: 'gpt-fast · economy.ts',
              files: 'src · 124 filer',
              git: 'main · 3 endringer',
              systems: '8 systemer · 2 aktive',
              settings: 'workspace · personlig',
              history: 'siste 24 t · 18 hendelser',
            };
            return (
              <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
                <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRD}`, borderRadius: 3, flexShrink: 0 }}>
                  <HeaderIcon size={12} color={ACCENT} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, color: T, lineHeight: 1.1, letterSpacing: '0.01em' }}>{railLabels[activeRailItem]}</span>
                  <span style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub[activeKind]}</span>
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
            );
          })()}

          <div style={{ flex: 1, overflow: 'auto', padding: activeKind === 'files' ? '6px 0' : '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {activeKind === 'chat' && <ChatThread tk={tk} />}

            {activeKind === 'files' && (
              <>
                <div style={{ fontSize: 11, color: DIM, letterSpacing: '0.08em', padding: '4px 14px 6px', textTransform: 'uppercase' }}>
                  asteon-world
                </div>
                {visibleTree.map(n => (
                  <button key={n.id} onClick={() => n.kind === 'dir' ? toggleDir(n.id) : setActiveTab(n.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 4,
                      padding: '3px 14px', paddingLeft: 14 + n.depth * 12, height: 22,
                      background: n.kind === 'file' && activeTab === n.id ? ACCENT_DIM : 'none',
                      border: 'none', color: n.kind === 'file' && activeTab === n.id ? ICE : T,
                      cursor: 'pointer', fontSize: 12.5, textAlign: 'left' }}>
                    {n.kind === 'dir' ? (
                      <>
                        {n.expanded ? <ChevronDown size={11} color={M} /> : <ChevronRight size={11} color={M} />}
                        {n.expanded ? <FolderOpen size={12} color={WARM} /> : <Folder size={12} color={WARM} />}
                      </>
                    ) : (
                      <>
                        <span style={{ width: 11 }} />
                        <FileCode size={12} color={fileColor(n.label)} />
                      </>
                    )}
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {n.label}
                    </span>
                    {n.modified && <span style={{ width: 6, height: 6, borderRadius: '50%', background: WARM }} />}
                  </button>
                ))}
              </>
            )}

            {activeKind === 'git' && (
              <div style={{ padding: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T, marginBottom: 12 }}>
                  <GitBranch size={11} color={ACCENT} /> main
                </div>
                <div style={{ fontSize: 11, color: M, letterSpacing: '0.08em', marginBottom: 6 }}>ENDRINGER · 1</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '3px 0' }}>
                  <span style={{ color: WARM, fontFamily: 'monospace', width: 12 }}>M</span>
                  <FileCode size={11} color={ACCENT} />
                  <span style={{ color: T }}>src/systems/economy.ts</span>
                </div>
              </div>
            )}

            {activeKind === 'systems' && (
              <div style={{ padding: 4, fontSize: 12.5, color: T, lineHeight: 1.6 }}>
                <div style={{ fontSize: 11, color: M, letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>Aktive systemer</div>
                {['Economy · v2', 'Traffic · v1', 'Weather · v3', 'NPC AI · v1'].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
                    <Cpu size={11} color={ACCENT} /> {s}
                  </div>
                ))}
              </div>
            )}

            {activeKind === 'settings' && (
              <div style={{ padding: 4, fontSize: 12, color: M }}>Ingen åpne innstillinger</div>
            )}

            {activeKind === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { time: '14:32', msg: 'economy.ts modifisert' },
                  { time: '14:28', msg: 'Lagt til zone_alpha.json' },
                  { time: '14:15', msg: 'Initial commit' },
                ].map((entry, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 4px', borderBottom: i < 2 ? `1px solid ${BRD2}` : 'none', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: DIM, flexShrink: 0 }}>{entry.time}</span>
                    <span style={{ fontSize: 13, color: M, lineHeight: 1.4 }}>{entry.msg}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat composer — only when chat tab is active */}
          {activeKind === 'chat' && (
            <div style={{ borderTop: `1px solid ${BRD}`, padding: 8, display: 'flex', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Spør om koden, foreslå refaktor…"
                rows={2}
                style={{
                  flex: 1, background: B, border: `1px solid ${BRD}`, borderRadius: 3,
                  color: T, fontSize: 12, padding: '6px 8px', outline: 'none', resize: 'none',
                  fontFamily: 'inherit', lineHeight: 1.4,
                }}
              />
              <button style={{ width: 28, height: 28, background: ACCENT_DIM, border: `1px solid ${ACCENT}`, borderRadius: 3, color: ICE, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Send size={12} />
              </button>
            </div>
          )}
        </aside>

        {/* ============ EDITOR + TERMINAL ============ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          {/* tab strip */}
          <div style={{ height: 32, display: 'flex', alignItems: 'stretch', borderBottom: `1px solid ${BRD}`, background: B, flexShrink: 0 }}>
            {OPEN_TABS.map(t => {
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px',
                  background: 'none',
                  border: 'none', borderRight: `1px solid ${BRD}`,
                  color: active ? T : M, cursor: 'pointer', fontSize: 12.5,
                }}>
                  <FileCode size={11} color={fileColor(t.label)} />
                  <span>{t.label}</span>
                  {active && <span style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 1, background: ACCENT, boxShadow: `0 0 5px ${ACCENT}` }} />}
                  {t.dirty
                    ? <CircleDot size={9} color={WARM} />
                    : <X size={11} color={DIM} />}
                </button>
              );
            })}
            <button
              onClick={() => { setLauncherOpen(true); setLauncherQ(''); }}
              title="Ny fane (⌘T)"
              style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', borderRight: `1px solid ${BRD}`, color: M, cursor: 'pointer' }}
            >
              <Plus size={13} strokeWidth={1.6} />
            </button>
            <div style={{ flex: 1 }} />
          </div>

          {/* breadcrumb */}
          <div style={{ height: 22, display: 'flex', alignItems: 'center', padding: '0 14px', borderBottom: `1px solid ${BRD}`, fontSize: 11.5, color: M, gap: 4, flexShrink: 0 }}>
            <span>src</span><ChevronRight size={10} color={DIM} />
            <span>systems</span><ChevronRight size={10} color={DIM} />
            <span style={{ color: T }}>economy.ts</span>
            <span style={{ color: DIM, margin: '0 6px' }}>›</span>
            <span style={{ color: ACCENT }}>computeMarketPrice</span>
          </div>

          {/* editor */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, background: B }}>
            <CodeEditor />
          </div>

          {/* terminal panel */}
          <div style={{ height: 200, borderTop: `1px solid ${BRD}`, display: 'flex', flexDirection: 'column', background: B, flexShrink: 0 }}>
            <div style={{ height: 28, display: 'flex', alignItems: 'stretch', borderBottom: `1px solid ${BRD}`, paddingLeft: 4 }}>
              {([
                { id: 'problems', label: 'Problemer', count: DIAGS.length },
                { id: 'terminal', label: 'Terminal' },
                { id: 'output',   label: 'Output' },
              ] as { id: typeof termTab; label: string; count?: number }[]).map(t => {
                const active = termTab === t.id;
                return (
                  <button key={t.id} onClick={() => setTermTab(t.id)} style={{
                    padding: '0 14px', height: '100%', background: 'none', border: 'none',
                    borderBottom: active ? `1px solid ${ACCENT}` : '1px solid transparent',
                    color: active ? T : M, cursor: 'pointer', fontSize: 12,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {t.label}
                    {t.count !== undefined && (
                      <span style={{ fontSize: 10, color: WARM, background: 'rgba(245,169,107,0.12)', padding: '1px 5px', borderRadius: 8 }}>
                        {t.count}
                      </span>
                    )}
                  </button>
                );
              })}
              <div style={{ flex: 1 }} />
              <button style={{ width: 28, height: '100%', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
                <X size={12} />
              </button>
            </div>

            {termTab === 'problems' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0', fontFamily: 'monospace', fontSize: 12 }}>
                {DIAGS.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 14px' }}>
                    {d.sev === 'err'
                      ? <AlertCircle size={12} color={BAD} />
                      : <AlertCircle size={12} color={WARM} />}
                    <span style={{ color: T }}>{d.msg}</span>
                    <span style={{ color: M }}>economy.ts</span>
                    <span style={{ color: DIM }}>[{d.line},{d.col}]</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 14px', color: GOOD }}>
                  <CheckCircle2 size={12} /> <span>Build OK · 2 advarsler, 1 feil</span>
                </div>
              </div>
            )}

            {termTab === 'terminal' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px', fontFamily: 'monospace', fontSize: 12, color: T, lineHeight: 1.5 }}>
                <div><span style={{ color: GOOD }}>$</span> pnpm --filter @workspace/sync run dev</div>
                <div style={{ color: M }}>[dev] starting Sync Coordination on :8083</div>
                <div style={{ color: M }}>[dev] connected to postgres</div>
                <div style={{ color: ACCENT }}>[dev] ready in 412ms</div>
                <div><span style={{ color: GOOD }}>$</span> <span style={{ background: T, color: B, padding: '0 2px' }}>_</span></div>
              </div>
            )}

            {termTab === 'output' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px', fontFamily: 'monospace', fontSize: 12, color: M }}>
                [tsc] econ.ts(38,12): Type 'string' is not assignable to type 'number'.
              </div>
            )}
          </div>

          {/* status bar */}
          <div style={{ height: 22, display: 'flex', alignItems: 'center', padding: '0 12px', background: B, borderTop: `1px solid ${BRD}`, fontSize: 11.5, color: M, gap: 14, flexShrink: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <GitBranch size={10} /> main
            </span>
            <span style={{ color: WARM }}>● 1</span>
            <span style={{ color: BAD }}>⊘ 1</span>
            <span style={{ color: WARM }}>△ 2</span>
            <div style={{ flex: 1 }} />
            <span>Ln 38, Col 12</span>
            <span>UTF-8</span>
            <span>LF</span>
            <span style={{ color: ACCENT }}>TypeScript</span>
          </div>
        </div>

        {/* ============ RIGHT ASSET PANEL ============ */}
        <aside style={{ width: rightW, flexShrink: 0, borderLeft: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            onMouseDown={onDragStart('right')}
            title="Dra for å justere"
            style={{ position: 'absolute', top: 0, left: -3, bottom: 0, width: 6, cursor: 'col-resize', zIndex: 10, background: dragging === 'right' ? 'rgba(255,255,255,0.12)' : 'transparent', transition: 'background 0.12s' }}
          />

          {/* Header — same style as chat panel header */}
          {(() => {
            const rightMeta: Record<typeof rightKind, { icon: React.ElementType; label: string; sub: string }> = {
              outline:  { icon: ListTree, label: 'Struktur',  sub: `economy.ts · 8 symboler` },
              problems: { icon: Bug,      label: 'Problemer', sub: `${DIAGS.length} · economy.ts` },
              changes:  { icon: GitMerge, label: 'Endringer', sub: '3 filer · main' },
              snippets: { icon: BookOpen, label: 'Snippets',  sub: '12 · alle språk' },
              notes:    { icon: FileText, label: 'Notater',   sub: '2 notater · i dag' },
            };
            const meta = rightMeta[rightKind];
            const RIcon = meta.icon;
            return (
              <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
                <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRD}`, borderRadius: 3, flexShrink: 0 }}>
                  <RIcon size={12} color={ACCENT} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, color: T, lineHeight: 1.1, letterSpacing: '0.01em' }}>{meta.label}</span>
                  <span style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta.sub}</span>
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
            );
          })()}

          {/* Filter input */}
          <div style={{ padding: '8px 14px', borderBottom: `1px solid ${BRD}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${BRD}`, padding: '3px 0' }}>
              <Search size={11} color={DIM} />
              <span style={{ fontSize: 12, color: DIM }}>
                {rightKind === 'outline' ? 'Filtrer symboler…' :
                 rightKind === 'snippets' ? 'Søk snippets…' : 'Søk…'}
              </span>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
            {rightKind === 'outline' && (
              <div style={{ fontFamily: 'monospace', fontSize: 12.5 }}>
                <div style={{ fontSize: 10.5, color: DIM, padding: '4px 14px 6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>economy.ts</div>
                {[
                  { sym: 'interface', name: 'MarketTick',         line: 5,  icon: Box,  color: WARM, depth: 0 },
                  { sym: 'prop',      name: 'zone',                line: 6,  icon: Hash, color: M,    depth: 1 },
                  { sym: 'prop',      name: 'demand',              line: 7,  icon: Hash, color: M,    depth: 1 },
                  { sym: 'prop',      name: 'supply',              line: 8,  icon: Hash, color: M,    depth: 1 },
                  { sym: 'function',  name: 'computeMarketPrice',  line: 11, icon: Wand2,  color: ACCENT, depth: 0 },
                  { sym: 'const',     name: 'priceCap',            line: 15, icon: Type, color: BAD,  depth: 1 },
                  { sym: 'const',     name: 'ratio',               line: 16, icon: Type, color: M,    depth: 1 },
                  { sym: 'function',  name: 'applyTax',            line: 22, icon: Wand2,  color: ACCENT, depth: 0 },
                ].map((s, i) => (
                  <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 14px', paddingLeft: 14 + s.depth * 12, width: '100%', background: 'none', border: 'none', color: T, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: 12.5 }}>
                    <s.icon size={10} color={s.color} strokeWidth={1.5} />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                    <span style={{ color: DIM, fontSize: 10.5 }}>{s.line}</span>
                  </button>
                ))}
              </div>
            )}

            {rightKind === 'problems' && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {DIAGS.map((d, i) => (
                  <div key={i} style={{ padding: '8px 14px', borderBottom: `1px solid ${BRD2}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <AlertCircle size={11} color={d.sev === 'err' ? BAD : WARM} />
                      <span style={{ fontSize: 10.5, color: d.sev === 'err' ? BAD : WARM, fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                        {d.sev === 'err' ? 'ERROR' : 'WARN'}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 10.5, color: DIM, fontFamily: 'monospace' }}>economy.ts:{d.line}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: T, lineHeight: 1.45 }}>{d.msg}</div>
                    <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                      <button style={{ fontSize: 11, padding: '2px 8px', background: ACCENT_DIM, border: `1px solid ${ACCENT}`, color: ICE, borderRadius: 2, cursor: 'pointer' }}>Fiks med AI</button>
                      <button style={{ fontSize: 11, padding: '2px 8px', background: 'none', border: `1px solid ${BRD}`, color: M, borderRadius: 2, cursor: 'pointer' }}>Hopp til</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {rightKind === 'changes' && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 10.5, color: DIM, padding: '4px 14px 6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Endringer · 3</div>
                {[
                  { kind: 'M', label: 'src/systems/economy.ts',      diff: '+2 −1', color: WARM },
                  { kind: '+', label: 'src/systems/economy.test.ts', diff: '+48',   color: GOOD },
                  { kind: 'M', label: 'src/config.ts',                diff: '+1 −1', color: WARM },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderBottom: `1px solid ${BRD2}`, cursor: 'pointer' }}>
                    <span style={{ width: 10, color: f.color, textAlign: 'center', fontFamily: 'monospace', fontSize: 11 }}>{f.kind}</span>
                    <FileCode size={11} color={ACCENT} />
                    <span style={{ flex: 1, fontSize: 12.5, color: T, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.label}</span>
                    <span style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace' }}>{f.diff}</span>
                  </div>
                ))}
                <div style={{ padding: '10px 14px', borderTop: `1px solid ${BRD}`, marginTop: 8 }}>
                  <input type="text" placeholder="Commit-melding…" style={{ width: '100%', background: B, border: `1px solid ${BRD}`, color: T, fontSize: 12, padding: '5px 7px', borderRadius: 2, outline: 'none', fontFamily: 'inherit' }} />
                  <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
                    <button style={{ flex: 1, fontSize: 12, padding: '5px 8px', background: ICE, color: B, fontWeight: 500, border: 'none', borderRadius: 2, cursor: 'pointer' }}>Commit & push</button>
                    <button title="Diff" style={{ width: 26, background: 'none', border: `1px solid ${BRD}`, color: M, borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GitMerge size={11} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {rightKind === 'snippets' && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { n: 'tryCatch async',     k: 'typescript', i: Wrench },
                  { n: 'React useEffect',    k: 'react',      i: Sparkles },
                  { n: 'Zone loader',        k: 'asteon',     i: Box },
                  { n: 'Vitest skjelett',    k: 'test',       i: Bug },
                  { n: 'Drizzle migrasjon',  k: 'db',         i: FileCode },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 14px', borderBottom: `1px solid ${BRD2}`, cursor: 'pointer' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 3, border: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <s.i size={11} color={M} strokeWidth={1.4} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, color: T, lineHeight: 1.2 }}>{s.n}</div>
                      <div style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace', marginTop: 1 }}>{s.k}</div>
                    </div>
                    <Plus size={10} color={DIM} />
                  </div>
                ))}
              </div>
            )}

            {rightKind === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 14px' }}>
                {[
                  { who: 'B', t: '14:30', body: 'priceCap-typen må normaliseres via parseFloat før release.' },
                  { who: 'B', t: '13:55', body: 'Husk å oppdatere economy-runbooken når patchen lander.' },
                ].map((n, i) => (
                  <div key={i} style={{ padding: '8px 10px', borderLeft: `1.5px solid ${WARM}`, background: 'rgba(245,169,107,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: WARM, fontFamily: 'monospace' }}>{n.who}</span>
                      <span style={{ fontSize: 11, color: DIM, fontFamily: 'monospace' }}>{n.t}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: T, lineHeight: 1.45 }}>{n.body}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer — quick AI actions for the active file */}
          <div style={{ borderTop: `1px solid ${BRD}`, padding: '10px 14px', flexShrink: 0 }}>
            <div style={{ fontSize: 10.5, color: DIM, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>AI-handlinger</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { i: Wand2,        label: 'Refaktor markert blokk' },
                { i: Bug,          label: 'Forklar denne feilen' },
                { i: CheckCircle2, label: 'Generer tester' },
                { i: FileText,     label: 'Skriv docstring' },
              ].map((a, i) => (
                <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 7px', background: 'none', border: `1px solid ${BRD}`, borderRadius: 2, color: T, cursor: 'pointer', fontSize: 12, textAlign: 'left', fontFamily: 'inherit' }}>
                  <a.i size={11} color={ACCENT} strokeWidth={1.5} />
                  <span style={{ flex: 1 }}>{a.label}</span>
                  <ChevronRight size={10} color={DIM} />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ============ RIGHT ICON RAIL ============ */}
        <aside style={{ width: 44, flexShrink: 0, borderLeft: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0', gap: 1 }}>
          {([
            { k: 'outline',  icon: ListTree, label: 'Struktur' },
            { k: 'problems', icon: Bug,      label: 'Problemer' },
            { k: 'changes',  icon: GitMerge, label: 'Endringer' },
            { k: 'snippets', icon: BookOpen, label: 'Snippets' },
            { k: 'notes',    icon: FileText, label: 'Notater' },
          ] as const).map(r => {
            const active = rightKind === r.k;
            const RIcon = r.icon;
            return (
              <button
                key={r.k}
                onClick={() => setRightKind(r.k)}
                title={r.label}
                style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: active ? T : DIM, cursor: 'pointer', position: 'relative' }}
              >
                {active && <span style={{ position: 'absolute', right: 0, top: 6, bottom: 6, width: 1.5, background: ACCENT, boxShadow: `0 0 4px ${ACCENT}` }} />}
                <RIcon size={13} strokeWidth={1.4} />
              </button>
            );
          })}
        </aside>

      </div>

      {launcherOpen && (
        <Launcher
          q={launcherQ}
          onQ={setLauncherQ}
          onClose={() => setLauncherOpen(false)}
          tk={tk}
        />
      )}
    </div>
  );
}

type LauncherItem = {
  id: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  group: 'tab' | 'fil' | 'verktøy' | 'ai' | 'kjør' | 'data';
};

const LAUNCHER_ITEMS: LauncherItem[] = [
  // Hopp til åpen fane
  { id: 'tab-econ',    label: 'economy.ts',       desc: 'Åpen fane · src/systems',         icon: FileCode,       color: ACCENT, group: 'tab' },
  { id: 'tab-traffic', label: 'traffic.ts',       desc: 'Åpen fane · src/systems',         icon: FileCode,       color: ACCENT, group: 'tab' },
  { id: 'tab-zalpha',  label: 'zone_alpha.json',  desc: 'Åpen fane · src/zones',           icon: FileCode,       color: WARM,   group: 'tab' },

  // Fil/Tab
  { id: 'new-file',    label: 'Ny fil',            desc: 'Opprett en tom fil i prosjektet',  icon: FileText,       color: ACCENT, group: 'fil' },
  { id: 'new-folder',  label: 'Ny mappe',          desc: 'Opprett en mappe',                 icon: Folder,         color: WARM,   group: 'fil' },
  { id: 'open-file',   label: 'Åpne fil',          desc: 'Hopp til en fil i prosjektet (⌘P)', icon: FolderOpen,    color: WARM,   group: 'fil' },
  { id: 'goto-sym',    label: 'Hopp til symbol',   desc: 'Søk etter funksjon, klasse, type (⌘⇧O)', icon: Hash,    color: M,      group: 'fil' },

  // AI-funksjoner
  { id: 'ai-chat',     label: 'AI: Ny chat',        desc: 'Start en ny chat-tråd med Builder', icon: MessageSquare, color: ACCENT, group: 'ai' },
  { id: 'ai-refactor', label: 'AI: Refaktor',       desc: 'La Builder refaktorere markert kode', icon: Wand2,       color: ACCENT, group: 'ai' },
  { id: 'ai-test',     label: 'AI: Generer tester', desc: 'Skriv en testsuite for aktiv fil',    icon: CheckCircle2, color: GOOD,  group: 'ai' },
  { id: 'ai-explain',  label: 'AI: Forklar feil',   desc: 'Forklar problemer i Problemer-panelet', icon: Bug,       color: WARM,  group: 'ai' },

  // Kjøring
  { id: 'run-task',    label: 'Kjør oppgave',       desc: 'Velg og kjør en workflow-task',     icon: Play,          color: GOOD,   group: 'kjør' },
  { id: 'terminal',    label: 'Ny terminal',         desc: 'Åpne en ny terminal-fane',          icon: TerminalSquare, color: T,     group: 'kjør' },
  { id: 'preview',     label: 'Forhåndsvisning',    desc: 'Vis appen i en live preview',       icon: Monitor,       color: ACCENT, group: 'kjør' },
  { id: 'publish',     label: 'Publishing',          desc: 'Publiser en delbar versjon av appen', icon: Rocket,    color: ACCENT, group: 'kjør' },

  // Verktøy
  { id: 'search',      label: 'Søk i prosjekt',     desc: 'Globalt søk på tvers av filer (⌘⇧F)', icon: Search,    color: M,      group: 'verktøy' },
  { id: 'snippets',    label: 'Snippets',            desc: 'Sett inn en kodebit fra biblioteket', icon: BookOpen,  color: M,      group: 'verktøy' },
  { id: 'endpoints',   label: 'Endepunkter',        desc: 'Bla i API-rutene som er registrert',  icon: Network,    color: ACCENT, group: 'verktøy' },
  { id: 'workflows',   label: 'Workflows',           desc: 'Vis og endre workflow-konfigurasjon', icon: Workflow,  color: M,      group: 'verktøy' },
  { id: 'git',         label: 'Git',                 desc: 'Endringer, commits og brancher',     icon: GitBranch,  color: WARM,   group: 'verktøy' },

  // Data/Tjenester
  { id: 'database',    label: 'Database',           desc: 'PostgreSQL — tabeller, queries',     icon: Database,   color: ACCENT, group: 'data' },
  { id: 'storage',     label: 'App Storage',        desc: 'Bilder, video og dokumenter',         icon: ImageIcon,  color: WARM,   group: 'data' },
  { id: 'secrets',     label: 'Secrets',             desc: 'Lagrede API-nøkler og konfig',       icon: Lock,       color: BAD,    group: 'data' },
  { id: 'auth',        label: 'Auth',                desc: 'Innloggings-flyt og sesjon',         icon: KeyRound,   color: ACCENT, group: 'data' },
  { id: 'integrations',label: 'Integrasjoner',      desc: 'Replit-native og eksterne tjenester', icon: Globe,     color: M,      group: 'data' },
  { id: 'security',    label: 'Security Center',     desc: 'Sårbarheter og personvernsproblemer', icon: Shield,    color: GOOD,   group: 'data' },
  { id: 'analytics',   label: 'Analytics',           desc: 'Trafikk, requests og bruksdata',     icon: BarChart3,  color: ACCENT, group: 'data' },
];

const GROUP_LABEL: Record<LauncherItem['group'], string> = {
  tab:     'Hopp til åpen fane',
  fil:     'Filer',
  ai:      'AI-funksjoner',
  kjør:    'Kjør',
  verktøy: 'Verktøy',
  data:    'Data og tjenester',
};

function Launcher({ q, onQ, onClose, tk }: { q: string; onQ: (v: string) => void; onClose: () => void; tk: ChatTk }) {
  const ql = q.trim().toLowerCase();
  const filtered = ql
    ? LAUNCHER_ITEMS.filter(it => it.label.toLowerCase().includes(ql) || it.desc.toLowerCase().includes(ql))
    : LAUNCHER_ITEMS;

  const groups: LauncherItem['group'][] = ['tab', 'fil', 'ai', 'kjør', 'verktøy', 'data'];

  return (
    <div
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 72, zIndex: 100, backdropFilter: 'blur(2px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: 560, maxHeight: '74vh', background: '#0a0a0b', border: `1px solid ${tk.BRD}`, borderRadius: 6, boxShadow: '0 18px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {/* Søkefelt */}
        <div style={{ padding: '12px 14px', borderBottom: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', gap: 9 }}>
          <Search size={13} color={tk.M} strokeWidth={1.5} />
          <input
            autoFocus
            value={q}
            onChange={e => onQ(e.target.value)}
            placeholder="Søk etter verktøy & filer…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: tk.T, fontSize: 13, fontFamily: 'inherit', padding: 0 }}
          />
          <span style={{ fontSize: 10.5, color: tk.DIM, fontFamily: 'monospace', border: `1px solid ${tk.BRD}`, borderRadius: 2, padding: '1px 5px' }}>ESC</span>
        </div>

        {/* Liste */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 14px', textAlign: 'center', fontSize: 13, color: tk.DIM }}>
              Ingen treff for «{q}»
            </div>
          ) : (
            groups.map(g => {
              const items = filtered.filter(it => it.group === g);
              if (items.length === 0) return null;
              return (
                <div key={g}>
                  <div style={{ padding: '10px 14px 4px', fontSize: 11, color: tk.M, letterSpacing: '0.04em' }}>
                    {GROUP_LABEL[g]}
                  </div>
                  {items.map((it, i) => (
                    <button
                      key={it.id}
                      onClick={onClose}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                        padding: '8px 14px', background: i === 0 && g === 'tab' && !ql ? 'rgba(255,255,255,0.04)' : 'none',
                        border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = i === 0 && g === 'tab' && !ql ? 'rgba(255,255,255,0.04)' : 'none')}
                    >
                      <div style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <it.icon size={13} color={it.color} strokeWidth={1.5} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, color: tk.T, lineHeight: 1.25 }}>{it.label}</div>
                        <div style={{ fontSize: 12, color: tk.M, marginTop: 2, lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '8px 14px', borderTop: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: tk.DIM, fontFamily: 'monospace', flexShrink: 0 }}>
          <span><span style={{ color: tk.M, border: `1px solid ${tk.BRD}`, padding: '0 4px', borderRadius: 2 }}>↑↓</span> naviger</span>
          <span><span style={{ color: tk.M, border: `1px solid ${tk.BRD}`, padding: '0 4px', borderRadius: 2 }}>↵</span> åpne</span>
          <span style={{ marginLeft: 'auto' }}>{filtered.length} treff</span>
        </div>
      </div>
    </div>
  );
}

function computeVisible(tree: FileNode[]): FileNode[] {
  const out: FileNode[] = [];
  const hiddenDepth: number[] = [];
  for (const n of tree) {
    while (hiddenDepth.length && hiddenDepth[hiddenDepth.length - 1] >= n.depth) {
      hiddenDepth.pop();
    }
    if (hiddenDepth.length) continue;
    out.push(n);
    if (n.kind === 'dir' && !n.expanded) hiddenDepth.push(n.depth);
  }
  return out;
}

function fileColor(name: string): string {
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return ACCENT;
  if (name.endsWith('.json')) return WARM;
  if (name.endsWith('.md')) return M;
  return M;
}

function CodeEditor() {
  const lines: React.ReactNode[] = [
    <><span style={{ color: COM }}>{`// economy.ts — markedssimulering for Region_01`}</span></>,
    <><span style={{ color: KW }}>import</span> {'{ '}<span style={{ color: PROP }}>Zone</span>, <span style={{ color: PROP }}>Resource</span>{' }'} <span style={{ color: KW }}>from</span> <span style={{ color: STR }}>'../zones'</span>;</>,
    <><span style={{ color: KW }}>import</span> {'{ '}<span style={{ color: PROP }}>config</span>{' }'} <span style={{ color: KW }}>from</span> <span style={{ color: STR }}>'../config'</span>;</>,
    <>{'\u00A0'}</>,
    <><span style={{ color: KW }}>export interface</span> <span style={{ color: FN }}>MarketTick</span> {'{'}</>,
    <>  <span style={{ color: PROP }}>zone</span>: <span style={{ color: FN }}>Zone</span>;</>,
    <>  <span style={{ color: PROP }}>demand</span>: <span style={{ color: KW }}>number</span>;</>,
    <>  <span style={{ color: PROP }}>supply</span>: <span style={{ color: KW }}>number</span>;</>,
    <>{'}'}</>,
    <>{'\u00A0'}</>,
    <><span style={{ color: KW }}>export function</span> <span style={{ color: FN }}>computeMarketPrice</span>(</>,
    <>  <span style={{ color: PROP }}>base</span>: <span style={{ color: KW }}>number</span>,</>,
    <>  <span style={{ color: PROP }}>tick</span>: <span style={{ color: FN }}>MarketTick</span>,</>,
    <>): <span style={{ color: KW }}>number</span> {'{'}</>,
    <>  <span style={{ color: KW }}>const</span> <span style={{ color: PROP }}>priceCap</span> = <span style={{ color: PROP }}>config</span>.<span style={{ color: PROP }}>priceCap</span>;</>,
    <>  <span style={{ color: KW }}>const</span> <span style={{ color: PROP }}>ratio</span> = <span style={{ color: PROP }}>tick</span>.<span style={{ color: PROP }}>demand</span> / <span style={{ color: FN }}>Math</span>.<span style={{ color: FN }}>max</span>(<span style={{ color: NUM }}>1</span>, <span style={{ color: PROP }}>tick</span>.<span style={{ color: PROP }}>supply</span>);</>,
    <>  <span style={{ color: KW }}>const</span> <span style={{ color: PROP }}>price</span> = <span style={{ color: PROP }}>base</span> * (<span style={{ color: NUM }}>1</span> + <span style={{ color: PROP }}>ratio</span> * <span style={{ color: NUM }}>0.18</span>);</>,
    <>  <span style={{ color: KW }}>return</span> <span style={{ color: FN }}>Math</span>.<span style={{ color: FN }}>min</span>(<span style={{ color: PROP }}>price</span>, <span style={{ color: PROP }}>priceCap</span>);</>,
    <>{'}'}</>,
    <>{'\u00A0'}</>,
    <><span style={{ color: COM }}>{`// FIXME: priceCap er string i config — fanges av tsc(2322)`}</span></>,
    <><span style={{ color: KW }}>export function</span> <span style={{ color: FN }}>applyTax</span>(<span style={{ color: PROP }}>price</span>: <span style={{ color: KW }}>number</span>, <span style={{ color: PROP }}>rate</span>: <span style={{ color: KW }}>number</span>): <span style={{ color: KW }}>number</span> {'{'}</>,
    <>  <span style={{ color: KW }}>return</span> <span style={{ color: PROP }}>price</span> * (<span style={{ color: NUM }}>1</span> + <span style={{ color: PROP }}>rate</span>);</>,
    <>{'}'}</>,
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', fontFamily: '"JetBrains Mono", "SF Mono", Menlo, monospace', fontSize: 13.5, lineHeight: '20px', color: T, padding: '8px 0', display: 'flex' }}>
      <div style={{ flexShrink: 0, paddingLeft: 14, paddingRight: 14, color: DIM, fontVariantNumeric: 'tabular-nums', textAlign: 'right', userSelect: 'none' }}>
        {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
      </div>
      <div style={{ flex: 1, paddingRight: 14 }}>
        {lines.map((ln, i) => (
          <div key={i} style={{ background: i === 14 ? 'rgba(124,212,255,0.06)' : 'transparent', minHeight: 20 }}>
            {ln}
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Chat — matches StudioProV3 ChatThread exactly
// ──────────────────────────────────────────────────────────

type ChatTk = {
  B: string; BRD: string; BRD2: string; T: string; M: string; DIM: string;
  ICE: string; ACCENT: string; ACCENT_DIM: string; WARM: string; GOOD: string; BAD: string;
};

function ChatThread({ tk }: { tk: ChatTk }) {
  const [reasoningOpen, setReasoningOpen] = useState(true);
  const [taskState, setTaskState] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [thinking, setThinking] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <DayDivider tk={tk} label="I dag · 14:15" />

      <AiMsg tk={tk}>
        Åpnet <Code tk={tk}>economy.ts</Code>. Ser en type-mismatch på linje 38 — <Code tk={tk}>priceCap</Code> er deklarert som <Code tk={tk}>string</Code> men brukes som <Code tk={tk}>number</Code>. Skal jeg fikse det?
      </AiMsg>

      <UserMsg tk={tk}>Ja, og legg på en regresjonstest.</UserMsg>

      <AiMsg tk={tk}>
        Plan: endre konfig-typen, parse evt. eksisterende strings, og legge til <Code tk={tk}>economy.test.ts</Code> med 4 cases.
      </AiMsg>

      <UserMsg tk={tk}>Vis tankerekken før du kjører.</UserMsg>

      {/* AI reasoning trace */}
      <div style={{ display: 'flex', gap: 10, padding: '6px 0' }}>
        <Avatar tk={tk} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <button
            onClick={() => setReasoningOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: 0,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11.5, color: tk.M, fontFamily: 'monospace', letterSpacing: '0.04em',
            }}>
            {reasoningOpen ? <ChevronDown size={11} color={tk.DIM} /> : <ChevronRight size={11} color={tk.DIM} />}
            <Sparkles size={10} color={tk.ACCENT} />
            <span>tenker · 2.8s · 6 steg</span>
          </button>
          {reasoningOpen && (
            <div style={{
              marginTop: 6, padding: '8px 0 8px 10px',
              borderLeft: `1px solid ${tk.BRD}`,
              fontSize: 12, color: tk.M, lineHeight: 1.5,
            }}>
              {[
                { k: 'leser',     v: <><Code tk={tk}>economy.ts</Code> — fanger <Code tk={tk}>priceCap</Code> brukt som <Code tk={tk}>number</Code></> },
                { k: 'leser',     v: <><Code tk={tk}>config.ts</Code> — <Code tk={tk}>priceCap: string</Code></> },
                { k: 'vurderer',  v: <>kall-graf: <Code tk={tk}>computeMarketPrice</Code> brukes i 3 sone-loadere</> },
                { k: 'velger',    v: <>endre konfig-typen til <Code tk={tk}>number</Code> — minst risiko</> },
                { k: 'skisserer', v: <>patch: <Code tk={tk}>config.ts</Code> + <Code tk={tk}>economy.test.ts</Code> (4 cases)</> },
                { k: 'validerer', v: <><Code tk={tk}>tsc --noEmit</Code> grønn, ingen brutte konsumenter</> },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '3px 0' }}>
                  <span style={{
                    flexShrink: 0,
                    fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: tk.DIM,
                    padding: '1px 5px', border: `1px solid ${tk.BRD}`, borderRadius: 2,
                    lineHeight: 1.3,
                  }}>{s.k}</span>
                  <span style={{ color: tk.M, flex: 1, minWidth: 0 }}>{s.v}</span>
                </div>
              ))}
              <div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px dashed ${tk.BRD}`, color: tk.DIM, fontSize: 11, fontFamily: 'monospace', display: 'flex', gap: 10 }}>
                <span>gpt-fast</span>
                <span>·</span>
                <span>0.9k in</span>
                <span>·</span>
                <span>320 out</span>
                <span>·</span>
                <span>$0.0002</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <AiMsg tk={tk}>
        Klar med patch. 2 filer endret, regresjon dekker <Code tk={tk}>priceCap</Code> som streng, NaN, og over/under cap.
      </AiMsg>

      {/* Task approval card */}
      <div style={{ display: 'flex', gap: 10, padding: '8px 0' }}>
        <Avatar tk={tk} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            border: `1px solid ${taskState === 'approved' ? tk.GOOD : taskState === 'rejected' ? tk.BAD : tk.BRD}`,
            background: taskState === 'pending' ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.025)',
            borderRadius: 3, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderBottom: `1px solid ${tk.BRD}`,
              fontSize: 12, color: tk.T,
            }}>
              <Wand2 size={11} color={tk.ACCENT} />
              <span style={{ flex: 1 }}>Foreslått oppgave</span>
              <span style={{
                fontSize: 10, fontFamily: 'monospace',
                color: taskState === 'approved' ? tk.GOOD : taskState === 'rejected' ? tk.BAD : tk.WARM,
                padding: '1px 6px', border: `1px solid ${taskState === 'approved' ? tk.GOOD : taskState === 'rejected' ? tk.BAD : tk.WARM}`,
                borderRadius: 2, letterSpacing: '0.06em',
              }}>
                {taskState === 'approved' ? 'GODKJENT' : taskState === 'rejected' ? 'AVVIST' : 'AVVENTER'}
              </span>
            </div>
            <div style={{ padding: '10px 10px 8px', fontSize: 12.5, color: tk.T, lineHeight: 1.5 }}>
              Fix priceCap type-mismatch + regresjonstest
            </div>
            <div style={{ padding: '0 10px 8px', fontSize: 11.5, color: tk.M, lineHeight: 1.55 }}>
              Endre <Code tk={tk}>priceCap</Code> i <Code tk={tk}>config.ts</Code> til <Code tk={tk}>number</Code>, og legg til <Code tk={tk}>economy.test.ts</Code> med 4 cases.
            </div>

            {/* File changes */}
            <div style={{ borderTop: `1px solid ${tk.BRD2}`, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { kind: 'M', label: 'src/config.ts',      diff: '+1 −1', color: tk.ACCENT },
                { kind: 'M', label: 'src/systems/economy.ts', diff: '+2 −0', color: tk.ACCENT },
                { kind: '+', label: 'src/systems/economy.test.ts', diff: '+48', color: tk.GOOD },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontFamily: 'monospace' }}>
                  <span style={{ width: 10, color: f.color, textAlign: 'center' }}>{f.kind}</span>
                  <FileCode size={10} color={tk.DIM} />
                  <span style={{ flex: 1, color: tk.T }}>{f.label}</span>
                  <span style={{ color: tk.DIM, fontSize: 11 }}>{f.diff}</span>
                </div>
              ))}
            </div>

            {/* Meta strip */}
            <div style={{ display: 'flex', gap: 12, padding: '6px 10px', borderTop: `1px solid ${tk.BRD2}`, fontSize: 11, color: tk.DIM, fontFamily: 'monospace' }}>
              <span>~14s</span>
              <span>·</span>
              <span>~$0.0008</span>
              <span>·</span>
              <span>auto-rollback</span>
            </div>

            {/* Actions */}
            {taskState === 'pending' ? (
              <div style={{ display: 'flex', gap: 6, padding: '8px 10px', borderTop: `1px solid ${tk.BRD}`, background: 'rgba(255,255,255,0.02)' }}>
                <button onClick={() => setTaskState('approved')} style={{
                  flex: 1, height: 26, background: tk.ACCENT_DIM, border: `1px solid ${tk.ACCENT}`,
                  borderRadius: 2, color: tk.ICE, fontSize: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}>
                  <CheckCircle2 size={11} /> Godkjenn og kjør
                </button>
                <button onClick={() => setTaskState('rejected')} style={{
                  height: 26, padding: '0 10px', background: 'none', border: `1px solid ${tk.BRD}`,
                  borderRadius: 2, color: tk.M, fontSize: 12, cursor: 'pointer',
                }}>
                  Avvis
                </button>
                <button style={{
                  height: 26, padding: '0 10px', background: 'none', border: `1px solid ${tk.BRD}`,
                  borderRadius: 2, color: tk.M, fontSize: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }} title="Vis full plan">
                  <FileText size={11} />
                </button>
              </div>
            ) : (
              <div style={{
                padding: '8px 10px', borderTop: `1px solid ${tk.BRD}`,
                fontSize: 11.5, color: taskState === 'approved' ? tk.GOOD : tk.BAD,
                fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {taskState === 'approved' ? <CheckCircle2 size={11} /> : <X size={11} />}
                {taskState === 'approved' ? 'Godkjent · kjører nå · 14:33:02' : 'Avvist · ingen endringer'}
                <button onClick={() => setTaskState('pending')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: tk.M, fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>angre</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {taskState === 'approved' && (
        <AiMsg tk={tk}>
          Patch anvendt. Kjører <Code tk={tk}>tsc --noEmit</Code> og test-suite nå.
        </AiMsg>
      )}

      {/* live thinking */}
      {thinking && taskState !== 'rejected' && (
        <div style={{ display: 'flex', gap: 10, padding: '4px 0', alignItems: 'center' }}>
          <Avatar tk={tk} />
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: tk.M, opacity: 0.5, animation: `pulse ${0.8 + i * 0.15}s ease-in-out infinite` }} />
            ))}
          </div>
          <button onClick={() => setThinking(false)} style={{ marginLeft: 6, background: 'none', border: 'none', color: tk.DIM, fontSize: 10, cursor: 'pointer', fontFamily: 'monospace' }}>stopp</button>
        </div>
      )}
    </div>
  );
}

function Avatar({ tk }: { tk: ChatTk }) {
  return (
    <div style={{ width: 20, height: 20, flexShrink: 0, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tk.BRD}` }}>
      <Sparkles size={10} color={tk.M} strokeWidth={1.5} />
    </div>
  );
}

function AiMsg({ tk, children }: { tk: ChatTk; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '6px 0' }}>
      <Avatar tk={tk} />
      <div style={{ flex: 1, fontSize: 13, color: tk.M, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function UserMsg({ tk, children }: { tk: ChatTk; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '6px 0', justifyContent: 'flex-end' }}>
      <div style={{ maxWidth: '85%', background: 'rgba(255,255,255,0.04)', borderRadius: 3, padding: '8px 11px', fontSize: 13, color: tk.T, lineHeight: 1.55 }}>
        {children}
      </div>
    </div>
  );
}

function Code({ tk, children }: { tk: ChatTk; children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 12, color: tk.T, padding: '1px 4px', background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>{children}</span>
  );
}

function DayDivider({ tk, label }: { tk: ChatTk; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0 6px' }}>
      <div style={{ flex: 1, height: 1, background: tk.BRD }} />
      <span style={{ fontSize: 10, color: tk.DIM, fontFamily: 'monospace', letterSpacing: '0.06em' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: tk.BRD }} />
    </div>
  );
}
