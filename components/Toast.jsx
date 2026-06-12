import React from "react";
import { useState, useEffect } from "react";

export function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, []);

  const bg = type === "success" ? "#1a4d32" : "#4d1a1a";
  const border = type === "success" ? "#2e7d52" : "#c0392b";
  const color = type === "success" ? "#4ade80" : "#f87171";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        background: bg,
        border: `1px solid ${border}`,
        color,
        borderRadius: 14,
        padding: "13px 20px",
        fontSize: "0.87rem",
        fontWeight: 500,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      {type === "success" ? "✓ " : "✕ "}
      {msg}
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = (msg, type = "success") => setToast({ msg, type, key: Date.now() });

  const el = toast ? (
    <Toast key={toast.key} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
  ) : null;

  return { show, el };
}
