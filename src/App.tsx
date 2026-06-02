import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import StudioProV4 from './components/StudioProV4';
import StudioProV4World from './components/StudioProV4World';
import ExpertModeToolsV4 from './components/ExpertModeToolsV4';
import StudioProV4Code from './components/StudioProV4Code';
import KanbanV4 from './components/KanbanV4';
import GitDiffReviewV4 from './components/GitDiffReviewV4';

const ACCENT = '#7cd4ff';
const BRD = 'rgba(255,255,255,0.07)';
const M = '#6b6b70';
const T = '#ededed';
const DIM = '#3a3a3d';

const VIEWS = [
  { path: '/',        label: 'Studio Pro V4',          sub: 'Hoved-editor med chat' },
  { path: '/world',   label: 'Studio Pro V4 · World',  sub: 'Verden-editor' },
  { path: '/expert',  label: 'Ekspertmodus V4',         sub: '13 verktøy' },
  { path: '/code',    label: 'Kode-editor V4',          sub: 'Split-view + agent' },
  { path: '/kanban',  label: 'Kanban V4',               sub: 'Oppgave-tavle' },
  { path: '/gitdiff', label: 'Git Diff V4',             sub: 'Patch-review' },
];

function Nav() {
  const loc = useLocation();
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      height: 44,
      background: 'rgba(10,12,18,0.96)',
      borderBottom: `1px solid ${BRD}`,
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', gap: 0,
      padding: '0 18px',
      overflow: 'hidden',
    }}>
      <span style={{ fontSize: 12, color: DIM, fontFamily: 'monospace', marginRight: 18, flexShrink: 0 }}>
        Asteon Studio V4
      </span>
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', flex: 1 }}>
        {VIEWS.map(v => {
          const active = loc.pathname === v.path;
          return (
            <Link
              key={v.path}
              to={v.path}
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '0 14px', height: 44, textDecoration: 'none', flexShrink: 0,
                position: 'relative',
                borderRight: `1px solid ${BRD}`,
              }}
            >
              <span style={{ fontSize: 12.5, fontWeight: active ? 500 : 400, color: active ? T : M, lineHeight: 1.2 }}>
                {v.label}
              </span>
              <span style={{ fontSize: 10.5, color: DIM, fontFamily: 'monospace', lineHeight: 1.2 }}>
                {v.sub}
              </span>
              {active && (
                <span style={{
                  position: 'absolute', bottom: 0, left: 6, right: 6, height: 1.5,
                  background: ACCENT, boxShadow: `0 0 6px ${ACCENT}`,
                }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div style={{ paddingTop: 44, height: '100vh', overflow: 'hidden' }}>
        <Routes>
          <Route path="/"        element={<StudioProV4 />} />
          <Route path="/world"   element={<StudioProV4World />} />
          <Route path="/expert"  element={<ExpertModeToolsV4 />} />
          <Route path="/code"    element={<StudioProV4Code />} />
          <Route path="/kanban"  element={<KanbanV4 />} />
          <Route path="/gitdiff" element={<GitDiffReviewV4 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
