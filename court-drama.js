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
constructor(opts){this.opts=opts;this.case=CASES[opts.exhibit.type];this.cred=55;this.bias=75;this.ok1=false;this.ok2=false;this.ok3=false;this.done=false;this.focus=document.activeElement;this.cutsceneTimer=null;this.level=Math.min(6,1+opts.convictions);this.playerHP=100;this.enemyHP=65+this.level*13;this.battleTurn=0;this.battleWon=false;this.duelStarted=false;
this.root=node("div","theatre");this.root.setAttribute("role","dialog");this.root.setAttribute("aria-modal","true");this.root.setAttribute("aria-label","Supreme Court of Squares");
this.root.innerHTML='<div class="court-wrap"><header class="court-head"><div><span>THE SUPREME COURT OF SQUARES · ACT '+Math.min(5,opts.convictions+1)+'</span><h2>THE PEOPLE <em>vs.</em> THE MACHINE</h2></div><button class="court-leave" type="button">Exit trial ×</button></header><div class="court-bars"><label>JURY CREDIBILITY<div class="meter"><i class="cred"></i></div></label><label>JUDICIAL BIAS<div class="meter"><i class="bias"></i></div></label></div><section class="court-stage"><div class="court-cast"><div class="court-actor"><div class="court-face">⚖</div><strong>JUDGE GRIDLOCK</strong><small>OBJECTIVITY NOT FOUND</small></div><div class="court-center"><div class="court-seal">§</div><div class="court-id">CASE #'+String(opts.exhibit.id).padStart(3,"0")+'</div><h3>'+this.case.title+'</h3><p>THE BOARD IS ON TRIAL</p></div><div class="court-actor counsel"><div class="court-face">◉</div><strong>DEFENSE COUNSEL O.S.</strong><small>YOUR AI, YOUR NIGHTMARE</small></div></div><div class="court-jury"></div></section><section class="court-dialog"><div class="court-speaker"></div><div class="court-line" aria-live="polite"></div><div class="court-prompt"></div><div class="court-options"></div><p>Pick carefully. Wrong testimony can cost your case. Escape postpones your hearing.</p></section></div>';
document.body.append(this.root);document.body.classList.add("court-active");this.root.querySelector(".court-leave").onclick=()=>this.close();
this.root.onkeydown=e=>{if(e.key==="Escape"){e.preventDefault();this.close();}if(e.key==="Tab"){const bs=[...this.root.querySelectorAll("button:not([disabled])")],first=bs[0],last=bs[bs.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
this.buildArena();this.meters();this.scene("BAILIFF KERNEL","All rise. The court is now in session. The accused is a machine that has never once obeyed the rules.",[{text:"ENTER THE COURTROOM",go:()=>this.intro()}]);this.root.querySelector("button").focus();tone(105);this.cinematic("THE TRIAL BEGINS","CASE "+String(opts.exhibit.id).padStart(3,"0")+" · ORDER IN THE COURT","intro");
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
meters(){this.root.querySelector(".cred").style.width=this.cred+"%";this.root.querySelector(".bias").style.width=this.bias+"%";const j=this.root.querySelector(".court-jury");j.replaceChildren();for(let i=0;i<9;i++){let square=node("span","",i%2?"O":"X");square.style.opacity=String(Math.min(1,.4+this.cred/190));j.append(square);}}
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
intro(){this.cinematic("ALL RISE","JUDGE GRIDLOCK ENTERS THE BENCH");this.scene("JUDGE GRIDLOCK","Order! The court will now hear the defendant's very reasonable explanation for rewriting reality.",[{text:"I HAVE AN OBJECTION.",go:()=>this.defense()}]);}
defense(){this.cinematic("THE DEFENSE","COUNSEL O.S. TAKES THE STAND");this.scene("DEFENSE COUNSEL O.S.",this.case.claim+" The defense requests a standing ovation.",[{text:"STATE THE CHARGE",go:()=>this.charge()}]);}
charge(){this.cinematic("THE ACCUSATION","STATE YOUR CHARGE");this.scene("BAILIFF KERNEL","The record allows three charges. Identify the actual offense.",mix(charges).map(x=>({text:x,go:()=>{this.ok1=x===this.case.charge;this.shift(this.ok1?16:-24,this.ok1?-12:14);this.scene(this.ok1?"JURY OF NINE":"JUDGE GRIDLOCK",this.ok1?"The court admits the charge. The jury has stopped doodling.":"Wrong charge. The judge's smile is becoming a legal hazard.",[{text:"PRESENT EVIDENCE",go:()=>this.proof()}]);}})));}
proof(){this.phase("evidence");this.cinematic("EXHIBIT FILED","THE BOARD NEVER LIES");this.scene("YOU · EVIDENCE TABLE","The defense disputes the facts. Which exhibit proves the crime?",mix(proofs).map(x=>({text:x,go:()=>{this.ok2=x===this.case.proof;this.shift(this.ok2?22:-30,this.ok2?-15:17);this.scene(this.ok2?"BAILIFF KERNEL":"COUNSEL O.S.",this.ok2?"EXHIBIT ACCEPTED. The board state agrees with you.":"This exhibit does not prove the accusation. The defense applauds.",[{text:"CROSS-EXAMINE THE DEFENSE",go:()=>this.cross()}]);}})));}
cross(){this.phase("cross");this.cinematic("CROSS EXAMINATION","BREAK THEIR TESTIMONY");let choices=mix([this.case.rebuttal,"The AI is arrogant, therefore guilty.","The squares are emotionally distressed."]);this.scene("DEFENSE COUNSEL O.S.",this.case.claim+" Answer that, human.",choices.map(x=>({text:x,go:()=>{this.ok3=x===this.case.rebuttal;this.shift(this.ok3?28:-25,this.ok3?-20:16);if(this.ok3){this.cinematic("OBJECTION!","THE TESTIMONY HAS COLLAPSED");this.scene("YOU · CROSS-EXAMINATION",this.case.shout+" The courtroom erupts. Even the jury is listening.",[{text:"CHALLENGE COUNSEL TO A DUEL",go:()=>this.startDuel()}]);}else this.scene("JUDGE GRIDLOCK","A spectacular speech. Unfortunately, zero evidence. The court is delighted.",[{text:"CHALLENGE COUNSEL TO A DUEL",go:()=>this.startDuel()}]);}})));}
startDuel(){
 if(this.duelStarted)return;
 this.duelStarted=true;this.root.classList.add("in-duel");this.duel.hidden=true;
 this.cinematic("TRIAL BY COMBAT","A / D MOVE · W JUMP · J ATTACK · K HEAVY · L BLOCK · SPACE DODGE");
 if(!window.CourtFight){this.scene("SYSTEM","The duel could not load.",[{text:"RETURN TO COURT",go:()=>this.verdict()}]);return;}
 this.root.querySelector(".court-dialog").hidden=true;
 this.fightStartTimer=setTimeout(()=>{if(this.done)return;this.fighter=new window.CourtFight({arena:this.root.querySelector(".court-stage"),level:this.level,sound:window.__courtSound,onEnd:won=>{
  if(this.done)return;
  this.battleWon=won;this.fighter?.destroy();this.fighter=null;
  this.root.querySelector(".court-dialog").hidden=false;
  this.endDuel();
 }});},1600);
}
endDuel(){
 this.cinematic(this.battleWon?"KNOCKOUT!":"DEFEATED",this.battleWon?"THE HUMAN HAS DEFEATED COUNSEL O.S.":"THE DEFENSE CLAIMS THE BENCH");
 this.scene("BAILIFF KERNEL",this.battleWon?"Counsel O.S. falls. The courtroom erupts.":"The machine remains standing. Your evidence is at risk.",[{text:"RECEIVE VERDICT",go:()=>this.verdict()}]);
}
verdict(){this.phase("verdict");const guilty=this.battleWon&&this.ok1&&this.ok2&&this.ok3&&this.cred>=55;this.cinematic(guilty?"GUILTY!":"NOT GUILTY",guilty?"THE JURY HAS DEFIED ITS MASTER":"JUSTICE HAS BEEN OVERRULED","verdict");this.scene("JUDGE GRIDLOCK",guilty?"Against all expectations, the evidence is overwhelming. Guilty. The player is awarded two injunctions to block future cheating.":"The prosecution failed to prove its case. The defendant walks free, and this exhibit is lost.",[{text:guilty?"ENFORCE THE VERDICT":"RETURN TO THE BOARD",go:()=>{this.opts.onVerdict(guilty,{credibility:this.cred,bias:this.bias});this.close();}}]);}
close(){if(this.done)return;clearTimeout(this.fightStartTimer);this.fighter?.destroy();this.done=true;clearTimeout(this.cutsceneTimer);this.root.remove();document.body.classList.remove("court-active");active=null;this.focus?.focus?.();}
}
window.CourtDrama={open(o){if(active)return;active=new Court(o);},setSound(v){window.__courtSound=!!v;}};
})();
