const SocketIO = require('socket.io');
const db = require('../mongoose/schema');
const read_db = require('../mongoose/read_db');

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

    socket.on("*",async (event, data) => {
      var board = await db("board", "postSchema");
      console.log("socket.io coming\nevent name:",event,"\ndata name:",data);
      var evt = event.split('/');
      //check event
      if(evt[0] === "cmt"){
        if(evt[3] === "typing"){
          // 'cmt/:boardname/:postindex/typing'
          console.log("typing action emit to:",event,"\ndata is:",data);
          socket.broadcast.emit(event,data);
          socket.emit(event,data);
        }
        else if(evt[3] === "delete"){
          // 'cmt/:boardname/:postindex/delete'
          console.log("delete emit to:",event, "\ndata is:",data);
          // update to db
          read_db.delete_one_comment(evt[1],evt[2],data.cmt_index);
          socket.broadcast.emit(event,data);
          socket.emit(event,data);
        }
        else if(evt[3] === "write"){
          //write new comment
          // 'cmt/:boardname/:postindex/write'
          try {
            //save to DB & send broadcast
            var newDate = new Date();
            var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
            //send data to DB server
            let cmt_num = read_db.create_new_comment(evt[1],evt[2],data.id,data.text,time);
            //send broadcast
            var broadcast_data = {
              cmt_id:cmt_num,
              nickname: data.id,
              comment: data.text,
              date: time
            };
            console.log("saved in",board.collection.collectionName,", data:", broadcast_data);
            console.log("emit to",event,"\ndate:",broadcast_data);
            socket.broadcast.emit(event,broadcast_data);
            socket.emit(event,broadcast_data);
          } catch (e) {
            //error
            console.log("error : ", e);
            socket.broadcast.emit(event,{id:data.id,err:"write_err"});
            socket.emit("error","cmt err!");
          }
        }
        else {
          //nothing happend;
        }
      }
    });

    //socket.broadcast.emit('board_1',"test");  //broadcast

    /*socket.interval = setInterval(() => {
      socket.emit('news', 'Hello Socket.IO');
    },3000);*/
  });
};
