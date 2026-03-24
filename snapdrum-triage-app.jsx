import { useState, useEffect, useCallback } from "react";

const DEFAULT_CARDS = [
  {id:1,title:'UN Project',section:'Projects',status:'todo',priority:'urgent',deadline:'25 Mar',owner:'',tasks:[{t:'Review & verify PATH User Guide v2',done:false},{t:'Final checklist w/ Mario S.',done:false},{t:'Request info/permissions from client',done:false}]},
  {id:2,title:'Moorgate Voice Agent',section:'Projects',status:'todo',priority:'urgent',deadline:'~27 Mar',owner:'',tasks:[{t:'Fine-tune the VA',done:false},{t:'Run EVALS (client requested)',done:false},{t:'Confirm meeting date with client',done:false}]},
  {id:3,title:'Moorgate Email Automation',section:'Projects',status:'todo',priority:'thisweek',deadline:'',owner:'',tasks:[{t:'Chase client for full project scope',done:false}]},
  {id:4,title:'Marcus Lincoln',section:'Projects',status:'todo',priority:'thisweek',deadline:'This week',owner:'',tasks:[{t:'Schedule follow-up meeting',done:false}]},
  {id:5,title:'Law Firm Client',section:'Projects',status:'todo',priority:'thisweek',deadline:'',owner:'',tasks:[{t:'Follow up with client',done:false}]},
  {id:6,title:'PM Publishing',section:'Projects',status:'inprogress',priority:'planning',deadline:'',owner:'',tasks:[{t:'Get status update from team',done:false}]},
  {id:7,title:'Enterprise Analytics',section:'Projects',status:'inprogress',priority:'planning',deadline:'',owner:'',tasks:[{t:'Get scope reviewed by Aki',done:false}]},
  {id:8,title:'AI PM Bootcamp & Certificate',section:'Courses',status:'todo',priority:'urgent',deadline:'Today',owner:'',tasks:[{t:'Create & add free resources into course',done:false}]},
  {id:9,title:'Mini Certifications',section:'Courses',status:'todo',priority:'urgent',deadline:'EOD',owner:'',tasks:[{t:'Document 5 mini cert concepts',done:false}]},
  {id:10,title:'MPB – Evals Session',section:'Courses',status:'todo',priority:'urgent',deadline:'EOD',owner:'',tasks:[{t:'Complete Session 1 draft + glossary',done:false},{t:'Draft 1-page 3-session pathway outline',done:false}]},
  {id:11,title:'Maven – Drip Emails',section:'Courses',status:'todo',priority:'thisweek',deadline:'',owner:'Mario S.',tasks:[{t:'Improve drip/follow-up emails on Maven',done:false},{t:'Review what Hamel sent',done:false},{t:'Sign up to top 20 courses & track emails',done:false}]},
  {id:12,title:'AI for Lay People',section:'Courses',status:'inprogress',priority:'planning',deadline:'',owner:'',tasks:[{t:'Finalise name/branding',done:false},{t:'Find someone to deliver Python basics module',done:false}]},
  {id:13,title:'Substack – Posts',section:'Socials',status:'todo',priority:'urgent',deadline:'Thursday',owner:'',tasks:[{t:'Publish 25 posts today',done:false},{t:'Publish 20 posts tomorrow',done:false}]},
  {id:14,title:'Substack – Image Creation',section:'Socials',status:'blocked',priority:'urgent',deadline:'Thursday',owner:'',tasks:[{t:'Fix clean image creation via Nano Banana',done:false}]},
  {id:15,title:'Dean – Testimonial Call',section:'Socials',status:'todo',priority:'urgent',deadline:'Today 6PM',owner:'',tasks:[{t:'Join call with Dean to collect testimonial',done:false}]},
  {id:16,title:'Anthropic Event',section:'Socials',status:'todo',priority:'urgent',deadline:'Urgent',owner:'Mario for Aki',tasks:[{t:'Register for Anthropic SF event',done:false}]},
  {id:17,title:'LinkedIn – Jobs Post',section:'Socials',status:'todo',priority:'thisweek',deadline:'Friday',owner:'',tasks:[{t:'Curate 50 AI & ML job openings',done:false},{t:'Post on LinkedIn + Substack',done:false},{t:'Funnel readers to email list',done:false}]},
  {id:18,title:'LinkedIn – Account Strategy',section:'Socials',status:'todo',priority:'thisweek',deadline:'',owner:'',tasks:[{t:'Develop better warming strategy',done:false},{t:'Add AI Engineer event to content list',done:false}]},
  {id:19,title:'Email Signatures',section:'Socials',status:'todo',priority:'thisweek',deadline:'',owner:'Mario',tasks:[{t:'Create email signature for Aki',done:false}]},
  {id:20,title:'Mobile Editing Club – Workflows',section:'Special',status:'todo',priority:'planning',deadline:'',owner:'',tasks:[{t:'Find way to access their workflows',done:false}]},
  {id:21,title:'Mini Courses / TAI Webpage',section:'Special',status:'inprogress',priority:'thisweek',deadline:'',owner:'Aki',tasks:[{t:'Complete first draft',done:false}]},
  {id:22,title:'Project Delivery Process',section:'Special',status:'todo',priority:'thisweek',deadline:'',owner:'',tasks:[{t:'Develop robust delivery process',done:false},{t:'Goal: onboard more clients & projects',done:false}]},
  {id:23,title:'Website – Dynamic & Content',section:'Special',status:'inprogress',priority:'thisweek',deadline:'',owner:'',tasks:[{t:'Website dynamics section',done:true},{t:'Evals – pending',done:false},{t:'Speak to Ateeb re: content creation',done:false}]},
  {id:24,title:'Clay – Corporate Outreach',section:'Special',status:'todo',priority:'thisweek',deadline:'',owner:'Mario',tasks:[{t:'Finish learning Clay',done:false},{t:'Work on corporate client outreach',done:false}]},
  {id:25,title:'SL & South Asia Lead Gen',section:'Special',status:'todo',priority:'thisweek',deadline:'',owner:'',tasks:[{t:'Plan session targeting SL & South Asia',done:false},{t:'Tap into AIESEC, GDG, Rotaract',done:false},{t:'Strategy to patch Maven revenue loss',done:false}]}
];

const COLS = ['todo','inprogress','blocked','done'];
const COL_LABELS = {todo:'To do',inprogress:'In progress',blocked:'Blocked',done:'Done'};
const SECTIONS = ['Projects','Courses','Socials','Special','Emails','Parking Lot'];
const PRIORITIES = [{v:'urgent',l:'Urgent'},{v:'thisweek',l:'This week'},{v:'planning',l:'Planning'}];

const styles = {
  app: { fontFamily:"'DM Sans',sans-serif", background:'#0f0f11', minHeight:'100vh', color:'#f0f0f2' },
  topbar: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid #2e2e38', flexWrap:'wrap', gap:10 },
  logo: { fontSize:15, fontWeight:600, display:'flex', alignItems:'center', gap:8 },
  logoDot: { width:8, height:8, borderRadius:'50%', background:'#7c6cfc' },
  statsRow: { display:'flex', alignItems:'center', gap:16 },
  stat: { textAlign:'center' },
  statVal: { fontSize:18, fontWeight:600, fontFamily:'monospace' },
  statLbl: { fontSize:10, color:'#5a5a6a', textTransform:'uppercase', letterSpacing:'0.08em' },
  filters: { display:'flex', alignItems:'center', gap:6, padding:'10px 20px', borderBottom:'1px solid #2e2e38', overflowX:'auto', flexWrap:'wrap' },
  chip: (active) => ({ fontSize:12, padding:'4px 12px', borderRadius:99, border:`1px solid ${active?'#7c6cfc':'#2e2e38'}`, background:active?'#7c6cfc':'transparent', color:active?'#fff':'#9898a8', cursor:'pointer', whiteSpace:'nowrap' }),
  addBtn: { fontSize:12, padding:'5px 14px', borderRadius:99, border:'1px solid #7c6cfc', background:'transparent', color:'#7c6cfc', cursor:'pointer', marginLeft:'auto', whiteSpace:'nowrap' },
  board: { display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:12, padding:'16px 20px 40px' },
  colHead: { display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:8 },
  colLabel: { fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'#9898a8' },
  colCount: { fontSize:11, fontFamily:'monospace', background:'#222228', color:'#5a5a6a', padding:'1px 7px', borderRadius:99 },
  colBody: { background:'#18181c', borderRadius:10, padding:10, minHeight:120, display:'flex', flexDirection:'column', gap:8 },
  empty: { fontSize:11, color:'#5a5a6a', textAlign:'center', padding:'24px 0' },
  card: { background:'#222228', border:'1px solid #2e2e38', borderRadius:10, padding:'11px 12px' },
  cardSec: { fontSize:10, color:'#5a5a6a', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 },
  cardTop: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:6, marginBottom:6 },
  cardTitle: { fontSize:13, fontWeight:500, lineHeight:1.35 },
  badge: (p) => {
    if(p==='urgent') return { fontSize:10, padding:'2px 7px', borderRadius:99, background:'#2a1515', color:'#ff5757', whiteSpace:'nowrap', flexShrink:0 };
    if(p==='thisweek') return { fontSize:10, padding:'2px 7px', borderRadius:99, background:'#2a1e0a', color:'#f5a623', whiteSpace:'nowrap', flexShrink:0 };
    return { fontSize:10, padding:'2px 7px', borderRadius:99, background:'#1e1e26', color:'#9898a8', whiteSpace:'nowrap', flexShrink:0 };
  },
  deadline: { fontSize:10, color:'#ff5757', fontWeight:500, marginBottom:6, display:'flex', alignItems:'center', gap:4 },
  taskRow: { display:'flex', alignItems:'flex-start', gap:7 },
  cb: (done) => ({ width:13, height:13, borderRadius:3, border:`1px solid ${done?'#7c6cfc':'#3a3a48'}`, background:done?'#7c6cfc':'transparent', flexShrink:0, marginTop:1, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }),
  taskTxt: (done) => ({ fontSize:11, color:done?'#5a5a6a':'#9898a8', textDecoration:done?'line-through':'none', lineHeight:1.45 }),
  progressWrap: { marginTop:7 },
  progressBar: { height:3, background:'#2e2e38', borderRadius:99, overflow:'hidden' },
  progressFill: (pct) => ({ height:'100%', width:pct+'%', background:'#7c6cfc', borderRadius:99, transition:'width 0.3s' }),
  progressTxt: { fontSize:10, color:'#5a5a6a', marginTop:3, fontFamily:'monospace' },
  cardMeta: { display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8, paddingTop:7, borderTop:'1px solid #2e2e38' },
  moveBtns: { display:'flex', gap:4 },
  mv: { fontSize:10, padding:'2px 7px', borderRadius:4, border:'1px solid #2e2e38', background:'transparent', color:'#5a5a6a', cursor:'pointer' },
  editBtn: { fontSize:10, padding:'2px 8px', borderRadius:4, border:'1px solid #2e2e38', background:'transparent', color:'#5a5a6a', cursor:'pointer' },
  ownerTag: { fontSize:10, color:'#5a5a6a', marginTop:5 },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 },
  modal: { background:'#18181c', border:'1px solid #3a3a48', borderRadius:14, padding:24, width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto' },
  modalTitle: { fontSize:16, fontWeight:600, marginBottom:18 },
  formGroup: { marginBottom:14 },
  formLabel: { fontSize:11, color:'#9898a8', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5, display:'block' },
  formInput: { width:'100%', background:'#222228', border:'1px solid #2e2e38', borderRadius:6, padding:'8px 10px', color:'#f0f0f2', fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:'none' },
  formRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 },
  taskEditRow: { display:'flex', gap:6, alignItems:'center', marginBottom:6 },
  removeTask: { fontSize:16, color:'#5a5a6a', background:'none', border:'none', cursor:'pointer', padding:'0 4px', lineHeight:1, flexShrink:0 },
  addTaskBtn: { fontSize:11, color:'#7c6cfc', background:'none', border:'1px dashed #3a3a48', borderRadius:6, padding:'5px 10px', cursor:'pointer', width:'100%', marginTop:4 },
  modalActions: { display:'flex', gap:8, justifyContent:'flex-end', marginTop:20 },
  btnCancel: { fontSize:12, padding:'7px 16px', borderRadius:6, border:'1px solid #2e2e38', background:'transparent', color:'#9898a8', cursor:'pointer' },
  btnSave: { fontSize:12, padding:'7px 18px', borderRadius:6, border:'1px solid #7c6cfc', background:'#7c6cfc', color:'#fff', cursor:'pointer', fontWeight:500 },
  btnDelete: { fontSize:12, padding:'7px 14px', borderRadius:6, border:'1px solid #2a1515', background:'transparent', color:'#ff5757', cursor:'pointer', marginRight:'auto' },
  ringWrap: { position:'relative', width:44, height:44, flexShrink:0 },
  ringVal: { position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:500, color:'#7c6cfc', fontFamily:'monospace' },
};

const EMPTY_FORM = { title:'', section:'Projects', priority:'thisweek', status:'todo', deadline:'', owner:'', tasks:[] };

export default function App() {
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await window.storage.get('kanban-cards');
        if (res && res.value) setCards(JSON.parse(res.value));
      } catch(e) {}
    }
    loadData();
  }, []);

  const persist = useCallback(async (newCards) => {
    setSaving(true);
    try { await window.storage.set('kanban-cards', JSON.stringify(newCards)); } catch(e) {}
    setSaving(false);
  }, []);

  const updateCards = (newCards) => { setCards(newCards); persist(newCards); };

  const toggleTask = (cid, ti) => {
    updateCards(cards.map(c => c.id===cid ? {...c, tasks: c.tasks.map((tk,i) => i===ti ? {...tk, done:!tk.done} : tk)} : c));
  };

  const moveCard = (cid, dir) => {
    const idx = COLS.indexOf(cards.find(c=>c.id===cid)?.status);
    if(idx===-1) return;
    const newIdx = idx+dir;
    if(newIdx<0||newIdx>3) return;
    updateCards(cards.map(c => c.id===cid ? {...c, status:COLS[newIdx]} : c));
  };

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
  const openEdit = (cid) => {
    const c = cards.find(x=>x.id===cid);
    if(!c) return;
    setForm({title:c.title,section:c.section,priority:c.priority,status:c.status,deadline:c.deadline||'',owner:c.owner||'',tasks:c.tasks.map(t=>({...t}))});
    setModal(cid);
  };

  const saveCard = () => {
    if(!form.title.trim()) return;
    if(modal==='add') {
      const newId = cards.length ? Math.max(...cards.map(c=>c.id))+1 : 1;
      updateCards([...cards, {id:newId,...form}]);
    } else {
      updateCards(cards.map(c => c.id===modal ? {id:c.id,...form} : c));
    }
    setModal(null);
  };

  const deleteCard = () => { updateCards(cards.filter(c=>c.id!==modal)); setModal(null); };

  const addTaskField = () => setForm(f=>({...f, tasks:[...f.tasks,{t:'',done:false}]}));
  const updateTaskField = (i, val) => setForm(f=>({...f, tasks:f.tasks.map((tk,ti)=>ti===i?{...tk,t:val}:tk)}));
  const removeTaskField = (i) => setForm(f=>({...f, tasks:f.tasks.filter((_,ti)=>ti!==i)}));

  const visible = (col) => cards.filter(c=>c.status===col&&(filter==='all'||c.section===filter));
  const allTasks = cards.flatMap(c=>c.tasks);
  const doneTasks = allTasks.filter(t=>t.done).length;
  const pct = allTasks.length ? Math.round(doneTasks/allTasks.length*100) : 0;
  const circ = 2*Math.PI*18;

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <div style={styles.topbar}>
        <div style={styles.logo}><div style={styles.logoDot}/> Snapdrum Triage {saving && <span style={{fontSize:10,color:'#5a5a6a',fontWeight:400}}>saving…</span>}</div>
        <div style={styles.statsRow}>
          {COLS.map(col=>(
            <div key={col} style={styles.stat}>
              <div style={styles.statVal}>{cards.filter(c=>c.status===col&&(filter==='all'||c.section===filter)).length}</div>
              <div style={styles.statLbl}>{COL_LABELS[col]}</div>
            </div>
          ))}
          <div style={styles.ringWrap}>
            <svg width="44" height="44" viewBox="0 0 44 44" style={{transform:'rotate(-90deg)'}}>
              <circle cx="22" cy="22" r="18" fill="none" stroke="#2e2e38" strokeWidth="3"/>
              <circle cx="22" cy="22" r="18" fill="none" stroke="#7c6cfc" strokeWidth="3" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ-(pct/100)*circ} style={{transition:'stroke-dashoffset 0.4s'}}/>
            </svg>
            <div style={styles.ringVal}>{pct}%</div>
          </div>
        </div>
      </div>

      <div style={styles.filters}>
        {['all',...SECTIONS.slice(0,4)].map(s=>(
          <button key={s} style={styles.chip(filter===s)} onClick={()=>setFilter(s)}>{s==='all'?'All':s}</button>
        ))}
        <button style={styles.addBtn} onClick={openAdd}>+ Add card</button>
      </div>

      <div style={styles.board}>
        {COLS.map(col=>(
          <div key={col}>
            <div style={styles.colHead}>
              <span style={styles.colLabel}>{COL_LABELS[col]}</span>
              <span style={styles.colCount}>{visible(col).length}</span>
            </div>
            <div style={styles.colBody}>
              {visible(col).length===0 && <div style={styles.empty}>Empty</div>}
              {visible(col).map(card=>{
                const doneT = card.tasks.filter(t=>t.done).length;
                const allT = card.tasks.length;
                const cpct = allT ? Math.round(doneT/allT*100) : 0;
                const colIdx = COLS.indexOf(card.status);
                return (
                  <div key={card.id} style={styles.card}>
                    <div style={styles.cardSec}>{card.section}</div>
                    <div style={styles.cardTop}>
                      <span style={styles.cardTitle}>{card.title}</span>
                      <span style={styles.badge(card.priority)}>{PRIORITIES.find(p=>p.v===card.priority)?.l}</span>
                    </div>
                    {card.deadline && <div style={styles.deadline}><span style={{width:5,height:5,borderRadius:'50%',background:'#ff5757',display:'inline-block',flexShrink:0}}/>{card.deadline}</div>}
                    {card.tasks.length>0 && (
                      <div style={{display:'flex',flexDirection:'column',gap:4,marginBottom:6}}>
                        {card.tasks.map((tk,ti)=>(
                          <div key={ti} style={styles.taskRow}>
                            <div style={styles.cb(tk.done)} onClick={()=>toggleTask(card.id,ti)}>
                              {tk.done && <svg width="8" height="8" viewBox="0 0 8 8"><polyline points="1,4 3,6 7,2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            <span style={styles.taskTxt(tk.done)}>{tk.t}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {allT>0 && (
                      <div style={styles.progressWrap}>
                        <div style={styles.progressBar}><div style={styles.progressFill(cpct)}/></div>
                        <div style={styles.progressTxt}>{doneT}/{allT} tasks</div>
                      </div>
                    )}
                    <div style={styles.cardMeta}>
                      <div style={styles.moveBtns}>
                        {colIdx>0 && <button style={styles.mv} onClick={()=>moveCard(card.id,-1)}>← {COL_LABELS[COLS[colIdx-1]]}</button>}
                        {colIdx<3 && <button style={styles.mv} onClick={()=>moveCard(card.id,1)}>{COL_LABELS[COLS[colIdx+1]]} →</button>}
                      </div>
                      <button style={styles.editBtn} onClick={()=>openEdit(card.id)}>Edit</button>
                    </div>
                    {card.owner && <div style={styles.ownerTag}>👤 {card.owner}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={styles.overlay} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div style={styles.modal}>
            <div style={styles.modalTitle}>{modal==='add'?'Add card':'Edit card'}</div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Title</label>
                <input style={styles.formInput} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Card title"/>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Section</label>
                <select style={styles.formInput} value={form.section} onChange={e=>setForm(f=>({...f,section:e.target.value}))}>
                  {SECTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Priority</label>
                <select style={styles.formInput} value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
                  {PRIORITIES.map(p=><option key={p.v} value={p.v}>{p.l}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Status</label>
                <select style={styles.formInput} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                  {COLS.map(c=><option key={c} value={c}>{COL_LABELS[c]}</option>)}
                </select>
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Deadline</label>
                <input style={styles.formInput} value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))} placeholder="e.g. 25 Mar"/>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Owner</label>
                <input style={styles.formInput} value={form.owner} onChange={e=>setForm(f=>({...f,owner:e.target.value}))} placeholder="e.g. Mario S."/>
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Tasks</label>
              {form.tasks.map((tk,i)=>(
                <div key={i} style={styles.taskEditRow}>
                  <input style={styles.formInput} value={tk.t} onChange={e=>updateTaskField(i,e.target.value)} placeholder="Task description"/>
                  <button style={styles.removeTask} onClick={()=>removeTaskField(i)}>×</button>
                </div>
              ))}
              <button style={styles.addTaskBtn} onClick={addTaskField}>+ Add task</button>
            </div>
            <div style={styles.modalActions}>
              {modal!=='add' && <button style={styles.btnDelete} onClick={deleteCard}>Delete</button>}
              <button style={styles.btnCancel} onClick={()=>setModal(null)}>Cancel</button>
              <button style={styles.btnSave} onClick={saveCard}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
