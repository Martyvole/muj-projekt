// app.js
const express = require('express');
const path = require('path');
const app = express();

// abychom mohli číst JSON těla v POST
app.use(express.json());

// V této proměnné si budeme ukládat "docházku" (příchody/odchody)
const attendanceRecords = [];

// Pomocná funkce na formát času
function getCurrentTime() {
  const d = new Date();
  return d.toLocaleTimeString('cs-CZ', { hour12: false });
}

// Endpoint: příchod
app.post('/attendance/checkin', (req, res) => {
  const record = {
    type: 'checkin',
    time: getCurrentTime(),
    date: new Date().toLocaleDateString('cs-CZ')
  };
  attendanceRecords.push(record);
  console.log('CHECK-IN', record);
  res.json({ success: true, record });
});

// Endpoint: odchod
app.post('/attendance/checkout', (req, res) => {
  const record = {
    type: 'checkout',
    time: getCurrentTime(),
    date: new Date().toLocaleDateString('cs-CZ')
  };
  attendanceRecords.push(record);
  console.log('CHECK-OUT', record);
  res.json({ success: true, record });
});

// Endpoint: vypsat všechny záznamy docházky
app.get('/attendance/log', (req, res) => {
  res.json(attendanceRecords);
});

// Statická složka, kde máme HTML
app.use(express.static(path.join(__dirname, 'public')));

// Spustíme server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server běží na portu', PORT);
});