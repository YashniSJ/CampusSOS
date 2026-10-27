const KEY="campusSOS_incidents";
let incidents=JSON.parse(localStorage.getItem(KEY)||"[]");

function save(){localStorage.setItem(KEY,JSON.stringify(incidents));}
function showSection(id){
 document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.section===id));
 if(id==="home")renderHome();
 if(id==="incidents")renderMy();
 if(id==="admin")renderAdmin();
 window.scrollTo({top:0,behavior:"smooth"});
}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.style.display="block";clearTimeout(window._toast);window._toast=setTimeout(()=>t.style.display="none",3000)}
function useLocation(){
 if(!navigator.geolocation){document.getElementById("location").value="Location unavailable";return}
 navigator.geolocation.getCurrentPosition(p=>{
   document.getElementById("location").value=`GPS: ${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`;
   toast("Location captured for this demo.");
 },()=>toast("Location permission was not granted."));
}
document.getElementById("reportForm").addEventListener("submit",e=>{
 e.preventDefault();
 const item={id:"SOS-"+String(Date.now()).slice(-6),type:type.value,priority:priority.value,location:location.value,contact:contact.value,description:description.value,status:"Reported",created:new Date().toLocaleString()};
 incidents.unshift(item);save();
 e.target.reset(); priority.value="High";
 toast(`Emergency ${item.id} submitted successfully.`);
 showSection("incidents");
});
function renderHome(){
 openCount.textContent=incidents.filter(x=>x.status!=="Resolved").length;
 respondingCount.textContent=incidents.filter(x=>x.status==="Responding").length;
 resolvedCount.textContent=incidents.filter(x=>x.status==="Resolved").length;
}
function statusClass(s){return s.toLowerCase()}
function renderMy(){
 const box=document.getElementById("myReports");
 if(!incidents.length){box.innerHTML=`<div class="panel"><h2>No reports yet</h2><p class="meta">Your emergency reports will appear here after submission.</p><button class="primary" onclick="showSection('report')">Create a report</button></div>`;return}
 box.innerHTML=incidents.map(x=>`<article class="incident"><div><h3>${escapeHtml(x.type)} <span class="priority ${x.priority}">• ${x.priority}</span></h3><div class="meta"><b>${x.id}</b> · ${escapeHtml(x.created)}<br>📍 ${escapeHtml(x.location)}<br>${escapeHtml(x.description)}</div></div><div class="status ${statusClass(x.status)}">${x.status}</div></article>`).join("");
}
function renderAdmin(){
 adminTotal.textContent=incidents.length;
 adminPriority.textContent=incidents.filter(x=>x.priority==="Critical"||x.priority==="High").length;
 adminResolved.textContent=incidents.filter(x=>x.status==="Resolved").length;
 const body=document.getElementById("adminTable");
 if(!incidents.length){body.innerHTML=`<tr><td colspan="6">No incidents reported.</td></tr>`;return}
 body.innerHTML=incidents.map((x,i)=>`<tr>
 <td><b>${x.id}</b><br><small>${escapeHtml(x.created)}</small></td>
 <td>${escapeHtml(x.type)}</td><td>${escapeHtml(x.location)}</td>
 <td class="priority ${x.priority}">${x.priority}</td>
 <td><select class="mini-select" onchange="updateStatus(${i},this.value)">
   ${["Reported","Assigned","Responding","Resolved"].map(s=>`<option ${x.status===s?"selected":""}>${s}</option>`).join("")}
 </select></td>
 <td><button class="ghost" onclick="deleteIncident(${i})">Delete</button></td></tr>`).join("");
}
function updateStatus(i,status){incidents[i].status=status;save();renderAdmin();renderHome();toast(`Incident ${incidents[i].id} updated to ${status}.`)}
function deleteIncident(i){if(confirm("Delete this demo incident?")){incidents.splice(i,1);save();renderAdmin();renderHome();toast("Incident deleted.");}}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
setInterval(()=>clock.textContent=new Date().toLocaleString(),1000);
renderHome();
