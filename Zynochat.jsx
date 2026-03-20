import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ──────────────────────────────────────────────
const T = {
  purple: "#3B0764",
  purpleMid: "#581C87",
  purpleLight: "#7C3AED",
  accent: "#A855F7",
  accentSoft: "#E9D5FF",
  pink: "#EC4899",
  bg: "#F5F3FF",
  card: "#FFFFFF",
  border: "#EDE9FE",
  text: "#1E1033",
  muted: "#6B7280",
  mutedLight: "#9CA3AF",
  online: "#10B981",
  danger: "#EF4444",
  warn: "#F59E0B",
  success: "#10B981",
};

const styles = {
  root: {
    fontFamily: "'Outfit', 'DM Sans', sans-serif",
    background: T.bg,
    minHeight: "100vh",
    maxWidth: 430,
    margin: "0 auto",
    position: "relative",
    overflowX: "hidden",
    color: T.text,
  },
};

// ─── MOCK DATA ───────────────────────────────────────────────────
const CHATS = [
  { id: 1, name: "Aryan Sharma", username: "aryansharma", avatar: "AS", type: "personal", lastMsg: "Hey! Are you free tonight?", time: "10:42", unread: 3, online: true, pinned: true },
  { id: 2, name: "Design Team", username: "designteam", avatar: "DT", type: "group", lastMsg: "New Figma file shared", time: "09:15", unread: 12, online: false, members: 24 },
  { id: 3, name: "Zynochat Updates", username: "zyno_updates", avatar: "ZU", type: "channel", lastMsg: "🚀 v2.1.0 Released! Check it out", time: "Yesterday", unread: 1, online: false },
  { id: 4, name: "Priya Kapoor", username: "priyakapoor", avatar: "PK", type: "personal", lastMsg: "Sent a photo", time: "Yesterday", unread: 0, online: true },
  { id: 5, name: "Zyno AI Bot", username: "zynoai", avatar: "🤖", type: "bot", lastMsg: "How can I help you?", time: "Mon", unread: 0, online: true },
  { id: 6, name: "React Devs India", username: "reactdevsin", avatar: "RD", type: "group", lastMsg: "Anyone using Next.js 15?", time: "Mon", unread: 47, online: false, members: 1240 },
  { id: 7, name: "Crypto Signals", username: "cryptosig", avatar: "CS", type: "channel", lastMsg: "BTC looking bullish 📈", time: "Sun", unread: 0, online: false },
  { id: 8, name: "Rahul Mehta", username: "rahulmehta", avatar: "RM", type: "personal", lastMsg: "Thanks bro! 🙏", time: "Sun", unread: 0, online: false },
];

const MESSAGES = [
  { id: 1, from: "other", text: "Hey! What's up?", time: "10:30", read: true },
  { id: 2, from: "me", text: "All good! Working on the Zynochat project 🔥", time: "10:31", read: true },
  { id: 3, from: "other", text: "Oh nice! How's it going?", time: "10:32", read: true },
  { id: 4, from: "me", text: "Really well. The UI is coming out super clean", time: "10:35", read: true },
  { id: 5, from: "other", text: "Can't wait to see it! Send screenshots when done 😄", time: "10:38", read: true },
  { id: 6, from: "other", text: "Hey! Are you free tonight?", time: "10:42", read: false },
];

const AI_SUGGESTIONS = [
  "Write a cover letter for me",
  "Explain quantum computing simply",
  "Plan a 7-day workout routine",
  "Summarize this article",
  "Help me debug my code",
  "Draft a professional email",
];

const CHANNELS_SEARCH = [
  { id: 1, name: "Zynochat Updates", username: "zyno_updates", avatar: "ZU", type: "channel", desc: "Official Zynochat announcements", members: "125K", verified: true },
  { id: 2, name: "Tech Insider", username: "techinsider", avatar: "TI", type: "channel", desc: "Daily tech news and reviews", members: "89K", verified: false },
  { id: 3, name: "Design Vault", username: "designvault", avatar: "DV", type: "channel", desc: "UI/UX inspiration daily", members: "44K", verified: false },
];
const GROUPS_SEARCH = [
  { id: 4, name: "React Devs India", username: "reactdevsin", avatar: "RD", type: "group", desc: "React.js developers community", members: "1.2K", verified: false },
  { id: 5, name: "Design Team", username: "designteam", avatar: "DT", type: "group", desc: "Our internal design discussions", members: "24", verified: false },
  { id: 6, name: "Startup Hub", username: "startuphub", avatar: "SH", type: "group", desc: "Founders and builders network", members: "3.4K", verified: false },
];
const BOTS_SEARCH = [
  { id: 7, name: "Zyno AI Bot", username: "zynoai", avatar: "🤖", type: "bot", desc: "Your AI-powered assistant", members: "250K", verified: true },
  { id: 8, name: "News Bot", username: "newsbot", avatar: "📰", type: "bot", desc: "Latest news delivered to you", members: "78K", verified: false },
];

const ADMIN_USERS = [
  { id: 1, name: "Aryan Sharma", username: "aryansharma", email: "aryan@mail.com", status: "active", joined: "Jan 12, 2025", reports: 0 },
  { id: 2, name: "Priya Kapoor", username: "priyakapoor", email: "priya@mail.com", status: "active", joined: "Feb 3, 2025", reports: 1 },
  { id: 3, name: "Spam Account", username: "spam123", email: "spam@fake.com", status: "banned", joined: "Mar 1, 2025", reports: 14 },
  { id: 4, name: "Rahul Mehta", username: "rahulmehta", email: "rahul@mail.com", status: "suspended", joined: "Mar 5, 2025", reports: 3 },
];

const HELP_TICKETS = [
  { id: "TKT-001", user: "Aryan Sharma", title: "Can't login", category: "Login issue", status: "open", time: "2h ago" },
  { id: "TKT-002", user: "Priya Kapoor", title: "Message not delivered", category: "Chat issue", status: "pending", time: "5h ago" },
  { id: "TKT-003", user: "Rahul Mehta", title: "Payment failed", category: "Payment issue", status: "resolved", time: "1d ago" },
];

// ─── ICONS ───────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    back: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    checkcheck: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/><polyline points="16 6 8 14"/></svg>,
    pin: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    ai: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    help: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    megaphone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
    flag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    channel: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    attach: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
    mic: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    camera: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    more: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
    verified: <svg width={size} height={size} viewBox="0 0 24 24" fill={T.accent} stroke="none"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.58L18 8.5l-8 8z"/></svg>,
    admin: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    palette: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  };
  return icons[name] || null;
};

// ─── AVATAR ───────────────────────────────────────────────────────
const Avatar = ({ label = "?", size = 44, color, online = false, onClick }) => {
  const colors = [T.purpleLight, T.accent, T.pink, "#06B6D4", "#F59E0B", "#10B981", T.purple];
  const idx = label.charCodeAt(0) % colors.length;
  const bg = color || colors[idx];
  const isEmoji = label.length <= 2 && /\p{Emoji}/u.test(label);
  return (
    <div onClick={onClick} style={{ position: "relative", display: "inline-block", cursor: onClick ? "pointer" : "default", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: isEmoji ? size * 0.5 : size * 0.36, fontWeight: 700, color: "#fff",
        userSelect: "none", flexShrink: 0,
      }}>{label.slice(0, isEmoji ? 2 : 2)}</div>
      {online && <span style={{ position: "absolute", bottom: 2, right: 2, width: size * 0.22, height: size * 0.22, background: T.online, borderRadius: "50%", border: "2px solid #fff" }} />}
    </div>
  );
};

// ─── BADGE ────────────────────────────────────────────────────────
const Badge = ({ count, color = T.accent }) => count > 0 ? (
  <span style={{ background: color, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700, minWidth: 20, textAlign: "center" }}>
    {count > 99 ? "99+" : count}
  </span>
) : null;

// ─── BUTTON ───────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "solid", size = "md", disabled = false, full = false, icon, style: s = {} }) => {
  const base = { borderRadius: 50, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, border: "none", fontFamily: "inherit", transition: "all 0.18s", opacity: disabled ? 0.55 : 1, width: full ? "100%" : "auto", ...s };
  const sizes = { sm: { padding: "8px 16px", fontSize: 13 }, md: { padding: "12px 24px", fontSize: 15 }, lg: { padding: "16px 32px", fontSize: 16 } };
  const variants = {
    solid: { background: `linear-gradient(135deg, ${T.purpleMid}, ${T.purpleLight})`, color: "#fff", boxShadow: "0 4px 15px rgba(124,58,237,0.35)" },
    outline: { background: "transparent", color: T.purpleLight, border: `2px solid ${T.purpleLight}` },
    ghost: { background: "transparent", color: T.muted, border: "none" },
    danger: { background: T.danger, color: "#fff" },
    soft: { background: T.accentSoft, color: T.purpleLight },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
};

// ─── INPUT ────────────────────────────────────────────────────────
const Input = ({ placeholder, value, onChange, type = "text", icon, style: s = {}, onKeyDown, autoFocus, maxLength }) => (
  <div style={{ position: "relative" }}>
    {icon && <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.mutedLight }}><Icon name={icon} size={16} /></div>}
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange} autoFocus={autoFocus}
      onKeyDown={onKeyDown} maxLength={maxLength}
      style={{
        width: "100%", padding: icon ? "13px 14px 13px 42px" : "13px 18px", borderRadius: 50,
        border: `1.5px solid ${T.border}`, background: "#fff", fontSize: 15, fontFamily: "inherit",
        color: T.text, outline: "none", boxSizing: "border-box", transition: "border 0.2s",
        ...s
      }}
      onFocus={e => e.target.style.borderColor = T.accent}
      onBlur={e => e.target.style.borderColor = T.border}
    />
  </div>
);

// ─── CARD ────────────────────────────────────────────────────────
const Card = ({ children, style: s = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: T.card, borderRadius: 16, border: `1px solid ${T.border}`,
    boxShadow: "0 2px 12px rgba(59,7,100,0.06)", padding: 16,
    cursor: onClick ? "pointer" : "default", ...s
  }}>{children}</div>
);

// ─── TOGGLE ──────────────────────────────────────────────────────
const Toggle = ({ on, onToggle }) => (
  <div onClick={onToggle} style={{
    width: 46, height: 26, borderRadius: 13, background: on ? T.purpleLight : "#E5E7EB",
    position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0
  }}>
    <div style={{
      position: "absolute", top: 3, left: on ? 23 : 3, width: 20, height: 20,
      background: "#fff", borderRadius: "50%", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
    }} />
  </div>
);

// ─── HEADER ──────────────────────────────────────────────────────
const Header = ({ title, onBack, rightAction, user }) => (
  <div style={{
    background: `linear-gradient(135deg, ${T.purple}, ${T.purpleMid})`,
    padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(59,7,100,0.3)"
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {onBack && (
        <div onClick={onBack} style={{ cursor: "pointer", color: "#fff", display: "flex" }}>
          <Icon name="back" size={22} color="#fff" />
        </div>
      )}
      <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
        {title || "Zyno"}
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {rightAction}
      {!onBack && user && (
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)",
          border: "2px dashed rgba(255,255,255,0.4)", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer",
          overflow: "hidden"
        }}>
          {user.name ? user.name.slice(0, 2).toUpperCase() : "ME"}
        </div>
      )}
    </div>
  </div>
);

// ─── BOTTOM NAV ──────────────────────────────────────────────────
const BottomNav = ({ active, onChange }) => {
  const tabs = [
    { key: "home", icon: "home", label: "Home" },
    { key: "chats", icon: "chat", label: "Chats" },
    { key: "search", icon: "search", label: "Search" },
    { key: "profile", icon: "user", label: "Profile" },
    { key: "settings", icon: "settings", label: "Settings" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, background: "#fff", borderTop: `1px solid ${T.border}`,
      display: "flex", padding: "8px 0 12px", zIndex: 200,
      boxShadow: "0 -4px 20px rgba(59,7,100,0.08)"
    }}>
      {tabs.map(t => (
        <div key={t.key} onClick={() => onChange(t.key)} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          cursor: "pointer", padding: "4px 0", transition: "all 0.2s"
        }}>
          <div style={{
            padding: "6px 14px", borderRadius: 20,
            background: active === t.key ? T.accentSoft : "transparent",
            transition: "background 0.2s"
          }}>
            <Icon name={t.icon} size={20} color={active === t.key ? T.purpleLight : T.mutedLight} />
          </div>
          <span style={{ fontSize: 10, fontWeight: active === t.key ? 700 : 500, color: active === t.key ? T.purpleLight : T.mutedLight }}>
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── TYPE BADGE ──────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const map = { channel: { bg: "#EEF2FF", color: "#6366F1", label: "Channel" }, group: { bg: "#F0FDF4", color: "#16A34A", label: "Group" }, bot: { bg: "#FFF7ED", color: "#EA580C", label: "Bot" }, personal: { bg: "#F5F3FF", color: T.purpleLight, label: "Personal" } };
  const s = map[type] || map.personal;
  return <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>{s.label}</span>;
};

// ═══════════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════════

// ─── SCREEN: Email Login ──────────────────────────────────────────
const LoginScreen = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!email.includes("@")) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext(email); }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(135deg, ${T.purple}, ${T.purpleMid})`, padding: "16px 20px" }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>Zyno</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", gap: 40 }}>
        <div style={{ width: 140, height: 140, borderRadius: 32, border: `2.5px dashed ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 40 }}>💬</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: 1 }}>ZYNOCHAT</span>
        </div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 800, color: T.text }}>Sign In</h2>
            <p style={{ margin: 0, fontSize: 14, color: T.muted }}>Enter your email to receive an OTP</p>
          </div>
          <Input placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} type="email" icon="user" onKeyDown={e => e.key === "Enter" && handleSend()} autoFocus />
          <Btn full onClick={handleSend} disabled={loading || !email.includes("@")}>
            {loading ? "Sending..." : "Send OTP"}
          </Btn>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.muted, fontSize: 13 }}>
          <Icon name="shield" size={14} color={T.mutedLight} />
          <span style={{ fontWeight: 600 }}>End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN: OTP Verification ─────────────────────────────────────
const OTPScreen = ({ email, onVerify, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const refs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setTimer(v => v > 0 ? v - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleKey = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (!val && i > 0) refs.current[i - 1]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits"); return; }
    setLoading(true); setError("");
    setTimeout(() => { setLoading(false); onVerify(); }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(135deg, ${T.purple}, ${T.purpleMid})`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div onClick={onBack} style={{ cursor: "pointer", color: "#fff" }}><Icon name="back" size={22} color="#fff" /></div>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>Zyno</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", gap: 40 }}>
        <div style={{ width: 110, height: 110, borderRadius: "50%", border: `2px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>
          🔐
        </div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: T.text }}>Enter OTP</h2>
            <p style={{ margin: 0, fontSize: 13, color: T.muted }}>We sent a 6-digit code to <strong>{email}</strong></p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {otp.map((d, i) => (
              <input key={i} ref={el => refs.current[i] = el} maxLength={1} value={d} onChange={e => handleKey(i, e.target.value)}
                style={{
                  width: 46, height: 56, textAlign: "center", fontSize: 22, fontWeight: 700, borderRadius: 12,
                  border: `2px solid ${d ? T.accent : T.border}`, background: d ? T.accentSoft : "#fff",
                  outline: "none", fontFamily: "inherit", color: T.text, transition: "all 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = T.accent}
                onBlur={e => e.target.style.borderColor = d ? T.accent : T.border}
              />
            ))}
          </div>
          {error && <p style={{ margin: 0, color: T.danger, fontSize: 13 }}>{error}</p>}
          <Btn full onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Btn>
          <div style={{ fontSize: 13, color: timer > 0 ? T.muted : T.purpleLight, cursor: timer === 0 ? "pointer" : "default", fontWeight: timer === 0 ? 700 : 400 }}
            onClick={() => timer === 0 && setTimer(120)}>
            {timer > 0 ? `Resend OTP in ${fmt(timer)}` : "Resend OTP"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.muted, fontSize: 13 }}>
          <Icon name="shield" size={14} color={T.mutedLight} />
          <span style={{ fontWeight: 600 }}>End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN: Registration ─────────────────────────────────────────
const RegisterScreen = ({ email, onDone }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = () => {
    if (!name || !username) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onDone({ name, username, email, bio, gender, dob }); }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(135deg, ${T.purple}, ${T.purpleMid})`, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>Zyno</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Step {step}/2</span>
        </div>
        <div style={{ marginTop: 12, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${(step / 2) * 100}%`, background: "#fff", borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>
      <div style={{ flex: 1, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
        {step === 1 ? (
          <>
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: T.text }}>Create Your Profile</h2>
              <p style={{ margin: 0, fontSize: 14, color: T.muted }}>Tell us about yourself</p>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: `linear-gradient(135deg, ${T.purpleMid}, ${T.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, cursor: "pointer" }}>
                {name ? name.slice(0, 1).toUpperCase() : "👤"}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.5 }}>FULL NAME *</label>
                <Input placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.5 }}>USERNAME *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: T.accent, fontWeight: 700, fontSize: 15 }}>@</span>
                  <input placeholder="unique_username" value={username} onChange={e => setUsername(e.target.value.replace(/[^a-z0-9_]/g, "").toLowerCase())}
                    style={{ width: "100%", padding: "13px 18px 13px 34px", borderRadius: 50, border: `1.5px solid ${T.border}`, fontSize: 15, fontFamily: "inherit", color: T.text, outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = T.accent}
                    onBlur={e => e.target.style.borderColor = T.border}
                  />
                </div>
                {username && <p style={{ margin: "4px 0 0 8px", fontSize: 12, color: T.success }}>✓ zynochat.app/u/{username}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.5 }}>BIO</label>
                <textarea placeholder="Write something about yourself..." value={bio} onChange={e => setBio(e.target.value)} maxLength={150}
                  style={{ width: "100%", padding: "13px 18px", borderRadius: 16, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", color: T.text, outline: "none", resize: "none", height: 80, boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
                <p style={{ margin: "2px 8px 0", fontSize: 11, color: T.mutedLight }}>{bio.length}/150</p>
              </div>
            </div>
            <Btn full onClick={() => name && username && setStep(2)} disabled={!name || !username}>Continue</Btn>
          </>
        ) : (
          <>
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: T.text }}>Additional Info</h2>
              <p style={{ margin: 0, fontSize: 14, color: T.muted }}>Optional but helps personalize your experience</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.5 }}>GENDER</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Male", "Female", "Other", "Prefer not to say"].map(g => (
                    <div key={g} onClick={() => setGender(g)} style={{
                      flex: 1, padding: "10px 6px", borderRadius: 12, border: `2px solid ${gender === g ? T.accent : T.border}`,
                      background: gender === g ? T.accentSoft : "#fff", textAlign: "center", cursor: "pointer",
                      fontSize: 11, fontWeight: 600, color: gender === g ? T.purpleLight : T.muted, transition: "all 0.2s"
                    }}>{g}</div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.5 }}>DATE OF BIRTH</label>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                  style={{ width: "100%", padding: "13px 18px", borderRadius: 50, border: `1.5px solid ${T.border}`, fontSize: 15, fontFamily: "inherit", color: dob ? T.text : T.mutedLight, outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.5 }}>EMAIL</label>
                <Input placeholder="Email" value={email} style={{ background: "#F9F9F9" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn onClick={() => setStep(1)} variant="outline" style={{ flex: 1 }}>Back</Btn>
              <Btn onClick={handleFinish} disabled={loading} style={{ flex: 2 }}>{loading ? "Creating..." : "Join Zynochat 🚀"}</Btn>
            </div>
            <p style={{ textAlign: "center", fontSize: 12, color: T.muted, margin: 0 }}>
              By joining, you agree to our <span style={{ color: T.purpleLight, fontWeight: 700 }}>Terms</span> &amp; <span style={{ color: T.purpleLight, fontWeight: 700 }}>Privacy Policy</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ─── SCREEN: Home ─────────────────────────────────────────────────
const HomeScreen = ({ user, navigate }) => {
  const shortcuts = [
    { key: "help", icon: "help", label: "#help", desc: "Get support", color: "#6366F1" },
    { key: "support", icon: "chat", label: "#support chat", desc: "Community", color: "#10B981" },
    { key: "ai", icon: "ai", label: "#ai", desc: "AI assistant", color: "#F59E0B" },
    { key: "update", icon: "megaphone", label: "#update channel", desc: "Latest news", color: "#EC4899" },
    { key: "report", icon: "flag", label: "#report", desc: "Report user", color: "#EF4444" },
  ];

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header user={user} rightAction={
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="bell" size={18} color="#fff" />
          </div>
          {user.isAdmin && (
            <div onClick={() => navigate("admin")} style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="admin" size={18} color="#fff" />
            </div>
          )}
        </div>
      } />

      <div style={{ padding: "16px 16px 0" }}>
        {/* Banner */}
        <div style={{
          background: `linear-gradient(135deg, ${T.purpleMid} 0%, ${T.accent} 60%, ${T.pink} 100%)`,
          borderRadius: 20, padding: "20px 22px", marginBottom: 20, position: "relative", overflow: "hidden",
          boxShadow: "0 8px 30px rgba(124,58,237,0.3)"
        }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", right: 20, bottom: -30, width: 80, height: 80, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>FEATURED</span>
            <h3 style={{ margin: "6px 0 8px", fontSize: 20, fontWeight: 800, color: "#fff" }}>Zynochat Premium 🌟</h3>
            <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>Unlock exclusive features, remove ads, and get priority support.</p>
            <Btn size="sm" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", backdropFilter: "blur(10px)" }}>Learn More</Btn>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: T.text }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {shortcuts.map(s => (
              <div key={s.key} onClick={() => navigate(s.key)} style={{
                background: "#fff", borderRadius: 16, padding: "14px 16px",
                border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 14,
                cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(59,7,100,0.05)"
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.15)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(59,7,100,0.05)"}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={s.icon} size={20} color={s.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: T.text }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: T.muted }}>{s.desc}</p>
                </div>
                <Icon name="back" size={16} color={T.mutedLight} style={{ transform: "rotate(180deg)" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: T.text }}>Recent Activity</h3>
          {CHATS.slice(0, 3).map(c => (
            <div key={c.id} onClick={() => navigate("chat", c)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: `1px solid ${T.border}`, cursor: "pointer"
            }}>
              <Avatar label={c.avatar} size={40} online={c.online} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: T.text }}>{c.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>{c.lastMsg}</p>
              </div>
              <span style={{ fontSize: 11, color: T.mutedLight }}>{c.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN: Chats ────────────────────────────────────────────────
const ChatsScreen = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const tabs = ["all", "personal", "groups", "channels", "bots"];

  const filtered = CHATS.filter(c => {
    const matchTab = activeTab === "all" || c.type === activeTab.slice(0, -1) || (activeTab === "groups" && c.type === "group") || (activeTab === "channels" && c.type === "channel") || (activeTab === "bots" && c.type === "bot");
    const matchSearch = c.name.toLowerCase().includes(searchQ.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Chats" rightAction={
        <div onClick={() => setShowCreate(true)} style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="plus" size={20} color="#fff" />
        </div>
      } />

      <div style={{ padding: "12px 16px 0" }}>
        <Input placeholder="Search chats..." value={searchQ} onChange={e => setSearchQ(e.target.value)} icon="search" style={{ borderRadius: 14 }} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", padding: "12px 16px", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
        {tabs.map(t => (
          <div key={t} onClick={() => setActiveTab(t)} style={{
            padding: "7px 16px", borderRadius: 20, whiteSpace: "nowrap", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: activeTab === t ? T.purpleLight : "#fff", color: activeTab === t ? "#fff" : T.muted,
            border: `1px solid ${activeTab === t ? T.purpleLight : T.border}`, transition: "all 0.2s", flexShrink: 0,
            textTransform: "capitalize"
          }}>{t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}</div>
        ))}
        <div onClick={() => setShowCreate(true)} style={{
          padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600,
          background: "#fff", color: T.purpleLight, border: `1px solid ${T.border}`, flexShrink: 0
        }}>+</div>
      </div>

      {/* Chat List */}
      <div>
        {filtered.map(c => (
          <div key={c.id} onClick={() => navigate("chat", c)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
            borderBottom: `1px solid ${T.border}`, cursor: "pointer", background: "#fff",
            transition: "background 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = T.bg}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            <div style={{ position: "relative" }}>
              <Avatar label={c.avatar} size={50} online={c.online} />
              {c.pinned && <div style={{ position: "absolute", top: -2, right: -2, background: T.accent, borderRadius: "50%", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="pin" size={8} color="#fff" /></div>}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{c.name}</span>
                  {(c.type === "channel" || c.type === "bot") && <Icon name="verified" size={14} />}
                </div>
                <span style={{ fontSize: 11, color: T.mutedLight }}>{c.time}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ margin: 0, fontSize: 13, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{c.lastMsg}</p>
                <Badge count={c.unread} />
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: T.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <p style={{ fontWeight: 600 }}>No chats found</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowCreate(false)}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "24px 20px", width: "100%", maxWidth: 430 }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 20px" }} />
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800 }}>Create New</h3>
            {[
              { icon: "user", label: "New Personal Chat", color: T.purpleLight },
              { icon: "users", label: "New Group", color: "#10B981" },
              { icon: "megaphone", label: "New Channel", color: "#F59E0B" },
              { icon: "ai", label: "New Bot", color: "#EC4899" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 4px", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={item.icon} size={20} color={item.color} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SCREEN: Chat Conversation ────────────────────────────────────
const ChatConvoScreen = ({ chat, onBack, user }) => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMsg = () => {
    if (!msg.trim()) return;
    const newMsg = { id: Date.now(), from: "me", text: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false };
    setMessages(m => [...m, newMsg]);
    setMsg("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: Date.now() + 1, from: "other", text: "Got it! 😊 Will reply soon.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false }]);
    }, 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: T.bg }}>
      {/* Chat Header */}
      <div style={{ background: `linear-gradient(135deg, ${T.purple}, ${T.purpleMid})`, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 20px rgba(59,7,100,0.3)" }}>
        <div onClick={onBack} style={{ cursor: "pointer", color: "#fff", flexShrink: 0 }}><Icon name="back" size={22} color="#fff" /></div>
        <Avatar label={chat.avatar} size={40} online={chat.online} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#fff" }}>{chat.name}</p>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            {typing ? "typing..." : chat.online ? "online" : chat.members ? `${chat.members} members` : "last seen recently"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 34, height: 34, background: "rgba(255,255,255,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="search" size={16} color="#fff" />
          </div>
          <div style={{ width: 34, height: 34, background: "rgba(255,255,255,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="more" size={16} color="#fff" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <span style={{ background: "rgba(0,0,0,0.08)", borderRadius: 10, padding: "4px 12px", fontSize: 12, color: T.muted, fontWeight: 600 }}>Today</span>
        </div>
        {messages.map(m => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 6 }}>
            {m.from !== "me" && <Avatar label={chat.avatar} size={28} />}
            <div style={{
              maxWidth: "75%", padding: "10px 14px", borderRadius: m.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.from === "me" ? `linear-gradient(135deg, ${T.purpleMid}, ${T.purpleLight})` : "#fff",
              color: m.from === "me" ? "#fff" : T.text, fontSize: 14, lineHeight: 1.5,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <p style={{ margin: "0 0 4px" }}>{m.text}</p>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 10, opacity: 0.7 }}>{m.time}</span>
                {m.from === "me" && <Icon name="checkcheck" size={12} color={m.read ? T.accent : "rgba(255,255,255,0.6)"} />}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar label={chat.avatar} size={28} />
            <div style={{ background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, background: T.mutedLight, borderRadius: "50%", animation: `bounce 1s infinite ${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "10px 16px 24px", background: "#fff", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Icon name="attach" size={18} color={T.muted} />
        </div>
        <div style={{ flex: 1, background: T.bg, borderRadius: 24, display: "flex", alignItems: "center" }}>
          <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Message..." onKeyDown={e => e.key === "Enter" && sendMsg()}
            style={{ flex: 1, background: "none", border: "none", outline: "none", padding: "11px 16px", fontSize: 14, fontFamily: "inherit", color: T.text }}
          />
          <div style={{ paddingRight: 8, cursor: "pointer" }}>
            <Icon name="mic" size={18} color={T.muted} />
          </div>
        </div>
        <div onClick={sendMsg} style={{ width: 42, height: 42, borderRadius: "50%", background: msg ? `linear-gradient(135deg, ${T.purpleMid}, ${T.purpleLight})` : T.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.2s", boxShadow: msg ? "0 4px 12px rgba(124,58,237,0.35)" : "none" }}>
          <Icon name="send" size={18} color={msg ? "#fff" : T.mutedLight} />
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </div>
  );
};

// ─── SCREEN: Search ───────────────────────────────────────────────
const SearchScreen = ({ navigate }) => {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const searched = q.length > 0;

  const resultGroups = [
    { label: "Channels", data: CHANNELS_SEARCH, icon: "megaphone", color: "#F59E0B" },
    { label: "Groups", data: GROUPS_SEARCH, icon: "users", color: "#10B981" },
    { label: "Bots", data: BOTS_SEARCH, icon: "ai", color: "#EC4899" },
  ];

  const trending = ["#zynochat", "#reactjs", "#design", "#crypto", "#india"];

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Discover" />
      <div style={{ padding: "16px 16px 0" }}>
        <Input placeholder="Search channels, groups, bots..." value={q} onChange={e => setQ(e.target.value)} icon="search" style={{ borderRadius: 14, fontSize: 14 }} autoFocus={false} />
      </div>

      {!searched ? (
        <div style={{ padding: "20px 16px" }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: T.text }}>🔥 Trending</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {trending.map(t => (
                <div key={t} onClick={() => setQ(t.slice(1))} style={{ padding: "7px 14px", background: T.accentSoft, borderRadius: 20, fontSize: 13, fontWeight: 600, color: T.purpleLight, cursor: "pointer" }}>{t}</div>
              ))}
            </div>
          </div>
          {resultGroups.map(g => (
            <div key={g.label} style={{ marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: T.text }}>{g.label}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {g.data.slice(0, 2).map(item => (
                  <Card key={item.id} onClick={() => {}} style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar label={item.avatar} size={46} />
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</span>
                          {item.verified && <Icon name="verified" size={14} />}
                        </div>
                        <p style={{ margin: "2px 0", fontSize: 12, color: T.muted }}>@{item.username} · {item.members} members</p>
                        <p style={{ margin: 0, fontSize: 12, color: T.mutedLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</p>
                      </div>
                      <Btn size="sm" variant="outline">Join</Btn>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "16px 16px" }}>
          {resultGroups.map(g => {
            const filtered = g.data.filter(item => item.name.toLowerCase().includes(q.toLowerCase()) || item.username.includes(q.toLowerCase()));
            if (!filtered.length) return null;
            return (
              <div key={g.label} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: g.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={g.icon} size={14} color={g.color} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{g.label}</span>
                </div>
                {filtered.map(item => (
                  <Card key={item.id} style={{ padding: "12px 14px", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar label={item.avatar} size={46} />
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</span>
                          {item.verified && <Icon name="verified" size={14} />}
                        </div>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: T.muted }}>@{item.username} · {item.members} members</p>
                      </div>
                      <Btn size="sm" variant="outline">Join</Btn>
                    </div>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── SCREEN: Profile ──────────────────────────────────────────────
const ProfileScreen = ({ user, navigate }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const posts = [
    { id: 1, text: "Just launched my new project! 🚀 #webdev #zynochat", time: "2h ago", likes: 24 },
    { id: 2, text: "Beautiful sunset today 🌅", time: "1d ago", likes: 56 },
    { id: 3, text: "Exploring new design patterns in React. Loving the component model!", time: "3d ago", likes: 18 },
  ];

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Cover & Avatar */}
      <div style={{ position: "relative" }}>
        <div style={{ height: 150, background: `linear-gradient(135deg, ${T.purple}, ${T.accent}, ${T.pink})` }} />
        <div style={{ position: "absolute", bottom: -50, left: 20 }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: `linear-gradient(135deg, ${T.purpleMid}, ${T.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#fff", border: "4px solid #fff", boxShadow: "0 4px 20px rgba(59,7,100,0.3)" }}>
            {user.name ? user.name.slice(0, 1) : "?"}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: -50, right: 20, display: "flex", gap: 8 }}>
          <div style={{ width: 38, height: 38, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", cursor: "pointer" }}>
            <Icon name="edit" size={17} color={T.purpleLight} />
          </div>
          <div style={{ width: 38, height: 38, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", cursor: "pointer" }}>
            <Icon name="more" size={17} color={T.muted} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 60, padding: "0 20px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: T.text }}>{user.name || "Your Name"}</h2>
        <p style={{ margin: "0 0 8px", fontSize: 14, color: T.purpleLight, fontWeight: 600 }}>@{user.username || "username"}</p>
        {user.bio && <p style={{ margin: "0 0 12px", fontSize: 14, color: T.muted, lineHeight: 1.6 }}>{user.bio}</p>}

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div style={{ padding: "4px 12px", background: T.accentSoft, borderRadius: 20, fontSize: 12, fontWeight: 600, color: T.purpleLight }}>
            🔐 Joined 2025
          </div>
          {user.location && <div style={{ padding: "4px 12px", background: "#F0FDF4", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#16A34A" }}>📍 {user.location}</div>}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 0, background: "#fff", borderRadius: 16, border: `1px solid ${T.border}`, marginBottom: 20, overflow: "hidden" }}>
          {[["124", "Posts"], ["1.2K", "Followers"], ["348", "Following"]].map(([val, lab]) => (
            <div key={lab} style={{ flex: 1, textAlign: "center", padding: "14px 8px", borderRight: `1px solid ${T.border}` }}>
              <p style={{ margin: "0 0 2px", fontSize: 18, fontWeight: 800, color: T.text }}>{val}</p>
              <p style={{ margin: 0, fontSize: 12, color: T.muted }}>{lab}</p>
            </div>
          ))}
        </div>

        {/* Stories */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: T.muted, letterSpacing: 0.5 }}>STORIES</h3>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ textAlign: "center", cursor: "pointer" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${T.accent}`, padding: 2, marginBottom: 6 }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `linear-gradient(135deg, ${T.purpleMid}, ${T.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🌅</div>
              </div>
              <span style={{ fontSize: 11, color: T.muted }}>Today</span>
            </div>
            <div style={{ textAlign: "center", cursor: "pointer" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${T.border}`, padding: 2, marginBottom: 6 }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏙️</div>
              </div>
              <span style={{ fontSize: 11, color: T.muted }}>Yesterday</span>
            </div>
            <div style={{ textAlign: "center", cursor: "pointer" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid T.border`, padding: 2, marginBottom: 6, borderColor: T.border }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="plus" size={22} color={T.mutedLight} />
                </div>
              </div>
              <span style={{ fontSize: 11, color: T.muted }}>Add</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: T.bg, borderRadius: 12, padding: 4 }}>
          {["posts", "media"].map(t => (
            <div key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, textAlign: "center", padding: "8px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13, background: activeTab === t ? "#fff" : "transparent", color: activeTab === t ? T.purpleLight : T.muted, transition: "all 0.2s", boxShadow: activeTab === t ? "0 2px 8px rgba(0,0,0,0.06)" : "none", textTransform: "capitalize" }}>
              {t}
            </div>
          ))}
        </div>

        {/* Posts */}
        {activeTab === "posts" && posts.map(post => (
          <Card key={post.id} style={{ marginBottom: 12 }}>
            <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.6, color: T.text }}>{post.text}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: T.mutedLight }}>{post.time}</span>
              <div style={{ display: "flex", gap: 16 }}>
                <span style={{ fontSize: 13, color: T.muted, cursor: "pointer" }}>❤️ {post.likes}</span>
                <span style={{ fontSize: 13, color: T.muted, cursor: "pointer" }}>💬 Reply</span>
              </div>
            </div>
          </Card>
        ))}

        {activeTab === "media" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
            {[..."🌅🏙️🎨🌊🎭🌺"].split("").map((emoji, i) => (
              <div key={i} style={{ aspectRatio: "1", background: `hsl(${260 + i * 20}, 60%, ${88 - i * 3}%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, borderRadius: 8, cursor: "pointer" }}>{emoji}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SCREEN: Settings ─────────────────────────────────────────────
const SettingsScreen = ({ user, onLogout, navigate }) => {
  const [toggles, setToggles] = useState({ notifications: true, stories: false, lastSeen: true, twoFA: false, readReceipts: true, darkMode: false });
  const toggle = k => setToggles(v => ({ ...v, [k]: !v[k] }));

  const sections = [
    {
      title: "Account", items: [
        { icon: "user", label: "Edit Profile", action: () => {} },
        { icon: "lock", label: "Change Password", action: () => {} },
        { icon: "shield", label: "Two-Factor Auth", toggle: "twoFA", badge: toggles.twoFA ? "ON" : "OFF" },
      ]
    },
    {
      title: "Privacy", items: [
        { icon: "eye", label: "Who can see profile", value: "Everyone" },
        { icon: "chat", label: "Who can message me", value: "Contacts" },
        { icon: "users", label: "Who can add to groups", value: "Everyone" },
        { icon: "eye", label: "Last seen visibility", toggle: "lastSeen" },
        { icon: "checkcheck", label: "Read receipts", toggle: "readReceipts" },
      ]
    },
    {
      title: "Notifications", items: [
        { icon: "bell", label: "Message notifications", toggle: "notifications" },
        { icon: "channel", label: "Channel updates", value: "Enabled" },
      ]
    },
    {
      title: "Appearance", items: [
        { icon: "palette", label: "Dark mode", toggle: "darkMode" },
      ]
    },
    {
      title: "Support", items: [
        { icon: "help", label: "Help & Support", action: () => navigate("help") },
        { icon: "flag", label: "Report a Problem", action: () => navigate("report") },
        { icon: "info", label: "About Zynochat", action: () => {} },
      ]
    },
  ];

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Settings" user={user} />
      {/* Profile Card */}
      <div style={{ padding: 16 }}>
        <Card onClick={() => navigate("profile")} style={{ padding: 16, marginBottom: 4, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${T.purpleMid}, ${T.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff" }}>
              {user.name ? user.name.slice(0, 1) : "?"}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 2px", fontWeight: 800, fontSize: 17, color: T.text }}>{user.name || "Your Name"}</p>
              <p style={{ margin: "0 0 2px", fontSize: 13, color: T.purpleLight, fontWeight: 600 }}>@{user.username || "username"}</p>
              <p style={{ margin: 0, fontSize: 12, color: T.muted }}>{user.bio || "Add a bio..."}</p>
            </div>
            <Icon name="back" size={18} color={T.mutedLight} style={{ transform: "rotate(180deg)" }} />
          </div>
        </Card>
      </div>

      {sections.map(sec => (
        <div key={sec.title} style={{ padding: "0 16px 4px" }}>
          <p style={{ margin: "8px 4px", fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: 0.8 }}>{sec.title.toUpperCase()}</p>
          <Card style={{ padding: 0 }}>
            {sec.items.map((item, idx) => (
              <div key={item.label} onClick={item.action} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                borderBottom: idx < sec.items.length - 1 ? `1px solid ${T.border}` : "none",
                cursor: item.action ? "pointer" : "default"
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={item.icon} size={17} color={T.purpleLight} />
                </div>
                <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: T.text }}>{item.label}</span>
                {item.toggle && <Toggle on={toggles[item.toggle]} onToggle={() => toggle(item.toggle)} />}
                {item.value && <span style={{ fontSize: 13, color: T.muted }}>{item.value}</span>}
                {item.badge && <span style={{ fontSize: 11, fontWeight: 700, color: toggles[item.toggle] ? T.success : T.muted, background: toggles[item.toggle] ? "#DCFCE7" : "#F3F4F6", padding: "2px 8px", borderRadius: 6 }}>{item.badge}</span>}
                {item.action && <Icon name="back" size={14} color={T.mutedLight} style={{ transform: "rotate(180deg)" }} />}
              </div>
            ))}
          </Card>
        </div>
      ))}

      <div style={{ padding: "16px" }}>
        <Btn full variant="outline" onClick={onLogout} icon="logout" style={{ color: T.danger, borderColor: T.danger }}>Log Out</Btn>
      </div>
    </div>
  );
};

// ─── SCREEN: AI Assistant ─────────────────────────────────────────
const AIScreen = ({ onBack }) => {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "Hi! I'm Zyno AI 🤖 Powered by advanced language models. How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const sendMsg = async (text) => {
    const q = text || input;
    if (!q.trim()) return;
    setInput(""); setShowSuggestions(false);
    setMsgs(m => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [
            { role: "user", content: `You are Zyno AI, a helpful assistant inside Zynochat messaging app. Be friendly, concise, and helpful. User asks: ${q}` }
          ]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that.";
      setMsgs(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "I'm having trouble connecting right now. Please try again!" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: T.bg }}>
      <div style={{ background: `linear-gradient(135deg, ${T.purple}, ${T.purpleMid})`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color="#fff" /></div>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#fff" }}>Zyno AI</p>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Always online</p>
        </div>
        <div style={{ marginLeft: "auto", cursor: "pointer" }} onClick={() => { setMsgs([{ role: "assistant", content: "Chat cleared! How can I help you?" }]); setShowSuggestions(true); }}>
          <Icon name="trash" size={18} color="rgba(255,255,255,0.7)" />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.purpleMid}, ${T.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
            )}
            <div style={{
              maxWidth: "80%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role === "user" ? `linear-gradient(135deg, ${T.purpleMid}, ${T.purpleLight})` : "#fff",
              color: m.role === "user" ? "#fff" : T.text, fontSize: 14, lineHeight: 1.6,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)", whiteSpace: "pre-wrap"
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.purpleMid}, ${T.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, background: T.accent, borderRadius: "50%", animation: `bounce 1s infinite ${i * 0.2}s` }} />)}
            </div>
          </div>
        )}
        {showSuggestions && (
          <div style={{ marginTop: 8 }}>
            <p style={{ fontSize: 12, color: T.muted, marginBottom: 10, fontWeight: 600 }}>Try asking:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AI_SUGGESTIONS.map(s => (
                <div key={s} onClick={() => sendMsg(s)} style={{ padding: "8px 14px", background: "#fff", border: `1px solid ${T.border}`, borderRadius: 20, fontSize: 13, cursor: "pointer", color: T.text, fontWeight: 500, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>{s}</div>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "10px 16px 24px", background: "#fff", borderTop: `1px solid ${T.border}`, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ flex: 1, background: T.bg, borderRadius: 24, display: "flex", alignItems: "center" }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask Zyno AI anything..." onKeyDown={e => e.key === "Enter" && !loading && sendMsg()}
            style={{ flex: 1, background: "none", border: "none", outline: "none", padding: "12px 16px", fontSize: 14, fontFamily: "inherit", color: T.text }}
          />
        </div>
        <div onClick={() => !loading && sendMsg()} style={{ width: 44, height: 44, borderRadius: "50%", background: input ? `linear-gradient(135deg, ${T.purpleMid}, ${T.accent})` : T.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
          <Icon name="send" size={18} color={input ? "#fff" : T.mutedLight} />
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </div>
  );
};

// ─── SCREEN: Help ─────────────────────────────────────────────────
const HelpScreen = ({ onBack }) => {
  const [form, setForm] = useState({ title: "", category: "", desc: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const cats = ["Login issue", "Chat issue", "Payment issue", "Report issue", "Account issue", "Other"];

  const submit = () => {
    if (!form.title || !form.category) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Header title="Help & Support" onBack={onBack} />
      <div style={{ padding: 16 }}>
        {/* Tickets */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: T.text }}>My Tickets</h3>
          {HELP_TICKETS.slice(0, 2).map(t => (
            <Card key={t.id} style={{ marginBottom: 8, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{t.id}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 10, background: t.status === "resolved" ? "#DCFCE7" : t.status === "open" ? "#EEF2FF" : "#FFF7ED", color: t.status === "resolved" ? T.success : t.status === "open" ? T.purpleLight : T.warn }}>{t.status}</span>
              </div>
              <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14, color: T.text }}>{t.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: T.muted }}>{t.category} · {t.time}</p>
            </Card>
          ))}
        </div>

        {submitted ? (
          <Card style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 50, marginBottom: 16 }}>✅</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Ticket Submitted!</h3>
            <p style={{ margin: "0 0 20px", color: T.muted, fontSize: 14 }}>We'll get back to you within 24 hours. Ticket ID: <strong>TKT-{Date.now().toString().slice(-3)}</strong></p>
            <Btn onClick={() => setSubmitted(false)} variant="outline">Submit Another</Btn>
          </Card>
        ) : (
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Submit a Ticket</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.5 }}>ISSUE TITLE *</label>
                <Input placeholder="Briefly describe your issue" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 8, letterSpacing: 0.5 }}>CATEGORY *</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {cats.map(c => (
                    <div key={c} onClick={() => setForm(f => ({ ...f, category: c }))} style={{ padding: "7px 14px", borderRadius: 20, border: `2px solid ${form.category === c ? T.accent : T.border}`, background: form.category === c ? T.accentSoft : "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: form.category === c ? T.purpleLight : T.muted, transition: "all 0.2s" }}>{c}</div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.5 }}>DESCRIPTION</label>
                <textarea placeholder="Describe the issue in detail..." value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", color: T.text, outline: "none", resize: "none", height: 100, boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
              </div>
              <Btn full onClick={submit} disabled={!form.title || !form.category || loading}>{loading ? "Submitting..." : "Submit Ticket"}</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// ─── SCREEN: Report ───────────────────────────────────────────────
const ReportScreen = ({ onBack }) => {
  const [target, setTarget] = useState("");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reasons = ["Spam", "Abuse / Harassment", "Impersonation", "Scam / Fraud", "Inappropriate content", "Fake account", "Other"];

  const submit = () => {
    if (!target || !reason) return;
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Header title="Report User" onBack={onBack} />
      <div style={{ padding: 16 }}>
        {submitted ? (
          <Card style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 50, marginBottom: 16 }}>🛡️</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: T.text }}>Report Submitted</h3>
            <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>Thank you for helping keep Zynochat safe. Our team will review this report and take appropriate action.</p>
            <Btn onClick={() => { setSubmitted(false); setTarget(""); setReason(""); setDetails(""); }} variant="outline">Report Another</Btn>
          </Card>
        ) : (
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Report a User</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.5 }}>USERNAME *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: T.accent, fontWeight: 700 }}>@</span>
                  <input placeholder="username_to_report" value={target} onChange={e => setTarget(e.target.value)}
                    style={{ width: "100%", padding: "13px 18px 13px 34px", borderRadius: 50, border: `1.5px solid ${T.border}`, fontSize: 15, fontFamily: "inherit", color: T.text, outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = T.danger}
                    onBlur={e => e.target.style.borderColor = T.border}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 8, letterSpacing: 0.5 }}>REASON *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {reasons.map(r => (
                    <div key={r} onClick={() => setReason(r)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, border: `2px solid ${reason === r ? T.danger : T.border}`, background: reason === r ? "#FEF2F2" : "#fff", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${reason === r ? T.danger : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {reason === r && <div style={{ width: 8, height: 8, background: T.danger, borderRadius: "50%" }} />}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: reason === r ? T.danger : T.text }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 0.5 }}>ADDITIONAL DETAILS</label>
                <textarea placeholder="Any additional context..." value={details} onChange={e => setDetails(e.target.value)}
                  style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", resize: "none", height: 80, boxSizing: "border-box", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = T.danger}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
              </div>
              <Btn full onClick={submit} disabled={!target || !reason} variant="danger">Submit Report</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// ─── SCREEN: Support Chat ─────────────────────────────────────────
const SupportScreen = ({ onBack }) => {
  const [joined, setJoined] = useState(false);
  const [msg, setMsg] = useState("");
  const supportMsgs = [
    { id: 1, from: "Admin", avatar: "AD", text: "Welcome to Zynochat Support! Ask any question.", time: "10:00" },
    { id: 2, from: "Ravi K", avatar: "RK", text: "How do I export my chat history?", time: "10:05" },
    { id: 3, from: "Admin", avatar: "AD", text: "Go to Settings > Chats > Export Chat to download your chat history.", time: "10:07" },
    { id: 4, from: "Neha S", avatar: "NS", text: "Love Zynochat! Great platform 🙌", time: "10:12" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Header title="Support Community" onBack={onBack} />
      {!joined ? (
        <div style={{ padding: 20 }}>
          <Card style={{ textAlign: "center", padding: 32 }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: `linear-gradient(135deg, ${T.purpleMid}, ${T.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>💬</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>Zynochat Support</h2>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: T.muted }}>Community support group</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, margin: "16px 0" }}>
              <div style={{ textAlign: "center" }}><p style={{ margin: 0, fontWeight: 800, fontSize: 18 }}>12.4K</p><p style={{ margin: 0, fontSize: 12, color: T.muted }}>Members</p></div>
              <div style={{ textAlign: "center" }}><p style={{ margin: 0, fontWeight: 800, fontSize: 18 }}>342</p><p style={{ margin: 0, fontSize: 12, color: T.muted }}>Online</p></div>
            </div>
            <div style={{ background: T.bg, borderRadius: 12, padding: 14, marginBottom: 20, textAlign: "left" }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: T.text }}>📌 Pinned</p>
              <p style={{ margin: 0, fontSize: 13, color: T.muted }}>Read our community guidelines before posting. Be respectful and helpful!</p>
            </div>
            <Btn full onClick={() => setJoined(true)}>Join Support Group</Btn>
          </Card>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {supportMsgs.map(m => (
              <div key={m.id} style={{ display: "flex", gap: 10 }}>
                <Avatar label={m.avatar} size={36} />
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: T.purpleLight }}>{m.from}</p>
                  <div style={{ background: "#fff", borderRadius: "0 16px 16px 16px", padding: "10px 14px", maxWidth: 260, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 14, color: T.text }}>{m.text}</p>
                    <span style={{ fontSize: 11, color: T.mutedLight }}>{m.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 16px 24px", background: "#fff", borderTop: `1px solid ${T.border}`, display: "flex", gap: 10 }}>
            <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Ask a question..." style={{ flex: 1, padding: "12px 16px", borderRadius: 24, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: T.bg }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${T.purpleMid}, ${T.purpleLight})`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="send" size={18} color="#fff" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SCREEN: Update Channel ───────────────────────────────────────
const UpdateChannelScreen = ({ onBack }) => {
  const posts = [
    { id: 1, title: "🚀 Zynochat v2.1.0 Released!", content: "New features: AI assistant improvements, better group management, faster media loading, and tons of bug fixes!", time: "2 hours ago", views: "12.4K", emoji: "🚀" },
    { id: 2, title: "🔐 Security Update", content: "We've enhanced end-to-end encryption and added new privacy controls in Settings > Security.", time: "1 day ago", views: "34.1K", emoji: "🔐" },
    { id: 3, title: "📱 iOS & Android Updates", content: "Native apps now available for download! Experience Zynochat at its best on mobile.", time: "3 days ago", views: "87.2K", emoji: "📱" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Header title="Zynochat Updates" onBack={onBack} />
      <div style={{ padding: "16px 16px 0" }}>
        {/* Channel Info */}
        <Card style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${T.purple}, ${T.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📣</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 16 }}>Zynochat Updates</span>
              <Icon name="verified" size={16} />
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: T.muted }}>@zyno_updates · 125K subscribers</p>
          </div>
          <Btn size="sm" variant="outline">Subscribed ✓</Btn>
        </Card>

        {/* Posts */}
        {posts.map(p => (
          <Card key={p.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: T.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{p.emoji}</div>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: T.text }}>{p.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{p.content}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 12, color: T.mutedLight }}>{p.time}</span>
              <span style={{ fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="eye" size={13} color={T.mutedLight} /> {p.views} views
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── SCREEN: Admin Panel ──────────────────────────────────────────
const AdminScreen = ({ onBack }) => {
  const [tab, setTab] = useState("overview");
  const stats = [
    { label: "Total Users", value: "24,182", icon: "users", color: T.purpleLight, change: "+12%" },
    { label: "Active Today", value: "8,441", icon: "eye", color: T.success, change: "+5%" },
    { label: "Reports", value: "34", icon: "flag", color: T.danger, change: "+3" },
    { label: "Tickets", value: "12", icon: "help", color: T.warn, change: "-2" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Header title="⚙️ Admin Panel" onBack={onBack} />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "12px 16px", overflowX: "auto", scrollbarWidth: "none" }}>
        {["overview", "users", "reports", "tickets", "banners"].map(t => (
          <div key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", borderRadius: 20, whiteSpace: "nowrap", cursor: "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0, background: tab === t ? T.purpleLight : "#fff", color: tab === t ? "#fff" : T.muted, border: `1px solid ${tab === t ? T.purpleLight : T.border}`, transition: "all 0.2s", textTransform: "capitalize" }}>{t}</div>
        ))}
      </div>

      <div style={{ padding: "0 16px 20px" }}>
        {tab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {stats.map(s => (
                <Card key={s.label} style={{ padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={s.icon} size={18} color={s.color} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.change.startsWith("+") ? T.success : T.danger, background: s.change.startsWith("+") ? "#DCFCE7" : "#FEF2F2", padding: "2px 6px", borderRadius: 6 }}>{s.change}</span>
                  </div>
                  <p style={{ margin: "0 0 2px", fontSize: 22, fontWeight: 800, color: T.text }}>{s.value}</p>
                  <p style={{ margin: 0, fontSize: 12, color: T.muted }}>{s.label}</p>
                </Card>
              ))}
            </div>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: "megaphone", label: "Send Global Announcement", color: T.purpleLight },
                { icon: "flag", label: "Review Reports (34)", color: T.danger },
                { icon: "help", label: "Open Tickets (12)", color: T.warn },
                { icon: "eye", label: "View Audit Logs", color: T.muted },
              ].map(a => (
                <Card key={a.label} onClick={() => setTab(a.label.includes("Report") ? "reports" : a.label.includes("Ticket") ? "tickets" : "overview")} style={{ padding: "12px 14px", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: a.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={a.icon} size={18} color={a.color} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{a.label}</span>
                    <Icon name="back" size={14} color={T.mutedLight} style={{ transform: "rotate(180deg)" }} />
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {tab === "users" && (
          <>
            <Input placeholder="Search users..." icon="search" style={{ marginBottom: 14, borderRadius: 14 }} value="" onChange={() => {}} />
            {ADMIN_USERS.map(u => (
              <Card key={u.id} style={{ marginBottom: 8, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Avatar label={u.name} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8, background: u.status === "active" ? "#DCFCE7" : u.status === "banned" ? "#FEF2F2" : "#FFF7ED", color: u.status === "active" ? T.success : u.status === "banned" ? T.danger : T.warn }}>{u.status}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: T.muted }}>@{u.username} · {u.email}</p>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: T.mutedLight }}>Joined {u.joined} · {u.reports} reports</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    {u.status !== "banned" && <Btn size="sm" variant="danger" style={{ fontSize: 11, padding: "5px 12px" }}>Ban</Btn>}
                    {u.status === "banned" && <Btn size="sm" variant="soft" style={{ fontSize: 11, padding: "5px 12px" }}>Unban</Btn>}
                    <Btn size="sm" variant="outline" style={{ fontSize: 11, padding: "5px 12px" }}>View</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {tab === "reports" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {["All", "Pending", "Reviewed", "Resolved"].map(f => (
                <div key={f} style={{ padding: "6px 14px", borderRadius: 20, background: f === "All" ? T.purpleLight : "#fff", color: f === "All" ? "#fff" : T.muted, border: `1px solid ${f === "All" ? T.purpleLight : T.border}`, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{f}</div>
              ))}
            </div>
            {[
              { id: "RPT-001", reporter: "User A", target: "@spam123", reason: "Spam", status: "pending", time: "1h ago" },
              { id: "RPT-002", reporter: "User B", target: "@fake_acc", reason: "Impersonation", status: "reviewed", time: "3h ago" },
              { id: "RPT-003", reporter: "User C", target: "@spammer99", reason: "Abuse", status: "resolved", time: "1d ago" },
            ].map(r => (
              <Card key={r.id} style={{ marginBottom: 8, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: T.purpleLight }}>{r.id}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8, background: r.status === "resolved" ? "#DCFCE7" : r.status === "pending" ? "#FFF7ED" : "#EEF2FF", color: r.status === "resolved" ? T.success : r.status === "pending" ? T.warn : T.purpleLight }}>{r.status}</span>
                </div>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: T.text }}>{r.target} · <span style={{ color: T.muted, fontWeight: 400 }}>{r.reason}</span></p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: T.mutedLight }}>By {r.reporter} · {r.time}</span>
                  {r.status === "pending" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn size="sm" variant="danger" style={{ fontSize: 11, padding: "5px 10px" }}>Ban</Btn>
                      <Btn size="sm" variant="ghost" style={{ fontSize: 11, padding: "5px 10px" }}>Dismiss</Btn>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </>
        )}

        {tab === "tickets" && HELP_TICKETS.map(t => (
          <Card key={t.id} style={{ marginBottom: 8, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: T.purpleLight }}>{t.id}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8, background: t.status === "resolved" ? "#DCFCE7" : t.status === "open" ? "#EEF2FF" : "#FFF7ED", color: t.status === "resolved" ? T.success : t.status === "open" ? T.purpleLight : T.warn }}>{t.status}</span>
            </div>
            <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14 }}>{t.title}</p>
            <p style={{ margin: "0 0 8px", fontSize: 12, color: T.muted }}>{t.user} · {t.category} · {t.time}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn size="sm" variant="soft" style={{ fontSize: 11, padding: "5px 12px" }}>Reply</Btn>
              {t.status !== "resolved" && <Btn size="sm" variant="outline" style={{ fontSize: 11, padding: "5px 12px" }}>Resolve</Btn>}
            </div>
          </Card>
        ))}

        {tab === "banners" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Ad Banners</h3>
              <Btn size="sm" icon="plus">New Banner</Btn>
            </div>
            {[
              { id: 1, title: "Zynochat Premium", active: true, clicks: "2.4K" },
              { id: 2, title: "Sponsored: TechCourse", active: false, clicks: "890" },
            ].map(b => (
              <Card key={b.id} style={{ marginBottom: 8, padding: "14px" }}>
                <div style={{ height: 80, background: `linear-gradient(135deg, ${T.purpleMid}, ${T.accent})`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  {b.title}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 12, color: T.muted }}>{b.clicks} clicks</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: b.active ? T.success : T.muted }}>{b.active ? "● Active" : "○ Inactive"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn size="sm" variant="outline" style={{ fontSize: 11, padding: "5px 10px" }}>Edit</Btn>
                    <Btn size="sm" variant={b.active ? "ghost" : "soft"} style={{ fontSize: 11, padding: "5px 10px" }}>{b.active ? "Pause" : "Activate"}</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [authStep, setAuthStep] = useState("login"); // login | otp | register | app
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [subScreen, setSubScreen] = useState(null); // { screen, data }

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
  }, []);

  const navigate = (screen, data) => setSubScreen({ screen, data });
  const goBack = () => setSubScreen(null);

  // Render sub-screens (full page overlays)
  if (subScreen) {
    const { screen, data } = subScreen;
    if (screen === "chat") return <div style={styles.root}><ChatConvoScreen chat={data} onBack={goBack} user={user} /></div>;
    if (screen === "ai") return <div style={styles.root}><AIScreen onBack={goBack} /></div>;
    if (screen === "help") return <div style={styles.root}><HelpScreen onBack={goBack} /></div>;
    if (screen === "support") return <div style={styles.root}><SupportScreen onBack={goBack} /></div>;
    if (screen === "update") return <div style={styles.root}><UpdateChannelScreen onBack={goBack} /></div>;
    if (screen === "report") return <div style={styles.root}><ReportScreen onBack={goBack} /></div>;
    if (screen === "admin") return <div style={styles.root}><AdminScreen onBack={goBack} /></div>;
    if (screen === "profile") return <div style={styles.root}><ProfileScreen user={user} navigate={navigate} /><BottomNav active={tab} onChange={t => { setTab(t); goBack(); }} /></div>;
  }

  // Auth flow
  if (authStep === "login") return <div style={styles.root}><LoginScreen onNext={e => { setEmail(e); setAuthStep("otp"); }} /></div>;
  if (authStep === "otp") return <div style={styles.root}><OTPScreen email={email} onVerify={() => setAuthStep("register")} onBack={() => setAuthStep("login")} /></div>;
  if (authStep === "register") return <div style={styles.root}><RegisterScreen email={email} onDone={u => { setUser({ ...u, isAdmin: true }); setAuthStep("app"); }} /></div>;

  // Main app
  return (
    <div style={styles.root}>
      {tab === "home" && <HomeScreen user={user} navigate={navigate} />}
      {tab === "chats" && <ChatsScreen navigate={navigate} />}
      {tab === "search" && <SearchScreen navigate={navigate} />}
      {tab === "profile" && <ProfileScreen user={user} navigate={navigate} />}
      {tab === "settings" && <SettingsScreen user={user} onLogout={() => { setAuthStep("login"); setUser(null); }} navigate={navigate} />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
