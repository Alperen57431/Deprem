const FEED_URL = 
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
const CHECK_INTERVAL = 5000; // 5 saniye
const MIN_LAT=40.5, MAX_LAT=41.3, MIN_LON=28.4, MAX_LON=29.4;
let lastId = null;

async function checkQuakes() {
  try {
    const res = await fetch(FEED_URL);
    const data = await res.json();
    const quake = data.features.find(q=>{
      const [lon,lat] = q.geometry.coordinates;
      return lat>=MIN_LAT && lat<=MAX_LAT && lon>=MIN_LON && lon<=MAX_LON;
    });
    const logEl = document.getElementById("log");
    if (!quake) {
      logEl.textContent = `${new Date().toLocaleTimeString()} – İstanbul’da yeni deprem yok.\n` 
        + logEl.textContent;
      return;
    }
    if (quake.id !== lastId) {
      lastId = quake.id;
      const mag = quake.properties.mag;
      const when = new Date(quake.properties.time).toLocaleString();
      logEl.textContent = `[Yeni Deprem] ${when}, Büyüklük: ${mag}, Yer: ${quake.properties.place}\n`
        + logEl.textContent;
      if (mag>=1.0) {
        document.getElementById("siren-sound").play();
      }
    }
  } catch(e) {
    console.error(e);
  }
}

setInterval(checkQuakes, CHECK_INTERVAL);
checkQuakes();

// PWA install handlers
let deferredPrompt;
const btnDesktop = document.getElementById("install-desktop");
const btnMobile  = document.getElementById("install-mobile");

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  btnDesktop.style.display = btnMobile.style.display = "inline-block";
});

btnDesktop.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt = null;
});

btnMobile.addEventListener("click", () => {
  alert("Lütfen tarayıcının 'Paylaş → Ana Ekrana Ekle' seçeneğiyle ekleyin.");
});
