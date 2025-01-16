
module.exports = {
    apps: [
        {
            name: "CsAccountMultiple",
            script: "npm",
            args: "run start",
            cwd: "/home/ubuntu/CsAccountMultiple",
            env: {
                NEXT_PUBLIC_BACKEND_URL: "http://3.78.244.234:5001",
                NEXT_PUBLIC_LOGIN_URL: "http://3.74.43.250:3000/login",
                NEXT_PUBLIC_CS_ACCOUNT_USER_URL: 'http://52.59.5.100:3000'
            },
            pre_start: "npm run build"
        }
    ]
};

