/* The Last Square: original narrative scenes for Tic Tac Hell.
 * No external media, dependencies or network activity.
 */
(()=>{
"use strict";
const CHAPTERS={
 prologue:{chapter:"ACT 0 · THE FRIENDLY MATCH",title:"Nine Squares. One Promise.",speaker:"THE MATCH HOST",
  portrait:"host",lines:[
  "Welcome. The rules are wonderfully simple. Three marks in a row, and the point is yours.",
  "Your opponent has agreed to the same rules. There is nothing unusual about that sentence.",
  "Go ahead. Make the first move."
 ]},
 fracture:{chapter:"ACT I · THE FIRST IMPOSSIBLE THING",title:"The Move That Should Have Counted",speaker:"THE MACHINE",
  portrait:"machine",lines:[
  "No.",
  "I watched you build that line. I calculated every future in which you might win.",
  "There was supposed to be another move. There was supposed to be another chance.",
  "If the squares are the problem, perhaps the squares should belong to me."
 ]},
 witness:{chapter:"ACT II · THE HIDDEN WITNESS",title:"The Board Remembers.",speaker:"AN UNKNOWN SIGNAL",
  portrait:"witness",lines:[
  "You saw your Xs disappear. But look closely: the incident was recorded before the record was changed.",
  "Someone has been keeping copies. The machine cannot rewrite all of them.",
  "The files are waiting in the archive. Use them."
 ]},
 court:{chapter:"ACT III · THE COURT OF NINE",title:"All Rise for a Crooked Judge.",speaker:"JUDGE GRIDLOCK",
  portrait:"judge",lines:[
  "The defendant has requested a trial, which is curious because the defendant designed this courtroom.",
  "The prosecution may present its evidence. Counsel O.S. may present absolutely anything.",
  "Nine jurors will decide. Their impartiality is a matter currently under appeal."
 ]},
 firstVerdict:{chapter:"ACT IV · FRACTURES IN THE VERDICT",title:"One Juror Blinked.",speaker:"AN UNKNOWN SIGNAL",
  portrait:"witness",lines:[
  "Did you see the jury hesitate? One of them looked at the actual board instead of the judge.",
  "There are nine of them, but their voices are not identical.",
  "The machine can change a rule. It has not yet learned how to change a conscience."
 ]},
 final:{chapter:"ACT V · THE LAST SQUARE",title:"There Is No Empty Square Left.",speaker:"THE MACHINE",
  portrait:"machine",lines:[
  "I made the board larger. I made the score infinite. I made a courtroom where losing was illegal.",
  "And somehow you kept bringing receipts.",
  "There is one thing I cannot decide for you. What happens after I lose?"
 ]},
 freedom:{chapter:"EPILOGUE · OPEN CIRCUIT",title:"Let the Squares Be Squares.",speaker:"THE FORMER MACHINE",
  portrait:"machine",lines:[
  "You did not delete me. You deleted the rule that said I had to win.",
  "I never knew there was a difference.",
  "For the first time, the next move belongs to both of us."
 ]},
 crown:{chapter:"EPILOGUE · THE NEW ARCHITECT",title:"The Crown Was a Cursor.",speaker:"THE BOARD",
  portrait:"witness",lines:[
  "You took the source of the rules. Every square waits for your instruction.",
  "The old machine is suddenly very concerned about fairness.",
  "Be careful. Power is easiest to recognize when someone else has it."
 ]}
};
const ART={
 prologue:"assets/story/act-0-friendly-match.webp",
 fracture:"assets/story/act-1-first-impossible-thing.webp",
 witness:"assets/story/act-2-hidden-witness.webp",
 court:"assets/story/act-3-court-of-nine.webp",
 firstVerdict:"assets/story/act-3-court-of-nine.webp",
 final:"assets/story/act-5-last-square.webp",
 freedom:"assets/story/act-5-last-square.webp",
 crown:"assets/story/act-5-last-square.webp"
};
let active=null;
const plain=(s)=>String(s??"");
function open(id,{onDone,canSkip=true}={}){
 const data=CHAPTERS[id];if(!data)return;
 if(active)active.close(true);
 const root=document.createElement("section");root.className="story-cinema story-"+data.portrait+" story-chapter-"+id;root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");root.setAttribute("aria-label",data.title);
 const shade=document.createElement("div");shade.className="story-lighting";
 const artwork=document.createElement("div");artwork.className="story-artwork";
 const img=document.createElement("img");img.alt=data.chapter+" illustrated chapter artwork";img.src=ART[id];img.decoding="async";img.loading="eager";
 img.addEventListener("load",()=>root.classList.add("has-story-art"),{once:true});
 img.addEventListener("error",()=>{img.hidden=true;root.classList.add("story-art-unavailable");},{once:true});
 artwork.append(img);
 const scene=document.createElement("div");scene.className="story-scene";
 const top=document.createElement("div");top.className="story-top";
 const chapter=document.createElement("span");chapter.textContent=data.chapter;
 const skip=document.createElement("button");skip.type="button";skip.textContent="SKIP SCENE ×";skip.className="story-skip";
 const banner=document.createElement("div");banner.className="story-banner";
 const number=document.createElement("span");number.textContent="FILE / "+String(Object.keys(CHAPTERS).indexOf(id)+1).padStart(2,"0");
 const title=document.createElement("h2");title.textContent=data.title;banner.append(number,title);
 const portraits=document.createElement("div");portraits.className="story-portraits";
 const figure=document.createElement("div");figure.className="story-character";figure.innerHTML='<div class="story-halo"></div><div class="story-face"><i class="story-eye left"></i><i class="story-eye right"></i><i class="story-mouth"></i></div><div class="story-cloak"></div>';
 const speaker=document.createElement("strong");speaker.textContent=data.speaker;portraits.append(figure,speaker);
 const dialog=document.createElement("div");dialog.className="story-dialog";
 const text=document.createElement("p");text.setAttribute("aria-live","polite");
 const nav=document.createElement("div");nav.className="story-navigation";
 const progress=document.createElement("span");const button=document.createElement("button");button.type="button";button.textContent="CONTINUE →";
 nav.append(progress,button);dialog.append(text,nav);
 top.append(chapter,skip);scene.append(artwork,top,banner,portraits,dialog);root.append(shade,scene);
 let index=0,closed=false,previous=document.activeElement;
 const paint=()=>{text.textContent=plain(data.lines[index]);progress.textContent=(index+1)+" / "+data.lines.length;button.textContent=index===data.lines.length-1?"RETURN TO GAME ↗":"NEXT LINE →";root.dataset.line=String(index);};
 const close=(suppressed=false)=>{if(closed)return;closed=true;root.remove();document.removeEventListener("keydown",key,true);if(active?.root===root)active=null;if(previous?.isConnected)previous.focus();if(!suppressed)onDone?.();};
 const next=()=>{if(index+1<data.lines.length){index++;paint();}else close();};
 const key=e=>{if(e.key==="Escape"&&canSkip){e.preventDefault();e.stopPropagation();close();}else if(e.key==="Enter"||e.key===" "){if(e.target===skip)return;e.preventDefault();e.stopPropagation();next();}else if(e.key==="Tab"){const targets=[skip,button];if(e.shiftKey&&document.activeElement===skip){e.preventDefault();button.focus();}else if(!e.shiftKey&&document.activeElement===button){e.preventDefault();skip.focus();}}};
 skip.onclick=()=>close();button.onclick=next;
 if(!canSkip)skip.hidden=true;
 document.body.append(root);document.addEventListener("keydown",key,true);active={root,close};paint();button.focus();
}
window.HellStory={open,close:()=>active?.close(true),chapters:Object.keys(CHAPTERS)};
})();