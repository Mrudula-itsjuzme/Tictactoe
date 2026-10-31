/* Original real-time courtroom duel, keyboard-controlled. No library, footage or network. */
(()=>{"use strict";
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
class FightEngine{
 constructor({arena,level=1,onEnd,sound=false}){
  this.arena=arena;this.level=level;this.onEnd=onEnd;this.sound=sound;this.live=true;this.finished=false;
  this.keys=new Set();this.player={x:18,y:0,hp:100,max:100,facing:1,stun:0,cool:0,inv:0,guard:false,air:0,velocity:0,action:"idle"};
  this.bot={x:76,y:0,hp:78+level*14,max:78+level*14,facing:-1,stun:0,cool:0,inv:0,guard:false,action:"idle"};
  this.elapsed=0;this.enemyState="approach";this.enemyTimer=.6;this.attackId=0;this.attacks=0;this.last=0;this.raf=0;this.focus=document.activeElement;
  this.canvas=document.createElement("div");this.canvas.className="realtime-duel";this.canvas.tabIndex=0;this.canvas.setAttribute("role","application");this.canvas.setAttribute("aria-label","Real-time courtroom fight. A and D move, W jumps, J attacks, K heavy attacks, L blocks, Space dodges.");
  this.canvas.innerHTML='<div class="fight-head"><div class="fight-side"><b>THE HUMAN</b><div class="fight-meter"><i id="fight-human-hp"></i></div><span id="fight-human-text"></span></div><strong class="fight-level">COURTROOM FIGHT<br>LEVEL '+level+'</strong><div class="fight-side"><b>COUNSEL O.S.</b><div class="fight-meter hostile"><i id="fight-bot-hp"></i></div><span id="fight-bot-text"></span></div></div><div class="fight-announcer" aria-live="polite">THE DEFENSE HAS CHALLENGED YOU.</div><div class="fight-floor"><div class="fighter human"><div class="fighter-body"></div><div class="fighter-name">YOU</div></div><div class="fighter ai"><div class="fighter-body"></div><div class="fighter-name">COUNSEL O.S.</div></div><div class="fight-warning"></div></div><div class="fight-help">A/D MOVE · W JUMP · J STRIKE · K HEAVY · L GUARD · SPACE DODGE · P PAUSE</div><div class="fight-touch"><button data-key="a" aria-label="Move left">◀</button><button data-key="d" aria-label="Move right">▶</button><button data-key="w">JUMP</button><button data-key="j">HIT</button><button data-key="k">HEAVY</button><button data-key="l">BLOCK</button><button data-key=" ">DODGE</button></div>';
  arena.append(this.canvas);this.humanEl=this.canvas.querySelector(".fighter.human");this.botEl=this.canvas.querySelector(".fighter.ai");this.announcer=this.canvas.querySelector(".fight-announcer");this.warning=this.canvas.querySelector(".fight-warning");
  this.keydown=e=>{const k=e.key.toLowerCase();if(["a","d","w","j","k","l"," ","arrowleft","arrowright","arrowup","p"].includes(k)){e.preventDefault();e.stopPropagation();if(k==="p"&&!e.repeat){this.paused=!this.paused;this.announce(this.paused?"PAUSED · PRESS P":"FIGHT!");return;}this.keys.add(k);if(k==="j"&&!e.repeat)this.attack("light");if(k==="k"&&!e.repeat)this.attack("heavy");if(k===" "&&!e.repeat)this.dodge();if((k==="w"||k==="arrowup")&&!e.repeat)this.jump();}};
  this.keyup=e=>{this.keys.delete(e.key.toLowerCase());};
  this.blurred=()=>{this.keys.clear();this.paused=true;this.announce("PAUSED · PRESS P TO RESUME");};
  document.addEventListener("keydown",this.keydown,true);document.addEventListener("keyup",this.keyup,true);window.addEventListener("blur",this.blurred);
  this.canvas.querySelectorAll(".fight-touch button").forEach(button=>{const key=button.dataset.key;button.addEventListener("pointerdown",e=>{e.preventDefault();this.keys.add(key);if(key==="j")this.attack("light");if(key==="k")this.attack("heavy");if(key===" ")this.dodge();if(key==="w")this.jump();button.setPointerCapture?.(e.pointerId);});for(const evt of ["pointerup","pointercancel","lostpointercapture"])button.addEventListener(evt,()=>this.keys.delete(key));});
  this.render();this.canvas.focus();this.raf=requestAnimationFrame(t=>this.frame(t));
 }
 announce(text){this.announcer.textContent=text;}
 jump(){const p=this.player;if(p.y===0&&p.stun<=0){p.velocity=54;p.action="jump";}}
 dodge(){const p=this.player;if(p.cool>0||p.stun>0||p.inv>0)return;p.inv=.55;p.cool=.48;p.x=clamp(p.x+p.facing*15,7,93);p.action="dodge";this.announce("PERFECT DODGE WINDOW!");}
 attack(kind){const p=this.player;if(this.paused||!this.live||p.cool>0||p.stun>0)return;const heavy=kind==="heavy";p.cool=heavy?.8:.34;p.action=kind;p.facing=Math.sign(this.bot.x-p.x)||1;const delay=heavy?220:85;const attackNumber=++this.attackId;setTimeout(()=>{if(!this.live||this.paused||attackNumber!==this.attackId)return;const b=this.bot;const reach=heavy?21:15;if(Math.abs(p.x-b.x)>reach||p.y>20){this.announce("WHIFF! GET CLOSER.");return;}const dmg=heavy?27:13;const actual=b.guard&&!heavy?Math.ceil(dmg*.2):dmg;b.hp=clamp(b.hp-actual,0,b.max);b.stun=heavy?.48:.17;b.x=clamp(b.x+p.facing*(heavy?6:3),7,93);this.announce((heavy?"HEAVY BREAK":"STRIKE")+" · "+actual+" DAMAGE");this.flash(this.botEl);if(b.hp<=0)this.finish(true);},delay);}
 flash(el){el.classList.remove("damaged");void el.offsetWidth;el.classList.add("damaged");}
 aiAction(){const p=this.player,b=this.bot,dist=Math.abs(p.x-b.x);if(b.stun>0||this.paused)return;const approaching=dist>17;
 if(approaching){b.guard=false;b.x+=Math.sign(p.x-b.x)*(7+this.level*.6)*.28;this.enemyState="approach";this.enemyTimer=.15;return;}
 const choices=["strike","guard","heavy","strike","dodge"];const choice=choices[(this.attacks+this.level+Math.floor(p.hp/30))%choices.length];this.attacks++;this.enemyState=choice;
 if(choice==="guard"){b.guard=true;this.announce("ENEMY GUARDS · USE HEAVY TO BREAK");this.enemyTimer=.8;return;}
 b.guard=false;
 if(choice==="dodge"){b.x=clamp(b.x+(b.x>p.x?9:-9),7,93);this.announce("COUNSEL O.S. EVADES");this.enemyTimer=.5;return;}
 const heavy=choice==="heavy";this.announce(heavy?"WARNING: HEAVY ATTACK CHARGING!":"WARNING: INCOMING STRIKE!");
 this.warning.classList.add("active");const hitDelay=heavy?680:400;
 setTimeout(()=>{if(!this.live||this.paused)return;this.warning.classList.remove("active");if(Math.abs(p.x-b.x)>(heavy?19:15)||p.inv>0||p.y>17){this.announce("ENEMY MISSED!");return;}
 const power=heavy?19+this.level*3:9+this.level*2;
 const damage=this.keys.has("l")?Math.ceil(power*.15):power;
 p.hp=clamp(p.hp-damage,0,p.max);p.stun=this.keys.has("l")?0:.2;p.x=clamp(p.x+Math.sign(p.x-b.x)*4,7,93);this.announce(this.keys.has("l")?"BLOCKED · "+damage+" CHIP DAMAGE":"HIT! −"+damage+" HP");this.flash(this.humanEl);if(p.hp<=0)this.finish(false);
 },hitDelay);
 this.enemyTimer=heavy?1.35:.95;
 }
 frame(t){if(!this.live)return;const dt=Math.min((t-(this.last||t))/1000,.05);this.last=t;
 if(!this.paused){this.elapsed+=dt;const p=this.player,b=this.bot;
 for(const x of [p,b]){x.cool=Math.max(0,x.cool-dt);x.inv=Math.max(0,x.inv-dt);x.stun=Math.max(0,x.stun-dt);}
 const dir=(this.keys.has("a")||this.keys.has("arrowleft")?-1:0)+(this.keys.has("d")||this.keys.has("arrowright")?1:0);
 p.guard=this.keys.has("l")&&p.y===0&&p.stun===0;
 if(dir&&p.stun===0&&!p.guard)p.x=clamp(p.x+dir*31*dt,6,94);
 p.facing=Math.sign(b.x-p.x)||1;b.facing=-p.facing;
 if(p.y>0||p.velocity>0){p.y=Math.max(0,p.y+p.velocity*dt);p.velocity-=140*dt;if(p.y===0)p.velocity=0;}
 if(!p.guard&&!dir&&p.cool<=0)p.action="idle";
 this.enemyTimer-=dt;if(this.enemyTimer<=0){this.enemyTimer=.4;this.aiAction();}
 }
 this.render();this.raf=requestAnimationFrame(x=>this.frame(x));
 }
 render(){const p=this.player,b=this.bot;this.humanEl.style.left=p.x+"%";this.botEl.style.left=b.x+"%";this.humanEl.style.bottom=(13+p.y)+"%";this.humanEl.style.transform="translateX(-50%) scaleX("+p.facing+")";this.botEl.style.transform="translateX(-50%) scaleX("+b.facing+")";this.humanEl.classList.toggle("blocking",p.guard);this.botEl.classList.toggle("blocking",b.guard);this.humanEl.classList.toggle("dodging",p.inv>0);
 this.canvas.querySelector("#fight-human-hp").style.width=100*p.hp/p.max+"%";this.canvas.querySelector("#fight-bot-hp").style.width=100*b.hp/b.max+"%";this.canvas.querySelector("#fight-human-text").textContent=Math.ceil(p.hp)+" HP";this.canvas.querySelector("#fight-bot-text").textContent=Math.ceil(b.hp)+" HP";
 }
 finish(win){if(this.finished)return;this.finished=true;this.live=false;this.announce(win?"KNOCKOUT! YOU WON THE DUEL.":"THE DEFENSE WINS THIS ROUND.");this.keys.clear();this.cleanupInputs();setTimeout(()=>{if(this.canvas.isConnected)this.onEnd(win);},950);}
 cleanupInputs(){document.removeEventListener("keydown",this.keydown,true);document.removeEventListener("keyup",this.keyup,true);window.removeEventListener("blur",this.blurred);cancelAnimationFrame(this.raf);}
 destroy(){this.live=false;this.finished=true;this.cleanupInputs();this.canvas.remove();}
}
window.CourtFight=FightEngine;
})();