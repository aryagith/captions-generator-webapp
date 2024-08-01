import SparklesIcon from "./SparklesIcon";


export default function ResultVideo({fileName}){

return (
    <>
    <div className="relative mb-4">
        <button className="bg-black text-white py-2 px-6 rounded-full inline-flex gap-2 border-2 border-blue-700/50 cursor-pointer">
            <SparklesIcon />
            <span>Apply captions</span>
        </button>
    </div><div className="rounded-lg overflow-hidden">
            <video controls src={"https://captioner-video.s3.ca-central-1.amazonaws.com/" + fileName}></video>
        </div>
    </>
    );
}