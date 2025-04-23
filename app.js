const FEED_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
const CHECK_INTERVAL = 5000;
const MIN_LAT = 40.5, MAX_LAT = 41.3;
const MIN_LON = 28.4, MAX_LON = 29.4;
let lastId = null;

async function kontrolEt() {
  try {
    const res  = await fetch(FEED_URL);
    const json = await res.json();
    const quake = json.features.find(q => {
      const [lon, lat] = q.geometry.coordinates;
      return lat>=MIN_LAT && lat<=MAX_LAT &&
             lon>=MIN_LON && lon<=MAX_LON;
    });
    const div = document.getElementById("sonuc");
    if (!quake) {
      div.innerText = `${new Date().toLocaleTimeString()} – İstanbul’da ve çevresinde yeni deprem yok.`;
      return;
    }
    if (quake.id !== lastId) {
      lastId = quake.id;
      const p = quake.properties;
      const zaman = new Date(p.time).toLocaleString();
      div.innerHTML = `
        <p><strong>Yer:</strong> ${p.place}</p>
        <p><strong>Şiddet:</strong> ${p.mag}</p>
        <p><strong>Zaman:</strong> ${zaman}</p>
      `;
      if (p.mag >= 1.0) new Audio("alarm.mp3").play();
    }
  } catch(e) {
    console.error(e);
  }
}

window.addEventListener("load", () => {
  kontrolEt();
  setInterval(kontrolEt, CHECK_INTERVAL);
});
