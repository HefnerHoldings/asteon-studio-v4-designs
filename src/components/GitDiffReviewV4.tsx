import React, { useState } from 'react';
import {
  MessageSquare, FolderTree, GitBranch, Settings, History,
  GitMerge, CheckCircle2, XCircle, AlertTriangle, ChevronDown,
  ChevronRight, Plus, Search, MoreHorizontal, Clock, Bot,
  Loader2, CornerDownRight, FileCode, Play, Sparkles, Save,
  PanelLeftClose, PanelLeftOpen, ArrowLeft, Eye, Terminal,
  MessageCircle, ThumbsUp, ThumbsDown, Info,
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
const WARM_DIM = 'rgba(245,169,107,0.12)';
const GOOD = '#88d999';
const GOOD_DIM = 'rgba(136,217,153,0.10)';
const BAD = '#f08a82';
const BAD_DIM = 'rgba(240,138,130,0.10)';

type TopTab = 'Build' | 'Content' | 'Systems' | 'Region' | 'Director' | 'Liv';
type RailKind = 'chat' | 'files' | 'git' | 'systems' | 'settings' | 'history';

const RAIL_ICONS = [MessageSquare, FolderTree, GitBranch, Settings, History];
const RAIL_LABELS = ['Chat', 'Filer', 'Git', 'Systemer', 'Historikk'];
const RAIL_KINDS: RailKind[] = ['chat', 'files', 'git', 'systems', 'settings'];

type ChangedFile = {
  id: string;
  path: string;
  adds: number;
  dels: number;
  status: 'modified' | 'added' | 'deleted';
};

const CHANGED_FILES: ChangedFile[] = [
  { id: 'inv',    path: 'src/systems/inventory_v2.ts',  adds: 34, dels: 12, status: 'modified' },
  { id: 'inv_t',  path: 'src/systems/inventory_v2.test.ts', adds: 18, dels: 4, status: 'modified' },
  { id: 'items',  path: 'src/data/items.json',           adds: 6,  dels: 2,  status: 'modified' },
  { id: 'types',  path: 'src/types/inventory.ts',        adds: 9,  dels: 7,  status: 'modified' },
  { id: 'api',    path: 'src/api/inventory-routes.ts',   adds: 12, dels: 8,  status: 'modified' },
  { id: 'schema', path: 'src/db/schemas/inventory.ts',   adds: 5,  dels: 0,  status: 'modified' },
  { id: 'store',  path: 'src/store/inventory-store.ts',  adds: 21, dels: 14, status: 'modified' },
  { id: 'ui_inv', path: 'src/ui/InventoryPanel.tsx',     adds: 8,  dels: 3,  status: 'modified' },
  { id: 'ui_slot',path: 'src/ui/ItemSlot.tsx',           adds: 11, dels: 6,  status: 'modified' },
  { id: 'hooks',  path: 'src/hooks/useInventory.ts',     adds: 7,  dels: 5,  status: 'modified' },
  { id: 'utils',  path: 'src/utils/item-utils.ts',       adds: 4,  dels: 2,  status: 'modified' },
  { id: 'econ',   path: 'src/systems/economy.ts',        adds: 2,  dels: 1,  status: 'modified' },
  { id: 'constants',path:'src/constants/inventory.ts',   adds: 3,  dels: 0,  status: 'added' },
  { id: 'old_inv',path: 'src/systems/inventory_v1.ts',   adds: 0,  dels: 81, status: 'deleted' },
];

type DiffLine = {
  kind: 'add' | 'del' | 'ctx' | 'hunk';
  old?: number;
  new?: number;
  text: string;
};

const DIFF_INVENTORY: DiffLine[] = [
  { kind: 'hunk', text: '@@ -1,18 +1,24 @@ inventory_v2.ts' },
  { kind: 'ctx', old: 1,  new: 1,  text: "import { Item, ItemStack } from '../types/inventory';" },
  { kind: 'ctx', old: 2,  new: 2,  text: "import { db } from '../db';" },
  { kind: 'del', old: 3,           text: "import { legacyMapItem } from '../systems/inventory_v1';" },
  { kind: 'add',           new: 3,  text: "import { STACK_LIMIT } from '../constants/inventory';" },
  { kind: 'ctx', old: 4,  new: 4,  text: "" },
  { kind: 'del', old: 5,           text: "const MAX_STACK = 64;" },
  { kind: 'del', old: 6,           text: "const DURABILITY_SCALAR = 0.85; // TODO: move to config" },
  { kind: 'add',           new: 5,  text: "const DURABILITY_SCALAR = 0.85;" },
  { kind: 'ctx', old: 7,  new: 6,  text: "" },
  { kind: 'ctx', old: 8,  new: 7,  text: "export class InventoryManager {" },
  { kind: 'ctx', old: 9,  new: 8,  text: "  private slots: Map<number, ItemStack> = new Map();" },
  { kind: 'ctx', old: 10, new: 9,  text: "" },
  { kind: 'del', old: 11,          text: "  addItem(item: Item, qty: number): boolean {" },
  { kind: 'del', old: 12,          text: "    const mapped = legacyMapItem(item);" },
  { kind: 'del', old: 13,          text: "    return this._addMapped(mapped, qty);" },
  { kind: 'del', old: 14,          text: "  }" },
  { kind: 'add',           new: 10, text: "  addItem(item: Item, qty: number): boolean {" },
  { kind: 'add',           new: 11, text: "    if (qty <= 0) throw new RangeError('qty must be > 0');" },
  { kind: 'add',           new: 12, text: "    const slotIdx = this._findOrCreateSlot(item);" },
  { kind: 'add',           new: 13, text: "    const stack = this.slots.get(slotIdx)!;" },
  { kind: 'add',           new: 14, text: "    if (stack.count + qty > STACK_LIMIT) return false;" },
  { kind: 'add',           new: 15, text: "    stack.count += qty;" },
  { kind: 'add',           new: 16, text: "    return true;" },
  { kind: 'add',           new: 17, text: "  }" },
  { kind: 'ctx', old: 15, new: 18, text: "" },
  { kind: 'hunk', text: '@@ -28,9 +34,13 @@' },
  { kind: 'ctx', old: 28, new: 34, text: "  removeItem(slotIdx: number, qty: number): boolean {" },
  { kind: 'ctx', old: 29, new: 35, text: "    const stack = this.slots.get(slotIdx);" },
  { kind: 'ctx', old: 30, new: 36, text: "    if (!stack) return false;" },
  { kind: 'del', old: 31,          text: "    stack.count = Math.max(0, stack.count - qty);" },
  { kind: 'del', old: 32,          text: "    if (stack.count === 0) this.slots.delete(slotIdx);" },
  { kind: 'add',           new: 37, text: "    if (qty > stack.count) return false;" },
  { kind: 'add',           new: 38, text: "    stack.count -= qty;" },
  { kind: 'add',           new: 39, text: "    if (stack.count === 0) {" },
  { kind: 'add',           new: 40, text: "      this.slots.delete(slotIdx);" },
  { kind: 'add',           new: 41, text: "      this._compactSlots();" },
  { kind: 'add',           new: 42, text: "    }" },
  { kind: 'ctx', old: 33, new: 43, text: "    return true;" },
  { kind: 'ctx', old: 34, new: 44, text: "  }" },
];

type InlineComment = { line: number; author: 'agent' | 'user'; text: string };
const INLINE_COMMENTS: InlineComment[] = [
  { line: 14, author: 'agent', text: "STACK_LIMIT er eksportert fra den nye constants-filen — ingen magic numbers lenger." },
  { line: 38, author: 'user',  text: "Bra. Men bør vi logge når qty > stack.count i stedet for silent false?" },
  { line: 40, author: 'agent', text: "Enig — lagt til debug-logging i neste patch-steg." },
];

type CheckStatus = 'pass' | 'fail' | 'running' | 'skip';
const CHECKS: { label: string; status: CheckStatus; detail: string }[] = [
  { label: 'tsc --noEmit',          status: 'pass',    detail: '0 feil · 1 advarsel' },
  { label: 'vitest (inventory)',     status: 'pass',    detail: '18/18 bestått' },
  { label: 'vitest (economy)',       status: 'skip',    detail: '2 hoppet over' },
  { label: 'lint-test-isolation',    status: 'pass',    detail: 'ok' },
];

function CheckDot({ status }: { status: CheckStatus }) {
  const c = status === 'pass' ? GOOD : status === 'fail' ? BAD : status === 'running' ? ACCENT : DIM;
  return <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, display: 'inline-block', boxShadow: status === 'running' ? `0 0 6px ${c}` : 'none', flexShrink: 0 }} />;
}

export default function GitDiffReviewV4() {
  const [topTab, setTopTab] = useState<TopTab>('Build');
  const [railItem, setRailItem] = useState(2);
  const [railExpanded, setRailExpanded] = useState(false);
  const [activeFile, setActiveFile] = useState('inv');
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [commentedLines, setCommentedLines] = useState<Set<number>>(new Set([14, 38, 40]));
  const [decision, setDecision] = useState<null | 'approved' | 'rejected' | 'changes'>(null);

  const activeFileMeta = CHANGED_FILES.find(f => f.id === activeFile)!;
  const totalAdds = CHANGED_FILES.reduce((s, f) => s + f.adds, 0);
  const totalDels = CHANGED_FILES.reduce((s, f) => s + f.dels, 0);

  return (
    <div style={{
      width: '100%', height: '100vh', background: B, color: T,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
      fontSize: 13, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <style>{`
        .gdr * { box-sizing: border-box; }
        .gdr *::-webkit-scrollbar { width: 7px; height: 7px; }
        .gdr *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 4px; }
        .gdr *::-webkit-scrollbar-track { background: transparent; }
        @keyframes gdr-spin { to { transform: rotate(360deg); } }
        @keyframes gdr-ping { 0% { transform: scale(0.7); opacity: 0.4; } 80%,100% { transform: scale(2); opacity: 0; } }
      `}</style>

      {/* ── TOP BAR ── */}
      <header className="gdr" style={{
        height: 44, flexShrink: 0, borderBottom: `1px solid ${BRD}`, background: B,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: '100%' }}>
          <span style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, letterSpacing: "0.14em", color: "#ededed", opacity: 0.9 }}>ASTEON</span>
          <nav style={{ display: 'flex', height: '100%', gap: 0 }}>
            {(['Build', 'Content', 'Systems', 'Region', 'Director', 'Liv'] as const).map(t => {
              const active = topTab === t;
              return (
                <button key={t} onClick={() => setTopTab(t)}
                  style={{ position: 'relative', padding: '0 14px', height: '100%', fontSize: 13,
                    fontWeight: active ? 500 : 400, color: active ? T : M, background: 'none', border: 'none', cursor: 'pointer' }}>
                  {t}
                  {active && <span style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 1, background: ACCENT, boxShadow: `0 0 5px ${ACCENT}` }} />}
                </button>
              );
            })}
            <button style={{ position: 'relative', padding: '0 14px', height: '100%', fontSize: 13,
              fontWeight: 500, color: WARM, background: 'none', border: 'none', cursor: 'pointer' }}>
              Kodegjennomgang
              <span style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 1, background: WARM, boxShadow: `0 0 5px ${WARM}` }} />
            </button>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: M }}>
            <span style={{ color: T }}>$0.42</span>
            <span style={{ color: DIM, margin: '0 6px' }}>·</span>
            <span style={{ color: T }}>500</span>
          </span>
          <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 9px 4px 8px', height: 24,
            background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}`, borderRadius: 3, color: M, cursor: 'pointer', fontSize: 12 }}>
            <Search size={11} strokeWidth={1.5} />
            <span style={{ color: DIM }}>Søk i filer…</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10.5, color: DIM, border: `1px solid ${BRD}`, padding: '0 4px', borderRadius: 2 }}>⌘P</span>
          </button>
          <button style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
            <Play size={13} strokeWidth={1.5} />
          </button>
          <button style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: M, cursor: 'pointer' }}>
            <Sparkles size={13} strokeWidth={1.5} />
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px', height: 26,
            background: ICE, color: B, fontSize: 13, fontWeight: 600, borderRadius: 4, border: 'none', cursor: 'pointer' }}>
            <Save size={12} /> Save
          </button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="gdr" style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* ── LEFT RAIL ── */}
        <aside style={{
          width: railExpanded ? 240 : 44, flexShrink: 0, borderRight: `1px solid ${BRD}`,
          background: B, display: 'flex', flexDirection: 'column',
          transition: 'width 0.18s ease', overflow: 'hidden',
        }}>
          <div style={{ height: 40, flexShrink: 0, display: 'flex', alignItems: 'center',
            justifyContent: railExpanded ? 'space-between' : 'center', padding: railExpanded ? '0 10px 0 14px' : 0 }}>
            {railExpanded && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: T }}>{RAIL_LABELS[railItem]}</span>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
              </div>
            )}
            <button onClick={() => setRailExpanded(v => !v)}
              style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: DIM, cursor: 'pointer' }}>
              {railExpanded ? <PanelLeftClose size={12} /> : <PanelLeftOpen size={12} />}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: railExpanded ? 'stretch' : 'center', padding: railExpanded ? '2px 8px 6px' : '4px 0', gap: 1 }}>
            {RAIL_ICONS.map((Icon, i) => {
              const active = railItem === i;
              return railExpanded ? (
                <button key={i} onClick={() => setRailItem(i)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', background: 'none',
                    border: 'none', color: active ? T : M, cursor: 'pointer', textAlign: 'left', width: '100%', position: 'relative' }}>
                  {active && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1.5, background: ACCENT, boxShadow: `0 0 4px ${ACCENT}` }} />}
                  <Icon size={13} strokeWidth={1.4} color={active ? T : M} />
                  <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, flex: 1 }}>{RAIL_LABELS[i]}</span>
                  {i === 2 && <span style={{ fontSize: 10, fontFamily: 'monospace', color: WARM }}>1</span>}
                </button>
              ) : (
                <button key={i} onClick={() => setRailItem(i)} title={RAIL_LABELS[i]}
                  style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'none', border: 'none', color: active ? T : DIM, cursor: 'pointer', position: 'relative' }}>
                  <Icon size={14} strokeWidth={1.4} />
                  {i === 2 && <span style={{ position: 'absolute', top: 5, right: 5, fontSize: 7, fontFamily: 'monospace', color: WARM }}>1</span>}
                </button>
              );
            })}
          </div>

          {/* Agent run context */}
          {railExpanded && (
            <div style={{ flex: 1, overflow: 'auto', padding: '12px 8px', borderTop: `1px solid ${BRD}`, marginTop: 8 }}>
              <div style={{ fontSize: 11, color: M, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '0 6px', marginBottom: 8 }}>Gjeldende patch</div>
              <div style={{ padding: '9px 10px', borderRadius: 4, background: `${WARM}0a`, border: `1px solid ${WARM}22` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <GitMerge size={11} color={WARM} strokeWidth={1.5} />
                  <span style={{ fontSize: 12.5, color: T, fontWeight: 500 }}>Refaktor inventory_v2</span>
                </div>
                <div style={{ fontSize: 11, color: M, fontFamily: 'monospace', marginBottom: 6 }}>14 filer · patch klar</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ fontSize: 10.5, color: GOOD, fontFamily: 'monospace' }}>+{totalAdds}</span>
                  <span style={{ fontSize: 10.5, color: BAD, fontFamily: 'monospace' }}>-{totalDels}</span>
                </div>
              </div>

              <div style={{ fontSize: 11, color: M, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '0 6px', margin: '16px 0 8px' }}>Sjekker</div>
              {CHECKS.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 6px', borderRadius: 3 }}>
                  <CheckDot status={c.status} />
                  <span style={{ flex: 1, fontSize: 11.5, color: c.status === 'fail' ? BAD : T, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</span>
                  <span style={{ fontSize: 10, color: DIM, fontFamily: 'monospace' }}>{c.detail}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{ flexShrink: 0, padding: railExpanded ? '10px 14px' : '10px 0', borderTop: `1px solid ${BRD}`,
            display: 'flex', alignItems: 'center', gap: 9, justifyContent: railExpanded ? 'flex-start' : 'center' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: T }}>B</div>
            {railExpanded && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: T }}>Builder</div>
                <div style={{ fontSize: 11, color: DIM, fontFamily: 'monospace' }}>gpt-fast</div>
              </div>
            )}
          </div>
        </aside>

        {/* ── FILE LIST PANEL ── */}
        <aside style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${BRD}`, background: B, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
            <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRD}`, borderRadius: 3 }}>
              <GitMerge size={12} color={WARM} strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: T, lineHeight: 1.1 }}>Endrede filer</div>
              <div style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace' }}>{CHANGED_FILES.length} filer · <span style={{ color: GOOD }}>+{totalAdds}</span> <span style={{ color: BAD }}>-{totalDels}</span></div>
            </div>
          </div>

          {/* File list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
            {CHANGED_FILES.map(f => {
              const on = f.id === activeFile;
              const name = f.path.split('/').pop()!;
              const dir = f.path.split('/').slice(0, -1).join('/');
              const statusColor = f.status === 'added' ? GOOD : f.status === 'deleted' ? BAD : ACCENT;
              return (
                <button key={f.id} onClick={() => setActiveFile(f.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px',
                    background: on ? `${ACCENT}0c` : 'none', border: 'none',
                    borderLeft: `2px solid ${on ? ACCENT : 'transparent'}`, cursor: 'pointer', textAlign: 'left' }}>
                  <FileCode size={11} color={on ? ACCENT : DIM} strokeWidth={1.4} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: on ? T : M, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                    <div style={{ fontSize: 10, color: DIM, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dir}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0, fontFamily: 'monospace', fontSize: 10 }}>
                    {f.adds > 0 && <span style={{ color: GOOD }}>+{f.adds}</span>}
                    {f.dels > 0 && <span style={{ color: BAD }}>-{f.dels}</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Decision buttons */}
          <div style={{ flexShrink: 0, padding: '10px 10px 12px', borderTop: `1px solid ${BRD}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {decision === null ? (
              <>
                <button onClick={() => setDecision('approved')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 30, borderRadius: 4,
                    background: GOOD_DIM, border: `1px solid ${GOOD}55`, color: GOOD, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                  <CheckCircle2 size={13} strokeWidth={1.6} /> Godkjenn og merge
                </button>
                <button onClick={() => setDecision('changes')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 28, borderRadius: 4,
                    background: 'none', border: `1px solid ${BRD}`, color: M, fontSize: 12, cursor: 'pointer' }}>
                  <MessageCircle size={12} strokeWidth={1.5} /> Be om endringer
                </button>
                <button onClick={() => setDecision('rejected')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 28, borderRadius: 4,
                    background: 'none', border: 'none', color: DIM, fontSize: 12, cursor: 'pointer' }}>
                  <XCircle size={12} strokeWidth={1.5} /> Avvis patch
                </button>
              </>
            ) : decision === 'approved' ? (
              <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: GOOD_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} color={GOOD} strokeWidth={1.6} />
                </div>
                <div style={{ fontSize: 12, color: GOOD, fontWeight: 500 }}>Merget ✓</div>
                <div style={{ fontSize: 10.5, color: M, textAlign: 'center' }}>14 filer merget til main</div>
                <button onClick={() => setDecision(null)} style={{ fontSize: 11, color: DIM, background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>Angre</button>
              </div>
            ) : decision === 'rejected' ? (
              <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <XCircle size={20} color={BAD} strokeWidth={1.5} />
                <div style={{ fontSize: 12, color: BAD, fontWeight: 500 }}>Patch avvist</div>
                <button onClick={() => setDecision(null)} style={{ fontSize: 11, color: DIM, background: 'none', border: 'none', cursor: 'pointer' }}>Tilbake</button>
              </div>
            ) : (
              <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <MessageCircle size={20} color={WARM} strokeWidth={1.5} />
                <div style={{ fontSize: 12, color: WARM, fontWeight: 500 }}>Endringer forespurt</div>
                <div style={{ fontSize: 10.5, color: M, textAlign: 'center' }}>Agent mottar tilbakemelding</div>
                <button onClick={() => setDecision(null)} style={{ fontSize: 11, color: DIM, background: 'none', border: 'none', cursor: 'pointer' }}>Tilbake</button>
              </div>
            )}
          </div>
        </aside>

        {/* ── DIFF AREA ── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Diff toolbar */}
          <div style={{ height: 40, flexShrink: 0, borderBottom: `1px solid ${BRD}`, background: B,
            display: 'flex', alignItems: 'center', padding: '0 14px', gap: 12 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 7px', background: 'none',
              border: `1px solid ${BRD}`, borderRadius: 3, color: M, fontSize: 11, cursor: 'pointer' }}>
              <ArrowLeft size={10} strokeWidth={1.5} /> Tilbake til kanban
            </button>
            <div style={{ width: 1, height: 18, background: BRD }} />
            <FileCode size={12} color={ACCENT} strokeWidth={1.4} />
            <span style={{ fontSize: 12.5, color: T, fontFamily: 'monospace' }}>
              {activeFileMeta.path.split('/').pop()}
            </span>
            <span style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace' }}>
              {activeFileMeta.path.split('/').slice(0, -1).join('/')}
            </span>
            <div style={{ display: 'flex', gap: 6, fontSize: 10.5, fontFamily: 'monospace', marginLeft: 4 }}>
              <span style={{ color: GOOD }}>+{activeFileMeta.adds}</span>
              <span style={{ color: BAD }}>-{activeFileMeta.dels}</span>
            </div>
            <div style={{ flex: 1 }} />
            {/* View toggle */}
            <div style={{ display: 'flex', border: `1px solid ${BRD}`, borderRadius: 3, overflow: 'hidden' }}>
              {(['split', 'unified'] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  style={{ padding: '3px 10px', fontSize: 11, background: viewMode === v ? 'rgba(255,255,255,0.06)' : 'none',
                    border: 'none', color: viewMode === v ? T : M, cursor: 'pointer' }}>
                  {v === 'split' ? 'Delt' : 'Samlet'}
                </button>
              ))}
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 7px', background: 'none',
              border: `1px solid ${BRD}`, borderRadius: 3, color: M, fontSize: 11, cursor: 'pointer' }}>
              <Eye size={10} strokeWidth={1.5} /> Forhåndsvis
            </button>
          </div>

          {/* ── DIFF CONTENT ── */}
          <div style={{ flex: 1, overflow: 'auto', fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: 12.5 }}>
            {viewMode === 'split' ? (
              /* SPLIT VIEW */
              <div style={{ display: 'flex', minHeight: '100%' }}>
                {/* Old */}
                <div style={{ flex: 1, borderRight: `1px solid ${BRD}`, minWidth: 0 }}>
                  <div style={{ padding: '4px 12px', fontSize: 10.5, color: DIM, borderBottom: `1px solid ${BRD2}`, letterSpacing: '0.04em', fontFamily: 'inherit' }}>GAMMEL</div>
                  {DIFF_INVENTORY.map((line, i) => {
                    if (line.kind === 'hunk') {
                      return (
                        <div key={i} style={{ display: 'flex', background: `${ACCENT}08`, borderTop: `1px solid ${BRD}`, borderBottom: `1px solid ${BRD}` }}>
                          <div style={{ width: 38, flexShrink: 0, padding: '3px 8px', color: DIM, fontSize: 11, textAlign: 'right', userSelect: 'none' }} />
                          <div style={{ flex: 1, padding: '3px 12px', color: ACCENT, fontSize: 11.5 }}>{line.text}</div>
                        </div>
                      );
                    }
                    if (line.kind === 'add') return null;
                    const bg = line.kind === 'del' ? BAD_DIM : 'transparent';
                    const clr = line.kind === 'del' ? BAD : T;
                    const hasComment = line.old && commentedLines.has(line.old);
                    return (
                      <React.Fragment key={i}>
                        <div style={{ display: 'flex', background: bg, borderBottom: `1px solid ${BRD2}` }}>
                          <div style={{ width: 38, flexShrink: 0, padding: '2px 8px', color: DIM, fontSize: 11, textAlign: 'right', userSelect: 'none', borderRight: `1px solid ${BRD2}` }}>
                            {line.old}
                          </div>
                          <div style={{ flex: 1, padding: '2px 12px', color: clr, whiteSpace: 'pre', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {line.kind === 'del' && <span style={{ color: BAD, userSelect: 'none' }}>-</span>}
                            {line.kind === 'ctx' && <span style={{ color: DIM, userSelect: 'none' }}> </span>}
                            <span>{line.text}</span>
                          </div>
                        </div>
                        {hasComment && line.old && <InlineCommentBlock lineNum={line.old} />}
                      </React.Fragment>
                    );
                  })}
                </div>
                {/* New */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ padding: '4px 12px', fontSize: 10.5, color: DIM, borderBottom: `1px solid ${BRD2}`, letterSpacing: '0.04em', fontFamily: 'inherit' }}>NY</div>
                  {DIFF_INVENTORY.map((line, i) => {
                    if (line.kind === 'hunk') {
                      return (
                        <div key={i} style={{ display: 'flex', background: `${ACCENT}08`, borderTop: `1px solid ${BRD}`, borderBottom: `1px solid ${BRD}` }}>
                          <div style={{ width: 38, flexShrink: 0, padding: '3px 8px', color: DIM, fontSize: 11, textAlign: 'right', userSelect: 'none' }} />
                          <div style={{ flex: 1, padding: '3px 12px', color: ACCENT, fontSize: 11.5 }}>{line.text}</div>
                        </div>
                      );
                    }
                    if (line.kind === 'del') return null;
                    const bg = line.kind === 'add' ? GOOD_DIM : 'transparent';
                    const clr = line.kind === 'add' ? GOOD : T;
                    const hasComment = line.new && commentedLines.has(line.new);
                    return (
                      <React.Fragment key={i}>
                        <div style={{ display: 'flex', background: bg, borderBottom: `1px solid ${BRD2}` }}>
                          <div style={{ width: 38, flexShrink: 0, padding: '2px 8px', color: DIM, fontSize: 11, textAlign: 'right', userSelect: 'none', borderRight: `1px solid ${BRD2}` }}>
                            {line.new}
                          </div>
                          <div style={{ flex: 1, padding: '2px 12px', color: clr, whiteSpace: 'pre', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {line.kind === 'add' && <span style={{ color: GOOD, userSelect: 'none' }}>+</span>}
                            {line.kind === 'ctx' && <span style={{ color: DIM, userSelect: 'none' }}> </span>}
                            <span>{line.text}</span>
                          </div>
                        </div>
                        {hasComment && line.new && <InlineCommentBlock lineNum={line.new} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* UNIFIED VIEW */
              <div>
                <div style={{ padding: '4px 12px', fontSize: 10.5, color: DIM, borderBottom: `1px solid ${BRD2}`, letterSpacing: '0.04em' }}>SAMLET DIFF</div>
                {DIFF_INVENTORY.map((line, i) => {
                  if (line.kind === 'hunk') {
                    return (
                      <div key={i} style={{ display: 'flex', background: `${ACCENT}08`, borderTop: `1px solid ${BRD}`, borderBottom: `1px solid ${BRD}` }}>
                        <div style={{ width: 72, flexShrink: 0 }} />
                        <div style={{ flex: 1, padding: '3px 12px', color: ACCENT, fontSize: 11.5 }}>{line.text}</div>
                      </div>
                    );
                  }
                  const bg = line.kind === 'add' ? GOOD_DIM : line.kind === 'del' ? BAD_DIM : 'transparent';
                  const clr = line.kind === 'add' ? GOOD : line.kind === 'del' ? BAD : T;
                  const hasComment = (line.old && commentedLines.has(line.old)) || (line.new && commentedLines.has(line.new));
                  return (
                    <React.Fragment key={i}>
                      <div style={{ display: 'flex', background: bg, borderBottom: `1px solid ${BRD2}` }}>
                        <div style={{ width: 36, flexShrink: 0, padding: '2px 6px', color: DIM, fontSize: 11, textAlign: 'right', userSelect: 'none', borderRight: `1px solid ${BRD2}` }}>
                          {line.old}
                        </div>
                        <div style={{ width: 36, flexShrink: 0, padding: '2px 6px', color: DIM, fontSize: 11, textAlign: 'right', userSelect: 'none', borderRight: `1px solid ${BRD2}` }}>
                          {line.new}
                        </div>
                        <div style={{ flex: 1, padding: '2px 12px', color: clr, whiteSpace: 'pre', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: line.kind === 'add' ? GOOD : line.kind === 'del' ? BAD : DIM, userSelect: 'none' }}>
                            {line.kind === 'add' ? '+' : line.kind === 'del' ? '-' : ' '}
                          </span>
                          <span>{line.text}</span>
                        </div>
                      </div>
                      {hasComment && <InlineCommentBlock lineNum={line.old ?? line.new ?? 0} />}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function InlineCommentBlock({ lineNum }: { lineNum: number }) {
  const comments = INLINE_COMMENTS.filter(c => c.line === lineNum);
  if (comments.length === 0) return null;
  return (
    <div style={{ background: `${ACCENT}07`, borderTop: `1px solid ${ACCENT}18`, borderBottom: `1px solid ${ACCENT}18`, padding: '8px 16px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {comments.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{
            width: 18, height: 18, borderRadius: 3, flexShrink: 0, marginTop: 1,
            background: c.author === 'agent' ? ACCENT_DIM : 'rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {c.author === 'agent'
              ? <Bot size={10} color={ACCENT} strokeWidth={1.5} />
              : <span style={{ fontSize: 10, color: T, fontWeight: 500 }}>B</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, color: c.author === 'agent' ? ACCENT : M, fontFamily: 'monospace', marginBottom: 3 }}>
              {c.author === 'agent' ? 'agent' : 'builder'} · linje {lineNum}
            </div>
            <div style={{ fontSize: 12.5, color: T, lineHeight: 1.5, fontFamily: 'inherit' }}>{c.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
