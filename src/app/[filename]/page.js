'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { clearTranscriptionItems } from "@/libs/awsTranscriptionHelpers";
import TranscriptionEditor from "@/components/TranscriptionEditor";
import ResultVideo from "@/components/ResultVideo";
import Link from 'next/link';

export default function FilePage({params}){
    const filename = params.filename;
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isFetchingInfo, setIsFetchingInfo] = useState(true);
    const [error, setError] = useState('');
    const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([]);
    useEffect(() => {
        let cancelled = false;
        let timeout;
        setError('');
        setIsTranscribing(false);
        setIsFetchingInfo(true);
        async function getTranscription() {
            try {
                const response = await axios.get('/api/transcribe', { params: { filename } });
                if (cancelled) return;
                const { status, transcription, failureReason } = response.data;
                if (status === 'IN_PROGRESS' || status === 'QUEUED') {
                    setIsTranscribing(true);
                    timeout = setTimeout(getTranscription, 3000);
                } else if (status === 'COMPLETED' && transcription?.results?.items) {
                    setIsTranscribing(false);
                    setAwsTranscriptionItems(clearTranscriptionItems(transcription.results.items));
                } else {
                    throw new Error(failureReason || 'Transcription failed. Please try uploading again.');
                }
            } catch (err) {
                if (cancelled) return;
                setIsTranscribing(false);
                setError(err.response?.data?.error || err.message || 'Unable to fetch transcription.');
            } finally {
                if (!cancelled) setIsFetchingInfo(false);
            }
        }
        getTranscription();
        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [filename]);
    
    
    
    if (error || isTranscribing || isFetchingInfo) {
        return <section className="status-panel glass-panel" aria-live="polite" aria-busy={!error}>
            {error ? <span className="eyebrow">LET’S TRY THAT AGAIN</span> : <div className="spinner" aria-hidden="true" />}
            <h1>{error ? 'A small interruption.' : isTranscribing ? 'Finding every word.' : 'Getting things ready.'}</h1>
            <p className={error ? 'error-message' : 'text-sm text-[var(--ink-muted)]'} role={error ? 'alert' : undefined}>
                {error || (isTranscribing ? 'Transcribing your video. You’ll be able to edit the captions in a moment.' : 'Fetching information about your video…')}
            </p>
            <p className="eyebrow mt-6">{error ? 'Your original video is unchanged.' : 'KEEP THIS TAB OPEN. WE’LL TAKE IT FROM HERE.'}</p>
            {error && <Link href="/" className="cta-pill primary-button mt-6">Choose another video ↗</Link>}
        </section>;
    }

    return(
    <div className="film-fade">
    <div className="workspace-header">
        <div><p className="eyebrow"><span className="status-dot" /> YOUR CAPTION STUDIO</p>
            <h1 className="workspace-title">The finishing touch.</h1>
            <p className="text-sm text-[var(--ink-muted)]">Check the words, set your style, and make it yours.</p>
        </div>
        <Link href="/" className="secondary-button">＋ New video</Link>
    </div>
    <div className="workspace-grid">
    <section className="workspace-panel glass-panel">
        <div className="panel-heading"><div><h2>Video preview</h2><p>Your video, with a little more clarity.</p></div><span className="small-badge">{filename.split('.').pop().toUpperCase()}</span></div>
        <ResultVideo fileName={filename} transcriptionItems={awsTranscriptionItems} />
    </section>
    <section className="workspace-panel glass-panel">
        <div className="panel-heading"><div><h2>Transcript</h2><p>Edit any word or timing below. Times are in seconds.</p></div><span className="small-badge">{awsTranscriptionItems.filter(Boolean).length} words</span></div>
        <TranscriptionEditor 
        awsTranscriptionItems={awsTranscriptionItems}
        setAwsTranscriptionItems={setAwsTranscriptionItems}
         />
    </section>
    </div>
    </div>
    );
}
