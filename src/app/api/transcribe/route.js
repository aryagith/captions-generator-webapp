import { GetTranscriptionJobCommand, StartTranscriptionJobCommand, TranscribeClient } from "@aws-sdk/client-transcribe";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

function getClient(){
    return(new TranscribeClient({
        region: process.env.BUCKET_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    }));
}

function createTranscriptionCommand(fileName){
    return(new StartTranscriptionJobCommand({
        TranscriptionJobName: fileName,
        OutputBucketName : process.env.BUCKET_NAME,
        OutputKey: fileName + '.transcription',
        IdentifyLanguage: true,
        Media: {
            MediaFileUri : 's3://' + process.env.BUCKET_NAME + '/'+ fileName
        },
    }));
}

async function createTranscriptionJob(fileName){
    const transcribeClient=getClient()
    const transcriptionCommand = createTranscriptionCommand(fileName)
    return transcribeClient.send(transcriptionCommand);
}

async function streamToString(stream){
    const chunks = [];
    return new Promise((resolve , reject) => {
        stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
        stream.on('error', reject)
    
    });

}

async function getTranscriptionFile(fileName){
    const transcriptionFile= fileName + '.transcription';
    const s3client = new S3Client({
        region: process.env.BUCKET_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: transcriptionFile,
    });
    let transcriptionFileResponse =  null;
    try{
        transcriptionFileResponse = await s3client.send(getObjectCommand);
    }
    catch(error){}

    if(transcriptionFileResponse){
        return JSON.parse(await streamToString(transcriptionFileResponse.Body));  
    }
    return null;
}

//returns null if job does not exist
async function getJob(fileName){
    const transcribeClient = getClient();
    let jobStatusResult = null;
    try {
        jobStatusResult = await transcribeClient.send(new GetTranscriptionJobCommand({
            TranscriptionJobName: fileName,
            }
        ));    
    } catch (e) {}
   
    return jobStatusResult;
}

export async function GET(req){
    const url= new URL(req.url);
    const searchParams=new URLSearchParams(url.searchParams)
    const filename = searchParams.get('filename');
   
    //find ready transcription
   const transcription = await getTranscriptionFile(filename);
   if (transcription){
    return Response.json({
        status: 'COMPLETED',
        transcription,
    });
   }

    
    
    //check if already transcribing
    const existingJob = await getJob(filename);

    if(existingJob) {
        return Response.json({
            status:existingJob.TranscriptionJob.TranscriptionJobStatus,
        })
    }

    // creating new transcription job
    if(!existingJob){
        const newJob = await createTranscriptionJob(filename);
        return Response.json({
            status: newJob.TranscriptionJob.TranscriptionJobStatus,
        })
    }

    return(
        Response.json(null)
    );
}