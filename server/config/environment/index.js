var path = require('path');


module.exports = {
    mongoUrl: 'mongodb://127.0.0.1/bltzrTask',
    root: path.normalize(__dirname + '/../../..'),
    secrets: {
        session: 'bltzrTask'
    },
    redisConn:{
        redis: {
            port: 6379,
            host: '127.0.0.1'
        }
    }
}