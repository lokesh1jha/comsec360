/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'comsec-doc.s3.ap-south-1.amazonaws.com', 
            'comsec-bucket.s3.ap-east-1.amazonaws.com'
        ],
    },
};

export default nextConfig;
