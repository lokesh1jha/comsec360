module.exports = {
  apps: [
    {
      name: "Project_ComSec360",
      script: "npm",
      args: "run start",
      cwd: "/home/ubuntu/Project_ComSec360",
      env: {
        NEXT_PUBLIC_BACKEND_URL: 'http://3.78.244.234:5001',
        NEXT_PUBLIC_CS_ACCOUNT_USER_URL: 'http://52.59.5.100:3000',
        NEXT_PUBLIC_CS_MULTI_USER_URL: 'http://3.74.161.52:3000'
      },
      pre_start: "npm run build"
    }
  ]
};


