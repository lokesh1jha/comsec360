
module.exports = {
  apps: [
    {
      name: "comsec-account-user",
      script: "npm",
      args: "run start",
      cwd: "/home/ubuntu/CsAccountSingle",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_BACKEND_URL: "http://3.78.244.234:5001",
        NEXT_PUBLIC_LOGIN_URL: "http://3.74.43.250:3000/login",
        NEXT_PUBLIC_MULTIPLE_FRONTEND_URL: 'http://3.74.161.52:3000'
      },
      pre_start: "npm run build"
    }
  ]
};