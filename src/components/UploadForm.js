'use client';

import axios from 'axios';
import UploadIcon from './UploadIcon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  async function upload(ev) {
    ev.preventDefault();
    const files = ev.target.files;
    if (files.length > 0) {
      const file = files[0];
      setIsUploading(true);
      const res = await axios.postForm('/api/upload', {
        file,
      });
      setIsUploading(false);
      const newName = res.data.newName;
      router.push('/' + newName);
    }
  }

  return (
    <>
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm text-[var(--cream)] flex items-center justify-center p-6">
          <div className="glass-panel rounded-3xl px-8 py-10 text-center max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl sm:text-3xl mb-2 font-semibold text-[var(--ink)]">
              Uploading...
            </h2>
            <p className="text-sm text-[var(--ink-muted)]">Please wait</p>
          </div>
        </div>
      )}
      <label className="cta-pill py-3 px-7 rounded-full inline-flex flex-col gap-0.5 cursor-pointer border border-transparent">
        <div className="inline-flex items-center gap-2 font-bold text-xs tracking-[0.08em] uppercase">
          <UploadIcon />
          <span>Choose file</span>
        </div>
        <span className="text-[10px] font-medium opacity-55 normal-case tracking-normal">
          4.5 MB maximum
        </span>
        <input onChange={upload} type="file" className="hidden" accept="video/*" />
      </label>
    </>
  );
}
