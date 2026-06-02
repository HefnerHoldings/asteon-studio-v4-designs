import React from 'react';
import {
  Sword, Shield, Zap, Flame, Home, TreePine, Globe2, Users, Map,
  Cpu, Database, Wand2, Network, FlaskConical, Bot, GitBranch,
  CheckCircle2, AlertTriangle, Plus, RefreshCw, ChevronRight,
  Sparkles, Wrench, Layers, Bell, Car, Crosshair,
  Briefcase, Heart, Eye, EyeOff, UserCircle2, Coins, TrendingUp, TrendingDown,
  Music, BookOpen, Coffee, Dumbbell, Palette, Skull,
} from 'lucide-react';

export type Tokens = {
  B: string; BRD: string; BRD2: string; T: string; M: string; DIM: string;
  ICE: string; ACCENT: string; ACCENT_DIM: string; WARM: string; GOOD: string; BAD: string;
};

type ViewProps = { tk: Tokens; tick: number };

// ════════════════════════════════════════════════════════════
// CONTENT — utstyr, våpen, kjøretøy, oppgraderinger
// ════════════════════════════════════════════════════════════
const contentCats = ['Alle', 'Våpen', 'Kjøretøy', 'Utstyr', 'Forbruk'] as const;
type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
const contentItems: { n: string; cat: typeof contentCats[number]; icon: any; rarity: Rarity; lv: number; max: number }[] = [
  { n: 'Plasma Bow',     cat: 'Våpen',     icon: Sword,     rarity: 'Epic',      lv: 3, max: 5 },
  { n: 'Ion Rifle',      cat: 'Våpen',     icon: Crosshair, rarity: 'Rare',      lv: 2, max: 5 },
  { n: 'Frost Blade',    cat: 'Våpen',     icon: Sword,     rarity: 'Legendary', lv: 4, max: 5 },
  { n: 'Pulse Pistol',   cat: 'Våpen',     icon: Zap,       rarity: 'Common',    lv: 1, max: 3 },
  { n: 'Scout Bike',     cat: 'Kjøretøy',  icon: Car,       rarity: 'Rare',      lv: 2, max: 4 },
  { n: 'Hover Tank',     cat: 'Kjøretøy',  icon: Shield,    rarity: 'Epic',      lv: 3, max: 5 },
  { n: 'Cargo Lifter',   cat: 'Kjøretøy',  icon: Car,       rarity: 'Common',    lv: 1, max: 3 },
  { n: 'Cloak Helm',     cat: 'Utstyr',    icon: Shield,    rarity: 'Rare',      lv: 2, max: 4 },
  { n: 'Reactor Vest',   cat: 'Utstyr',    icon: Wrench,    rarity: 'Epic',      lv: 3, max: 5 },
  { n: 'Grav Boots',     cat: 'Utstyr',    icon: Wrench,    rarity: 'Legendary', lv: 5, max: 5 },
  { n: 'Medi-stim',      cat: 'Forbruk',   icon: Sparkles,  rarity: 'Common',    lv: 1, max: 1 },
  { n: 'EMP Charge',     cat: 'Forbruk',   icon: Flame,     rarity: 'Rare',      lv: 1, max: 1 },
];

export function ContentView({ tk, tick }: ViewProps) {
  const [cat, setCat] = React.useState<typeof contentCats[number]>('Alle');
  const [sel, setSel] = React.useState(0);
  const rarityColor = (r: Rarity) =>
    r === 'Legendary' ? tk.WARM : r === 'Epic' ? '#c08bff' : r === 'Rare' ? tk.ACCENT : tk.M;
  const visible = contentItems.filter(i => cat === 'Alle' || i.cat === cat);
  const selected = visible[Math.min(sel, visible.length - 1)] ?? contentItems[0];

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: tk.B, minWidth: 0 }}>
      {/* sub-toolbar */}
      <div style={{ height: 40, borderBottom: `1px solid ${tk.BRD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {contentCats.map(c => {
            const active = cat === c;
            const n = c === 'Alle' ? contentItems.length : contentItems.filter(i => i.cat === c).length;
            return (
              <button key={c} onClick={() => { setCat(c); setSel(0); }}
                style={{ padding: '0 14px', height: 40, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: active ? 500 : 400, color: active ? tk.T : tk.M, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                {c}
                <span style={{ fontSize: 11, color: active ? tk.ACCENT : tk.DIM, fontFamily: 'monospace' }}>{n}</span>
                {active && <span style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 1, background: tk.ACCENT, boxShadow: `0 0 5px ${tk.ACCENT}` }} />}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: tk.M, fontFamily: 'monospace' }}>balanse: <span style={{ color: tk.GOOD }}>OK</span></span>
          <button style={{ padding: '4px 11px', background: tk.ACCENT_DIM, border: `1px solid ${tk.ACCENT}`, borderRadius: 3, color: tk.ACCENT, fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>+ Nytt item</button>
        </div>
      </div>

      {/* hairline stats */}
      <div style={{ height: 24, borderBottom: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 18, flexShrink: 0, fontFamily: 'monospace', fontSize: 12, color: tk.T }}>
        <span>{contentItems.length}<span style={{ color: tk.DIM, marginLeft: 5 }}>items</span></span>
        <span>{contentItems.filter(i => i.rarity === 'Legendary').length}<span style={{ color: tk.DIM, marginLeft: 5 }}>legendary</span></span>
        <span>{contentItems.filter(i => i.lv < i.max).length}<span style={{ color: tk.DIM, marginLeft: 5 }}>oppgraderbare</span></span>
        <span style={{ color: tk.M }}>tier-spread: 4/4</span>
        <span style={{ marginLeft: 'auto', color: tk.DIM, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: tk.GOOD, boxShadow: `0 0 6px ${tk.GOOD}`, animation: 'sp3-blink 1.6s ease-in-out infinite' }} />
          drop-rate kalibrert
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* item grid */}
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
            {visible.map((it, i) => {
              const active = visible[sel]?.n === it.n;
              const RC = rarityColor(it.rarity);
              return (
                <button key={it.n} onClick={() => setSel(i)}
                  style={{ position: 'relative', textAlign: 'left', background: active ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)', border: `1px solid ${active ? RC : tk.BRD}`, borderRadius: 4, padding: 10, cursor: 'pointer', transition: 'border-color 0.15s' }}>
                  <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 3, marginBottom: 8, position: 'relative' }}>
                    <it.icon size={26} color={RC} strokeWidth={1.2} />
                    <span style={{ position: 'absolute', top: 4, right: 5, fontSize: 9.5, fontFamily: 'monospace', color: RC, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{it.rarity[0]}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: tk.T, fontWeight: 500, marginBottom: 2 }}>{it.n}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: tk.M, fontFamily: 'monospace' }}>
                    <span>Lv {it.lv}/{it.max}</span>
                    <span style={{ color: RC }}>{it.rarity}</span>
                  </div>
                  <div style={{ marginTop: 5, height: 2, background: tk.BRD, borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{ width: `${(it.lv / it.max) * 100}%`, height: '100%', background: RC, boxShadow: `0 0 4px ${RC}` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* detail / upgrade panel */}
        <div style={{ width: 280, flexShrink: 0, borderLeft: `1px solid ${tk.BRD}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Valgt</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, border: `1px solid ${rarityColor(selected.rarity)}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <selected.icon size={22} color={rarityColor(selected.rarity)} strokeWidth={1.2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: tk.T, fontWeight: 500 }}>{selected.n}</div>
                <div style={{ fontSize: 12, color: rarityColor(selected.rarity), fontFamily: 'monospace' }}>{selected.rarity} · {selected.cat}</div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Statistikk</div>
            {[['skade', `${40 + selected.lv * 12}`], ['rekkevidde', `${20 + selected.lv * 4}m`], ['kost', `${100 * Math.pow(2, selected.lv)}cr`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${tk.BRD2}`, fontSize: 12, fontFamily: 'monospace' }}>
                <span style={{ color: tk.M }}>{k}</span>
                <span style={{ color: tk.T }}>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Oppgraderingstre</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Array.from({ length: selected.max }).map((_, i) => {
                const done = i < selected.lv;
                const current = i === selected.lv;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 2, background: current ? 'rgba(124,212,255,0.05)' : 'none', border: `1px solid ${current ? tk.ACCENT_DIM : tk.BRD2}` }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${done ? rarityColor(selected.rarity) : current ? tk.ACCENT : tk.BRD}`, color: done ? rarityColor(selected.rarity) : current ? tk.ACCENT : tk.DIM, fontSize: 11, fontFamily: 'monospace', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: 12, color: done ? tk.T : current ? tk.T : tk.M, flex: 1 }}>
                      {i === 0 ? 'Grunnform' : i === 1 ? '+ Skade' : i === 2 ? '+ Rekkevidde' : i === 3 ? '+ Spesial' : 'Mestret'}
                    </span>
                    {current && <button style={{ fontSize: 11, padding: '2px 6px', background: tk.ICE, color: tk.B, border: 'none', borderRadius: 2, cursor: 'pointer', fontWeight: 500 }}>Lås opp</button>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ════════════════════════════════════════════════════════════
// SYSTEMS — motorer, funksjonalitet, avhengigheter
// ════════════════════════════════════════════════════════════
const systems: { n: string; icon: any; v: string; status: 'on' | 'load' | 'warn' | 'off'; load: number; deps: string[]; col?: number; row?: number }[] = [
  { n: 'Kamp',        icon: Sword,        v: '2.1.0', status: 'on',   load: 38, deps: ['Fysikk', 'AI'],         col: 0, row: 0 },
  { n: 'Økonomi',     icon: Database,     v: '1.4.2', status: 'on',   load: 22, deps: ['Inventar'],             col: 1, row: 0 },
  { n: 'AI',          icon: Bot,          v: '3.0.1', status: 'load', load: 71, deps: ['Dialog'],               col: 2, row: 0 },
  { n: 'Fysikk',      icon: Cpu,          v: '4.2.0', status: 'on',   load: 54, deps: [],                       col: 0, row: 1 },
  { n: 'Inventar',    icon: Layers,       v: '1.0.8', status: 'on',   load: 12, deps: [],                       col: 1, row: 1 },
  { n: 'Dialog',      icon: Wand2,        v: '0.9.3', status: 'warn', load: 18, deps: [],                       col: 2, row: 1 },
  { n: 'Quest',       icon: GitBranch,    v: '2.0.0', status: 'on',   load: 30, deps: ['Dialog', 'Økonomi'],    col: 0, row: 2 },
  { n: 'Vær/Sky',     icon: Network,      v: '1.1.0', status: 'off',  load: 0,  deps: [],                       col: 1, row: 2 },
  { n: 'Lyd',         icon: Bell,         v: '1.6.4', status: 'on',   load: 16, deps: [],                       col: 2, row: 2 },
];

export function SystemsView({ tk, tick }: ViewProps) {
  const [sel, setSel] = React.useState<string | null>('AI');
  const statusColor = (s: string) => s === 'on' ? tk.GOOD : s === 'load' ? tk.ACCENT : s === 'warn' ? tk.WARM : tk.M;
  const selSys = systems.find(s => s.n === sel) ?? systems[0];
  const totalLoad = Math.round(systems.reduce((a, s) => a + s.load, 0) / systems.length);

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: tk.B, minWidth: 0 }}>
      <div style={{ height: 40, borderBottom: `1px solid ${tk.BRD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {['Aktive', 'Bibliotek', 'Avhengigheter', 'Logger'].map((t, i) => (
            <button key={t} style={{ padding: '0 14px', height: 40, fontSize: 13, fontWeight: i === 0 ? 500 : 400, color: i === 0 ? tk.T : tk.M, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
              {t}
              {i === 0 && <span style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 1, background: tk.ACCENT, boxShadow: `0 0 5px ${tk.ACCENT}` }} />}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: tk.M, fontFamily: 'monospace' }}>cpu <span style={{ color: tk.T }}>{totalLoad + (tick % 4)}%</span></span>
          <button style={{ padding: '4px 11px', background: tk.ACCENT_DIM, border: `1px solid ${tk.ACCENT}`, borderRadius: 3, color: tk.ACCENT, fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>+ Modul</button>
        </div>
      </div>

      <div style={{ height: 24, borderBottom: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 18, flexShrink: 0, fontFamily: 'monospace', fontSize: 12, color: tk.T }}>
        <span>{systems.filter(s => s.status === 'on').length}<span style={{ color: tk.DIM, marginLeft: 5 }}>aktive</span></span>
        <span>{systems.filter(s => s.status === 'load').length}<span style={{ color: tk.DIM, marginLeft: 5 }}>laster</span></span>
        <span style={{ color: tk.WARM }}>{systems.filter(s => s.status === 'warn').length}<span style={{ color: tk.DIM, marginLeft: 5 }}>varsel</span></span>
        <span style={{ color: tk.M }}>{systems.filter(s => s.status === 'off').length}<span style={{ color: tk.DIM, marginLeft: 5 }}>av</span></span>
        <span style={{ marginLeft: 'auto', color: tk.DIM }}>tick {tick}</span>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'auto', padding: 24 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
          {/* dependency lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {systems.flatMap(s => s.deps.map(d => {
              const target = systems.find(x => x.n === d);
              if (!target || s.col === undefined || target.col === undefined) return null;
              const x1 = 24 + s.col * 196 + 88;
              const y1 = 24 + (s.row ?? 0) * 120 + 40;
              const x2 = 24 + target.col * 196 + 88;
              const y2 = 24 + (target.row ?? 0) * 120 + 40;
              return <line key={`${s.n}-${d}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={tk.ACCENT} strokeOpacity={0.25} strokeWidth={1} strokeDasharray="3 5" style={{ animation: 'sp3-dash 2.2s linear infinite' }} />;
            }))}
          </svg>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 176px)', gap: 20 }}>
            {systems.map(s => {
              const active = sel === s.n;
              return (
                <button key={s.n} onClick={() => setSel(s.n)}
                  style={{ position: 'relative', textAlign: 'left', padding: 12, background: active ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.6)', border: `1px solid ${active ? statusColor(s.status) : tk.BRD}`, borderRadius: 4, cursor: 'pointer', minHeight: 100 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 3, border: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <s.icon size={13} color={statusColor(s.status)} strokeWidth={1.4} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: tk.T, fontWeight: 500 }}>{s.n}</div>
                      <div style={{ fontSize: 11, color: tk.DIM, fontFamily: 'monospace' }}>v{s.v}</div>
                    </div>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(s.status), boxShadow: s.status !== 'off' ? `0 0 6px ${statusColor(s.status)}` : 'none', animation: s.status === 'load' ? 'sp3-blink 1.2s ease-in-out infinite' : 'none' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'monospace', color: tk.M, marginTop: 8 }}>
                    <div style={{ flex: 1, height: 2, background: tk.BRD, overflow: 'hidden', borderRadius: 1 }}>
                      <div style={{ width: `${s.load}%`, height: '100%', background: statusColor(s.status), boxShadow: `0 0 4px ${statusColor(s.status)}` }} />
                    </div>
                    <span>{s.load}%</span>
                  </div>
                  {s.deps.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 11, color: tk.DIM, fontFamily: 'monospace' }}>↓ {s.deps.join(', ')}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ width: 260, flexShrink: 0, borderLeft: `1px solid ${tk.BRD}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Inspektør</div>
            <div style={{ fontSize: 13, color: tk.T, fontWeight: 500 }}>{selSys.n}</div>
            <div style={{ fontSize: 12, color: statusColor(selSys.status), fontFamily: 'monospace' }}>{selSys.status === 'on' ? 'aktiv' : selSys.status === 'load' ? `laster ${selSys.load}%` : selSys.status === 'warn' ? 'varsel' : 'av'} · v{selSys.v}</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Avhengigheter</div>
            {selSys.deps.length === 0 ? (
              <div style={{ fontSize: 12, color: tk.DIM }}>Ingen</div>
            ) : selSys.deps.map(d => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', fontSize: 12, color: tk.T }}>
                <ChevronRight size={10} color={tk.M} />{d}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Hendelser/s</div>
            <div style={{ fontSize: 18, color: tk.T, fontFamily: 'monospace' }}>{(120 + (tick * 7) % 80)}<span style={{ fontSize: 12, color: tk.DIM, marginLeft: 6 }}>ev/s</span></div>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
            <button style={{ flex: 1, padding: '5px 0', fontSize: 12, background: tk.ICE, color: tk.B, fontWeight: 500, border: 'none', borderRadius: 3, cursor: 'pointer' }}>Restart</button>
            <button style={{ flex: 1, padding: '5px 0', fontSize: 12, background: 'none', color: tk.M, border: `1px solid ${tk.BRD}`, borderRadius: 3, cursor: 'pointer' }}>Konfig</button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ════════════════════════════════════════════════════════════
// REGION — flere regioner, politikk, demografi
// ════════════════════════════════════════════════════════════
type Region = { id: string; name: string; x: number; y: number; r: number; color: string; faction: string; pop: string; gdp: string; unrest: number; };
const regions: Region[] = [
  { id: 'r1', name: 'Region_01', x: 32, y: 38, r: 64, color: '#7cd4ff', faction: 'Føderasjon',   pop: '1.2M', gdp: '$48b',  unrest: 12 },
  { id: 'r2', name: 'Region_02', x: 62, y: 26, r: 50, color: '#f5a96b', faction: 'Konsortiet',   pop: '780k', gdp: '$31b',  unrest: 38 },
  { id: 'r3', name: 'Region_03', x: 70, y: 62, r: 56, color: '#88d999', faction: 'Frie soner',   pop: '420k', gdp: '$12b',  unrest: 4  },
  { id: 'r4', name: 'Region_04', x: 24, y: 70, r: 44, color: '#c08bff', faction: 'Rebeller',     pop: '210k', gdp: '$4b',   unrest: 71 },
  { id: 'r5', name: 'Region_05', x: 48, y: 50, r: 36, color: '#ededed', faction: 'Nøytral sone', pop: '90k',  gdp: '$2b',   unrest: 0  },
];

export function RegionView({ tk, tick }: ViewProps) {
  const [sel, setSel] = React.useState<string>('r1');
  const r = regions.find(x => x.id === sel) ?? regions[0];

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: tk.B, minWidth: 0 }}>
      <div style={{ height: 40, borderBottom: `1px solid ${tk.BRD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {['Kart', 'Politikk', 'Demografi', 'Handel'].map((t, i) => (
            <button key={t} style={{ padding: '0 14px', height: 40, fontSize: 13, fontWeight: i === 0 ? 500 : 400, color: i === 0 ? tk.T : tk.M, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
              {t}
              {i === 0 && <span style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 1, background: tk.ACCENT, boxShadow: `0 0 5px ${tk.ACCENT}` }} />}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: tk.M, fontFamily: 'monospace' }}>{regions.length} regioner · år 2147</span>
          <button style={{ padding: '4px 11px', background: tk.ACCENT_DIM, border: `1px solid ${tk.ACCENT}`, borderRadius: 3, color: tk.ACCENT, fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>+ Region</button>
        </div>
      </div>

      <div style={{ height: 24, borderBottom: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 18, flexShrink: 0, fontFamily: 'monospace', fontSize: 12, color: tk.T }}>
        <span>2.7M<span style={{ color: tk.DIM, marginLeft: 5 }}>befolkning</span></span>
        <span>$97b<span style={{ color: tk.DIM, marginLeft: 5 }}>bnp</span></span>
        <span style={{ color: tk.WARM }}>{27 + (tick % 4)}<span style={{ color: tk.DIM, marginLeft: 5 }}>uro-snitt</span></span>
        <span style={{ color: tk.M }}>4 fraksjoner</span>
        <span style={{ marginLeft: 'auto', color: tk.DIM, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: tk.ACCENT, boxShadow: `0 0 6px ${tk.ACCENT}`, animation: 'sp3-blink 1.6s ease-in-out infinite' }} />
          simulering kjører
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {/* trade routes */}
            {[['r1', 'r2'], ['r1', 'r5'], ['r2', 'r3'], ['r3', 'r5'], ['r4', 'r1'], ['r4', 'r5']].map(([a, b], i) => {
              const A = regions.find(r => r.id === a)!; const B = regions.find(r => r.id === b)!;
              return <line key={i} x1={`${A.x}%`} y1={`${A.y}%`} x2={`${B.x}%`} y2={`${B.y}%`} stroke={tk.ACCENT} strokeOpacity={0.25} strokeWidth={1} strokeDasharray="4 6" style={{ animation: `sp3-dash ${2 + i * 0.3}s linear infinite` }} />;
            })}
          </svg>
          {regions.map(reg => {
            const active = sel === reg.id;
            return (
              <button key={reg.id} onClick={() => setSel(reg.id)}
                style={{ position: 'absolute', left: `${reg.x}%`, top: `${reg.y}%`, transform: 'translate(-50%,-50%)', width: reg.r * 2, height: reg.r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${reg.color}1f 0%, ${reg.color}05 60%, transparent 100%)`, border: `1px ${active ? 'solid' : 'dashed'} ${reg.color}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: active ? `0 0 28px ${reg.color}44` : 'none', transition: 'box-shadow 0.2s', padding: 0 }}>
                <div>
                  <div style={{ fontSize: 12, color: reg.color, fontFamily: 'monospace', fontWeight: 500 }}>{reg.name}</div>
                  <div style={{ fontSize: 10.5, color: tk.M, marginTop: 1, fontFamily: 'monospace' }}>{reg.pop}</div>
                  <div style={{ fontSize: 10, color: tk.DIM, marginTop: 1 }}>{reg.faction}</div>
                </div>
              </button>
            );
          })}
          {/* compass */}
          <div style={{ position: 'absolute', right: 14, top: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button style={{ width: 26, height: 26, borderRadius: 3, background: 'none', border: `1px solid ${tk.BRD}`, color: tk.M, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
            <button style={{ width: 26, height: 26, borderRadius: 3, background: 'none', border: `1px solid ${tk.BRD}`, color: tk.M, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RefreshCw size={11} /></button>
            <button style={{ width: 26, height: 26, borderRadius: 3, background: 'none', border: `1px solid ${tk.BRD}`, color: tk.M, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'monospace' }}>N</button>
          </div>
        </div>

        <div style={{ width: 260, flexShrink: 0, borderLeft: `1px solid ${tk.BRD}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Valgt region</div>
            <div style={{ fontSize: 13, color: tk.T, fontWeight: 500 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: r.color, fontFamily: 'monospace' }}>{r.faction}</div>
          </div>
          {[['befolkning', r.pop], ['bnp', r.gdp], ['uro', `${r.unrest}%`], ['fraksjon', r.faction], ['stabilitet', r.unrest < 20 ? 'høy' : r.unrest < 50 ? 'middels' : 'lav']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${tk.BRD2}`, fontSize: 12.5, fontFamily: 'monospace' }}>
              <span style={{ color: tk.M }}>{k}</span>
              <span style={{ color: k === 'uro' && r.unrest > 50 ? tk.BAD : k === 'uro' && r.unrest > 20 ? tk.WARM : tk.T }}>{v}</span>
            </div>
          ))}
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Politiske krefter</div>
            {[['Føderasjon', 0.55], ['Konsortiet', 0.25], ['Rebeller', 0.12], ['Nøytral', 0.08]].map(([n, v]) => (
              <div key={n as string} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontFamily: 'monospace', color: tk.M, marginBottom: 2 }}>
                  <span>{n}</span><span style={{ color: tk.T }}>{Math.round((v as number) * 100)}%</span>
                </div>
                <div style={{ height: 3, background: tk.BRD, borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ width: `${(v as number) * 100}%`, height: '100%', background: tk.ACCENT, boxShadow: `0 0 4px ${tk.ACCENT}` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// ════════════════════════════════════════════════════════════
// DIRECTOR — spill-loop som workflow / idéflyt
// ════════════════════════════════════════════════════════════
type Node = { id: string; n: string; type: string; status: 'ferdig' | 'utvikles' | 'skissert' | 'forslag'; x: number; y: number; };
const directorNodes: Node[] = [
  { id: 'n1', n: 'Intro',         type: 'cinematic', status: 'ferdig',   x: 8,  y: 50 },
  { id: 'n2', n: 'Tutorial',      type: 'gameplay',  status: 'ferdig',   x: 22, y: 50 },
  { id: 'n3', n: 'Akt 1: Α',      type: 'mission',   status: 'utvikles', x: 38, y: 30 },
  { id: 'n4', n: 'Side: Krets-A', type: 'side',      status: 'skissert', x: 38, y: 70 },
  { id: 'n5', n: 'Akt 2: Β',      type: 'mission',   status: 'skissert', x: 56, y: 30 },
  { id: 'n6', n: 'Boss: Skjær',   type: 'boss',      status: 'skissert', x: 74, y: 30 },
  { id: 'n7', n: 'Side: Karavan', type: 'side',      status: 'forslag',  x: 56, y: 70 },
  { id: 'n8', n: 'Ending',        type: 'cinematic', status: 'forslag',  x: 90, y: 50 },
];
const directorEdges: [string, string][] = [
  ['n1', 'n2'], ['n2', 'n3'], ['n2', 'n4'], ['n3', 'n5'], ['n4', 'n5'], ['n5', 'n6'], ['n5', 'n7'], ['n6', 'n8'], ['n7', 'n8'],
];

export function DirectorView({ tk, tick }: ViewProps) {
  const [sel, setSel] = React.useState<string>('n3');
  const statusColor = (s: Node['status']) =>
    s === 'ferdig' ? tk.GOOD : s === 'utvikles' ? tk.ACCENT : s === 'skissert' ? tk.M : tk.WARM;
  const typeIcon = (t: string) =>
    t === 'cinematic' ? Sparkles : t === 'boss' ? Flame : t === 'side' ? GitBranch : t === 'gameplay' ? FlaskConical : Globe2;
  const node = directorNodes.find(n => n.id === sel) ?? directorNodes[0];

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: tk.B, minWidth: 0 }}>
      <div style={{ height: 40, borderBottom: `1px solid ${tk.BRD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {['Hovedlinje', 'Sidequests', 'AI-forslag', 'Tidslinje'].map((t, i) => (
            <button key={t} style={{ padding: '0 14px', height: 40, fontSize: 13, fontWeight: i === 0 ? 500 : 400, color: i === 0 ? tk.T : tk.M, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
              {t}
              {i === 0 && <span style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 1, background: tk.ACCENT, boxShadow: `0 0 5px ${tk.ACCENT}` }} />}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: tk.M, fontFamily: 'monospace' }}>versjon <span style={{ color: tk.ACCENT }}>0.4</span></span>
          <button style={{ padding: '4px 11px', background: tk.ACCENT_DIM, border: `1px solid ${tk.ACCENT}`, borderRadius: 3, color: tk.ACCENT, fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>▶ Auto-utvid</button>
        </div>
      </div>

      <div style={{ height: 24, borderBottom: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 18, flexShrink: 0, fontFamily: 'monospace', fontSize: 12, color: tk.T }}>
        <span>{directorNodes.filter(n => n.status === 'ferdig').length}<span style={{ color: tk.DIM, marginLeft: 5 }}>ferdig</span></span>
        <span style={{ color: tk.ACCENT }}>{directorNodes.filter(n => n.status === 'utvikles').length}<span style={{ color: tk.DIM, marginLeft: 5 }}>utvikles</span></span>
        <span style={{ color: tk.M }}>{directorNodes.filter(n => n.status === 'skissert').length}<span style={{ color: tk.DIM, marginLeft: 5 }}>skissert</span></span>
        <span style={{ color: tk.WARM }}>{directorNodes.filter(n => n.status === 'forslag').length}<span style={{ color: tk.DIM, marginLeft: 5 }}>forslag</span></span>
        <span style={{ color: tk.M }}>spilletid ~6t</span>
        <span style={{ marginLeft: 'auto', color: tk.DIM, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: tk.ACCENT, boxShadow: `0 0 6px ${tk.ACCENT}`, animation: 'sp3-blink 1.6s ease-in-out infinite' }} />
          Director AI tenker
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {directorEdges.map(([a, b], i) => {
              const A = directorNodes.find(n => n.id === a)!; const B = directorNodes.find(n => n.id === b)!;
              const isForslag = A.status === 'forslag' || B.status === 'forslag';
              return <line key={i} x1={`${A.x}%`} y1={`${A.y}%`} x2={`${B.x}%`} y2={`${B.y}%`} stroke={isForslag ? tk.WARM : tk.ACCENT} strokeOpacity={isForslag ? 0.35 : 0.45} strokeWidth={1} strokeDasharray={isForslag ? '3 5' : undefined} style={{ animation: isForslag ? `sp3-dash ${1.8 + i * 0.2}s linear infinite` : undefined }} />;
            })}
          </svg>
          {directorNodes.map(n => {
            const active = sel === n.id;
            const Icon = typeIcon(n.type);
            const isProposed = n.status === 'forslag';
            return (
              <button key={n.id} onClick={() => setSel(n.id)}
                style={{ position: 'absolute', left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: n.type === 'boss' ? 4 : n.type === 'side' ? 8 : '50%', background: tk.B, border: `1px ${isProposed ? 'dashed' : 'solid'} ${statusColor(n.status)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: active ? `0 0 20px ${statusColor(n.status)}66` : n.status === 'utvikles' ? `0 0 12px ${statusColor(n.status)}44` : 'none', animation: n.status === 'utvikles' ? 'sp3-breathe 3.6s ease-in-out infinite' : isProposed ? 'sp3-blink 2.4s ease-in-out infinite' : 'none' }}>
                  <Icon size={16} color={statusColor(n.status)} strokeWidth={1.4} />
                </div>
                <div style={{ fontSize: 11.5, color: active ? tk.T : tk.M, fontFamily: 'monospace', fontWeight: active ? 500 : 400, whiteSpace: 'nowrap' }}>{n.n}</div>
                <div style={{ fontSize: 10, color: statusColor(n.status), fontFamily: 'monospace', opacity: 0.8 }}>{n.status}</div>
              </button>
            );
          })}
        </div>

        <div style={{ width: 280, flexShrink: 0, borderLeft: `1px solid ${tk.BRD}`, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16, borderBottom: `1px solid ${tk.BRD}` }}>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Node</div>
            <div style={{ fontSize: 13, color: tk.T, fontWeight: 500 }}>{node.n}</div>
            <div style={{ fontSize: 12, color: statusColor(node.status), fontFamily: 'monospace' }}>{node.type} · {node.status}</div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Director AI</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 20, height: 20, flexShrink: 0, borderRadius: 3, border: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={11} color={tk.M} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1, fontSize: 12.5, color: tk.M, lineHeight: 1.55 }}>
                Etter «{node.n}» foreslår jeg en moralsk valg-greinet rute: spilleren må velge mellom karavanen og rebellbasen. Skal jeg legge til nodene?
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginLeft: 28 }}>
              <button style={{ fontSize: 11.5, padding: '3px 9px', background: tk.ICE, color: tk.B, fontWeight: 500, border: 'none', borderRadius: 2, cursor: 'pointer' }}>+ Legg til</button>
              <button style={{ fontSize: 11.5, padding: '3px 9px', background: 'none', color: tk.M, border: `1px solid ${tk.BRD}`, borderRadius: 2, cursor: 'pointer' }}>Skisse</button>
              <button style={{ fontSize: 11.5, padding: '3px 9px', background: 'none', color: tk.M, border: 'none', cursor: 'pointer' }}>Avvis</button>
            </div>
            <div style={{ marginTop: 8, fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Endringer</div>
            {[
              { t: 'lagt til', n: 'Side: Karavan', c: tk.WARM },
              { t: 'oppdatert', n: 'Akt 1: Α',     c: tk.ACCENT },
              { t: 'ferdig',   n: 'Tutorial',      c: tk.GOOD },
            ].map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 12, fontFamily: 'monospace', padding: '3px 0', borderBottom: `1px solid ${tk.BRD2}` }}>
                <span style={{ color: e.c }}>{e.t}</span>
                <span style={{ color: tk.T }}>{e.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// ════════════════════════════════════════════════════════════
// LIV — NPC livs-simulering + økonomi
// ════════════════════════════════════════════════════════════
type SecretKind = 'kriminell' | 'undercover' | 'dobbeltagent' | 'spion';
type Npc = {
  n: string; age: number; district: string; job: string; income: number; expense: number;
  traits: { k: string; v: number }[];
  hobbies: { n: string; icon: any }[];
  rels: { n: string; t: 'venn' | 'familie' | 'elsker' | 'rival' | 'kollega'; bond: number }[];
  schedule: { h: number; act: string; col: 'work' | 'social' | 'secret' | 'rest' }[];
  secret?: { kind: SecretKind; cover: string; risk: number; clues: string[] };
};

const lifeNpcs: Npc[] = [
  {
    n: 'Marit Solheim', age: 34, district: 'Α · Sentrum', job: 'Krodriver, Stjerneglass',
    income: 4800, expense: 3120,
    traits: [{ k: 'sosial', v: 78 }, { k: 'risiko', v: 42 }, { k: 'lojalitet', v: 88 }, { k: 'temperament', v: 31 }, { k: 'grådighet', v: 22 }],
    hobbies: [{ n: 'Vinyl', icon: Music }, { n: 'Hagebruk', icon: TreePine }, { n: 'Roman', icon: BookOpen }],
    rels: [
      { n: 'Jonas Berg',   t: 'elsker',   bond: 86 },
      { n: 'Live Solheim', t: 'familie',  bond: 92 },
      { n: 'Anders Vik',   t: 'kollega',  bond: 58 },
      { n: 'Kari Holm',    t: 'venn',     bond: 71 },
    ],
    schedule: [
      { h: 6, act: 'Hjemme',  col: 'rest' },
      { h: 9, act: 'Kroa',    col: 'work' },
      { h: 17, act: 'Marked', col: 'social' },
      { h: 20, act: 'Jonas',  col: 'social' },
      { h: 23, act: 'Hjemme', col: 'rest' },
    ],
  },
  {
    n: 'Anders Vik', age: 41, district: 'Α · Havn', job: 'Havnesjef',
    income: 9200, expense: 4400,
    traits: [{ k: 'sosial', v: 52 }, { k: 'risiko', v: 81 }, { k: 'lojalitet', v: 24 }, { k: 'temperament', v: 64 }, { k: 'grådighet', v: 88 }],
    hobbies: [{ n: 'Boksing', icon: Dumbbell }, { n: 'Whisky', icon: Coffee }],
    rels: [
      { n: 'Marit Solheim', t: 'kollega', bond: 58 },
      { n: 'Sven Røed',     t: 'rival',   bond: 18 },
      { n: 'Nora Vik',      t: 'familie', bond: 72 },
      { n: '??? (kontakt)', t: 'venn',    bond: 44 },
    ],
    schedule: [
      { h: 5, act: 'Havn',         col: 'work' },
      { h: 14, act: 'Kontor',      col: 'work' },
      { h: 19, act: 'Bakgate',     col: 'secret' },
      { h: 22, act: 'Hjemme',      col: 'rest' },
    ],
    secret: {
      kind: 'kriminell', cover: 'Smugler ζ-krystaller via container 11',
      risk: 64,
      clues: ['Containerlogg ↯ avvik kl 19:42', 'Bank-innskudd uten kilde +12k', 'Kontakt med "Sven R." 3× / uke'],
    },
  },
  {
    n: 'Live Solheim', age: 12, district: 'Α · Sentrum', job: 'Skole, 7. trinn',
    income: 0, expense: 240,
    traits: [{ k: 'sosial', v: 64 }, { k: 'risiko', v: 28 }, { k: 'lojalitet', v: 76 }, { k: 'temperament', v: 48 }, { k: 'grådighet', v: 12 }],
    hobbies: [{ n: 'Tegning', icon: Palette }, { n: 'Lese', icon: BookOpen }],
    rels: [
      { n: 'Marit Solheim', t: 'familie', bond: 92 },
      { n: 'Tuva Holm',     t: 'venn',    bond: 84 },
    ],
    schedule: [
      { h: 7, act: 'Hjem',    col: 'rest' },
      { h: 8, act: 'Skole',   col: 'work' },
      { h: 14, act: 'Park',   col: 'social' },
      { h: 17, act: 'Hjem',   col: 'rest' },
    ],
  },
  {
    n: 'Jonas Berg', age: 36, district: 'Β · Forstad', job: 'Bibliotekar (cover)',
    income: 3200, expense: 2100,
    traits: [{ k: 'sosial', v: 58 }, { k: 'risiko', v: 72 }, { k: 'lojalitet', v: 91 }, { k: 'temperament', v: 22 }, { k: 'grådighet', v: 8 }],
    hobbies: [{ n: 'Sjakk', icon: BookOpen }, { n: 'Løping', icon: Dumbbell }, { n: 'Jazz', icon: Music }],
    rels: [
      { n: 'Marit Solheim', t: 'elsker',  bond: 86 },
      { n: 'Kontakt-7',     t: 'kollega', bond: 100 },
      { n: 'Anders Vik',    t: 'rival',   bond: 6 },
    ],
    schedule: [
      { h: 8, act: 'Bibliotek',   col: 'work' },
      { h: 17, act: 'Marit',      col: 'social' },
      { h: 22, act: 'Møte K-7',   col: 'secret' },
      { h: 1, act: 'Hjem',        col: 'rest' },
    ],
    secret: {
      kind: 'undercover', cover: 'Etterforsker Anders Vik for tollvesenet',
      risk: 38,
      clues: ['Rapport innlevert hver fredag 23:00', 'Kryptert kanal aktiv 4t/dag', 'Mistenkelig nær Marit (mål-radius)'],
    },
  },
  {
    n: 'Sven Røed', age: 47, district: 'Γ · Industri', job: 'Lagersjef',
    income: 6100, expense: 5400,
    traits: [{ k: 'sosial', v: 38 }, { k: 'risiko', v: 92 }, { k: 'lojalitet', v: 41 }, { k: 'temperament', v: 78 }, { k: 'grådighet', v: 84 }],
    hobbies: [{ n: 'Poker', icon: Coffee }, { n: 'Biler', icon: Car }],
    rels: [
      { n: 'Anders Vik', t: 'rival',   bond: 18 },
      { n: '"Sjefen"',   t: 'kollega', bond: 60 },
    ],
    schedule: [
      { h: 6, act: 'Lager',      col: 'work' },
      { h: 18, act: 'Bar Δ',     col: 'social' },
      { h: 23, act: 'Bakgate',   col: 'secret' },
    ],
    secret: {
      kind: 'dobbeltagent', cover: 'Selger info om Anders til konkurrerende kartell',
      risk: 81,
      clues: ['Møte med X-faksjon hver 2. uke', 'Telefon-aktivitet etter midnatt', 'Plutselig kontant-spruts'],
    },
  },
  {
    n: 'Kari Holm', age: 29, district: 'Α · Sentrum', job: 'Sykepleier',
    income: 4200, expense: 3000,
    traits: [{ k: 'sosial', v: 84 }, { k: 'risiko', v: 18 }, { k: 'lojalitet', v: 78 }, { k: 'temperament', v: 24 }, { k: 'grådighet', v: 14 }],
    hobbies: [{ n: 'Yoga', icon: Dumbbell }, { n: 'Kaffe', icon: Coffee }],
    rels: [
      { n: 'Marit Solheim', t: 'venn',   bond: 71 },
      { n: 'Tuva Holm',     t: 'familie', bond: 88 },
    ],
    schedule: [
      { h: 7, act: 'Sykehus', col: 'work' },
      { h: 16, act: 'Park',   col: 'social' },
      { h: 20, act: 'Hjem',   col: 'rest' },
    ],
  },
  {
    n: 'Nora Vik', age: 38, district: 'Α · Havn', job: 'Regnskap',
    income: 5400, expense: 4200,
    traits: [{ k: 'sosial', v: 46 }, { k: 'risiko', v: 22 }, { k: 'lojalitet', v: 64 }, { k: 'temperament', v: 38 }, { k: 'grådighet', v: 31 }],
    hobbies: [{ n: 'Strikking', icon: Palette }, { n: 'Krim-bok', icon: BookOpen }],
    rels: [
      { n: 'Anders Vik', t: 'familie', bond: 72 },
    ],
    schedule: [
      { h: 8, act: 'Kontor', col: 'work' },
      { h: 17, act: 'Hjem',  col: 'rest' },
    ],
  },
  {
    n: 'Mira Lund', age: 24, district: 'Β · Forstad', job: 'Mekaniker',
    income: 3800, expense: 2400,
    traits: [{ k: 'sosial', v: 62 }, { k: 'risiko', v: 58 }, { k: 'lojalitet', v: 82 }, { k: 'temperament', v: 48 }, { k: 'grådighet', v: 20 }],
    hobbies: [{ n: 'Motorsykkel', icon: Car }, { n: 'Punk', icon: Music }],
    rels: [
      { n: 'Tobias Lund', t: 'familie', bond: 80 },
      { n: 'Kontakt-7',   t: 'venn',    bond: 32 },
    ],
    schedule: [
      { h: 9, act: 'Verksted', col: 'work' },
      { h: 18, act: 'Garasje', col: 'social' },
      { h: 23, act: 'Hjem',    col: 'rest' },
    ],
  },
];

type LifeFilter = 'Alle' | 'Med hemmelighet' | 'Familie' | 'Nettverk';
const filterPred: Record<LifeFilter, (n: Npc) => boolean> = {
  'Alle':            ()  => true,
  'Med hemmelighet': (n) => !!n.secret,
  'Familie':         (n) => n.rels.some(r => r.t === 'familie'),
  'Nettverk':        (n) => n.rels.length >= 3,
};

export function LivesView({ tk, tick }: ViewProps) {
  const [filter, setFilter] = React.useState<LifeFilter>('Alle');
  const visible = lifeNpcs.filter(filterPred[filter]);
  const [selectedName, setSelectedName] = React.useState<string>('Anders Vik');
  // clamp selection to current filter; fall back to first visible NPC
  const npc = visible.find(n => n.n === selectedName) ?? visible[0] ?? lifeNpcs[0];

  const relColor = (t: Npc['rels'][number]['t']) =>
    t === 'elsker' ? '#f08a82' : t === 'familie' ? tk.WARM : t === 'rival' ? tk.BAD : t === 'kollega' ? tk.M : tk.ACCENT;
  const slotColor = (c: Npc['schedule'][number]['col']) =>
    c === 'work' ? tk.ACCENT : c === 'social' ? tk.WARM : c === 'secret' ? tk.BAD : tk.DIM;
  const secretIcon = (k: SecretKind) =>
    k === 'kriminell' ? Skull : k === 'undercover' ? EyeOff : k === 'spion' ? Eye : Network;

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: tk.B, minWidth: 0 }}>
      {/* sub-toolbar */}
      <div style={{ height: 40, borderBottom: `1px solid ${tk.BRD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {(['Alle', 'Med hemmelighet', 'Familie', 'Nettverk'] as const).map(f => {
            const active = filter === f;
            const n = lifeNpcs.filter(filterPred[f]).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '0 14px', height: 40, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: active ? 500 : 400, color: active ? tk.T : tk.M, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                {f}
                <span style={{ fontSize: 11, color: active ? tk.ACCENT : tk.DIM, fontFamily: 'monospace' }}>{n}</span>
                {active && <span style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 1, background: tk.ACCENT, boxShadow: `0 0 5px ${tk.ACCENT}` }} />}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={{ fontSize: 12, color: tk.M, background: 'none', border: `1px solid ${tk.BRD}`, padding: '5px 10px', borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <RefreshCw size={11} /> Regenerer liv
          </button>
          <button style={{ fontSize: 12, color: tk.B, background: tk.ICE, fontWeight: 500, border: 'none', padding: '5px 10px', borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Plus size={11} /> Ny NPC
          </button>
        </div>
      </div>

      {/* stat strip */}
      <div style={{ height: 30, borderBottom: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 22, flexShrink: 0, fontSize: 12, fontFamily: 'monospace' }}>
        <span style={{ color: tk.T }}>{lifeNpcs.length}<span style={{ color: tk.M, marginLeft: 4 }}>NPCs</span></span>
        <span style={{ color: tk.BAD }}>{lifeNpcs.filter(n => n.secret).length}<span style={{ color: tk.M, marginLeft: 4 }}>m/ hemmelighet</span></span>
        <span style={{ color: tk.WARM }}>{lifeNpcs.filter(n => n.rels.some(r => r.t === 'elsker')).length}<span style={{ color: tk.M, marginLeft: 4 }}>elsker-bånd</span></span>
        <span style={{ color: tk.GOOD }}>+${(lifeNpcs.reduce((s, n) => s + n.income - n.expense, 0) / 1000).toFixed(1)}k<span style={{ color: tk.M, marginLeft: 4 }}>netto/d</span></span>
        <span style={{ color: tk.M, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: tk.GOOD, animation: 'sp3-blink 2s infinite' }} />
          sim tick {tick}
        </span>
      </div>

      {/* body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* NPC liste */}
        <div style={{ width: 220, borderRight: `1px solid ${tk.BRD}`, overflowY: 'auto', flexShrink: 0 }}>
          {visible.map((n) => {
            const active = n.n === npc.n;
            return (
              <button key={n.n} onClick={() => setSelectedName(n.n)}
                style={{ width: '100%', textAlign: 'left', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: active ? tk.ACCENT_DIM : 'none', border: 'none', borderBottom: `1px solid ${tk.BRD2}`, borderLeft: active ? `2px solid ${tk.ACCENT}` : '2px solid transparent', cursor: 'pointer' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: tk.B, border: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: tk.M }}>
                  <UserCircle2 size={18} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, color: active ? tk.T : tk.T, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.n}</div>
                  <div style={{ fontSize: 11, color: tk.M, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.district} · {n.age}</div>
                </div>
                {n.secret && <span style={{ fontSize: 10, color: tk.BAD, fontFamily: 'monospace', padding: '2px 5px', border: `1px solid ${tk.BAD}`, borderRadius: 2, flexShrink: 0 }}>!</span>}
              </button>
            );
          })}
        </div>

        {/* NPC profil sentrum */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
          {/* header card */}
          <div style={{ display: 'flex', gap: 16, padding: 16, border: `1px solid ${tk.BRD}`, background: tk.B }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: tk.B, border: `1px solid ${tk.BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: tk.M, position: 'relative' }}>
              <UserCircle2 size={42} />
              {npc.secret && <span style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: tk.BAD, border: `2px solid ${tk.B}`, animation: 'sp3-blink 1.8s infinite' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 17, color: tk.T, letterSpacing: '-0.01em' }}>{npc.n}</span>
                <span style={{ fontSize: 12, color: tk.M, fontFamily: 'monospace' }}>{npc.age} år · {npc.district}</span>
                {npc.secret && (
                  <span style={{ fontSize: 11, color: tk.BAD, fontFamily: 'monospace', padding: '2px 7px', border: `1px solid ${tk.BAD}`, borderRadius: 2, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {React.createElement(secretIcon(npc.secret.kind), { size: 10 })}
                    {npc.secret.kind}
                  </span>
                )}
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: tk.M, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Briefcase size={12} /> {npc.job}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 14, fontSize: 12, fontFamily: 'monospace' }}>
                <span style={{ color: tk.GOOD, display: 'flex', alignItems: 'center', gap: 4 }}><TrendingUp size={11} />+${npc.income.toLocaleString()}</span>
                <span style={{ color: tk.BAD,  display: 'flex', alignItems: 'center', gap: 4 }}><TrendingDown size={11} />-${npc.expense.toLocaleString()}</span>
                <span style={{ color: tk.T, display: 'flex', alignItems: 'center', gap: 4 }}><Coins size={11} />netto ${(npc.income - npc.expense).toLocaleString()}/mnd</span>
              </div>
            </div>
          </div>

          {/* personlighet */}
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Personlighet</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {npc.traits.map(tr => (
                <div key={tr.k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 96, fontSize: 12, color: tk.M, fontFamily: 'monospace' }}>{tr.k}</span>
                  <div style={{ flex: 1, height: 4, background: tk.BRD2, position: 'relative', borderRadius: 1 }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${tr.v}%`, background: tr.v > 70 ? tk.WARM : tr.v > 40 ? tk.ACCENT : tk.M, boxShadow: tr.v > 70 ? `0 0 6px ${tk.WARM}` : 'none' }} />
                  </div>
                  <span style={{ width: 28, textAlign: 'right', fontSize: 11.5, color: tk.T, fontFamily: 'monospace' }}>{tr.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* hobbyer */}
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Hobbyer</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {npc.hobbies.map(h => (
                <span key={h.n} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', border: `1px solid ${tk.BRD}`, fontSize: 12, color: tk.T, fontFamily: 'monospace', borderRadius: 2 }}>
                  <h.icon size={11} style={{ color: tk.M }} /> {h.n}
                </span>
              ))}
            </div>
          </div>

          {/* relasjoner */}
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Relasjoner ({npc.rels.length})</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
              {npc.rels.map(r => (
                <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', border: `1px solid ${tk.BRD}`, background: tk.B }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: relColor(r.t), flexShrink: 0, boxShadow: r.t === 'elsker' ? `0 0 6px ${relColor(r.t)}` : 'none' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: tk.T, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.n}</div>
                    <div style={{ fontSize: 10.5, color: tk.M, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.t}</div>
                  </div>
                  <span style={{ fontSize: 11.5, color: tk.M, fontFamily: 'monospace' }}>{r.bond}</span>
                </div>
              ))}
            </div>
          </div>

          {/* døgn-rytme */}
          <div>
            <div style={{ fontSize: 10.5, color: tk.DIM, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Døgn-rytme</div>
            <div style={{ position: 'relative', height: 38, border: `1px solid ${tk.BRD}`, background: tk.B }}>
              {npc.schedule.map((s, i) => {
                const next = npc.schedule[i + 1];
                const endH = next ? next.h : 24;
                const startH = s.h;
                const span = (endH > startH ? endH - startH : 24 - startH + endH);
                const left = (startH / 24) * 100;
                const width = (span / 24) * 100;
                return (
                  <div key={i} title={`${s.h}:00 — ${s.act}`}
                    style={{ position: 'absolute', top: 0, bottom: 0, left: `${left}%`, width: `${width}%`, background: slotColor(s.col), opacity: s.col === 'rest' ? 0.18 : 0.45, borderRight: `1px solid ${tk.B}`, display: 'flex', alignItems: 'center', padding: '0 6px', overflow: 'hidden' }}>
                    <span style={{ fontSize: 10.5, color: tk.T, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{s.act}</span>
                  </div>
                );
              })}
              {/* current hour marker */}
              <div style={{ position: 'absolute', top: -3, bottom: -3, left: `${((tick % 24) / 24) * 100}%`, width: 1, background: tk.ICE, boxShadow: `0 0 6px ${tk.ICE}` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: tk.DIM, fontFamily: 'monospace', marginTop: 4 }}>
              <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

