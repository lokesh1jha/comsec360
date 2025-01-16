import AWS from 'aws-sdk';

// Configure AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;


async function uploadPdfToS3(data: Uint8Array<ArrayBufferLike>, key: string, fileName: string): Promise<string> {
    if (!bucketName) {
        throw new Error('Bucket name is not defined');
    }
    
    const params = {
        Bucket: bucketName,
        Key: `${key}/${fileName.replace(/ /g, '_')}`,
        Body: Buffer.from(data),
        ContentType: 'application/pdf',
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        return uploadResult.Location;
    } catch (error) {
        console.error('Error uploading PDF to S3:', error);
        throw new Error('Failed to upload PDF to S3');
    }
}

export default uploadPdfToS3;