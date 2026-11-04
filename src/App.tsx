import { useEffect, useRef, useState } from 'react';
import { initWizardChess } from './wizardChessEngine.js';

export default function App() {
  const initializedRef = useRef(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initWizardChess();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSheetOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileSheetOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleRestoreUI = () => {
    const win = window as unknown as { wizardChess?: { toggleUI?: (force?: boolean) => void } };
    if (win.wizardChess?.toggleUI) {
      win.wizardChess.toggleUI(false);
    } else {
      document.body.classList.remove('cinematic-ui-hidden');
      const btnHide = document.getElementById('btn-hide-ui');
      if (btnHide) btnHide.textContent = 'Hide UI [H]';
    }
  };

  return (
    <>
      <div id="loading-overlay">
        <div className="loader-crest">⚡</div>
        <div className="loader-title">Hogwarts Wizard Chess</div>
        <div className="loader-subtitle">Gryffindor vs Slytherin • Great Hall Edition</div>
        <div className="loader-bar-wrap">
          <div className="loader-bar" id="loader-bar"></div>
        </div>
        <div id="loader-text">Lighting Floating Candles &amp; Enchanting House Pieces...</div>
      </div>

      <div id="canvas-container"></div>

      {/* Spell Duel Cinematic Announcement Overlay */}
      <div id="spell-duel-banner" className="spell-duel-banner" aria-live="assertive">
        <div className="spell-sparkle">✦ ✦ ✦</div>
        <div className="spell-announcement" id="spell-announcement">
          Gryffindor Queen casts <span className="spell-incantation">Expelliarmus!</span>
        </div>
      </div>

      <button
        type="button"
        className="hud-btn mobile-only-restore-ui"
        id="btn-mobile-show-ui"
        onClick={handleRestoreUI}
        title="Show HUD Controls"
      >
        Show UI
      </button>

      <div id="hud-top">
        <div className="hud-group" id="hud-left">
          <div className="brand-pill hogwarts-brand">
            <span className="brand-crest">⚡</span>
            <div className="brand-text-col">
              <span className="brand-title">HOGWARTS CHESS</span>
              <span className="brand-sub">Gryffindor vs Slytherin</span>
            </div>
          </div>
          <div className="status-pill" id="status-pill">
            <span className="turn-dot" id="turn-dot"></span>
            <span id="turn-text">Gryffindor to Cast</span>
            <span className="mode-badge" id="mode-badge">Playing as Gryffindor</span>
          </div>
        </div>

        <button
          type="button"
          className={`hud-btn mobile-controls-trigger ${mobileSheetOpen ? 'active' : ''}`}
          id="btn-mobile-controls"
          aria-expanded={mobileSheetOpen}
          aria-controls="hud-right"
          onClick={() => setMobileSheetOpen((prev) => !prev)}
        >
          {mobileSheetOpen ? 'Close' : 'Controls'}
        </button>

        <div
          className={`mobile-sheet-backdrop ${mobileSheetOpen ? 'open' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setMobileSheetOpen(false);
          }}
          aria-hidden="true"
        ></div>

        <div
          className={`hud-group ${mobileSheetOpen ? 'mobile-sheet-open' : ''}`}
          id="hud-right"
        >
          <div
            className="mobile-sheet-handle-wrap"
            onClick={(e) => {
              e.stopPropagation();
              setMobileSheetOpen(false);
            }}
            aria-hidden="true"
          >
            <div className="mobile-sheet-handle"></div>
          </div>

          <div className="mobile-sheet-header">
            <span className="mobile-sheet-title">House Controls</span>
            <button
              type="button"
              className="mobile-sheet-close"
              id="btn-mobile-sheet-close"
              onClick={(e) => {
                e.stopPropagation();
                setMobileSheetOpen(false);
              }}
              aria-label="Close Controls"
            >
              Close ✕
            </button>
          </div>

          <div className="mobile-sheet-section-label">House Actions</div>

          <button
            className="hud-btn"
            id="btn-side-toggle"
            title="Switch between Playing as Gryffindor and Playing as Slytherin"
            onClick={() => setMobileSheetOpen(false)}
          >
            Play as Slytherin
          </button>
          <button
            className="hud-btn"
            id="btn-ai-move"
            title="Let the AI cast the next wand move immediately"
            onClick={() => setMobileSheetOpen(false)}
          >
            AI Spell
          </button>
          <button
            className="hud-btn"
            id="btn-reset"
            title="Start a fresh match on the Great Hall table"
            onClick={() => setMobileSheetOpen(false)}
          >
            New Match
          </button>

          <div className="hud-divider" aria-hidden="true"></div>
          <div className="mobile-sheet-section-label">
            <span>Camera Perspectives</span>
            <span className="mobile-sheet-section-sub">Tap active view to flip</span>
          </div>

          <button
            className="hud-btn active"
            id="btn-cam-player"
            title="Player Duel Camera (Click again to flip Gryffindor / Slytherin view)"
          >
            Duellist Cam
          </button>
          <button
            className="hud-btn"
            id="btn-cam-top"
            title="Overhead Board View (Click again to flip orientation)"
          >
            Overhead
          </button>
          <button
            className="hud-btn"
            id="btn-cam-side"
            title="Side Profile View (Click again to switch East / West side)"
          >
            Side Flank
          </button>
          <button
            className="hud-btn"
            id="btn-cam-wide"
            title="Wide Great Hall View (Click again to switch North / South perspective)"
          >
            Great Hall
          </button>

          <div className="hud-divider" aria-hidden="true"></div>
          <div className="mobile-sheet-section-label">Display &amp; Sound</div>

          <button
            className="hud-btn"
            id="btn-hide-ui"
            title="Toggle HUD visibility (Shortcut: H)"
            onClick={() => setMobileSheetOpen(false)}
          >
            Hide UI [H]
          </button>

          <div className="mobile-sheet-hint">
            <strong>Touch:</strong> Tap Piece to Aim Wand &nbsp;•&nbsp; 1-Finger Drag: Orbit &nbsp;•&nbsp; 2-Finger Drag: Pan &nbsp;•&nbsp; Pinch: Zoom
          </div>
        </div>
      </div>

      <div id="hud-bottom">
        <div className="hint-pill" id="controls-hint">
          <strong>Wand Controls:</strong> Click Piece to Target &nbsp;•&nbsp; Cast Spell into Enemy &nbsp;•&nbsp; Left-Drag: Orbit &nbsp;•&nbsp; WASD: Fly Great Hall &nbsp;•&nbsp; H: Cinema View
        </div>
        <div className="captured-pill" id="captured-tray"></div>
      </div>

      <div id="checkmate-overlay" role="status" aria-live="polite">
        <div className="checkmate-banner">
          <div className="checkmate-ornament">✦ &nbsp; Hogwarts House Cup Decided &nbsp; ✦</div>
          <div className="checkmate-crown" id="checkmate-crown">⚡</div>
          <div className="checkmate-title" id="checkmate-title">Checkmate!</div>
          <div className="checkmate-rule"></div>
          <div className="checkmate-subtitle" id="checkmate-subtitle">
            Gryffindor Triumphs • Slytherin King Fallen!
          </div>
          <div className="checkmate-actions">
            <button className="checkmate-btn" id="btn-checkmate-replay">
              Replay Spell Blast
            </button>
            <button className="checkmate-btn" id="btn-checkmate-newgame">
              New Match
            </button>
            <button className="checkmate-btn secondary" id="btn-checkmate-dismiss">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
