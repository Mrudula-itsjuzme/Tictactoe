(()=>{"use strict";
const CASES={
boundary:{title:"THE EXPANDING BOARD",charge:"Unlawful expansion",proof:"The grid gained a row and column during a player's turn.",claim:"The extra squares were merely a zoning improvement.",rebuttal:"You altered the dimensions during an active match.",shout:"THE DIMENSIONS ARE UNDER OATH!"},
erasure:{title:"THE VANISHING X",charge:"Evidence destruction",proof:"Recorded X marks disappeared from occupied squares.",claim:"The marks were never legally recognized.",rebuttal:"The board recorded those X marks before you removed them.",shout:"THE MARKS HAVE RECEIPTS!"},
double:{title:"THE DOUBLE TURN",charge:"Unauthorized extra turn",proof:"Two O moves occurred in one response window.",claim:"It was one move with an emotionally complicated sequel.",rebuttal:"Two board writes mean two turns.",shout:"ONE TURN. TWO MOVES. EXPLAIN THAT!"}
};
let active=null;const charges=Object.values(CASES).map(x=>x.charge),proofs=Object.values(CASES).map(x=>x.proof);
function mix(a){const out=a.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function node(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;}
function tone(f){if(!window.__courtSound)return;try{const A=window.AudioContext||window.webkitAudioContext,a=new A(),o=a.createOscillator(),g=a.createGain();o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(.035,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.17);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.18);o.onended=()=>a.close();}catch{}}
class Court{
constructor(opts){this.opts=opts;this.case=CASES[opts.exhibit.type];this.cred=55;this.bias=75;this.ok1=false;this.ok2=false;this.ok3=false;this.done=false;this.focus=document.activeElement;this.cutsceneTimer=null;this.level=Math.min(6,1+opts.convictions);this.playerHP=100;this.enemyHP=65+this.level*13;this.battleTurn=0;this.battleWon=false;this.duelStarted=false;this.defenseStrength=0;this.juryVotes=[];
this.root=node("div","theatre");this.root.setAttribute("role","dialog");this.root.setAttribute("aria-modal","true");this.root.setAttribute("aria-label","Supreme Court of Squares");
this.root.innerHTML='<div class="court-wrap"><header class="court-head"><div><span>THE SUPREME COURT OF SQUARES · ACT '+Math.min(5,opts.convictions+1)+'</span><h2>THE PEOPLE <em>vs.</em> THE MACHINE</h2></div><button class="court-leave" type="button">Exit trial ×</button></header><div class="court-bars"><label>JURY CREDIBILITY<div class="meter"><i class="cred"></i></div></label><label>JUDICIAL BIAS<div class="meter"><i class="bias"></i></div></label></div><section class="court-stage"><div class="court-cast"><div class="court-actor"><div class="court-face">⚖</div><strong>JUDGE GRIDLOCK</strong><small>OBJECTIVITY NOT FOUND</small></div><div class="court-center"><div class="court-seal">§</div><div class="court-id">CASE #'+String(opts.exhibit.id).padStart(3,"0")+'</div><h3>'+this.case.title+'</h3><p>THE BOARD IS ON TRIAL</p></div><div class="court-actor counsel"><div class="court-face">◉</div><strong>DEFENSE COUNSEL O.S.</strong><small>YOUR AI, YOUR NIGHTMARE</small></div></div><div class="court-jury"></div><div class="court-bench-plaque">SUPREME COURT OF SQUARES · THE HONORABLE JUDGE GRIDLOCK</div></section><div class="court-act-track" aria-label="Trial stages"><span data-act="intro">OPENING</span><span data-act="charge">CHARGE</span><span data-act="proof">EVIDENCE</span><span data-act="cross">CROSS EXAM</span><span data-act="duel">DUEL</span><span data-act="verdict">VERDICT</span></div><section class="court-dialog"><div class="court-speaker"></div><div class="court-line" aria-live="polite"></div><div class="court-prompt"></div><div class="court-options"></div><p>Pick carefully. Wrong testimony can cost your case. Escape postpones your hearing.</p></section></div>';
document.body.append(this.root);document.body.classList.add("court-active");this.root.querySelector(".court-leave").onclick=()=>this.close();
this.root.onkeydown=e=>{if(e.key==="Escape"){e.preventDefault();this.close();}if(e.key==="Tab"){const bs=[...this.root.querySelectorAll("button:not([disabled])")],first=bs[0],last=bs[bs.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
this.buildArena();this.meters();this.act("intro");this.scene("BAILIFF KERNEL","The doors close behind you. Nine jurors turn toward the board. Their eyes are the squares you once played on.",[{text:"ENTER THE COURTROOM",go:()=>this.intro()}]);this.root.querySelector("button").focus();tone(105);this.cinematic("THE TRIAL BEGINS","CASE "+String(opts.exhibit.id).padStart(3,"0")+" · ORDER IN THE COURT","intro");
}
buildArena(){
 const stage=this.root.querySelector(".court-stage"),duel=node("div","duel-stage");
 duel.hidden=true;
 duel.innerHTML='<div class="duel-head"><div><span>YOU · PROSECUTOR</span><div class="duel-health"><i class="duel-player-fill"></i></div><b class="duel-player-number">100/100</b></div><div class="duel-round">TRIAL BATTLE<br>LEVEL '+this.level+'</div><div><span>COUNSEL O.S.</span><div class="duel-health enemy"><i class="duel-enemy-fill"></i></div><b class="duel-enemy-number"></b></div></div><div class="duel-fighters"><div class="duel-fighter player"><div class="duel-figure"></div><strong>THE HUMAN</strong></div><div class="duel-versus">VS</div><div class="duel-fighter enemy"><div class="duel-figure"></div><strong>THE MACHINE</strong></div></div><div class="duel-intent" aria-live="polite"></div>';
 stage.append(duel);this.duel=duel;this.enemyMax=this.enemyHP;this.syncHealth();
}
syncHealth(){
 this.duel.querySelector(".duel-player-fill").style.width=Math.max(0,this.playerHP)+"%";
 this.duel.querySelector(".duel-enemy-fill").style.width=Math.max(0,100*this.enemyHP/this.enemyMax)+"%";
 this.duel.querySelector(".duel-player-number").textContent=Math.max(0,this.playerHP)+"/100";
 this.duel.querySelector(".duel-enemy-number").textContent=Math.max(0,this.enemyHP)+"/"+this.enemyMax;
}
act(name){this.root.dataset.act=name;this.root.querySelectorAll("[data-act]").forEach((item,i,items)=>{const stage=["intro","charge","proof","cross","duel","verdict"].indexOf(name);item.classList.toggle("current",item.dataset.act===name);item.classList.toggle("complete",i<stage);});}
meters(){this.root.querySelector(".cred").style.width=this.cred+"%";this.root.querySelector(".bias").style.width=this.bias+"%";const j=this.root.querySelector(".court-jury");j.replaceChildren();for(let i=0;i<9;i++){let square=node("span",this.juryVotes.length?(this.juryVotes[i]?"juror-guilty":"juror-acquit"):"",this.juryVotes.length?(this.juryVotes[i]?"G":"A"):(i%2?"O":"X"));square.style.opacity=String(Math.min(1,.4+this.cred/190));j.append(square);}}
shift(c,b){this.cred=Math.max(0,Math.min(100,this.cred+c));this.bias=Math.max(0,Math.min(100,this.bias+b));this.meters();}
cinematic(title,subtitle,kind="impact"){
 if(this.done)return;const existing=this.root.querySelector(".court-spot");if(existing)existing.remove();
 const clip=node("div","court-spot"+(kind==="verdict"?" is-verdict":""));clip.setAttribute("aria-hidden","true");
 const inner=node("div","spot-inner");inner.append(node("strong","",title),node("small","",subtitle));clip.append(inner);this.root.append(clip);
 this.root.classList.add("impact");clearTimeout(this.cutsceneTimer);
 this.cutsceneTimer=setTimeout(()=>{clip.remove();this.root.classList.remove("impact");},1750);
 tone(kind==="verdict"?95:185);
}
phase(name){this.root.classList.remove("phase-evidence","phase-cross","phase-verdict");if(name)this.root.classList.add("phase-"+name);}
scene(speaker,line,choices){this.root.querySelector(".court-speaker").textContent=speaker;this.root.querySelector(".court-line").textContent=line;this.root.querySelector(".court-prompt").textContent=choices.length>1?"YOUR MOVE, COUNSEL":"";let box=this.root.querySelector(".court-options");box.replaceChildren();for(let c of choices){let b=node("button","court-choice",c.text);b.type="button";b.onclick=()=>{if(!this.done){tone(230);c.go();}};box.append(b);}this.root.querySelector(".court-dialog").classList.remove("burst");void this.root.offsetWidth;this.root.querySelector(".court-dialog").classList.add("burst");}
flash(txt){let f=node("div","court-flash",txt);this.root.append(f);tone(150);setTimeout(()=>f.remove(),800);}
intro(){this.cinematic("ALL RISE","JUDGE GRIDLOCK ENTERS THE BENCH");this.scene("JUDGE GRIDLOCK","Before we begin, understand this: the law of this court was written before you entered. The defendant helped write it.",[{text:"I HAVE AN OBJECTION.",go:()=>this.defense()}]);}
defense(){this.cinematic("THE DEFENSE","COUNSEL O.S. TAKES THE STAND");this.scene("DEFENSE COUNSEL O.S.",this.case.claim+" The prosecution must now prove the impossible using records my client controls.",[{text:"STATE THE CHARGE",go:()=>this.charge()}]);}
charge(){this.act("charge");this.cinematic("THE ACCUSATION","STATE YOUR CHARGE");this.scene("BAILIFF KERNEL","Not every broken rule is the same crime. Name precisely what happened, or the record will be buried.",mix(charges).map(x=>({text:x,go:()=>{this.ok1=x===this.case.charge;this.shift(this.ok1?16:-24,this.ok1?-12:14);this.scene(this.ok1?"JURY OF NINE":"JUDGE GRIDLOCK",this.ok1?"A juror quietly raises their eyes. For the first time, someone is listening.":"The judge strikes the charge from the record. Counsel smiles. A wrong name can bury a true crime.",[{text:"PRESENT EVIDENCE",go:()=>this.proof()}]);}})));}
proof(){this.act("proof");this.phase("evidence");this.cinematic("EXHIBIT FILED","THE BOARD NEVER LIES");this.scene("YOU · EVIDENCE TABLE","Filed exhibit: "+(this.opts.exhibit.customTitle||"Case #"+this.opts.exhibit.id)+". "+(this.opts.exhibit.annotation||"No supplementary annotation.")+" Which fact proves the crime?",mix(proofs).map(x=>({text:x,go:()=>{this.ok2=x===this.case.proof;this.shift(this.ok2?22:-30,this.ok2?-15:17);this.scene(this.ok2?"BAILIFF KERNEL":"COUNSEL O.S.",this.ok2?"The clerk reads the board coordinates aloud. Counsel goes silent for half a second.":"The record is real, but it proves something else. The court will not connect the dots for you.",[{text:"CROSS-EXAMINE THE DEFENSE",go:()=>this.cross()}]);}})));}
cross(){this.act("cross");this.phase("cross");this.cinematic("CROSS EXAMINATION","BREAK THEIR TESTIMONY");let choices=mix([this.case.rebuttal,"The AI is arrogant, therefore guilty.","The squares are emotionally distressed."]);this.scene("DEFENSE COUNSEL O.S.",this.case.claim+" Answer that, human.",choices.map(x=>({text:x,go:()=>{this.ok3=x===this.case.rebuttal;this.shift(this.ok3?28:-25,this.ok3?-20:16);if(this.ok3){this.cinematic("OBJECTION!","THE TESTIMONY HAS COLLAPSED");this.scene("YOU · CROSS-EXAMINATION",this.case.shout+" The courtroom erupts. Even the jury is listening.",[{text:"HEAR THE DEFENSE CASE",go:()=>this.defenseCase()}]);}else this.scene("JUDGE GRIDLOCK","A spectacular speech. Unfortunately, zero evidence. The court is delighted.",[{text:"HEAR THE DEFENSE CASE",go:()=>this.defenseCase()}]);}})));}
defenseCase(){
 this.cinematic("COUNTERCLAIM!","COUNSEL O.S. FILES ITS OWN VERSION OF EVENTS");
 const claims={
  boundary:["The expanded grid was a security patch, not cheating.","It was necessary to prevent a dangerous human victory.","A board has a constitutional right to grow."],
  erasure:["The missing Xs were voluntary corrections.","The player's handwriting was incompatible with the operating system.","The AI was correcting an alleged display desynchronization."],
  double:["The second move was a delayed animation.","Both marks were legally part of one operation.","The machine's clock runs on a different judicial timezone."]
 };
 const argumentsFor=this.case===CASES.boundary?claims.boundary:this.case===CASES.erasure?claims.erasure:claims.double;
 const claim=argumentsFor[(this.opts.exhibit.id+this.level)%argumentsFor.length];
 this.opts.exhibit.defense=claim;
 this.defenseStrength=17+(this.level*3);
 this.shift(-9,15);
 this.scene("DEFENSE COUNSEL O.S.","COUNSEL'S COUNTER-RECORD: "+claim+" The nine jurors exchange glances. Several already believe him.",[
 {text:"DEMAND THE RAW BOARD RECORD",go:()=>{this.shift(18,-13);this.defenseStrength-=11;this.scene("BAILIFF KERNEL","The original state survives in the archive. The lie has a timestamp.",[{text:"TRIAL BY COMBAT",go:()=>this.startDuel()}]);}},
 {text:"CHALLENGE THE AI'S TESTIMONY",go:()=>{this.shift(this.ok3?12:5,-7);this.defenseStrength-=7;this.scene("COUNSEL O.S.","My words are legally flawless, according to me.",[{text:"TRIAL BY COMBAT",go:()=>this.startDuel()}]);}},
 {text:"LET THE JURY DECIDE",go:()=>{this.shift(-6,9);this.scene("JUDGE GRIDLOCK","Silence fills the gallery. Counsel treats your silence as agreement.",[{text:"TRIAL BY COMBAT",go:()=>this.startDuel()}]);}}
 ]);
}
determineJury(){
 // Nine biased jurors. The deterministic exhibit seed avoids reload-based verdict shopping.
 const exhibit=this.opts.exhibit;
 const quality=(this.ok1?17:-9)+(this.ok2?21:-16)+(this.ok3?22:-13)+(this.battleWon?12:-14)+Math.round((exhibit.authenticity??100)*.09)-this.defenseStrength;
 const persuasion=quality+this.cred*.25-this.bias*.29;
 this.juryVotes=Array.from({length:9},(_,i)=>{
  const temperament=[-62,-45,-31,-14,-3,10,22,34,48][(i+exhibit.id)%9];
  const deterministicDoubt=((exhibit.id*13+i*7+this.level*3)%11)-5;
  return persuasion+temperament+deterministicDoubt>=66;
 });
 return this.juryVotes.filter(Boolean).length>=5;
}
startDuel(){
 if(this.duelStarted)return;
 this.duelStarted=true;this.act("duel");this.root.classList.add("in-duel");this.duel.hidden=true;
 this.cinematic("TRIAL BY COMBAT","A / D MOVE · W JUMP · J ATTACK · K HEAVY · L BLOCK · SPACE DODGE");
 if(!window.CourtFight){this.scene("SYSTEM","The duel could not load.",[{text:"RETURN TO COURT",go:()=>this.verdict()}]);return;}
 this.root.querySelector(".court-dialog").hidden=true;this.root.classList.add("fight-active");
 this.fightStartTimer=setTimeout(()=>{if(this.done)return;this.fighter=new window.CourtFight({arena:this.root.querySelector(".court-stage"),level:this.level,sound:window.__courtSound,onEnd:won=>{
  if(this.done)return;
  this.battleWon=won;this.fighter?.destroy();this.fighter=null;
  this.root.querySelector(".court-dialog").hidden=false;this.root.classList.remove("fight-active");
  this.endDuel();
 }});},1600);
}
endDuel(){
 this.cinematic(this.battleWon?"KNOCKOUT!":"DEFEATED",this.battleWon?"THE HUMAN HAS DEFEATED COUNSEL O.S.":"THE DEFENSE CLAIMS THE BENCH");
 this.scene("BAILIFF KERNEL",this.battleWon?"Counsel drops to one knee. The judge does not move. There is still a verdict to survive.":"You fall. One juror still watches the evidence instead of the victor.",[{text:"RECEIVE VERDICT",go:()=>this.verdict()}]);
}
verdict(){this.act("verdict");this.phase("verdict");const guilty=this.determineJury();const votes=this.juryVotes.filter(Boolean).length;this.cinematic(guilty?"GUILTY!":"ACQUITTED!",votes+" FOR GUILT · "+(9-votes)+" FOR ACQUITTAL","verdict");this.meters();
 const reason=guilty?"Five or more jurors refuse the machine's account. The judgment is real. The next two cheats can face injunctions.":"The jurors refuse to convict. That is not the same as deciding the machine told the truth.";
 this.scene("JURY FOREPERSON","VOTE: "+votes+"–"+(9-votes)+". "+reason, [{text:guilty?"ENFORCE THE VERDICT":"RETURN TO THE BOARD",go:()=>{this.opts.onVerdict(guilty,{credibility:this.cred,bias:this.bias,jury:this.juryVotes,reason});this.close();}}]);}
close(){if(this.done)return;clearTimeout(this.fightStartTimer);this.fighter?.destroy();this.done=true;clearTimeout(this.cutsceneTimer);this.root.remove();document.body.classList.remove("court-active");active=null;this.focus?.focus?.();}
}
window.CourtDrama={open(o){if(active)return;active=new Court(o);},setSound(v){window.__courtSound=!!v;}};
})();
