module.exports = {
  apps: [
    {
      name: "Shareholder",
      script: "npm",
      args: "run start",
      cwd: "/home/ubuntu/Shareholder",
      env: {
        NEXT_PUBLIC_BACKEND_URL:"http://3.78.244.234:5001"
      },
      pre_start: "npm run build"
    }
  ]
};


