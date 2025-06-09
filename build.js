const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/server.ts'],   // titik masuk file utama kamu
  bundle: true,                    // gabungkan semua dependency jadi 1 file
  minify: true,                   // minify hasil bundling
  sourcemap: true,                // buat sourcemap untuk debugging
  outfile: 'dist/bundle.js',      // file output hasil bundling
  platform: 'node',            // target environment (browser/node)
  target: ['es2020'],             // target JS version
  define: {                       // jika mau set global constants (misal env vars)
    'process.env.NODE_ENV': '"production"',
  },
}).catch(() => process.exit(1));
