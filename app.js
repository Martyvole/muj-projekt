// app.js
const express = require('express');
const path = require('path');

const app = express();

// Ukládáme docházku v jednoduchém poli (do paměti)
const attendanceRecords = [];

// Umožní číst JSON z těla požadavků (kdyby bylo potřeba)
app.use(express.json());

// Pomocné funkce pro datum a čas
function getCurrentTime() {
  const d = new Date();
  // Vrátí např. "13:05:27"
  return d.toLocaleTimeString('cs-CZ', { hour12: false });
}
function getCurrentDate() {
  const d = new Date();
  // Vrátí např. "25. 3. 2024"
  return d.toLocaleDateString('cs-CZ');
}

// 1) Příchod do práce (POST /attendance/checkin)
app.post('/attendance/checkin', (req, res) => {
  const record = {
    type: 'checkin',
    time: getCurrentTime(),
    date: getCurrentDate()
  };
  attendanceRecords.push(record);
  console.log('CHECK-IN:', record);
  res.json({ success: true, record });
});

// 2) Odchod z práce (POST /attendance/checkout)
app.post('/attendance/checkout', (req, res) => {
  const record = {
    type: 'checkout',
    time: getCurrentTime(),
    date: getCurrentDate()
  };
  attendanceRecords.push(record);
  console.log('CHECK-OUT:', record);
  res.json({ success: true, record });
});

// 3) Výpis záznamů docházky (GET /attendance/log)
app.get('/attendance/log', (req, res) => {
  res.json(attendanceRecords);
});

// Statická složka - public/index.html (a další)
app.use(express.static(path.join(__dirname, 'public')));

// Spuštění serveru na portu 3000 nebo z proměnné prostředí
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
  console.log(`Např. http://localhost:${PORT} (lokálně)`);
});