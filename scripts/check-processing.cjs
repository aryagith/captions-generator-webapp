// Run with: node scripts/check-processing.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { transformSync } = require('next/dist/build/swc');
const React = require('react');
const { renderToString } = require('react-dom/server');

const root = path.resolve(__dirname, '..');
const cache = new Map();

// Compile the existing JSX for Node; fonts are URLs supplied by webpack.
function load(filename, overrides = {}) {
  if (cache.has(filename) && !Object.keys(overrides).length) return cache.get(filename).exports;
  const mod = new Module(filename, module);
  cache.set(filename, mod);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = mod.require.bind(mod);
  mod.require = (id) => {
    if (Object.hasOwn(overrides, id)) return overrides[id];
    if (id.endsWith('.ttf')) return '/font.ttf';
    if (id.startsWith('@/') || id.startsWith('.')) {
      let resolved = id.startsWith('@/')
        ? path.join(root, 'src', id.slice(2))
        : path.resolve(path.dirname(filename), id);
      if (!path.extname(resolved)) resolved += '.js';
      return load(resolved);
    }
    return originalRequire(id);
  };
  const { code } = transformSync(fs.readFileSync(filename, 'utf8'), {
    filename,
    jsc: { parser: { syntax: 'ecmascript', jsx: true }, target: 'es2022',
      transform: { react: { runtime: 'automatic' } } },
    module: { type: 'commonjs' },
  });
  mod._compile(code, filename);
  return mod.exports;
}

const ResultVideo = load(path.join(root, 'src/components/ResultVideo.js')).default;
assert.match(renderToString(React.createElement(ResultVideo, {
  fileName: 'test.mp4', transcriptionItems: [],
})), /<video/); // This used to throw: ffmpeg.wasm does not support nodejs.

const FilePage = load(path.join(root, 'src/app/[filename]/page.js')).default;
assert.match(renderToString(React.createElement(FilePage, {
  params: { filename: 'test.mp4' },
})), /Fetching information/);

const ThemeToggle = load(path.join(root, 'src/components/ThemeToggle.js')).default;
const originalUseContext = React.useContext;
try {
  for (const resolved of ['light', 'dark']) {
    let selected;
    React.useContext = () => ({ theme: 'system', resolved, setTheme: value => { selected = value; } });
    const toggle = ThemeToggle();
    const opposite = resolved === 'light' ? 'dark' : 'light';
    assert.equal(toggle.props['aria-label'], `Switch to ${opposite} mode`);
    toggle.props.onClick();
    assert.equal(selected, opposite, 'Every click must visibly change the theme, including system mode.');
  }
} finally {
  React.useContext = originalUseContext;
}

async function checkPolling() {
  const axios = require('axios');
  const originals = { useState: React.useState, useEffect: React.useEffect,
    get: axios.get, setTimeout: global.setTimeout };
  try {
    for (const status of ['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'NETWORK_ERROR']) {
      const states = [];
      let effect;
      let scheduled = false;
      React.useState = (initial) => {
        const index = states.push(initial) - 1;
        return [initial, value => { states[index] = value; }];
      };
      React.useEffect = (callback) => { effect = callback; };
      global.setTimeout = () => { scheduled = true; };
      axios.get = async () => {
        if (status === 'NETWORK_ERROR') throw new Error('Network unavailable');
        return { data: { status, failureReason: status === 'FAILED' ? 'Invalid video' : undefined,
          transcription: status === 'COMPLETED' ? { results: { items: [] } } : undefined } };
      };
      FilePage({ params: { filename: 'test.mp4' } });
      const cleanup = effect();
      await new Promise(resolve => setImmediate(resolve));
      assert.equal(states[1], false, `${status} must finish fetching`);
      assert.equal(scheduled, ['QUEUED', 'IN_PROGRESS'].includes(status));
      assert.equal(states[0], scheduled, `${status} processing state`);
      assert.equal(states[2], status === 'FAILED' ? 'Invalid video'
        : status === 'NETWORK_ERROR' ? 'Network unavailable' : '');
      cleanup();
    }
  } finally {
    React.useState = originals.useState;
    React.useEffect = originals.useEffect;
    axios.get = originals.get;
    global.setTimeout = originals.setTimeout;
  }
}
async function checkFonts() {
  const originals = { useState: React.useState, useRef: React.useRef, useEffect: React.useEffect };
  try {
    for (const family of ['Roboto']) {
      const states = [];
      const written = [];
      let command;
      class FFmpeg {
        loaded = true;
        on() {}
        async writeFile(filename) { written.push(filename); }
        async exec(args) { command = args; return 0; }
        async readFile() { return new Uint8Array([1]); }
      }
      const Video = load(path.join(root, 'src/components/ResultVideo.js'), {
        '@ffmpeg/ffmpeg': { FFmpeg },
        '@ffmpeg/util': { fetchFile: async () => new Uint8Array([1]) },
      }).default;
      React.useState = initial => {
        const index = states.length;
        states.push(initial);
        return [states[index], value => { states[index] = value; }];
      };
      React.useRef = () => ({ current: null });
      React.useEffect = () => {};
      const element = Video({ fileName: 'test.mp4', transcriptionItems: [
        { start_time: '0', end_time: '1', content: 'Hello' },
      ] });
      await element.props.children.find(child => child?.type === 'button').props.onClick();
      assert.ok(written.includes(`/tmp/${family}.ttf`), `${family} must be loaded for export`);
      assert.match(command[command.indexOf('-vf') + 1], new RegExp(`Fontname=${family},Bold=${family === 'Roboto Condensed' ? -1 : 0},`));
      assert.equal(states[4], '', `${family} export must not report an error`);
      assert.equal(states[2], false, 'Export button must be re-enabled');
      assert.ok(states[5].startsWith('blob:'));
      URL.revokeObjectURL(states[5]);
    }
  } finally {
    Object.assign(React, originals);
  }
}

checkFonts().then(checkPolling).then(() => {
  console.log('Caption font exports, theme switching, server rendering, and transcription checks passed.');
}).catch(error => { console.error(error); process.exitCode = 1; });
