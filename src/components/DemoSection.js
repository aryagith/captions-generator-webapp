import SparklesIcon from "./SparklesIcon";
export default function DemoSection(){
    return(<section className="flex mt-12 justify-around items-center">
        <div className=" w-[240px] h-[425px] rounded-xl overflow-hidden">
        <video 
            src="https://captioner-video.s3.ca-central-1.amazonaws.com/TikVid.io_7371953577163492613.mp4"
            autoPlay
            loop
            muted
            ></video></div>
        <SparklesIcon />
        <div className=" w-[240px] h-[425px] rounded-xl overflow-hidden"><video 
            src="https://captioner-video.s3.ca-central-1.amazonaws.com/transcribed.mp4"
            autoPlay
            loop
            muted
            ></video></div>
      </section>);
}