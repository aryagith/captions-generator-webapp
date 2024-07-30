'use client'
import { useEffect } from "react";
import axios from "axios";

export default function FilePage({params}){
    const filename = params.filename;
    useEffect(() => {
        axios.get('/api/transcribe?filename='+ filename);
    }, [filename]);
    return(
    <div>{filename}</div>
    );
}