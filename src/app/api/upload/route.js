import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from 'uniqid'

export async function POST(req){
    const region = process.env.BUCKET_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucket = process.env.BUCKET_NAME;

    if (!region || !accessKeyId || !secretAccessKey || !bucket) {
        return Response.json(
            {
                error:
                    'Server is missing AWS env vars. Copy .env.example to .env.local and set BUCKET_REGION, BUCKET_NAME, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY.',
            },
            { status: 500 }
        );
    }

    const formData = await req.formData();
    const file = formData.get('file');
    
    const{name, type} = file;
    const data = await file.arrayBuffer();
    const s3client = new S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    })
    const id = uniqid();
    const ext = name.split('.').slice(-1)[0]; //Getting the file extension.
    const newName = id + '.' + ext;

    const uploadCommand= new PutObjectCommand({
        Bucket: bucket,
        Body: data,
        ACL:'public-read',
        ContentType: type,
        Key: newName
    })

    await s3client.send(uploadCommand)

    return Response.json({name,ext,newName})
} 