/* ============================================================
   SIGEA - Sistema de Gestión de Edificaciones Afectadas
   Aplicación SPA - Módulo Principal
   ============================================================ */
const App = {};

App.Config = {
  version: '1.0.0',
  dbName: 'SIGEADB',
  dbVersion: 1,
  stores: ['estructuras','inspecciones','seguimientos','fotografias','servicios','usuarios','referencias'],
  cloud: {
    get supabaseUrl() { return localStorage.getItem('sigea_supabase_url') || ''; },
    set supabaseUrl(v) { localStorage.setItem('sigea_supabase_url', v); },
    get supabaseKey() { return localStorage.getItem('sigea_supabase_key') || ''; },
    set supabaseKey(v) { localStorage.setItem('sigea_supabase_key', v); },
    get enabled() { return localStorage.getItem('sigea_cloud_enabled') === 'true'; },
    set enabled(v) { localStorage.setItem('sigea_cloud_enabled', v ? 'true' : 'false'); }
  },
  tiposEstructura: [
    { value: 'edificio', label: 'Edificio' },
    { value: 'bloque', label: 'Bloque' },
    { value: 'casa', label: 'Casa' },
    { value: 'escuela', label: 'Escuela' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'ambulatorio', label: 'Ambulatorio' },
    { value: 'cancha', label: 'Cancha' },
    { value: 'centro_comercial', label: 'Centro Comercial' },
    { value: 'infraestructura_publica', label: 'Infraestructura Pública' },
    { value: 'infraestructura_privada', label: 'Infraestructura Privada' }
  ],
  estadosEstructurales: [
    { value: 'sin_inspeccion', label: 'Sin Inspección', color: '#6B7280', badge: 'gray' },
    { value: 'sin_daños', label: 'Sin Daños', color: '#10B981', badge: 'green' },
    { value: 'daño_leve', label: 'Daño Leve', color: '#F59E0B', badge: 'yellow' },
    { value: 'daño_moderado', label: 'Daño Moderado', color: '#F97316', badge: 'orange' },
    { value: 'daño_severo', label: 'Daño Severo', color: '#EF4444', badge: 'red' },
    { value: 'riesgo_colapso', label: 'Riesgo de Colapso', color: '#DC2626', badge: 'red' },
    { value: 'colapsado', label: 'Colapsado', color: '#111827', badge: 'black' },
    { value: 'demolido', label: 'Demolido', color: '#374151', badge: 'black' }
  ],
  roles: [
    { value: 'administrador', label: 'Administrador General' },
    { value: 'proteccion_civil', label: 'Protección Civil' },
    { value: 'ingeniero', label: 'Ingeniero' },
    { value: 'inspector', label: 'Inspector' },
    { value: 'operador', label: 'Operador' }
  ],
  categoriasFoto: ['Fachada','Interior','Grietas','Columnas','Escaleras','Techo','Estructura','Drones','Evidencias'],
  servicios: [
    { id: 'electricidad', label: 'Electricidad', icon: 'zap' },
    { id: 'agua', label: 'Agua', icon: 'droplet' },
    { id: 'gas', label: 'Gas', icon: 'flame' },
    { id: 'internet', label: 'Internet', icon: 'wifi' },
    { id: 'telefonia', label: 'Telefonía', icon: 'phone' },
    { id: 'ascensores', label: 'Ascensores', icon: 'arrow-up' },
    { id: 'aguas_servidas', label: 'Aguas Servidas', icon: 'trash-2' }
  ],
  estadosServicio: [
    { value: 'operativo', label: 'Operativo', color: '#10B981' },
    { value: 'parcial', label: 'Parcialmente Operativo', color: '#F59E0B' },
    { value: 'fuera_de_servicio', label: 'Fuera de Servicio', color: '#EF4444' }
  ],
  navItems: [
    { section: 'Panel Principal' },
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', hash: '#dashboard' },
    { section: 'Gestión' },
    { id: 'estructuras', label: 'Estructuras', icon: 'Building2', hash: '#estructuras' },
    { id: 'mapa', label: 'Mapa Interactivo', icon: 'Map', hash: '#mapa' },
    { id: 'buscador', label: 'Buscador', icon: 'Search', hash: '#buscador' },
    { section: 'Seguimiento' },
    { id: 'seguimiento', label: 'Seguimiento', icon: 'Clock', hash: '#seguimiento' },
    { id: 'inspecciones', label: 'Inspecciones', icon: 'ClipboardCheck', hash: '#inspecciones' },
    { id: 'servicios', label: 'Servicios', icon: 'Settings2', hash: '#servicios' },
    { section: 'Administración' },
    { id: 'administracion', label: 'Administración', icon: 'Shield', hash: '#administracion' },
    { id: 'reportes', label: 'Reportes', icon: 'FileText', hash: '#reportes' },
    { id: 'import-export', label: 'Importar / Exportar', icon: 'Upload', hash: '#import-export' }
  ]
};

/* ============================================================
   UTILS
   ============================================================ */
App.Utils = {
  formatDate(d) {
    if (!d) return '—';
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('es-VE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  },
  formatDateISO(d) {
    if (!d) return '';
    return new Date(d).toISOString().split('T')[0];
  },
  now() { return new Date().toISOString().split('T')[0]; },
  nowTime() { return new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }); },
  generateId(prefix) {
    const n = Date.now().toString(36).toUpperCase();
    const r = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${n}${r}`;
  },
  getEstadoBadge(val) {
    const e = App.Config.estadosEstructurales.find(s => s.value === val);
    return e || App.Config.estadosEstructurales[0];
  },
  getEstadoColor(val) {
    const e = App.Utils.getEstadoBadge(val);
    return e.color;
  },
  getEstadoLabel(val) {
    const e = App.Utils.getEstadoBadge(val);
    return e.label;
  },
  getTipoLabel(val) {
    const t = App.Config.tiposEstructura.find(s => s.value === val);
    return t ? t.label : val;
  },
  getServicioLabel(val) {
    const s = App.Config.estadosServicio.find(e => e.value === val);
    return s ? s.label : val;
  },
  getRolLabel(val) {
    const r = App.Config.roles.find(e => e.value === val);
    return r ? r.label : val;
  },
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },
  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const div = document.createElement('div');
    div.className = `toast toast-${type}`;
    div.innerHTML = message;
    container.appendChild(div);
    setTimeout(() => { div.style.opacity = '0'; div.style.transform = 'translateX(100%)'; div.style.transition = 'all 0.3s'; setTimeout(() => div.remove(), 300); }, 4000);
  },
  confirmDialog(msg) {
    return new Promise((resolve) => {
      App.Components.Modal.show({
        title: 'Confirmar',
        body: `<p>${App.Utils.escapeHtml(msg)}</p>`,
        footer: `
          <button class="btn btn-secondary" data-modal-close>Cancelar</button>
          <button class="btn btn-danger" id="confirmDeleteBtn">Eliminar</button>
        `
      });
      document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => {
        App.Components.Modal.close();
        resolve(true);
      });
    });
  },
  exportToCSV(data, filename) {
    if (!data.length) { App.Utils.toast('No hay datos para exportar', 'warning'); return; }
    const headers = Object.keys(data[0]);
    const csv = [headers.join(',')];
    data.forEach(row => {
      csv.push(headers.map(h => {
        let v = row[h] != null ? String(row[h]) : '';
        if (v.includes(',') || v.includes('"') || v.includes('\n')) v = '"' + v.replace(/"/g, '""') + '"';
        return v;
      }).join(','));
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    App.Utils.downloadBlob(blob, filename + '.csv');
    App.Utils.toast('CSV exportado exitosamente', 'success');
  },
  exportToJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    App.Utils.downloadBlob(blob, filename + '.json');
    App.Utils.toast('JSON exportado exitosamente', 'success');
  },
  exportToPDF(elementId, filename) {
    const el = document.getElementById(elementId);
    if (!el) { App.Utils.toast('No se encontró el contenido', 'error'); return; }
    if (typeof html2pdf === 'undefined') { App.Utils.toast('html2pdf no cargado', 'warning'); return; }
    const opt = { margin: 0.5, filename: filename + '.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
    html2pdf().set(opt).from(el).save();
    App.Utils.toast('PDF generado', 'success');
  },
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  parseCSV(text) {
    const lines = text.split('\n').filter(l => l.trim());
    if (!lines.length) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
      if (vals.length === headers.length) {
        const obj = {};
        headers.forEach((h, idx) => obj[h] = vals[idx]);
        result.push(obj);
      }
    }
    return result;
  },
  slugify(text) {
    return text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
  }
};

/* ============================================================
   DATABASE LAYER (IndexedDB)
   ============================================================ */
App.DB = {
  db: null,
  ready: false,

  async init() {
    try {
      this.db = await this._openDB();
      this.ready = true;
      const seeded = localStorage.getItem('sigea_seeded');
      if (!seeded) {
        await this._loadSeedData();
        localStorage.setItem('sigea_seeded', 'true');
      }
      return true;
    } catch (e) {
      console.error('DB init error:', e);
      return false;
    }
  },

  _openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(App.Config.dbName, App.Config.dbVersion);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        App.Config.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
  },

  async _loadSeedData() {
    try {
      let seedData;
      try {
        const resp = await fetch('database.json');
        if (resp.ok) seedData = await resp.json();
      } catch (e) { /* ignore */ }
      if (!seedData) seedData = this._defaultSeed();
      const stores = ['urbanizaciones','sectores','municipios','parroquias','usuarios','estructuras','inspecciones','seguimientos','fotografias','servicios'];
      for (const key of stores) {
        if (seedData[key] && seedData[key].length) {
          const tx = this.db.transaction('referencias', 'readwrite');
          const store = tx.objectStore('referencias');
          const existing = await new Promise(r => { const q = store.get(key); q.onsuccess = () => r(q.result); });
          if (!existing) store.put({ id: key, data: seedData[key] });
          await new Promise(r => { tx.oncomplete = r; });
        }
      }
      if (seedData.estructuras) {
        for (const e of seedData.estructuras) {
          await this.create('estructuras', e);
        }
      }
      if (seedData.inspecciones) {
        for (const ins of seedData.inspecciones) {
          await this.create('inspecciones', ins);
        }
      }
      if (seedData.seguimientos) {
        for (const seg of seedData.seguimientos) {
          await this.create('seguimientos', seg);
        }
      }
      if (seedData.servicios) {
        for (const srv of seedData.servicios) {
          await this.create('servicios', srv);
        }
      }
    } catch (e) { console.error('Seed load error:', e); }
  },

  _defaultSeed() {
    return {
      usuarios: [{ id: 'usr-001', nombre: 'Carlos Mendoza', email: 'admin@sigea.gob.ve', rol: 'administrador', organismo: 'Alcaldía municipio Plaza', telefono: '0412-1234567', activo: true }],
      urbanizaciones: [{ id: 'urb-001', nombre: 'La California', sector: 'Norte', municipio: 'Guarenas' },{ id: 'urb-002', nombre: 'Los Dos Caminos', sector: 'Centro', municipio: 'Guarenas' }],
      sectores: ['Norte','Centro','Sur'],
      municipios: [{ id: 'mun-001', nombre: 'Guarenas', estado: 'Miranda' }],
      parroquias: [{ id: 'par-001', nombre: 'Parroquia Central', municipio: 'Guarenas' }],
      estructuras: [], inspecciones: [], seguimientos: [], fotografias: [], servicios: []
    };
  },

  async getAll(store) {
    if (!this.ready) return [];
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readonly');
      const s = tx.objectStore(store);
      const req = s.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async getById(store, id) {
    if (!this.ready || !id) return null;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readonly');
      const s = tx.objectStore(store);
      const req = s.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },

  async create(store, data) {
    if (!this.ready) return null;
    const r = await new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const s = tx.objectStore(store);
      const req = s.add(data);
      req.onsuccess = () => resolve(data);
      req.onerror = (e) => { if (e.target.error.name === 'ConstraintError') { s.put(data); req.onsuccess = () => resolve(data); } else reject(e.target.error); };
    });
    if (this.isCloudEnabled && r) await this.cloudUpsert(store, r);
    return r;
  },

  async update(store, data) {
    if (!this.ready) return null;
    const r = await new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const s = tx.objectStore(store);
      const req = s.put(data);
      req.onsuccess = () => resolve(data);
      req.onerror = () => reject(req.error);
    });
    if (this.isCloudEnabled && r) await this.cloudUpsert(store, r);
    return r;
  },

  async delete(store, id) {
    if (!this.ready) return;
    await new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const s = tx.objectStore(store);
      const req = s.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    if (this.isCloudEnabled) await this.cloudDelete(store, id);
  },

  async query(store, predicate) {
    const all = await this.getAll(store);
    return all.filter(predicate);
  },

  async getRef(key) {
    if (!this.ready) return [];
    const tx = this.db.transaction('referencias', 'readonly');
    const s = tx.objectStore('referencias');
    return new Promise(r => { const q = s.get(key); q.onsuccess = () => r(q.result ? q.result.data : []); q.onerror = () => r([]); });
  },

  async saveRef(key, data) {
    if (!this.ready) return;
    const tx = this.db.transaction('referencias', 'readwrite');
    const s = tx.objectStore('referencias');
    s.put({ id: key, data });
    return new Promise(r => { tx.oncomplete = r; });
  },

  async getAllFromRef(key) {
    const data = await this.getRef(key);
    return Array.isArray(data) ? data : [];
  },

  async getEstructurasFull() {
    const ests = await this.getAll('estructuras');
    const insps = await this.getAll('inspecciones');
    const segs = await this.getAll('seguimientos');
    const srv = await this.getAll('servicios');
    return ests.map(e => ({
      ...e,
      inspecciones: insps.filter(i => i.estructura_id === e.id),
      seguimientos: segs.filter(s => s.estructura_id === e.id),
      servicios: srv.find(s => s.estructura_id === e.id)
    }));
  },

  async getStats() {
    const ests = await this.getAll('estructuras');
    const insps = await this.getAll('inspecciones');
    const seguimientos = await this.getAll('seguimientos');
    const urb = await this.getAllFromRef('urbanizaciones');
    const familiasAfectadas = ests.reduce((s, e) => s + (e.cantidad_familias || 0), 0);
    const personasAfectadas = ests.reduce((s, e) => s + (e.habitantes_estimados || 0), 0);
    const porEstado = {};
    App.Config.estadosEstructurales.forEach(es => porEstado[es.value] = 0);
    ests.forEach(e => { if (porEstado[e.estado_estructural] != null) porEstado[e.estado_estructural]++; });
    const inspeccionadas = ests.filter(e => e.estado_estructural !== 'sin_inspeccion').length;
    const pendientes = ests.filter(e => e.estado_estructural === 'sin_inspeccion').length;
    const dañoLeve = ests.filter(e => e.estado_estructural === 'daño_leve' || e.estado_estructural === 'daño_moderado').length;
    const dañoSevero = ests.filter(e => e.estado_estructural === 'daño_severo' || e.estado_estructural === 'riesgo_colapso').length;
    const colapsadas = ests.filter(e => e.estado_estructural === 'colapsado' || e.estado_estructural === 'demolido').length;
    return {
      total: ests.length,
      totalBloques: ests.filter(e => e.tipo === 'bloque').length,
      inspeccionadas, pendientes,
      dañoLeve, dañoSevero, colapsadas,
      familiasAfectadas, personasAfectadas,
      urbanizaciones: urb.length,
      porEstado, estructuras: ests,
      inspecciones: insps, seguimientos
    };
  },

  /* Cloud Sync */
  _supabase: null,

  get supabase() {
    if (this._supabase) return this._supabase;
    const url = App.Config.cloud.supabaseUrl;
    const key = App.Config.cloud.supabaseKey;
    if (url && key && typeof supabase !== 'undefined') {
      this._supabase = supabase.createClient(url, key);
    }
    return this._supabase;
  },

  get isCloudEnabled() {
    return App.Config.cloud.enabled && !!this.supabase;
  },

  async testConnection() {
    if (!this.supabase) return false;
    try {
      const { error } = await this.supabase.from('estructuras').select('count', { count: 'exact', head: true });
      return !error;
    } catch { return false; }
  },

  async migrateToCloud() {
    if (!this.isCloudEnabled) return false;
    let total = 0;
    for (const store of App.Config.stores) {
      const data = await this.getAll(store);
      if (data.length) {
        const { error } = await this.supabase.from(store).upsert(data, { onConflict: 'id' });
        if (!error) total += data.length;
      }
    }
    const refs = await this.getAll('referencias');
    for (const r of refs) {
      const { error } = await this.supabase.from('referencias').upsert(r, { onConflict: 'id' });
      if (!error) total++;
    }
    return total;
  },

  async cloudGetAll(store) {
    if (!this.isCloudEnabled) return [];
    const { data, error } = await this.supabase.from(store).select('*').order('id');
    return error ? [] : (data || []);
  },

  async cloudUpsert(store, item) {
    if (!this.isCloudEnabled) return null;
    const { data, error } = await this.supabase.from(store).upsert(item, { onConflict: 'id' });
    return error ? null : (data?.[0] || item);
  },

  async cloudDelete(store, id) {
    if (!this.isCloudEnabled) return;
    await this.supabase.from(store).delete().eq('id', id);
  }
};

/* ============================================================
   ROUTER
   ============================================================ */
App.Router = {
  routes: {},
  currentView: null,

  register(path, handler) {
    this.routes[path] = handler;
  },

  navigate(hash) {
    if (!hash || hash === '#') hash = '#dashboard';
    window.location.hash = hash;
  },

  async handleRoute() {
    const hash = window.location.hash || '#dashboard';
    const [path, ...params] = hash.substring(1).split('/');
    const pageContainer = document.getElementById('page-content');
    if (!pageContainer) return;
    pageContainer.innerHTML = '<div class="loading-spinner"></div>';

    const handler = this.routes[path];
    if (handler) {
      this.currentView = path;
      await handler(params.length ? params : {});
    } else {
      this.navigate('#dashboard');
    }
    this.updateSidebar(path);
    this.updateHeader(path);
  },

  updateSidebar(path) {
    document.querySelectorAll('#sidebar-nav .nav-item').forEach(el => {
      const h = el.dataset.hash || '';
      el.classList.toggle('active', h === '#' + path || h.startsWith('#' + path + '/'));
    });
  },

  updateHeader(path) {
    const titleMap = {
      'dashboard': 'Dashboard',
      'estructuras': 'Estructuras',
      'mapa': 'Mapa Interactivo',
      'buscador': 'Buscador Avanzado',
      'seguimiento': 'Seguimiento y Control',
      'inspecciones': 'Inspecciones Técnicas',
      'servicios': 'Servicios Afectados',
      'administracion': 'Administración',
      'reportes': 'Reportes',
      'import-export': 'Importar / Exportar'
    };
    document.getElementById('headerTitle').textContent = titleMap[path] || 'SIGEA';
  },

  async start() {
    this.register('dashboard', () => App.Views.Dashboard.render());
    this.register('estructuras', () => App.Views.Estructuras.renderList());
    this.register('estructura', (params) => App.Views.Estructuras.renderDetail(params));
    this.register('mapa', () => App.Views.Mapa.render());
    this.register('buscador', () => App.Views.Buscador.render());
    this.register('seguimiento', (params) => App.Views.Seguimiento.render(params));
    this.register('inspecciones', (params) => App.Views.Inspecciones.render(params));
    this.register('servicios', (params) => App.Views.Servicios.render(params));
    this.register('administracion', () => App.Views.Admin.render());
    this.register('reportes', () => App.Views.Reportes.render());
    this.register('import-export', () => App.Views.ImportExport.render());

    window.addEventListener('hashchange', () => this.handleRoute());
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '#dashboard';
    }
    await this.handleRoute();
  }
};

/* ============================================================
   COMPONENTS
   ============================================================ */
App.Components = {};

App.Components.Modal = {
  show({ title, body, footer = '' }) {
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close" data-modal-close>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">${body}</div>
          ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
        </div>
      </div>`;
    container.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', () => this.close()));
    container.querySelector('#modalOverlay')?.addEventListener('click', (e) => { if (e.target === e.currentTarget) this.close(); });
    document.body.style.overflow = 'hidden';
  },
  close() {
    const container = document.getElementById('modal-container');
    container.innerHTML = '';
    document.body.style.overflow = '';
  }
};

App.Components.renderSidebar = () => {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = App.Config.navItems.map(item => {
    if (item.section) return `<div class="nav-section">${item.section}</div>`;
    return `<a class="nav-item" data-hash="${item.hash}" href="${item.hash}">
      <i data-lucide="${item.icon}" style="width:18px;height:18px"></i>
      <span>${item.label}</span>
    </a>`;
  }).join('');
  if (window.lucide) lucide.createIcons();
};

App.Components.renderStatsCard = ({ label, value, icon, color, bg }) => {
  const bgColor = bg || (color ? color + '15' : '#F1F5F9');
  const iconColor = color || '#64748B';
  return `
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">${label}</span>
        <div class="stat-icon" style="background:${bgColor};color:${iconColor}">
          <i data-lucide="${icon}" style="width:20px;height:20px"></i>
        </div>
      </div>
      <div class="stat-value">${value != null ? value.toLocaleString() : '0'}</div>
    </div>`;
};

App.Components.renderBadge = (estado) => {
  const e = App.Utils.getEstadoBadge(estado);
  return `<span class="badge badge-${e.badge}" style="background:${e.color}20;color:${e.color}">${e.label}</span>`;
};

App.Components.renderTable = ({ headers, rows, emptyMsg = 'No se encontraron registros' }) => {
  if (!rows.length) {
    return `<div class="table-container"><div class="table-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg><p>${emptyMsg}</p></div></div>`;
  }
  const thead = headers.map(h => `<th>${h.label}</th>`).join('');
  return `<div class="table-container"><table><thead><tr>${thead}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
};

/* ============================================================
   VIEWS
   ============================================================ */
App.Views = {};

/* ============================================================
   VIEW: DASHBOARD
   ============================================================ */
App.Views.Dashboard = {
  charts: {},

  async render() {
    const container = document.getElementById('page-content');
    const stats = await App.DB.getStats();
    const totalDaños = stats.porEstado;

    container.innerHTML = `
      <div class="page-header">
        <h1>Dashboard</h1>
        <p>Panel central del Sistema de Gestión de Edificaciones Afectadas</p>
      </div>
      <div class="stats-grid" id="statsGrid"></div>
      <div class="charts-grid">
        <div class="chart-card"><div class="chart-title">Daños por Urbanización</div><canvas id="chartUrbanizacion"></canvas></div>
        <div class="chart-card"><div class="chart-title">Daños por Sector</div><canvas id="chartSector"></canvas></div>
        <div class="chart-card"><div class="chart-title">Distribución de Daños</div><canvas id="chartDanios"></canvas></div>
        <div class="chart-card"><div class="chart-title">Estado de Servicios</div><canvas id="chartServicios"></canvas></div>
      </div>
      <div class="charts-grid">
        <div class="chart-card" style="grid-column:1/-1">
          <div class="chart-title">Últimas Inspecciones Registradas</div>
          <div id="latestInspecciones"></div>
        </div>
      </div>`;

    const statsGrid = document.getElementById('statsGrid');
    const statDefs = [
      { label: 'Edificaciones', value: stats.total, icon: 'Building2', color: '#3B82F6' },
      { label: 'Bloques', value: stats.totalBloques, icon: 'Layers', color: '#8B5CF6' },
      { label: 'Inspeccionadas', value: stats.inspeccionadas, icon: 'ClipboardCheck', color: '#10B981' },
      { label: 'Pendientes', value: stats.pendientes, icon: 'Clock', color: '#F59E0B' },
      { label: 'Daño Leve/Moderado', value: stats.dañoLeve, icon: 'AlertTriangle', color: '#F97316' },
      { label: 'Daño Severo/Colapso', value: stats.dañoSevero + stats.colapsadas, icon: 'AlertOctagon', color: '#EF4444' },
      { label: 'Colapsadas', value: stats.colapsadas, icon: 'TriangleAlert', color: '#111827' },
      { label: 'Familias Afectadas', value: stats.familiasAfectadas, icon: 'Users', color: '#EC4899' },
      { label: 'Personas Afectadas', value: stats.personasAfectadas, icon: 'UserPlus', color: '#06B6D4' },
      { label: 'Urbanizaciones', value: stats.urbanizaciones, icon: 'MapPin', color: '#14B8A6' }
    ];
    statsGrid.innerHTML = statDefs.map(s => App.Components.renderStatsCard(s)).join('');
    if (window.lucide) lucide.createIcons();

    this.renderChartUrbanizacion(stats.estructuras);
    this.renderChartSector(stats.estructuras);
    this.renderChartDanios(totalDaños);
    this.renderChartServicios();

    const latest = stats.inspecciones.slice().sort((a,b) => b.fecha.localeCompare(a.fecha)).slice(0, 5);
    document.getElementById('latestInspecciones').innerHTML = latest.length
      ? App.Components.renderTable({
          headers: [{ label: 'Estructura' }, { label: 'Inspector' }, { label: 'Fecha' }, { label: 'Resultado' }],
          rows: await Promise.all(latest.map(async ins => {
            const est = await App.DB.getById('estructuras', ins.estructura_id);
            return `<tr><td>${App.Utils.escapeHtml(est?.nombre || '')}</td><td>${App.Utils.escapeHtml(ins.inspector)}</td><td>${App.Utils.formatDate(ins.fecha)}</td><td>${App.Components.renderBadge(ins.resultado)}</td></tr>`;
          }))
        })
      : '<div class="table-empty"><p>Sin inspecciones registradas</p></div>';
  },

  renderChartUrbanizacion(estructuras) {
    const canvas = document.getElementById('chartUrbanizacion');
    if (!canvas) return;
    const grupos = {};
    estructuras.forEach(e => { const key = e.urbanizacion || 'Sin urbanización'; if (!grupos[key]) grupos[key] = 0; grupos[key]++; });
    const labels = Object.keys(grupos);
    const data = Object.values(grupos);
    new Chart(canvas, { type: 'bar', data: { labels, datasets: [{ label: 'Estructuras', data, backgroundColor: ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899'] }] }, options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } } });
  },

  renderChartSector(estructuras) {
    const canvas = document.getElementById('chartSector');
    if (!canvas) return;
    const grupos = {};
    estructuras.forEach(e => { const key = e.sector || 'Sin sector'; if (!grupos[key]) grupos[key] = 0; grupos[key]++; });
    const labels = Object.keys(grupos);
    const data = Object.values(grupos);
    const colors = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6'];
    new Chart(canvas, { type: 'doughnut', data: { labels, datasets: [{ data, backgroundColor: colors.slice(0, labels.length) }] }, options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } } });
  },

  renderChartDanios(porEstado) {
    const canvas = document.getElementById('chartDanios');
    if (!canvas) return;
    const labels = App.Config.estadosEstructurales.map(e => e.label);
    const data = App.Config.estadosEstructurales.map(e => porEstado[e.value] || 0);
    const colors = App.Config.estadosEstructurales.map(e => e.color);
    new Chart(canvas, { type: 'bar', data: { labels, datasets: [{ label: 'Estructuras', data, backgroundColor: colors }] }, options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } } });
  },

  renderChartServicios() {
    const canvas = document.getElementById('chartServicios');
    if (!canvas) return;
    App.DB.getAll('servicios').then(servicios => {
      if (!servicios.length) { new Chart(canvas, { type: 'bar', data: { labels: ['Sin datos'], datasets: [{ data: [1], backgroundColor: ['#E2E8F0'] }] }, options: { responsive: true, plugins: { legend: { display: false } } } }); return; }
      const counts = { operativo: 0, parcial: 0, fuera_de_servicio: 0 };
      App.Config.servicios.forEach(srv => {
        servicios.forEach(s => {
          if (s[srv.id] === 'operativo') counts.operativo++;
          else if (s[srv.id] === 'parcial') counts.parcial++;
          else if (s[srv.id] === 'fuera_de_servicio') counts.fuera_de_servicio++;
        });
      });
      new Chart(canvas, { type: 'bar', data: { labels: ['Operativo', 'Parcial', 'Fuera de Servicio'], datasets: [{ data: [counts.operativo, counts.parcial, counts.fuera_de_servicio], backgroundColor: ['#10B981','#F59E0B','#EF4444'] }] }, options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } } } });
    });
  }
};

/* ============================================================
   VIEW: ESTRUCTURAS (List, Form, Detail)
   ============================================================ */
App.Views.Estructuras = {
  async renderList() {
    const container = document.getElementById('page-content');
    const estructuras = await App.DB.getAll('estructuras');
    container.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
        <div>
          <h1>Estructuras Registradas</h1>
          <p>Total: ${estructuras.length} estructuras en el inventario</p>
        </div>
        <div>
          <button class="btn btn-primary" id="btnNuevaEstructura"><i data-lucide="plus" style="width:16px;height:16px"></i> Nueva Estructura</button>
        </div>
      </div>
      <div class="filters-bar" id="estFilters">
        <div class="filter-group">
          <label>Tipo</label>
          <select class="form-select" id="filterTipo"><option value="">Todos</option>${App.Config.tiposEstructura.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}</select>
        </div>
        <div class="filter-group">
          <label>Estado</label>
          <select class="form-select" id="filterEstado"><option value="">Todos</option>${App.Config.estadosEstructurales.map(e => `<option value="${e.value}">${e.label}</option>`).join('')}</select>
        </div>
        <div class="filter-group">
          <label>Urbanización</label>
          <select class="form-select" id="filterUrb"><option value="">Todas</option></select>
        </div>
        <div style="display:flex;gap:0.5rem;align-items:end">
          <button class="btn btn-secondary" id="btnClearFilters">Limpiar</button>
        </div>
      </div>
      <div id="estTableContainer"></div>`;

    document.getElementById('btnNuevaEstructura')?.addEventListener('click', () => this.renderForm());
    const urbs = await App.DB.getAllFromRef('urbanizaciones');
    const urbSelect = document.getElementById('filterUrb');
    if (urbSelect) urbs.forEach(u => { const o = document.createElement('option'); o.value = u.nombre; o.textContent = u.nombre; urbSelect.appendChild(o); });

    this.renderTableData(estructuras);
    document.getElementById('filterTipo')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('filterEstado')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('filterUrb')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('btnClearFilters')?.addEventListener('click', () => {
      document.getElementById('filterTipo').value = '';
      document.getElementById('filterEstado').value = '';
      document.getElementById('filterUrb').value = '';
      this.applyFilters();
    });
    if (window.lucide) lucide.createIcons();
  },

  async renderTableData(estructuras) {
    const tipo = document.getElementById('filterTipo')?.value || '';
    const estado = document.getElementById('filterEstado')?.value || '';
    const urb = document.getElementById('filterUrb')?.value || '';
    let filtered = estructuras;
    if (tipo) filtered = filtered.filter(e => e.tipo === tipo);
    if (estado) filtered = filtered.filter(e => e.estado_estructural === estado);
    if (urb) filtered = filtered.filter(e => e.urbanizacion === urb);

    const container = document.getElementById('estTableContainer');
    const rows = filtered.map(e => `
      <tr style="cursor:pointer" data-id="${e.id}">
        <td><strong>${e.id}</strong></td>
        <td>${App.Utils.escapeHtml(e.nombre)}</td>
        <td>${App.Utils.getTipoLabel(e.tipo)}</td>
        <td>${App.Utils.escapeHtml(e.urbanizacion || '')}</td>
        <td>${App.Components.renderBadge(e.estado_estructural)}</td>
        <td>${e.cantidad_familias || 0}</td>
        <td>${App.Utils.formatDate(e.ultima_inspeccion)}</td>
        <td>
          <button class="btn btn-sm btn-ghost" data-action="view" data-id="${e.id}"><i data-lucide="eye" style="width:14px;height:14px"></i></button>
          <button class="btn btn-sm btn-ghost" data-action="edit" data-id="${e.id}"><i data-lucide="edit" style="width:14px;height:14px"></i></button>
          <button class="btn btn-sm btn-ghost" style="color:#EF4444" data-action="delete" data-id="${e.id}"><i data-lucide="trash-2" style="width:14px;height:14px"></i></button>
        </td>
      </tr>`).join('');

    container.innerHTML = App.Components.renderTable({
      headers: [
        { label: 'ID' }, { label: 'Nombre' }, { label: 'Tipo' }, { label: 'Urbanización' },
        { label: 'Estado' }, { label: 'Familias' }, { label: 'Últ. Inspección' }, { label: 'Acciones' }
      ],
      rows: [rows],
      emptyMsg: 'No se encontraron estructuras con los filtros seleccionados'
    });
    if (window.lucide) lucide.createIcons();

    container.querySelectorAll('[data-action="view"]').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); App.Router.navigate(`#estructura/${btn.dataset.id}`); });
    });
    container.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); this.renderForm(btn.dataset.id); });
    });
    container.querySelectorAll('[data-action="delete"]').forEach(async (btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const ok = await App.Utils.confirmDialog('¿Eliminar esta estructura y todos sus datos asociados?');
        if (ok) {
          await App.DB.delete('estructuras', btn.dataset.id);
          const rels = ['inspecciones','seguimientos','servicios'];
          for (const r of rels) {
            const items = await App.DB.query(r, i => i.estructura_id === btn.dataset.id);
            for (const item of items) await App.DB.delete(r, item.id);
          }
          App.Utils.toast('Estructura eliminada', 'success');
          this.renderList();
        }
      });
    });
    container.querySelectorAll('tr[data-id]').forEach(tr => {
      tr.addEventListener('click', () => App.Router.navigate(`#estructura/${tr.dataset.id}`));
    });
  },

  applyFilters() {
    App.DB.getAll('estructuras').then(ests => this.renderTableData(ests));
  },

  async renderForm(editId = null) {
    const container = document.getElementById('page-content');
    const editData = editId ? await App.DB.getById('estructuras', editId) : null;
    const urbs = await App.DB.getAllFromRef('urbanizaciones');
    const sectores = await App.DB.getAllFromRef('sectores');

    const isEdit = !!editData;
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem">
        <div class="page-header" style="margin-bottom:0">
          <h1>${isEdit ? 'Editar' : 'Nueva'} Estructura</h1>
          <p>${isEdit ? `Editando: ${editData.nombre}` : 'Complete los campos para registrar'}</p>
        </div>
      </div>
      <div style="background:#fff;border-radius:10px;border:1px solid var(--gray-200);padding:1.25rem;max-width:820px">
        <form id="estForm">
          ${isEdit ? `<input type="hidden" name="id" value="${editData.id}">` : ''}
          <div style="display:grid;gap:.85rem">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre *</label>
                <input class="form-input" name="nombre" required value="${App.Utils.escapeHtml(editData?.nombre || '')}" placeholder="Edif. Los Jardines">
              </div>
              <div class="form-group">
                <label>Tipo *</label>
                <select class="form-select" name="tipo" required>
                  <option value="">Seleccionar...</option>
                  ${App.Config.tiposEstructura.map(t => `<option value="${t.value}" ${editData?.tipo === t.value ? 'selected' : ''}>${t.label}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Urbanización</label>
                <input class="form-input" name="urbanizacion" list="urbList" value="${App.Utils.escapeHtml(editData?.urbanizacion || '')}" placeholder="La California">
                <datalist id="urbList">${urbs.map(u => `<option value="${u.nombre}">`).join('')}</datalist>
              </div>
              <div class="form-group">
                <label>Sector</label>
                <input class="form-input" name="sector" list="secList" value="${App.Utils.escapeHtml(editData?.sector || '')}" placeholder="Norte">
                <datalist id="secList">${sectores.map(s => `<option value="${s}">`).join('')}</datalist>
              </div>
              <div class="form-group">
                <label>Estado</label>
                <input class="form-input" name="estado" value="${App.Utils.escapeHtml(editData?.estado || 'Miranda')}" readonly style="color:var(--gray-400);background:var(--gray-50)">
              </div>
              <div class="form-group">
                <label>Municipio</label>
                <input class="form-input" name="municipio" value="${App.Utils.escapeHtml(editData?.municipio || 'Guarenas')}" readonly style="color:var(--gray-400);background:var(--gray-50)">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group" style="grid-column:1/-1">
                <label>Dirección</label>
                <input class="form-input" name="direccion" value="${App.Utils.escapeHtml(editData?.direccion || '')}" placeholder="Av. Principal, Calle 5, La California">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Latitud</label><input class="form-input" name="latitud" type="number" step="any" value="${editData?.latitud || ''}" placeholder="10.4723"></div>
              <div class="form-group"><label>Longitud</label><input class="form-input" name="longitud" type="number" step="any" value="${editData?.longitud || ''}" placeholder="-66.6199"></div>
              <div class="form-group"><label>Año const.</label><input class="form-input" name="anio_construccion" type="number" value="${editData?.anio_construccion || ''}" placeholder="1995"></div>
              <div class="form-group"><label>Pisos</label><input class="form-input" name="cantidad_pisos" type="number" value="${editData?.cantidad_pisos || ''}" placeholder="0"></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Apartamentos</label><input class="form-input" name="cantidad_apartamentos" type="number" value="${editData?.cantidad_apartamentos || ''}" placeholder="0"></div>
              <div class="form-group"><label>Locales</label><input class="form-input" name="cantidad_locales" type="number" value="${editData?.cantidad_locales || ''}" placeholder="0"></div>
              <div class="form-group"><label>Familias</label><input class="form-input" name="cantidad_familias" type="number" value="${editData?.cantidad_familias || ''}" placeholder="0"></div>
              <div class="form-group"><label>Habitantes</label><input class="form-input" name="habitantes_estimados" type="number" value="${editData?.habitantes_estimados || ''}" placeholder="0"></div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Estado estructural</label>
                <select class="form-select" name="estado_estructural" style="font-weight:600">
                  ${App.Config.estadosEstructurales.map(e => `<option value="${e.value}" ${editData?.estado_estructural === e.value ? 'selected' : ''} style="color:${e.color}">${e.label}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>
          <div style="margin-top:1.25rem;display:flex;gap:.5rem;border-top:1px solid var(--gray-200);padding-top:1rem">
            <button type="submit" class="btn btn-primary">${isEdit ? 'Actualizar' : 'Registrar'} estructura</button>
            <button type="button" class="btn btn-secondary" onclick="App.Router.navigate('#estructuras')">Cancelar</button>
          </div>
        </form>
      </div>`;

    document.getElementById('estForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {};
      fd.forEach((v, k) => { data[k] = v; });
      data.latitud = parseFloat(data.latitud) || 0;
      data.longitud = parseFloat(data.longitud) || 0;
      data.anio_construccion = parseInt(data.anio_construccion) || 0;
      data.cantidad_pisos = parseInt(data.cantidad_pisos) || 0;
      data.cantidad_apartamentos = parseInt(data.cantidad_apartamentos) || 0;
      data.cantidad_locales = parseInt(data.cantidad_locales) || 0;
      data.cantidad_familias = parseInt(data.cantidad_familias) || 0;
      data.habitantes_estimados = parseInt(data.habitantes_estimados) || 0;
      data.foto_principal = editData?.foto_principal || '';
      data.riesgo_colapso = data.estado_estructural === 'riesgo_colapso' || data.estado_estructural === 'colapsado';
      data.atencion_prioritaria = data.riesgo_colapso || data.estado_estructural === 'daño_severo';

      if (isEdit) {
        data.id = editData.id;
        data.fecha_registro = editData.fecha_registro;
        data.ultima_inspeccion = editData.ultima_inspeccion;
        await App.DB.update('estructuras', data);
        App.Utils.toast('Estructura actualizada', 'success');
      } else {
        data.id = App.Utils.generateId('EST');
        data.fecha_registro = App.Utils.now();
        data.ultima_inspeccion = '';
        await App.DB.create('estructuras', data);
        App.Utils.toast('Estructura registrada', 'success');
      }
      App.Router.navigate('#estructuras');
    });
  },

  async renderDetail(params) {
    const id = Array.isArray(params) ? params[0] : params;
    if (!id) { App.Router.navigate('#estructuras'); return; }
    const est = await App.DB.getById('estructuras', id);
    if (!est) { App.Utils.toast('Estructura no encontrada', 'error'); App.Router.navigate('#estructuras'); return; }
    const insps = await App.DB.query('inspecciones', i => i.estructura_id === id);
    const fotos = await App.DB.query('fotografias', f => f.estructura_id === id);

    const container = document.getElementById('page-content');
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:.5rem;margin-bottom:.75rem">
        <div class="page-header" style="margin-bottom:0">
          <h1>${App.Utils.escapeHtml(est.nombre)}</h1>
          <p>${est.id} &bull; ${App.Utils.getTipoLabel(est.tipo)} &bull; ${App.Utils.escapeHtml(est.urbanizacion || '')}</p>
        </div>
        <div style="display:flex;gap:.35rem">
          <button class="btn btn-secondary btn-sm" id="btnEditEst"><i data-lucide="edit" style="width:13px;height:13px"></i></button>
          <button class="btn btn-secondary btn-sm" onclick="App.Router.navigate('#estructuras')"><i data-lucide="arrow-left" style="width:13px;height:13px"></i> Volver</button>
        </div>
      </div>
      <div style="background:#fff;border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
        <div style="display:flex;flex-wrap:wrap">
          <div style="width:200px;height:160px;background:var(--gray-100);flex-shrink:0;overflow:hidden">
            ${est.foto_principal ? `<img src="${est.foto_principal}" alt="" style="width:100%;height:100%;object-fit:cover">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--gray-400);font-size:.7rem;flex-direction:column;gap:4px"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Sin foto</div>`}
          </div>
          <div style="flex:1;padding:.85rem 1rem;min-width:260px">
            <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;margin-bottom:.6rem">${App.Components.renderBadge(est.estado_estructural)} ${est.riesgo_colapso ? '<span class="badge badge-red" style="background:#FEE2E2;color:#DC2626">Riesgo colapso</span>' : ''} ${est.atencion_prioritaria ? '<span class="badge badge-orange" style="background:#FED7AA;color:#9A3412">Prioritaria</span>' : ''} ${insps.length ? '<span class="badge badge-green" style="background:#DCFCE7;color:#166534">✓ Visitado por inspectoría</span>' : '<span class="badge badge-gray" style="background:#F1F5F9;color:#64748B">○ Pendiente por inspectoría</span>'}</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:4px 12px;font-size:.78rem">
              <div><span style="color:var(--gray-400)">Dirección</span><br>${App.Utils.escapeHtml(est.direccion || '—')}</div>
              <div><span style="color:var(--gray-400)">Sector</span><br>${App.Utils.escapeHtml(est.sector || '—')}</div>
              <div><span style="color:var(--gray-400)">Coordenadas</span><br>${est.latitud}, ${est.longitud}</div>
              <div><span style="color:var(--gray-400)">Construcción</span><br>${est.anio_construccion || '—'} &bull; ${est.cantidad_pisos || 0} pisos</div>
              <div><span style="color:var(--gray-400)">Aptos / Locales</span><br>${est.cantidad_apartamentos || 0} / ${est.cantidad_locales || 0}</div>
              <div><span style="color:var(--gray-400)">Familias / Hab.</span><br>${est.cantidad_familias || 0} / ${est.habitantes_estimados || 0}</div>
              <div><span style="color:var(--gray-400)">Registro</span><br>${App.Utils.formatDate(est.fecha_registro)}</div>
              <div><span style="color:var(--gray-400)">Últ. inspección</span><br>${App.Utils.formatDate(est.ultima_inspeccion)}</div>
            </div>
          </div>
        </div>
      </div>
      ${fotos.length ? `<div style="margin-top:.5rem;background:#fff;border:1px solid var(--gray-200);border-radius:10px;padding:.6rem .75rem">
        <div style="font-size:.72rem;font-weight:600;color:var(--gray-400);margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em">Evidencias fotográficas (${fotos.length})</div>
        <div class="photo-strip" id="photoStrip">${fotos.sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||'')).map(f => `
          <div class="strip-item" data-index="${f.id}">
            <img src="${f.dataUrl}" alt="${App.Utils.escapeHtml(f.descripcion || f.categoria || '')}" loading="lazy">
            <div class="strip-cat">${f.categoria || ''}</div>
          </div>`).join('')}</div>
      </div>` : ''}
      <div class="tabs" id="detailTabs" style="margin-top:1rem">
        <div class="tab active" data-tab="inspe">Inspecciones (${insps.length})</div>
        <div class="tab" data-tab="fotos">Galería (${fotos.length})</div>
      </div>
      <div id="detailTabContent">
        <div class="detail-tab-content active" id="tabInspe">${this.renderInspeccionesTab(insps)}</div>
        <div class="detail-tab-content" id="tabFotos">${this.renderGaleriaTab(fotos, est.id)}</div>
      </div>`;

    document.getElementById('detailTabs')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.detail-tab-content').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const id = tab.dataset.tab;
      document.getElementById('tab' + id.charAt(0).toUpperCase() + id.slice(1))?.classList.add('active');
    });
    document.getElementById('btnEditEst')?.addEventListener('click', () => App.Views.Estructuras.renderForm(id));

    // Photo gallery: toggle upload form
    document.getElementById('btnShowUploadForm')?.addEventListener('click', () => {
      const form = document.getElementById('uploadFormContainer');
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('btnCancelUpload')?.addEventListener('click', () => {
      document.getElementById('uploadFormContainer').style.display = 'none';
    });

    // Photo gallery: upload form
    document.getElementById('photoUploadForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const file = fd.get('foto');
      if (!file || !file.size) { App.Utils.toast('Seleccione una imagen', 'warning'); return; }
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const foto = {
          id: App.Utils.generateId('FOTO'),
          estructura_id: fd.get('estructura_id'),
          categoria: fd.get('categoria'),
          autor: fd.get('autor'),
          fecha: fd.get('fecha') || App.Utils.now(),
          hora: fd.get('hora') || App.Utils.nowTime(),
          descripcion: fd.get('descripcion'),
          dataUrl: ev.target.result,
          created_at: new Date().toISOString()
        };
        await App.DB.create('fotografias', foto);
        App.Utils.toast('Fotografía subida', 'success');
        // If no main photo, set this one as main
        const est = await App.DB.getById('estructuras', id);
        if (est && !est.foto_principal) {
          est.foto_principal = foto.dataUrl;
          await App.DB.update('estructuras', est);
        }
        App.Views.Estructuras.renderDetail(id);
      };
      reader.readAsDataURL(file);
    });

    // Photo gallery: set main photo
    document.querySelector('#tabFotos')?.addEventListener('click', async (ev) => {
      const btn = ev.target.closest('.btnSetMain');
      if (!btn) return;
      const fotoId = btn.dataset.id;
      const fotos = await App.DB.query('fotografias', f => f.estructura_id === id);
      const foto = fotos.find(f => f.id === fotoId);
      if (foto) {
        const est = await App.DB.getById('estructuras', id);
        est.foto_principal = foto.dataUrl;
        await App.DB.update('estructuras', est);
        App.Utils.toast('Foto principal actualizada', 'success');
        App.Views.Estructuras.renderDetail(id);
      }
    });

    // Photo gallery: delete photo
    document.querySelector('#tabFotos')?.addEventListener('click', async (ev) => {
      const btn = ev.target.closest('.btnDeleteFoto');
      if (!btn) return;
      const fotoId = btn.dataset.id;
      const ok = await App.Utils.confirmDialog('¿Eliminar esta fotografía?');
      if (ok) {
        const fotos = await App.DB.query('fotografias', f => f.estructura_id === id);
        const foto = fotos.find(f => f.id === fotoId);
        await App.DB.delete('fotografias', fotoId);
        const est = await App.DB.getById('estructuras', id);
        if (est.foto_principal === foto?.dataUrl) {
          const remaining = (await App.DB.query('fotografias', f => f.estructura_id === id));
          est.foto_principal = remaining.length ? remaining[0].dataUrl : '';
          await App.DB.update('estructuras', est);
        }
        App.Utils.toast('Fotografía eliminada', 'success');
        App.Views.Estructuras.renderDetail(id);
      }
    });

    // Lightbox: click on photo strip thumbnails
    document.getElementById('photoStrip')?.addEventListener('click', (ev) => {
      const item = ev.target.closest('.strip-item');
      if (!item) return;
      const fotoId = item.dataset.index;
      App.Views.Estructuras.openLightbox(fotos, fotoId);
    });

    if (window.lucide) lucide.createIcons();
  },

  openLightbox(fotos, startId) {
    let idx = fotos.findIndex(f => f.id === startId);
    if (idx < 0) idx = 0;
    const render = (i) => {
      const f = fotos[i];
      if (!f) return;
      const overlay = document.getElementById('lightboxOverlay');
      overlay.innerHTML = `
        <button class="lightbox-close" id="lbClose">&times;</button>
        ${fotos.length > 1 ? `<button class="lightbox-nav lightbox-prev" id="lbPrev">&#8249;</button><button class="lightbox-nav lightbox-next" id="lbNext">&#8250;</button>` : ''}
        <div class="lightbox-content">
          <img src="${f.dataUrl}" alt="${App.Utils.escapeHtml(f.descripcion || '')}">
          <div class="lightbox-meta">
            <span>${App.Utils.escapeHtml(f.categoria || '')} ${f.descripcion ? '- ' + App.Utils.escapeHtml(f.descripcion) : ''}</span>
            <span>${App.Utils.formatDate(f.fecha)} ${f.autor ? '- ' + App.Utils.escapeHtml(f.autor) : ''}</span>
          </div>
        </div>`;
      document.getElementById('lbClose')?.addEventListener('click', () => { overlay.style.display = 'none'; });
      document.getElementById('lbPrev')?.addEventListener('click', (e) => { e.stopPropagation(); render((i - 1 + fotos.length) % fotos.length); });
      document.getElementById('lbNext')?.addEventListener('click', (e) => { e.stopPropagation(); render((i + 1) % fotos.length); });
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none'; });
    };
    let overlay = document.getElementById('lightboxOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'lightboxOverlay';
      overlay.className = 'lightbox-overlay';
      overlay.style.display = 'none';
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
    render(idx);
  },

  renderInspeccionesTab(insps) {
    if (!insps.length) return `<div class="table-empty"><p>Sin inspecciones registradas</p><button class="btn btn-primary" id="btnNuevaInspeccionDesdeDetalle"><i data-lucide="plus" style="width:16px;height:16px"></i> Nueva Inspección</button></div>`;
    return App.Components.renderTable({
      headers: [{ label: 'Inspector' }, { label: 'Profesión' }, { label: 'Institución' }, { label: 'Fecha' }, { label: 'Resultado' }, { label: 'Recomendaciones' }],
      rows: insps.sort((a,b) => b.fecha.localeCompare(a.fecha)).map(i => `<tr>
        <td>${App.Utils.escapeHtml(i.inspector)}</td>
        <td>${App.Utils.escapeHtml(i.profesion || '')}</td>
        <td>${App.Utils.escapeHtml(i.institucion || '')}</td>
        <td>${App.Utils.formatDate(i.fecha)}</td>
        <td>${App.Components.renderBadge(i.resultado)}</td>
        <td style="max-width:200px;font-size:0.8rem">${App.Utils.escapeHtml((i.recomendaciones || '').substring(0, 100))}${(i.recomendaciones || '').length > 100 ? '...' : ''}</td>
      </tr>`)
    });
  },

  renderGaleriaTab(fotos, estructuraId) {
    return `
      <div id="galleryContainer">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
          <span style="font-size:.82rem;color:var(--gray-500)">${fotos.length} foto(s)</span>
          <button class="btn btn-primary btn-sm" id="btnShowUploadForm"><i data-lucide="upload" style="width:13px;height:13px"></i> Subir foto</button>
        </div>
        <div id="uploadFormContainer" style="display:none;margin-bottom:1rem;background:var(--gray-50);border:1px solid var(--gray-200);border-radius:8px;padding:1rem">
          <form id="photoUploadForm">
            <input type="hidden" name="estructura_id" value="${estructuraId}">
            <div class="form-row">
              <div class="form-group">
                <label>Categoría</label>
                <select class="form-select" name="categoria" required>${App.Config.categoriasFoto.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
              </div>
              <div class="form-group">
                <label>Autor</label>
                <input class="form-input" name="autor" placeholder="Nombre" value="Carlos Mendoza">
              </div>
              <div class="form-group">
                <label>Descripción</label>
                <input class="form-input" name="descripcion" placeholder="Breve descripción">
              </div>
              <div class="form-group">
                <label>Imagen</label>
                <input class="form-input" name="foto" type="file" accept="image/*" required id="photoFileInput" style="padding:.3rem">
              </div>
            </div>
            <div style="display:flex;gap:.5rem;margin-top:.5rem">
              <button type="submit" class="btn btn-primary btn-sm"><i data-lucide="upload" style="width:13px;height:13px"></i> Subir</button>
              <button type="button" class="btn btn-secondary btn-sm" id="btnCancelUpload">Cancelar</button>
            </div>
          </form>
        </div>
        ${this.renderGalleryGrid(fotos, estructuraId)}
      </div>`;
  },

  renderGalleryGrid(fotos, estructuraId) {
    if (!fotos.length) return `<div class="table-empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><p>Sin evidencias fotográficas</p><p style="font-size:.75rem;color:var(--gray-400);margin-top:4px">Use el botón "Subir foto" para agregar imágenes</p></div>`;
    return `<div class="gallery-grid">${fotos.sort((a,b) => (b.fecha||'').localeCompare(a.fecha||'')).map(f => `
      <div class="gallery-item" data-foto-id="${f.id}">
        <img src="${f.dataUrl || ''}" alt="${App.Utils.escapeHtml(f.descripcion || '')}" loading="lazy">
        <div class="gallery-overlay">
          <div>${App.Utils.escapeHtml(f.categoria || '')}</div>
          <div style="font-size:.6rem;opacity:.8">${App.Utils.formatDate(f.fecha)} ${App.Utils.escapeHtml(f.autor ? '- ' + f.autor : '')}</div>
        </div>
        <div style="position:absolute;top:4px;right:4px;display:flex;gap:2px">
          <button class="btn btn-sm btnSetMain" data-id="${f.id}" title="Foto principal" style="background:rgba(0,0,0,.5);color:#fff;padding:2px 5px;font-size:.6rem;border-radius:4px;border:none;cursor:pointer">★</button>
          <button class="btn btn-sm btnDeleteFoto" data-id="${f.id}" title="Eliminar" style="background:rgba(220,38,38,.7);color:#fff;padding:2px 5px;font-size:.6rem;border-radius:4px;border:none;cursor:pointer">✕</button>
        </div>
      </div>`).join('')}</div>`;
  }
};

/* ============================================================
   VIEW: MAPA
   ============================================================ */
App.Views.Mapa = {
  map: null,
  markers: [],

  async render() {
    const container = document.getElementById('page-content');
    container.innerHTML = `
      <div class="page-header">
        <h1>Mapa Interactivo</h1>
        <p>Visualización geográfica de todas las estructuras registradas</p>
      </div>
      <div class="filters-bar">
        <div class="filter-group">
          <label>Filtrar por estado</label>
          <select class="form-select" id="mapFilterEstado"><option value="">Todos</option>${App.Config.estadosEstructurales.map(e => `<option value="${e.value}" style="color:${e.color}">${e.label}</option>`).join('')}</select>
        </div>
        <div style="display:flex;gap:0.5rem">
          ${App.Config.estadosEstructurales.slice(1).map(e => `<span class="badge badge-${e.badge}" style="background:${e.color}20;color:${e.color};border:2px solid ${e.color}">${e.label}</span>`).join('')}
        </div>
      </div>
      <div id="map-container"></div>`;

    await this.initMap();
    document.getElementById('mapFilterEstado')?.addEventListener('change', () => this.updateMarkers());

    if (window.lucide) lucide.createIcons();
  },

  async initMap() {
    if (this.map) { this.map.invalidateSize(); this.updateMarkers(); return; }
    this.map = L.map('map-container').setView([10.473, -66.62], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 18 }).addTo(this.map);
    setTimeout(() => this.map.invalidateSize(), 300);
    this.updateMarkers();
  },

  async updateMarkers() {
    if (!this.map) return;
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];
    const filter = document.getElementById('mapFilterEstado')?.value || '';
    const estructuras = await App.DB.getAll('estructuras');
    const filtered = filter ? estructuras.filter(e => e.estado_estructural === filter) : estructuras;

    filtered.forEach(e => {
      if (!e.latitud || !e.longitud) return;
      const color = App.Utils.getEstadoColor(e.estado_estructural);
      const marker = L.circleMarker([e.latitud, e.longitud], {
        radius: 10, fillColor: color, color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.8
      }).addTo(this.map);
      marker.bindPopup(`
        <div style="min-width:200px">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px;color:#1E293B">${App.Utils.escapeHtml(e.nombre)}</div>
          <div style="font-size:12px;color:#64748B">${App.Utils.escapeHtml(e.direccion || '')}</div>
          <div style="margin:6px 0">${App.Components.renderBadge(e.estado_estructural)}</div>
          <div style="font-size:11px;color:#94A3B8">Últ. inspección: ${App.Utils.formatDate(e.ultima_inspeccion)}</div>
          <button onclick="App.Router.navigate('#estructura/${e.id}')" class="btn btn-sm btn-primary" style="margin-top:8px;width:100%;font-size:11px">Ver Ficha Completa</button>
        </div>
      `);
      this.markers.push(marker);
    });

    if (filtered.length && this.markers.length) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }
};

/* ============================================================
   VIEW: BUSCADOR
   ============================================================ */
App.Views.Buscador = {
  async render() {
    const container = document.getElementById('page-content');
    const estructuras = await App.DB.getAll('estructuras');

    container.innerHTML = `
      <div class="page-header">
        <h1>Buscador Avanzado</h1>
        <p>Busque y filtre estructuras por múltiples criterios</p>
      </div>
      <div class="filters-bar">
        <div class="filter-group"><label>Buscar</label><input class="form-input" id="searchTerm" placeholder="Nombre, dirección..."></div>
        <div class="filter-group"><label>Tipo</label><select class="form-select" id="searchTipo"><option value="">Todos</option>${App.Config.tiposEstructura.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>Estado</label><select class="form-select" id="searchEstado"><option value="">Todos</option>${App.Config.estadosEstructurales.map(e => `<option value="${e.value}">${e.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>Urbanización</label><input class="form-input" id="searchUrb" placeholder="Ej: La California"></div>
        <div class="filter-group"><label>Sector</label><input class="form-input" id="searchSector" placeholder="Ej: Norte"></div>
      </div>
      <div id="searchResults"></div>`;

    const doSearch = () => {
      const term = (document.getElementById('searchTerm')?.value || '').toLowerCase();
      const tipo = document.getElementById('searchTipo')?.value || '';
      const estado = document.getElementById('searchEstado')?.value || '';
      const urb = (document.getElementById('searchUrb')?.value || '').toLowerCase();
      const sector = (document.getElementById('searchSector')?.value || '').toLowerCase();
      let filtered = estructuras;
      if (term) filtered = filtered.filter(e => (e.nombre || '').toLowerCase().includes(term) || (e.direccion || '').toLowerCase().includes(term) || (e.id || '').toLowerCase().includes(term));
      if (tipo) filtered = filtered.filter(e => e.tipo === tipo);
      if (estado) filtered = filtered.filter(e => e.estado_estructural === estado);
      if (urb) filtered = filtered.filter(e => (e.urbanizacion || '').toLowerCase().includes(urb));
      if (sector) filtered = filtered.filter(e => (e.sector || '').toLowerCase().includes(sector));
      this.renderResults(filtered);
    };

    ['searchTerm','searchTipo','searchEstado','searchUrb','searchSector'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', doSearch);
      document.getElementById(id)?.addEventListener('change', doSearch);
    });
    doSearch();
  },

  renderResults(estructuras) {
    const container = document.getElementById('searchResults');
    if (!estructuras.length) { container.innerHTML = `<div class="table-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>No se encontraron resultados</p></div>`; return; }
    container.innerHTML = `<p style="font-size:0.85rem;color:#64748B;margin-bottom:0.75rem">${estructuras.length} resultado(s) encontrado(s)</p>` +
    App.Components.renderTable({
      headers: [{ label: 'ID' }, { label: 'Nombre' }, { label: 'Tipo' }, { label: 'Urbanización' }, { label: 'Sector' }, { label: 'Estado' }, { label: 'Familias' }],
      rows: estructuras.map(e => `<tr style="cursor:pointer" onclick="App.Router.navigate('#estructura/${e.id}')">
        <td><strong>${e.id}</strong></td>
        <td>${App.Utils.escapeHtml(e.nombre)}</td>
        <td>${App.Utils.getTipoLabel(e.tipo)}</td>
        <td>${App.Utils.escapeHtml(e.urbanizacion || '')}</td>
        <td>${App.Utils.escapeHtml(e.sector || '')}</td>
        <td>${App.Components.renderBadge(e.estado_estructural)}</td>
        <td>${e.cantidad_familias || 0}</td>
      </tr>`)
    });
  }
};

/* ============================================================
   VIEW: SEGUIMIENTO
   ============================================================ */
App.Views.Seguimiento = {
  async render(params) {
    const id = Array.isArray(params) ? params[0] : '';
    const container = document.getElementById('page-content');
    const estructuras = await App.DB.getAll('estructuras');
    const segs = id ? await App.DB.query('seguimientos', s => s.estructura_id === id) : await App.DB.getAll('seguimientos');
    const est = id ? await App.DB.getById('estructuras', id) : null;

    container.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:0.75rem">
        <div>
          <h1>Seguimiento y Control</h1>
          <p>${est ? `Historial de: ${App.Utils.escapeHtml(est.nombre)}` : 'Registro cronológico de todas las evaluaciones'}</p>
        </div>
        <div style="display:flex;gap:0.5rem">
          <select class="form-select" id="segFilterEstructura" style="min-width:200px">
            <option value="">Todas las estructuras</option>
            ${estructuras.sort((a,b) => a.nombre.localeCompare(b.nombre)).map(e => `<option value="${e.id}" ${e.id === id ? 'selected' : ''}>${e.id} - ${App.Utils.escapeHtml(e.nombre)}</option>`).join('')}
          </select>
          ${id ? `<button class="btn btn-primary" id="btnNuevoSeg"><i data-lucide="plus" style="width:16px;height:16px"></i> Nuevo Seguimiento</button>` : ''}
        </div>
      </div>
      <div id="segContent">${segs.length ? `<div class="timeline">${segs.sort((a,b) => b.fecha.localeCompare(a.fecha)).map(async (s) => {
        const e = await App.DB.getById('estructuras', s.estructura_id);
        return `<div class="timeline-item">
          <div class="timeline-date">${App.Utils.formatDate(s.fecha)} - ${s.inspector || ''}</div>
          <div class="timeline-title">${e ? `<a href="#estructura/${e.id}" style="color:var(--accent);text-decoration:none">${App.Utils.escapeHtml(e.nombre)}</a> - ` : ''}${App.Components.renderBadge(s.nivel_daño)} ${s.organismo || ''}</div>
          <div class="timeline-body">${App.Utils.escapeHtml(s.observaciones || '')}</div>
          ${s.acciones ? `<div class="timeline-body" style="margin-top:0.25rem;font-size:0.8rem;color:#64748B"><strong>Acciones:</strong> ${App.Utils.escapeHtml(s.acciones)}</div>` : ''}
        </div>`;
      }).join('')}</div>` : `<div class="table-empty"><p>Sin registros de seguimiento</p></div>`}</div>`;

    document.getElementById('segFilterEstructura')?.addEventListener('change', (e) => {
      if (e.target.value) App.Router.navigate(`#seguimiento/${e.target.value}`);
      else App.Router.navigate('#seguimiento');
    });
    document.getElementById('btnNuevoSeg')?.addEventListener('click', () => this.showForm(id));
    if (window.lucide) lucide.createIcons();
  },

  showForm(estructuraId) {
    App.Components.Modal.show({
      title: 'Nuevo Registro de Seguimiento',
      body: `
        <form id="segForm">
          <input type="hidden" name="estructura_id" value="${estructuraId}">
          <div class="form-row">
            <div class="form-group"><label>Fecha *</label><input class="form-input" name="fecha" type="date" value="${App.Utils.now()}" required></div>
            <div class="form-group"><label>Hora</label><input class="form-input" name="hora" type="time" value="${App.Utils.nowTime()}"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Inspector</label><input class="form-input" name="inspector" placeholder="Nombre del inspector"></div>
            <div class="form-group"><label>Organismo</label><input class="form-input" name="organismo" placeholder="Ej: Protección Civil"></div>
          </div>
          <div class="form-group"><label>Nivel de daño *</label>
            <select class="form-select" name="nivel_daño" required>
              ${App.Config.estadosEstructurales.map(e => `<option value="${e.value}">${e.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label>Observaciones</label><textarea class="form-textarea" name="observaciones" rows="3" placeholder="Describa la situación observada..."></textarea></div>
          <div class="form-group"><label>Acciones realizadas</label><textarea class="form-textarea" name="acciones" rows="2" placeholder="Acciones ejecutadas..."></textarea></div>
        </form>`,
      footer: `<button class="btn btn-secondary" data-modal-close>Cancelar</button><button class="btn btn-primary" id="btnSaveSeg">Guardar</button>`
    });
    document.getElementById('btnSaveSeg')?.addEventListener('click', async () => {
      const fd = new FormData(document.getElementById('segForm'));
      const data = {};
      fd.forEach((v, k) => data[k] = v);
      data.id = App.Utils.generateId('SEG');
      await App.DB.create('seguimientos', data);
      await App.DB.update('estructuras', { ...(await App.DB.getById('estructuras', estructuraId)), ultima_inspeccion: data.fecha, estado_estructural: data.nivel_daño });
      App.Components.Modal.close();
      App.Utils.toast('Seguimiento registrado', 'success');
      App.Router.navigate(`#seguimiento/${estructuraId}`);
    });
  }
};

/* ============================================================
   VIEW: INSPECCIONES
   ============================================================ */
App.Views.Inspecciones = {
  async render(params) {
    const id = Array.isArray(params) ? params[0] : '';
    const container = document.getElementById('page-content');
    const estructuras = await App.DB.getAll('estructuras');
    const insps = id ? await App.DB.query('inspecciones', i => i.estructura_id === id) : await App.DB.getAll('inspecciones');
    const est = id ? await App.DB.getById('estructuras', id) : null;

    container.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:0.75rem">
        <div>
          <h1>Inspecciones Técnicas</h1>
          <p>${est ? `Inspecciones de: ${App.Utils.escapeHtml(est.nombre)}` : 'Todas las inspecciones registradas'}</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
          <select class="form-select" id="insFilterEstructura" style="min-width:200px">
            <option value="">Todas las estructuras</option>
            ${estructuras.sort((a,b) => a.nombre.localeCompare(b.nombre)).map(e => `<option value="${e.id}" ${e.id === id ? 'selected' : ''}>${e.id} - ${App.Utils.escapeHtml(e.nombre)}</option>`).join('')}
          </select>
          <button class="btn btn-primary" id="btnNuevaIns"><i data-lucide="plus" style="width:16px;height:16px"></i> Nueva Inspección</button>
        </div>
      </div>
      <div id="insContent"></div>`;

    document.getElementById('insFilterEstructura')?.addEventListener('change', (e) => {
      if (e.target.value) App.Router.navigate(`#inspecciones/${e.target.value}`);
      else App.Router.navigate('#inspecciones');
    });
    document.getElementById('btnNuevaIns')?.addEventListener('click', () => this.showForm(id || ''));
    await this.renderTable(insps);
    if (window.lucide) lucide.createIcons();
  },

  async renderTable(insps) {
    const container = document.getElementById('insContent');
    const rows = await Promise.all(insps.sort((a,b) => b.fecha.localeCompare(a.fecha)).map(async i => {
      const e = await App.DB.getById('estructuras', i.estructura_id);
      return `<tr>
        <td>${e ? `<a href="#estructura/${e.id}" style="color:var(--accent);text-decoration:none">${App.Utils.escapeHtml(e.nombre)}</a>` : '—'}</td>
        <td>${App.Utils.escapeHtml(i.inspector)}</td>
        <td>${App.Utils.escapeHtml(i.profesion || '')}</td>
        <td>${App.Utils.escapeHtml(i.institucion || '')}</td>
        <td>${App.Utils.formatDate(i.fecha)}</td>
        <td>${App.Components.renderBadge(i.resultado)}</td>
      </tr>`;
    }));
    container.innerHTML = App.Components.renderTable({
      headers: [{ label: 'Estructura' }, { label: 'Inspector' }, { label: 'Profesión' }, { label: 'Institución' }, { label: 'Fecha' }, { label: 'Resultado' }],
      rows, emptyMsg: 'No hay inspecciones registradas'
    });
  },

  showForm(estructuraId) {
    App.Components.Modal.show({
      title: 'Nueva Inspección Técnica',
      body: `
        <form id="insForm">
          <input type="hidden" name="estructura_id" value="${estructuraId}">
          <div class="form-row">
            <div class="form-group"><label>Inspector *</label><input class="form-input" name="inspector" required placeholder="Nombre completo"></div>
            <div class="form-group"><label>Profesión</label><input class="form-input" name="profesion" placeholder="Ing. Civil, Arquitecto..."></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>N° Credencial</label><input class="form-input" name="credencial" placeholder="Ej: ING-001234"></div>
            <div class="form-group"><label>Institución</label><input class="form-input" name="institucion" placeholder="Protección Civil"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Fecha *</label><input class="form-input" name="fecha" type="date" value="${App.Utils.now()}" required></div>
            <div class="form-group"><label>Resultado *</label>
              <select class="form-select" name="resultado" required>
                ${App.Config.estadosEstructurales.map(e => `<option value="${e.value}">${e.label}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group"><label>Recomendaciones</label><textarea class="form-textarea" name="recomendaciones" rows="3" placeholder="Recomendaciones técnicas..."></textarea></div>
          <div class="form-group"><label>Documentos (PDF, planos)</label><input class="form-input" name="documentos" type="file" multiple accept=".pdf,.doc,.docx,.dwg"></div>
        </form>`,
      footer: `<button class="btn btn-secondary" data-modal-close>Cancelar</button><button class="btn btn-primary" id="btnSaveIns">Guardar Inspección</button>`
    });
    document.getElementById('btnSaveIns')?.addEventListener('click', async () => {
      const fd = new FormData(document.getElementById('insForm'));
      const data = {};
      fd.forEach((v, k) => { if (k !== 'documentos') data[k] = v; });
      data.id = App.Utils.generateId('INS');
      await App.DB.create('inspecciones', data);
      const est = await App.DB.getById('estructuras', estructuraId);
      if (est) {
        est.ultima_inspeccion = data.fecha;
        est.estado_estructural = data.resultado;
        est.riesgo_colapso = data.resultado === 'riesgo_colapso' || data.resultado === 'colapsado';
        est.atencion_prioritaria = est.riesgo_colapso || data.resultado === 'daño_severo';
        await App.DB.update('estructuras', est);
      }
      App.Components.Modal.close();
      App.Utils.toast('Inspección registrada', 'success');
      App.Router.navigate(`#inspecciones/${estructuraId}`);
    });
  }
};

/* ============================================================
   VIEW: SERVICIOS
   ============================================================ */
App.Views.Servicios = {
  async render(params) {
    const id = Array.isArray(params) ? params[0] : '';
    const container = document.getElementById('page-content');
    const estructuras = await App.DB.getAll('estructuras');
    const servicios = await App.DB.getAll('servicios');

    container.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:0.75rem">
        <div>
          <h1>Servicios Afectados</h1>
          <p>Estado de los servicios básicos en las estructuras afectadas</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
          <select class="form-select" id="srvFilterEstructura" style="min-width:200px">
            <option value="">Todas las estructuras</option>
            ${estructuras.sort((a,b) => a.nombre.localeCompare(b.nombre)).map(e => `<option value="${e.id}" ${e.id === id ? 'selected' : ''}>${e.id} - ${App.Utils.escapeHtml(e.nombre)}</option>`).join('')}
          </select>
          <button class="btn btn-primary" id="btnNuevoSrv"><i data-lucide="plus" style="width:16px;height:16px"></i> Registrar Servicios</button>
        </div>
      </div>
      <div id="srvContent"></div>`;

    document.getElementById('srvFilterEstructura')?.addEventListener('change', (e) => {
      if (e.target.value) App.Router.navigate(`#servicios/${e.target.value}`);
      else App.Router.navigate('#servicios');
    });
    document.getElementById('btnNuevoSrv')?.addEventListener('click', () => this.showForm(id || ''));
    await this.renderList(servicios, id);
    if (window.lucide) lucide.createIcons();
  },

  async renderList(servicios, filterId) {
    const container = document.getElementById('srvContent');
    const filtered = filterId ? servicios.filter(s => s.estructura_id === filterId) : servicios;
    if (!filtered.length) { container.innerHTML = '<div class="table-empty"><p>No hay registros de servicios</p></div>'; return; }
    const rows = await Promise.all(filtered.map(async s => {
      const e = await App.DB.getById('estructuras', s.estructura_id);
      return `<tr>
        <td>${e ? `<a href="#estructura/${e.id}" style="color:var(--accent);text-decoration:none">${App.Utils.escapeHtml(e.nombre)}</a>` : '—'}</td>
        ${App.Config.servicios.map(srv => {
          const val = s[srv.id] || 'fuera_de_servicio';
          const estado = App.Config.estadosServicio.find(es => es.value === val);
          return `<td style="text-align:center;color:${estado?.color || '#EF4444'};font-weight:600;font-size:0.75rem">${App.Utils.getServicioLabel(val).substring(0, 7)}</td>`;
        }).join('')}
        <td style="font-size:0.75rem;color:#64748B">${App.Utils.formatDate(s.fecha_actualizacion)}</td>
      </tr>`;
    }));
    container.innerHTML = App.Components.renderTable({
      headers: [
        { label: 'Estructura' },
        ...App.Config.servicios.map(s => ({ label: s.label })),
        { label: 'Actualización' }
      ],
      rows
    });
  },

  showForm(estructuraId) {
    App.Components.Modal.show({
      title: 'Registrar Estado de Servicios',
      body: `
        <form id="srvForm">
          <input type="hidden" name="estructura_id" value="${estructuraId}">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.75rem">
            ${App.Config.servicios.map(s => `
              <div class="form-group">
                <label>${s.label}</label>
                <select class="form-select" name="${s.id}">
                  ${App.Config.estadosServicio.map(es => `<option value="${es.value}">${es.label}</option>`).join('')}
                </select>
              </div>`).join('')}
          </div>
        </form>`,
      footer: `<button class="btn btn-secondary" data-modal-close>Cancelar</button><button class="btn btn-primary" id="btnSaveSrv">Guardar</button>`
    });
    document.getElementById('btnSaveSrv')?.addEventListener('click', async () => {
      const fd = new FormData(document.getElementById('srvForm'));
      const data = { id: App.Utils.generateId('SRV'), fecha_actualizacion: App.Utils.now() };
      fd.forEach((v, k) => data[k] = v);
      await App.DB.create('servicios', data);
      App.Components.Modal.close();
      App.Utils.toast('Servicios registrados', 'success');
      App.Router.navigate(`#servicios/${estructuraId}`);
    });
  }
};

/* ============================================================
   VIEW: ADMINISTRACIÓN
   ============================================================ */
App.Views.Admin = {
  async render() {
    const container = document.getElementById('page-content');
    const usuarios = await App.DB.getAll('usuarios');
    const estructuras = await App.DB.getAll('estructuras');
    const urbs = await App.DB.getAllFromRef('urbanizaciones');

    container.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:0.75rem">
        <div><h1>Administración del Sistema</h1><p>Gestión de usuarios, roles y datos maestros</p></div>
        <div style="display:flex;gap:0.5rem">
          <button class="btn btn-primary" id="btnNuevoUsuario"><i data-lucide="user-plus" style="width:16px;height:16px"></i> Nuevo Usuario</button>
          <button class="btn btn-secondary" id="btnGestionUrb"><i data-lucide="map-pin" style="width:16px;height:16px"></i> Urbanizaciones</button>
        </div>
      </div>
      <div style="margin-bottom:1.5rem">
        <h2 style="font-size:1.1rem;font-weight:600;color:var(--primary);margin-bottom:0.75rem">Usuarios del Sistema</h2>
        <div class="admin-grid" id="usersGrid">
          ${usuarios.map(u => {
            const initials = u.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            return `<div class="user-card">
              <div class="user-avatar-lg" style="background:${u.rol === 'administrador' ? '#DC2626' : u.rol === 'proteccion_civil' ? '#F97316' : '#3B82F6'}">${initials}</div>
              <div class="user-details">
                <h4>${App.Utils.escapeHtml(u.nombre)}</h4>
                <p>${App.Utils.getRolLabel(u.rol)}</p>
                <p style="font-size:0.75rem">${App.Utils.escapeHtml(u.email)}</p>
                <p style="font-size:0.75rem">${App.Utils.escapeHtml(u.organismo || '')}</p>
                <div style="margin-top:0.5rem;display:flex;gap:0.5rem">
                  <span class="badge ${u.activo ? 'badge-green' : 'badge-gray'}">${u.activo ? 'Activo' : 'Inactivo'}</span>
                  <button class="btn btn-sm btn-ghost" data-action="edit-user" data-id="${u.id}"><i data-lucide="edit" style="width:12px;height:12px"></i></button>
                </div>
        </div>
      </div>
      <div style="margin-bottom:1.5rem;background:#fff;border:1px solid var(--gray-200);border-radius:10px;padding:1.25rem">
        <h2 style="font-size:1.1rem;font-weight:600;color:var(--primary);margin-bottom:.75rem">Base de datos en la nube</h2>
        <p style="font-size:.82rem;color:var(--gray-400);margin-bottom:.75rem">Conecte SIGEA a Supabase (capa gratuita) para almacenar los datos en la nube y acceder desde cualquier dispositivo.</p>
        <div id="cloudStatus" style="margin-bottom:.75rem"></div>
        <div id="cloudConfigForm">
          <div class="form-row">
            <div class="form-group">
              <label>Supabase URL</label>
              <input class="form-input" id="cloudUrl" value="${App.Utils.escapeHtml(App.Config.cloud.supabaseUrl)}" placeholder="https://tu-proyecto.supabase.co">
            </div>
            <div class="form-group">
              <label>Supabase Anon Key</label>
              <input class="form-input" id="cloudKey" type="password" value="${App.Utils.escapeHtml(App.Config.cloud.supabaseKey)}" placeholder="eyJhbGciOiJIUzI1NiIs...">
            </div>
          </div>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap">
            <button class="btn btn-primary btn-sm" id="btnSaveCloudConfig"><i data-lucide="save" style="width:13px;height:13px"></i> Guardar configuración</button>
            <button class="btn btn-secondary btn-sm" id="btnTestConnection"><i data-lucide="wifi" style="width:13px;height:13px"></i> Probar conexión</button>
            <button class="btn btn-warning btn-sm" id="btnMigrateCloud"><i data-lucide="upload-cloud" style="width:13px;height:13px"></i> Migrar datos locales a la nube</button>
          </div>
          <div style="margin-top:.75rem;font-size:.75rem;color:var(--gray-400);line-height:1.5">
            <strong>¿Cómo obtener estos datos?</strong><br>
            1. Cree una cuenta gratis en <a href="https://supabase.com" target="_blank" style="color:var(--accent)">supabase.com</a><br>
            2. Cree un nuevo proyecto<br>
            3. Vaya a Project Settings → API<br>
            4. Copie la URL del proyecto y el anon public key<br>
            5. Ejecute el script SQL incluido en el README para crear las tablas
          </div>
        </div>
      </div>`;
          }).join('')}
        </div>
      </div>
      <div style="margin-bottom:1.5rem">
        <h2 style="font-size:1.1rem;font-weight:600;color:var(--primary);margin-bottom:0.75rem">Resumen del Sistema</h2>
        <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
          ${App.Components.renderStatsCard({ label: 'Usuarios', value: usuarios.length, icon: 'Users', color: '#3B82F6' })}
          ${App.Components.renderStatsCard({ label: 'Estructuras', value: estructuras.length, icon: 'Building2', color: '#8B5CF6' })}
          ${App.Components.renderStatsCard({ label: 'Urbanizaciones', value: urbs.length, icon: 'MapPin', color: '#14B8A6' })}
          ${App.Components.renderStatsCard({ label: 'Roles disponibles', value: App.Config.roles.length, icon: 'Shield', color: '#F59E0B' })}
        </div>
      </div>`;

    document.getElementById('btnNuevoUsuario')?.addEventListener('click', () => this.showUserForm());
    document.getElementById('btnGestionUrb')?.addEventListener('click', () => this.showUrbManager());
    document.querySelectorAll('[data-action="edit-user"]').forEach(btn => btn.addEventListener('click', () => this.showUserForm(btn.dataset.id)));

    // Cloud config
    const updateCloudStatus = async () => {
      const el = document.getElementById('cloudStatus');
      if (App.Config.cloud.enabled && App.DB.supabase) {
        const ok = await App.DB.testConnection();
        el.innerHTML = ok
          ? `<span class="badge badge-green" style="font-size:.8rem;padding:4px 10px">✓ Conectado a Supabase — los datos se sincronizan automáticamente</span>`
          : `<span class="badge badge-red" style="font-size:.8rem;padding:4px 10px">✗ Configuración guardada pero sin conexión. Verifique sus credenciales</span>`;
      } else {
        el.innerHTML = `<span class="badge badge-gray" style="font-size:.8rem;padding:4px 10px">○ Almacenamiento local (IndexedDB). Configure Supabase para activar la nube</span>`;
      }
    };
    updateCloudStatus();

    document.getElementById('btnSaveCloudConfig')?.addEventListener('click', () => {
      App.Config.cloud.supabaseUrl = document.getElementById('cloudUrl').value.trim();
      App.Config.cloud.supabaseKey = document.getElementById('cloudKey').value.trim();
      App.Config.cloud.enabled = !!(App.Config.cloud.supabaseUrl && App.Config.cloud.supabaseKey);
      App.DB._supabase = null;
      App.Utils.toast(App.Config.cloud.enabled ? 'Configuración de nube guardada' : 'Configuración limpiada', 'success');
      updateCloudStatus();
    });

    document.getElementById('btnTestConnection')?.addEventListener('click', async () => {
      App.Config.cloud.supabaseUrl = document.getElementById('cloudUrl').value.trim();
      App.Config.cloud.supabaseKey = document.getElementById('cloudKey').value.trim();
      App.DB._supabase = null;
      const ok = await App.DB.testConnection();
      App.Utils.toast(ok ? 'Conexión exitosa a Supabase' : 'Error de conexión. Verifique URL y Key', ok ? 'success' : 'error');
    });

    document.getElementById('btnMigrateCloud')?.addEventListener('click', async () => {
      if (!App.Config.cloud.supabaseUrl || !App.Config.cloud.supabaseKey) {
        App.Utils.toast('Configure Supabase primero', 'warning'); return;
      }
      App.Config.cloud.enabled = true;
      App.DB._supabase = null;
      const ok = await App.DB.testConnection();
      if (!ok) { App.Utils.toast('No se puede conectar a Supabase', 'error'); return; }
      const total = await App.DB.migrateToCloud();
      App.Utils.toast(`${total} registro(s) migrados a la nube`, 'success');
      updateCloudStatus();
    });

    if (window.lucide) lucide.createIcons();
  },

  showUserForm(editId) {
    App.DB.getById('usuarios', editId).then(editData => {
      App.Components.Modal.show({
        title: editData ? 'Editar Usuario' : 'Nuevo Usuario',
        body: `
          <form id="userForm">
            ${editData ? `<input type="hidden" name="id" value="${editData.id}">` : ''}
            <div class="form-row">
              <div class="form-group"><label>Nombre *</label><input class="form-input" name="nombre" required value="${App.Utils.escapeHtml(editData?.nombre || '')}"></div>
              <div class="form-group"><label>Email</label><input class="form-input" name="email" type="email" value="${App.Utils.escapeHtml(editData?.email || '')}"></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Rol *</label>
                <select class="form-select" name="rol" required>
                  ${App.Config.roles.map(r => `<option value="${r.value}" ${editData?.rol === r.value ? 'selected' : ''}>${r.label}</option>`).join('')}
                </select>
              </div>
              <div class="form-group"><label>Organismo</label><input class="form-input" name="organismo" value="${App.Utils.escapeHtml(editData?.organismo || '')}"></div>
            </div>
            <div class="form-group"><label>Teléfono</label><input class="form-input" name="telefono" value="${App.Utils.escapeHtml(editData?.telefono || '')}"></div>
            <div class="form-group"><label><input type="checkbox" name="activo" value="true" ${editData?.activo !== false ? 'checked' : ''}> Usuario activo</label></div>
          </form>`,
        footer: `<button class="btn btn-secondary" data-modal-close>Cancelar</button><button class="btn btn-primary" id="btnSaveUser">${editData ? 'Actualizar' : 'Crear'}</button>`
      });
      document.getElementById('btnSaveUser')?.addEventListener('click', async () => {
        const fd = new FormData(document.getElementById('userForm'));
        const data = {};
        fd.forEach((v, k) => { if (k === 'activo') data[k] = true; else data[k] = v; });
        if (editData) { data.id = editData.id; await App.DB.update('usuarios', data); }
        else { data.id = App.Utils.generateId('USR'); data.activo = data.activo !== false; await App.DB.create('usuarios', data); }
        App.Components.Modal.close();
        App.Utils.toast(`Usuario ${editData ? 'actualizado' : 'creado'}`, 'success');
        this.render();
      });
    });
  },

  showUrbManager() {
    App.DB.getAllFromRef('urbanizaciones').then(urbs => {
      App.Components.Modal.show({
        title: 'Gestionar Urbanizaciones',
        body: `
          <div style="margin-bottom:1rem;display:flex;gap:0.5rem">
            <input class="form-input" id="newUrbName" placeholder="Nombre de urbanización" style="flex:1">
            <button class="btn btn-primary" id="btnAddUrb"><i data-lucide="plus" style="width:16px;height:16px"></i> Agregar</button>
          </div>
          <div id="urbList">${urbs.map(u => `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid #F1F5F9"><span>${App.Utils.escapeHtml(u.nombre)} (${App.Utils.escapeHtml(u.sector || '')})</span><button class="btn btn-sm btn-ghost" style="color:#EF4444" data-remove-urb="${u.id}"><i data-lucide="x" style="width:14px;height:14px"></i></button></div>`).join('')}</div>
          <div id="urbEmpty" style="${urbs.length ? 'display:none' : ''}" class="table-empty"><p>Sin urbanizaciones registradas</p></div>`,
        footer: `<button class="btn btn-secondary" data-modal-close>Cerrar</button>`
      });
      document.getElementById('btnAddUrb')?.addEventListener('click', async () => {
        const inp = document.getElementById('newUrbName');
        if (!inp.value.trim()) return;
        const newUrb = { id: App.Utils.generateId('URB'), nombre: inp.value.trim(), sector: '', municipio: 'Guarenas' };
        urbs.push(newUrb);
        await App.DB.saveRef('urbanizaciones', urbs);
        inp.value = '';
        App.Utils.toast('Urbanización agregada', 'success');
        this.showUrbManager();
      });
      document.querySelectorAll('[data-remove-urb]').forEach(btn => btn.addEventListener('click', async () => {
        const idx = urbs.findIndex(u => u.id === btn.dataset.removeUrb);
        if (idx >= 0) { urbs.splice(idx, 1); await App.DB.saveRef('urbanizaciones', urbs); App.Utils.toast('Urbanización eliminada', 'success'); this.showUrbManager(); }
      }));
      if (window.lucide) lucide.createIcons();
    });
  }
};

/* ============================================================
   VIEW: REPORTES
   ============================================================ */
App.Views.Reportes = {
  async render() {
    const container = document.getElementById('page-content');
    const stats = await App.DB.getStats();
    const estructuras = stats.estructuras;

    container.innerHTML = `
      <div class="page-header">
        <h1>Reportes</h1>
        <p>Genere reportes automáticos del observatorio</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem;margin-bottom:1.5rem">
        ${this.reportCards.map(r => `
          <div class="report-card" data-report="${r.id}">
            <div class="report-icon" style="background:${r.color}15;color:${r.color}"><i data-lucide="${r.icon}" style="width:22px;height:22px"></i></div>
            <h3>${r.label}</h3>
            <p>${r.desc}</p>
          </div>`).join('')}
      </div>
      <div id="reportOutput" style="display:none">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem">
          <h2 style="font-size:1.1rem;font-weight:600;color:var(--primary)" id="reportTitle">Reporte</h2>
          <div style="display:flex;gap:0.5rem">
            <button class="btn btn-secondary btn-sm" id="btnExportPDF"><i data-lucide="file-text" style="width:14px;height:14px"></i> PDF</button>
            <button class="btn btn-secondary btn-sm" id="btnExportCSV"><i data-lucide="download" style="width:14px;height:14px"></i> CSV</button>
            <button class="btn btn-secondary btn-sm" id="btnExportJSON"><i data-lucide="download" style="width:14px;height:14px"></i> JSON</button>
          </div>
        </div>
        <div id="reportContent" style="background:#fff;border-radius:12px;border:1px solid #E2E8F0;padding:1.5rem"></div>
      </div>`;

    document.querySelectorAll('.report-card').forEach(card => {
      card.addEventListener('click', () => this.generate(card.dataset.report, stats));
    });
    if (window.lucide) lucide.createIcons();
  },

  reportCards: [
    { id: 'urbanizacion', label: 'Por Urbanización', desc: 'Estructuras agrupadas por urbanización', icon: 'MapPin', color: '#3B82F6' },
    { id: 'sector', label: 'Por Sector', desc: 'Distribución de daños por sector', icon: 'Layers', color: '#8B5CF6' },
    { id: 'danio', label: 'Por Nivel de Daño', desc: 'Clasificación por estado estructural', icon: 'AlertTriangle', color: '#EF4444' },
    { id: 'fecha', label: 'Por Fecha', desc: 'Evolución cronológica de registros', icon: 'Calendar', color: '#F59E0B' },
    { id: 'familias', label: 'Familias Afectadas', desc: 'Resumen de familias y personas damnificadas', icon: 'Users', color: '#EC4899' },
    { id: 'colapsadas', label: 'Estructuras Colapsadas', desc: 'Inventario de estructuras colapsadas o demolidas', icon: 'TriangleAlert', color: '#111827' },
    { id: 'servicios', label: 'Servicios Afectados', desc: 'Estado de los servicios básicos', icon: 'Settings2', color: '#06B6D4' },
    { id: 'completo', label: 'Reporte Completo', desc: 'Informe integral del observatorio', icon: 'FileText', color: '#14B8A6' }
  ],

  async generate(id, stats) {
    const container = document.getElementById('reportOutput');
    container.style.display = 'block';
    document.getElementById('reportTitle').textContent = this.reportCards.find(r => r.id === id)?.label || 'Reporte';
    const content = document.getElementById('reportContent');

    switch(id) {
      case 'urbanizacion':
        const urbGroups = {};
        stats.estructuras.forEach(e => { const k = e.urbanizacion || 'Sin urbanización'; if (!urbGroups[k]) urbGroups[k] = []; urbGroups[k].push(e); });
        content.innerHTML = `<h3 style="margin-bottom:1rem">Estructuras por Urbanización</h3>` + Object.entries(urbGroups).map(([k, v]) => `
          <div style="margin-bottom:1rem;padding:1rem;background:#F8FAFC;border-radius:8px">
            <h4 style="font-weight:600;color:var(--primary)">${k} (${v.length})</h4>
            <ul style="margin-top:0.5rem;list-style:none;padding:0">
              ${v.map(e => `<li style="padding:0.25rem 0;display:flex;justify-content:space-between;border-bottom:1px solid #F1F5F9;font-size:0.85rem"><span>${App.Utils.escapeHtml(e.nombre)}</span>${App.Components.renderBadge(e.estado_estructural)}</li>`).join('')}
            </ul>
          </div>`).join('');
        break;
      case 'sector':
        const secGroups = {};
        stats.estructuras.forEach(e => { const k = e.sector || 'Sin sector'; if (!secGroups[k]) secGroups[k] = []; secGroups[k].push(e); });
        content.innerHTML = `<h3 style="margin-bottom:1rem">Estructuras por Sector</h3>` + Object.entries(secGroups).map(([k, v]) => `
          <div style="margin-bottom:1rem;padding:1rem;background:#F8FAFC;border-radius:8px">
            <h4 style="font-weight:600;color:var(--primary)">${k} (${v.length})</h4>
            <ul style="margin-top:0.5rem;list-style:none;padding:0">
              ${v.map(e => `<li style="padding:0.25rem 0;display:flex;justify-content:space-between;border-bottom:1px solid #F1F5F9;font-size:0.85rem"><span>${App.Utils.escapeHtml(e.nombre)}</span>${App.Components.renderBadge(e.estado_estructural)}</li>`).join('')}
            </ul>
          </div>`).join('');
        break;
      case 'danio':
        content.innerHTML = `<h3 style="margin-bottom:1rem">Clasificación por Nivel de Daño</h3>
          ${App.Config.estadosEstructurales.map(es => {
            const list = stats.estructuras.filter(e => e.estado_estructural === es.value);
            if (!list.length) return '';
            return `<div style="margin-bottom:1rem;padding:1rem;background:#F8FAFC;border-radius:8px;border-left:4px solid ${es.color}">
              <h4 style="font-weight:600;color:${es.color}">${es.label} (${list.length})</h4>
              <ul style="margin-top:0.5rem;list-style:none;padding:0">
                ${list.map(e => `<li style="padding:0.25rem 0;font-size:0.85rem">${App.Utils.escapeHtml(e.nombre)} - ${App.Utils.escapeHtml(e.urbanizacion || '')}</li>`).join('')}
              </ul>
            </div>`;
          }).join('')}`;
        break;
      case 'fecha':
        const dateGroups = {};
        stats.estructuras.forEach(e => { const k = e.fecha_registro || 'Sin fecha'; if (!dateGroups[k]) dateGroups[k] = []; dateGroups[k].push(e); });
        content.innerHTML = `<h3 style="margin-bottom:1rem">Registros por Fecha</h3>` + Object.entries(dateGroups).sort(([a],[b]) => b.localeCompare(a)).map(([k, v]) => `
          <div style="margin-bottom:0.5rem;padding:0.75rem;background:#F8FAFC;border-radius:8px;display:flex;justify-content:space-between;align-items:center">
            <span style="font-weight:600">${App.Utils.formatDate(k)}</span><span>${v.length} estructura(s)</span>
          </div>`).join('');
        break;
      case 'familias':
        content.innerHTML = `<h3 style="margin-bottom:1rem">Familias y Personas Afectadas</h3>
          <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
            ${App.Components.renderStatsCard({ label: 'Total Familias', value: stats.familiasAfectadas, icon: 'Users', color: '#EC4899' })}
            ${App.Components.renderStatsCard({ label: 'Total Personas', value: stats.personasAfectadas, icon: 'UserPlus', color: '#06B6D4' })}
            ${App.Components.renderStatsCard({ label: 'Estructuras con Familias', value: stats.estructuras.filter(e => e.cantidad_familias > 0).length, icon: 'Home', color: '#8B5CF6' })}
          </div>
          <table style="width:100%;border-collapse:collapse;margin-top:1rem">
            <thead><tr style="background:#F8FAFC"><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#64748B">Estructura</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#64748B">Familias</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#64748B">Personas</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#64748B">Estado</th></tr></thead>
            <tbody>${stats.estructuras.filter(e => e.cantidad_familias > 0).map(e => `<tr><td style="padding:0.75rem;border-bottom:1px solid #F1F5F9">${App.Utils.escapeHtml(e.nombre)}</td><td style="padding:0.75rem;border-bottom:1px solid #F1F5F9">${e.cantidad_familias}</td><td style="padding:0.75rem;border-bottom:1px solid #F1F5F9">${e.habitantes_estimados || 0}</td><td style="padding:0.75rem;border-bottom:1px solid #F1F5F9">${App.Components.renderBadge(e.estado_estructural)}</td></tr>`).join('')}</tbody>
          </table>`;
        break;
      case 'colapsadas':
        const colap = stats.estructuras.filter(e => e.estado_estructural === 'colapsado' || e.estado_estructural === 'demolido');
        content.innerHTML = `<h3 style="margin-bottom:1rem">Estructuras Colapsadas o Demolidas</h3>
          ${colap.length ? `<table style="width:100%;border-collapse:collapse">
            <thead><tr style="background:#F8FAFC"><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#64748B">ID</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#64748B">Nombre</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#64748B">Ubicación</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#64748B">Familias</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600;text-transform:uppercase;color:#64748B">Estado</th></tr></thead>
            <tbody>${colap.map(e => `<tr><td style="padding:0.75rem;border-bottom:1px solid #F1F5F9"><strong>${e.id}</strong></td><td style="padding:0.75rem;border-bottom:1px solid #F1F5F9">${App.Utils.escapeHtml(e.nombre)}</td><td style="padding:0.75rem;border-bottom:1px solid #F1F5F9">${App.Utils.escapeHtml(e.urbanizacion || '')}, ${App.Utils.escapeHtml(e.sector || '')}</td><td style="padding:0.75rem;border-bottom:1px solid #F1F5F9">${e.cantidad_familias || 0}</td><td style="padding:0.75rem;border-bottom:1px solid #F1F5F9">${App.Components.renderBadge(e.estado_estructural)}</td></tr>`).join('')}</tbody>
          </table>` : '<p>No hay estructuras colapsadas o demolidas registradas</p>'}`;
        break;
      case 'servicios':
        const srvAll = await App.DB.getAll('servicios');
        content.innerHTML = `<h3 style="margin-bottom:1rem">Estado de Servicios Afectados</h3>
          ${srvAll.length ? `<table style="width:100%;border-collapse:collapse">
            <thead><tr style="background:#F8FAFC"><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600">Estructura</th>${App.Config.servicios.map(s => `<th style="text-align:center;padding:0.75rem;font-size:0.75rem;font-weight:600">${s.label}</th>`).join('')}</tr></thead>
            <tbody>${await Promise.all(srvAll.map(async s => {
              const e = await App.DB.getById('estructuras', s.estructura_id);
              return `<tr><td style="padding:0.75rem;border-bottom:1px solid #F1F5F9;font-weight:500">${App.Utils.escapeHtml(e?.nombre || '')}</td>
                ${App.Config.servicios.map(srv => `<td style="text-align:center;padding:0.75rem;border-bottom:1px solid #F1F5F9"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${s[srv.id] === 'operativo' ? '#10B981' : s[srv.id] === 'parcial' ? '#F59E0B' : '#EF4444'}"></span></td>`).join('')}
              </tr>`;
            })).then(r => r.join(''))}</tbody>
          </table>` : '<p>No hay datos de servicios registrados</p>'}`;
        break;
      case 'completo':
        content.innerHTML = `<h3 style="margin-bottom:1rem">Reporte Integral SIGEA</h3>
          <p style="color:#64748B;margin-bottom:1.5rem">Generado el ${App.Utils.formatDate(App.Utils.now())}</p>
          <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">${[
            { label: 'Total Estructuras', value: stats.total, icon: 'Building2', color: '#3B82F6' },
            { label: 'Inspeccionadas', value: stats.inspeccionadas, icon: 'ClipboardCheck', color: '#10B981' },
            { label: 'Pendientes', value: stats.pendientes, icon: 'Clock', color: '#F59E0B' },
            { label: 'Familias Afect.', value: stats.familiasAfectadas, icon: 'Users', color: '#EC4899' },
            { label: 'Colapsadas', value: stats.colapsadas, icon: 'TriangleAlert', color: '#111827' }
          ].map(s => App.Components.renderStatsCard(s)).join('')}</div>
          <h4 style="margin:1.5rem 0 0.75rem;font-weight:600">Distribución de Daños</h4>
          <table style="width:100%;border-collapse:collapse">
            <thead><tr style="background:#F8FAFC"><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600">Estado</th><th style="text-align:left;padding:0.75rem;font-size:0.75rem;font-weight:600">Cantidad</th></tr></thead>
            <tbody>${App.Config.estadosEstructurales.map(es => `<tr><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #F1F5F9;color:${es.color};font-weight:500">${es.label}</td><td style="padding:0.5rem 0.75rem;border-bottom:1px solid #F1F5F9">${stats.porEstado[es.value] || 0}</td></tr>`).join('')}</tbody>
          </table>`;
        break;
    }

    document.getElementById('btnExportPDF')?.addEventListener('click', () => {
      const title = document.getElementById('reportTitle').textContent;
      App.Utils.exportToPDF('reportContent', `reporte_${App.Utils.slugify(title)}`);
    });
    document.getElementById('btnExportCSV')?.addEventListener('click', () => {
      App.Utils.exportToCSV(stats.estructuras, `reporte_estructuras_${App.Utils.now()}`);
    });
    document.getElementById('btnExportJSON')?.addEventListener('click', () => {
      App.Utils.exportToJSON(stats.estructuras, `reporte_estructuras_${App.Utils.now()}`);
    });
    if (window.lucide) lucide.createIcons();
  }
};

/* ============================================================
   VIEW: IMPORT / EXPORT
   ============================================================ */
App.Views.ImportExport = {
  async render() {
    const container = document.getElementById('page-content');
    const stats = await App.DB.getStats();

    container.innerHTML = `
      <div class="page-header">
        <h1>Importar / Exportar Datos</h1>
        <p>Transfiera datos entre el observatorio y sistemas externos</p>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
        <div style="background:#fff;border-radius:12px;border:1px solid #E2E8F0;padding:1.5rem">
          <h2 style="font-size:1.1rem;font-weight:600;color:var(--primary);margin-bottom:1rem">Exportar Datos</h2>
          <p style="font-size:0.85rem;color:#64748B;margin-bottom:1rem">Exporte el inventario completo de estructuras y registros</p>
          <div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-bottom:1.5rem">
            <button class="btn btn-primary" id="exportCSV"><i data-lucide="download" style="width:16px;height:16px"></i> Exportar CSV</button>
            <button class="btn btn-primary" id="exportJSON"><i data-lucide="download" style="width:16px;height:16px"></i> Exportar JSON</button>
            <button class="btn btn-primary" id="exportPDF"><i data-lucide="file-text" style="width:16px;height:16px"></i> Exportar PDF</button>
          </div>
          <div style="background:#F8FAFC;border-radius:8px;padding:1rem">
            <div style="font-size:0.8rem;color:#64748B;margin-bottom:0.5rem">Resumen de datos a exportar:</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.85rem">
              <div>Estructuras: <strong>${stats.total}</strong></div>
              <div>Inspecciones: <strong>${stats.inspecciones.length}</strong></div>
              <div>Seguimientos: <strong>${stats.seguimientos.length}</strong></div>
              <div>Urbanizaciones: <strong>${stats.urbanizaciones}</strong></div>
            </div>
          </div>
        </div>
        <div style="background:#fff;border-radius:12px;border:1px solid #E2E8F0;padding:1.5rem">
          <h2 style="font-size:1.1rem;font-weight:600;color:var(--primary);margin-bottom:1rem">Importar Datos</h2>
          <p style="font-size:0.85rem;color:#64748B;margin-bottom:1rem">Importe estructuras desde archivos CSV o JSON</p>
          <div class="import-zone" id="importZone">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p style="font-weight:600;color:var(--primary)">Arrastre aquí su archivo</p>
            <p style="font-size:0.8rem;color:#94A3B8">CSV o JSON</p>
            <input type="file" id="fileInput" accept=".csv,.json" style="display:none">
          </div>
          <div id="importPreview" style="margin-top:1rem;display:none"></div>
        </div>
      </div>`;

    document.getElementById('exportCSV')?.addEventListener('click', () => App.Utils.exportToCSV(stats.estructuras, `estructuras_${App.Utils.now()}`));
    document.getElementById('exportJSON')?.addEventListener('click', () => App.Utils.exportToJSON(stats.estructuras, `estructuras_${App.Utils.now()}`));
    document.getElementById('exportPDF')?.addEventListener('click', () => {
      const el = document.createElement('div');
      el.innerHTML = `<h1>SIGEA - Gestión de Edificaciones Afectadas</h1><p>Reporte de estructuras - ${App.Utils.formatDate(App.Utils.now())}</p><p style="color:#64748b;margin-bottom:1rem">Guarenas, municipio Plaza - Estado Miranda</p>${App.Components.renderTable({ headers: [{label:'ID'},{label:'Nombre'},{label:'Tipo'},{label:'Urbanización'},{label:'Estado'}], rows: stats.estructuras.map(e => `<tr><td>${e.id}</td><td>${App.Utils.escapeHtml(e.nombre)}</td><td>${App.Utils.getTipoLabel(e.tipo)}</td><td>${App.Utils.escapeHtml(e.urbanizacion || '')}</td><td>${App.Utils.getEstadoLabel(e.estado_estructural)}</td></tr>`) })}`;
      document.body.appendChild(el);
      App.Utils.exportToPDF(el.id || 'temp-report', `export_completo_${App.Utils.now()}`);
      setTimeout(() => el.remove(), 1000);
    });

    const zone = document.getElementById('importZone');
    const fileInput = document.getElementById('fileInput');
    zone.addEventListener('click', () => fileInput.click());
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (e) => { e.preventDefault(); zone.classList.remove('dragover'); if (e.dataTransfer.files.length) this.processFile(e.dataTransfer.files[0]); });
    fileInput.addEventListener('change', (e) => { if (e.target.files.length) this.processFile(e.target.files[0]); });

    if (window.lucide) lucide.createIcons();
  },

  async processFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'json'].includes(ext)) { App.Utils.toast('Formato no soportado. Use CSV o JSON', 'error'); return; }
    try {
      const text = await file.text();
      let data = [];
      if (ext === 'json') {
        data = JSON.parse(text);
        if (!Array.isArray(data)) data = [data];
      } else {
        data = App.Utils.parseCSV(text);
      }
      if (!data.length) { App.Utils.toast('Archivo vacío o formato incorrecto', 'warning'); return; }

      const preview = document.getElementById('importPreview');
      preview.style.display = 'block';
      preview.innerHTML = `
        <div style="background:#F0FDF4;border-radius:8px;padding:1rem;border:1px solid #BBF7D0">
          <p style="font-weight:600;color:#065F46;margin-bottom:0.5rem">${data.length} registro(s) listos para importar</p>
          <div style="max-height:200px;overflow-y:auto;font-size:0.8rem;color:#475569">
            ${data.slice(0, 5).map((r, i) => `<div style="padding:0.25rem 0;border-bottom:1px solid #DCFCE7">${i+1}. ${r.nombre || r.NOMBRE || r.name || 'Registro ' + (i+1)}</div>`).join('')}
            ${data.length > 5 ? `<div style="padding:0.25rem 0;color:#94A3B8">... y ${data.length - 5} más</div>` : ''}
          </div>
          <div style="margin-top:0.75rem;display:flex;gap:0.5rem">
            <button class="btn btn-success btn-sm" id="confirmImport">Confirmar Importación</button>
            <button class="btn btn-secondary btn-sm" id="cancelImport">Cancelar</button>
          </div>
        </div>`;

      document.getElementById('confirmImport')?.addEventListener('click', async () => {
        let count = 0;
        for (const item of data) {
          const est = {
            id: item.id || App.Utils.generateId('EST'),
            nombre: item.nombre || item.NOMBRE || item.name || 'Sin nombre',
            tipo: item.tipo || item.TIPO || 'edificio',
            urbanizacion: item.urbanizacion || item.URBANIZACION || '',
            sector: item.sector || item.SECTOR || '',
            direccion: item.direccion || item.DIRECCION || '',
            estado: item.estado || item.ESTADO || 'Miranda',
            municipio: item.municipio || item.MUNICIPIO || 'Guarenas',
            latitud: parseFloat(item.latitud || item.LATITUD || 0),
            longitud: parseFloat(item.longitud || item.LONGITUD || 0),
            anio_construccion: parseInt(item.anio_construccion || item.ANIO_CONSTRUCCION || 0),
            cantidad_pisos: parseInt(item.cantidad_pisos || item.CANTIDAD_PISOS || 0),
            cantidad_apartamentos: parseInt(item.cantidad_apartamentos || item.CANTIDAD_APARTAMENTOS || 0),
            cantidad_locales: parseInt(item.cantidad_locales || item.CANTIDAD_LOCALES || 0),
            cantidad_familias: parseInt(item.cantidad_familias || item.CANTIDAD_FAMILIAS || 0),
            habitantes_estimados: parseInt(item.habitantes_estimados || item.HABITANTES_ESTIMADOS || 0),
            foto_principal: '',
            estado_estructural: item.estado_estructural || item.ESTADO_ESTRUCTURAL || 'sin_inspeccion',
            riesgo_colapso: false,
            fecha_registro: App.Utils.now(),
            ultima_inspeccion: '',
            atencion_prioritaria: false
          };
          const exists = await App.DB.getById('estructuras', est.id);
          if (exists) { await App.DB.update('estructuras', est); } else { await App.DB.create('estructuras', est); }
          count++;
        }
        App.Utils.toast(`${count} estructura(s) importada(s) exitosamente`, 'success');
        preview.style.display = 'none';
        App.Router.navigate('#estructuras');
      });
      document.getElementById('cancelImport')?.addEventListener('click', () => { preview.style.display = 'none'; });
    } catch (e) {
      App.Utils.toast('Error al procesar el archivo: ' + e.message, 'error');
    }
  }
};

/* ============================================================
   APP INIT
   ============================================================ */
App.init = async function() {
  const ok = await App.DB.init();
  if (!ok) {
    document.getElementById('page-content').innerHTML = '<div class="table-empty"><p>Error al inicializar la base de datos. Verifique que su navegador soporte IndexedDB.</p></div>';
    return;
  }
  App.Components.renderSidebar();
  App.Router.start();

  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });
  document.getElementById('globalSearch')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      App.Router.navigate('#buscador');
      setTimeout(() => {
        const el = document.getElementById('searchTerm');
        if (el) el.value = e.target.value.trim();
        el?.dispatchEvent(new Event('input'));
      }, 100);
    }
  });
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768 && sidebar?.classList.contains('open') && !sidebar.contains(e.target) && !document.getElementById('menuToggle')?.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('sw.js');
    } catch (e) {
      console.log('SW registration skipped');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
