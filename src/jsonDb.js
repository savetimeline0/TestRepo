const fs = require('fs').promises;
const path = require('path');

class JsonDb {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = null;
  }

  async _load() {
    if (this.data) return;
    try {
      const content = await fs.readFile(this.filePath, 'utf8');
      this.data = JSON.parse(content || '{}');
    } catch (e) {
      this.data = {};
      await this._write();
    }
  }

  async _write() {
    const tmp = this.filePath + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(this.data, null, 2), 'utf8');
    await fs.rename(tmp, this.filePath);
  }

  async ensureCollection(name) {
    await this._load();
    if (!this.data[name]) this.data[name] = [];
    return this.data[name];
  }

  async getAll(name) { await this.ensureCollection(name); return this.data[name]; }
  async findById(name, id) { await this.ensureCollection(name); return this.data[name].find(x => x.id === id) || null; }
  async insert(name, item) { await this.ensureCollection(name); this.data[name].push(item); await this._write(); return item; }
  async update(name, id, patch) { await this.ensureCollection(name); const idx = this.data[name].findIndex(x => x.id === id); if (idx === -1) return null; this.data[name][idx] = Object.assign(this.data[name][idx], patch); await this._write(); return this.data[name][idx]; }
  async remove(name, id) { await this.ensureCollection(name); const idx = this.data[name].findIndex(x => x.id === id); if (idx === -1) return false; this.data[name].splice(idx, 1); await this._write(); return true; }
}

module.exports = JsonDb;
