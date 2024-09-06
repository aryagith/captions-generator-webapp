import { transcriptionItemsToSrt } from "@/libs/awsTranscriptionHelpers";
import SparklesIcon from "./SparklesIcon";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { useState, useRef, useEffect } from "react";
import roboto from './../fonts/Roboto-Regular.ttf';
import robotoBold from './../fonts/Roboto-Bold.ttf';
import OptionsIcon from "./OptionsIcon";


export default function ResultVideo({fileName, transcriptionItems}){
    const videoUrl = "https://captioner-video.s3.ca-central-1.amazonaws.com/" + fileName;
    const [loaded, setLoaded] = useState(false);
    const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
    const [outlineColor, setOutlineColor] = useState('#000000');
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);

    function rgbToFFmpegColor(rgb){
        const bgr =  rgb.slice(5,7)+ rgb.slice(3,5) + rgb.slice(1,3);
        return '&H' + bgr + '&';
    }

    useEffect(()=>{
        videoRef.current.src = videoUrl;
    }, );

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
            '-vf',`subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto,FontSize=30,MarginV=40,PrimaryColour=${rgbToFFmpegColor(primaryColor)},OutlineColour=${rgbToFFmpegColor(outlineColor)}'`,
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
          {/* Color pickers */}
          <div className="relative mb-6">
            {/* Primary Color */}
            <div className="flex items-center mb-4">
              <span className="mr-2 font-medium">Primary color:</span>
              <input
                type="color"
                value={primaryColor}
                id="style1"
                className="w-10 h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                onChange={(ev) => setPrimaryColor(ev.target.value)}
              />
            </div>
      
            {/* Outline Color */}
            <div className="flex items-center">
              <span className="mr-2 font-medium">Outline color:</span>
              <input
                type="color"
                value={outlineColor}
                id="style1"
                className="w-10 h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                onChange={(ev) => setOutlineColor(ev.target.value)}
              />
            </div>
          </div>
      
          {/* Video Player */}
          <div className="rounded-lg overflow-hidden shadow-lg mb-6">
            <video ref={videoRef} controls className="w-full h-auto rounded-lg"></video>
          </div>
      
          {/* Action Buttons and Instructions */}
          <div className="relative mt-4 flex flex-col items-center">
            {/* Apply Captions Button */}
            <div className="mb-4">
              <button
                onClick={transcode}
                className="bg-black text-white py-3 px-8 rounded-full inline-flex gap-2 border-2 border-blue-700/50 cursor-pointer items-center hover:bg-blue-600 transition"
              >
                <SparklesIcon className="w-5 h-5" />
                <span>Apply captions!</span>
              </button>
            </div>
      
            {/* Instruction Text */}
            <div className="text-center">
            <p className=" inline-flex flex-wrap items-center text-lg leading-relaxed font-normal">
  <span className="font-normal">Press the</span>
  <span className="mx-2 inline-flex items-center">
    <OptionsIcon className="inline-block text-xl" />
  </span>
  <span className="font-normal">on the video player</span>
  <br />
  <span className="font-normal">to download your video.</span>
</p>
            </div>
          </div>
        </>
      );      
    }