import TranscriptionItem from "./TranscriptionItem";



export default function TranscriptionEditor({awsTranscriptionItems, setAwsTranscriptionItems}){
    //function for changing values of start_time, end_time, content. replace prop with any one of these.
function updateTranscriptionItem(index, prop, ev){
    const newAwsItems= [...awsTranscriptionItems];
        newAwsItems[index] = { ...newAwsItems[index], [prop]: ev.target.value };
        setAwsTranscriptionItems(newAwsItems);
}

    return(
        <div className="transcript-scroll">
        <div className="transcript-columns transcript-heading" aria-hidden="true">
            <div>Start</div>
            <div>End</div>
            <div>Caption text</div>
        </div>
    {awsTranscriptionItems.length > 0 && (
        <div>
            {awsTranscriptionItems.map((item, key) => (
         <div key={key}>
         <TranscriptionItem 
         item={item}
         index={key}
         handleStartTimeChange={ev => updateTranscriptionItem(key,'start_time', ev)}
         handleEndTimeChange={ev => updateTranscriptionItem(key,'end_time', ev)}
         handleContentChange={ev => updateTranscriptionItem(key,'content', ev)}
          />  
        </div>
    ))}
        </div>
    )}
    {awsTranscriptionItems.filter(Boolean).length === 0 && <p className="p-6 text-sm text-[var(--ink-muted)]">No speech was found in this video.</p>}
    </div>
     );

}
