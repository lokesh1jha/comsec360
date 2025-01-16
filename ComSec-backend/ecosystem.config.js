module.exports = {
  apps: [
    {
      name: "ComSec360-backend",
      script: "./dist/index.js",
      watch: true, // Enable file watching (optional)
      env: {
        NODE_ENV: "development",
        DATABASE_URL: '',
        MJ_APIKEY_PUBLIC: '',
        MJ_APIKEY_PRIVATE: '',
        MAILJET_API_KEY: "",
        MAILJET_API_SECRET: "",
        SENDER_EMAIL: 'lokesh9jha@gmail.com',
        JWT_SECRET: '',
        JWT_EXPIRES_IN: '1h',
        AWS_ACCESS_KEY_ID: "",
        AWS_SECRET_ACCESS_KEY: "",
        AWS_REGION: "ap-east-1",
        AWS_S3_BUCKET_NAME: "comsec-bucket",
        GUEST_SHAREHOLDER_FRONTEND_URL: 'http://3.75.221.168:3000',
        GUEST_DIRECTOR_FRONTEND_URL: 'http://3.120.157.11:3000',
        DOCUMENT_SIGN_SHAREHOLDER_FRONTEND_URL: 'http://3.120.208.148:3005',
        DOCUMENT_SIGN_DIRECTOR_FRONTEND_URL: 'http://54.93.172.105:3006'
      },
    },
  ],
};
