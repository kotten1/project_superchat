const redis = require('redis');
const redisClient = redis.createClient();

const chat = {
  getAllUsers(){
    redisClient.lrange('usernames', 0, 1, (err, reply) => {
      console.log('222', reply)
      return reply;
    })
  }
};

module.exports = chat;
