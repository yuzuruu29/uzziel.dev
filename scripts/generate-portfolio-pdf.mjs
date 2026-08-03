#!/usr/bin/env node
/**
 * generate-portfolio-pdf.mjs
 *
 * Generates a PDF version of the portfolio using the pre-built HTML page at
 * dist/portfolio-pdf/index.html and the system Google Chrome executable.
 *
 * Usage:
 *   node scripts/generate-portfolio-pdf.mjs
 */

import { chromium } from 'playwright';
import { stat } from 'node:fs/promises';
import { existsSync, createReadStream } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import http from 'node:http';
import path from 'node:path';
import { promises as fsp } from 'node:fs';

const HTML_INPUT_PATH = '/mnt/c/Portfolio/dist/portfolio-pdf/index.html';
const PDF_OUTPUT_PATH = '/mnt/c/Portfolio/Uzziel_Malolos_Portfolio.pdf';

// Absolute paths like /covers/foo.svg in the built HTML only resolve correctly
// over HTTP, so we serve dist/ locally during PDF generation.
const DIST_ROOT = '/mnt/c/Portfolio/dist';
const STATIC_SERVER_HOST = '127.0.0.1';
const STATIC_SERVER_PREFERRED_PORT = 9876;

// Convert a WSL/Linux path (e.g. /mnt/c/Portfolio/...) to its Windows
// equivalent when running under Windows Node, where the leading /mnt/<drive>
// is just a drive-rooted path (C:\Portfolio\...). Falls back to the input
// unchanged for native Linux Node invocations.
function toNativePath(p) {
  if (process.platform !== 'win32') return p;
  const m = /^\/mnt\/([a-zA-Z])\/(.*)$/.exec(p);
  if (!m) return p;
  return `${m[1].toUpperCase()}:\\${m[2].replace(/\//g, '\\')}`;
}

// Preferred Chrome executable (per spec). The list below is consulted as a
// fallback when running under Windows Node inside WSL, where /usr/bin/* paths
// are not addressable from the Win32 process model.
const CHROME_CANDIDATE_PATHS = [
  '/usr/bin/google-chrome',
  '/opt/google/chrome/google-chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];

/**
 * Pick the first Chrome executable path that actually exists on disk so the
 * script works under both Linux Node and Windows-Node-on-WSL invocations.
 */
function resolveChromeExecutablePath() {
  for (const candidate of CHROME_CANDIDATE_PATHS) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  // Fall back to the spec's preferred path so Playwright produces a clear
  // "executable doesn't exist" error rather than a silent failure.
  return CHROME_CANDIDATE_PATHS[0];
}

/**
 * MIME type lookup for the static-file server. Defaults to application/octet-stream.
 */
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

function mimeFor(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

/**
 * Start a tiny static-file server that serves files from `root` (an absolute
 * directory path). Returns the bound port and a close function.
 *
 * Resolves paths safely (no directory traversal outside `root`) and streams
 * files via fs.createReadStream when possible.
 */
function startStaticServer(root) {
  const resolvedRoot = path.resolve(root);

  const server = http.createServer(async (req, res) => {
    try {
      const reqUrl = new URL(req.url || '/', `http://${STATIC_SERVER_HOST}`);
      let decodedPath;
      try {
        decodedPath = decodeURIComponent(reqUrl.pathname);
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
        return;
      }

      const targetPath = path.normalize(path.join(resolvedRoot, decodedPath));
      if (!targetPath.startsWith(resolvedRoot + path.sep) && targetPath !== resolvedRoot) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
      }

      let statInfo;
      try {
        statInfo = await fsp.stat(targetPath);
      } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }

      let servePath = targetPath;
      if (statInfo.isDirectory()) {
        // Serve a trailing-slash directory as index.html if present,
        // otherwise return 404 (we don't generate listings).
        const indexCandidate = path.join(targetPath, 'index.html');
        try {
          const idxStat = await fsp.stat(indexCandidate);
          if (idxStat.isFile()) {
            servePath = indexCandidate;
            statInfo = idxStat;
          }
        } catch {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
          return;
        }
      }

      if (!statInfo.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }

      res.writeHead(200, {
        'Content-Type': mimeFor(servePath),
        'Content-Length': statInfo.size,
        'Cache-Control': 'no-store',
      });
      const stream = createReadStream(servePath);
      stream.on('error', () => {
        res.destroy();
      });
      stream.pipe(res);
    } catch (err) {
      console.error('[pdf] static server error:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
      }
      res.end('Internal Server Error');
    }
  });

  return new Promise((resolve, reject) => {
    const onError = (err) => {
      server.removeListener('listening', onListening);
      reject(err);
    };
    const onListening = () => {
      server.removeListener('error', onError);
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : STATIC_SERVER_PREFERRED_PORT;
      console.log(`[pdf] Static server serving ${resolvedRoot} at http://${STATIC_SERVER_HOST}:${port}`);
      resolve({
        port,
        close: () =>
          new Promise((closeResolve) => {
            server.close(() => closeResolve());
            // Force-close any keep-alive connections so close() resolves promptly.
            server.closeAllConnections && server.closeAllConnections();
          }),
      });
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(STATIC_SERVER_PREFERRED_PORT, STATIC_SERVER_HOST);
  });
}

const PAGE_FORMAT = 'A4';
const PAGE_MARGIN = {
  top: '16mm',
  right: '16mm',
  bottom: '16mm',
  left: '16mm',
};

/**
 * Launch headless Chrome via Playwright, render the pre-built portfolio HTML,
 * and export it as a PDF.
 *
 * @returns {Promise<{ outputPath: string, sizeBytes: number }>}
 */
export async function generatePDF() {
  const chromeExecutablePath = resolveChromeExecutablePath();
  console.log(`[pdf] Launching Chromium (${chromeExecutablePath})...`);
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromeExecutablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Serve dist/ over HTTP so absolute asset paths in the built HTML
  // (e.g. /covers/foo.svg, /work/.../*.png) resolve correctly. Convert the
  // WSL/Linux path to the host-native path first so Windows Node can read it.
  const staticServer = await startStaticServer(toNativePath(DIST_ROOT));

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Use the print media type so any @page / @media print rules are applied.
    await page.emulateMedia({ media: 'print' });

    const pageUrl = `http://${STATIC_SERVER_HOST}:${staticServer.port}/portfolio-pdf/`;
    console.log(`[pdf] Navigating to ${pageUrl}`);
    await page.goto(pageUrl, { waitUntil: 'load' });

    // Wait for any remaining network requests (fonts, images, etc.) to settle.
    await page.waitForLoadState('networkidle');

    // Small extra delay so web fonts have a chance to be ready before printing.
    await page.evaluate(async () => {
      if (document.fonts && typeof document.fonts.ready === 'object') {
        try {
          await document.fonts.ready;
        } catch {
          /* ignore */
        }
      }
    });
    await page.waitForTimeout(500);

    console.log(`[pdf] Writing PDF to ${PDF_OUTPUT_PATH}`);
    await page.pdf({
      path: toNativePath(PDF_OUTPUT_PATH),
      format: PAGE_FORMAT,
      printBackground: true,
      margin: PAGE_MARGIN,
    });
  } finally {
    await browser.close();
    await staticServer.close();
  }

  const stats = await stat(toNativePath(PDF_OUTPUT_PATH));
  console.log(`[pdf] Done: ${PDF_OUTPUT_PATH} (${stats.size} bytes)`);
  return { outputPath: PDF_OUTPUT_PATH, sizeBytes: stats.size };
}

// Run when invoked directly (e.g. `node scripts/generate-portfolio-pdf.mjs`).
// Compare absolute paths so this works regardless of how Node reports argv[1]
// (e.g. Windows Node invoked from WSL may use backslashes / different casing).
const selfPath = fileURLToPath(import.meta.url);
const isDirectInvocation =
  process.argv[1] === selfPath ||
  process.argv[1] === pathToFileURL(selfPath).href;

if (isDirectInvocation) {
  generatePDF().catch((err) => {
    console.error('[pdf] Failed to generate PDF:', err);
    process.exit(1);
  });
}
