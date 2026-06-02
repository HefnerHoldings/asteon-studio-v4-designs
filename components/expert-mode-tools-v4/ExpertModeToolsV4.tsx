import React, { useState, useMemo } from 'react';
import {
  Search, Save, ChevronRight, ChevronDown, X, AlertTriangle, Eye, EyeOff, Lock, Unlock,
  Layers as LayersIcon, Grid3x3, Box, Mountain, Route, Trees,
  Droplets, Sun, Users, Building2, Volume2, Car, CloudRain, Ruler,
  Sparkles, Undo2, Redo2, RotateCcw, Plus, Minus, MapPin, Waves,
  Wind, Snowflake, Cloud, CloudSnow, CloudFog, Footprints, Compass,
  Triangle, Circle as CircleIcon, Square as SquareIcon, Hexagon,
  Activity, Wrench, Settings2, MessageSquare, Send, Sparkle, Play,
  Folder, GitBranch, History, MoreHorizontal,
} from 'lucide-react';

type TopTab = 'Build' | 'Content' | 'Systems' | 'Region' | 'Director' | 'Liv';

const B = '#0a0c12';
const BG = '#0a0c12';
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
const WARM_DIM = 'rgba(245,169,107,0.12)';
const GOOD = '#88d999';
const BAD = '#f08a82';

type CatId =
  | 'zone' | 'props' | 'road' | 'terrain'
  | 'water' | 'light' | 'npc' | 'building'
  | 'audio' | 'traffic' | 'weather' | 'measure' | 'layers';

type Cat = {
  id: CatId;
  label: string;
  icon: any;
  color: string;
  tools: { id: string; label: string; icon?: any }[];
};

const CATS: Cat[] = [
  { id: 'zone', label: 'Soner', icon: Grid3x3, color: '#c891ff', tools: [
    { id: 'residential', label: 'Bolig' },
    { id: 'commercial',  label: 'Handel' },
    { id: 'industrial',  label: 'Industri' },
    { id: 'park',        label: 'Park' },
    { id: 'mixed',       label: 'Blandet' },
  ]},
  { id: 'props', label: 'Props', icon: Box, color: WARM, tools: [
    { id: 'tree',  label: 'Tre' },
    { id: 'lamp',  label: 'Lykt' },
    { id: 'bench', label: 'Benk' },
    { id: 'fence', label: 'Gjerde' },
    { id: 'sign',  label: 'Skilt' },
  ]},
  { id: 'road', label: 'Veier', icon: Route, color: ACCENT, tools: [
    { id: 'straight',   label: 'Rett' },
    { id: 'curve',      label: 'Kurve' },
    { id: 'junction',   label: 'Kryss' },
    { id: 'roundabout', label: 'Rundkjøring' },
    { id: 'pedestrian', label: 'Fortau' },
  ]},
  { id: 'terrain', label: 'Terreng', icon: Mountain, color: '#a3a380', tools: [
    { id: 'raise',   label: 'Hev' },
    { id: 'lower',   label: 'Senk' },
    { id: 'smooth',  label: 'Glatt' },
    { id: 'flatten', label: 'Flat' },
    { id: 'paint',   label: 'Mal' },
  ]},
  { id: 'water', label: 'Vann', icon: Droplets, color: '#6ab7ff', tools: [
    { id: 'ocean',  label: 'Hav' },
    { id: 'river',  label: 'Elv' },
    { id: 'lake',   label: 'Innsjø' },
    { id: 'stream', label: 'Bekk' },
    { id: 'coast',  label: 'Kyst' },
  ]},
  { id: 'light', label: 'Lys', icon: Sun, color: '#ffd966', tools: [
    { id: 'sun',    label: 'Sol' },
    { id: 'point',  label: 'Punkt' },
    { id: 'spot',   label: 'Spot' },
    { id: 'ambient',label: 'Ambient' },
    { id: 'tod',    label: 'Tid på døgn' },
  ]},
  { id: 'npc', label: 'NPC', icon: Users, color: '#88d999', tools: [
    { id: 'drop',   label: 'Slipp' },
    { id: 'crowd',  label: 'Folkemengde' },
    { id: 'patrol', label: 'Patrulje' },
    { id: 'social', label: 'Sosial klynge' },
    { id: 'spawn',  label: 'Spawn-sone' },
  ]},
  { id: 'building', label: 'Bygg', icon: Building2, color: '#d4d4d8', tools: [
    { id: 'house',     label: 'Hus' },
    { id: 'tower',     label: 'Tårn' },
    { id: 'warehouse', label: 'Lager' },
    { id: 'shop',      label: 'Butikk' },
    { id: 'custom',    label: 'Egendefinert' },
  ]},
  { id: 'audio', label: 'Lyd', icon: Volume2, color: '#ff9ec7', tools: [
    { id: 'ambient', label: 'Ambient-sone' },
    { id: 'point',   label: 'Punktkilde' },
    { id: 'music',   label: 'Musikk-sone' },
    { id: 'foley',   label: 'Foley' },
    { id: 'mute',    label: 'Stille-sone' },
  ]},
  { id: 'traffic', label: 'Trafikk', icon: Car, color: '#ffaa66', tools: [
    { id: 'route',    label: 'Rute' },
    { id: 'parking',  label: 'Parkering' },
    { id: 'transit',  label: 'Kollektiv' },
    { id: 'bike',     label: 'Sykkel' },
    { id: 'rush',     label: 'Rushtid' },
  ]},
  { id: 'weather', label: 'Vær', icon: CloudRain, color: '#a0d8ff', tools: [
    { id: 'clear', label: 'Klart' },
    { id: 'rain',  label: 'Regn' },
    { id: 'snow',  label: 'Snø' },
    { id: 'fog',   label: 'Tåke' },
    { id: 'storm', label: 'Storm' },
  ]},
  { id: 'measure', label: 'Måle', icon: Ruler, color: '#bbbbbb', tools: [
    { id: 'distance', label: 'Avstand' },
    { id: 'area',     label: 'Areal' },
    { id: 'height',   label: 'Høyde' },
    { id: 'angle',    label: 'Vinkel' },
    { id: 'volume',   label: 'Volum' },
  ]},
  { id: 'layers', label: 'Lag', icon: LayersIcon, color: '#e8e8e8', tools: [
    { id: 'manage', label: 'Behandle' },
  ]},
];

type LayerRow = { id: string; label: string; visible: boolean; locked: boolean; count: number };
const INITIAL_LAYERS: LayerRow[] = [
  { id: 'l-zone',     label: 'Soner',     visible: true,  locked: false, count: 12 },
  { id: 'l-road',     label: 'Veier',     visible: true,  locked: false, count: 34 },
  { id: 'l-terrain',  label: 'Terreng',   visible: true,  locked: true,  count:  1 },
  { id: 'l-water',    label: 'Vann',      visible: true,  locked: false, count:  3 },
  { id: 'l-building', label: 'Bygg',      visible: true,  locked: false, count: 58 },
  { id: 'l-props',    label: 'Props',     visible: true,  locked: false, count: 412 },
  { id: 'l-npc',      label: 'NPC',       visible: true,  locked: false, count: 24 },
  { id: 'l-traffic',  label: 'Trafikk',   visible: false, locked: false, count:  8 },
  { id: 'l-audio',    label: 'Lyd',       visible: false, locked: false, count: 11 },
  { id: 'l-light',    label: 'Lys',       visible: true,  locked: false, count:  5 },
];

type ModeTab = 'live' | 'jssim' | 'manuell';

export function ExpertModeToolsV4() {
  const [cat, setCat] = useState<CatId>('zone');
  const [tool, setTool] = useState<string>('residential');
  const [mode, setMode] = useState<ModeTab>('manuell');
  const [brushSize, setBrushSize] = useState(80);
  const [opacity, setOpacity] = useState(80);
  const [strength, setStrength] = useState(50);
  const [density, setDensity] = useState(40);
  const [gridOn, setGridOn] = useState(true);
  const [snapOn, setSnapOn] = useState(true);
  const [iso, setIso] = useState(true);
  const [showToast, setShowToast] = useState(true);
  const [layers, setLayers] = useState<LayerRow[]>(INITIAL_LAYERS);
  const [todHour, setTodHour] = useState(14);
  const [sunAz, setSunAz] = useState(135);
  const [weatherIntensity, setWeatherIntensity] = useState(60);
  const [windDir, setWindDir] = useState(270);
  const [audioRadius, setAudioRadius] = useState(40);
  const [audioVol, setAudioVol] = useState(70);
  const [roadWidth, setRoadWidth] = useState(8);
  const [lanes, setLanes] = useState(2);
  const [buildHeight, setBuildHeight] = useState(3);
  const [buildRot, setBuildRot] = useState(0);
  const [waterDepth, setWaterDepth] = useState(4);
  const [waterFlow, setWaterFlow] = useState(30);
  const [crowdCount, setCrowdCount] = useState(12);
  const [measureUnit, setMeasureUnit] = useState<'m' | 'km' | 'ft'>('m');
  const [rightTab, setRightTab] = useState<'tools' | 'chat'>('tools');
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState<'Sparring' | 'Plan' | 'Build'>('Sparring');
  const [activeRail, setActiveRail] = useState<'chat' | 'files' | 'git' | 'systems' | 'history'>('chat');
  const [topTab, setTopTab] = useState<TopTab>('Build');

  const activeCat = useMemo(() => CATS.find(c => c.id === cat)!, [cat]);

  function pickCat(id: CatId) {
    setCat(id);
    const next = CATS.find(c => c.id === id)!;
    setTool(next.tools[0].id);
  }

  function toggleLayer(id: string, key: 'visible' | 'locked') {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, [key]: !l[key] } : l));
  }

  return (
    <div style={{
      width: '100%', height: '100vh', background: B, color: T,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
      fontSize: 13, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${DIM}; border-radius: 2px; }
      `}</style>
      {/* ============ TOP BAR (Studio Pro V3 style) ============ */}
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

            {/* Manuell Editor — separated mode button */}
            {(() => {
              const active = mode === 'manuell';
              return (
                <>
                  <div style={{ width: 1, height: 16, background: BRD, margin: '0 4px', alignSelf: 'center' }} />
                  <button onClick={() => setMode('manuell')}
                    style={{ position: 'relative', padding: '0 12px', height: '100%', fontSize: 12, fontWeight: active ? 600 : 400, color: active ? ACCENT : M, background: active ? ACCENT_DIM : 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Activity size={11} strokeWidth={1.5} style={{ opacity: active ? 1 : 0.5 }} />
                    Manuell Editor
                    {active && <span style={{ position: 'absolute', bottom: 0, left: 8, right: 8, height: 1, background: ACCENT, boxShadow: `0 0 5px ${ACCENT}` }} />}
                  </button>
                </>
              );
            })()}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: GOOD, fontSize: 12 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOOD }} /> Lagret
          </span>
          <span title="Budget · tokens" style={{ fontFamily: 'monospace', fontSize: 12, color: M }}>
            <span style={{ color: T }}>$0.00</span>
            <span style={{ color: DIM, margin: '0 6px' }}>·</span>
            <span style={{ color: T }}>500</span>
          </span>
          <button title="Søk verktøy og filer (⌘K)" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 9px 4px 8px', height: 24, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}`, borderRadius: 3, color: M, cursor: 'pointer', fontSize: 12 }}>
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

      {/* ============ HORIZONTAL CATEGORY BAR ============ */}
      <nav style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, background: B, display: 'flex', alignItems: 'stretch', padding: '0 6px', overflowX: 'auto' }}>
        {CATS.map(c => {
          const active = c.id === cat;
          return (
            <button key={c.id} onClick={() => pickCat(c.id)} style={{
              position: 'relative', padding: '0 12px', background: 'none', border: 'none',
              display: 'flex', alignItems: 'center', gap: 6, color: active ? T : M,
              cursor: 'pointer', fontSize: 12, flexShrink: 0,
            }} title={c.label}>
              <c.icon size={12} color={active ? c.color : M} />
              <span>{c.label}</span>
              {active && <span style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 1, background: c.color, boxShadow: `0 0 5px ${c.color}` }} />}
            </button>
          );
        })}
      </nav>

      {/* ============ BELOW-HEADER ROW (builder rail + chat + main column) ============ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', minHeight: 0 }}>

        {/* ============ BUILDER RAIL (V3 style, 44px) ============ */}
        <aside style={{ width: 44, flexShrink: 0, borderRight: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0', gap: 1 }}>
          {([
            { id: 'chat',    Icon: MessageSquare, label: 'Chat' },
            { id: 'files',   Icon: Folder,        label: 'Filer' },
            { id: 'git',     Icon: GitBranch,     label: 'Git' },
            { id: 'systems', Icon: Settings2,     label: 'Systemer' },
            { id: 'history', Icon: History,       label: 'Historikk' },
          ] as const).map(r => {
            const active = activeRail === r.id;
            return (
              <button key={r.id} onClick={() => setActiveRail(r.id)} title={r.label}
                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: active ? T : DIM, cursor: 'pointer' }}>
                <r.Icon size={14} strokeWidth={1.4} />
              </button>
            );
          })}
          <div style={{ flex: 1 }} />
          <div title="Builder · gpt-fast" style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: T, marginBottom: 6 }}>B</div>
        </aside>

        {/* ============ CHAT ASIDE (V3 style, 340px) ============ */}
        <aside style={{ width: 340, flexShrink: 0, borderRight: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column' }}>
          {/* ── Chat header ── */}
          <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
            <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRD}`, borderRadius: 3, flexShrink: 0 }}>
              <MessageSquare size={12} color={ACCENT} strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 13, color: T, lineHeight: 1.1, letterSpacing: '0.01em' }}>Chat</span>
              <span style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>gpt-fast · {activeCat.label} · {chatMode}</span>
            </div>
            <button title="Ny samtale" style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: `1px solid ${BRD}`, borderRadius: 3, color: M, cursor: 'pointer' }}>
              <Plus size={11} strokeWidth={1.5} />
            </button>
            <button title="Søk" style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
              <Search size={11} strokeWidth={1.5} />
            </button>
            <button title="Mer" style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
              <MoreHorizontal size={12} strokeWidth={1.5} />
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Day divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 1, background: BRD }} />
              <span style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace', letterSpacing: '0.06em' }}>I DAG · 14:15</span>
              <div style={{ flex: 1, height: 1, background: BRD }} />
            </div>

            {/* AI msg */}
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 18, height: 18, borderRadius: 3, background: ACCENT_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Sparkle size={10} color={ACCENT} />
              </div>
              <div style={{ flex: 1, fontSize: 13, color: T, lineHeight: 1.55 }}>
                Klar med <span style={{ color: ACCENT, fontFamily: 'monospace' }}>sone_alpha</span>. Vil du at jeg foreslår en handelskorridor langs <span style={{ color: '#c891ff', fontFamily: 'monospace' }}>route_a→b</span>?
              </div>
            </div>

            {/* User msg */}
            <div style={{ alignSelf: 'flex-end', maxWidth: '85%', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BRD}`, borderRadius: 4, fontSize: 13, color: T, lineHeight: 1.5 }}>
              Ja, og hold boligtetthet over 60%.
            </div>

            {/* AI msg with suggestion card */}
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 18, height: 18, borderRadius: 3, background: ACCENT_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Sparkle size={10} color={ACCENT} />
              </div>
              <div style={{ flex: 1, fontSize: 13, color: T, lineHeight: 1.55 }}>
                Foreslår tre bolig→handel skift langs hovedveien. +18% fottrafikk, bolig fortsatt 62%.
                <div style={{ marginTop: 6, padding: '6px 8px', border: `1px solid ${BRD}`, borderRadius: 3, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: 10.5, color: M, marginBottom: 4, letterSpacing: '0.04em' }}>FORSLAG · 3 endringer</div>
                  <div style={{ fontSize: 11, color: T, fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span>· zone[12,4] bolig → handel</span>
                    <span>· zone[13,4] bolig → handel</span>
                    <span>· zone[14,4] bolig → handel</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    <button style={{ height: 22, padding: '0 8px', background: ICE, border: 'none', borderRadius: 3, color: B, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>Bruk</button>
                    <button style={{ height: 22, padding: '0 8px', background: 'none', border: `1px solid ${BRD}`, borderRadius: 3, color: M, fontSize: 11, cursor: 'pointer' }}>Avvis</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input (V3-style with mode tabs) */}
          <div style={{ padding: '10px 14px 12px', borderTop: `1px solid ${BRD}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              {(['Sparring', 'Plan', 'Build'] as const).map(m => (
                <button key={m} onClick={() => setChatMode(m)} style={{
                  padding: 0, fontSize: 12, fontWeight: 400, color: chatMode === m ? ACCENT : DIM,
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: chatMode === m ? `1px solid ${ACCENT}` : '1px solid transparent', paddingBottom: 2,
                }}>{m}</button>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BRD}`, borderRadius: 3, padding: '8px 10px' }}>
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Beskriv hva du vil bygge…"
                style={{ width: '100%', background: 'none', border: 'none', color: T, fontSize: 13, resize: 'none', height: 42, outline: 'none', lineHeight: 1.55, fontFamily: 'inherit' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 6px', fontSize: 11, color: T, fontFamily: 'monospace', background: 'none', border: `1px solid ${BRD}`, borderRadius: 2, cursor: 'pointer' }}>
                  economy <ChevronDown size={9} />
                </button>
                <button style={{ width: 18, height: 18, background: 'none', color: M, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={11} />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ============ MAIN COLUMN (toolbar + main area) ============ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

      {/* ============ MAIN AREA ============ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* CANVAS */}
        <main style={{ flex: 1, position: 'relative', overflow: 'hidden', background: B }}>
          <CanvasPlaceholder cat={cat} tool={tool} gridOn={gridOn} todHour={todHour} weatherIntensity={weatherIntensity} catColor={activeCat.color} />

          {/* bottom status */}
          <div style={{ position: 'absolute', left: 12, bottom: 10, display: 'flex', gap: 14, fontSize: 11, color: M, fontFamily: 'monospace' }}>
            <span>x: 1248.4</span><span>y: 0.0</span><span>z: -340.6</span>
            <span style={{ color: DIM }}>·</span>
            <span>seleksjon: 0</span>
            <span style={{ color: DIM }}>·</span>
            <span>fps: 58</span>
          </div>

          {/* connection toast */}
          {showToast && (
            <div style={{
              position: 'absolute', right: 14, bottom: 14, width: 320,
              padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}`,
              borderLeft: `2px solid ${BAD}`, borderRadius: 4,
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <AlertTriangle size={14} color={BAD} style={{ marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: T, fontWeight: 500 }}>Tilkobling feilet</div>
                <div style={{ fontSize: 11, color: M, marginTop: 2 }}>Orchestrator unreachable after 10 reconnect attempts</div>
              </div>
              <button style={{ height: 22, padding: '0 8px', background: 'none', border: `1px solid ${BRD}`, borderRadius: 3, color: T, fontSize: 11, cursor: 'pointer' }}>Prøv igjen</button>
              <button onClick={() => setShowToast(false)} style={{ background: 'none', border: 'none', color: M, cursor: 'pointer', padding: 0 }}><X size={12} /></button>
            </div>
          )}
        </main>

        {/* RIGHT contextual panel — tabs: Verktøy / Chat */}
        <aside style={{ width: 300, borderLeft: `1px solid ${BRD}`, display: 'flex', flexDirection: 'column', flexShrink: 0, background: B }}>
          {/* tab header */}
          <div style={{ height: 30, display: 'flex', alignItems: 'stretch', borderBottom: `1px solid ${BRD}`, flexShrink: 0 }}>
            {([
              { id: 'tools', label: activeCat.label, icon: Wrench, color: activeCat.color, sub: activeCat.tools.find(t => t.id === tool)?.label },
              { id: 'chat',  label: 'Chat',           icon: MessageSquare, color: ACCENT, sub: 'gpt-fast' },
            ] as const).map(t => {
              const active = rightTab === t.id;
              return (
                <button key={t.id} onClick={() => setRightTab(t.id)} style={{
                  flex: 1, padding: '0 10px', background: 'none',
                  border: 'none', borderBottom: active ? `1px solid ${t.color}` : '1px solid transparent',
                  color: active ? T : M, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5,
                }}>
                  <t.icon size={11} color={active ? t.color : M} />
                  <span style={{ color: active ? T : M }}>{t.label}</span>
                  {t.sub && <span style={{ color: DIM, fontSize: 10.5 }}>· {t.sub}</span>}
                </button>
              );
            })}
          </div>

          {rightTab === 'tools' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
              {/* relocated tool context: undo/redo + chips + params + view toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${BRD}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <IconBtn icon={Undo2} />
                    <IconBtn icon={Redo2} />
                    <IconBtn icon={RotateCcw} />
                  </div>
                  <div style={{ width: 1, height: 18, background: BRD, marginLeft: 4 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', border: `1px solid ${BRD}`, borderRadius: 3 }}>
                    <activeCat.icon size={12} color={activeCat.color} />
                    <span style={{ fontSize: 11.5, color: T }}>{activeCat.label}</span>
                  </div>
                </div>

                {/* sub-tools chips (wrap) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {activeCat.tools.map(tt => {
                    const active = tt.id === tool;
                    return (
                      <button key={tt.id} onClick={() => setTool(tt.id)} style={{
                        height: 24, padding: '0 8px', background: active ? activeCat.color + '14' : 'none',
                        border: `1px solid ${active ? activeCat.color : BRD}`, borderRadius: 3,
                        color: active ? ICE : M, fontSize: 11, cursor: 'pointer',
                      }}>
                        {tt.label}
                      </button>
                    );
                  })}
                </div>

                {/* contextual parameters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <ContextParams
                    cat={cat}
                    brushSize={brushSize} setBrushSize={setBrushSize}
                    opacity={opacity} setOpacity={setOpacity}
                    strength={strength} setStrength={setStrength}
                    density={density} setDensity={setDensity}
                  />
                </div>

                {/* view toggles */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <button onClick={() => setSnapOn(!snapOn)} style={toggleBtnStyle(snapOn)} title="Snap til grid">
                    <Compass size={11} /> Snap
                  </button>
                  <button onClick={() => setGridOn(!gridOn)} style={toggleBtnStyle(gridOn)} title="Grid">
                    <Grid3x3 size={11} /> Grid
                  </button>
                  <button onClick={() => setIso(!iso)} style={toggleBtnStyle(iso)}>{iso ? 'Iso' : 'Top'}</button>
                </div>
              </div>

              <RightPanel
                cat={cat} tool={tool} layers={layers} toggleLayer={toggleLayer}
                brushSize={brushSize} setBrushSize={setBrushSize}
                opacity={opacity} setOpacity={setOpacity}
                strength={strength} setStrength={setStrength}
                todHour={todHour} setTodHour={setTodHour}
                sunAz={sunAz} setSunAz={setSunAz}
                weatherIntensity={weatherIntensity} setWeatherIntensity={setWeatherIntensity}
                windDir={windDir} setWindDir={setWindDir}
                audioRadius={audioRadius} setAudioRadius={setAudioRadius}
                audioVol={audioVol} setAudioVol={setAudioVol}
                roadWidth={roadWidth} setRoadWidth={setRoadWidth}
                lanes={lanes} setLanes={setLanes}
                buildHeight={buildHeight} setBuildHeight={setBuildHeight}
                buildRot={buildRot} setBuildRot={setBuildRot}
                waterDepth={waterDepth} setWaterDepth={setWaterDepth}
                waterFlow={waterFlow} setWaterFlow={setWaterFlow}
                crowdCount={crowdCount} setCrowdCount={setCrowdCount}
                measureUnit={measureUnit} setMeasureUnit={setMeasureUnit}
              />
            </div>
          )}

          {rightTab === 'chat' && (
            <ChatPanel
              activeCatLabel={activeCat.label}
              activeToolLabel={activeCat.tools.find(t => t.id === tool)?.label ?? ''}
              chatInput={chatInput}
              setChatInput={setChatInput}
            />
          )}
        </aside>
      </div>
        </div>
      </div>
    </div>
  );
}

function ChatPanel({ activeCatLabel, activeToolLabel, chatInput, setChatInput }:
  { activeCatLabel: string; activeToolLabel: string; chatInput: string; setChatInput: (s: string) => void }) {
  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* context badge */}
        <div style={{ padding: '6px 8px', background: 'rgba(124,212,255,0.04)', border: `1px solid ${BRD}`, borderRadius: 3, fontSize: 11, color: M, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkle size={10} color={ACCENT} />
          Kontekst: <span style={{ color: T }}>{activeCatLabel} · {activeToolLabel}</span>
        </div>

        {/* user msg */}
        <div style={{ alignSelf: 'flex-end', maxWidth: '85%', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BRD}`, borderRadius: 4, fontSize: 12, color: T, lineHeight: 1.45 }}>
          Kan du foreslå en bedre layout for sone_alpha? Vil ha mer handel langs hovedveien.
        </div>

        {/* assistant */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 18, height: 18, borderRadius: 3, background: ACCENT_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <Sparkle size={10} color={ACCENT} />
          </div>
          <div style={{ flex: 1, fontSize: 12, color: T, lineHeight: 1.5 }}>
            Foreslår å bytte tre bolig-felt langs <span style={{ color: ACCENT, fontFamily: 'monospace' }}>route_a→b</span> til <span style={{ color: '#c891ff', fontFamily: 'monospace' }}>handel</span>. Dette gir +18% fottrafikk og holder boligtetthet over 60%.
            <div style={{ marginTop: 6, padding: '6px 8px', border: `1px solid ${BRD}`, borderRadius: 3, background: 'rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: 10.5, color: M, marginBottom: 4, letterSpacing: '0.04em' }}>FORSLAG · 3 endringer</div>
              <div style={{ fontSize: 11, color: T, fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span>· zone[12,4] bolig → handel</span>
                <span>· zone[13,4] bolig → handel</span>
                <span>· zone[14,4] bolig → handel</span>
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                <button style={{ height: 22, padding: '0 8px', background: ACCENT_DIM, border: `1px solid ${ACCENT}`, borderRadius: 3, color: ICE, fontSize: 11, cursor: 'pointer' }}>Bruk</button>
                <button style={{ height: 22, padding: '0 8px', background: 'none', border: `1px solid ${BRD}`, borderRadius: 3, color: M, fontSize: 11, cursor: 'pointer' }}>Avvis</button>
              </div>
            </div>
          </div>
        </div>

        {/* hint */}
        <div style={{ fontSize: 10.5, color: DIM, textAlign: 'center', padding: '4px 0' }}>
          Chat er tilgjengelig i alle modi · forslag krever bekreftelse i manuell modus
        </div>
      </div>

      {/* composer */}
      <div style={{ borderTop: `1px solid ${BRD}`, padding: 8, display: 'flex', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
        <textarea
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Spør om aktivt verktøy, eller foreslå endring…"
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
    </>
  );
}

function IconBtn({ icon: Icon }: { icon: any }) {
  return (
    <button style={{ width: 26, height: 26, background: 'none', border: `1px solid ${BRD}`, borderRadius: 3, color: M, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={12} />
    </button>
  );
}

function toggleBtnStyle(active: boolean): React.CSSProperties {
  return {
    height: 26, padding: '0 8px', background: active ? ACCENT_DIM : 'none',
    border: `1px solid ${active ? ACCENT : BRD}`, borderRadius: 3,
    color: active ? ICE : M, fontSize: 11, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 4,
  };
}

function Slider({ label, value, setValue, min = 0, max = 100, unit = '' }: { label: string; value: number; setValue: (n: number) => void; min?: number; max?: number; unit?: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: M, letterSpacing: '0.04em' }}>{label}</span>
        <span style={{ fontSize: 11, color: T, fontFamily: 'monospace' }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))}
        style={{ width: '100%', accentColor: ACCENT, height: 4 }} />
    </div>
  );
}

function SliderInline({ label, value, setValue, min = 0, max = 100, unit = '', width = 86 }: { label: string; value: number; setValue: (n: number) => void; min?: number; max?: number; unit?: string; width?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 11, color: M }}>{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))}
        style={{ width, accentColor: ACCENT }} />
      <span style={{ fontSize: 11, color: T, fontFamily: 'monospace', minWidth: 28 }}>{value}{unit}</span>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: { v: string; l: string }[]; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: M, marginBottom: 4 }}>{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        width: '100%', height: 26, background: B, border: `1px solid ${BRD}`, borderRadius: 3,
        color: T, fontSize: 12, padding: '0 8px', outline: 'none',
      }}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function ContextParams({ cat, brushSize, setBrushSize, opacity, setOpacity, strength, setStrength, density, setDensity }:
  { cat: CatId; brushSize: number; setBrushSize: (n: number) => void; opacity: number; setOpacity: (n: number) => void; strength: number; setStrength: (n: number) => void; density: number; setDensity: (n: number) => void }) {
  // Categories that paint use brush+opacity; some use strength/density.
  const showBrush = ['zone', 'terrain', 'water', 'props', 'audio'].includes(cat);
  const showOpacity = ['zone', 'water', 'weather'].includes(cat);
  const showStrength = ['terrain', 'light'].includes(cat);
  const showDensity = ['props', 'npc', 'traffic'].includes(cat);
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      {showBrush && <SliderInline label="Pensel" value={brushSize} setValue={setBrushSize} min={1} max={200} unit="m" />}
      {showStrength && <SliderInline label="Styrke" value={strength} setValue={setStrength} unit="%" />}
      {showDensity && <SliderInline label="Tetthet" value={density} setValue={setDensity} unit="%" />}
      {showOpacity && <SliderInline label="Opacity" value={opacity} setValue={setOpacity} unit="%" />}
    </div>
  );
}

function CanvasPlaceholder({ cat, tool, gridOn, todHour, weatherIntensity, catColor }:
  { cat: CatId; tool: string; gridOn: boolean; todHour: number; weatherIntensity: number; catColor: string }) {
  // Sky color shifts with time-of-day.
  const dayT = Math.cos(((todHour - 12) / 12) * Math.PI) * 0.5 + 0.5; // 1=noon, 0=midnight
  const sky = `linear-gradient(180deg, rgba(${Math.round(10 + 60 * dayT)},${Math.round(20 + 80 * dayT)},${Math.round(40 + 100 * dayT)},1) 0%, #06090a 70%)`;
  const ground = `rgba(${Math.round(20 + 40 * dayT)}, ${Math.round(40 + 50 * dayT)}, ${Math.round(20 + 30 * dayT)}, 1)`;

  return (
    <div style={{ position: 'absolute', inset: 0, background: sky, overflow: 'hidden' }}>
      {/* iso ground */}
      <div style={{
        position: 'absolute', left: '50%', top: '52%', width: 900, height: 560,
        transform: 'translate(-50%, -50%) perspective(900px) rotateX(58deg) rotateZ(0deg)',
        background: ground, border: `1px solid rgba(255,255,255,0.05)`,
        backgroundImage: gridOn ? `
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)` : 'none',
        backgroundSize: '40px 40px',
      }} />

      {/* cursor preview ring (suggests active brush) */}
      <div style={{
        position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%, -50%)',
        width: 90, height: 50, border: `1px dashed ${catColor}`, borderRadius: '50%', opacity: 0.6,
        pointerEvents: 'none',
      }} />

      {/* weather overlay */}
      {weatherIntensity > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 30%, rgba(160,200,255,${0.02 + weatherIntensity / 800}) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* hint label */}
      <div style={{
        position: 'absolute', left: 12, top: 12, fontSize: 11, color: M,
        fontFamily: 'monospace', padding: '4px 8px', background: 'rgba(0,0,0,0.5)',
        border: `1px solid ${BRD}`, borderRadius: 3,
      }}>
        {cat}.{tool} · klikk og dra for å påvirke
      </div>

      {/* compass */}
      <div style={{ position: 'absolute', right: 14, top: 14, display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: M, fontFamily: 'monospace' }}>
        <Compass size={11} color={M} /> N
      </div>
    </div>
  );
}

function RightPanel(props: any) {
  const { cat, tool, layers, toggleLayer } = props;

  if (cat === 'layers') {
    return (
      <div>
        <div style={{ fontSize: 11, color: M, marginBottom: 8, letterSpacing: '0.04em' }}>Lag · {layers.length}</div>
        {layers.map((l: LayerRow) => (
          <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 4px', borderBottom: `1px solid ${BRD2}` }}>
            <button onClick={() => toggleLayer(l.id, 'visible')} style={{ background: 'none', border: 'none', color: l.visible ? T : DIM, cursor: 'pointer', padding: 2 }}>
              {l.visible ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
            <button onClick={() => toggleLayer(l.id, 'locked')} style={{ background: 'none', border: 'none', color: l.locked ? WARM : DIM, cursor: 'pointer', padding: 2 }}>
              {l.locked ? <Lock size={11} /> : <Unlock size={11} />}
            </button>
            <span style={{ flex: 1, fontSize: 12, color: l.visible ? T : M }}>{l.label}</span>
            <span style={{ fontSize: 11, color: M, fontFamily: 'monospace' }}>{l.count}</span>
          </div>
        ))}
      </div>
    );
  }

  if (cat === 'light') {
    return (
      <>
        <Slider label="Tid på døgn" value={props.todHour} setValue={props.setTodHour} min={0} max={23} unit=":00" />
        <Slider label="Sol azimut" value={props.sunAz} setValue={props.setSunAz} min={0} max={359} unit="°" />
        <Slider label="Styrke" value={props.strength} setValue={props.setStrength} />
        <Select label="Fargetemp" value="5500" onChange={() => {}} options={[
          { v: '2700', l: '2700K · varm' }, { v: '4000', l: '4000K · nøytral' }, { v: '5500', l: '5500K · dag' }, { v: '7000', l: '7000K · kald' },
        ]} />
        <Select label="Skygge" value="soft" onChange={() => {}} options={[
          { v: 'off', l: 'Av' }, { v: 'hard', l: 'Hard' }, { v: 'soft', l: 'Myk' }, { v: 'ray', l: 'Ray-traced' },
        ]} />
      </>
    );
  }

  if (cat === 'weather') {
    const icon = tool === 'rain' ? CloudRain : tool === 'snow' ? CloudSnow : tool === 'fog' ? CloudFog : tool === 'storm' ? Cloud : Sun;
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, border: `1px solid ${BRD}`, borderRadius: 3, marginBottom: 12 }}>
          {React.createElement(icon, { size: 18, color: ACCENT })}
          <span style={{ fontSize: 12, color: T, textTransform: 'capitalize' }}>{tool}</span>
        </div>
        <Slider label="Intensitet" value={props.weatherIntensity} setValue={props.setWeatherIntensity} unit="%" />
        <Slider label="Vindretning" value={props.windDir} setValue={props.setWindDir} min={0} max={359} unit="°" />
        <Slider label="Vindstyrke" value={30} setValue={() => {}} unit=" m/s" max={40} />
        <Select label="Anvendes på" value="region" onChange={() => {}} options={[
          { v: 'global', l: 'Hele verden' }, { v: 'region', l: 'Aktiv region' }, { v: 'zone', l: 'Valgt sone' },
        ]} />
      </>
    );
  }

  if (cat === 'audio') {
    return (
      <>
        <Slider label="Radius" value={props.audioRadius} setValue={props.setAudioRadius} min={1} max={200} unit="m" />
        <Slider label="Volum" value={props.audioVol} setValue={props.setAudioVol} unit="%" />
        <Slider label="Falloff" value={60} setValue={() => {}} unit="%" />
        <Select label="Asset" value="wind" onChange={() => {}} options={[
          { v: 'wind', l: 'Wind_ambient.ogg' }, { v: 'rain', l: 'Rain_loop.ogg' }, { v: 'market', l: 'Market_chatter.ogg' }, { v: 'forest', l: 'Forest_birds.ogg' },
        ]} />
        <Select label="Loop" value="seamless" onChange={() => {}} options={[
          { v: 'off', l: 'Av' }, { v: 'seamless', l: 'Sømløs' }, { v: 'cross', l: 'Crossfade' },
        ]} />
      </>
    );
  }

  if (cat === 'road') {
    return (
      <>
        <Slider label="Bredde" value={props.roadWidth} setValue={props.setRoadWidth} min={2} max={24} unit="m" />
        <Slider label="Felter" value={props.lanes} setValue={props.setLanes} min={1} max={6} />
        <Select label="Overflate" value="asphalt" onChange={() => {}} options={[
          { v: 'asphalt', l: 'Asfalt' }, { v: 'cobble', l: 'Brostein' }, { v: 'gravel', l: 'Grus' }, { v: 'dirt', l: 'Jord' },
        ]} />
        <Select label="Strek" value="dashed" onChange={() => {}} options={[
          { v: 'none', l: 'Ingen' }, { v: 'dashed', l: 'Stiplet' }, { v: 'solid', l: 'Hel' },
        ]} />
      </>
    );
  }

  if (cat === 'building') {
    return (
      <>
        <Slider label="Etasjer" value={props.buildHeight} setValue={props.setBuildHeight} min={1} max={40} />
        <Slider label="Rotasjon" value={props.buildRot} setValue={props.setBuildRot} min={0} max={359} unit="°" />
        <Select label="Footprint" value="rect" onChange={() => {}} options={[
          { v: 'rect', l: 'Rektangel' }, { v: 'L', l: 'L-form' }, { v: 'U', l: 'U-form' }, { v: 'free', l: 'Fri' },
        ]} />
        <Select label="Stil" value="modern" onChange={() => {}} options={[
          { v: 'modern', l: 'Moderne' }, { v: 'classic', l: 'Klassisk' }, { v: 'industrial', l: 'Industriell' }, { v: 'nordic', l: 'Nordisk' },
        ]} />
      </>
    );
  }

  if (cat === 'water') {
    return (
      <>
        <Slider label="Dybde" value={props.waterDepth} setValue={props.setWaterDepth} min={0} max={50} unit="m" />
        <Slider label="Strøm" value={props.waterFlow} setValue={props.setWaterFlow} unit="%" />
        <Slider label="Klarhet" value={70} setValue={() => {}} unit="%" />
        <Select label="Materiale" value="ocean" onChange={() => {}} options={[
          { v: 'ocean', l: 'Hav · saltvann' }, { v: 'fresh', l: 'Ferskvann' }, { v: 'murky', l: 'Grumsete' },
        ]} />
      </>
    );
  }

  if (cat === 'npc') {
    return (
      <>
        <Slider label="Antall" value={props.crowdCount} setValue={props.setCrowdCount} min={1} max={200} />
        <Slider label="Spredning" value={50} setValue={() => {}} unit="m" max={200} />
        <Select label="Arketype" value="civilian" onChange={() => {}} options={[
          { v: 'civilian', l: 'Sivil' }, { v: 'merchant', l: 'Handelsmann' }, { v: 'guard', l: 'Vakt' }, { v: 'tourist', l: 'Turist' }, { v: 'criminal', l: 'Kriminell' },
        ]} />
        <Select label="Oppførsel" value="wander" onChange={() => {}} options={[
          { v: 'idle', l: 'Stå stille' }, { v: 'wander', l: 'Vandre' }, { v: 'patrol', l: 'Patruljér' }, { v: 'commute', l: 'Pendle' },
        ]} />
      </>
    );
  }

  if (cat === 'traffic') {
    return (
      <>
        <Slider label="Kjøretøy/min" value={20} setValue={() => {}} max={120} />
        <Slider label="Rushtid-faktor" value={150} setValue={() => {}} min={100} max={400} unit="%" />
        <Select label="Kjøretøy-miks" value="balanced" onChange={() => {}} options={[
          { v: 'balanced', l: 'Balansert' }, { v: 'car', l: 'Bil-tung' }, { v: 'transit', l: 'Kollektiv-tung' }, { v: 'truck', l: 'Lastebil' },
        ]} />
        <Select label="Rute-modus" value="loop" onChange={() => {}} options={[
          { v: 'loop', l: 'Sløyfe' }, { v: 'a-b', l: 'A → B' }, { v: 'random', l: 'Tilfeldig' },
        ]} />
      </>
    );
  }

  if (cat === 'measure') {
    return (
      <>
        <Select label="Enhet" value={props.measureUnit} onChange={props.setMeasureUnit} options={[
          { v: 'm', l: 'Meter' }, { v: 'km', l: 'Kilometer' }, { v: 'ft', l: 'Fot' },
        ]} />
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: M, marginBottom: 4 }}>Siste målinger</div>
          <div style={{ border: `1px solid ${BRD}`, borderRadius: 3 }}>
            {[
              { k: 'Avstand', v: '128.4 m' },
              { k: 'Areal',   v: '4 820 m²' },
              { k: 'Høyde',   v: '32.0 m' },
            ].map((r, i) => (
              <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderTop: i === 0 ? 'none' : `1px solid ${BRD2}` }}>
                <span style={{ fontSize: 11, color: M }}>{r.k}</span>
                <span style={{ fontSize: 11, color: T, fontFamily: 'monospace' }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
        <button style={{ width: '100%', height: 26, background: 'none', border: `1px solid ${BRD}`, borderRadius: 3, color: T, fontSize: 12, cursor: 'pointer' }}>Tøm målinger</button>
      </>
    );
  }

  // generic (zone, props, terrain)
  return (
    <>
      <Slider label="Pensel" value={props.brushSize ?? 50} setValue={props.setBrushSize ?? (() => {})} min={1} max={200} unit="m" />
      <Slider label="Styrke" value={props.strength ?? 50} setValue={props.setStrength ?? (() => {})} unit="%" />
      <Slider label="Opacity" value={props.opacity ?? 80} setValue={props.setOpacity ?? (() => {})} unit="%" />
      <Select label="Form" value="circle" onChange={() => {}} options={[
        { v: 'circle', l: 'Sirkel' }, { v: 'square', l: 'Firkant' }, { v: 'hex', l: 'Heksagon' }, { v: 'free', l: 'Fri' },
      ]} />
      <Select label="Falloff" value="smooth" onChange={() => {}} options={[
        { v: 'hard', l: 'Hard' }, { v: 'smooth', l: 'Myk' }, { v: 'linear', l: 'Lineær' },
      ]} />
    </>
  );
}
