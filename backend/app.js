const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

/**
 * Setup mongodb connection
 */
require('mongoose').connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const crypto = require('crypto');

const app = express();

/**
 * Setup encoding
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const secretKey = crypto.randomBytes(64).toString('hex');

/**
 * Setup session
 */
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
}));

/**
 * Put session into req.username
 */
app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  // Allow CORS
  // res.header("Access-Control-Allow-Methods",'GET, POST, DELETE, PATCH');
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Origin', require('config').get('frontend.url'));
  // get required fields
  if (req.query.fields) {
    req.fields = {};
    req.query.fields.split(",").forEach(field => {
      req.fields[field] = 1;
    })
  }
  next();
});

const auth = require('./route/auth');
const exec = require('./route/exec');
const organization = require('./route/organization');
const problemSet = require('./route/problem-set');

app.use('/api/auth', auth);
app.use('/api/exec', exec);
app.use('/api/organization', organization);
app.use('/api/problemSet', problemSet);

// const peerServer = PeerServer({
//   port: 3002,
//   path: '/',
//   ssl: config
// });

// peerServer.listen(err => {
//   console.log('listening peer server');
// });

const http = require('http');
const PORT = 3001;

const server = http.createServer(app);

server.listen(PORT, (err) => {
  if (err)
    console.error(err);
  else
    console.log("HTTPS server on http://localhost:%s", PORT);
});

/**
 * Just for simplicity
 */
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Socket IO Connection Established');

  socket.on('join', (userId) => {
    console.log('Someone Joined');
    
    socket.join('1');
    socket.to('1').emit('user-conn', userId);

    socket.on("disconnect", () => {
      socket.join('1');
      socket.to('1').emit('user-disconn', userId);
      console.log("Client disconnected");
    });
  });

  socket.on('code', code => {
    console.log('Code updated: ' + code);
    socket.join('1');
    socket.to('1').emit('code', code);
  })

  socket.on('stream-open', (userId) => {
    socket.join('1');
    socket.to('1').emit('stream-open', userId);
  });

  socket.on('stream-close', (userId) => {
    socket.join('1');
    socket.to('1').emit('stream-close', userId);
    console.log(userId);
  });
});
