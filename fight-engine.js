/* Tic Tac Hell: Trial Combat v2.
 * Original implementation. Design informed by permissively licensed web fighter
 * patterns, not a copy of third-party source or artwork.
 * Sources documented in THIRD_PARTY_ASSETS.md.
 */
(()=>{"use strict";
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const MOVES={
 light:{wind:.095,active:.11,recover:.19,damage:11,reach:16,stun:.20,knock:3,stamina:9},
 heavy:{wind:.29,active:.14,recover:.36,damage:27,reach:20,stun:.42,knock:7,stamina:25},
 special:{wind:.22,active:.19,recover:.44,damage:34,reach:24,stun:.48,knock:9,stamina:42}
};
const ASSET_BODY='<div class="fighter-hair"></div><div class="fighter-head"><i class="fighter-eye"></i></div><div class="fighter-torso"></div><div class="fighter-arm near"></div><div class="fighter-arm far"></div><div class="fighter-leg near"></div><div class="fighter-leg far"></div><div class="fighter-aura"></div>';
class CourtFight {
 constructor({arena,level=1,onEnd,sound=false}){
  this.arena=arena;this.level=clamp(level,1,7);this.onEnd=onEnd;this.sound=sound;
  this.alive=true;this.complete=false;this.paused=false;this.keys=new Set();
  this.t=0;this.last=0;this.raf=0;this.accumulator=0;this.step=1/60;this.round=1;this.wins=0;this.enemyWins=0;
  this.player=this.fighter(22,100,100,1);
  this.bot=this.fighter(78,84+this.level*12,100,-1);
  this.ai={think:0,phase:"approach",read:0,guardTime:0,preferred:"light"};
  this.combo=0;this.lastConnect=-10;this.effects=[];this.deadline=85;
  this.root=document.createElement("section");this.root.className="realtime-duel fight-v2";
  this.root.tabIndex=0;this.root.setAttribute("role","group");this.root.setAttribute("aria-label","Court battle. A D movement, W jump, J jab, K heavy, U special, L block, Space dodge, P pause.");
  this.root.innerHTML='<div class="fight-head"><div class="fight-side"><b>YOU / PROSECUTION</b><div class="fight-meter"><i data-hp="player"></i></div><span data-read="player"></span><div class="fight-meter stamina"><i data-sp="player"></i></div></div><div class="fight-level"><strong>CASE BATTLE · LV '+this.level+'</strong><span data-clock>85</span><small data-round>ROUND 1 · FIRST TO 2</small></div><div class="fight-side"><b>COUNSEL O.S.</b><div class="fight-meter hostile"><i data-hp="bot"></i></div><span data-read="bot"></span><div class="fight-meter stamina"><i data-sp="bot"></i></div></div></div><div class="fight-announcer" role="status" aria-live="polite">THE TRIAL IS NOW A FIGHT.</div><div class="fight-floor"><div class="fight-scenery">⚖</div><div class="fighter human"><div class="fighter-body">'+ASSET_BODY+'</div><div class="fighter-name">YOU</div></div><div class="fighter ai"><div class="fighter-body">'+ASSET_BODY+'</div><div class="fighter-name">COUNSEL O.S.</div></div><div class="fight-warning"></div><div class="fight-particles"></div></div><div class="fight-help">A/D MOVE · W JUMP · J JAB · K HEAVY · U SPECIAL · L BLOCK · SPACE DODGE · P PAUSE</div><div class="fight-touch"><button data-key="a">◀</button><button data-key="d">▶</button><button data-key="w">JUMP</button><button data-key="j">JAB</button><button data-key="k">HEAVY</button><button data-key="u">SPECIAL</button><button data-key="l">BLOCK</button><button data-key=" ">DODGE</button></div>';
  arena.append(this.root);
  this.pEl=this.root.querySelector(".fighter.human");this.bEl=this.root.querySelector(".fighter.ai");
  this.announceEl=this.root.querySelector(".fight-announcer");this.warnEl=this.root.querySelector(".fight-warning");
  this.keydown=e=>{const key=e.key.toLowerCase();if(!["a","d","w","j","k","u","l"," ","p","arrowleft","arrowright","arrowup"].includes(key))return;
   e.preventDefault();e.stopPropagation();
   if(key==="p"&&!e.repeat){this.paused=!this.paused;this.announce(this.paused?"PAUSED · P TO RESUME":"FIGHT!");return;}
   if(this.paused||this.complete)return;
   this.keys.add(key);
   if(!e.repeat)this.input(key);
  };
  this.keyup=e=>this.keys.delete(e.key.toLowerCase());
  this.blur=()=>{this.keys.clear();this.paused=true;this.announce("PAUSED · P TO RESUME");};
  document.addEventListener("keydown",this.keydown,true);document.addEventListener("keyup",this.keyup,true);window.addEventListener("blur",this.blur);
  for(const button of this.root.querySelectorAll(".fight-touch button")){
   const key=button.dataset.key;
   button.addEventListener("pointerdown",e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);this.keys.add(key);this.input(key);});
   for(const name of ["pointerup","pointercancel","lostpointercapture"])button.addEventListener(name,()=>this.keys.delete(key));
  }
  this.root.focus();this.paint();this.raf=requestAnimationFrame(t=>this.frame(t));
 }
 fighter(x,hp,stamina,facing){return {x,y:0,vy:0,hp,maxHp:hp,sp:stamina,face:facing,stun:0,iframes:0,dodge:0,guard:false,move:null,attackUsed:false,active:false,combo:0,stagger:0};}
 tone(freq=320,duration=.1){if(!this.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const a=this.audio||(this.audio=new C()),o=a.createOscillator(),g=a.createGain();o.type="triangle";o.frequency.setValueAtTime(freq,a.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(60,freq*.62),a.currentTime+duration);g.gain.setValueAtTime(.038,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+duration);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+duration);}catch{}}
 announce(message){this.announceEl.textContent=message;}
 input(k){if(k==="j")this.begin(this.player,"light");if(k==="k")this.begin(this.player,"heavy");if(k==="u")this.begin(this.player,"special");if(k===" " )this.dodge(this.player);if((k==="w"||k==="arrowup")&&this.player.y===0&&this.player.stun<=0){this.player.vy=62;}}
 begin(actor,type){
  if(this.complete||this.paused||actor.stun>0||actor.move||actor.dodge>0)return false;
  const data=MOVES[type];if(actor.sp<data.stamina)return false;
  actor.sp-=data.stamina;actor.move={type,elapsed:0};actor.attackUsed=false;actor.guard=false;
  this.announce(actor===this.bot?(type==="heavy"?"WARNING · HEAVY WIND-UP":type==="special"?"WARNING · SPECIAL WIND-UP":"INCOMING JAB"):(type==="special"?"PROSECUTION SPECIAL!":type.toUpperCase()));
  if(actor===this.bot)this.warnEl.classList.add("active");
  return true;
 }
 dodge(actor){if(actor.stun>0||actor.move||actor.dodge>0||actor.sp<21)return;actor.sp-=21;actor.dodge=.36;actor.iframes=.28;actor.x=clamp(actor.x+actor.face*11,6,94);this.announce(actor===this.player?"PERFECT ESCAPE WINDOW!":"COUNSEL SIDESTEPS");}
 evaluateHit(attacker,target,def){
  if(attacker.attackUsed)return;
  attacker.attackUsed=true;
  if(Math.abs(attacker.x-target.x)>def.reach||Math.abs(attacker.y-target.y)>17||attacker.face*(target.x-attacker.x)<-3){this.announce("WHIFF · OUT OF RANGE");return;}
  if(target.iframes>0){this.announce("DODGED!");return;}
  const blocked=target.guard&&target.sp>0;
  let damage=blocked?Math.ceil(def.damage*.14):def.damage;
  if(blocked){target.sp=Math.max(0,target.sp-(def.stamina+7));if(def===MOVES.heavy||def===MOVES.special){target.stun=.36;this.announce("GUARD BREAK!");}}
  else target.stun=def.stun;
  target.hp=Math.max(0,target.hp-damage);this.tone(blocked?200:def===MOVES.special?115:350,blocked?.07:.17);
  target.x=clamp(target.x+attacker.face*def.knock,6,94);
  attacker.sp=Math.min(100,attacker.sp+8);
  if(attacker===this.player){this.combo=this.t-this.lastConnect<1.2?this.combo+1:1;this.lastConnect=this.t;}
  this.announce((blocked?"BLOCKED · ":"HIT · ")+damage+" DAMAGE"+(attacker===this.player&&this.combo>1?" · "+this.combo+" COMBO":""));
  const dom=target===this.player?this.pEl:this.bEl;dom.classList.remove("damaged");void dom.offsetWidth;dom.classList.add("damaged");
  this.spark(target.x,target.y,def===MOVES.special?"✦":"✕");
  if(target.hp<=0)this.finishRound(attacker===this.player);
 }
 spark(x,y,label){const e=document.createElement("span");e.className="combat-spark";e.textContent=label;e.style.left=x+"%";e.style.bottom=(20+y)+"%";this.root.querySelector(".fight-particles").append(e);this.effects.push({e,ttl:.4});}
 simulateActor(actor,target,dt){
  actor.stun=Math.max(0,actor.stun-dt);actor.iframes=Math.max(0,actor.iframes-dt);actor.dodge=Math.max(0,actor.dodge-dt);
  actor.sp=Math.min(100,actor.sp+dt*(actor.guard?4:17));
  if(actor.y>0||actor.vy>0){actor.y=Math.max(0,actor.y+actor.vy*dt);actor.vy-=155*dt;if(actor.y===0)actor.vy=0;}
  if(!actor.move)return;
  actor.move.elapsed+=dt;const data=MOVES[actor.move.type],t=actor.move.elapsed;
  if(!actor.attackUsed&&t>=data.wind&&t<=data.wind+data.active)this.evaluateHit(actor,target,data);
  if(t>=data.wind+data.active+data.recover){actor.move=null;if(actor===this.bot)this.warnEl.classList.remove("active");}
 }
 aiThink(dt){
  const p=this.player,b=this.bot,dist=Math.abs(p.x-b.x);
  if(b.stun>0||b.move||b.dodge>0)return;
  b.face=Math.sign(p.x-b.x)||1;
  if(this.ai.guardTime>0){this.ai.guardTime=Math.max(0,this.ai.guardTime-dt);b.guard=true;return;}
  b.guard=false;
  const safe=dist>16;
  if(safe){b.x=clamp(b.x+b.face*(12+this.level*1.3)*dt,6,94);this.ai.phase="closing";return;}
  this.ai.think-=dt;if(this.ai.think>0)return;
  this.ai.think=clamp(.72-this.level*.065,.28,.72);
  // React to sustained guard, attacking wind-ups and spacing; retain readable tells.
  let move="light";
  if(p.guard&&b.sp>30)move="heavy";
  else if(p.move?.type==="heavy"&&b.sp>22){this.dodge(b);return;}
  else if(b.hp<b.maxHp*.3&&b.sp>25&&this.ai.read++%3===0){b.guard=true;this.ai.guardTime=.55;this.ai.think=.45;this.announce("COUNSEL BRACES FOR IMPACT");return;}
  else if(b.sp>47&&this.ai.read++%4===0)move="special";
  if(!this.begin(b,move)){b.guard=true;this.ai.think=.22;}
 }
 frame(time){
  if(!this.alive)return;const dt=Math.min((time-(this.last||time))/1000,.05);this.last=time;
  if(!this.paused&&!this.complete){
   this.accumulator+=dt;
   let iterations=0;
   while(this.accumulator>=this.step&&iterations++<4){this.tick(this.step);this.accumulator-=this.step;}
  }
  this.paint();
  this.raf=requestAnimationFrame(t=>this.frame(t));
 }
 tick(dt){
  this.t+=dt;this.deadline=Math.max(0,this.deadline-dt);
  const p=this.player,b=this.bot;
  p.face=Math.sign(b.x-p.x)||1;
  p.guard=this.keys.has("l")&&!p.move&&p.stun<=0&&p.y===0&&p.sp>0;
  if(p.guard)p.sp=Math.max(0,p.sp-5*dt);
  const dir=(this.keys.has("a")||this.keys.has("arrowleft")?-1:0)+(this.keys.has("d")||this.keys.has("arrowright")?1:0);
  if(dir&&!p.guard&&!p.move&&!p.stun)p.x=clamp(p.x+dir*36*dt,6,94);
  this.simulateActor(p,b,dt);this.simulateActor(b,p,dt);this.aiThink(dt);
  for(const effect of this.effects)effect.ttl-=dt;
  this.effects=this.effects.filter(x=>{if(x.ttl>0)return true;x.e.remove();return false;});
  if(this.deadline<=0)this.finishRound(p.hp>=b.hp/b.maxHp*100);
 }
 finishRound(win){
  if(this.complete)return;this.complete=true;this.warnEl.classList.remove("active");
  if(win)this.wins++;else this.enemyWins++;this.tone(win?640:115,.35);
  this.announce(win?"ROUND TO THE HUMAN!":"ROUND TO COUNSEL O.S.!");
  this.paint();
  if(this.wins>=2||this.enemyWins>=2){this.finishMatch(this.wins>=2);return;}
  this.nextRoundAt=this.t;
  this.pendingRound=setTimeout(()=>{if(!this.alive)return;this.round++;this.complete=false;this.deadline=85;this.player=this.fighter(22,100,100,1);this.bot=this.fighter(78,84+this.level*12,100,-1);this.ai.think=.8;this.ai.guardTime=0;this.combo=0;this.announce("ROUND "+this.round+" · FIGHT!");},1400);
 }
 finishMatch(win){
  this.announce(win?"FINAL KNOCKOUT · THE PROSECUTION WINS":"FINAL KNOCKOUT · THE DEFENSE WINS");
  this.pendingEnd=setTimeout(()=>{if(this.alive)this.onEnd(win);},1250);
 }
 paint(){
  const p=this.player,b=this.bot;
  const draw=(actor,el)=>{el.style.left=actor.x+"%";el.style.bottom=(13+actor.y)+"%";el.style.transform="translateX(-50%) scaleX("+actor.face+")";el.classList.toggle("blocking",actor.guard);el.classList.toggle("dodging",actor.dodge>0);el.classList.toggle("airborne",actor.y>3);el.classList.toggle("fast-swing",actor.move?.type==="light");el.classList.toggle("heavy-swing",actor.move?.type==="heavy"||actor.move?.type==="special");};
  draw(p,this.pEl);draw(b,this.bEl);
  this.root.querySelector('[data-hp="player"]').style.width=100*p.hp/p.max+"%";
  this.root.querySelector('[data-hp="bot"]').style.width=100*b.hp/b.maxHp+"%";
  this.root.querySelector('[data-sp="player"]').style.width=p.sp+"%";
  this.root.querySelector('[data-sp="bot"]').style.width=b.sp+"%";
  this.root.querySelector('[data-read="player"]').textContent=Math.ceil(p.hp)+" HP";
  this.root.querySelector('[data-read="bot"]').textContent=Math.ceil(b.hp)+" HP";
  this.root.querySelector("[data-clock]").textContent=Math.ceil(this.deadline);
  this.root.querySelector("[data-round]").textContent="ROUND "+this.round+" · "+this.wins+" - "+this.enemyWins;
 }
 destroy(){this.alive=false;clearTimeout(this.pendingRound);clearTimeout(this.pendingEnd);cancelAnimationFrame(this.raf);document.removeEventListener("keydown",this.keydown,true);document.removeEventListener("keyup",this.keyup,true);window.removeEventListener("blur",this.blur);this.keys.clear();if(this.audio){this.audio.close().catch(()=>{});this.audio=null;}this.root.remove();}
}
window.CourtFight=CourtFight;
})();