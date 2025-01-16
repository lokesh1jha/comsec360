import logger from "./logger";
import AWS from 'aws-sdk';



const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});



export const uploadFileToS3 = async (file: any, companyId: number, folderName: string, fileName?: string) => {
  let response = { success: false, data: { location: "" }, error: null, message: "" }
  const fileExtension: string = file.originalname.split('.').pop();
  fileName = fileName ? `${fileName}.${fileExtension}` : Date.now().toString() + file.originalname.replace(/ /g, "")
  const params: any = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${companyId}/${folderName}/${fileName.replace(/ /g, '_')}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  try {
    const result = await s3.upload(params).promise();
    response.success = true;
    response.message = "File uploaded successfully";
    response.data.location = result.Location;
    return response
  } catch (error: any) {
    logger.error(error);
    response.error = error;
    return response
  }
}

export const generatePresignedUrl = async (fileUrl: string, expiration: number = 3600): Promise<string | null> => {
  if (!fileUrl) {
    return null;
  }
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileUrl.split('amazonaws.com/')[1],
      Expires: expiration,
    };

    // Generate pre-signed URL
    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    return signedUrl;  // Return the pre-signed URL
  } catch (error: any) {
    logger.error('Error generating pre-signed URL:', error);
    return null;
  }
};
