(() => {
  const STORAGE_KEY = 'hsm_ai_worker_url';

  function normalizeBase(value) {
    return String(value || '').trim().replace(/\/+$/, '');
  }

  window.hsmGetApiBase = function () {
    const saved = normalizeBase(localStorage.getItem(STORAGE_KEY));
    const configured = normalizeBase(window.HSM_DEFAULT_API_BASE || '');
    return saved || configured;
  };

  window.hsmSetApiBase = function (value) {
    const base = normalizeBase(value);
    if (!base) {
      localStorage.removeItem(STORAGE_KEY);
      return '';
    }
    let parsed;
    try { parsed = new URL(base); } catch { throw new Error('URL Worker tidak valid.'); }
    if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
      throw new Error('Gunakan URL HTTPS untuk Worker.');
    }
    localStorage.setItem(STORAGE_KEY, base);
    return base;
  };

  window.hsmApiUrl = function (path) {
    const base = window.hsmGetApiBase();
    if (!base) {
      throw new Error('Cloudflare Worker belum dikonfigurasi. Buka menu Pengaturan Mesin.');
    }
    return base + (String(path || '').startsWith('/') ? path : '/' + path);
  };
})();
