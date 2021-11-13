const dotenv = require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const controllers = require('./controllers/index.js');
// import { https } from 'https';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
  })
);

app.post('/login', controllers.login);
app.post('/signup', controllers.signup);
app.post('/logout', controllers.logout);
app.get('/user-info', controllers.userinfo);
app.patch('/user-info', controllers.edituserinfo);
app.delete('/withdrawal', controllers.withdrawal);
app.get('/todo', controllers.getTodo);
app.post('/todo', controllers.makeTodo);
app.patch('/todo', controllers.editTodo);
app.delete('/todo', controllers.deleteTodo);

const HTTPS_PORT = process.env.HTTPS_PORT || 80;
// if (fs.existsSync('./key.pem') && fs.existsSync('./cert.pem')) {
//   const privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
//   const certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
//   const credentials = { key: privateKey, cert: certificate };

//   server = https.createServer(credentials, app);
//   server.listen(HTTPS_PORT, () => console.log(`https server running on port ${HTTPS_PORT}`));
// } else {
const server = app.listen(HTTPS_PORT, () =>
  console.log(`🚀 http server running on port ${HTTPS_PORT}`)
);
// }

module.exports = server;
