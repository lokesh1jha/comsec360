module.exports = {
  apps: [
    {
      name: "Director",
      script: "npm",
      args: "run start",
      cwd: "/home/ubuntu/Director",
      env: {
        NEXT_PUBLIC_BACKEND_URL:"http://3.78.244.234:5001"
      },
      pre_start: "npm run build"
    }
  ]
};


