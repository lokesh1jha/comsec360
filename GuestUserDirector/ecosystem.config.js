
module.exports = {
    apps: [
        {
            name: "GuestUserDirector",
            script: "npm",
            args: "run start",
            cwd: "/home/ubuntu/GuestUserDirector",
            env: {
                NEXT_PUBLIC_BACKEND_URL: "http://3.78.244.234:5001",
            },
            pre_start: "npm run build"
        }
    ]
};

