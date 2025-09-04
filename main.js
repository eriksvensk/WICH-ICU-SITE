// Mobile nav
const toggleBtn = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (toggleBtn){
  toggleBtn.addEventListener('click', ()=> navMenu.classList.toggle('open'));
}

// Render participating ICUs map and list
async function loadSites(){
  try{
    const res = await fetch('data/sites.json');
    const sites = await res.json();
    const listEl = document.getElementById('sitesList');
    const countEl = document.getElementById('sitesCount');
    const mapEl = document.getElementById('map');
    if (!Array.isArray(sites)) return;

    // Count + list
    countEl.textContent = sites.length.toString();
    listEl.innerHTML = '';
    sites.forEach(site => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${site.name}</strong> — ${site.hospital || ''}${site.hospital?', ':''}${site.city || ''}${site.city?', ':''}${site.region || ''} <span class="badge">${site.status || 'Active'}</span>`;
      listEl.appendChild(li);
    });

    // Map
    if (mapEl && typeof L !== 'undefined'){
      const map = L.map('map').setView([62.0, 15.0], 4.5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
      sites.forEach(site => {
        if (typeof site.lat === 'number' && typeof site.lng === 'number'){
          const marker = L.marker([site.lat, site.lng]).addTo(map);
          const html = `<b>${site.name}</b><br>${site.hospital || ''}<br>${site.city || ''}${site.city?', ':''}${site.region || ''}`;
          marker.bindPopup(html);
        }
      });
    }
  }catch(e){
    console.error('Failed to load sites.json', e);
  }
}

// Render downloads
async function loadDownloads(){
  try{
    const res = await fetch('data/downloads.json');
    const docs = await res.json();
    const wrap = document.getElementById('downloadsWrap');
    wrap.innerHTML = '';
    docs.forEach(d => {
      const row = document.createElement('div');
      row.className = 'download';
      row.innerHTML = `
        <div class="meta">
          <a href="assets/docs/${encodeURIComponent(d.filename)}" target="_blank" rel="noopener">${d.title}</a>
          <div class="note">${d.description || ''}</div>
        </div>
      `;
      wrap.appendChild(row);
    });
  }catch(e){
    console.error('Failed to load downloads.json', e);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadSites();
  loadDownloads();
});
