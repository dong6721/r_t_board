const express = require('express');
const path = require('path');
const port = 3000;
const router = require('./routes/router.js');
const app = express();
require('date-utils');    //time
//set ejs
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.engine('html', require('ejs').renderFile);

//set router
app.use('/',router);
//set socket
const webSocket = require('./socket/socket');

//set static data
app.use(express.static('public'));

const server = app.listen(port, () => {
  var newDate = new Date();
  var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
  console.log(`app listening at http://localhost:${port} current_time:${time}`);
});

webSocket(server);
