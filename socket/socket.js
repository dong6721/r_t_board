const SocketIO = require('socket.io');
const db = require('../mongoose/schema');

//realtime comment socket io section
module.exports = (server) => {
  const io = SocketIO(server, {
    path: '/socket.io'
  });
  io.on('connection', (socket) => {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);

    //to get all events
    var onevent = socket.onevent;
    socket.onevent = function(packet) {
      var args = packet.data || [];
      onevent.call(this, packet); // original call
      packet.data = ["*"].concat(args);
      onevent.call(this, packet); // additional call to catch-all
    };

    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });
    socket.on('error', (error) => {
      console.error(error);
    });

    //write new comment
    socket.on("*",(event, data) => {
      var board = db("board", "postSchema");
      console.log(event);
      console.log(data);
      var evt = event.split('/');
      //check event
      if(evt[0] === "cmt"){
        if(evt[3] === "typing"){
          // 'cmt/:boardname/:postindex/typing'
          socket.broadcast.emit(event,data);
          socket.emit(event,data);
        }
        else {
          // 'cmt/:boardname/:postindex'
          try {
            //save to DB & send broadcast
            var newDate = new Date();
            var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
            var cmt_num;
            //save to DB
            board.findOne({
              index: evt[2]
            }, (err, res) => {
              if (err) {
                console.log("find one error!", err);
                return res.status(500).json({
                  error: err
                });
              }
              res.comment.push({
                nickname: data.id,
                comment: data.text,
                date: time
              });
              res.save((err,res) => {
                if (err) {
                  console.log(err);
                } else {
                  //save success
                  console.log("saved!");
                  cmt_num = res.comment.length - 1;
                  //send broadcast
                  var broadcast_data = {
                    cmt_id:cmt_num,
                    nickname: data.id,
                    comment: data.text,
                    date: time
                  };
                  socket.broadcast.emit(event,broadcast_data);
                  socket.emit(event,broadcast_data);
                }
              });
            });
          } catch (e) {
            //error
            console.log("error : ", e);
            socket.broadcast.emit(event,{id:data.id,err:"write_err"});
            socket.emit("error","cmt err!");
          }
        }
      }
    });

    //socket.broadcast.emit('board_1',"test");  //broadcast

    /*socket.interval = setInterval(() => {
      socket.emit('news', 'Hello Socket.IO');
    },3000);*/
  });
};
