const express = require('express');
const app = express();

// handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs( {defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//CSS
app.use( express.static(__dirname + "/public") );

//redis
const redis = require('redis');
const redisClient = redis.createClient();

//socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//body parser
const bodyParser = require('body-parser');
app.use( bodyParser.urlencoded( {extended: true}) );

//set up cookie-parser
const cookieParser = require('cookie-parser');
app.use( cookieParser() );

//services
const chat = require('./services/chat');

app.get("/", (req, res) => {
  redisClient.lrange('usernames', 0, -1, (err, reply) => {
    if (reply.includes( req.cookies.username) ) {
      res.render('partials/index', {username: req.cookies.username});
    } else {
      res.render('partials/login', { activeUsers: reply });
    }
  });
});


app.post("/login", (req, res) => {
  let userName = req.body.username;

  redisClient.lrange('usernames', 0, -1, function(err, reply) {
     if (reply.includes(userName)){
        console.log("Username already taken");
     } else {
       res.cookie("username", userName);
       redisClient.lpush("usernames", userName)
       res.redirect("/")
     }
  });
});

app.get("/logout", (req, res) => {
  redisClient.lrem('usernames', 0, req.cookies.username);
  res.cookie("username", "");
  res.redirect("/");
});

io.on('connection', client => {
  console.log('connected!!!');

  client.emit('getUrls', 'here u go')
})


server.listen(3000);
