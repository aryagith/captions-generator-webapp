'use client';

import axios from 'axios';
import UploadIcon from './UploadIcon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  async function upload(ev) {
    ev.preventDefault();
    const files = ev.target.files;
    if (files.length > 0) {
      const file = files[0];
      setError('');
      setProgress(0);
      setIsUploading(true);
      try {
        const res = await axios.postForm('/api/upload', { file }, {
          onUploadProgress: ({ loaded, total }) => {
            if (total) setProgress(Math.round(loaded / total * 100));
          },
        });
        const newName = res.data.newName;
        if (!newName) throw new Error('The upload did not return a video filename.');
        router.push('/' + encodeURIComponent(newName));
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Upload failed. Please try again.');
      } finally {
        setIsUploading(false);
        ev.target.value = '';
      }
    }
  }

  return (
    <div>
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6" role="status" aria-live="polite">
          <div className="glass-panel rounded-3xl px-8 py-10 text-center max-w-sm w-full shadow-2xl">
            <div className="spinner mb-6" aria-hidden="true" />
            <h2 className="text-2xl mb-3 font-semibold text-[var(--ink)]">
              {progress === 100 ? 'Almost there.' : 'Your story is on its way.'}
            </h2>
            <p className="text-sm text-[var(--ink-muted)] mb-6">{progress === 100 ? 'Saving your video and opening the studio…' : `Uploading your video · ${progress}%`}</p>
            <progress max="100" value={progress} aria-label="Video upload progress" />
          </div>
        </div>
      )}
      <label className="cta-pill primary-button upload-control cursor-pointer">
        <div className="inline-flex items-center gap-3">
          <UploadIcon />
          <span>Choose your video</span><span aria-hidden="true">↗</span>
        </div>
        <input onChange={upload} type="file" className="sr-only" aria-label="Choose your video" accept="video/*" disabled={isUploading} />
      </label>
      <p className="mt-3 text-[10px] text-[var(--ink-muted)]">Video files · 4.5 MB maximum</p>
      {error && <p role="alert" className="mt-3 error-message">{error}</p>}
    </div>
  );
}
