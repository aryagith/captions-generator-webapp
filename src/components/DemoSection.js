import SparklesIcon from "./SparklesIcon";
export default function DemoSection(){
    return(<section className="flex mt-12 justify-around items-center">
        <div className="bg-gray-800/50 w-[240px] h-[480px] rounded-xl">
        <video 
            src="https://github.com/aryagith/captions-generator-webapp/blob/master/src/vids/TikVid.io_7371953577163492613.mp4"
            autoplay
            ></video></div>
        <SparklesIcon />
        <div className="bg-gray-800/50 w-[240px] h-[480px] rounded-xl"><video 
            src="https://github.com/aryagith/captions-generator-webapp/blob/master/src/vids/transcribed.mp4"
            autoplay
            ></video></div>
      </section>);
}