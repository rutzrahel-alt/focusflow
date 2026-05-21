import { useState, useEffect, useRef } from "react";

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  de: {
    appName: "FocusFlow",
    today: "Heute", focus: "Fokus", done: "Erledigt", routine: "Routine", evening: "Abend",
    whatNow: "Was mache ich JETZT?",
    nextTask: "↳ Deine nächste Aufgabe:",
    markDone: "✓ Erledigt!", startFocus: "⏱ Fokus starten",
    addTask: "+ Aufgabe hinzufügen", addTaskPlaceholder: "Neue Aufgabe...",
    must: "🔥 Muss heute", important: "⚡ Wichtig", maybe: "💭 Wenn Zeit",
    mustShort: "MUSS HEUTE", importantShort: "WICHTIG", maybeShort: "WENN ZEIT",
    repeat: "Wiederholen:", never: "Nie", daily: "Täglich", weekly: "Wöchentlich",
    everyXDays: "Alle X Tage", everyXDaysLabel: "Alle",days: "Tage",
    time: "Uhrzeit (optional):",
    notify: "Erinnerung:",
    energyQuestion: "Wie ist deine Energie heute?",
    energyHigh: "💪 Viel", energyMed: "😐 Mittel", energyLow: "😴 Wenig",
    streakLabel: "Tage in Folge", streakMsg: "Weiter so!",
    focusTask: "Fokus-Aufgabe", chooseTask: "Wähle eine Aufgabe:",
    ready: "Bereit", focusActive: "Fokus aktiv ✨", finished: "Fertig! 🎉",
    start: "▶ Start", again: "▶ Nochmal", pause: "⏸ Pause", reset: "↺", otherTask: "← Andere Aufgabe",
    allDone: "Alles erledigt!", allDoneMsg: "Fantastisch – du hast deinen Tag gemeistert!",
    noDone: "Noch nichts erledigt – aber du schaffst das!",
    todayDone: "Heute erledigt", pctDone: "% geschafft", greatJob: "🎉 Super gemacht!",
    tip: "💡 Tipp: Starte mit einer kleinen Aufgabe – Bewegung hilft gegen das Festsitzen!",
    routineTitle: "Morgenroutine",
    routineDesc: "Feste tägliche Aufgaben",
    addRoutine: "+ Routine hinzufügen",
    routinePlaceholder: "z.B. Zähne putzen...",
    eveningTitle: "Abend-Review",
    eveningQ1: "Was habe ich heute geschafft?",
    eveningQ2: "Was war schwierig?",
    eveningQ3: "Was nehme ich mir für morgen vor?",
    save: "Speichern",
    saved: "✓ Gespeichert!",
    oneFocusMode: "Fokus-Modus: Nur eine Aufgabe",
    oneFocusOff: "Alle Aufgaben anzeigen",
    notifyOn: "🔔 An", notifyOff: "🔕 Aus",
    enableNotify: "Benachrichtigungen erlauben",
    lang: "🌍 Sprache",
  },
  en: {
    appName: "FocusFlow",
    today: "Today", focus: "Focus", done: "Done", routine: "Routine", evening: "Evening",
    whatNow: "What do I do NOW?",
    nextTask: "↳ Your next task:",
    markDone: "✓ Done!", startFocus: "⏱ Start Focus",
    addTask: "+ Add Task", addTaskPlaceholder: "New task...",
    must: "🔥 Must today", important: "⚡ Important", maybe: "💭 If time",
    mustShort: "MUST TODAY", importantShort: "IMPORTANT", maybeShort: "IF TIME",
    repeat: "Repeat:", never: "Never", daily: "Daily", weekly: "Weekly",
    everyXDays: "Every X Days", everyXDaysLabel: "Every", days: "days",
    time: "Time (optional):",
    notify: "Reminder:",
    energyQuestion: "How is your energy today?",
    energyHigh: "💪 High", energyMed: "😐 Medium", energyLow: "😴 Low",
    streakLabel: "days in a row", streakMsg: "Keep it up!",
    focusTask: "Focus Task", chooseTask: "Choose a task:",
    ready: "Ready", focusActive: "Focus active ✨", finished: "Done! 🎉",
    start: "▶ Start", again: "▶ Again", pause: "⏸ Pause", reset: "↺", otherTask: "← Other task",
    allDone: "All done!", allDoneMsg: "Fantastic – you mastered your day!",
    noDone: "Nothing done yet – but you've got this!",
    todayDone: "Done today", pctDone: "% done", greatJob: "🎉 Great job!",
    tip: "💡 Tip: Start with a small task – movement helps against getting stuck!",
    routineTitle: "Morning Routine",
    routineDesc: "Fixed daily tasks",
    addRoutine: "+ Add routine",
    routinePlaceholder: "e.g. Brush teeth...",
    eveningTitle: "Evening Review",
    eveningQ1: "What did I accomplish today?",
    eveningQ2: "What was difficult?",
    eveningQ3: "What's my plan for tomorrow?",
    save: "Save",
    saved: "✓ Saved!",
    oneFocusMode: "Focus Mode: One task only",
    oneFocusOff: "Show all tasks",
    notifyOn: "🔔 On", notifyOff: "🔕 Off",
    enableNotify: "Allow notifications",
    lang: "🌍 Language",
  }
};

const COLORS = {
  bg: "#0f0f13", surface: "#1a1a24", surfaceHover: "#22222f",
  accent: "#7c6af7", accentLight: "#a89af9",
  green: "#4ade80", yellow: "#fbbf24", red: "#f87171",
  text: "#f0eeff", muted: "#7e7a9a", border: "#2a2a3a",
};

const FOCUS_DURATIONS = [5, 10, 15, 25];

function formatTime(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

function ProgressRing({ pct, size=120, stroke=8, color }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r, offset=circ*(1-pct/100);
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={COLORS.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 0.5s ease"}}/>
    </svg>
  );
}

const defaultTasks = [
  {id:1,text:"E-Mails checken",textEn:"Check emails",priority:"must",done:false,repeat:"daily",time:"09:00",notify:true,daysInterval:1},
  {id:2,text:"Arzttermin anrufen",textEn:"Call doctor",priority:"must",done:false,repeat:"never",time:"",notify:false,daysInterval:1},
  {id:3,text:"Küche aufräumen",textEn:"Clean kitchen",priority:"important",done:false,repeat:"weekly",time:"",notify:false,daysInterval:1},
  {id:4,text:"Buch lesen",textEn:"Read book",priority:"maybe",done:false,repeat:"daily",time:"20:00",notify:false,daysInterval:1},
];

const defaultRoutine = [
  {id:101,text:"Zähne putzen",textEn:"Brush teeth",done:false},
  {id:102,text:"Medikament nehmen",textEn:"Take medication",done:false},
  {id:103,text:"Glas Wasser trinken",textEn:"Drink water",done:false},
];

function load(key, fallback) {
  try { const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; } catch{ return fallback; }
}
function save(key, val) { try{localStorage.setItem(key,JSON.stringify(val));}catch{} }

export default function FocusFlow() {
  const [lang, setLang] = useState(() => load("ff_lang","de"));
  const t = T[lang];

  const [tasks, setTasks] = useState(() => load("ff_tasks", defaultTasks));
  const [routine, setRoutine] = useState(() => load("ff_routine", defaultRoutine));
  const [input, setInput] = useState("");
  const [inputEn, setInputEn] = useState("");
  const [priority, setPriority] = useState("important");
  const [repeat, setRepeat] = useState("never");
  const [daysInterval, setDaysInterval] = useState(3);
  const [taskTime, setTaskTime] = useState("");
  const [taskNotify, setTaskNotify] = useState(false);
  const [view, setView] = useState("today");
  const [focusTask, setFocusTask] = useState(null);
  const [focusDur, setFocusDur] = useState(25);
  const [timeLeft, setTimeLeft] = useState(null);
  const [running, setRunning] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [nowTask, setNowTask] = useState(null);
  const [showNow, setShowNow] = useState(false);
  const [oneFocus, setOneFocus] = useState(false);
  const [energy, setEnergy] = useState(() => load("ff_energy",""));
  const [streak, setStreak] = useState(() => load("ff_streak",0));
  const [lastDone, setLastDone] = useState(() => load("ff_lastdone",""));
  const [eveningAnswers, setEveningAnswers] = useState(() => load("ff_evening",{q1:"",q2:"",q3:""}));
  const [eveningSaved, setEveningSaved] = useState(false);
  const [routineInput, setRoutineInput] = useState("");
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const intervalRef = useRef(null);
  const nextId = useRef(200);

  // Persist
  useEffect(()=>save("ff_tasks",tasks),[tasks]);
  useEffect(()=>save("ff_routine",routine),[routine]);
  useEffect(()=>save("ff_lang",lang),[lang]);
  useEffect(()=>save("ff_energy",energy),[energy]);
  useEffect(()=>save("ff_streak",streak),[streak]);
  useEffect(()=>save("ff_lastdone",lastDone),[lastDone]);
  useEffect(()=>save("ff_evening",eveningAnswers),[eveningAnswers]);

  // Now task
  useEffect(()=>{
    const undone=tasks.filter(t=>!t.done);
    const must=undone.find(t=>t.priority==="must");
    const imp=undone.find(t=>t.priority==="important");
    setNowTask(must||imp||undone[0]||null);
  },[tasks]);

  // Timer
  useEffect(()=>{
    if(running&&timeLeft>0){intervalRef.current=setInterval(()=>setTimeLeft(t=>t-1),1000);}
    else if(timeLeft===0&&running){setRunning(false);setPulse(true);setTimeout(()=>setPulse(false),3000);}
    return()=>clearInterval(intervalRef.current);
  },[running,timeLeft]);

  // Streak logic
  function updateStreak() {
    const today=new Date().toDateString();
    if(lastDone===today) return;
    const yesterday=new Date(Date.now()-86400000).toDateString();
    setStreak(s=>lastDone===yesterday?s+1:1);
    setLastDone(today);
  }

  // Notifications
  async function requestNotify() {
    if("Notification" in window){
      const perm=await Notification.requestPermission();
      setNotifyEnabled(perm==="granted");
    }
  }

  function scheduleNotify(task) {
    if(!notifyEnabled||!task.time||!task.notify) return;
    const [h,m]=task.time.split(":").map(Number);
    const now=new Date(), target=new Date();
    target.setHours(h,m,0,0);
    const diff=target-now;
    if(diff>0) setTimeout(()=>{
      new Notification("FocusFlow",{body:lang==="de"?task.text:task.textEn||task.text,icon:"/favicon.ico"});
    },diff);
  }

  function addTask() {
    if(!input.trim()) return;
    const task={id:nextId.current++,text:input.trim(),textEn:inputEn.trim()||input.trim(),
      priority,done:false,repeat,daysInterval,time:taskTime,notify:taskNotify};
    setTasks(prev=>[...prev,task]);
    scheduleNotify(task);
    setInput("");setInputEn("");setRepeat("never");setTaskTime("");setTaskNotify(false);
  }

  function toggleDone(id) {
    setTasks(prev=>prev.map(t=>{
      if(t.id!==id) return t;
      if(!t.done) updateStreak();
      return {...t,done:!t.done};
    }));
  }

  function removeTask(id){setTasks(prev=>prev.filter(t=>t.id!==id));}

  function startFocus(task){setFocusTask(task);setTimeLeft(focusDur*60);setRunning(false);setView("focus");}

  function addRoutineItem(){
    if(!routineInput.trim()) return;
    setRoutine(prev=>[...prev,{id:nextId.current++,text:routineInput.trim(),textEn:routineInput.trim(),done:false}]);
    setRoutineInput("");
  }

  function toggleRoutine(id){setRoutine(prev=>prev.map(r=>r.id===id?{...r,done:!r.done}:r));}

  const PRIORITIES=[
    {label:t.must,value:"must",color:COLORS.red},
    {label:t.important,value:"important",color:COLORS.yellow},
    {label:t.maybe,value:"maybe",color:COLORS.muted},
  ];
  const PRIORITY_LABELS={must:t.mustShort,important:t.importantShort,maybe:t.maybeShort};

  const activeTasks=tasks.filter(t=>!t.done);
  const donedTasks=tasks.filter(t=>t.done);
  const totalTasks=tasks.length;
  const doneTasks=donedTasks.length;
  const pct=totalTasks?Math.round((doneTasks/totalTasks)*100):0;
  const timerPct=timeLeft!=null?Math.round(((focusDur*60-timeLeft)/(focusDur*60))*100):0;

  const displayTasks=oneFocus&&nowTask?[nowTask]:activeTasks;

  return (
    <div style={{minHeight:"100vh",background:COLORS.bg,color:COLORS.text,
      fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",flexDirection:"column",
      alignItems:"center",padding:"24px 16px 80px",
      backgroundImage:"radial-gradient(ellipse at 20% 10%,#2a1f6622 0%,transparent 50%),radial-gradient(ellipse at 80% 90%,#1a2f5522 0%,transparent 50%)"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#333;border-radius:2px;}
        .task-item{transition:all 0.2s ease;}.task-item:hover{background:${COLORS.surfaceHover}!important;}
        .btn{transition:all 0.2s ease;cursor:pointer;}.btn:hover{opacity:0.85;transform:translateY(-1px);}
        @keyframes slide-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .slide-up{animation:slide-up 0.3s ease forwards;}
        input,select,textarea{outline:none;}input::placeholder,textarea::placeholder{color:${COLORS.muted};}
        textarea{resize:vertical;}
      `}</style>

      {/* Header */}
      <div style={{width:"100%",maxWidth:480,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,letterSpacing:"-0.5px"}}>
              Focus<span style={{color:COLORS.accent}}>Flow</span>
            </h1>
            <p style={{color:COLORS.muted,fontSize:13,marginTop:2}}>
              {new Date().toLocaleDateString(lang==="de"?"de-DE":"en-US",{weekday:"long",day:"numeric",month:"long"})}
            </p>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
            {/* Lang toggle */}
            <button className="btn" onClick={()=>setLang(l=>l==="de"?"en":"de")}
              style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:8,
                padding:"4px 10px",color:COLORS.muted,fontSize:12}}>
              {lang==="de"?"🇬🇧 EN":"🇩🇪 DE"}
            </button>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:COLORS.muted}}>{t.todayDone}</div>
              <div style={{fontSize:24,fontFamily:"'Syne',sans-serif",fontWeight:800,
                color:doneTasks>0?COLORS.green:COLORS.muted}}>{doneTasks}/{totalTasks}</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{marginTop:12,height:6,background:COLORS.border,borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:99,width:`${pct}%`,
            background:`linear-gradient(90deg,${COLORS.accent},${COLORS.green})`,transition:"width 0.6s ease"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
          <span style={{fontSize:11,color:COLORS.muted}}>{pct}{t.pctDone}</span>
          {streak>0&&<span style={{fontSize:11,color:COLORS.yellow}}>🔥 {streak} {t.streakLabel}</span>}
          {doneTasks>0&&<span style={{fontSize:11,color:COLORS.green}}>{t.greatJob}</span>}
        </div>
      </div>

      {/* Energy selector (morning) */}
      {view==="today"&&!energy&&(
        <div style={{width:"100%",maxWidth:480,marginBottom:16,background:COLORS.surface,
          borderRadius:16,padding:16,border:`1px solid ${COLORS.border}`}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>{t.energyQuestion}</div>
          <div style={{display:"flex",gap:8}}>
            {[["high",t.energyHigh,COLORS.green],["med",t.energyMed,COLORS.yellow],["low",t.energyLow,COLORS.muted]].map(([v,label,col])=>(
              <button key={v} className="btn" onClick={()=>setEnergy(v)}
                style={{flex:1,padding:"10px 4px",borderRadius:10,border:`1.5px solid ${col}44`,
                  background:`${col}11`,color:col,fontWeight:600,fontSize:13}}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* What now */}
      {view==="today"&&nowTask&&(
        <div style={{width:"100%",maxWidth:480,marginBottom:16}}>
          <button className="btn" onClick={()=>setShowNow(s=>!s)}
            style={{width:"100%",padding:"14px 20px",
              background:`linear-gradient(135deg,${COLORS.accent}22,${COLORS.accent}44)`,
              border:`1.5px solid ${COLORS.accent}66`,borderRadius:16,color:COLORS.text,
              fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,
              display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>🎯 {t.whatNow}</span>
            <span>{showNow?"▲":"▼"}</span>
          </button>
          {showNow&&(
            <div style={{marginTop:8,padding:"16px 20px",background:COLORS.surface,
              borderRadius:14,border:`1.5px solid ${COLORS.accent}44`}}>
              <div style={{fontSize:12,color:COLORS.accentLight,marginBottom:6,fontWeight:500}}>{t.nextTask}</div>
              <div style={{fontSize:18,fontWeight:700,marginBottom:12}}>
                {lang==="de"?nowTask.text:nowTask.textEn||nowTask.text}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn" onClick={()=>{toggleDone(nowTask.id);setShowNow(false);}}
                  style={{flex:1,padding:"10px",background:COLORS.green+"22",border:`1px solid ${COLORS.green}55`,
                    borderRadius:10,color:COLORS.green,fontWeight:600,fontSize:13}}>{t.markDone}</button>
                <button className="btn" onClick={()=>startFocus(nowTask)}
                  style={{flex:1,padding:"10px",background:COLORS.accent+"22",border:`1px solid ${COLORS.accent}55`,
                    borderRadius:10,color:COLORS.accentLight,fontWeight:600,fontSize:13}}>{t.startFocus}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <div style={{width:"100%",maxWidth:480,display:"flex",gap:6,marginBottom:16,overflowX:"auto"}}>
        {[["today","📋 "+t.today],["focus","⏱ "+t.focus],["routine","🌅 "+t.routine],["evening","🌙 "+t.evening],["done","✅ "+t.done]].map(([v,label])=>(
          <button key={v} className="btn" onClick={()=>setView(v)}
            style={{flex:1,minWidth:60,padding:"9px 4px",borderRadius:12,border:"none",
              fontSize:11,fontWeight:600,whiteSpace:"nowrap",
              background:view===v?COLORS.accent:COLORS.surface,
              color:view===v?"#fff":COLORS.muted}}>
            {label}
          </button>
        ))}
      </div>

      {/* TODAY */}
      {view==="today"&&(
        <div style={{width:"100%",maxWidth:480}} className="slide-up">
          {/* One focus toggle */}
          <button className="btn" onClick={()=>setOneFocus(f=>!f)}
            style={{width:"100%",marginBottom:12,padding:"10px",background:oneFocus?COLORS.accent+"33":COLORS.surface,
              border:`1px solid ${oneFocus?COLORS.accent:COLORS.border}`,borderRadius:12,
              color:oneFocus?COLORS.accentLight:COLORS.muted,fontWeight:600,fontSize:13}}>
            {oneFocus?"👁 "+t.oneFocusOff:"🎯 "+t.oneFocusMode}
          </button>

          {/* Add task */}
          <div style={{background:COLORS.surface,borderRadius:18,padding:16,marginBottom:20,border:`1px solid ${COLORS.border}`}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()}
              placeholder={t.addTaskPlaceholder+" (DE)"}
              style={{width:"100%",background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:10,
                padding:"11px 14px",color:COLORS.text,fontSize:14,marginBottom:8}}/>
            <input value={inputEn} onChange={e=>setInputEn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()}
              placeholder={t.addTaskPlaceholder+" (EN)"}
              style={{width:"100%",background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:10,
                padding:"11px 14px",color:COLORS.text,fontSize:14,marginBottom:8}}/>

            {/* Priority */}
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              {PRIORITIES.map(p=>(
                <button key={p.value} className="btn" onClick={()=>setPriority(p.value)}
                  style={{flex:1,padding:"7px 2px",borderRadius:8,fontSize:10,fontWeight:600,
                    border:`1.5px solid ${priority===p.value?p.color:COLORS.border}`,
                    background:priority===p.value?p.color+"22":"transparent",
                    color:priority===p.value?p.color:COLORS.muted}}>
                  {p.label}
                </button>
              ))}
            </div>

            {/* Repeat */}
            <div style={{marginBottom:8}}>
              <div style={{fontSize:11,color:COLORS.muted,marginBottom:4}}>{t.repeat}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[["never",t.never],["daily",t.daily],["weekly",t.weekly],["interval",t.everyXDays]].map(([v,label])=>(
                  <button key={v} className="btn" onClick={()=>setRepeat(v)}
                    style={{padding:"5px 10px",borderRadius:8,fontSize:11,fontWeight:600,
                      border:`1px solid ${repeat===v?COLORS.accent:COLORS.border}`,
                      background:repeat===v?COLORS.accent+"22":"transparent",
                      color:repeat===v?COLORS.accentLight:COLORS.muted}}>
                    {label}
                  </button>
                ))}
              </div>
              {repeat==="interval"&&(
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
                  <span style={{fontSize:12,color:COLORS.muted}}>{t.everyXDaysLabel}</span>
                  <input type="number" min={2} max={30} value={daysInterval}
                    onChange={e=>setDaysInterval(Number(e.target.value))}
                    style={{width:60,background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:8,
                      padding:"6px",color:COLORS.text,fontSize:13,textAlign:"center"}}/>
                  <span style={{fontSize:12,color:COLORS.muted}}>{t.days}</span>
                </div>
              )}
            </div>

            {/* Time & notify */}
            <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:COLORS.muted,marginBottom:4}}>{t.time}</div>
                <input type="time" value={taskTime} onChange={e=>setTaskTime(e.target.value)}
                  style={{width:"100%",background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:8,
                    padding:"8px",color:COLORS.text,fontSize:13}}/>
              </div>
              <div>
                <div style={{fontSize:11,color:COLORS.muted,marginBottom:4}}>{t.notify}</div>
                <button className="btn" onClick={()=>{if(!notifyEnabled)requestNotify();setTaskNotify(n=>!n);}}
                  style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${taskNotify?COLORS.accent:COLORS.border}`,
                    background:taskNotify?COLORS.accent+"22":"transparent",
                    color:taskNotify?COLORS.accentLight:COLORS.muted,fontSize:13,fontWeight:600}}>
                  {taskNotify?t.notifyOn:t.notifyOff}
                </button>
              </div>
            </div>

            <button className="btn" onClick={addTask}
              style={{width:"100%",padding:"12px",
                background:`linear-gradient(135deg,${COLORS.accent},#5b4fd4)`,
                border:"none",borderRadius:10,color:"#fff",fontWeight:700,fontSize:14}}>
              {t.addTask}
            </button>
          </div>

          {/* Task groups */}
          {["must","important","maybe"].map(pv=>{
            const group=displayTasks.filter(t=>t.priority===pv);
            if(!group.length) return null;
            const col=PRIORITIES.find(p=>p.value===pv).color;
            return (
              <div key={pv} style={{marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:700,color:col,marginBottom:8,paddingLeft:4,letterSpacing:"0.05em"}}>
                  {PRIORITY_LABELS[pv]}
                </div>
                {group.map(task=>(
                  <div key={task.id} className="task-item" style={{background:COLORS.surface,borderRadius:14,
                    padding:"13px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10,
                    border:`1px solid ${COLORS.border}`,borderLeft:`3px solid ${col}`}}>
                    <button className="btn" onClick={()=>toggleDone(task.id)}
                      style={{width:22,height:22,borderRadius:6,border:`2px solid ${col}`,
                        background:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    </button>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500}}>{lang==="de"?task.text:task.textEn||task.text}</div>
                      <div style={{display:"flex",gap:8,marginTop:3,flexWrap:"wrap"}}>
                        {task.time&&<span style={{fontSize:11,color:COLORS.muted}}>⏰ {task.time}</span>}
                        {task.repeat!=="never"&&<span style={{fontSize:11,color:COLORS.accentLight}}>
                          🔄 {task.repeat==="daily"?t.daily:task.repeat==="weekly"?t.weekly:`${t.everyXDaysLabel} ${task.daysInterval} ${t.days}`}
                        </span>}
                        {task.notify&&<span style={{fontSize:11,color:COLORS.green}}>🔔</span>}
                      </div>
                    </div>
                    <button className="btn" onClick={()=>startFocus(task)}
                      style={{background:COLORS.accent+"22",border:"none",borderRadius:8,
                        padding:"5px 8px",color:COLORS.accentLight,fontSize:12,fontWeight:600}}>⏱</button>
                    <button className="btn" onClick={()=>removeTask(task.id)}
                      style={{background:"transparent",border:"none",color:COLORS.muted,fontSize:16,padding:"0 2px"}}>×</button>
                  </div>
                ))}
              </div>
            );
          })}
          {displayTasks.length===0&&(
            <div style={{textAlign:"center",padding:"40px 20px",color:COLORS.muted}}>
              <div style={{fontSize:40,marginBottom:12}}>🎉</div>
              <div style={{fontWeight:700,fontSize:18,color:COLORS.text}}>{t.allDone}</div>
              <div style={{fontSize:14,marginTop:6}}>{t.allDoneMsg}</div>
            </div>
          )}
        </div>
      )}

      {/* FOCUS */}
      {view==="focus"&&(
        <div style={{width:"100%",maxWidth:480}} className="slide-up">
          {!focusTask?(
            <div>
              <div style={{fontSize:13,color:COLORS.muted,marginBottom:14,textAlign:"center"}}>{t.chooseTask}</div>
              {activeTasks.map(task=>(
                <button key={task.id} className="btn task-item" onClick={()=>startFocus(task)}
                  style={{width:"100%",background:COLORS.surface,border:`1px solid ${COLORS.border}`,
                    borderRadius:14,padding:"14px 18px",marginBottom:8,color:COLORS.text,
                    textAlign:"left",fontSize:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>{lang==="de"?task.text:task.textEn||task.text}</span>
                  <span style={{color:COLORS.accent,fontSize:12,fontWeight:600}}>{t.startFocus} →</span>
                </button>
              ))}
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
              <div style={{display:"flex",gap:8}}>
                {FOCUS_DURATIONS.map(d=>(
                  <button key={d} className="btn" onClick={()=>{setFocusDur(d);setTimeLeft(d*60);setRunning(false);}}
                    style={{padding:"6px 14px",borderRadius:8,fontSize:13,fontWeight:600,
                      border:`1.5px solid ${focusDur===d?COLORS.accent:COLORS.border}`,
                      background:focusDur===d?COLORS.accent+"22":"transparent",
                      color:focusDur===d?COLORS.accentLight:COLORS.muted}}>
                    {d}min
                  </button>
                ))}
              </div>
              <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <ProgressRing pct={timerPct} size={180} stroke={10} color={running?COLORS.accent:COLORS.muted}/>
                <div style={{position:"absolute",textAlign:"center"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:38,fontWeight:800}}>
                    {timeLeft!=null?formatTime(timeLeft):`${focusDur}:00`}
                  </div>
                  <div style={{fontSize:11,color:COLORS.muted}}>
                    {running?t.focusActive:timeLeft===0?t.finished:t.ready}
                  </div>
                </div>
              </div>
              <div style={{background:COLORS.surface,borderRadius:16,padding:"14px 20px",textAlign:"center",
                border:`1px solid ${COLORS.border}`,width:"100%"}}>
                <div style={{fontSize:11,color:COLORS.muted,marginBottom:4}}>{t.focusTask}</div>
                <div style={{fontSize:16,fontWeight:700}}>{lang==="de"?focusTask.text:focusTask.textEn||focusTask.text}</div>
              </div>
              <div style={{display:"flex",gap:10,width:"100%"}}>
                {!running?(
                  <button className="btn" onClick={()=>setRunning(true)}
                    style={{flex:2,padding:"14px",background:`linear-gradient(135deg,${COLORS.accent},#5b4fd4)`,
                      border:"none",borderRadius:12,color:"#fff",fontWeight:700,fontSize:15}}>
                    {timeLeft===0?t.again:t.start}
                  </button>
                ):(
                  <button className="btn" onClick={()=>setRunning(false)}
                    style={{flex:2,padding:"14px",background:COLORS.yellow+"22",border:`1px solid ${COLORS.yellow}55`,
                      borderRadius:12,color:COLORS.yellow,fontWeight:700,fontSize:15}}>{t.pause}</button>
                )}
                <button className="btn" onClick={()=>{setRunning(false);setTimeLeft(focusDur*60);}}
                  style={{flex:1,padding:"14px",background:COLORS.surface,border:`1px solid ${COLORS.border}`,
                    borderRadius:12,color:COLORS.muted,fontWeight:600,fontSize:14}}>{t.reset}</button>
                <button className="btn" onClick={()=>{toggleDone(focusTask.id);setFocusTask(null);setRunning(false);setTimeLeft(null);}}
                  style={{flex:1,padding:"14px",background:COLORS.green+"22",border:`1px solid ${COLORS.green}55`,
                    borderRadius:12,color:COLORS.green,fontWeight:700,fontSize:14}}>✓</button>
              </div>
              <button className="btn" onClick={()=>{setFocusTask(null);setRunning(false);setTimeLeft(null);}}
                style={{background:"transparent",border:"none",color:COLORS.muted,fontSize:13}}>{t.otherTask}</button>
            </div>
          )}
        </div>
      )}

      {/* ROUTINE */}
      {view==="routine"&&(
        <div style={{width:"100%",maxWidth:480}} className="slide-up">
          <div style={{background:COLORS.surface,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${COLORS.border}`}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,marginBottom:4}}>{t.routineTitle}</div>
            <div style={{fontSize:13,color:COLORS.muted,marginBottom:16}}>{t.routineDesc}</div>
            {routine.map(r=>(
              <div key={r.id} className="task-item" style={{display:"flex",alignItems:"center",gap:12,
                background:COLORS.bg,borderRadius:12,padding:"12px 14px",marginBottom:8,
                border:`1px solid ${COLORS.border}`,opacity:r.done?0.5:1}}>
                <button className="btn" onClick={()=>toggleRoutine(r.id)}
                  style={{width:22,height:22,borderRadius:6,border:`2px solid ${r.done?COLORS.green:COLORS.accent}`,
                    background:r.done?COLORS.green+"33":"transparent",flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center",color:COLORS.green,fontSize:14}}>
                  {r.done?"✓":""}
                </button>
                <span style={{flex:1,fontSize:14,textDecoration:r.done?"line-through":"none"}}>
                  {lang==="de"?r.text:r.textEn||r.text}
                </span>
                <button className="btn" onClick={()=>setRoutine(prev=>prev.filter(x=>x.id!==r.id))}
                  style={{background:"transparent",border:"none",color:COLORS.muted,fontSize:16}}>×</button>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <input value={routineInput} onChange={e=>setRoutineInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addRoutineItem()}
                placeholder={t.routinePlaceholder}
                style={{flex:1,background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:10,
                  padding:"10px 12px",color:COLORS.text,fontSize:14}}/>
              <button className="btn" onClick={addRoutineItem}
                style={{padding:"10px 16px",background:`linear-gradient(135deg,${COLORS.accent},#5b4fd4)`,
                  border:"none",borderRadius:10,color:"#fff",fontWeight:700,fontSize:14}}>+</button>
            </div>
          </div>
        </div>
      )}

      {/* EVENING */}
      {view==="evening"&&(
        <div style={{width:"100%",maxWidth:480}} className="slide-up">
          <div style={{background:COLORS.surface,borderRadius:16,padding:20,border:`1px solid ${COLORS.border}`}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,marginBottom:16}}>
              🌙 {t.eveningTitle}
            </div>
            {[[t.eveningQ1,"q1"],[t.eveningQ2,"q2"],[t.eveningQ3,"q3"]].map(([q,key])=>(
              <div key={key} style={{marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:600,color:COLORS.accentLight,marginBottom:6}}>{q}</div>
                <textarea value={eveningAnswers[key]}
                  onChange={e=>setEveningAnswers(prev=>({...prev,[key]:e.target.value}))}
                  rows={3} style={{width:"100%",background:COLORS.bg,border:`1px solid ${COLORS.border}`,
                    borderRadius:10,padding:"10px 12px",color:COLORS.text,fontSize:14,
                    fontFamily:"inherit",lineHeight:1.5}}/>
              </div>
            ))}
            <button className="btn" onClick={()=>{save("ff_evening",eveningAnswers);setEveningSaved(true);setTimeout(()=>setEveningSaved(false),2000);}}
              style={{width:"100%",padding:"12px",background:`linear-gradient(135deg,${COLORS.accent},#5b4fd4)`,
                border:"none",borderRadius:10,color:"#fff",fontWeight:700,fontSize:14}}>
              {eveningSaved?t.saved:t.save}
            </button>
          </div>
        </div>
      )}

      {/* DONE */}
      {view==="done"&&(
        <div style={{width:"100%",maxWidth:480}} className="slide-up">
          {donedTasks.length===0?(
            <div style={{textAlign:"center",color:COLORS.muted,padding:60}}>
              <div style={{fontSize:36,marginBottom:12}}>💪</div>
              <div>{t.noDone}</div>
            </div>
          ):(
            <>
              <div style={{textAlign:"center",marginBottom:16,padding:16,
                background:COLORS.green+"11",borderRadius:14,border:`1px solid ${COLORS.green}33`}}>
                <div style={{fontSize:32}}>🏆</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:COLORS.green,marginTop:4}}>
                  {donedTasks.length} {lang==="de"?`Aufgabe${donedTasks.length!==1?"n":""} erledigt!`:`task${donedTasks.length!==1?"s":""} done!`}
                </div>
              </div>
              {donedTasks.map(task=>(
                <div key={task.id} style={{background:COLORS.surface,borderRadius:14,padding:"13px 16px",
                  marginBottom:8,display:"flex",alignItems:"center",gap:12,
                  border:`1px solid ${COLORS.border}`,opacity:0.7}}>
                  <span style={{color:COLORS.green,fontSize:18}}>✓</span>
                  <span style={{flex:1,textDecoration:"line-through",color:COLORS.muted,fontSize:14}}>
                    {lang==="de"?task.text:task.textEn||task.text}
                  </span>
                  <button className="btn" onClick={()=>toggleDone(task.id)}
                    style={{background:"transparent",border:"none",color:COLORS.muted,fontSize:12}}>↩</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,textAlign:"center",padding:"10px",
        background:COLORS.bg+"ee",borderTop:`1px solid ${COLORS.border}`,fontSize:12,color:COLORS.muted}}>
        {t.tip}
      </div>
    </div>
  );
}
