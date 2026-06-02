import React, { useState, useCallback, useEffect } from 'react';
import {
  Play, Sparkles, Save, MessageSquare, FolderTree, Settings, History,
  Send, Eye, Gamepad2, Globe2, Search, Box, ChevronRight, ChevronDown,
  Layers, GitBranch, Cpu, Zap, Package, Map, Users, TrendingUp,
  MoreHorizontal, Plus, RefreshCw, Shield, Sword, Home, TreePine, Flame,
  PanelLeftClose, PanelLeftOpen, Loader2, CheckCircle2, GitMerge,
  AlertTriangle, CornerDownRight, Clock,
  Code2, FileText, Network, FlaskConical, Kanban, Bot, Database,
  Upload, Lock, Bell, BookOpen, Wand2, FileCode, Wrench,
  LayoutGrid, List, ArrowUpDown, X,
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

type CanvasTab = 'watch' | 'play' | 'world';
type RailKind = 'chat' | 'files' | 'git' | 'systems' | 'settings' | 'history';

const statItems = [
  { k: 'heat',      v: '0%'  },
  { k: 'treasury',  v: '$0k' },
  { k: 'territory', v: '0/0' },
  { k: 'npcs',      v: '0'   },
  { k: 'deals',     v: '0'   },
  { k: 'routes',    v: '0'   },
];

const assetCategories = ['Alle', 'Modeller', 'Teksturer', 'FX', 'Audio', 'Skript'] as const;
type AssetCat = typeof assetCategories[number];

const assetItems: { n: string; icon: any; cat: Exclude<AssetCat, 'Alle'>; size: string }[] = [
  { n: 'Capes',         icon: Users,    cat: 'Modeller',   size: '2.4mb' },
  { n: 'Character_A',   icon: Users,    cat: 'Modeller',   size: '8.1mb' },
  { n: 'FX_Ammo',       icon: Zap,      cat: 'FX',         size: '412kb' },
  { n: 'Arrow',         icon: Sword,    cat: 'Modeller',   size: '64kb'  },
  { n: 'Arrow Mesh',    icon: Sword,    cat: 'Modeller',   size: '128kb' },
  { n: 'Ash_burst',     icon: Flame,    cat: 'FX',         size: '1.1mb' },
  { n: 'Stone_01',      icon: Box,      cat: 'Teksturer',  size: '3.4mb' },
  { n: 'Wood_grain',    icon: Box,      cat: 'Teksturer',  size: '2.8mb' },
  { n: 'Bow_release',   icon: Bell,     cat: 'Audio',      size: '88kb'  },
  { n: 'Wind_ambient',  icon: Bell,     cat: 'Audio',      size: '1.7mb' },
  { n: 'spawn.ts',      icon: FileCode, cat: 'Skript',     size: '4.2kb' },
  { n: 'economy.ts',    icon: FileCode, cat: 'Skript',     size: '12kb'  },
];

type AssetSort = 'navn' | 'størrelse' | 'nyest';
type AssetView = 'grid' | 'list';

const fileTree = [
  { label: 'World',            icon: Globe2,   expanded: true,  depth: 0 },
  { label: 'Region_01',        icon: Map,      expanded: true,  depth: 1 },
  { label: 'zone_alpha.json',  icon: null,                       depth: 2, active: true },
  { label: 'zone_beta.json',   icon: null,                       depth: 2 },
  { label: 'NPCs',             icon: Users,    expanded: false, depth: 1 },
  { label: 'Economy',          icon: TrendingUp, expanded: false, depth: 1 },
  { label: 'Systems',          icon: Cpu,      expanded: false, depth: 0 },
  { label: 'Assets',           icon: Package,  expanded: false, depth: 0 },
];


import { ContentView, SystemsView, RegionView, DirectorView, LivesView, type Tokens } from './views';

type TopTab = 'Build' | 'Content' | 'Systems' | 'Region' | 'Director' | 'Liv';

function StudioProV4WorldInner() {
  const [canvasTab, setCanvasTab] = useState<CanvasTab>('world');
  const [topTab, setTopTab] = useState<TopTab>('Build');
  const tk: Tokens = { B, BRD, BRD2, T, M, DIM, ICE, ACCENT, ACCENT_DIM, WARM, GOOD, BAD };
  const [activeRailItem, setActiveRailItem] = useState(0);
  const [railExpanded, setRailExpanded] = useState(false);
  const [mode, setMode] = useState<'Sparring' | 'Plan' | 'Build'>('Plan');
  const [chatW, setChatW] = useState(296);
  const [assetW, setAssetW] = useState(236);
  const [dragging, setDragging] = useState<null | 'chat' | 'asset'>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQ, setPaletteQ] = useState('');
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [strategy, setStrategy] = useState<'lite' | 'economy' | 'power'>('economy');
  const [stratOpen, setStratOpen] = useState(false);
  const [gameTester, setGameTester] = useState(false);
  const [longRun, setLongRun] = useState(false);
  const [rightKind, setRightKind] = useState<'assets' | 'inspector' | 'layers' | 'library' | 'notes'>('assets');
  const [assetQ, setAssetQ] = useState('');
  const [assetCat, setAssetCat] = useState<AssetCat>('Alle');
  const [assetSettingsOpen, setAssetSettingsOpen] = useState(false);
  const [assetSort, setAssetSort] = useState<AssetSort>('navn');
  const [assetView, setAssetView] = useState<AssetView>('grid');

  // ── Living simulation tick ─────────────────────────
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1400);
    return () => clearInterval(id);
  }, []);

  const liveStats = React.useMemo(() => {
    const seed = tick;
    const wob = (base: number, amp: number, off: number) =>
      Math.max(0, Math.round(base + Math.sin((seed + off) * 0.7) * amp));
    const heat = 12 + wob(0, 3, 0);
    const treasury = 4.2 + Math.sin(seed * 0.3) * 0.4;
    const npcs = 12 + wob(0, 2, 2);
    const deals = wob(3, 2, 4);
    const routes = 4 + wob(0, 1, 6);
    return [
      { k: 'heat',      v: `${heat}%`,                     accent: heat > 14 ? WARM : T },
      { k: 'treasury',  v: `$${treasury.toFixed(1)}k`,     accent: T },
      { k: 'territory', v: '2/3',                          accent: T },
      { k: 'npcs',      v: String(npcs),                   accent: T },
      { k: 'deals',     v: String(deals),                  accent: deals > 4 ? GOOD : T },
      { k: 'routes',    v: String(routes),                 accent: T },
    ];
  }, [tick]);

  const eventStream = React.useMemo(() => [
    { icon: '✓', color: GOOD,   msg: 'α→β rute etablert' },
    { icon: '+', color: ACCENT, msg: 'NPC spawnet i α' },
    { icon: '◆', color: WARM,   msg: 'Heat-spike i ZONE_α' },
    { icon: '→', color: ACCENT, msg: 'Karavan ankom outpost' },
    { icon: '✓', color: GOOD,   msg: 'Handelsavtale signert' },
    { icon: '·', color: M,      msg: 'Cycle 4 → 5 om 12s' },
  ], []);

  const liveEvents = React.useMemo(() => {
    const a = eventStream[tick % eventStream.length];
    const b = eventStream[(tick + 1) % eventStream.length];
    return [a, b];
  }, [tick, eventStream]);

  const visibleAssets = React.useMemo(() => {
    const q = assetQ.trim().toLowerCase();
    let arr = assetItems.filter(a =>
      (assetCat === 'Alle' || a.cat === assetCat) &&
      (q === '' || a.n.toLowerCase().includes(q))
    );
    if (assetSort === 'navn') arr = [...arr].sort((a, b) => a.n.localeCompare(b.n));
    else if (assetSort === 'størrelse') arr = [...arr].sort((a, b) => b.size.localeCompare(a.size));
    return arr;
  }, [assetQ, assetCat, assetSort]);

  const onDragStart = useCallback((which: 'chat' | 'asset') => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(which);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (dragging === 'chat') {
        const next = Math.max(220, Math.min(520, chatW + e.movementX));
        setChatW(next);
      } else {
        const next = Math.max(180, Math.min(460, assetW - e.movementX));
        setAssetW(next);
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
  }, [dragging, chatW, assetW]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setPaletteOpen(v => !v);
        setPaletteQ('');
        setPaletteIdx(0);
      } else if (e.key === 'Escape' && paletteOpen) {
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen]);

  const railIcons = [MessageSquare, FolderTree, GitBranch, Cpu, Settings, History];
  const railLabels = ['Chat', 'Files', 'Git', 'Systems', 'Settings', 'History'];
  const railKinds: RailKind[] = ['chat', 'files', 'git', 'systems', 'settings', 'history'];
  const activeKind = railKinds[activeRailItem];
  const railMeta = [{ badge: '3' }, { badge: '24' }, { badge: '2' }, null, null, null];

  type RunStatus = 'running' | 'awaiting_accept' | 'awaiting_merge' | 'awaiting_confirm' | 'queued' | 'done';
  type Run = { id: string; title: string; sub?: string; status: RunStatus; progress?: number; step?: string; depth: number; dependsOn?: string };
  const agentRuns: Run[] = [
    { id: 'r1',  title: 'Smugler-nettverk · 7 noder', sub: 'place_node(district_3, hexcorp_dock)', status: 'running', progress: 67, step: '8/12', depth: 0 },
    { id: 'r1a', title: 'Test smuglerruter',          sub: 'venter på r1', status: 'queued', depth: 1, dependsOn: 'r1' },
    { id: 'r1b', title: 'Balanser deal-priser',       sub: 'venter på r1', status: 'queued', depth: 1, dependsOn: 'r1' },
    { id: 'r2',  title: 'Bartender · Edric Stonehall',sub: 'Plan-runde · 5 dialog-grener', status: 'running', progress: 32, step: '4/12', depth: 0 },
    { id: 'r3',  title: 'Genererte 3 fraksjoner',     sub: 'Hexcorp, Black Lotus, Ferals', status: 'awaiting_merge', depth: 0 },
    { id: 'r3a', title: 'Skriv intro-cinematic',      sub: 'venter på fraksjons-merge', status: 'queued', depth: 1, dependsOn: 'r3' },
    { id: 'r4',  title: 'Refaktor inventory_v2',      sub: 'patch klar — 14 filer', status: 'awaiting_accept', depth: 0 },
    { id: 'r5',  title: 'Slett gammel zone_test',     sub: 'destruktiv — krever bekreftelse', status: 'awaiting_confirm', depth: 0 },
  ];

  const statusMeta: Record<RunStatus, { label: string; Icon: React.ElementType; dot: string }> = {
    running:          { label: 'kjører',   Icon: Loader2,       dot: ACCENT },
    awaiting_accept:  { label: 'godkjenn', Icon: ChevronRight,  dot: WARM },
    awaiting_merge:   { label: 'merge',    Icon: GitMerge,      dot: WARM },
    awaiting_confirm: { label: 'bekreft',  Icon: AlertTriangle, dot: WARM },
    queued:           { label: 'i kø',     Icon: Clock,         dot: DIM },
    done:             { label: 'ferdig',   Icon: CheckCircle2,  dot: GOOD },
  };

  type Tool = { id: string; label: string; desc: string; group: string; icon: React.ElementType; kbd?: string };
  const tools: Tool[] = [
    { id: 'world',     label: 'World Gen',         desc: 'Generer regioner, soner og noder',         group: 'Visninger',  icon: Globe2,       kbd: '⌘1' },
    { id: 'watch',     label: 'Watch',             desc: 'Følg agenter live i scenen',                group: 'Visninger',  icon: Eye,          kbd: '⌘2' },
    { id: 'play',      label: 'Play',              desc: 'Test spillet i sandkasse',                  group: 'Visninger',  icon: Gamepad2,     kbd: '⌘3' },
    { id: 'sim',       label: 'Simulation · Heatmap', desc: 'Kjør simulering med heatmap-overlay',  group: 'Visninger',  icon: FlaskConical },
    { id: 'live',      label: 'Live World',        desc: 'Publisert verden, sanntid',                  group: 'Visninger',  icon: Network },

    { id: 'region',    label: 'Region Command',    desc: 'Styr regioner, fraksjoner og økonomi',     group: 'Verktøy',    icon: Map },
    { id: 'systems',   label: 'Systems Mode',      desc: 'Sett opp regler og spill-systemer',         group: 'Verktøy',    icon: Cpu },
    { id: 'npc',       label: 'NPC · Karakterskaper', desc: 'Lag arketyper, dialog, atferd',         group: 'Verktøy',    icon: Users },
    { id: '3d',        label: 'AI 3D Designer',    desc: 'Generer meshes og scener fra prompt',       group: 'Verktøy',    icon: Box },
    { id: 'director',  label: 'Creative Director', desc: 'AI-regissør for narrativ og pacing',        group: 'Verktøy',    icon: Wand2 },
    { id: 'research',  label: 'Research Mode',     desc: 'Hent referanser, kilder, lore',             group: 'Verktøy',    icon: BookOpen },
    { id: 'kanban',    label: 'Oppgave-Kanban',    desc: 'Godkjenn agentoppgaver',                    group: 'Verktøy',    icon: Kanban },
    { id: 'review',    label: 'Kodegjennomgang',   desc: 'Diff og godkjenning av patches',            group: 'Verktøy',    icon: GitMerge },
    { id: 'templates', label: 'Sjanger-maler',     desc: 'Start fra et galleri av maler',             group: 'Verktøy',    icon: Layers },

    { id: 'code',      label: 'Koderedigering',    desc: 'Åpne editor i sidepanel',                   group: 'Filer',      icon: Code2 },
    { id: 'files',     label: 'Fil-utforsker',     desc: 'Bla gjennom hele kodebasen',                group: 'Filer',      icon: FolderTree },
    { id: 'md',        label: 'Markdown-visning',  desc: 'Les designdokumenter og notater',           group: 'Filer',      icon: FileText },
    { id: 'zone-a',    label: 'zone_alpha.json',   desc: 'World / Region_01 / zone_alpha',            group: 'Filer',      icon: FileCode },
    { id: 'zone-b',    label: 'zone_beta.json',    desc: 'World / Region_01 / zone_beta',             group: 'Filer',      icon: FileCode },

    { id: 'save',      label: 'Lagre',             desc: 'Persister gjeldende endringer',             group: 'Handlinger', icon: Save,         kbd: '⌘S' },
    { id: 'ai',        label: 'AI-forslag',        desc: 'Få forslag for aktuell kontekst',           group: 'Handlinger', icon: Sparkles },
    { id: 'agent',     label: 'Kjør agent',        desc: 'Start en agent-run fra mal',                group: 'Handlinger', icon: Bot,          kbd: '⌘↵' },
    { id: 'publish',   label: 'Publiser bygg',     desc: 'Push til Studio storefront',                group: 'Handlinger', icon: Upload },
    { id: 'db',        label: 'Database',          desc: 'Strukturerte data og kataloger',            group: 'System',     icon: Database },
    { id: 'secrets',   label: 'Hemmeligheter',     desc: 'API-nøkler og signerings-nøkler',           group: 'System',     icon: Lock },
    { id: 'notif',     label: 'Varsler',           desc: 'Probe-helse, builder-konformitet',          group: 'System',     icon: Bell },
    { id: 'settings',  label: 'Innstillinger',     desc: 'Prosjekt-konfigurasjon',                    group: 'System',     icon: Settings,     kbd: '⌘,' },
  ];

  const filtered = paletteQ.trim()
    ? tools.filter(t => {
        const q = paletteQ.toLowerCase();
        return t.label.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.group.toLowerCase().includes(q);
      })
    : tools;
  const grouped = filtered.reduce<Record<string, Tool[]>>((acc, t) => {
    (acc[t.group] = acc[t.group] || []).push(t);
    return acc;
  }, {});
  const flatIds = filtered.map(t => t.id);
  const safeIdx = Math.min(paletteIdx, Math.max(0, flatIds.length - 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: B, color: T, fontFamily: 'ui-sans-serif,system-ui,sans-serif', fontSize: 13, overflow: 'hidden' }}>
      <style>{`
        @keyframes sp3-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
        @keyframes sp3-breathe {
          0%,100% { box-shadow: 0 0 22px ${ACCENT_DIM}, inset 0 0 10px ${ACCENT_DIM}; }
          50%     { box-shadow: 0 0 36px rgba(124,212,255,0.22), inset 0 0 16px rgba(124,212,255,0.22); }
        }
        @keyframes sp3-ring {
          0%   { transform: scale(0.7); opacity: 0.55; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes sp3-dash { to { stroke-dashoffset: -16; } }
        @keyframes sp3-feedSlide {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @keyframes sp3-npcAB {
          0%   { left: 35%; top: 58%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 65%; top: 60%; opacity: 0; }
        }
        @keyframes sp3-npcAlphaCenter {
          0%   { left: 35%; top: 58%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { left: 50%; top: 40%; opacity: 0; }
        }
        @keyframes sp3-npcBetaOutpost {
          0%   { left: 65%; top: 60%; opacity: 0; }
          15%  { opacity: 1; }
          50%  { left: 50%; top: 40%; }
          85%  { opacity: 1; }
          100% { left: 50%; top: 22%; opacity: 0; }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${DIM}; border-radius: 2px; }
      `}</style>

      {/* ── Header — minimal, no fills ── */}
      <header style={{ height: 44, flexShrink: 0, borderBottom: `1px solid ${BRD}`, background: B, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: '100%' }}>
          <img style={{ height: 23, display: 'flex', alignItems: 'center', marginRight: 28 }}
            alt=""/><span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, letterSpacing: '0.14em', color: '#ededed', opacity: 0.9 }}>ASTEON />
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
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span title="Budget · tokens" style={{ fontFamily: 'monospace', fontSize: 12, color: M }}>
            <span style={{ color: T }}>$0.00</span>
            <span style={{ color: DIM, margin: '0 6px' }}>·</span>
            <span style={{ color: T }}>500</span>
          </span>

          <button
            onClick={() => { setPaletteOpen(true); setPaletteQ(''); setPaletteIdx(0); }}
            title="Søk verktøy og filer (⌘K)"
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 9px 4px 8px', height: 24, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}`, borderRadius: 3, color: M, cursor: 'pointer', fontSize: 12 }}
          >
            <Search size={11} strokeWidth={1.5} />
            <span style={{ color: DIM }}>Søk verktøy…</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10.5, color: DIM, border: `1px solid ${BRD}`, padding: '0 4px', borderRadius: 2 }}>⌘K</span>
          </button>
          <button title="Play" style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
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

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Icon rail ── */}
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

          {/* Agent runs */}
          {railExpanded && (
            <>
              <div style={{ padding: '14px 14px 6px', marginTop: 6, borderTop: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: M, fontWeight: 500 }}>Runs</span>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: DIM }}>5</span>
              </div>

              <div style={{ flex: 1, overflow: 'auto', padding: '2px 8px 12px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {agentRuns.map((run) => {
                  const meta = statusMeta[run.status];
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

        {/* ── Context panel ── */}
        <aside style={{ width: chatW, flexShrink: 0, borderRight: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            onMouseDown={onDragStart('chat')}
            title="Dra for å justere"
            style={{ position: 'absolute', top: 0, right: -3, bottom: 0, width: 6, cursor: 'col-resize', zIndex: 10, background: dragging === 'chat' ? 'rgba(255,255,255,0.12)' : 'transparent', transition: 'background 0.12s' }}
          />

          {/* ── Context panel header ── */}
          {(() => {
            const HeaderIcon = railIcons[activeRailItem];
            const headerLabel = railLabels[activeRailItem];
            const headerSub: Record<RailKind, string> = {
              chat: 'gpt-fast · Region_01',
              files: '12 filer · main',
              git: '3 endringer · main',
              systems: '4 systemer · aktiv',
              settings: 'Prosjekt-konfigurasjon',
              history: '24 hendelser',
            };
            return (
              <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
                <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRD}`, borderRadius: 3, flexShrink: 0 }}>
                  <HeaderIcon size={12} color={ACCENT} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, color: T, lineHeight: 1.1, letterSpacing: '0.01em' }}>{headerLabel}</span>
                  <span style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{headerSub[activeKind]}</span>
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

          <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {activeKind === 'chat' && (
              <ChatThread tk={{ B, BRD, BRD2, T, M, DIM, ICE, ACCENT, ACCENT_DIM, WARM, GOOD, BAD }} />
            )}

            {activeKind === 'files' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {fileTree.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 6px', paddingLeft: `${6 + item.depth * 14}px`, cursor: 'pointer', position: 'relative' }}>
                    {item.active && <span style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 1.5, background: ACCENT, boxShadow: `0 0 4px ${ACCENT}` }} />}
                    {item.icon ? (
                      <>
                        {item.expanded !== undefined ? (item.expanded ? <ChevronDown size={10} color={DIM} /> : <ChevronRight size={10} color={DIM} />) : <div style={{ width: 10 }} />}
                        <item.icon size={12} color={item.active ? T : M} strokeWidth={1.4} />
                      </>
                    ) : (
                      <>
                        <div style={{ width: 10 }} />
                        <div style={{ width: 3, height: 3, borderRadius: '50%', background: item.active ? ICE : DIM, flexShrink: 0 }} />
                      </>
                    )}
                    <span style={{ fontSize: 13, color: item.active ? T : item.depth === 0 ? T : M, fontWeight: item.depth === 0 ? 500 : 400 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            )}

            {activeKind === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { time: '14:32', msg: 'zone_alpha.json updated' },
                  { time: '14:28', msg: 'Added 3 NPC archetypes' },
                  { time: '14:15', msg: 'Region_01 structure generated' },
                  { time: '13:50', msg: 'Project created' },
                ].map((entry, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 4px', borderBottom: i < 3 ? `1px solid ${BRD2}` : 'none', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: DIM, flexShrink: 0 }}>{entry.time}</span>
                    <span style={{ fontSize: 13, color: M, lineHeight: 1.4 }}>{entry.msg}</span>
                  </div>
                ))}
              </div>
            )}

            {activeKind === 'git' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'monospace', color: M }}>
                  <GitBranch size={11} color={M} /> region_01 · 2 endringer
                </div>
                <div style={{ fontSize: 13, color: T, padding: '5px 8px', borderLeft: `1.5px solid ${ICE}` }}>M zone_alpha.json</div>
                <div style={{ fontSize: 13, color: T, padding: '5px 8px', borderLeft: `1.5px solid ${M}` }}>+ routes/alpha_beta.json</div>
              </div>
            )}

            {(activeKind === 'systems' || activeKind === 'settings') && (
              <div style={{ fontSize: 13, color: DIM, padding: 16, textAlign: 'center' }}>{railLabels[activeRailItem]} kommer her</div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 14px 12px', borderTop: `1px solid ${BRD}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              {(['Sparring', 'Plan', 'Build'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{ padding: 0, fontSize: 12, fontWeight: 400, color: mode === m ? ACCENT : DIM, background: 'none', border: 'none', cursor: 'pointer', borderBottom: mode === m ? `1px solid ${ACCENT}` : '1px solid transparent', paddingBottom: 2 }}>
                  {m}
                </button>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BRD}`, borderRadius: 3, padding: '8px 10px' }}>
              <textarea
                placeholder="Beskriv hva du vil bygge…"
                style={{ width: '100%', background: 'none', border: 'none', color: T, fontSize: 13, resize: 'none', height: 42, outline: 'none', lineHeight: 1.55, fontFamily: 'inherit', marginBottom: 4 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => setStratOpen(v => !v)}
                    title="Velg orkestrasjons-strategi"
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 6px', fontSize: 11, color: T, fontFamily: 'monospace', background: stratOpen ? 'rgba(255,255,255,0.05)' : 'none', border: `1px solid ${BRD}`, borderRadius: 2, cursor: 'pointer' }}
                  >
                    {strategy}
                    {gameTester && <span style={{ color: DIM }}>·tester</span>}
                    {longRun && <span style={{ color: DIM }}>·long</span>}
                    <ChevronDown size={9} style={{ transform: stratOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.12s' }} />
                  </button>
                </div>
                <button style={{ width: 18, height: 18, background: 'none', color: M, border: 'none', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Send size={11} strokeWidth={1.5} />
                </button>

                {stratOpen && (
                  <>
                    <div onClick={() => setStratOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                    <div
                      style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, width: 260, background: '#0a0a0a', border: `1px solid ${BRD}`, borderRadius: 4, boxShadow: '0 -8px 28px rgba(0,0,0,0.5)', zIndex: 50, padding: '6px 0', fontFamily: 'inherit' }}
                    >
                      <div style={{ padding: '6px 12px 4px', fontSize: 10.5, color: DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Strategi</div>
                      {([
                        { id: 'lite',    label: 'Lite',    desc: 'Rask, én agent, lav kost',         icon: Zap },
                        { id: 'economy', label: 'Economy', desc: 'Balansert orkestra, 2–3 agenter',  icon: Layers },
                        { id: 'power',   label: 'Power',   desc: 'Full sverm, beste modeller',       icon: Flame },
                      ] as const).map(s => {
                        const SIcon = s.icon;
                        const active = strategy === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => { setStrategy(s.id); setStratOpen(false); }}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: active ? 'rgba(255,255,255,0.04)' : 'none', border: 'none', borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent', color: T, cursor: 'pointer', textAlign: 'left' }}
                          >
                            <SIcon size={11} color={active ? T : M} strokeWidth={1.4} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12.5, color: T, fontWeight: active ? 500 : 400 }}>{s.label}</div>
                              <div style={{ fontSize: 11, color: M, marginTop: 1 }}>{s.desc}</div>
                            </div>
                            {active && <CheckCircle2 size={10} color={ICE} strokeWidth={1.5} />}
                          </button>
                        );
                      })}

                      <div style={{ borderTop: `1px solid ${BRD}`, marginTop: 4, padding: '6px 0' }}>
                        <div style={{ padding: '4px 12px 4px', fontSize: 10.5, color: DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tillegg</div>
                        {([
                          { key: 'tester', label: 'Game tester run', desc: 'Spawn QA-agent som spiller', val: gameTester, set: setGameTester },
                          { key: 'long',   label: 'Long run',        desc: 'Tillat opp til 4t kjøring',  val: longRun,    set: setLongRun },
                        ] as const).map(t => (
                          <button
                            key={t.key}
                            onClick={() => t.set(v => !v)}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: 'none', border: 'none', color: T, cursor: 'pointer', textAlign: 'left' }}
                          >
                            <span style={{ width: 12, height: 12, borderRadius: 2, border: `1px solid ${t.val ? ICE : BRD}`, background: t.val ? ICE : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {t.val && <CheckCircle2 size={9} color={B} strokeWidth={2.5} />}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12.5, color: t.val ? T : M, fontWeight: t.val ? 500 : 400 }}>{t.label}</div>
                              <div style={{ fontSize: 11, color: DIM, marginTop: 1 }}>{t.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main canvas — switches per top tab ── */}
        {topTab === 'Content'  && <ContentView  tk={tk} tick={tick} />}
        {topTab === 'Systems'  && <SystemsView  tk={tk} tick={tick} />}
        {topTab === 'Region'   && <RegionView   tk={tk} tick={tick} />}
        {topTab === 'Director' && <DirectorView tk={tk} tick={tick} />}
        {topTab === 'Liv'      && <LivesView    tk={tk} tick={tick} />}

        {topTab === 'Build' && (
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: B, minWidth: 0 }}>

          {/* Canvas toolbar */}
          <div style={{ height: 40, borderBottom: `1px solid ${BRD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: B, flexShrink: 0 }}>
            <div style={{ display: 'flex', height: '100%' }}>
              {([['watch', 'Watch', Eye], ['play', 'Play', Gamepad2], ['world', 'World Gen', Globe2]] as [CanvasTab, string, React.ElementType][]).map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setCanvasTab(id)}
                  style={{ padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: canvasTab === id ? 500 : 400, color: canvasTab === id ? T : M, background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', position: 'relative' }}
                >
                  <Icon size={13} strokeWidth={1.4} />{label}
                  {canvasTab === id && <span style={{ position: 'absolute', bottom: 0, left: 14, right: 14, height: 1, background: ACCENT, boxShadow: `0 0 5px ${ACCENT}` }} />}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px' }}>
              <span style={{ fontSize: 12, color: M, fontFamily: 'monospace' }}>Region_01 · <span style={{ color: ACCENT }}>cycle 4</span></span>
              <button style={{ padding: '4px 11px', background: ACCENT_DIM, border: `1px solid ${ACCENT}`, borderRadius: 3, color: ACCENT, fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>▶ Sim</button>
            </div>
          </div>

          {/* Stat strip — single hairline row */}
          <div style={{ height: 24, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 18, flexShrink: 0, fontFamily: 'monospace', fontSize: 12 }}>
            {liveStats.map(({ k, v, accent }) => (
              <span key={k} style={{ color: accent, transition: 'color 0.4s' }}>
                {v}<span style={{ color: DIM, marginLeft: 5 }}>{k}</span>
              </span>
            ))}
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: DIM }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOOD, boxShadow: `0 0 6px ${GOOD}`, animation: 'sp3-blink 1.6s ease-in-out infinite' }} />
              {12 + (tick % 3)}ms · {84 + (tick % 5)}mb
            </span>
          </div>

          {/* World canvas */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Subtle dot grid only */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* Routes */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.2" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <line x1="50%" y1="40%" x2="35%" y2="58%" stroke={ACCENT} strokeWidth="1" opacity="0.55" filter="url(#glow)" />
              <line x1="50%" y1="40%" x2="65%" y2="60%" stroke={ACCENT} strokeWidth="1" opacity="0.55" filter="url(#glow)" />
              <line x1="35%" y1="58%" x2="65%" y2="60%" stroke={WARM} strokeWidth="1" opacity="0.45" strokeDasharray="4 4" style={{ animation: 'sp3-dash 1.4s linear infinite' }} />
              <line x1="50%" y1="40%" x2="50%" y2="22%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 4" style={{ animation: 'sp3-dash 2.4s linear infinite' }} />
            </svg>

            {/* Drifting NPC tokens */}
            <span style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 8px ${ACCENT}`, zIndex: 3, animation: 'sp3-npcAB 6s ease-in-out infinite' }} />
            <span style={{ position: 'absolute', width: 5, height: 5, borderRadius: '50%', background: WARM, boxShadow: `0 0 8px ${WARM}`, zIndex: 3, animation: 'sp3-npcAlphaCenter 7s ease-in-out infinite 1.2s' }} />
            <span style={{ position: 'absolute', width: 5, height: 5, borderRadius: '50%', background: GOOD, boxShadow: `0 0 8px ${GOOD}`, zIndex: 3, animation: 'sp3-npcBetaOutpost 8s ease-in-out infinite 2.4s' }} />
            <span style={{ position: 'absolute', width: 4, height: 4, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 6px ${ACCENT}`, opacity: 0.7, zIndex: 3, animation: 'sp3-npcAB 9s ease-in-out infinite reverse 3s' }} />

            {/* Central node */}
            <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%,-50%)', zIndex: 2 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: B, border: `1px solid ${ACCENT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 0 24px ${ACCENT_DIM}, inset 0 0 12px ${ACCENT_DIM}`, animation: 'sp3-breathe 3.6s ease-in-out infinite' }}>
                <Globe2 size={18} color={ACCENT} strokeWidth={1.4} />
              </div>
              <span style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `1px solid ${ACCENT}`, opacity: 0, animation: 'sp3-ring 3.6s ease-out infinite', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)', marginTop: 8, textAlign: 'center', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: T, fontFamily: 'monospace' }}>REGION_01</div>
                <div style={{ fontSize: 11, color: ACCENT, marginTop: 2, opacity: 0.7 }}>cycle 4</div>
              </div>
            </div>

            {/* Zone alpha */}
            <div style={{ position: 'absolute', left: '35%', top: '58%', transform: 'translate(-50%,-50%)', zIndex: 2 }}>
              <div style={{ width: 34, height: 34, borderRadius: 4, background: B, border: `1px solid ${WARM}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 0 14px rgba(245,169,107,0.18)` }}>
                <Home size={14} color={WARM} strokeWidth={1.4} />
              </div>
              <div style={{ position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)', marginTop: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: 11, color: WARM, fontFamily: 'monospace', opacity: 0.8 }}>ZONE_α</div>
              </div>
            </div>

            {/* Zone beta */}
            <div style={{ position: 'absolute', left: '65%', top: '60%', transform: 'translate(-50%,-50%)', zIndex: 2 }}>
              <div style={{ width: 34, height: 34, borderRadius: 4, background: B, border: `1px solid ${GOOD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 0 14px rgba(136,217,153,0.18)` }}>
                <TreePine size={14} color={GOOD} strokeWidth={1.4} />
              </div>
              <div style={{ position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)', marginTop: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: 11, color: GOOD, fontFamily: 'monospace', opacity: 0.8 }}>ZONE_β</div>
              </div>
            </div>

            {/* Outpost */}
            <div style={{ position: 'absolute', left: '50%', top: '22%', transform: 'translate(-50%,-50%)', zIndex: 2 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: B, border: `1px dashed ${M}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Shield size={11} color={M} strokeWidth={1.4} />
              </div>
              <div style={{ position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)', marginTop: 4, textAlign: 'center', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: 11, color: DIM, fontFamily: 'monospace' }}>OUTPOST</div>
              </div>
            </div>

            {/* Canvas controls */}
            <div style={{ position: 'absolute', right: 14, top: 14, display: 'flex', gap: 2 }}>
              <button style={{ width: 26, height: 26, borderRadius: 3, background: 'none', border: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M }}>
                <Plus size={12} />
              </button>
              <button style={{ width: 26, height: 26, borderRadius: 3, background: 'none', border: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M }}>
                <RefreshCw size={11} />
              </button>
            </div>
          </div>

          {/* Event feed */}
          <div style={{ height: 30, borderTop: `1px solid ${BRD}`, background: B, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, fontFamily: 'monospace', fontSize: 12, color: M, overflow: 'hidden' }}>
            <div key={tick} style={{ display: 'flex', gap: 18, alignItems: 'center', animation: 'sp3-feedSlide 0.5s ease-out' }}>
              <span><span style={{ color: liveEvents[0].color, marginRight: 4 }}>{liveEvents[0].icon}</span>{liveEvents[0].msg}</span>
              <span style={{ color: DIM }}>·</span>
              <span style={{ opacity: 0.6 }}><span style={{ color: liveEvents[1].color, marginRight: 4 }}>{liveEvents[1].icon}</span>{liveEvents[1].msg}</span>
            </div>
            <span style={{ color: DIM, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 6px ${ACCENT}`, animation: 'sp3-blink 1.6s ease-in-out infinite' }} />
              live
            </span>
          </div>
        </main>
        )}

        {/* ── Right panel ── */}
        <aside style={{ width: assetW, flexShrink: 0, borderLeft: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            onMouseDown={onDragStart('asset')}
            title="Dra for å justere"
            style={{ position: 'absolute', top: 0, left: -3, bottom: 0, width: 6, cursor: 'col-resize', zIndex: 10, background: dragging === 'asset' ? 'rgba(255,255,255,0.12)' : 'transparent', transition: 'background 0.12s' }}
          />

          {/* Header — same style as chat panel header */}
          {(() => {
            const rightMeta: Record<typeof rightKind, { icon: React.ElementType; label: string; sub: string }> = {
              assets:    { icon: Package,  label: 'Assets',    sub: `${visibleAssets.length}/${assetItems.length} · ${assetCat.toLowerCase()}` },
              inspector: { icon: Wrench,   label: 'Inspektør', sub: 'ZONE_α · valgt' },
              layers:    { icon: Layers,   label: 'Lag',       sub: '4 lag · 3 synlige' },
              library:   { icon: BookOpen, label: 'Bibliotek', sub: '27 templates · alle' },
              notes:     { icon: FileText, label: 'Notater',   sub: '2 notater · i dag' },
            };
            const meta = rightMeta[rightKind];
            const RIcon = meta.icon;
            return (
              <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
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

          {/* Filters + search */}
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BRD}`, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rightKind === 'assets' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${assetQ ? M : BRD}`, padding: '3px 0', transition: 'border-color 0.12s' }}>
                    <Search size={11} color={assetQ ? M : DIM} />
                    <input
                      value={assetQ}
                      onChange={e => setAssetQ(e.target.value)}
                      placeholder="Søk assets…"
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: T, fontSize: 12, fontFamily: 'inherit', padding: 0 }}
                    />
                    {assetQ && (
                      <button onClick={() => setAssetQ('')} title="Tøm" style={{ width: 12, height: 12, background: 'none', border: 'none', cursor: 'pointer', color: DIM, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={10} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setAssetSettingsOpen(v => !v)}
                    title="Kategorier, sortering, visning"
                    style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: assetSettingsOpen ? 'rgba(255,255,255,0.05)' : 'none', border: `1px solid ${assetSettingsOpen ? BRD : 'transparent'}`, borderRadius: 3, color: assetSettingsOpen ? T : M, cursor: 'pointer' }}
                  >
                    <Settings size={11} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Category chips — always visible, horizontal scroll */}
                <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 2, marginRight: -4 }}>
                  {assetCategories.map(c => {
                    const active = assetCat === c;
                    const count = c === 'Alle' ? assetItems.length : assetItems.filter(a => a.cat === c).length;
                    return (
                      <button
                        key={c}
                        onClick={() => setAssetCat(c)}
                        style={{ display: 'flex', alignItems: 'baseline', gap: 4, padding: '3px 7px', fontSize: 11.5, fontFamily: 'inherit', fontWeight: active ? 500 : 400, color: active ? T : M, background: active ? 'rgba(124,212,255,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${active ? ACCENT_DIM : BRD}`, borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                      >
                        {c}
                        <span style={{ fontSize: 10, color: active ? ACCENT : DIM, fontFamily: 'monospace' }}>{count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Settings dropdown — sort + view */}
                {assetSettingsOpen && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BRD}`, borderRadius: 3, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 10.5, color: DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>Sortering</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {(['navn', 'størrelse', 'nyest'] as AssetSort[]).map(s => {
                          const active = assetSort === s;
                          return (
                            <button
                              key={s}
                              onClick={() => setAssetSort(s)}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', fontSize: 11.5, fontFamily: 'inherit', color: active ? T : M, background: active ? 'rgba(255,255,255,0.05)' : 'none', border: `1px solid ${active ? BRD : 'transparent'}`, borderRadius: 2, cursor: 'pointer', textTransform: 'capitalize' }}
                            >
                              {active && <ArrowUpDown size={9} />}
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, color: DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>Visning</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {([['grid', LayoutGrid, 'Rutenett'], ['list', List, 'Liste']] as [AssetView, any, string][]).map(([v, VIcon, label]) => {
                          const active = assetView === v;
                          return (
                            <button
                              key={v}
                              onClick={() => setAssetView(v)}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', fontSize: 11.5, fontFamily: 'inherit', color: active ? T : M, background: active ? 'rgba(255,255,255,0.05)' : 'none', border: `1px solid ${active ? BRD : 'transparent'}`, borderRadius: 2, cursor: 'pointer' }}
                            >
                              <VIcon size={10} strokeWidth={1.5} />
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {(rightKind === 'library' || rightKind === 'notes') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${BRD}`, padding: '3px 0' }}>
                  <Search size={11} color={DIM} />
                  <span style={{ fontSize: 12, color: DIM }}>Søk…</span>
                </div>
                <button style={{ fontSize: 11, color: M, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', padding: '3px 2px' }}>alle ▾</button>
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflow: 'auto', padding: rightKind === 'assets' ? '10px 12px' : '8px 14px' }}>
            {rightKind === 'assets' && (
              visibleAssets.length === 0 ? (
                <div style={{ padding: '32px 8px', textAlign: 'center', fontSize: 12, color: DIM, lineHeight: 1.5 }}>
                  Ingen treff{assetQ && <> for «{assetQ}»</>}
                  {(assetQ || assetCat !== 'Alle') && (
                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => { setAssetQ(''); setAssetCat('Alle'); }} style={{ fontSize: 11, color: M, background: 'none', border: `1px solid ${BRD}`, borderRadius: 2, padding: '3px 8px', cursor: 'pointer' }}>Nullstill</button>
                    </div>
                  )}
                </div>
              ) : assetView === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {visibleAssets.map(a => (
                    <div key={a.n} style={{ cursor: 'pointer' }}>
                      <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRD}`, borderRadius: 3, marginBottom: 5, position: 'relative' }}>
                        <a.icon size={20} color={DIM} strokeWidth={1.2} />
                        <span style={{ position: 'absolute', top: 3, right: 4, fontSize: 9, color: DIM, fontFamily: 'monospace' }}>{a.cat[0]}</span>
                      </div>
                      <div style={{ fontSize: 12, color: T, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 400 }}>{a.n}</div>
                      <div style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace', marginTop: 1 }}>{a.size}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {visibleAssets.map(a => (
                    <div key={a.n} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 4px', borderBottom: `1px solid ${BRD2}`, cursor: 'pointer' }}>
                      <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRD}`, borderRadius: 3, flexShrink: 0 }}>
                        <a.icon size={11} color={M} strokeWidth={1.4} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, color: T, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.n}</div>
                        <div style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace', marginTop: 1 }}>{a.cat.toLowerCase()} · {a.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {rightKind === 'inspector' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Home size={11} color={WARM} strokeWidth={1.5} />
                  <span style={{ fontSize: 13, color: T, fontWeight: 500 }}>ZONE_α</span>
                  <span style={{ fontSize: 11, color: DIM, fontFamily: 'monospace', marginLeft: 'auto' }}>valgt</span>
                </div>
                {[
                  ['type',      'zone.residential'],
                  ['npcs',      '3'],
                  ['routes',    '2'],
                  ['items',     '7'],
                  ['heat',      '0%'],
                  ['biome',     'urban'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${BRD2}`, paddingBottom: 4, fontFamily: 'monospace' }}>
                    <span style={{ fontSize: 11.5, color: DIM, letterSpacing: '0.04em' }}>{k}</span>
                    <span style={{ fontSize: 12.5, color: T }}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {rightKind === 'layers' && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { n: 'Terrain',    on: true,  c: M },
                  { n: 'Zones',      on: true,  c: ACCENT },
                  { n: 'Routes',     on: true,  c: ACCENT },
                  { n: 'NPCs',       on: false, c: WARM },
                ].map(l => (
                  <div key={l.n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: `1px solid ${BRD2}`, cursor: 'pointer' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 1, background: l.on ? l.c : 'transparent', border: `1px solid ${l.on ? l.c : BRD}`, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: l.on ? T : M, flex: 1 }}>{l.n}</span>
                    <Eye size={11} color={l.on ? M : DIM} strokeWidth={1.4} />
                  </div>
                ))}
              </div>
            )}

            {rightKind === 'library' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { n: 'Market square',  k: 'blueprint',  i: TrendingUp },
                  { n: 'Trade route',    k: 'system',     i: Network },
                  { n: 'NPC archetype',  k: 'template',   i: Users },
                  { n: 'Combat encounter', k: 'system',   i: Sword },
                  { n: 'Daily quest',    k: 'template',   i: Sparkles },
                ].map(it => (
                  <div key={it.n} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 0', borderBottom: `1px solid ${BRD2}`, cursor: 'pointer' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 3, border: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <it.i size={11} color={M} strokeWidth={1.4} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: T, lineHeight: 1.2 }}>{it.n}</div>
                      <div style={{ fontSize: 11, color: DIM, fontFamily: 'monospace', marginTop: 1 }}>{it.k}</div>
                    </div>
                    <Plus size={10} color={DIM} />
                  </div>
                ))}
              </div>
            )}

            {rightKind === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { who: 'B', t: '14:30', body: 'Husk å balansere handelsruten α↔β før playtest.' },
                  { who: 'B', t: '13:55', body: 'Outpost trenger en wave-spawner.' },
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

          {/* Inspector footer (only for assets) */}
          {rightKind === 'assets' && (
            <div style={{ borderTop: `1px solid ${BRD}`, padding: '10px 14px', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: T, fontWeight: 500 }}>zone_alpha.json</span>
                <MoreHorizontal size={12} color={DIM} />
              </div>
              <div style={{ display: 'flex', gap: 16, fontFamily: 'monospace' }}>
                {[['npcs', '3'], ['routes', '2'], ['items', '7']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 13, color: T }}>{v}</span>
                    <span style={{ fontSize: 11, color: DIM }}>{k}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── Right icon rail (kontekst-velger) ── */}
        <aside style={{ width: 44, flexShrink: 0, borderLeft: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0', gap: 1 }}>
          {([
            { k: 'assets',    icon: Package,  label: 'Assets' },
            { k: 'inspector', icon: Wrench,   label: 'Inspektør' },
            { k: 'layers',    icon: Layers,   label: 'Lag' },
            { k: 'library',   icon: BookOpen, label: 'Bibliotek' },
            { k: 'notes',     icon: FileText, label: 'Notater' },
          ] as const).map(r => {
            const active = rightKind === r.k;
            const RIcon = r.icon;
            return (
              <button
                key={r.k}
                onClick={() => setRightKind(r.k)}
                title={r.label}
                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: active ? ACCENT : DIM, cursor: 'pointer', position: 'relative' }}
              >
                <RIcon size={14} strokeWidth={1.4} />
                {active && <span style={{ position: 'absolute', right: 0, top: 6, bottom: 6, width: 1.5, background: ACCENT, boxShadow: `0 0 4px ${ACCENT}` }} />}
              </button>
            );
          })}
        </aside>
      </div>

      {/* ── Footer ── */}
      <footer style={{ height: 24, flexShrink: 0, borderTop: `1px solid ${BRD}`, background: B, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: 'monospace', fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ color: T, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontSize: 'inherit' }}>Console</button>
          {['Performance', 'Timeline', 'Validation'].map(t => (
            <button key={t} style={{ fontSize: 12, color: M, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>{t}</button>
          ))}
          <span style={{ color: DIM, marginLeft: 4 }}>·</span>
          <span style={{ color: M }}>headless <span style={{ color: T }}>[0]</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: DIM }}>
          <span style={{ color: GOOD }}>● 58fps</span>
          <span>auto-save</span>
          <span>14:32</span>
        </div>
      </footer>

      {/* ── Command palette ── */}
      {paletteOpen && (
        <div
          onClick={() => setPaletteOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh', zIndex: 100 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: 560, maxWidth: '92vw', maxHeight: '70vh', background: '#0a0a0a', border: `1px solid ${BRD}`, borderRadius: 6, boxShadow: '0 24px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: `1px solid ${BRD}` }}>
              <Search size={14} color={M} strokeWidth={1.5} />
              <input
                autoFocus
                value={paletteQ}
                onChange={e => { setPaletteQ(e.target.value); setPaletteIdx(0); }}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setPaletteIdx(i => Math.min(flatIds.length - 1, i + 1)); }
                  else if (e.key === 'ArrowUp') { e.preventDefault(); setPaletteIdx(i => Math.max(0, i - 1)); }
                  else if (e.key === 'Enter' && flatIds.length) { setPaletteOpen(false); }
                }}
                placeholder="Søk etter verktøy, filer, handlinger…"
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: T, fontSize: 14, fontFamily: 'inherit' }}
              />
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: DIM, border: `1px solid ${BRD}`, padding: '1px 5px', borderRadius: 2 }}>esc</span>
            </div>

            {/* Results */}
            <div style={{ flex: 1, overflow: 'auto', padding: '6px 0' }}>
              {flatIds.length === 0 ? (
                <div style={{ padding: '40px 16px', textAlign: 'center', fontSize: 13, color: DIM }}>
                  Ingen treff for «{paletteQ}»
                </div>
              ) : (
                Object.entries(grouped).map(([group, items]) => (
                  <div key={group} style={{ marginBottom: 4 }}>
                    <div style={{ padding: '8px 16px 4px', fontSize: 11, color: DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{group}</div>
                    {items.map(tool => {
                      const flatPos = flatIds.indexOf(tool.id);
                      const active = flatPos === safeIdx;
                      const Icon = tool.icon;
                      return (
                        <button
                          key={tool.id}
                          onMouseEnter={() => setPaletteIdx(flatPos)}
                          onClick={() => setPaletteOpen(false)}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', background: active ? 'rgba(255,255,255,0.05)' : 'none', border: 'none', borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent', color: T, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                        >
                          <div style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRD}`, borderRadius: 3, flexShrink: 0 }}>
                            <Icon size={13} color={active ? T : M} strokeWidth={1.4} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, color: T, fontWeight: active ? 500 : 400, lineHeight: 1.3 }}>{tool.label}</div>
                            <div style={{ fontSize: 12, color: M, lineHeight: 1.35, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.desc}</div>
                          </div>
                          {tool.kbd && (
                            <span style={{ fontFamily: 'monospace', fontSize: 11, color: DIM, border: `1px solid ${BRD}`, padding: '1px 5px', borderRadius: 2, flexShrink: 0 }}>{tool.kbd}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderTop: `1px solid ${BRD}`, fontFamily: 'monospace', fontSize: 11, color: DIM }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <span>↑↓ naviger</span>
                <span>↵ åpne</span>
                <span>esc lukk</span>
              </div>
              <span>{flatIds.length} treff</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
        Region_01 er klar. Grunnstruktur for <Code tk={tk}>zone_alpha</Code> med 3 NPC-arketyper og handelsnoder. Skal jeg gå videre med økonomi-systemet?
      </AiMsg>

      <UserMsg tk={tk}>Ja, legg til 2 handelsruter mellom sone alpha og beta.</UserMsg>

      <AiMsg tk={tk}>
        Lagt til. <Code tk={tk}>route_a→b</Code> og <Code tk={tk}>route_b→a</Code>, balansert frakttid 4.2t. Ledig kapasitet 38%.
      </AiMsg>

      <UserMsg tk={tk}>Bra. Foreslå et økonomi-system som matcher tre arketyper.</UserMsg>

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
            <span>tenker · 4.1s · 7 steg</span>
          </button>
          {reasoningOpen && (
            <div style={{
              marginTop: 6, padding: '8px 0 8px 10px',
              borderLeft: `1px solid ${tk.BRD}`,
              fontSize: 12, color: tk.M, lineHeight: 1.5,
            }}>
              {[
                { k: 'leser',     v: <><Code tk={tk}>zone_alpha.json</Code> — 3 NPC-arketyper: handelsmann, vakt, sivil</> },
                { k: 'leser',     v: <><Code tk={tk}>route_a→b</Code> — kapasitet 38%, varer: jern, korn, tøy</> },
                { k: 'vurderer',  v: <>simulerer etterspørsel per arketype (Cobb-Douglas)</> },
                { k: 'vurderer',  v: <>prisformasjon: tilbud × distanse-friksjon</> },
                { k: 'velger',    v: <>modell: 3-faktor med flytende valuta (gull-pegget)</> },
                { k: 'skisserer', v: <>patch: <Code tk={tk}>economy/system.ts</Code> + 2 nye sone-policyer</> },
                { k: 'validerer', v: <>ingen sirkulære avhengigheter, est. balansefeil &lt;2%</> },
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
                <span>1.2k in</span>
                <span>·</span>
                <span>480 out</span>
                <span>·</span>
                <span>$0.0003</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <AiMsg tk={tk}>
        Foreslår 3-faktor økonomi med gull-pegget valuta. Handelsmann skaper tilbud, sivil driver etterspørsel, vakt regulerer pris-volatilitet. Estimert balansefeil &lt;2%.
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
              Implementer 3-faktor økonomi-system for Region_01
            </div>
            <div style={{ padding: '0 10px 8px', fontSize: 11.5, color: tk.M, lineHeight: 1.55 }}>
              Generer <Code tk={tk}>economy/system.ts</Code>, oppdater <Code tk={tk}>zone_alpha</Code> og <Code tk={tk}>zone_beta</Code> med policyer, og seed initial-priser per vare.
            </div>

            {/* File changes */}
            <div style={{ borderTop: `1px solid ${tk.BRD2}`, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { kind: '+', label: 'economy/system.ts', diff: '+184', color: tk.GOOD },
                { kind: '+', label: 'economy/goods.json', diff: '+42', color: tk.GOOD },
                { kind: 'M', label: 'zone_alpha.json', diff: '+18 −2', color: tk.ACCENT },
                { kind: 'M', label: 'zone_beta.json', diff: '+18 −2', color: tk.ACCENT },
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
              <span>~32s</span>
              <span>·</span>
              <span>~$0.0021</span>
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
          Implementering startet. Følger framdriften i <Code tk={tk}>Build</Code>-loggen. Sier ifra ved 100%.
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

export function StudioProV4World() {
  return <StudioProV4WorldInner />;
}

export default StudioProV4World;
