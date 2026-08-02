import React, { useEffect, useRef, useState } from "react";
import {
  Feather, BookOpen, Search, Menu, X, ArrowRight, ArrowUpRight,
  Bold, Italic, Quote, List, Code2, Link2, Image as ImageIcon,
  Clock, BookMarked, Users, Award, Globe2, Sparkles
} from "lucide-react";

/* ---------------------------------------------------------
   Kitaaba — "Write. Be Read. Be Discovered."
   A calm, literary writing ecosystem. Not a social feed —
   a reading room. Design language borrows from bookbinding:
   spines, gilt edges, tables of contents, printed pages.
--------------------------------------------------------- */

const useReveal = () => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setShown(true)),
      { threshold: 0.14 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(22px)",
        transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}s, transform .8s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const ROMAN = ["I", "II", "III", "IV", "V"];

const STEPS = [
  { t: "Write your work", d: "Open the one universal editor. No templates to fight, no clutter to ignore." },
  { t: "Choose its type", d: "Novel, poem, script, essay, thought — thirty-odd forms, each read the way it deserves." },
  { t: "Publish", d: "One page, one action. No scheduling theatre, no engagement bait." },
  { t: "Kitaaba categorises it", d: "Genre, language, style and reading time are recorded automatically." },
  { t: "The right audience finds it", d: "Readers, editors and producers discover work by what it is, not who posted it." },
];

const MISSION = [
  "Students", "Poets", "Journalists", "Authors", "Script Writers",
  "Playwrights", "Bloggers", "Researchers", "Anyone with something to say",
];

const POST_TYPES = [
  "Thought", "Story", "Novel", "Poem", "Article", "Blog", "Diary", "Letter",
  "Essay", "Opinion", "Research", "Movie Script", "Short Film Script",
  "OTT Script", "Drama Script", "Street Play", "Speech", "Lyrics",
  "Children's Story", "Travel Writing", "Technology", "History", "Science",
  "Motivational", "Fiction", "Non-Fiction",
];

const PROFESSIONAL = [
  "Book Publisher", "Magazine Editor", "Newspaper Editor", "Film Producer",
  "OTT Producer", "Drama Producer", "Theatre Group", "Podcast Studio",
  "Radio Station", "Content Agency", "Production House", "Media Company",
];

const STATS = [
  { icon: BookMarked, label: "Total Writings", value: "142" },
  { icon: Users, label: "Reading Count", value: "8,340" },
  { icon: Clock, label: "Est. Reading Time", value: "6 min avg" },
  { icon: Award, label: "Editor's Selection", value: "3 badges" },
];

export default function Kitaaba({ onStartWriting = () => {} }) {
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="kt-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .kt-root {
          --ink: #17161c;
          --ink-2: #201f27;
          --paper: #f7f2e7;
          --paper-dim: #ede5d3;
          --paper-soft: #c9c0aa;
          --gold: #b8863b;
          --gold-bright: #d9a857;
          --wine: #6e2a35;
          --ink-soft: #5a5750;
          --line: rgba(184,134,59,0.28);
          font-family: 'Source Serif 4', Georgia, serif;
          background: var(--paper);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        .kt-root * { box-sizing: border-box; }
        .kt-serif-display { font-family: 'Fraunces', Georgia, serif; }
        .kt-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: .04em; }

        .kt-wrap { max-width: 1180px; margin: 0 auto; padding: 0 28px; }
        @media (max-width: 640px) { .kt-wrap { padding: 0 20px; } }

        /* spine motif — a gilt rule running down the page */
        .kt-spine {
          position: absolute; top: 0; bottom: 0; left: 46px; width: 1px;
          background: linear-gradient(to bottom, transparent, var(--line) 8%, var(--line) 92%, transparent);
          display: none;
        }
        @media (min-width: 1024px) { .kt-spine { display: block; } }

        /* NAV */
        .kt-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          transition: background .5s ease, border-color .5s ease, backdrop-filter .5s ease;
          border-bottom: 1px solid transparent;
        }
        .kt-nav.solid {
          background: rgba(247,242,231,0.86);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--line);
        }
        .kt-nav-inner { display: flex; align-items: center; justify-content: space-between; height: 76px; }
        .kt-logo { display: flex; align-items: center; gap: 10px; font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; letter-spacing: .01em; color: var(--ink); text-decoration: none; }
        .kt-logo-mark { width: 26px; height: 26px; color: var(--gold); }
        .kt-nav-links { display: none; align-items: center; gap: 40px; }
        @media (min-width: 900px) { .kt-nav-links { display: flex; } }
        .kt-nav-links a { color: var(--ink-soft); text-decoration: none; font-size: 15px; letter-spacing: .01em; position: relative; padding-bottom: 4px; transition: color .3s; }
        .kt-nav-links a:hover { color: var(--ink); }
        .kt-nav-links a::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform .35s ease; }
        .kt-nav-links a:hover::after { transform: scaleX(1); }
        .kt-nav-cta { display: none; }
        @media (min-width: 900px) { .kt-nav-cta { display: inline-flex; } }
        .kt-menu-btn { display: inline-flex; background: none; border: none; color: var(--ink); cursor: pointer; padding: 6px; }
        @media (min-width: 900px) { .kt-menu-btn { display: none; } }
        .kt-mobile-panel { background: var(--paper); border-bottom: 1px solid var(--line); padding: 8px 0 22px; }
        .kt-mobile-panel a { display: block; padding: 12px 0; color: var(--ink); text-decoration: none; font-size: 17px; border-bottom: 1px solid rgba(0,0,0,0.06); }

        /* BUTTONS */
        .kt-btn { font-family: 'Source Serif 4', serif; font-size: 15.5px; padding: 13px 26px; border-radius: 3px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .35s cubic-bezier(.16,1,.3,1); border: 1px solid transparent; text-decoration: none; white-space: nowrap; }
        .kt-btn-primary { background: var(--ink); color: var(--paper); }
        .kt-btn-primary:hover { background: var(--wine); transform: translateY(-1px); }
        .kt-btn-ghost { background: transparent; color: var(--ink); border-color: var(--ink); }
        .kt-btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
        .kt-btn-gold { background: var(--gold); color: var(--ink); }
        .kt-btn-gold:hover { background: var(--gold-bright); transform: translateY(-1px); }
        .kt-btn-on-ink { border-color: var(--paper-soft); color: var(--paper); }
        .kt-btn-on-ink:hover { border-color: var(--gold); color: var(--gold-bright); }

        /* HERO */
        .kt-hero { position: relative; padding: 170px 0 110px; overflow: hidden; }
        .kt-hero-grid { display: grid; grid-template-columns: 1fr; gap: 56px; align-items: center; }
        @media (min-width: 980px) { .kt-hero-grid { grid-template-columns: 1.05fr 0.85fr; gap: 40px; } }
        .kt-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--wine); display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
        .kt-eyebrow::before { content: ''; width: 22px; height: 1px; background: var(--wine); }
        .kt-hero h1 { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-weight: 500; font-size: clamp(40px, 6vw, 74px); line-height: 1.04; letter-spacing: -0.01em; margin: 0 0 26px; }
        .kt-hero h1 em { font-style: italic; font-weight: 400; color: var(--wine); }
        .kt-hero p.lead { font-size: 19px; line-height: 1.65; color: var(--ink-soft); max-width: 52ch; margin: 0 0 38px; }
        .kt-hero-actions { display: flex; flex-wrap: wrap; gap: 16px; }

        /* hero page-fan illustration */
        .kt-fan { position: relative; height: 420px; display: flex; align-items: center; justify-content: center; }
        .kt-page { position: absolute; width: 250px; height: 340px; background: var(--paper-dim); border: 1px solid var(--line); border-radius: 2px; box-shadow: 0 24px 60px -20px rgba(23,22,28,0.35); padding: 26px 24px; }
        .kt-page .rule { height: 1px; background: rgba(23,22,28,0.1); margin: 10px 0; }
        .kt-page .rule.short { width: 60%; }
        .kt-page-a { transform: rotate(-9deg) translateX(-64px); z-index: 1; opacity: .82; }
        .kt-page-b { transform: rotate(4deg) translateX(58px); z-index: 2; opacity: .92; }
        .kt-page-c { transform: rotate(-2deg); z-index: 3; background: var(--paper); }
        .kt-page-c .cap { font-family: 'Fraunces', serif; font-size: 15px; color: var(--wine); margin-bottom: 14px; }

        /* PHILOSOPHY STRIP */
        .kt-strip { background: var(--ink); color: var(--paper); padding: 54px 0; overflow: hidden; }
        .kt-strip-track { display: flex; gap: 46px; white-space: nowrap; animation: kt-scroll 34s linear infinite; }
        .kt-strip span { font-family: 'Fraunces', serif; font-style: italic; font-weight: 400; font-size: clamp(24px, 3.4vw, 40px); color: var(--paper-soft); display: flex; align-items: center; gap: 46px; }
        .kt-strip span b { font-style: normal; font-weight: 500; color: var(--gold-bright); }
        .kt-strip .dot { color: var(--wine); font-style: normal; }
        @keyframes kt-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* SECTION generic */
        .kt-section { padding: 118px 0; position: relative; }
        .kt-section.on-ink { background: var(--ink); color: var(--paper); }
        .kt-head { max-width: 620px; margin-bottom: 64px; }
        .kt-kicker { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
        .kt-section.on-ink .kt-kicker { color: var(--gold-bright); }
        .kt-head h2 { font-family: 'Fraunces', serif; font-weight: 500; font-size: clamp(30px, 4vw, 46px); line-height: 1.12; margin: 0 0 18px; letter-spacing: -0.01em; }
        .kt-head p { font-size: 17px; line-height: 1.7; color: var(--ink-soft); }
        .kt-section.on-ink .kt-head p { color: var(--paper-soft); }

        /* MISSION cards — library catalog */
        .kt-catalog { display: grid; grid-template-columns: repeat(2,1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); }
        @media (min-width: 700px) { .kt-catalog { grid-template-columns: repeat(3,1fr); } }
        .kt-catalog-card { background: var(--paper); padding: 26px 22px; min-height: 108px; display: flex; flex-direction: column; justify-content: space-between; transition: background .3s ease; }
        .kt-catalog-card:hover { background: var(--paper-dim); }
        .kt-catalog-num { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--paper-soft); }
        .kt-catalog-card span.name { font-family: 'Fraunces', serif; font-size: 18px; margin-top: 14px; }

        /* HOW IT WORKS — table of contents */
        .kt-toc { border-top: 1px solid var(--line); }
        .kt-toc-row { display: grid; grid-template-columns: 56px 1fr auto; align-items: baseline; gap: 18px; padding: 30px 0; border-bottom: 1px solid var(--line); cursor: default; }
        .kt-toc-num { font-family: 'Fraunces', serif; font-style: italic; font-size: 22px; color: var(--gold); }
        .kt-toc-title { font-family: 'Fraunces', serif; font-size: clamp(20px,2.6vw,28px); font-weight: 500; display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; }
        .kt-toc-leader { flex: 1; border-bottom: 1px dotted var(--paper-soft); min-width: 40px; height: 1px; margin-bottom: 6px; opacity: .6; }
        .kt-toc-desc { font-size: 15px; color: var(--ink-soft); max-width: 42ch; font-family: 'Source Serif 4', serif; }
        .kt-toc-page { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--paper-soft); }

        /* EDITOR mockup */
        .kt-editor { background: var(--paper); border: 1px solid var(--line); border-radius: 6px; box-shadow: 0 40px 90px -40px rgba(23,22,28,0.45); overflow: hidden; }
        .kt-editor-bar { display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-bottom: 1px solid var(--line); background: var(--paper-dim); flex-wrap: wrap; }
        .kt-editor-bar .grp { display: flex; gap: 12px; color: var(--ink-soft); }
        .kt-editor-bar .grp svg { width: 16px; height: 16px; }
        .kt-editor-bar .sep { width: 1px; height: 18px; background: var(--line); }
        .kt-editor-body { padding: 40px 44px; }
        .kt-editor-body .kt-etitle { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 500; margin: 0 0 10px; }
        .kt-editor-body .kt-esub { color: var(--ink-soft); font-style: italic; margin: 0 0 22px; font-size: 16px; }
        .kt-editor-body p { font-size: 16px; line-height: 1.85; color: var(--ink); margin: 0 0 16px; }
        .kt-editor-foot { display: flex; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--line); font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-soft); }

        /* SHELF — post types */
        .kt-shelf { display: flex; flex-wrap: wrap; gap: 10px; }
        .kt-tag { font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 9px 16px; border: 1px solid var(--line); border-radius: 999px; color: var(--ink-soft); transition: all .3s ease; }
        .kt-tag:hover { border-color: var(--gold); color: var(--ink); background: var(--paper-dim); }

        /* comparison ribbon */
        .kt-compare { display: grid; grid-template-columns: 1fr; gap: 1px; background: var(--line); border: 1px solid var(--line); }
        @media (min-width: 800px) { .kt-compare { grid-template-columns: 1fr 1fr; } }
        .kt-compare-col { background: var(--ink); padding: 44px 40px; }
        .kt-compare-col.paper-col { background: var(--paper); }
        .kt-compare-col h3 { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; margin: 0 0 22px; color: var(--paper-soft); }
        .kt-compare-col.paper-col h3 { color: var(--wine); }
        .kt-compare-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
        .kt-compare-col li { font-size: 16px; display: flex; align-items: center; gap: 12px; color: var(--paper-soft); }
        .kt-compare-col.paper-col li { color: var(--ink); }
        .kt-compare-col li .dash { width: 14px; height: 1px; background: var(--paper-soft); flex-shrink: 0; }
        .kt-compare-col.paper-col li .dash { background: var(--gold); }

        /* stats */
        .kt-stats { display: grid; grid-template-columns: repeat(2,1fr); gap: 28px; }
        @media (min-width: 700px) { .kt-stats { grid-template-columns: repeat(4,1fr); } }
        .kt-stat { padding: 22px 0; border-top: 1px solid var(--line); }
        .kt-stat svg { width: 18px; height: 18px; color: var(--gold-bright); margin-bottom: 14px; }
        .kt-stat .v { font-family: 'Fraunces', serif; font-size: 26px; }
        .kt-stat .l { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--paper-soft); margin-top: 4px; }

        /* author + discovery cards */
        .kt-two { display: grid; grid-template-columns: 1fr; gap: 28px; }
        @media (min-width: 860px) { .kt-two { grid-template-columns: 1fr 1fr; } }
        .kt-card { background: var(--paper); border: 1px solid var(--line); border-radius: 6px; padding: 38px; }
        .kt-author-top { display: flex; gap: 18px; align-items: center; margin-bottom: 22px; }
        .kt-avatar { width: 58px; height: 58px; border-radius: 50%; background: linear-gradient(135deg, var(--wine), var(--ink)); display: flex; align-items: center; justify-content: center; color: var(--gold-bright); font-family: 'Fraunces', serif; font-size: 22px; flex-shrink: 0; }
        .kt-author-name { font-family: 'Fraunces', serif; font-size: 21px; margin: 0; }
        .kt-author-pen { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-soft); margin-top: 2px; }
        .kt-chiprow { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0 22px; }
        .kt-chip { font-size: 12.5px; font-family: 'IBM Plex Mono', monospace; padding: 5px 12px; border: 1px solid var(--line); border-radius: 999px; color: var(--ink-soft); }

        .kt-search-mock { display: flex; align-items: center; gap: 10px; background: var(--paper-dim); border: 1px solid var(--line); border-radius: 999px; padding: 12px 18px; margin-bottom: 22px; }
        .kt-search-mock input { border: none; background: none; outline: none; font-family: 'Source Serif 4', serif; font-size: 15px; color: var(--ink); width: 100%; }
        .kt-search-mock svg { width: 16px; height: 16px; color: var(--ink-soft); flex-shrink: 0; }
        .kt-filter-row { display: flex; flex-wrap: wrap; gap: 8px; }

        /* professional grid */
        .kt-prof-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); margin-top: 26px; }
        @media (min-width: 760px) { .kt-prof-grid { grid-template-columns: repeat(4,1fr); } }
        .kt-prof-cell { background: var(--ink-2); color: var(--paper-soft); padding: 20px 18px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; text-align: center; transition: color .3s; }
        .kt-prof-cell:hover { color: var(--gold-bright); }

        /* home preview — book covers */
        .kt-covers { display: grid; grid-template-columns: repeat(2,1fr); gap: 22px; }
        @media (min-width: 700px) { .kt-covers { grid-template-columns: repeat(4,1fr); } }
        .kt-cover { aspect-ratio: 3/4.3; border-radius: 4px; padding: 20px 18px; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: 0 18px 40px -18px rgba(23,22,28,0.4); transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .kt-cover:hover { transform: translateY(-8px); }
        .kt-cover .badge { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; opacity: .85; }
        .kt-cover .ctitle { font-family: 'Fraunces', serif; font-size: 19px; line-height: 1.2; }
        .kt-cover .cauthor { font-family: 'IBM Plex Mono', monospace; font-size: 11px; opacity: .8; }
        .kt-cover.c1 { background: linear-gradient(160deg, #6e2a35, #4a1c24); color: var(--paper); }
        .kt-cover.c2 { background: linear-gradient(160deg, #2f4a43, #1c2f2a); color: var(--paper); }
        .kt-cover.c3 { background: linear-gradient(160deg, #3a3220, #1e1a10); color: var(--paper); }
        .kt-cover.c4 { background: linear-gradient(160deg, #b8863b, #8c621f); color: var(--ink); }

        /* footer */
        .kt-footer { background: var(--ink); color: var(--paper-soft); padding: 70px 0 34px; }
        .kt-footer-top { display: grid; grid-template-columns: 1.4fr repeat(3, 1fr); gap: 40px; padding-bottom: 50px; border-bottom: 1px solid rgba(247,242,231,0.14); }
        @media (max-width: 760px) { .kt-footer-top { grid-template-columns: 1fr 1fr; } }
        .kt-footer-brand { font-family: 'Fraunces', serif; font-size: 22px; color: var(--paper); margin-bottom: 14px; }
        .kt-footer-tag { font-size: 14.5px; line-height: 1.7; max-width: 32ch; color: var(--paper-soft); }
        .kt-footer h4 { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--paper); margin: 0 0 16px; }
        .kt-footer ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 11px; }
        .kt-footer a { color: var(--paper-soft); text-decoration: none; font-size: 14.5px; transition: color .3s; }
        .kt-footer a:hover { color: var(--gold-bright); }
        .kt-footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 26px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; flex-wrap: wrap; gap: 12px; }

        .kt-vrule { width: 1px; height: 46px; background: var(--line); margin: 0 auto 20px; }
      `}</style>

      {/* NAV */}
      <nav className={`kt-nav ${navSolid ? "solid" : ""}`}>
        <div className="kt-wrap kt-nav-inner">
          <a href="#top" className="kt-logo">
            <Feather className="kt-logo-mark" strokeWidth={1.5} />
            Kitaaba
          </a>
          <div className="kt-nav-links">
            <a href="#mission">Mission</a>
            <a href="#how">How it works</a>
            <a href="#editor-preview">The Editor</a>
            <a href="#discover">Discovery</a>
            <a href="#professional">For Professionals</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={onStartWriting} className="kt-btn kt-btn-primary kt-nav-cta">
              Start Writing <ArrowRight size={15} />
            </button>
            <button className="kt-menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="kt-mobile-panel kt-wrap">
            <a href="#mission" onClick={() => setMenuOpen(false)}>Mission</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#editor-preview" onClick={() => setMenuOpen(false)}>The Editor</a>
            <a href="#discover" onClick={() => setMenuOpen(false)}>Discovery</a>
            <a href="#professional" onClick={() => setMenuOpen(false)}>For Professionals</a>
          </div>
        )}
      </nav>

      <div id="top" className="kt-spine" />

      {/* HERO */}
      <header className="kt-hero">
        <div className="kt-wrap kt-hero-grid">
          <div>
            <div className="kt-eyebrow">A Creative Writing Ecosystem</div>
            <h1>
              Every thought<br />deserves <em>a place.</em>
            </h1>
            <p className="lead">
              Kitaaba is where anyone can write — from a fleeting thought to a finished
              novel, a poem to a screenplay — and let the right reader find it. No feeds.
              No follower counts. Just writing, and the people looking for exactly this.
            </p>
            <div className="kt-hero-actions">
              <button onClick={onStartWriting} className="kt-btn kt-btn-primary">Start Writing <ArrowRight size={16} /></button>
              <a href="#discover" className="kt-btn kt-btn-ghost">Explore Writings</a>
            </div>
          </div>
          <div className="kt-fan" aria-hidden="true">
            <div className="kt-page kt-page-a">
              <div className="rule" /><div className="rule" /><div className="rule short" />
              <div className="rule" style={{ marginTop: 24 }} /><div className="rule" /><div className="rule short" />
            </div>
            <div className="kt-page kt-page-b">
              <div className="rule" /><div className="rule short" />
              <div className="rule" style={{ marginTop: 24 }} /><div className="rule" /><div className="rule" /><div className="rule short" />
            </div>
            <div className="kt-page kt-page-c">
              <div className="cap">Chapter One</div>
              <div className="rule" /><div className="rule" /><div className="rule short" />
              <div className="rule" style={{ marginTop: 22 }} /><div className="rule" /><div className="rule" /><div className="rule short" />
            </div>
          </div>
        </div>
      </header>

      {/* PHILOSOPHY STRIP */}
      <div className="kt-strip">
        <div className="kt-strip-track">
          {Array(2).fill(0).map((_, i) => (
            <span key={i}>
              <b>Write.</b> <span className="dot">·</span> Be Read. <span className="dot">·</span> Be Discovered.
              <span className="dot">·</span>
              <b>Write.</b> <span className="dot">·</span> Be Read. <span className="dot">·</span> Be Discovered.
              <span className="dot">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* MISSION */}
      <section className="kt-section" id="mission">
        <div className="kt-wrap">
          <Reveal>
            <div className="kt-head">
              <div className="kt-kicker">Who Kitaaba Is For</div>
              <h2>Not an audience. A readership.</h2>
              <p>
                Kitaaba exists for anyone who writes and anyone who wants their writing found —
                without performing for an algorithm to be seen.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="kt-catalog">
              {MISSION.map((m, i) => (
                <div className="kt-catalog-card" key={m}>
                  <span className="kt-catalog-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="name">{m}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS — table of contents */}
      <section className="kt-section on-ink" id="how">
        <div className="kt-wrap">
          <Reveal>
            <div className="kt-head">
              <div className="kt-kicker">Contents</div>
              <h2>Five steps, no performance.</h2>
              <p>From a blank page to the right reader's hands — nothing in between demands your attention.</p>
            </div>
          </Reveal>
          <div className="kt-toc">
            {STEPS.map((s, i) => (
              <Reveal delay={i * 0.06} key={s.t}>
                <div className="kt-toc-row">
                  <span className="kt-toc-num">{ROMAN[i]}</span>
                  <span className="kt-toc-title">
                    {s.t}
                    <span className="kt-toc-leader" />
                  </span>
                  <span className="kt-toc-desc">{s.d}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE EDITOR */}
      <section className="kt-section" id="editor-preview">
        <div className="kt-wrap">
          <Reveal>
            <div className="kt-head">
              <div className="kt-kicker">One Editor, Every Form</div>
              <h2>Distraction-free, by design.</h2>
              <p>
                Every writer — novelist or diarist — writes in the same calm space. Titles,
                rich text, images and code blocks, quotes and links, drafts saved quietly as you go.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="kt-editor">
              <div className="kt-editor-bar">
                <div className="grp"><Bold /><Italic /><Quote /></div>
                <div className="sep" />
                <div className="grp"><List /><Code2 /><Link2 /><ImageIcon /></div>
                <div className="sep" />
                <span className="kt-mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>Type: Short Story</span>
              </div>
              <div className="kt-editor-body">
                <p className="kt-etitle">The Monsoon Ledger</p>
                <p className="kt-esub">a short story, still in draft</p>
                <p>
                  Rains came to Surat the way old debts do — quietly, then all at once. Aarav
                  kept the accounts open on the windowsill, watching the ink blur at the edges
                  where the paper had grown soft with damp.
                </p>
                <p>
                  He had written the first line seven times. This was the eighth, and the first
                  he intended to keep.
                </p>
              </div>
              <div className="kt-editor-foot">
                <span>412 words</span>
                <span>2 min read</span>
                <span>Draft saved 4s ago</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SHELF — post types */}
      <section className="kt-section" style={{ paddingTop: 0 }}>
        <div className="kt-wrap">
          <Reveal>
            <div className="kt-head" style={{ marginBottom: 40 }}>
              <div className="kt-kicker">The Shelf</div>
              <h2>Every form has a home here.</h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="kt-shelf">
              {POST_TYPES.map((p) => <span className="kt-tag" key={p}>{p}</span>)}
              <span className="kt-tag">+ more, always expanding</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* NOT SOCIAL MEDIA — comparison */}
      <section className="kt-section on-ink">
        <div className="kt-wrap">
          <Reveal>
            <div className="kt-head">
              <div className="kt-kicker">What We Left Out, On Purpose</div>
              <h2>No popularity contest. Just the work.</h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="kt-compare">
              <div className="kt-compare-col">
                <h3>What Kitaaba will never have</h3>
                <ul>
                  <li><span className="dash" />Like or dislike buttons</li>
                  <li><span className="dash" />Reaction emoji</li>
                  <li><span className="dash" />Follower counts</li>
                  <li><span className="dash" />Popularity scores</li>
                  <li><span className="dash" />Trending or viral feeds</li>
                </ul>
              </div>
              <div className="kt-compare-col paper-col">
                <h3>What we show instead</h3>
                <ul>
                  <li><span className="dash" />Contribution count</li>
                  <li><span className="dash" />Total writings published</li>
                  <li><span className="dash" />Reading count</li>
                  <li><span className="dash" />Published since</li>
                  <li><span className="dash" />Editor's Selection badge</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AUTHOR + DISCOVERY */}
      <section className="kt-section" id="discover">
        <div className="kt-wrap">
          <Reveal>
            <div className="kt-head">
              <div className="kt-kicker">Author &amp; Discovery</div>
              <h2>Findable by craft, not clout.</h2>
              <p>Readers search by genre, language and style. Writers are known by what they've made.</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="kt-two">
              <div className="kt-card">
                <div className="kt-author-top">
                  <div className="kt-avatar">R</div>
                  <div>
                    <p className="kt-author-name">Rhea Kapadia</p>
                    <p className="kt-author-pen">pen name — Rhea K.</p>
                  </div>
                </div>
                <div className="kt-chiprow">
                  <span className="kt-chip">Gujarati, English</span>
                  <span className="kt-chip">Poetry</span>
                  <span className="kt-chip">Travel Writing</span>
                </div>
                <div className="kt-stats">
                  {STATS.map((s) => (
                    <div className="kt-stat" key={s.label} style={{ borderColor: "var(--line)" }}>
                      <s.icon style={{ color: "var(--wine)" }} />
                      <div className="v" style={{ color: "var(--ink)" }}>{s.value}</div>
                      <div className="l" style={{ color: "var(--ink-soft)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="kt-card">
                <p className="kt-kicker" style={{ marginBottom: 18 }}>Global Search</p>
                <div className="kt-search-mock">
                  <Search />
                  <input readOnly value="monsoon poetry, Gujarati, under 5 min" />
                </div>
                <div className="kt-filter-row">
                  <span className="kt-tag">Genre</span>
                  <span className="kt-tag">Language</span>
                  <span className="kt-tag">Writing Type</span>
                  <span className="kt-tag">Target Audience</span>
                  <span className="kt-tag">Length</span>
                  <span className="kt-tag">Date</span>
                </div>
                <p style={{ marginTop: 24, fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
                  Every published piece carries its own metadata — genre, topic, language,
                  reading time, keywords and style — recorded automatically, ready for
                  discovery from day one.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROFESSIONAL */}
      <section className="kt-section on-ink" id="professional">
        <div className="kt-wrap">
          <Reveal>
            <div className="kt-head">
              <div className="kt-kicker">Professional Discovery</div>
              <h2>Where publishers come looking.</h2>
              <p>
                Publishers, editors, producers and studios register as professional accounts
                and search a dashboard of writing sorted by exactly what they need — never the other way around.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="kt-prof-grid">
              {PROFESSIONAL.map((p) => <div className="kt-prof-cell" key={p}>{p}</div>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOME PREVIEW — book covers */}
      <section className="kt-section">
        <div className="kt-wrap">
          <Reveal>
            <div className="kt-head">
              <div className="kt-kicker">On Kitaaba Today</div>
              <h2>Editor's picks, this week.</h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="kt-covers">
              <div className="kt-cover c1">
                <span className="badge">Poem · Gujarati</span>
                <div><div className="ctitle">Letters to the Tapi</div><div className="cauthor">Rhea K.</div></div>
              </div>
              <div className="kt-cover c2">
                <span className="badge">Essay · English</span>
                <div><div className="ctitle">On Slow Cities</div><div className="cauthor">Devraj M.</div></div>
              </div>
              <div className="kt-cover c3">
                <span className="badge">Script · Hindi</span>
                <div><div className="ctitle">Teesri Ghanti</div><div className="cauthor">Anaya S.</div></div>
              </div>
              <div className="kt-cover c4">
                <span className="badge">Novel Excerpt</span>
                <div><div className="ctitle">The Last Ledger</div><div className="cauthor">Farhan Q.</div></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="kt-section on-ink" style={{ textAlign: "center", paddingBottom: 130 }}>
        <div className="kt-wrap">
          <Reveal>
            <div className="kt-vrule" />
            <Sparkles style={{ color: "var(--gold-bright)", margin: "0 auto 22px" }} size={22} />
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: "clamp(28px,4vw,44px)", margin: "0 0 20px" }}>
              Your page is waiting.
            </h2>
            <p style={{ color: "var(--paper-soft)", maxWidth: 480, margin: "0 auto 36px", fontSize: 16.5, lineHeight: 1.7 }}>
              No feed to perform for. No follower count to chase. Just the page, and whoever needs to read it.
            </p>
            <button onClick={onStartWriting} className="kt-btn kt-btn-gold">Start Writing <ArrowUpRight size={16} /></button>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="kt-footer">
        <div className="kt-wrap">
          <div className="kt-footer-top">
            <div>
              <div className="kt-footer-brand">Kitaaba</div>
              <p className="kt-footer-tag">A creative writing ecosystem. Write. Be read. Be discovered.</p>
            </div>
            <div>
              <h4>Kitaaba</h4>
              <ul><li><a href="#mission">About Kitaaba</a></li><li><a href="#mission">Mission</a></li><li><a href="#">Careers</a></li></ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li></ul>
            </div>
            <div>
              <h4>Connect</h4>
              <ul><li><a href="#">Contact</a></li><li><a href="#professional">For Publishers</a></li></ul>
            </div>
          </div>
          <div className="kt-footer-bottom">
            <span><Globe2 size={12} style={{ verticalAlign: -2, marginRight: 6 }} />Kitaaba, a reading room for every writer</span>
            <span>© {new Date().getFullYear()} Kitaaba</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
