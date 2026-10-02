import { transcriptionItemsToSrt } from '@/libs/awsTranscriptionHelpers';
import SparklesIcon from './SparklesIcon';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { useState, useRef, useEffect } from 'react';
import roboto from '../fonts/Roboto-Regular.ttf';
import robotoCondensed from '../fonts/RobotoCondensed-Bold.ttf';
import lora from '../fonts/Lora.ttf';
import spaceMono from '../fonts/SpaceMono-Regular.ttf';

const fonts = [
  { family: 'Roboto', label: 'Roboto · Clean', file: roboto, bold: false },
  { family: 'Roboto Condensed', label: 'Roboto Condensed · Bold', file: robotoCondensed, bold: true },
  { family: 'Lora', label: 'Lora · Serif', file: lora, bold: false },
  { family: 'Space Mono', label: 'Space Mono · Monospace', file: spaceMono, bold: false },
];

export default function ResultVideo({ fileName, transcriptionItems }) {
  const videoUrl = 'https://captioner-video.s3.ca-central-1.amazonaws.com/' + fileName;
  const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const ffmpegRef = useRef(null);
  const font = fonts.find(option => option.family === fontFamily) || fonts[0];

  useEffect(() => () => { if (outputUrl) URL.revokeObjectURL(outputUrl); }, [outputUrl]);
  useEffect(() => () => { ffmpegRef.current?.terminate(); }, []);

  function rgbToFFmpegColor(rgb) {
    return '&H' + rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3) + '&';
  }

  async function transcode() {
    if (isExporting) return;
    setIsExporting(true);
    setError('');
    setProgress(0);
    setOutputUrl('');
    try {
      if (!ffmpegRef.current) {
        ffmpegRef.current = new FFmpeg();
        ffmpegRef.current.on('progress', ({ progress: value }) => {
          setProgress(Math.max(0, Math.min(99, Math.round(value * 100))));
        });
      }
      const ffmpeg = ffmpegRef.current;
      if (!ffmpeg.loaded) {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
      }
      await ffmpeg.writeFile(`/tmp/${font.family}.ttf`, await fetchFile(font.file));
      await ffmpeg.writeFile(fileName, await fetchFile(videoUrl));
      await ffmpeg.writeFile('subs.srt', transcriptionItemsToSrt(transcriptionItems));
      const exitCode = await ffmpeg.exec([
        '-y', '-i', fileName, '-preset', 'ultrafast',
        '-vf', `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=${font.family},Bold=${font.bold ? -1 : 0},FontSize=30,MarginV=40,PrimaryColour=${rgbToFFmpegColor(primaryColor)},OutlineColour=${rgbToFFmpegColor(outlineColor)}'`,
        'output.mp4',
      ]);
      if (exitCode !== 0) throw new Error('The video could not be exported. Please check your caption timings and try again.');
      const data = await ffmpeg.readFile('output.mp4');
      setOutputUrl(URL.createObjectURL(new Blob([data], { type: 'video/mp4' })));
      setProgress(100);
    } catch (err) {
      setError(err.message || 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="p-5">
      <video src={outputUrl || videoUrl} controls playsInline preload="metadata" className="preview-video" aria-label="Video preview" />
      <fieldset className="color-controls" disabled={isExporting}>
        <legend className="sr-only">Caption colors</legend>
        <label className="color-control">
          <input type="color" value={primaryColor} className="color-input" onChange={ev => setPrimaryColor(ev.target.value)} />
          <span>Text color</span>
        </label>
        <label className="color-control">
          <input type="color" value={outlineColor} className="color-input" onChange={ev => setOutlineColor(ev.target.value)} />
          <span>Outline</span>
        </label>
      </fieldset>
      <label className="block mb-5 text-xs text-[var(--ink-muted)]">
        Caption font
        <select value={fontFamily} onChange={ev => setFontFamily(ev.target.value)} disabled={isExporting} className="editor-input mt-2 border-[var(--glass-border)]" aria-label="Caption font">
          {fonts.map(font => <option key={font.family} value={font.family}>{font.label}</option>)}
        </select>
        <span className="block mt-3 text-base text-[var(--ink)]" style={{ fontFamily: font.family, fontWeight: font.bold ? 700 : 400 }}>Make every word count.</span>
      </label>
      <button onClick={transcode} disabled={isExporting || !transcriptionItems.some(Boolean)} className="cta-pill primary-button w-full">
        <SparklesIcon /><span>{isExporting ? (progress ? `Rendering · ${progress}%` : 'Preparing your export…') : 'Export captioned video'}</span>
      </button>
      <div aria-live="polite" className="mt-4">
        {isExporting && <progress max="100" value={progress || undefined} aria-label="Video export progress" />}
        {error && <p role="alert" className="error-message">{error}</p>}
        {outputUrl && <a href={outputUrl} download={'captioned-' + fileName} className="secondary-button w-full">Download your video ↓</a>}
        <p className="mt-3 text-center text-[10px] leading-relaxed text-[var(--ink-muted)]">
          {outputUrl ? 'Video ready. Made a change? Export again to update your captions.' : 'Your original stays untouched. Font and colors appear in the exported video.'}
        </p>
      </div>
    </div>
  );
}
