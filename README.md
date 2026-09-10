# HSM AI — GitHub Pages + Cloudflare Worker

Versi ini sudah dipindahkan dari arsitektur **InfinityFree/PHP** menjadi:

- **GitHub Pages**: tampilan `index.html`, aset, PWA, riwayat browser.
- **Cloudflare Worker**: chat Gemini/Cloudflare AI, generate/edit gambar, pencarian dan proxy gambar.
- **Tanpa PHP, `.htaccess`, setup.php, atau MySQL.** Riwayat chat tetap memakai `localStorage` seperti versi lama.

> Penting: API key/token **jangan** dimasukkan ke repository GitHub atau `config.js`. Secret hanya disimpan di Cloudflare Worker.

## 1. Upload ke GitHub

Buat repository baru, lalu upload seluruh isi folder ini. Branch utama sebaiknya bernama `main`.

Setelah push, buka **GitHub → Settings → Pages → Source** dan pilih **GitHub Actions**. Workflow `.github/workflows/pages.yml` akan menerbitkan halaman secara otomatis.

Alamat halaman biasanya berbentuk:

`https://USERNAME.github.io/NAMA-REPO/`

## 2. Deploy API Worker

Di komputer yang memiliki Node.js:

```bash
cd worker
npm install
npx wrangler login
```

Masukkan secret satu per satu:

```bash
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put CF_ACCOUNT_ID
npx wrangler secret put CF_API_TOKEN
```

- `GEMINI_API_KEY`: key Google Gemini.
- `CF_ACCOUNT_ID`: Cloudflare Account ID.
- `CF_API_TOKEN`: token Cloudflare yang boleh menggunakan Workers AI.

Lalu deploy:

```bash
npm run deploy
```

Wrangler akan menampilkan URL Worker, misalnya:

`https://hsm-ai-api.USERNAME.workers.dev`

## 3. Sambungkan GitHub Pages ke Worker

Buka HSM AI dari GitHub Pages → **Pengaturan Mesin** → masukkan URL Worker → **Simpan & Tes**.

URL disimpan di browser, bukan di GitHub. Kalau ingin membuat URL Worker menjadi default untuk semua perangkat, isi `config.js`:

```js
window.HSM_DEFAULT_API_BASE = "https://hsm-ai-api.USERNAME.workers.dev";
```

Ini aman karena URL Worker bukan secret.

## 4. Batasi Worker hanya untuk GitHub Pages Anda

Setelah URL GitHub Pages sudah diketahui, edit `worker/wrangler.toml`:

```toml
ALLOWED_ORIGIN = "https://USERNAME.github.io"
```

Jika memakai custom domain, gunakan origin domain tersebut. Kemudian deploy ulang:

```bash
cd worker
npm run deploy
```

Catatan: untuk GitHub project pages, browser tetap mengirim origin `https://USERNAME.github.io` (tanpa path repository).

## File lama yang sengaja tidak dibawa

File PHP dari InfinityFree seperti `api.php`, `setup.php`, `database.php`, `config.local.php`, `image_generate.php`, `image_edit.php`, `.htaccess`, dan file diagnosis tidak lagi diperlukan. Secret lama tidak disalin ke paket GitHub.

## Endpoint Worker

- `GET /health`
- `POST /api`
- `POST /image-search`
- `POST /image-proxy`
- `POST /image-generate`
- `POST /image-edit`

## Jika chat bekerja tetapi gambar gagal

Pastikan `CF_ACCOUNT_ID` dan `CF_API_TOKEN` benar serta akun Cloudflare memiliki akses Workers AI. Model default dapat diubah di `worker/wrangler.toml` tanpa mengubah frontend.

## Keamanan

Karena paket InfinityFree lama berisi `config.local.php`, jangan upload file tersebut ke GitHub. Jika key/token pernah dibagikan atau tersimpan di tempat publik, rotasi key/token tersebut sebelum memakai versi ini.
