export default function TranscriptionItem({ 
  item , 
  index,
  handleStartTimeChange,
  handleEndTimeChange,
  handleContentChange
}) {
  if(!item){
    return '';
  }
    return (
    <div className="transcript-columns transcript-row">
        <input type="text" 
        aria-label={`Word ${index + 1} start time in seconds`} inputMode="decimal"
        className="editor-input time-input"
        value={item.start_time} onChange={handleStartTimeChange} />

        <input type="text" 
        aria-label={`Word ${index + 1} end time in seconds`} inputMode="decimal"
        className="editor-input time-input"
        value={item.end_time} 
        onChange={handleEndTimeChange} />

        <input type="text"
         aria-label={`Word ${index + 1} caption text`}
         className="editor-input"
         value={item.content} 
         onChange={handleContentChange} />
    </div>
  );
}
