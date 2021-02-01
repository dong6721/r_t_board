const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const port = 3000;
const bodyParser = require('body-parser');
const router = require('./routes/router.js');
const app = express();
const init = require('./init');
//set socket
const webSocket = require('./socket/socket');

//initialize with server
init();

require('date-utils');    //time
//set ejs
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.engine('html', require('ejs').renderFile);


//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("io", webSocket);

//session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  name:'session_id',
  //cookie: {secure:true},  //https option
  store:new MongoStore({
    mongooseConnection: require('mongoose').connection
  })
}));

//set static data
app.use(express.static('public'));

//set router
app.use('/',router);

const server = app.listen(port, () => {
  var newDate = new Date();
  var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
  console.log(`app listening at http://localhost:${port} current_time:${time}`);
});

webSocket(server);
