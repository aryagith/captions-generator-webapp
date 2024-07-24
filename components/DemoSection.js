import SparklesIcon from "./SparklesIcon";
export default function DemoSection(){
    return(<section className="flex mt-12 justify-around items-center">
        <div className="bg-gray-800/50 w-[240px] h-[480px] rounded-xl"></div>
        <SparklesIcon />
        <div className="bg-gray-800/50 w-[240px] h-[480px] rounded-xl"></div>
      </section>);
}