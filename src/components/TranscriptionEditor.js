import TranscriptionItem from "./TranscriptionItem";



export default function TranscriptionEditor({awsTranscriptionItems, setAwsTranscriptionItems}){
    //function for changing values of start_time, end_time, content. replace prop with any one of these.
function updateTranscriptionItem(index, prop, ev){
    const newAwsItems= [...awsTranscriptionItems];
        newAwsItems[index][prop] = ev.target.value;
        setAwsTranscriptionItems(newAwsItems);
}

    return(
        <>
        <div className="grid grid-cols-3 gap-1 sticky top-0 bg-blue-200/70 p-2 rounded-md ">
            <div>|From</div>
            <div>|To</div>
            <div>|Content</div>
        </div>
    {awsTranscriptionItems.length > 0 && (
        <div>
            {awsTranscriptionItems.map((item, key) => (
            // eslint-disable-next-line react/jsx-key
         <div key={key}>
         <TranscriptionItem 
         item={item}
         handleStartTimeChange={ev => updateTranscriptionItem(key,'start_time', ev)}
         handleEndTimeChange={ev => updateTranscriptionItem(key,'end_time', ev)}
         handleContentChange={ev => updateTranscriptionItem(key,'content', ev)}
          />  
        </div>
    ))}
        </div>
    )}
    </>
     );

}