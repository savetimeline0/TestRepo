const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const logFile = path.join(logDir, 'app.log');

function write(level, obj) {
  const entry = Object.assign({ level, timestamp: new Date().toISOString() }, obj);
  const line = JSON.stringify(entry);
  try { fs.appendFileSync(logFile, line + '\n'); } catch (e) { /* ignore logging errors */ }
  console.log(line);
}

module.exports = {
  info: (obj) => write('info', obj),
  error: (obj) => write('error', obj),
  warn: (obj) => write('warn', obj)
};
