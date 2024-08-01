'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { clearTranscriptionItems } from "@/libs/awsTranscriptionHelpers";
import TranscriptionItem from "@/components/TranscriptionItem";
import SparklesIcon from "@/components/SparklesIcon";

export default function FilePage({params}){
    const filename = params.filename;
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isFetchingInfo, setIsFetchingInfo] = useState(false);
    const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([]);
    useEffect(() => {
        getTranscription();
    }, [filename]);

    function getTranscription(){
        setIsFetchingInfo(true);
        axios.get('/api/transcribe?filename='+ filename).then(response => {
            setIsFetchingInfo(false);
            const status = response.data?.status;
            const transcription = response.data.transcription;

            if (status === 'IN_PROGRESS'){
                setIsTranscribing(true);
                setTimeout(getTranscription, 3000);
            }
            else{
                setIsTranscribing(false);
                
                setAwsTranscriptionItems(
                    clearTranscriptionItems(transcription.results.items)
                   
                );
            }

        });
    }
    
    if (isTranscribing){
        return(
            <div>Transcribing your video...</div>
        )
    }
    
    if(isFetchingInfo){
        return(
            <div>Fetching information...</div>
        )
    }

    return(
    <div>
    <div className="grid grid-cols-2 gap-16">
    <div className="max-w-xs">
        <h2 className="text-2xl mb-4 text-black/60">Transcription</h2>
        <div className="grid grid-cols-3 gap-1 sticky top-0 bg-blue-200/70 p-2 rounded-md ">
            <div>|From</div>
            <div>|To</div>
            <div>|Content</div>
        </div>
    {awsTranscriptionItems.length > 0 && awsTranscriptionItems.map(item => (
       // eslint-disable-next-line react/jsx-key
         <TranscriptionItem item={item} />  
    ))}
    </div>
    <div>
    <h2 className="text-2xl mb-4 text-black/60">Result</h2>
    <div className="rounded-lg overflow-hidden">
        <video controls src={"https://captioner-video.s3.ca-central-1.amazonaws.com/"+ filename}></video>
    </div>
    <div className="relative text-center mt-4">
    <button className="bg-black text-white py-2 px-6 rounded-full inline-flex gap-2 border-2 border-blue-700/50 cursor-pointer">
    <SparklesIcon />
    <span>Apply captions</span>
    </button>
    </div>
    </div>
    </div>
    </div>
    );
}