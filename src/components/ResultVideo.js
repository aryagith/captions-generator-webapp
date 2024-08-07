import { transcriptionItemsToSrt } from "@/libs/awsTranscriptionHelpers";
import SparklesIcon from "./SparklesIcon";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { useState, useRef, useEffect } from "react";
import roboto from './../fonts/Roboto-Regular.ttf';
import robotoBold from './../fonts/Roboto-Bold.ttf';


export default function ResultVideo({fileName, transcriptionItems}){
    const videoUrl = "https://captioner-video.s3.ca-central-1.amazonaws.com/" + fileName;
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);

    useEffect(()=>{
        videoRef.current.src = videoUrl;
    }, []);

    // const load = async () => {
    //     const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    //     const ffmpeg = ffmpegRef.current;
        
    //     await ffmpeg.load({
    //         coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    //         wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    //     });
    //     setLoaded(true);
    // }
    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        const ffmpeg = ffmpegRef.current;
        
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        
        setLoaded(true);
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.load();
        const srt = transcriptionItemsToSrt(transcriptionItems);
        await ffmpeg.writeFile('./tmp/roboto-regular.ttf', await fetchFile(roboto))
        await ffmpeg.writeFile('./tmp/roboto-bold.ttf', await fetchFile(robotoBold))
        console.log(srt);
        await ffmpeg.writeFile(fileName, await fetchFile(videoUrl));
        await ffmpeg.writeFile('subs.srt', srt);
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        await ffmpeg.exec([
            '-i', fileName,
            '-preset','ultrafast',
            '-vf',`subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto,FontSize=30,MarginV=40'`,
            'output.mp4'
        ]);
        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    }

    // const transcode = async () => {  
    //     const ffmpeg = ffmpegRef.current;
    //     const srt = transcriptionItemsToSrt(transcriptionItems);
    //     await load();
    //     await ffmpeg.writeFile(fileName, await fetchFile(videoUrl));
    //     await ffmpeg.writeFile('subs.srt', srt)
    //     await ffmpeg.exec([
    //         '-i', fileName,
    //         '-vf', 'subtitles=subs.srt',
    //         'output.mp4']);
    //     const data = await ffmpeg.readFile('output.mp4');
    //     videoRef.current.src =
    //         URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    // }

return (
    <>
    <div className="relative mb-4">
        <button 
        onClick={transcode}
        className="bg-black text-white py-2 px-6 rounded-full inline-flex gap-2 border-2 border-blue-700/50 cursor-pointer">
            <SparklesIcon />
            <span>Apply captions</span>
        </button>
    </div><div className="rounded-lg overflow-hidden">
            <video 
            ref={videoRef}
            controls
            ></video>
        </div>
    </>
    );
}