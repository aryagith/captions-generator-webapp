import UploadIcon from "./UploadIcon";
export default function PageHeaders({
    h1Text = 'H1Text',
    h2Text = 'H2Text',
}){
    return(<section>
        <div className="text-center mt-24 mb-8">
        <h1 className="text-3xl"style={{textShadow: '3px 3px rgba(0,0,0,.1)'}}>
          {h1Text}
        </h1>
        <h2>
          {h2Text} 
        </h2>
        </div>
      </section>);
}