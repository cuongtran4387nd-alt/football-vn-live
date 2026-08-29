const S={m:[],h:[],f:"all",league:"",channel:"",q:"",day:0,updated:null};
const $=s=>document.querySelector(s), esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const vn=x=>new Intl.DateTimeFormat("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(x));
function countdown(x){let n=new Date(x)-Date.now();if(n<=0)return"bắt đầu";let h=Math.floor(n/36e5),m=Math.floor(n%36e5/6e4),s=Math.floor(n%6e4/1e3);return h?`còn ${h}g ${m}p`:m?`còn ${m}p ${s}s`:`còn ${s}s`}
function dayKey(x){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Ho_Chi_Minh",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(x))}
function targetDay(){let d=new Date();d.setDate(d.getDate()+S.day);return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Ho_Chi_Minh",year:"numeric",month:"2-digit",day:"2-digit"}).format(d)}
function render(){
 let a=S.m.filter(x=>x.status!=="finished"&&x.status!=="post");
 if(S.day===0)a=a.filter(x=>x.status==="live"||new Date(x.start)<=Date.now()+864e5);
 else a=a.filter(x=>dayKey(x.start)===targetDay());
 if(S.f!=="all")a=a.filter(x=>x.status===S.f);
 if(S.league)a=a.filter(x=>x.competition===S.league);
 if(S.channel)a=a.filter(x=>(x.channels||[]).some(c=>(typeof c==="string"?c:c.name)===S.channel));
 if(S.q)a=a.filter(x=>`${x.home} ${x.away} ${x.competition}`.toLowerCase().includes(S.q.toLowerCase()));
 a.sort((x,y)=>new Date(x.start)-new Date(y.start));
 $("#list").innerHTML=a.map(x=>`<article class="card ${x.status}">
 <div class="head"><span>${esc(x.competition)} · ${esc(x.country||"")}</span><span class="state">${x.status==="live"?"🔴 LIVE":x.status==="postponed"?"⏸ HOÃN":"🟢 SẮP ĐÁ"}</span></div>
 <div class="teams"><div class="team">${esc(x.home)}</div><div><div class="score">${x.status==="live"&&x.home_score!=null?esc(x.home_score)+" - "+esc(x.away_score):"VS"}</div><div class="when">${vn(x.start)}</div><div class="count">${x.status==="live"?esc(x.clock||"Đang thi đấu"):countdown(x.start)}</div></div><div class="team away">${esc(x.away)}</div></div>
 <div class="channels">${(x.channels||[]).slice().sort((a,b)=>(a.priority??99)-(b.priority??99)).map((c,i)=>`<span class="ch ${i===0?"first":""}">${i===0?"⭐ ":""}${esc(typeof c==="string"?c:c.name)}</span>`).join("")}</div>
 <div class="source">Nguồn lịch: ${esc(x.source||"scoreboard")} · Kênh là metadata/candidate, không phải xác nhận bản quyền.</div></article>`).join("");
 $("#empty").classList.toggle("hidden",a.length>0);
 $("#liveN").textContent=S.m.filter(x=>x.status==="live").length;
 $("#upN").textContent=S.m.filter(x=>x.status==="upcoming").length;
 $("#allN").textContent=a.length; $("#srcN").textContent=S.h.filter(x=>x.ok).length;
 $("#notice").textContent=`Cập nhật ${S.updated?vn(S.updated):"—"} · ${S.day===0?"hôm nay + 24 giờ":"ngày đã chọn"}`;
 $("#health").textContent=JSON.stringify(S.h,null,2);
}
async function load(){
 try{let [a,b]=await Promise.all([fetch(`data/matches.json?t=${Date.now()}`,{cache:"no-store"}),fetch(`data/health.json?t=${Date.now()}`,{cache:"no-store"})]);let d=await a.json();S.m=d.matches||[];S.updated=d.updated_at;S.h=(await b.json()).sources||[];
 let ls=[...new Set(S.m.map(x=>x.competition))].sort(),cs=[...new Set(S.m.flatMap(x=>(x.channels||[]).map(c=>typeof c==="string"?c:c.name)))].sort();
 $("#league").innerHTML='<option value="">Tất cả giải</option>'+ls.map(x=>`<option>${esc(x)}</option>`).join("");
 $("#channel").innerHTML='<option value="">Tất cả kênh</option>'+cs.map(x=>`<option>${esc(x)}</option>`).join("");render();
 }catch(e){$("#notice").textContent="Không tải được dữ liệu mới."}}
document.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-f]").forEach(x=>x.classList.remove("active"));b.classList.add("active");S.f=b.dataset.f;render()});
$("#league").onchange=e=>{S.league=e.target.value;render()};$("#channel").onchange=e=>{S.channel=e.target.value;render()};$("#q").oninput=e=>{S.q=e.target.value;render()};
$("#prevDay").onclick=()=>{S.day--;render()};$("#nextDay").onclick=()=>{S.day++;render()};$("#today").onclick=()=>{S.day=0;render()};
setInterval(()=>{$("#clock").textContent=new Intl.DateTimeFormat("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",timeStyle:"medium"}).format(new Date())},1000);
setInterval(render,1000);setInterval(load,60000);load();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js");
