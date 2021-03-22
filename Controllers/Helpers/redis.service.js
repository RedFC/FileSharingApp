const redis = require('redis')

const client = redis.createClient({
    port: 12786, // replace with your port
    host: "redis-12786.c10.us-east-1-2.ec2.cloud.redislabs.com", // replace with your hostanme or IP address
    password: "ZcRzZwxBVBb94c2knihutW5sZ1qYofPJ", // replace with your password
})


module.exports = client