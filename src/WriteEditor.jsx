import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Feather, ArrowLeft, Bold, Italic, Quote, List, Code2, Link2,
  Image as ImageIcon, Eye, PenLine, Check, Clock, BookMarked, Trash2, X
} from "lucide-react";
import { marked } from "marked";

const POST_TYPES = [
  "Thought", "Story", "Novel", "Poem", "Article", "Blog", "Diary", "Letter",
  "Essay", "Opinion", "Research", "Movie Script", "Short Film Script",
  "OTT Script", "Drama Script", "Street Play", "Speech", "Lyrics",
  "Children's Story", "Travel Writing", "Technology", "History", "Science",
  "Motivational", "Fiction", "Non-Fiction", "Others",
];

const DRAFT_KEY = "kitaaba_draft";
const PUBLISHED_KEY = "kitaaba_published";

const emptyDraft = () => ({
  id: null,
  title: "",
  subtitle: "",
  type: "Thought",
  body: "",
});

const wordCount = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);
const readingTime = (words) => Math.max(1, Math.round(words / 200));

export default function WriteEditor({ onBack }) {
  const [piece, setPiece] = useState(emptyDraft);
  const [mode, setMode] = useState("write"); // write | preview
  const [published, setPublished] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [justPublished, setJustPublished] = useState(false);
  const textareaRef = useRef(null);
  const saveTimer = useRef(null);

  // load on mount
  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      if (rawDraft) setPiece(JSON.parse(rawDraft));
      const rawPub = localStorage.getItem(PUBLISHED_KEY);
      if (rawPub) setPublished(JSON.parse(rawPub));
    } catch (e) {
      /* ignore corrupt storage */
    }
  }, []);

  // debounced autosave of the current draft
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(piece));
      setSavedAt(new Date());
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [piece]);

  const words = useMemo(() => wordCount(piece.body), [piece.body]);
  const minutes = useMemo(() => readingTime(words), [words]);

  const update = (patch) => setPiece((p) => ({ ...p, ...patch }));

  const wrapSelection = (before, after = before) => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || "text";
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    update({ body: next });
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = s + before.length;
      el.selectionEnd = s + before.length + selected.length;
    });
  };

  const insertLinePrefix = (prefix) => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: s, value } = el;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    update({ body: next });
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = s + prefix.length;
    });
  };

  const insertLink = () => {
    const url = window.prompt("Link URL");
    if (!url) return;
    wrapSelection("[", `](${url})`);
  };

  const insertImage = () => {
    const url = window.prompt("Image URL");
    if (!url) return;
    const el = textareaRef.current;
    const s = el ? el.selectionStart : piece.body.length;
    const next = piece.body.slice(0, s) + `\n![image](${url})\n` + piece.body.slice(s);
    update({ body: next });
  };

  const startNew = () => {
    setPiece(emptyDraft());
    setMode("write");
    setShowLibrary(false);
  };

  const openPiece = (p) => {
    setPiece(p);
    setMode("write");
    setShowLibrary(false);
  };

  const deletePiece = (id) => {
    const next = published.filter((p) => p.id !== id);
    setPublished(next);
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(next));
  };

  const publish = () => {
    if (!piece.body.trim()) return;
    const record = {
      ...piece,
      id: piece.id || `kt_${Date.now()}`,
      words,
      minutes,
      publishedAt: piece.publishedAt || new Date().toISOString(),
    };
    const withoutOld = published.filter((p) => p.id !== record.id);
    const next = [record, ...withoutOld];
    setPublished(next);
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(next));
    setPiece(record);
    setJustPublished(true);
    setTimeout(() => setJustPublished(false), 2200);
  };

  return (
    <div className="kt-root kt-write-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .kt-write-root {
          --ink: #17161c; --ink-2: #201f27; --paper: #f7f2e7; --paper-dim: #ede5d3;
          --paper-soft: #c9c0aa; --gold: #b8863b; --gold-bright: #d9a857;
          --wine: #6e2a35; --ink-soft: #5a5750; --line: rgba(184,134,59,0.28);
          font-family: 'Source Serif 4', Georgia, serif; background: var(--paper);
          color: var(--ink); min-height: 100vh; -webkit-font-smoothing: antialiased;
        }
        .kt-write-root * { box-sizing: border-box; }
        .kt-w-nav { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; border-bottom: 1px solid var(--line); position: sticky; top: 0; background: rgba(247,242,231,0.92); backdrop-filter: blur(8px); z-index: 20; }
        .kt-w-back { display: inline-flex; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; color: var(--ink-soft); font-family: 'Source Serif 4', serif; font-size: 15px; }
        .kt-w-back:hover { color: var(--ink); }
        .kt-w-logo { display: flex; align-items: center; gap: 8px; font-family: 'Fraunces', serif; font-weight: 600; font-size: 18px; }
        .kt-w-logo svg { color: var(--gold); width: 20px; height: 20px; }
        .kt-w-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .kt-w-btn { font-family: 'Source Serif 4', serif; font-size: 14px; padding: 9px 16px; border-radius: 3px; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; border: 1px solid var(--line); background: transparent; color: var(--ink); transition: all .25s ease; }
        .kt-w-btn:hover { border-color: var(--gold); color: var(--gold); }
        .kt-w-btn.solid { background: var(--ink); color: var(--paper); border-color: var(--ink); }
        .kt-w-btn.solid:hover { background: var(--wine); border-color: var(--wine); color: var(--paper); }
        .kt-w-btn.gold { background: var(--gold); color: var(--ink); border-color: var(--gold); }
        .kt-w-btn.gold:hover { background: var(--gold-bright); }

        .kt-w-wrap { max-width: 860px; margin: 0 auto; padding: 48px 28px 120px; }
        .kt-w-select { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; text-transform: uppercase; letter-spacing: .06em; background: var(--paper-dim); border: 1px solid var(--line); border-radius: 999px; padding: 8px 14px; color: var(--ink-soft); cursor: pointer; }

        .kt-w-toolbar { display: flex; align-items: center; gap: 4px; padding: 10px 4px; margin: 26px 0 18px; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
        .kt-w-toolbar button { border: none; background: none; padding: 8px; border-radius: 4px; cursor: pointer; color: var(--ink-soft); display: inline-flex; }
        .kt-w-toolbar button:hover { background: var(--paper-dim); color: var(--ink); }
        .kt-w-toolbar .sep { width: 1px; height: 20px; background: var(--line); margin: 0 6px; }

        .kt-w-title { width: 100%; border: none; outline: none; background: none; font-family: 'Fraunces', serif; font-weight: 500; font-size: clamp(28px,4vw,42px); color: var(--ink); margin-bottom: 10px; }
        .kt-w-title::placeholder { color: var(--paper-soft); }
        .kt-w-subtitle { width: 100%; border: none; outline: none; background: none; font-family: 'Source Serif 4', serif; font-style: italic; font-size: 18px; color: var(--ink-soft); margin-bottom: 6px; }
        .kt-w-subtitle::placeholder { color: var(--paper-soft); }

        .kt-w-textarea { width: 100%; min-height: 46vh; border: none; outline: none; background: none; resize: vertical; font-family: 'Source Serif 4', serif; font-size: 17px; line-height: 1.85; color: var(--ink); }
        .kt-w-textarea::placeholder { color: var(--paper-soft); }

        .kt-w-preview { font-family: 'Source Serif 4', serif; font-size: 17px; line-height: 1.85; color: var(--ink); }
        .kt-w-preview h1, .kt-w-preview h2, .kt-w-preview h3 { font-family: 'Fraunces', serif; font-weight: 500; }
        .kt-w-preview blockquote { border-left: 3px solid var(--gold); margin: 0; padding: 4px 0 4px 20px; color: var(--ink-soft); font-style: italic; }
        .kt-w-preview code { font-family: 'IBM Plex Mono', monospace; background: var(--paper-dim); padding: 2px 6px; border-radius: 3px; font-size: 15px; }
        .kt-w-preview pre code { display: block; padding: 16px; overflow-x: auto; }
        .kt-w-preview img { max-width: 100%; border-radius: 4px; }
        .kt-w-preview a { color: var(--wine); }

        .kt-w-footbar { position: sticky; bottom: 0; display: flex; justify-content: space-between; align-items: center; padding: 14px 4px; margin-top: 20px; border-top: 1px solid var(--line); background: var(--paper); font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-soft); flex-wrap: wrap; gap: 10px; }
        .kt-w-status { display: flex; align-items: center; gap: 8px; }
        .kt-w-status.ok { color: var(--wine); }

        .kt-w-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: min(400px, 92vw); background: var(--paper); border-left: 1px solid var(--line); z-index: 40; box-shadow: -30px 0 60px -30px rgba(23,22,28,0.4); display: flex; flex-direction: column; transform: translateX(0); transition: transform .35s cubic-bezier(.16,1,.3,1); }
        .kt-w-drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 22px; border-bottom: 1px solid var(--line); }
        .kt-w-drawer-head h3 { font-family: 'Fraunces', serif; font-size: 19px; margin: 0; }
        .kt-w-drawer-body { padding: 10px 14px; overflow-y: auto; flex: 1; }
        .kt-w-piece { padding: 14px 10px; border-bottom: 1px solid var(--line); cursor: pointer; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .kt-w-piece:hover { background: var(--paper-dim); }
        .kt-w-piece .t { font-family: 'Fraunces', serif; font-size: 15.5px; margin: 0 0 4px; }
        .kt-w-piece .m { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-soft); }
        .kt-w-piece button { border: none; background: none; color: var(--paper-soft); cursor: pointer; padding: 4px; }
        .kt-w-piece button:hover { color: var(--wine); }
        .kt-w-empty { padding: 40px 20px; text-align: center; color: var(--ink-soft); font-size: 14px; }
        .kt-w-scrim { position: fixed; inset: 0; background: rgba(23,22,28,0.35); z-index: 39; }
      `}</style>

      <nav className="kt-w-nav">
        <button className="kt-w-back" onClick={onBack}>
          <ArrowLeft size={16} /> Kitaaba
        </button>
        <div className="kt-w-logo"><Feather /> Write</div>
        <div className="kt-w-actions">
          <button className="kt-w-btn" onClick={() => setShowLibrary(true)}>
            <BookMarked size={15} /> My Writings ({published.length})
          </button>
          <button className="kt-w-btn" onClick={startNew}>New</button>
          <button className="kt-w-btn" onClick={() => setMode(mode === "write" ? "preview" : "write")}>
            {mode === "write" ? <><Eye size={15} /> Preview</> : <><PenLine size={15} /> Write</>}
          </button>
          <button className="kt-w-btn gold" onClick={publish}>
            {justPublished ? <><Check size={15} /> Published</> : "Publish"}
          </button>
        </div>
      </nav>

      <div className="kt-w-wrap">
        <select
          className="kt-w-select"
          value={piece.type}
          onChange={(e) => update({ type: e.target.value })}
        >
          {POST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        {mode === "write" && (
          <div className="kt-w-toolbar">
            <button onClick={() => wrapSelection("**")} title="Bold"><Bold size={17} /></button>
            <button onClick={() => wrapSelection("*")} title="Italic"><Italic size={17} /></button>
            <button onClick={() => insertLinePrefix("> ")} title="Quote"><Quote size={17} /></button>
            <button onClick={() => insertLinePrefix("- ")} title="List"><List size={17} /></button>
            <button onClick={() => wrapSelection("`")} title="Code"><Code2 size={17} /></button>
            <span className="sep" />
            <button onClick={insertLink} title="Link"><Link2 size={17} /></button>
            <button onClick={insertImage} title="Image"><ImageIcon size={17} /></button>
          </div>
        )}

        <input
          className="kt-w-title"
          placeholder="Untitled"
          value={piece.title}
          onChange={(e) => update({ title: e.target.value })}
        />
        <input
          className="kt-w-subtitle"
          placeholder="Add a subtitle (optional)"
          value={piece.subtitle}
          onChange={(e) => update({ subtitle: e.target.value })}
        />

        {mode === "write" ? (
          <textarea
            ref={textareaRef}
            className="kt-w-textarea"
            placeholder="Begin writing. Markdown works: **bold**, *italic*, > quote, - list, `code`, [links](url)…"
            value={piece.body}
            onChange={(e) => update({ body: e.target.value })}
          />
        ) : (
          <div
            className="kt-w-preview"
            style={{ minHeight: "46vh" }}
            dangerouslySetInnerHTML={{ __html: piece.body.trim() ? marked.parse(piece.body) : "<p style='color:var(--paper-soft)'>Nothing to preview yet.</p>" }}
          />
        )}

        <div className="kt-w-footbar">
          <span>{words} words · {minutes} min read</span>
          <span className={`kt-w-status ${justPublished ? "ok" : ""}`}>
            <Clock size={13} />
            {savedAt ? `Draft saved ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Not saved yet"}
          </span>
        </div>
      </div>

      {showLibrary && (
        <>
          <div className="kt-w-scrim" onClick={() => setShowLibrary(false)} />
          <div className="kt-w-drawer">
            <div className="kt-w-drawer-head">
              <h3>My Writings</h3>
              <button className="kt-w-back" onClick={() => setShowLibrary(false)}><X size={18} /></button>
            </div>
            <div className="kt-w-drawer-body">
              {published.length === 0 && (
                <div className="kt-w-empty">Nothing published yet — publish your first piece and it'll show up here.</div>
              )}
              {published.map((p) => (
                <div className="kt-w-piece" key={p.id} onClick={() => openPiece(p)}>
                  <div>
                    <p className="t">{p.title || "Untitled"}</p>
                    <p className="m">{p.type} · {p.words} words · {new Date(p.publishedAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deletePiece(p.id); }} title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
