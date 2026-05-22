import { useState, useEffect, useRef } from "react";

const THEMES = {
  darkPurple: { name:"🌙 Dark Purple", dark:true, bg:"#0f0f13", surface:"#1a1a24", surfaceHover:"#22222f", accent:"#7c6af7", accentLight:"#a89af9", green:"#4ade80", yellow:"#fbbf24", red:"#f87171", text:"#f0eeff", muted:"#7e7a9a", border:"#2a2a3a" },
  darkOcean:  { name:"🌊 Dark Ocean",  dark:true, bg:"#0a0f1a", surface:"#111827", surfaceHover:"#1a2535", accent:"#06b6d4", accentLight:"#67e8f9", green:"#34d399", yellow:"#fbbf24", red:"#f87171", text:"#e0f7ff", muted:"#6b8a9a", border:"#1e3040" },
  darkForest: { name:"🌿 Dark Forest", dark:true, bg:"#0a130a", surface:"#121f12", surfaceHover:"#1a2e1a", accent:"#22c55e", accentLight:"#86efac", green:"#4ade80", yellow:"#fbbf24", red:"#f87171", text:"#e8f5e8", muted:"#6b8a6b", border:"#1e3a1e" },
  lightMin:   { name:"☀️ Light",       dark:false, bg:"#f8f9fa", surface:"#ffffff", surfaceHover:"#f1f3f5", accent:"#7c6af7", accentLight:"#5b4fd4", green:"#16a34a", yellow:"#d97706", red:"#dc2626", text:"#1a1a2e", muted:"#6b7280", border:"#e5e7eb" },
  lightRose:  { name:"🌸 Light Rose",  dark:false, bg:"#fff5f7", surface:"#ffffff", surfaceHover:"#fce7ec", accent:"#e11d74", accentLight:"#be185d", green:"#16a34a", yellow:"#d97706", red:"#dc2626", text:"#1a0a10", muted:"#9d6b7a", border:"#fce7ec" },
  lightGray:  { name:"🤍 Light Gray",  dark:false, bg:"#f3f4f6", surface:"#ffffff", surfaceHover:"#e9ebee", accent:"#4f46e5", accentLight:"#4338ca", green:"#16a34a", yellow:"#d97706", red:"#dc2626", text:"#111827", muted:"#6b7280", border:"#d1d5db" },
};

const T = {
  de: {
    appName:"FocusFlow", tagline:"ADHS-freundlicher Tagesplaner",
    today:"Heute", focus:"Fokus", done:"Erledigt", routine:"Routine",
    evening:"Abend", stats:"Statistik", planned:"Geplant", week:"Woche",
    whatNow:"Was mache ich JETZT?", nextTask:"↳ Deine nächste Aufgabe:",
    markDone:"✓ Erledigt!", startFocus:"⏱ Fokus",
    addTask:"+ Aufgabe hinzufügen", addTaskPlaceholder:"Was möchtest du erledigen?",
    must:"🔥 Muss heute", important:"⚡ Wichtig", maybe:"💭 Wenn Zeit",
    mustShort:"MUSS HEUTE", importantShort:"WICHTIG", maybeShort:"WENN ZEIT",
    repeat:"Wiederholen:", never:"Nie", daily:"Täglich", weekly:"Wöchentlich",
    everyXDays:"Alle X Tage", everyXDaysLabel:"Alle", days:"Tage",
    date:"Datum:", time:"Uhrzeit:", notify:"Erinnerung:", notifyOn:"🔔 An", notifyOff:"🔕 Aus",
    twoMinBtn:"⚡ 2min", twoMinTitle:"2-Minuten-Regel",
    twoMinDesc:"Diese Aufgaben dauern unter 2 Minuten – jetzt erledigen!",
    energyQuestion:"Wie ist deine Energie heute?",
    energyHigh:"💪 Viel", energyMed:"😐 Mittel", energyLow:"😴 Wenig",
    streakLabel:"Tage in Folge",
    focusTask:"Fokus-Aufgabe", chooseTask:"Wähle eine Aufgabe:",
    ready:"Bereit", focusActive:"Fokus aktiv ✨", finished:"Fertig! 🎉",
    start:"▶ Start", again:"▶ Nochmal", pause:"⏸ Pause", reset:"↺", otherTask:"← Andere",
    allDone:"Alles erledigt!", allDoneMsg:"Fantastisch – du hast deinen Tag gemeistert!",
    noDone:"Noch nichts erledigt – aber du schaffst das!",
    todayDone:"Heute erledigt", pctDone:"% geschafft", greatJob:"🎉 Super!",
    tip:"💡 Starte klein – Bewegung hilft gegen das Festsitzen!",
    routineTitle:"Morgenroutine ☀️", routineDesc:"Feste tägliche Aufgaben",
    routineDone:"Morgenroutine abgeschlossen! 🎉",
    addRoutine:"+ Hinzufügen", routinePlaceholder:"z.B. Zähne putzen...",
    eveningTitle:"Abend-Review", eveningQ1:"Was habe ich heute geschafft?",
    eveningQ2:"Was war schwierig?", eveningQ3:"Was nehme ich mir für morgen vor?",
    save:"Speichern", saved:"✓ Gespeichert!",
    oneFocusMode:"🎯 Fokus-Modus", oneFocusOff:"👁 Alle Aufgaben",
    statsTitle:"Wochenstatistik", statsDone:"Erledigt", statsStreak:"Streak", statsTotal:"Diese Woche",
    weekTitle:"Wochenübersicht", weekNoTasks:"Keine Aufgaben",
    plannedTitle:"Geplante Aufgaben", plannedEmpty:"Keine geplanten Aufgaben",
    plannedToday:"Heute fällig!", plannedTomorrow:"Morgen fällig",
    plannedUpcoming:"Demnächst", plannedPast:"Überfällig",
    proTitle:"🚀 FocusFlow Pro", proDesc:"Schalte alle Features frei",
    proFeature1:"☁️ Geräteübergreifende Synchronisation",
    proFeature2:"📊 Erweiterte Statistiken",
    proFeature3:"🎵 Alle Fokus-Sounds",
    proFeature4:"🔔 Unbegrenzte Erinnerungen",
    proFeature5:"🎨 Alle Themes",
    proBtn:"Pro holen – 4.99€/Monat", proFree:"Kostenlos weiternutzen",
    sounds:"Sound:", soundOff:"Aus", soundRain:"🌧 Regen", soundWhite:"〰 White Noise",
    moreOptions:"▼ Datum, Wiederholung, Uhrzeit...", lessOptions:"▲ Weniger",
    tomorrow:"Morgen fällig ⚠️",
    ob_welcome:"Willkommen bei FocusFlow! 👋",
    ob_welcomeDesc:"Dein ADHS-freundlicher Tagesplaner.\nEinfach. Klar. Motivierend.",
    ob_start:"Los geht's →",
    ob_lang:"In welcher Sprache möchtest du die App nutzen?",
    ob_theme:"Wähle dein Theme:",
    ob_routine:"Richte deine Morgenroutine ein:",
    ob_routineDesc:"Wähle aus oder füge eigene hinzu:",
    ob_routineSuggestions:["Zähne putzen 🦷","Medikament nehmen 💊","Glas Wasser trinken 💧","5 Min bewegen 🏃","Frühstück essen 🥣","Tagebuch schreiben 📓"],
    ob_tasks:"Deine erste Aufgabe für heute:",
    ob_tasksDesc:"Was ist das Wichtigste, das du heute erledigen möchtest?",
    ob_finish:"FocusFlow starten 🚀", ob_skip:"Überspringen",
    ob_next:"Weiter →", ob_back:"← Zurück",
    motivations:[
      "Du schaffst das – eine Aufgabe nach der anderen! 💪",
      "Dein ADHS-Gehirn ist kreativ und stark. Los geht's! 🧠",
      "Kleine Schritte zählen genauso wie große. ✨",
      "Heute ist ein neuer Tag voller Möglichkeiten! 🌅",
      "Du musst nicht alles perfekt machen – nur anfangen! 🚀",
      "Bewegung hilft! Steh kurz auf bevor du startest. 🏃",
    ]
  },
  en: {
    appName:"FocusFlow", tagline:"ADHD-friendly day planner",
    today:"Today", focus:"Focus", done:"Done", routine:"Routine",
    evening:"Evening", stats:"Stats", planned:"Planned", week:"Week",
    whatNow:"What do I do NOW?", nextTask:"↳ Your next task:",
    markDone:"✓ Done!", startFocus:"⏱ Focus",
    addTask:"+ Add Task", addTaskPlaceholder:"What do you want to accomplish?",
    must:"🔥 Must today", important:"⚡ Important", maybe:"💭 If time",
    mustShort:"MUST TODAY", importantShort:"IMPORTANT", maybeShort:"IF TIME",
    repeat:"Repeat:", never:"Never", daily:"Daily", weekly:"Weekly",
    everyXDays:"Every X Days", everyXDaysLabel:"Every", days:"days",
    date:"Date:", time:"Time:", notify:"Reminder:", notifyOn:"🔔 On", notifyOff:"🔕 Off",
    twoMinBtn:"⚡ 2min", twoMinTitle:"2-Minute Rule",
    twoMinDesc:"These tasks take under 2 minutes – do them now!",
    energyQuestion:"How is your energy today?",
    energyHigh:"💪 High", energyMed:"😐 Medium", energyLow:"😴 Low",
    streakLabel:"days in a row",
    focusTask:"Focus Task", chooseTask:"Choose a task:",
    ready:"Ready", focusActive:"Focus active ✨", finished:"Done! 🎉",
    start:"▶ Start", again:"▶ Again", pause:"⏸ Pause", reset:"↺", otherTask:"← Back",
    allDone:"All done!", allDoneMsg:"Fantastic – you mastered your day!",
    noDone:"Nothing done yet – but you've got this!",
    todayDone:"Done today", pctDone:"% done", greatJob:"🎉 Great!",
    tip:"💡 Start small – movement helps against getting stuck!",
    routineTitle:"Morning Routine ☀️", routineDesc:"Fixed daily tasks",
    routineDone:"Morning routine complete! 🎉",
    addRoutine:"+ Add", routinePlaceholder:"e.g. Brush teeth...",
    eveningTitle:"Evening Review", eveningQ1:"What did I accomplish today?",
    eveningQ2:"What was difficult?", eveningQ3:"What's my plan for tomorrow?",
    save:"Save", saved:"✓ Saved!",
    oneFocusMode:"🎯 Focus Mode", oneFocusOff:"👁 Show all",
    statsTitle:"Weekly Stats", statsDone:"Done", statsStreak:"Streak", statsTotal:"This week",
    weekTitle:"Week Overview", weekNoTasks:"No tasks",
    plannedTitle:"Planned Tasks", plannedEmpty:"No planned tasks yet",
    plannedToday:"Due today!", plannedTomorrow:"Due tomorrow",
    plannedUpcoming:"Upcoming", plannedPast:"Overdue",
    proTitle:"🚀 FocusFlow Pro", proDesc:"Unlock all features",
    proFeature1:"☁️ Cross-device sync", proFeature2:"📊 Advanced statistics",
    proFeature3:"🎵 All focus sounds", proFeature4:"🔔 Unlimited reminders",
    proFeature5:"🎨 All themes",
    proBtn:"Get Pro – €4.99/month", proFree:"Continue for free",
    sounds:"Sound:", soundOff:"Off", soundRain:"🌧 Rain", soundWhite:"〰 White Noise",
    moreOptions:"▼ Date, repeat, time...", lessOptions:"▲ Less",
    tomorrow:"Due tomorrow ⚠️",
    ob_welcome:"Welcome to FocusFlow! 👋",
    ob_welcomeDesc:"Your ADHD-friendly day planner.\nSimple. Clear. Motivating.",
    ob_start:"Let's go →",
    ob_lang:"Which language would you like to use?",
    ob_theme:"Choose your theme:",
    ob_routine:"Set up your morning routine:",
    ob_routineDesc:"Choose from suggestions or add your own:",
    ob_routineSuggestions:["Brush teeth 🦷","Take medication 💊","Drink water 💧","5 min movement 🏃","Eat breakfast 🥣","Write journal 📓"],
    ob_tasks:"Your first task for today:",
    ob_tasksDesc:"What is the most important thing to do today?",
    ob_finish:"Start FocusFlow 🚀", ob_skip:"Skip",
    ob_next:"Next →", ob_back:"← Back",
    motivations:[
      "You've got this – one task at a time! 💪",
      "Your ADHD brain is creative and powerful. Let's go! 🧠",
      "Small steps count just as much as big ones. ✨",
      "Today is a new day full of possibilities! 🌅",
      "You don't have to be perfect – just start! 🚀",
      "Movement helps! Stand up briefly before you start. 🏃",
    ]
  }
};

const FOCUS_DURATIONS=[5,10,15,25];
const WEEKDAYS_DE=["Mo","Di","Mi","Do","Fr","Sa","So"];
const WEEKDAYS_EN=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function formatTime(s){const m=Math.floor(s/60),sec=s%60;return`${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;}
function toDateStr(d){return d.toISOString().split("T")[0];}
function todayStr(){return toDateStr(new Date());}
function tomorrowStr(){const d=new Date();d.setDate(d.getDate()+1);return toDateStr(d);}
function addDays(str,n){const d=new Date(str);d.setDate(d.getDate()+n);return toDateStr(d);}
function formatDateDisplay(str,lang){
  if(!str) return "";
  const d=new Date(str+"T12:00:00");
  return d.toLocaleDateString(lang==="de"?"de-DE":"en-US",{day:"numeric",month:"long",weekday:"short"});
}

function ProgressRing({pct,size=180,stroke=10,color,borderColor="#2a2a3a"}){
  const r=(size-stroke)/2,circ=2*Math.PI*r,offset=circ*(1-pct/100);
  return(<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={borderColor} strokeWidth={stroke}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
      strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
      style={{transition:"stroke-dashoffset 0.5s ease"}}/>
  </svg>);
}

function load(key,fb){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fb;}catch{return fb;}}
function save(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch{}}

export default function FocusFlow(){
  const [lang,setLang]=useState(()=>load("ff_lang","de"));
  const [themeKey,setThemeKey]=useState(()=>load("ff_theme","darkPurple"));
  const C=THEMES[themeKey]||THEMES.darkPurple;
  const t=T[lang];
  const motivation=useRef(null);
  if(!motivation.current) motivation.current=t.motivations[Math.floor(Math.random()*t.motivations.length)];

  const [onboarded,setOnboarded]=useState(()=>load("ff_onboarded",false));
  const [obStep,setObStep]=useState(0);
  const [obRoutine,setObRoutine]=useState([]);
  const [obRoutineCustom,setObRoutineCustom]=useState("");
  const [obTask,setObTask]=useState("");

  const [tasks,setTasks]=useState(()=>load("ff_tasks",[]));
  const [routine,setRoutine]=useState(()=>load("ff_routine",[]));
  const [input,setInput]=useState("");
  const [priority,setPriority]=useState("important");
  const [repeat,setRepeat]=useState("never");
  const [daysInterval,setDaysInterval]=useState(3);
  const [taskDate,setTaskDate]=useState("");
  const [taskTime,setTaskTime]=useState("");
  const [taskNotify,setTaskNotify]=useState(false);
  const [taskTwoMin,setTaskTwoMin]=useState(false);
  const [showAdvanced,setShowAdvanced]=useState(false);
  const [view,setView]=useState("today");
  const [focusTask,setFocusTask]=useState(null);
  const [focusDur,setFocusDur]=useState(25);
  const [timeLeft,setTimeLeft]=useState(null);
  const [running,setRunning]=useState(false);
  const [nowTask,setNowTask]=useState(null);
  const [showNow,setShowNow]=useState(false);
  const [oneFocus,setOneFocus]=useState(false);
  const [energy,setEnergy]=useState(()=>load("ff_energy",""));
  const [streak,setStreak]=useState(()=>load("ff_streak",0));
  const [lastDone,setLastDone]=useState(()=>load("ff_lastdone",""));
  const [weekStats,setWeekStats]=useState(()=>load("ff_weekstats",[0,0,0,0,0,0,0]));
  const [eveningAnswers,setEveningAnswers]=useState(()=>load("ff_evening",{q1:"",q2:"",q3:""}));
  const [eveningSaved,setEveningSaved]=useState(false);
  const [routineInput,setRoutineInput]=useState("");
  const [sound,setSound]=useState("off");
  const [showPro,setShowPro]=useState(false);
  const [showTheme,setShowTheme]=useState(false);
  const [showMotivation,setShowMotivation]=useState(true);
  const [notifyEnabled,setNotifyEnabled]=useState(false);
  const [weekOffset,setWeekOffset]=useState(0);
  const intervalRef=useRef(null);
  const audioRef=useRef(null);
  const nextId=useRef(300);

  useEffect(()=>save("ff_tasks",tasks),[tasks]);
  useEffect(()=>save("ff_routine",routine),[routine]);
  useEffect(()=>save("ff_lang",lang),[lang]);
  useEffect(()=>save("ff_theme",themeKey),[themeKey]);
  useEffect(()=>save("ff_energy",energy),[energy]);
  useEffect(()=>save("ff_streak",streak),[streak]);
  useEffect(()=>save("ff_lastdone",lastDone),[lastDone]);
  useEffect(()=>save("ff_weekstats",weekStats),[weekStats]);
  useEffect(()=>save("ff_evening",eveningAnswers),[eveningAnswers]);

  useEffect(()=>{
    const today=todayStr();
    const undone=tasks.filter(x=>!x.done&&(!x.date||x.date<=today));
    setNowTask(undone.find(x=>x.priority==="must")||undone.find(x=>x.priority==="important")||undone[0]||null);
  },[tasks]);

  useEffect(()=>{
    if(running&&timeLeft>0){intervalRef.current=setInterval(()=>setTimeLeft(x=>x-1),1000);}
    else if(timeLeft===0&&running){setRunning(false);}
    return()=>clearInterval(intervalRef.current);
  },[running,timeLeft]);

  useEffect(()=>{
    if(audioRef.current){audioRef.current.pause();audioRef.current=null;}
    if(sound==="off"||!running) return;
    const urls={rain:"https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3",
      white:"https://assets.mixkit.co/sfx/preview/mixkit-beach-waves-loop-1198.mp3"};
    if(urls[sound]){const a=new Audio(urls[sound]);a.loop=true;a.volume=0.3;a.play().catch(()=>{});audioRef.current=a;}
    return()=>{if(audioRef.current){audioRef.current.pause();audioRef.current=null;}};
  },[sound,running]);

  function updateStreak(){
    const today=new Date().toDateString();
    if(lastDone===today) return;
    const yesterday=new Date(Date.now()-86400000).toDateString();
    setStreak(s=>lastDone===yesterday?s+1:1);
    setLastDone(today);
    const dow=new Date().getDay();
    setWeekStats(prev=>{const n=[...prev];n[dow===0?6:dow-1]=(n[dow===0?6:dow-1]||0)+1;return n;});
  }

  async function requestNotify(){
    if("Notification" in window){const p=await Notification.requestPermission();setNotifyEnabled(p==="granted");}
  }

  function addTask(text=input,pri=priority,date=taskDate){
    if(!text.trim()) return;
    setTasks(prev=>[...prev,{id:nextId.current++,text:text.trim(),priority:pri,done:false,
      date:date||todayStr(),repeat,daysInterval,time:taskTime,notify:taskNotify,twoMin:taskTwoMin}]);
    setInput("");setTaskDate("");setRepeat("never");setTaskTime("");
    setTaskNotify(false);setTaskTwoMin(false);setShowAdvanced(false);
  }

  function toggleDone(id){
    setTasks(prev=>prev.map(x=>{if(x.id!==id)return x;if(!x.done)updateStreak();return{...x,done:!x.done};}));
  }
  function removeTask(id){setTasks(prev=>prev.filter(x=>x.id!==id));}
  function startFocus(task){setFocusTask(task);setTimeLeft(focusDur*60);setRunning(false);setView("focus");}
  function addRoutineItem(text=routineInput){
    if(!text.trim()) return;
    setRoutine(prev=>[...prev,{id:nextId.current++,text:text.trim(),done:false}]);
    setRoutineInput("");
  }
  function toggleRoutine(id){setRoutine(prev=>prev.map(r=>r.id===id?{...r,done:!r.done}:r));}

  function finishOnboarding(){
    const routineItems=obRoutine.map((text)=>({id:nextId.current++,text,done:false}));
    setRoutine(routineItems);
    if(obTask.trim()) setTasks([{id:nextId.current++,text:obTask.trim(),priority:"must",done:false,
      date:todayStr(),repeat:"never",daysInterval:1,time:"",notify:false,twoMin:false}]);
    save("ff_onboarded",true);
    setOnboarded(true);
  }

  // Week helpers
  function getWeekDates(offset=0){
    const now=new Date();
    const dow=now.getDay()===0?6:now.getDay()-1;
    const monday=new Date(now);
    monday.setDate(now.getDate()-dow+(offset*7));
    return Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return toDateStr(d);});
  }

  const PRIORITIES=[{label:t.must,value:"must",color:C.red},{label:t.important,value:"important",color:C.yellow},{label:t.maybe,value:"maybe",color:C.muted}];
  const PRIORITY_LABELS={must:t.mustShort,important:t.importantShort,maybe:t.maybeShort};

  const today=todayStr();
  const tomorrow=tomorrowStr();

  // Today tasks = tasks with date <= today and not done
  const todayTasks=tasks.filter(x=>!x.done&&(!x.date||x.date<=today));
  const twoMinTasks=todayTasks.filter(x=>x.twoMin);
  const donedTasks=tasks.filter(x=>x.done);
  const totalToday=tasks.filter(x=>!x.date||x.date<=today).length;
  const doneToday=tasks.filter(x=>x.done&&(!x.date||x.date<=today)).length;
  const pct=totalToday?Math.round((doneToday/totalToday)*100):0;
  const timerPct=timeLeft!=null?Math.round(((focusDur*60-timeLeft)/(focusDur*60))*100):0;
  const displayTasks=oneFocus&&nowTask?[nowTask]:todayTasks.filter(x=>!x.twoMin);
  const routineAllDone=routine.length>0&&routine.every(r=>r.done);
  const maxStat=Math.max(...weekStats,1);
  const dayLabels=lang==="de"?WEEKDAYS_DE:WEEKDAYS_EN;

  // Planned = future tasks
  const futureTasks=tasks.filter(x=>!x.done&&x.date&&x.date>today).sort((a,b)=>a.date.localeCompare(b.date));
  const overdueTasks=tasks.filter(x=>!x.done&&x.date&&x.date<today);

  const base={fontFamily:"'DM Sans','Segoe UI',sans-serif",minHeight:"100vh",background:C.bg,color:C.text};

  // ── ONBOARDING ──────────────────────────────────────────────────────────────
  if(!onboarded){
    const suggestions=t.ob_routineSuggestions;
    return(
      <div style={{...base,color:C.text,display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:"24px 20px",
        backgroundImage:`radial-gradient(ellipse at 30% 20%,${C.accent}22 0%,transparent 60%)`}}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');
          *{box-sizing:border-box;margin:0;padding:0;}
          .btn{transition:all 0.2s;cursor:pointer;border:none;}.btn:hover{opacity:0.85;transform:translateY(-1px);}
          @keyframes slide-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          .su{animation:slide-up 0.4s ease forwards;}
          input{outline:none;}
          input::placeholder{color:${C.muted};}
          input{color:${C.text} !important; background:${C.surface};}
          h1,h2,h3,p,span,div{color:inherit;}
        `}</style>
        <div style={{width:"100%",maxWidth:420}} className="su">
          {obStep>0&&(
            <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:24}}>
              {[0,1,2,3].map(i=>(
                <div key={i} style={{width:i===obStep-1?24:8,height:8,borderRadius:99,
                  background:i<obStep?C.accent:C.border,transition:"all 0.3s"}}/>
              ))}
            </div>
          )}

          {obStep===0&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:64,marginBottom:16}}>🧠</div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,marginBottom:12,color:C.text}}>
                <span style={{color:C.accent}}>Focus</span><span style={{color:C.text}}>Flow</span>
              </h1>
              <p style={{fontSize:15,color:C.muted,lineHeight:1.7,marginBottom:32,whiteSpace:"pre-line"}}>{t.ob_welcomeDesc}</p>
              <button className="btn" onClick={()=>setObStep(1)}
                style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${C.accent},${C.accent}bb)`,
                  borderRadius:16,color:"#fff",fontWeight:700,fontSize:17}}>{t.ob_start}</button>
            </div>
          )}

          {obStep===1&&(
            <div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,marginBottom:20,color:C.text}}>{t.ob_lang}</h2>
              <div style={{display:"flex",gap:12}}>
                {[["de","🇩🇪 Deutsch"],["en","🇬🇧 English"]].map(([l,label])=>(
                  <button key={l} className="btn" onClick={()=>setLang(l)}
                    style={{flex:1,padding:"20px",borderRadius:16,fontSize:16,fontWeight:700,
                      border:`2px solid ${lang===l?C.accent:C.border}`,
                      background:lang===l?C.accent+"22":"transparent",
                      color:lang===l?C.accent:C.muted}}>{label}</button>
                ))}
              </div>
              <button className="btn" onClick={()=>setObStep(2)}
                style={{width:"100%",marginTop:24,padding:"14px",
                  background:`linear-gradient(135deg,${C.accent},${C.accent}bb)`,
                  borderRadius:14,color:"#fff",fontWeight:700}}>{t.ob_next}</button>
            </div>
          )}

          {obStep===2&&(
            <div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,marginBottom:16,color:C.text}}>{t.ob_theme}</h2>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {Object.entries(THEMES).map(([key,th])=>(
                  <button key={key} className="btn" onClick={()=>setThemeKey(key)}
                    style={{padding:"14px 6px",borderRadius:12,border:`2px solid ${themeKey===key?th.accent:C.border}`,
                      background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,${th.accent},${th.bg})`}}/>
                    <span style={{fontSize:10,fontWeight:600,color:th.text}}>{th.name.split(" ").slice(1).join(" ")}</span>
                    {themeKey===key&&<span style={{fontSize:12,color:th.accent}}>✓</span>}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:10,marginTop:20}}>
                <button className="btn" onClick={()=>setObStep(1)}
                  style={{flex:1,padding:"12px",background:C.surface,border:`1px solid ${C.border}`,
                    borderRadius:12,color:C.muted,fontWeight:600}}>{t.ob_back}</button>
                <button className="btn" onClick={()=>setObStep(3)}
                  style={{flex:2,padding:"12px",background:`linear-gradient(135deg,${C.accent},${C.accent}bb)`,
                    borderRadius:12,color:"#fff",fontWeight:700}}>{t.ob_next}</button>
              </div>
            </div>
          )}

          {obStep===3&&(
            <div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,marginBottom:4,color:C.text}}>{t.ob_routine}</h2>
              <p style={{fontSize:13,color:C.muted,marginBottom:14}}>{t.ob_routineDesc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
                {suggestions.map((s,i)=>{
                  const sel=obRoutine.includes(s);
                  return(<button key={i} className="btn" onClick={()=>setObRoutine(prev=>sel?prev.filter(x=>x!==s):[...prev,s])}
                    style={{padding:"7px 12px",borderRadius:20,fontSize:13,fontWeight:600,
                      border:`1.5px solid ${sel?C.accent:C.border}`,
                      background:sel?C.accent+"22":"transparent",
                      color:sel?C.accent:C.muted}}>{s}</button>);
                })}
              </div>
              <div style={{display:"flex",gap:7,marginBottom:14}}>
                <input value={obRoutineCustom} onChange={e=>setObRoutineCustom(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&obRoutineCustom.trim()){setObRoutine(prev=>[...prev,obRoutineCustom.trim()]);setObRoutineCustom("");}}}
                  placeholder={t.routinePlaceholder}
                  style={{flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,
                    padding:"9px 12px",color:C.text,fontSize:13}}/>
                <button className="btn" onClick={()=>{if(obRoutineCustom.trim()){setObRoutine(prev=>[...prev,obRoutineCustom.trim()]);setObRoutineCustom("");}}}
                  style={{padding:"9px 14px",background:C.accent,borderRadius:9,color:"#fff",fontWeight:700}}>+</button>
              </div>
              {obRoutine.length>0&&obRoutine.map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,
                  background:C.surface,borderRadius:9,padding:"7px 11px",border:`1px solid ${C.border}`}}>
                  <span style={{flex:1,fontSize:13}}>✓ {r}</span>
                  <button className="btn" onClick={()=>setObRoutine(prev=>prev.filter((_,j)=>j!==i))}
                    style={{background:"transparent",color:C.muted,fontSize:14}}>×</button>
                </div>
              ))}
              <div style={{display:"flex",gap:10,marginTop:12}}>
                <button className="btn" onClick={()=>setObStep(2)}
                  style={{flex:1,padding:"11px",background:C.surface,border:`1px solid ${C.border}`,
                    borderRadius:11,color:C.muted,fontWeight:600}}>{t.ob_back}</button>
                <button className="btn" onClick={()=>setObStep(4)}
                  style={{flex:2,padding:"11px",background:`linear-gradient(135deg,${C.accent},${C.accent}bb)`,
                    borderRadius:11,color:"#fff",fontWeight:700}}>{t.ob_next}</button>
              </div>
            </div>
          )}

          {obStep===4&&(
            <div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,marginBottom:4,color:C.text}}>{t.ob_tasks}</h2>
              <p style={{fontSize:13,color:C.muted,marginBottom:14}}>{t.ob_tasksDesc}</p>
              <input value={obTask} onChange={e=>setObTask(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&finishOnboarding()}
                placeholder={t.addTaskPlaceholder}
                style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,
                  padding:"13px 15px",color:C.text,fontSize:15,marginBottom:16}}/>
              <div style={{display:"flex",gap:10}}>
                <button className="btn" onClick={()=>setObStep(3)}
                  style={{flex:1,padding:"11px",background:C.surface,border:`1px solid ${C.border}`,
                    borderRadius:11,color:C.muted,fontWeight:600}}>{t.ob_back}</button>
                <button className="btn" onClick={finishOnboarding}
                  style={{flex:2,padding:"13px",background:`linear-gradient(135deg,${C.accent},${C.accent}bb)`,
                    borderRadius:13,color:"#fff",fontWeight:700,fontSize:15}}>{t.ob_finish}</button>
              </div>
              <button className="btn" onClick={finishOnboarding}
                style={{width:"100%",marginTop:8,background:"transparent",color:C.muted,fontSize:13}}>{t.ob_skip}</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN APP ────────────────────────────────────────────────────────────────
  return(
    <div style={{...base,display:"flex",flexDirection:"column",alignItems:"center",
      padding:"18px 14px 80px",
      backgroundImage:`radial-gradient(ellipse at 20% 10%,${C.accent}15 0%,transparent 50%)`}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#555;border-radius:2px;}
        .ti{transition:background 0.15s;}.ti:hover{background:${C.surfaceHover}!important;}
        .btn{transition:all 0.2s;cursor:pointer;border:none;}.btn:hover{opacity:0.85;transform:translateY(-1px);}
        @keyframes slide-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .su{animation:slide-up 0.3s ease forwards;}
        input,textarea{outline:none;}input::placeholder,textarea::placeholder{color:${C.muted};}
        textarea{resize:vertical;font-family:inherit;}
      `}</style>

      {/* Modals */}
      {showPro&&(
        <div style={{position:"fixed",inset:0,background:"#000a",zIndex:100,display:"flex",
          alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:C.surface,borderRadius:22,padding:26,maxWidth:380,width:"100%",
            border:`1px solid ${C.accent}44`}} className="su">
            <div style={{textAlign:"center",marginBottom:18}}>
              <div style={{fontSize:38}}>⭐</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginTop:8}}>{t.proTitle}</div>
              <div style={{color:C.muted,fontSize:13,marginTop:3}}>{t.proDesc}</div>
            </div>
            {[t.proFeature1,t.proFeature2,t.proFeature3,t.proFeature4,t.proFeature5].map((f,i)=>(
              <div key={i} style={{padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>{f}</div>
            ))}
            <button className="btn" onClick={()=>setShowPro(false)}
              style={{width:"100%",marginTop:16,padding:"13px",
                background:`linear-gradient(135deg,${C.accent},${C.accent}bb)`,
                borderRadius:11,color:"#fff",fontWeight:700,fontSize:14}}>{t.proBtn}</button>
            <button className="btn" onClick={()=>setShowPro(false)}
              style={{width:"100%",marginTop:7,padding:"9px",background:"transparent",
                color:C.muted,fontSize:12}}>{t.proFree}</button>
          </div>
        </div>
      )}

      {showTheme&&(
        <div style={{position:"fixed",inset:0,background:"#000a",zIndex:100,display:"flex",
          alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:C.surface,borderRadius:22,padding:22,maxWidth:360,width:"100%",
            border:`1px solid ${C.border}`}} className="su">
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,marginBottom:14}}>🎨 Theme</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
              {Object.entries(THEMES).map(([key,th])=>(
                <button key={key} className="btn" onClick={()=>setThemeKey(key)}
                  style={{padding:"13px 5px",borderRadius:11,border:`2px solid ${themeKey===key?th.accent:C.border}`,
                    background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${th.accent},${th.bg})`}}/>
                  <span style={{fontSize:10,fontWeight:600,color:th.text}}>{th.name.split(" ").slice(1).join(" ")}</span>
                  {themeKey===key&&<span style={{fontSize:11,color:th.accent}}>✓</span>}
                </button>
              ))}
            </div>
            <button className="btn" onClick={()=>setShowTheme(false)}
              style={{width:"100%",padding:"11px",background:C.accent,borderRadius:11,color:"#fff",fontWeight:700}}>
              ✓ {lang==="de"?"Fertig":"Done"}
            </button>
          </div>
        </div>
      )}

      {/* Motivation banner */}
      {showMotivation&&(
        <div style={{width:"100%",maxWidth:480,marginBottom:12,padding:"11px 14px",
          background:`${C.accent}18`,borderRadius:12,border:`1px solid ${C.accent}28`,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:13,flex:1,color:C.text}}>{motivation.current}</span>
          <button className="btn" onClick={()=>setShowMotivation(false)}
            style={{background:"transparent",color:C.muted,fontSize:17,marginLeft:8}}>×</button>
        </div>
      )}

      {/* Header */}
      <div style={{width:"100%",maxWidth:480,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,letterSpacing:"-0.5px"}}>
              <span style={{color:C.accent}}>Focus</span><span style={{color:C.text}}>Flow</span>
            </h1>
            <p style={{color:C.muted,fontSize:12,marginTop:1}}>
              {new Date().toLocaleDateString(lang==="de"?"de-DE":"en-US",{weekday:"long",day:"numeric",month:"long"})}
            </p>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
            <div style={{display:"flex",gap:5}}>
              <button className="btn" onClick={()=>setLang(l=>l==="de"?"en":"de")}
                style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,
                  padding:"4px 8px",color:C.muted,fontSize:10}}>{lang==="de"?"🇬🇧 EN":"🇩🇪 DE"}</button>
              <button className="btn" onClick={()=>setShowTheme(true)}
                style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,
                  padding:"4px 8px",color:C.muted,fontSize:10}}>🎨</button>
              <button className="btn" onClick={()=>setShowPro(true)}
                style={{background:`${C.accent}22`,border:`1px solid ${C.accent}44`,borderRadius:7,
                  padding:"4px 8px",color:C.accentLight,fontSize:10}}>⭐ Pro</button>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:C.muted}}>{t.todayDone}</div>
              <div style={{fontSize:20,fontFamily:"'Syne',sans-serif",fontWeight:800,
                color:doneToday>0?C.green:C.muted}}>{doneToday}/{totalToday}</div>
            </div>
          </div>
        </div>
        <div style={{marginTop:9,height:5,background:C.border,borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:99,width:`${pct}%`,
            background:`linear-gradient(90deg,${C.accent},${C.green})`,transition:"width 0.6s ease"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
          <span style={{fontSize:10,color:C.muted}}>{pct}{t.pctDone}</span>
          {streak>0&&<span style={{fontSize:10,color:C.yellow}}>🔥 {streak} {t.streakLabel}</span>}
          {doneToday>0&&<span style={{fontSize:10,color:C.green}}>{t.greatJob}</span>}
        </div>
      </div>

      {/* Nav – two rows */}
      <div style={{width:"100%",maxWidth:480,marginBottom:12,display:"flex",flexDirection:"column",gap:4}}>
        {[
          [["today","📋 "+t.today],["planned","📅 "+t.planned],["week","📆 "+t.week],["focus","⏱ "+t.focus]],
          [["routine","🌅 "+t.routine],["stats","📊 "+t.stats],["evening","🌙 "+t.evening],["done","✅ "+t.done]]
        ].map((row,ri)=>(
          <div key={ri} style={{display:"flex",gap:4}}>
            {row.map(([v,label])=>(
              <button key={v} className="btn" onClick={()=>setView(v)}
                style={{flex:1,padding:"8px 4px",borderRadius:9,fontSize:11,fontWeight:600,
                  whiteSpace:"nowrap",background:view===v?C.accent:C.surface,
                  color:view===v?"#fff":C.muted}}>{label}</button>
            ))}
          </div>
        ))}
      </div>

      {/* ── TODAY ── */}
      {view==="today"&&(
        <div style={{width:"100%",maxWidth:480}} className="su">

          {/* Morning Routine – shown until all done */}
          {routine.length>0&&!routineAllDone&&(
            <div style={{background:C.surface,borderRadius:14,padding:14,marginBottom:12,
              border:`1px solid ${C.accent}33`,borderLeft:`3px solid ${C.accent}`}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:10,color:C.accent}}>{t.routineTitle}</div>
              {routine.map(r=>(
                <div key={r.id} style={{display:"flex",alignItems:"center",gap:9,marginBottom:7,
                  opacity:r.done?0.4:1,transition:"opacity 0.3s"}}>
                  <button className="btn" onClick={()=>toggleRoutine(r.id)}
                    style={{width:20,height:20,borderRadius:5,flexShrink:0,
                      border:`2px solid ${r.done?C.green:C.accent}`,
                      background:r.done?C.green+"33":"transparent",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      color:C.green,fontSize:12}}>{r.done?"✓":""}</button>
                  <span style={{fontSize:13,textDecoration:r.done?"line-through":"none"}}>{r.text}</span>
                </div>
              ))}
              <div style={{marginTop:8,height:3,background:C.border,borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:99,
                  width:`${Math.round((routine.filter(r=>r.done).length/routine.length)*100)}%`,
                  background:`linear-gradient(90deg,${C.accent},${C.green})`,transition:"width 0.4s"}}/>
              </div>
            </div>
          )}

          {/* Routine done celebration */}
          {routineAllDone&&routine.length>0&&(
            <div style={{background:C.green+"18",borderRadius:12,padding:"11px 14px",marginBottom:12,
              border:`1px solid ${C.green}44`,textAlign:"center",fontSize:13,color:C.green,fontWeight:600}}>
              {t.routineDone}
            </div>
          )}

          {/* Overdue warning */}
          {overdueTasks.length>0&&(
            <div style={{background:C.red+"15",borderRadius:12,padding:"10px 14px",marginBottom:12,
              border:`1px solid ${C.red}44`}}>
              <div style={{fontSize:12,fontWeight:700,color:C.red,marginBottom:6}}>⚠️ {t.plannedPast}</div>
              {overdueTasks.map(task=>(
                <div key={task.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,
                  background:C.surface,borderRadius:9,padding:"8px 11px",border:`1px solid ${C.border}`}}>
                  <span style={{flex:1,fontSize:12,color:C.text}}>{task.text}</span>
                  <span style={{fontSize:10,color:C.red}}>{formatDateDisplay(task.date,lang)}</span>
                  <button className="btn" onClick={()=>toggleDone(task.id)}
                    style={{padding:"4px 8px",background:C.green+"22",border:`1px solid ${C.green}44`,
                      borderRadius:7,color:C.green,fontSize:11,fontWeight:600}}>{t.markDone}</button>
                </div>
              ))}
            </div>
          )}

          {/* Energy */}
          {!energy&&(
            <div style={{background:C.surface,borderRadius:13,padding:13,marginBottom:12,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>{t.energyQuestion}</div>
              <div style={{display:"flex",gap:8}}>
                {[["high",t.energyHigh,C.green],["med",t.energyMed,C.yellow],["low",t.energyLow,C.muted]].map(([v,label,col])=>(
                  <button key={v} className="btn" onClick={()=>setEnergy(v)}
                    style={{flex:1,padding:"9px 4px",borderRadius:9,border:`1.5px solid ${col}44`,
                      background:`${col}11`,color:col,fontWeight:600,fontSize:12}}>{label}</button>
                ))}
              </div>
            </div>
          )}

          {/* 2-min tasks */}
          {twoMinTasks.length>0&&(
            <div style={{background:`${C.yellow}11`,borderRadius:13,padding:13,marginBottom:12,
              border:`1px solid ${C.yellow}33`}}>
              <div style={{fontSize:12,fontWeight:700,color:C.yellow,marginBottom:5}}>⚡ {t.twoMinTitle}</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:9}}>{t.twoMinDesc}</div>
              {twoMinTasks.map(task=>(
                <div key={task.id} style={{display:"flex",alignItems:"center",gap:7,marginBottom:6,
                  background:C.surface,borderRadius:9,padding:"8px 11px",border:`1px solid ${C.border}`}}>
                  <span style={{flex:1,fontSize:13}}>{task.text}</span>
                  <button className="btn" onClick={()=>toggleDone(task.id)}
                    style={{padding:"5px 9px",background:C.green+"22",border:`1px solid ${C.green}44`,
                      borderRadius:7,color:C.green,fontSize:11,fontWeight:600}}>{t.markDone}</button>
                </div>
              ))}
            </div>
          )}

          {/* What now */}
          {nowTask&&(
            <div style={{marginBottom:12}}>
              <button className="btn" onClick={()=>setShowNow(s=>!s)}
                style={{width:"100%",padding:"12px 15px",
                  background:`linear-gradient(135deg,${C.accent}22,${C.accent}44)`,
                  border:`1.5px solid ${C.accent}55`,borderRadius:13,color:C.text,
                  fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,
                  display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span>🎯 {t.whatNow}</span><span style={{fontSize:11}}>{showNow?"▲":"▼"}</span>
              </button>
              {showNow&&(
                <div style={{marginTop:7,padding:"13px 15px",background:C.surface,
                  borderRadius:11,border:`1px solid ${C.accent}33`}} className="su">
                  <div style={{fontSize:11,color:C.accentLight,marginBottom:4,fontWeight:500}}>{t.nextTask}</div>
                  <div style={{fontSize:15,fontWeight:700,marginBottom:9}}>{nowTask.text}</div>
                  <div style={{display:"flex",gap:7}}>
                    <button className="btn" onClick={()=>{toggleDone(nowTask.id);setShowNow(false);}}
                      style={{flex:1,padding:"8px",background:C.green+"22",border:`1px solid ${C.green}44`,
                        borderRadius:8,color:C.green,fontWeight:600,fontSize:12}}>{t.markDone}</button>
                    <button className="btn" onClick={()=>startFocus(nowTask)}
                      style={{flex:1,padding:"8px",background:C.accent+"22",border:`1px solid ${C.accent}44`,
                        borderRadius:8,color:C.accentLight,fontWeight:600,fontSize:12}}>{t.startFocus}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* One focus toggle */}
          <button className="btn" onClick={()=>setOneFocus(f=>!f)}
            style={{width:"100%",marginBottom:10,padding:"8px",
              background:oneFocus?C.accent+"33":C.surface,
              border:`1px solid ${oneFocus?C.accent:C.border}`,borderRadius:10,
              color:oneFocus?C.accentLight:C.muted,fontWeight:600,fontSize:11}}>
            {oneFocus?t.oneFocusOff:t.oneFocusMode}
          </button>

          {/* Add task */}
          <div style={{background:C.surface,borderRadius:15,padding:13,marginBottom:14,border:`1px solid ${C.border}`}}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&addTask()}
              placeholder={t.addTaskPlaceholder}
              style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,
                padding:"10px 12px",color:C.text,fontSize:14,marginBottom:7}}/>
            <div style={{display:"flex",gap:5,marginBottom:7}}>
              {PRIORITIES.map(p=>(
                <button key={p.value} className="btn" onClick={()=>setPriority(p.value)}
                  style={{flex:1,padding:"6px 2px",borderRadius:7,fontSize:10,fontWeight:600,
                    border:`1.5px solid ${priority===p.value?p.color:C.border}`,
                    background:priority===p.value?p.color+"22":"transparent",
                    color:priority===p.value?p.color:C.muted}}>{p.label}</button>
              ))}
            </div>
            <button className="btn" onClick={()=>setShowAdvanced(a=>!a)}
              style={{width:"100%",padding:"6px",background:"transparent",
                border:`1px dashed ${C.border}`,borderRadius:7,
                color:C.muted,fontSize:11,marginBottom:showAdvanced?7:0}}>
              {showAdvanced?t.lessOptions:t.moreOptions}
            </button>
            {showAdvanced&&(
              <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:7}} className="su">
                {/* Date picker */}
                <div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:3}}>{t.date}</div>
                  <input type="date" value={taskDate} onChange={e=>setTaskDate(e.target.value)}
                    min={todayStr()}
                    style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                      padding:"7px",color:C.text,fontSize:12}}/>
                </div>
                {/* Repeat */}
                <div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:3}}>{t.repeat}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {[["never",t.never],["daily",t.daily],["weekly",t.weekly],["interval",t.everyXDays]].map(([v,label])=>(
                      <button key={v} className="btn" onClick={()=>setRepeat(v)}
                        style={{padding:"4px 8px",borderRadius:7,fontSize:11,fontWeight:600,
                          border:`1px solid ${repeat===v?C.accent:C.border}`,
                          background:repeat===v?C.accent+"22":"transparent",
                          color:repeat===v?C.accentLight:C.muted}}>{label}</button>
                    ))}
                  </div>
                  {repeat==="interval"&&(
                    <div style={{display:"flex",alignItems:"center",gap:7,marginTop:5}}>
                      <span style={{fontSize:11,color:C.muted}}>{t.everyXDaysLabel}</span>
                      <input type="number" min={2} max={30} value={daysInterval}
                        onChange={e=>setDaysInterval(Number(e.target.value))}
                        style={{width:48,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,
                          padding:"4px",color:C.text,fontSize:12,textAlign:"center"}}/>
                      <span style={{fontSize:11,color:C.muted}}>{t.days}</span>
                    </div>
                  )}
                </div>
                {/* Time + flags */}
                <div style={{display:"flex",gap:6,alignItems:"flex-end"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:C.muted,marginBottom:3}}>{t.time}</div>
                    <input type="time" value={taskTime} onChange={e=>setTaskTime(e.target.value)}
                      style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,
                        padding:"6px",color:C.text,fontSize:12}}/>
                  </div>
                  <button className="btn" onClick={()=>{if(!notifyEnabled)requestNotify();setTaskNotify(n=>!n);}}
                    style={{padding:"6px 10px",borderRadius:7,border:`1px solid ${taskNotify?C.accent:C.border}`,
                      background:taskNotify?C.accent+"22":"transparent",
                      color:taskNotify?C.accentLight:C.muted,fontSize:11,fontWeight:600}}>
                    {taskNotify?t.notifyOn:t.notifyOff}
                  </button>
                  <button className="btn" onClick={()=>setTaskTwoMin(n=>!n)}
                    style={{padding:"6px 10px",borderRadius:7,border:`1px solid ${taskTwoMin?C.yellow:C.border}`,
                      background:taskTwoMin?C.yellow+"22":"transparent",
                      color:taskTwoMin?C.yellow:C.muted,fontSize:11,fontWeight:600}}>{t.twoMinBtn}</button>
                </div>
              </div>
            )}
            <button className="btn" onClick={()=>addTask()}
              style={{width:"100%",marginTop:9,padding:"10px",
                background:`linear-gradient(135deg,${C.accent},${C.accent}bb)`,
                borderRadius:9,color:"#fff",fontWeight:700,fontSize:13}}>{t.addTask}</button>
          </div>

          {/* Task groups */}
          {["must","important","maybe"].map(pv=>{
            const group=displayTasks.filter(x=>x.priority===pv);
            if(!group.length) return null;
            const col=PRIORITIES.find(p=>p.value===pv).color;
            return(
              <div key={pv} style={{marginBottom:13}}>
                <div style={{fontSize:10,fontWeight:700,color:col,marginBottom:5,paddingLeft:3,letterSpacing:"0.06em"}}>
                  {PRIORITY_LABELS[pv]}
                </div>
                {group.map(task=>(
                  <div key={task.id} className="ti" style={{background:C.surface,borderRadius:11,
                    padding:"10px 11px",marginBottom:5,display:"flex",alignItems:"center",gap:7,
                    border:`1px solid ${C.border}`,borderLeft:`3px solid ${col}`}}>
                    <button className="btn" onClick={()=>toggleDone(task.id)}
                      style={{width:19,height:19,borderRadius:5,border:`2px solid ${col}`,
                        background:"transparent",flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.text}</div>
                      <div style={{display:"flex",gap:5,marginTop:2,flexWrap:"wrap"}}>
                        {task.time&&<span style={{fontSize:10,color:C.muted}}>⏰ {task.time}</span>}
                        {task.repeat!=="never"&&<span style={{fontSize:10,color:C.accentLight}}>🔄</span>}
                        {task.notify&&<span style={{fontSize:10,color:C.green}}>🔔</span>}
                        {task.twoMin&&<span style={{fontSize:10,color:C.yellow}}>⚡</span>}
                      </div>
                    </div>
                    <button className="btn" onClick={()=>startFocus(task)}
                      style={{background:C.accent+"22",borderRadius:6,padding:"3px 6px",
                        color:C.accentLight,fontSize:10,fontWeight:600}}>⏱</button>
                    <button className="btn" onClick={()=>removeTask(task.id)}
                      style={{background:"transparent",color:C.muted,fontSize:14,padding:"0 1px"}}>×</button>
                  </div>
                ))}
              </div>
            );
          })}
          {displayTasks.length===0&&twoMinTasks.length===0&&overdueTasks.length===0&&(
            <div style={{textAlign:"center",padding:"32px 20px"}}>
              <div style={{fontSize:36,marginBottom:9}}>🎉</div>
              <div style={{fontWeight:700,fontSize:16,color:C.text}}>{t.allDone}</div>
              <div style={{fontSize:12,marginTop:4,color:C.muted}}>{t.allDoneMsg}</div>
            </div>
          )}
        </div>
      )}

      {/* ── PLANNED ── */}
      {view==="planned"&&(
        <div style={{width:"100%",maxWidth:480}} className="su">
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,marginBottom:14,color:C.text}}>
            📅 {t.plannedTitle}
          </div>

          {/* Quick add with date */}
          <div style={{background:C.surface,borderRadius:14,padding:13,marginBottom:14,border:`1px solid ${C.border}`}}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              placeholder={t.addTaskPlaceholder}
              style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,
                padding:"10px 12px",color:C.text,fontSize:13,marginBottom:7}}/>
            <div style={{display:"flex",gap:7,marginBottom:7}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:3}}>{t.date}</div>
                <input type="date" value={taskDate} onChange={e=>setTaskDate(e.target.value)}
                  min={tomorrowStr()}
                  style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                    padding:"7px",color:C.text,fontSize:12}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:3}}>{t.time}</div>
                <input type="time" value={taskTime} onChange={e=>setTaskTime(e.target.value)}
                  style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                    padding:"7px",color:C.text,fontSize:12}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:5,marginBottom:8}}>
              {PRIORITIES.map(p=>(
                <button key={p.value} className="btn" onClick={()=>setPriority(p.value)}
                  style={{flex:1,padding:"6px 2px",borderRadius:7,fontSize:10,fontWeight:600,
                    border:`1.5px solid ${priority===p.value?p.color:C.border}`,
                    background:priority===p.value?p.color+"22":"transparent",
                    color:priority===p.value?p.color:C.muted}}>{p.label}</button>
              ))}
            </div>
            <button className="btn" onClick={()=>addTask(input,priority,taskDate||tomorrowStr())}
              style={{width:"100%",padding:"10px",background:`linear-gradient(135deg,${C.accent},${C.accent}bb)`,
                borderRadius:9,color:"#fff",fontWeight:700,fontSize:13}}>{t.addTask}</button>
          </div>

          {/* Tomorrow */}
          {tasks.filter(x=>!x.done&&x.date===tomorrow).length>0&&(
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:C.yellow,marginBottom:6}}>⚠️ {t.plannedTomorrow}</div>
              {tasks.filter(x=>!x.done&&x.date===tomorrow).map(task=>(
                <div key={task.id} className="ti" style={{background:C.surface,borderRadius:11,
                  padding:"10px 12px",marginBottom:5,display:"flex",alignItems:"center",gap:8,
                  border:`1px solid ${C.yellow}44`,borderLeft:`3px solid ${C.yellow}`}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500}}>{task.text}</div>
                    {task.time&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>⏰ {task.time}</div>}
                  </div>
                  <button className="btn" onClick={()=>removeTask(task.id)}
                    style={{background:"transparent",color:C.muted,fontSize:14}}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming grouped by date */}
          {futureTasks.filter(x=>x.date!==tomorrow).length>0?(
            (() => {
              const grouped={};
              futureTasks.filter(x=>x.date!==tomorrow).forEach(task=>{
                if(!grouped[task.date]) grouped[task.date]=[];
                grouped[task.date].push(task);
              });
              return Object.entries(grouped).map(([date,taskGroup])=>(
                <div key={date} style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.accentLight,marginBottom:6}}>
                    📅 {formatDateDisplay(date,lang)}
                  </div>
                  {taskGroup.map(task=>(
                    <div key={task.id} className="ti" style={{background:C.surface,borderRadius:11,
                      padding:"10px 12px",marginBottom:5,display:"flex",alignItems:"center",gap:8,
                      border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.accent}`}}>
                      <button className="btn" onClick={()=>toggleDone(task.id)}
                        style={{width:18,height:18,borderRadius:4,border:`2px solid ${C.accent}`,
                          background:"transparent",flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:500}}>{task.text}</div>
                        <div style={{display:"flex",gap:5,marginTop:2}}>
                          {task.time&&<span style={{fontSize:10,color:C.muted}}>⏰ {task.time}</span>}
                          {task.repeat!=="never"&&<span style={{fontSize:10,color:C.accentLight}}>🔄</span>}
                        </div>
                      </div>
                      <button className="btn" onClick={()=>removeTask(task.id)}
                        style={{background:"transparent",color:C.muted,fontSize:14}}>×</button>
                    </div>
                  ))}
                </div>
              ));
            })()
          ):(
            futureTasks.filter(x=>x.date!==tomorrow).length===0&&futureTasks.filter(x=>x.date===tomorrow).length===0&&(
              <div style={{textAlign:"center",padding:"30px",color:C.muted,fontSize:13}}>
                📅 {t.plannedEmpty}
              </div>
            )
          )}
        </div>
      )}

      {/* ── WEEK ── */}
      {view==="week"&&(
        <div style={{width:"100%",maxWidth:480}} className="su">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <button className="btn" onClick={()=>setWeekOffset(w=>w-1)}
              style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,
                padding:"7px 12px",color:C.muted,fontWeight:600}}>←</button>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:C.text}}>
              📆 {t.weekTitle} {weekOffset===0?"("+( lang==="de"?"Diese Woche":"This week")+")"
                :weekOffset===1?"("+( lang==="de"?"Nächste Woche":"Next week")+")"
                :weekOffset===-1?"("+(lang==="de"?"Letzte Woche":"Last week")+")"
                :""}
            </div>
            <button className="btn" onClick={()=>setWeekOffset(w=>w+1)}
              style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,
                padding:"7px 12px",color:C.muted,fontWeight:600}}>→</button>
          </div>
          {getWeekDates(weekOffset).map((dateStr,i)=>{
            const isToday=dateStr===today;
            const dayTasks=tasks.filter(x=>x.date===dateStr);
            const doneDayTasks=dayTasks.filter(x=>x.done);
            return(
              <div key={dateStr} style={{marginBottom:8,background:C.surface,borderRadius:13,
                border:`1px solid ${isToday?C.accent:C.border}`,
                borderLeft:`3px solid ${isToday?C.accent:C.border}`,overflow:"hidden"}}>
                <div style={{padding:"10px 13px",display:"flex",justifyContent:"space-between",alignItems:"center",
                  background:isToday?C.accent+"18":"transparent"}}>
                  <div>
                    <span style={{fontSize:12,fontWeight:700,color:isToday?C.accent:C.text}}>
                      {dayLabels[i]} {new Date(dateStr+"T12:00:00").getDate()}.
                    </span>
                    {isToday&&<span style={{fontSize:10,color:C.accent,marginLeft:6,fontWeight:600}}>
                      {lang==="de"?"Heute":"Today"}
                    </span>}
                  </div>
                  <span style={{fontSize:11,color:C.muted}}>
                    {doneDayTasks.length}/{dayTasks.length}
                  </span>
                </div>
                {dayTasks.length>0?(
                  <div style={{padding:"4px 13px 10px"}}>
                    {dayTasks.map(task=>(
                      <div key={task.id} style={{display:"flex",alignItems:"center",gap:7,marginTop:5}}>
                        <button className="btn" onClick={()=>toggleDone(task.id)}
                          style={{width:16,height:16,borderRadius:4,flexShrink:0,
                            border:`2px solid ${task.done?C.green:PRIORITIES.find(p=>p.value===task.priority)?.color||C.accent}`,
                            background:task.done?C.green+"33":"transparent",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            color:C.green,fontSize:10}}>{task.done?"✓":""}</button>
                        <span style={{fontSize:12,flex:1,textDecoration:task.done?"line-through":"none",
                          color:task.done?C.muted:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {task.text}
                        </span>
                        {task.time&&<span style={{fontSize:10,color:C.muted,flexShrink:0}}>⏰{task.time}</span>}
                      </div>
                    ))}
                  </div>
                ):(
                  <div style={{padding:"4px 13px 10px",fontSize:11,color:C.muted}}>{t.weekNoTasks}</div>
                )}
              </div>
            );
          })}
          {weekOffset!==0&&(
            <button className="btn" onClick={()=>setWeekOffset(0)}
              style={{width:"100%",marginTop:8,padding:"9px",background:C.surface,
                border:`1px solid ${C.border}`,borderRadius:10,color:C.muted,fontSize:12}}>
              {lang==="de"?"→ Zurück zu dieser Woche":"→ Back to this week"}
            </button>
          )}
        </div>
      )}

      {/* ── FOCUS ── */}
      {view==="focus"&&(
        <div style={{width:"100%",maxWidth:480}} className="su">
          <div style={{background:C.surface,borderRadius:12,padding:"9px 13px",marginBottom:11,
            border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
            <span style={{fontSize:11,color:C.muted}}>{t.sounds}</span>
            {[["off",t.soundOff],["rain",t.soundRain],["white",t.soundWhite]].map(([v,label])=>(
              <button key={v} className="btn" onClick={()=>setSound(v)}
                style={{padding:"4px 9px",borderRadius:7,fontSize:11,fontWeight:600,
                  border:`1px solid ${sound===v?C.accent:C.border}`,
                  background:sound===v?C.accent+"22":"transparent",
                  color:sound===v?C.accentLight:C.muted}}>{label}</button>
            ))}
          </div>
          {!focusTask?(
            <div>
              <div style={{fontSize:12,color:C.muted,marginBottom:9,textAlign:"center"}}>{t.chooseTask}</div>
              {[...todayTasks,...overdueTasks].filter((x,i,arr)=>arr.findIndex(y=>y.id===x.id)===i).map(task=>(
                <button key={task.id} className="btn ti" onClick={()=>startFocus(task)}
                  style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,
                    borderRadius:11,padding:"11px 14px",marginBottom:6,color:C.text,
                    textAlign:"left",fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{task.text}</span>
                  <span style={{color:C.accent,fontSize:10,fontWeight:600,flexShrink:0,marginLeft:8}}>{t.startFocus} →</span>
                </button>
              ))}
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
              <div style={{display:"flex",gap:6}}>
                {FOCUS_DURATIONS.map(d=>(
                  <button key={d} className="btn" onClick={()=>{setFocusDur(d);setTimeLeft(d*60);setRunning(false);}}
                    style={{padding:"5px 11px",borderRadius:7,fontSize:11,fontWeight:600,
                      border:`1.5px solid ${focusDur===d?C.accent:C.border}`,
                      background:focusDur===d?C.accent+"22":"transparent",
                      color:focusDur===d?C.accentLight:C.muted}}>{d}min</button>
                ))}
              </div>
              <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <ProgressRing pct={timerPct} size={176} stroke={10} color={running?C.accent:C.muted} borderColor={C.border}/>
                <div style={{position:"absolute",textAlign:"center"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:800,color:C.text}}>
                    {timeLeft!=null?formatTime(timeLeft):`${focusDur}:00`}
                  </div>
                  <div style={{fontSize:10,color:C.muted}}>
                    {running?t.focusActive:timeLeft===0?t.finished:t.ready}
                  </div>
                </div>
              </div>
              <div style={{background:C.surface,borderRadius:13,padding:"11px 16px",textAlign:"center",
                border:`1px solid ${C.border}`,width:"100%"}}>
                <div style={{fontSize:10,color:C.muted,marginBottom:2}}>{t.focusTask}</div>
                <div style={{fontSize:14,fontWeight:700,color:C.text}}>{focusTask.text}</div>
              </div>
              <div style={{display:"flex",gap:8,width:"100%"}}>
                {!running?(
                  <button className="btn" onClick={()=>setRunning(true)}
                    style={{flex:2,padding:"12px",background:`linear-gradient(135deg,${C.accent},${C.accent}bb)`,
                      borderRadius:11,color:"#fff",fontWeight:700,fontSize:13}}>
                    {timeLeft===0?t.again:t.start}
                  </button>
                ):(
                  <button className="btn" onClick={()=>setRunning(false)}
                    style={{flex:2,padding:"12px",background:C.yellow+"22",border:`1px solid ${C.yellow}55`,
                      borderRadius:11,color:C.yellow,fontWeight:700,fontSize:13}}>{t.pause}</button>
                )}
                <button className="btn" onClick={()=>{setRunning(false);setTimeLeft(focusDur*60);}}
                  style={{flex:1,padding:"12px",background:C.surface,border:`1px solid ${C.border}`,
                    borderRadius:11,color:C.muted,fontWeight:600}}>{t.reset}</button>
                <button className="btn" onClick={()=>{toggleDone(focusTask.id);setFocusTask(null);setRunning(false);setTimeLeft(null);setSound("off");}}
                  style={{flex:1,padding:"12px",background:C.green+"22",border:`1px solid ${C.green}44`,
                    borderRadius:11,color:C.green,fontWeight:700}}>✓</button>
              </div>
              <button className="btn" onClick={()=>{setFocusTask(null);setRunning(false);setTimeLeft(null);setSound("off");}}
                style={{background:"transparent",color:C.muted,fontSize:11}}>{t.otherTask}</button>
            </div>
          )}
        </div>
      )}

      {/* ── STATS ── */}
      {view==="stats"&&(
        <div style={{width:"100%",maxWidth:480}} className="su">
          <div style={{background:C.surface,borderRadius:15,padding:16,border:`1px solid ${C.border}`}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,marginBottom:14}}>📊 {t.statsTitle}</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:6,height:90,marginBottom:9}}>
              {weekStats.map((val,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div style={{fontSize:9,color:C.muted,fontWeight:600}}>{val||""}</div>
                  <div style={{width:"100%",borderRadius:"4px 4px 0 0",
                    height:`${Math.max((val/maxStat)*65,val>0?7:2)}px`,
                    background:val>0?`linear-gradient(180deg,${C.accent},${C.accentLight})`:C.border,
                    transition:"height 0.5s"}}/>
                  <div style={{fontSize:9,color:C.muted}}>{dayLabels[i]}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:7}}>
              {[[weekStats.reduce((a,b)=>a+b,0),t.statsTotal],[streak+"🔥",t.statsStreak],[doneToday,t.statsDone]].map(([val,label],i)=>(
                <div key={i} style={{flex:1,background:C.bg,borderRadius:10,padding:"10px 5px",
                  textAlign:"center",border:`1px solid ${C.border}`}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:C.accent}}>{val}</div>
                  <div style={{fontSize:9,color:C.muted,marginTop:2}}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── EVENING ── */}
      {view==="evening"&&(
        <div style={{width:"100%",maxWidth:480}} className="su">
          <div style={{background:C.surface,borderRadius:15,padding:16,border:`1px solid ${C.border}`}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,marginBottom:13}}>🌙 {t.eveningTitle}</div>
            {[[t.eveningQ1,"q1"],[t.eveningQ2,"q2"],[t.eveningQ3,"q3"]].map(([q,key])=>(
              <div key={key} style={{marginBottom:13}}>
                <div style={{fontSize:12,fontWeight:600,color:C.accentLight,marginBottom:4}}>{q}</div>
                <textarea value={eveningAnswers[key]}
                  onChange={e=>setEveningAnswers(prev=>({...prev,[key]:e.target.value}))}
                  rows={3} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,
                    borderRadius:9,padding:"8px 10px",color:C.text,fontSize:13,lineHeight:1.5}}/>
              </div>
            ))}
            <button className="btn" onClick={()=>{save("ff_evening",eveningAnswers);setEveningSaved(true);setTimeout(()=>setEveningSaved(false),2000);}}
              style={{width:"100%",padding:"10px",background:`linear-gradient(135deg,${C.accent},${C.accent}bb)`,
                borderRadius:9,color:"#fff",fontWeight:700,fontSize:13}}>
              {eveningSaved?t.saved:t.save}
            </button>
          </div>
        </div>
      )}

      {/* ── DONE ── */}
      {view==="done"&&(
        <div style={{width:"100%",maxWidth:480}} className="su">
          {donedTasks.length===0?(
            <div style={{textAlign:"center",color:C.muted,padding:46}}>
              <div style={{fontSize:32,marginBottom:9}}>💪</div>
              <div>{t.noDone}</div>
            </div>
          ):(
            <>
              <div style={{textAlign:"center",marginBottom:12,padding:13,
                background:C.green+"11",borderRadius:12,border:`1px solid ${C.green}33`}}>
                <div style={{fontSize:28}}>🏆</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:C.green,marginTop:3}}>
                  {donedTasks.length} {lang==="de"?`Aufgabe${donedTasks.length!==1?"n":""} erledigt!`:`task${donedTasks.length!==1?"s":""} done!`}
                </div>
              </div>
              {donedTasks.map(task=>(
                <div key={task.id} style={{background:C.surface,borderRadius:11,padding:"10px 12px",
                  marginBottom:6,display:"flex",alignItems:"center",gap:9,
                  border:`1px solid ${C.border}`,opacity:0.65}}>
                  <span style={{color:C.green,fontSize:14}}>✓</span>
                  <span style={{flex:1,textDecoration:"line-through",color:C.muted,fontSize:12,
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.text}</span>
                  <button className="btn" onClick={()=>toggleDone(task.id)}
                    style={{background:"transparent",color:C.muted,fontSize:11}}>↩</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Routine tab – for editing */}
      {view==="routine"&&(
        <div style={{width:"100%",maxWidth:480}} className="su">
          <div style={{background:C.surface,borderRadius:15,padding:15,border:`1px solid ${C.border}`}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,marginBottom:3}}>{t.routineTitle}</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:13}}>{t.routineDesc}</div>
            {routine.map(r=>(
              <div key={r.id} className="ti" style={{display:"flex",alignItems:"center",gap:9,
                background:C.bg,borderRadius:9,padding:"9px 11px",marginBottom:6,
                border:`1px solid ${C.border}`,opacity:r.done?0.5:1}}>
                <button className="btn" onClick={()=>toggleRoutine(r.id)}
                  style={{width:19,height:19,borderRadius:4,border:`2px solid ${r.done?C.green:C.accent}`,
                    background:r.done?C.green+"33":"transparent",flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center",color:C.green,fontSize:11}}>
                  {r.done?"✓":""}
                </button>
                <span style={{flex:1,fontSize:13,textDecoration:r.done?"line-through":"none"}}>{r.text}</span>
                <button className="btn" onClick={()=>setRoutine(prev=>prev.filter(x=>x.id!==r.id))}
                  style={{background:"transparent",color:C.muted,fontSize:14}}>×</button>
              </div>
            ))}
            <div style={{display:"flex",gap:6,marginTop:7}}>
              <input value={routineInput} onChange={e=>setRoutineInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addRoutineItem()}
                placeholder={t.routinePlaceholder}
                style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                  padding:"8px 10px",color:C.text,fontSize:13}}/>
              <button className="btn" onClick={()=>addRoutineItem()}
                style={{padding:"8px 13px",background:C.accent,borderRadius:8,color:"#fff",fontWeight:700}}>+</button>
            </div>
          </div>
        </div>
      )}

      <div style={{position:"fixed",bottom:0,left:0,right:0,textAlign:"center",padding:"8px",
        background:C.bg+"f0",borderTop:`1px solid ${C.border}`,fontSize:10,color:C.muted}}>
        {t.tip}
      </div>
    </div>
  );
}
