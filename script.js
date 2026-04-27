const questions = [
  { animal:"うさぎ", face:"🐰", answer:"にんじん", food:"🥕", choices:["にんじん","さかな"] },
  { animal:"ねこ", face:"🐱", answer:"さかな", food:"🐟", choices:["さかな","バナナ"] },
  { animal:"いぬ", face:"🐶", answer:"ほね", food:"🦴", choices:["ほね","にんじん"] },
  { animal:"さる", face:"🐵", answer:"バナナ", food:"🍌", choices:["バナナ","さかな"] },
  { animal:"ライオン", face:"🦁", answer:"おにく", food:"🍖", choices:["おにく","にんじん"] },
  { animal:"パンダ", face:"🐼", answer:"たけ", food:"🎋", choices:["たけ","さかな"] },
  { animal:"ぞう", face:"🐘", answer:"りんご", food:"🍎", choices:["りんご","ほね"] },
  { animal:"きょうりゅう", face:"🦖", answer:"おにく", food:"🍖", choices:["おにく","バナナ"] },
  { animal:"ひよこ", face:"🐥", answer:"まめ", food:"🫘", choices:["まめ","さかな"] },
  { animal:"こあら", face:"🐨", answer:"はっぱ", food:"🌿", choices:["はっぱ","おにく"] },
  { animal:"ぺんぎん", face:"🐧", answer:"さかな", food:"🐟", choices:["さかな","りんご"] },
  { animal:"くま", face:"🐻", answer:"はちみつ", food:"🍯", choices:["はちみつ","たけ"] }
];

const comboWords = {
  2:"いいね！✨",
  3:"すごい！⭐",
  4:"じょうず！👏",
  5:"やったね！🎉",
  6:"にこにこ！😊",
  7:"わーい！🌈",
  8:"すごすぎ！✨",
  9:"あと1こ！🎁",
  10:"パーティー！🎉"
};

let idx=0, score=0, combo=0, locked=false;
const $ = id => document.getElementById(id);
const game=$("game"), animal=$("animal"), food=$("food"), nom=$("nom"), stars=$("stars");
const qAnimal=$("qAnimal"), msg=$("msg"), comboMsg=$("comboMsg"), choices=$("choices");
const scoreEl=$("score"), comboEl=$("combo"), party=$("party"), partyBtn=$("partyBtn");

let audioCtx;
function getAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if(audioCtx.state==="suspended") audioCtx.resume();
  return audioCtx;
}
function tone(freq,start,dur,type="sine",gain=.2){
  const ctx=getAudio(), osc=ctx.createOscillator(), vol=ctx.createGain();
  osc.type=type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime+start);
  vol.gain.setValueAtTime(.0001, ctx.currentTime+start);
  vol.gain.exponentialRampToValueAtTime(gain, ctx.currentTime+start+.02);
  vol.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime+start+dur);
  osc.connect(vol); vol.connect(ctx.destination);
  osc.start(ctx.currentTime+start); osc.stop(ctx.currentTime+start+dur+.04);
}
function happySound(level){
  tone(740,0,.14,"triangle",.22);
  tone(980,.10,.16,"triangle",.24);
  tone(1320,.22,.18,"sine",.20);
  if(level>=3){ tone(1560,.34,.16,"sine",.14); }
  if(level>=5){ tone(520,.02,.11,"square",.07); tone(1760,.44,.18,"sine",.12); }
}
function softNo(){
  tone(260,0,.12,"triangle",.08);
  tone(220,.10,.16,"triangle",.06);
}
function shuffle(a){ return [...a].sort(()=>Math.random()-.5); }
function emoji(word){
  return {"にんじん":"🥕","さかな":"🐟","ほね":"🦴","バナナ":"🍌","おにく":"🍖","たけ":"🎋","りんご":"🍎","まめ":"🫘","はっぱ":"🌿","はちみつ":"🍯"}[word] || "🍽️";
}
function q(){ return questions[idx % questions.length]; }
function anim(el, cls){
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}
function render(){
  locked=false;
  const cur=q();
  animal.textContent=cur.face;
  food.textContent=cur.food;
  qAnimal.textContent=cur.animal+"の";
  msg.textContent="タッチしてね";
  comboMsg.textContent="";
  choices.innerHTML="";
  shuffle(cur.choices).forEach(c=>{
    const b=document.createElement("button");
    b.className="choice";
    b.type="button";
    b.innerHTML=`<span class="emoji">${emoji(c)}</span>${c}`;
    b.onclick=()=>answer(c,b);
    choices.appendChild(b);
  });
}
function answer(c,b){
  if(locked) return;
  locked=true;
  const cur=q();
  if(c===cur.answer){
    score++; combo++;
    scoreEl.textContent=score;
    comboEl.textContent="れんぞく "+combo;
    const level=Math.min(combo,10);
    happySound(level);
    msg.textContent="やったー！";
    b.classList.add("ok");
    game.classList.add("flash");
    anim(animal, level>=5 ? "bigHappy":"happy");
    anim(food, "fly");
    anim(nom, "show");
    anim(stars, "show");
    if(comboWords[level]){
      comboMsg.textContent=comboWords[level];
      anim(comboMsg, "show");
    }
    setTimeout(()=>game.classList.remove("flash"),450);
    if(combo>=10){
      setTimeout(()=>party.classList.add("show"),720);
      return;
    }
    setTimeout(()=>{idx++;render();},1050);
  }else{
    combo=0;
    comboEl.textContent="れんぞく 0";
    msg.textContent="だいじょうぶ！もういっかい";
    softNo();
    b.classList.add("no");
    setTimeout(()=>{b.classList.remove("no"); locked=false;},520);
  }
}
partyBtn.onclick=()=>{
  party.classList.remove("show");
  combo=0;
  comboEl.textContent="れんぞく 0";
  idx++;
  render();
};
render();
