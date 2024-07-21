import SparklesIcon from "./components/SparklesIcon";
import UploadIcon from "./components/UploadIcon";


export default function Home() {
  return (
    <>
    <div>
      <div className="text-center mt-24 mb-8">
      <h1 className="text-3xl"style={{textShadow: '3px 3px rgba(0,0,0,.1)'}}>
        Add captions to your videos!
      </h1>
      <h2>
        Just upload your video and we will do the rest! 
      </h2>
      </div>
      <div className="text-center">
        <button className="bg-black text-white py-2 px-6 rounded-full inline-flex gap-2 border-2 border-blue-700/50">
         <UploadIcon />
          <span>Choose file</span>
        </button>
      </div>
    </div>
    <div className="flex mt-12 justify-around items-center">
      <div className="bg-gray-800/50 w-[240px] h-[480px] rounded-xl"></div>
      <SparklesIcon />
      <div className="bg-gray-800/50 w-[240px] h-[480px] rounded-xl"></div>
    </div>
    </>
  );
}
