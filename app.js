async function kontrolEt() {
    try {
        const response = await fetch("https://deprem-api.vercel.app/api?country=turkey&city=istanbul");
        const data = await response.json();

        const deprem = data.result?.[0];
        const sonucDiv = document.getElementById("sonuc");

        if (deprem) {
            const detay = `
                <p><strong>Yer:</strong> ${deprem.title}</p>
                <p><strong>Şiddet:</strong> ${deprem.mag}</p>
                <p><strong>Zaman:</strong> ${deprem.date}</p>
            `;
            sonucDiv.innerHTML = detay;

            if (parseFloat(deprem.mag) >= 3.0) {
                const alarm = new Audio("alarm.mp3");
                alarm.play();
            }
        } else {
            sonucDiv.innerText = "Veri bulunamadı.";
        }
    } catch (err) {
        console.error("Hata oluştu:", err);
    }
}

setInterval(kontrolEt, 5000);
