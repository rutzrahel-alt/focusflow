import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0f0f13",
  surface: "#1a1a24",
  surfaceHover: "#22222f",
  accent: "#7c6af7",
  accentLight: "#a89af9",
  green: "#4ade80",
  yellow: "#fbbf24",
  red: "#f87171",
  text: "#f0eeff",
  muted: "#7e7a9a",
  border: "#2a2a3a",
};

const PRIORITIES = [
  { label: "🔥 Muss heute", value: "must", color: COLORS.red },
  { label: "⚡ Wichtig", value: "important", color: COLORS.yellow },
  { label: "💭 Wenn Zeit", value: "maybe", color: COLORS.muted },
];

const FOCUS_DURATIONS = [5, 10, 15, 25];

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function ProgressRing({ pct, size = 120, stroke = 8, color }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.border} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  );
}

export default function FocusFlow() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "E-Mails checken", priority: "must", done: false },
    { id: 2, text: "Arzttermin anrufen", priority: "must", done: false },
    { id: 3, text: "Küche aufräumen", priority: "important", done: false },
    { id: 4, text: "Buch lesen", priority: "maybe", done: false },
  ]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("important");
  const [view, setView] = useState("today"); // today | focus | done
  const [focusTask, setFocusTask] = useState(null);
  const [focusDur, setFocusDur] = useState(25);
  const [timeLeft, setTimeLeft] = useState(null);
  const [running, setRunning] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [nowTask, setNowTask] = useState(null);
  const [showNow, setShowNow] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const intervalRef = useRef(null);
  const nextId = useRef(10);

  // Determine "do now" task
  useEffect(() => {
    const undone = tasks.filter(t => !t.done);
    const must = undone.find(t => t.priority === "must");
    const imp = undone.find(t => t.priority === "important");
    setNowTask(must || imp || undone[0] || null);
  }, [tasks]);

  // Timer logic
  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && running) {
      setRunning(false);
      setPulse(true);
      setTimeout(() => setPulse(false), 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, timeLeft]);

  function addTask() {
    if (!input.trim()) return;
    setTasks(prev => [...prev, { id: nextId.current++, text: input.trim(), priority, done: false }]);
    setInput("");
  }

  function toggleDone(id) {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        if (!t.done) setCompletedCount(c => c + 1);
        else setCompletedCount(c => Math.max(0, c - 1));
        return { ...t, done: !t.done };
      })
    );
  }

  function removeTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function startFocus(task) {
    setFocusTask(task);
    setTimeLeft(focusDur * 60);
    setRunning(false);
    setView("focus");
  }

  function startTimer() { setRunning(true); }
  function pauseTimer() { setRunning(false); }
  function resetTimer() { setRunning(false); setTimeLeft(focusDur * 60); }

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.done).length;
  const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const timerPct = timeLeft != null ? Math.round(((focusDur * 60 - timeLeft) / (focusDur * 60)) * 100) : 0;

  const activeTasks = tasks.filter(t => !t.done);
  const donedTasks = tasks.filter(t => t.done);

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 16px 60px",
      backgroundImage: "radial-gradient(ellipse at 20% 10%, #2a1f6622 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, #1a2f5522 0%, transparent 50%)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .task-item { transition: all 0.2s ease; }
        .task-item:hover { background: ${COLORS.surfaceHover} !important; }
        .btn-hover:hover { opacity: 0.85; transform: translateY(-1px); }
        .btn-hover { transition: all 0.2s ease; }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(124,106,247,0.5); }
          70% { box-shadow: 0 0 0 20px rgba(124,106,247,0); }
          100% { box-shadow: 0 0 0 0 rgba(124,106,247,0); }
        }
        @keyframes slide-up { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        @keyframes celebrate { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        .slide-up { animation: slide-up 0.3s ease forwards; }
        .celebrate { animation: celebrate 0.5s ease; }
        .now-card { animation: slide-up 0.3s ease; }
        input, select { outline: none; }
        input::placeholder { color: ${COLORS.muted}; }
      `}</style>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 480, marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", color: COLORS.text }}>
              Focus<span style={{ color: COLORS.accent }}>Flow</span>
            </h1>
            <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>
              {new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: COLORS.muted }}>Heute erledigt</div>
            <div style={{ fontSize: 26, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: doneTasks > 0 ? COLORS.green : COLORS.muted }}>
              {doneTasks}/{totalTasks}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16, height: 6, background: COLORS.border, borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.green})`,
            transition: "width 0.6s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: COLORS.muted }}>{pct}% geschafft</span>
          {doneTasks > 0 && <span style={{ fontSize: 11, color: COLORS.green }}>🎉 Super gemacht!</span>}
        </div>
      </div>

      {/* "Was mache ich JETZT?" Button */}
      {view === "today" && nowTask && (
        <div style={{ width: "100%", maxWidth: 480, marginBottom: 20 }}>
          <button
            className="btn-hover"
            onClick={() => setShowNow(s => !s)}
            style={{
              width: "100%", padding: "14px 20px",
              background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.accent}44)`,
              border: `1.5px solid ${COLORS.accent}66`,
              borderRadius: 16, cursor: "pointer", color: COLORS.text,
              fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
            <span>🎯 Was mache ich JETZT?</span>
            <span style={{ fontSize: 18 }}>{showNow ? "▲" : "▼"}</span>
          </button>
          {showNow && (
            <div className="now-card" style={{
              marginTop: 8, padding: "16px 20px",
              background: COLORS.surface, borderRadius: 14,
              border: `1.5px solid ${COLORS.accent}44`,
            }}>
              <div style={{ fontSize: 12, color: COLORS.accentLight, marginBottom: 6, fontWeight: 500 }}>↳ Deine nächste Aufgabe:</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{nowTask.text}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-hover" onClick={() => { toggleDone(nowTask.id); setShowNow(false); }}
                  style={{ flex: 1, padding: "10px", background: COLORS.green + "22", border: `1px solid ${COLORS.green}55`, borderRadius: 10, color: COLORS.green, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  ✓ Erledigt!
                </button>
                <button className="btn-hover" onClick={() => startFocus(nowTask)}
                  style={{ flex: 1, padding: "10px", background: COLORS.accent + "22", border: `1px solid ${COLORS.accent}55`, borderRadius: 10, color: COLORS.accentLight, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  ⏱ Fokus starten
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ width: "100%", maxWidth: 480, display: "flex", gap: 8, marginBottom: 20 }}>
        {[["today", "📋 Heute"], ["focus", "⏱ Fokus"], ["done", "✅ Erledigt"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)}
            className="btn-hover"
            style={{
              flex: 1, padding: "10px 0", borderRadius: 12,
              border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: view === v ? COLORS.accent : COLORS.surface,
              color: view === v ? "#fff" : COLORS.muted,
              transition: "all 0.2s ease",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* TODAY VIEW */}
      {view === "today" && (
        <div style={{ width: "100%", maxWidth: 480 }} className="slide-up">
          {/* Add Task */}
          <div style={{ background: COLORS.surface, borderRadius: 18, padding: 16, marginBottom: 20, border: `1px solid ${COLORS.border}` }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
              placeholder="Neue Aufgabe hinzufügen..."
              style={{
                width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                borderRadius: 10, padding: "12px 14px", color: COLORS.text, fontSize: 15,
                marginBottom: 10,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {PRIORITIES.map(p => (
                <button key={p.value} onClick={() => setPriority(p.value)}
                  style={{
                    flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                    border: `1.5px solid ${priority === p.value ? p.color : COLORS.border}`,
                    background: priority === p.value ? p.color + "22" : "transparent",
                    color: priority === p.value ? p.color : COLORS.muted,
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
            <button onClick={addTask} className="btn-hover"
              style={{
                width: "100%", marginTop: 10, padding: "12px",
                background: `linear-gradient(135deg, ${COLORS.accent}, #5b4fd4)`,
                border: "none", borderRadius: 10, color: "#fff",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}>
              + Aufgabe hinzufügen
            </button>
          </div>

          {/* Task groups */}
          {PRIORITIES.map(p => {
            const group = activeTasks.filter(t => t.priority === p.value);
            if (!group.length) return null;
            return (
              <div key={p.value} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginBottom: 8, paddingLeft: 4, letterSpacing: "0.05em" }}>
                  {p.label.toUpperCase()}
                </div>
                {group.map(task => (
                  <div key={task.id} className="task-item" style={{
                    background: COLORS.surface, borderRadius: 14, padding: "14px 16px",
                    marginBottom: 8, display: "flex", alignItems: "center", gap: 12,
                    border: `1px solid ${COLORS.border}`,
                    borderLeft: `3px solid ${p.color}`,
                  }}>
                    <button onClick={() => toggleDone(task.id)} style={{
                      width: 22, height: 22, borderRadius: 6,
                      border: `2px solid ${p.color}`, background: "transparent",
                      cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {task.done && <span style={{ color: COLORS.green, fontSize: 14 }}>✓</span>}
                    </button>
                    <span style={{ flex: 1, fontSize: 15 }}>{task.text}</span>
                    <button onClick={() => startFocus(task)} className="btn-hover"
                      style={{ background: COLORS.accent + "22", border: "none", borderRadius: 8, padding: "6px 10px", color: COLORS.accentLight, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                      ⏱
                    </button>
                    <button onClick={() => removeTask(task.id)} className="btn-hover"
                      style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 16, padding: "0 4px" }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
          {activeTasks.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.muted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.text }}>Alles erledigt!</div>
              <div style={{ fontSize: 14, marginTop: 6 }}>Fantastisch – du hast deinen Tag gemeistert!</div>
            </div>
          )}
        </div>
      )}

      {/* FOCUS VIEW */}
      {view === "focus" && (
        <div style={{ width: "100%", maxWidth: 480 }} className="slide-up">
          {/* Pick task */}
          {!focusTask ? (
            <div>
              <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 14, textAlign: "center" }}>
                Wähle eine Aufgabe für deinen Fokus-Sprint:
              </div>
              {activeTasks.map(task => (
                <button key={task.id} onClick={() => startFocus(task)} className="btn-hover task-item"
                  style={{
                    width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 14, padding: "14px 18px", marginBottom: 8,
                    color: COLORS.text, cursor: "pointer", textAlign: "left", fontSize: 15,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                  <span>{task.text}</span>
                  <span style={{ color: COLORS.accent, fontSize: 13, fontWeight: 600 }}>Fokus →</span>
                </button>
              ))}
              {activeTasks.length === 0 && (
                <div style={{ textAlign: "center", color: COLORS.muted, padding: 40 }}>Keine Aufgaben mehr – gut gemacht! 🎉</div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
              {/* Duration picker */}
              <div style={{ display: "flex", gap: 8 }}>
                {FOCUS_DURATIONS.map(d => (
                  <button key={d} onClick={() => { setFocusDur(d); setTimeLeft(d * 60); setRunning(false); }}
                    style={{
                      padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                      border: `1.5px solid ${focusDur === d ? COLORS.accent : COLORS.border}`,
                      background: focusDur === d ? COLORS.accent + "22" : "transparent",
                      color: focusDur === d ? COLORS.accentLight : COLORS.muted,
                      cursor: "pointer", transition: "all 0.2s",
                    }}>
                    {d}min
                  </button>
                ))}
              </div>

              {/* Timer ring */}
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
                animation: pulse ? "pulse-ring 1s ease 3" : "none" }}>
                <ProgressRing pct={timerPct} size={180} stroke={10} color={running ? COLORS.accent : COLORS.muted} />
                <div style={{ position: "absolute", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800 }}>
                    {timeLeft != null ? formatTime(timeLeft) : `${focusDur}:00`}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>
                    {running ? "Fokus aktiv ✨" : timeLeft === 0 ? "Fertig! 🎉" : "Bereit"}
                  </div>
                </div>
              </div>

              {/* Current task */}
              <div style={{
                background: COLORS.surface, borderRadius: 16, padding: "16px 20px", textAlign: "center",
                border: `1px solid ${COLORS.border}`, width: "100%",
              }}>
                <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>Fokus-Aufgabe</div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{focusTask.text}</div>
              </div>

              {/* Controls */}
              <div style={{ display: "flex", gap: 10, width: "100%" }}>
                {!running ? (
                  <button onClick={startTimer} className="btn-hover"
                    style={{ flex: 2, padding: "14px", background: `linear-gradient(135deg, ${COLORS.accent}, #5b4fd4)`,
                      border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                    {timeLeft === 0 ? "▶ Nochmal" : "▶ Start"}
                  </button>
                ) : (
                  <button onClick={pauseTimer} className="btn-hover"
                    style={{ flex: 2, padding: "14px", background: COLORS.yellow + "22", border: `1px solid ${COLORS.yellow}55`,
                      borderRadius: 12, color: COLORS.yellow, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                    ⏸ Pause
                  </button>
                )}
                <button onClick={resetTimer} className="btn-hover"
                  style={{ flex: 1, padding: "14px", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 12, color: COLORS.muted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                  ↺
                </button>
                <button onClick={() => { toggleDone(focusTask.id); setFocusTask(null); setRunning(false); setTimeLeft(null); }} className="btn-hover"
                  style={{ flex: 1, padding: "14px", background: COLORS.green + "22", border: `1px solid ${COLORS.green}55`,
                    borderRadius: 12, color: COLORS.green, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  ✓
                </button>
              </div>
              <button onClick={() => { setFocusTask(null); setRunning(false); setTimeLeft(null); }}
                style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 13 }}>
                ← Andere Aufgabe wählen
              </button>
            </div>
          )}
        </div>
      )}

      {/* DONE VIEW */}
      {view === "done" && (
        <div style={{ width: "100%", maxWidth: 480 }} className="slide-up">
          {donedTasks.length === 0 ? (
            <div style={{ textAlign: "center", color: COLORS.muted, padding: 60 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>💪</div>
              <div>Noch nichts erledigt – aber du schaffst das!</div>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 20, padding: "16px", background: COLORS.green + "11", borderRadius: 14, border: `1px solid ${COLORS.green}33` }}>
                <div style={{ fontSize: 32 }}>🏆</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: COLORS.green, marginTop: 4 }}>
                  {donedTasks.length} Aufgabe{donedTasks.length !== 1 ? "n" : ""} erledigt!
                </div>
              </div>
              {donedTasks.map(task => (
                <div key={task.id} style={{
                  background: COLORS.surface, borderRadius: 14, padding: "14px 16px",
                  marginBottom: 8, display: "flex", alignItems: "center", gap: 12,
                  border: `1px solid ${COLORS.border}`, opacity: 0.7,
                }}>
                  <span style={{ color: COLORS.green, fontSize: 18 }}>✓</span>
                  <span style={{ flex: 1, textDecoration: "line-through", color: COLORS.muted, fontSize: 15 }}>{task.text}</span>
                  <button onClick={() => toggleDone(task.id)}
                    style={{ background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 12 }}>
                    ↩
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Footer tip */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, textAlign: "center", padding: "12px", background: COLORS.bg + "ee", borderTop: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.muted }}>
        💡 Tipp: Starte mit einer kleinen Aufgabe – Bewegung hilft gegen das Festsitzen!
      </div>
    </div>
  );
}
