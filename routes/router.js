const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const db = require('../mongoose/schema');
const clonedeep = require('lodash/clonedeep');
const read_db = require('../mongoose/read_db');

//body-bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

//'/'
router.get('/', async (req,res,next) => {
  var num = 1; //home board number
  var home_board = new Array(num);
  var board_name = new Array(num);
  board_name[0] = "board";  //delete element
  for(var i=0;i<num;i++){
    home_board[i] = await read_db.get_post(board_name[i],0,3);
  }
  res.render('home', {
    nav: ["nav1", "nav2", "nav3", "nav4"],
    board_name:board_name,
    home_board:home_board,
  });
});

// '/board/:boardindex'
router.get('/board/:boardname', async (req, res, next) => {
  try {
    var board = await db(req.params.boardname,"postSchema");
    if(board === "no collection")
    {
      //not exist board
      res.send("존재하지 않는 게시판입니다");
      return;
    }
    var post_list;

    /*var col = db("identitycounters", "cntSchema");
    col.findOne({ model: "board"},{_id:false,model:true,count:true},(err,docs)=>{
      cnt = docs.count;
    });*/
    //get DB page
    if (req.query.page === undefined || req.query.page === 1) {
      //page = 1
    }

    //console.time();   //시간측정

    await board.find({}, {
      _id: false,
      index: true,
      title: true,
      author: true,
      date: true,
      viewcnt: true,
      goodcnt: true
    }, {
      sort: {
        index: -1
      },
      limit: 20
    }, (err, docs) => {
      if (err) {
        console.log("find error!", err);
        return res.status(500).json({
          error: err
        });
      }
      post_list = new Array(docs.length);
      for (var i = 0; i < post_list.length; i++) {
        var postTime = docs[i].date.toFormat('YYYY-MM-DD');
        if (docs[i].date.toFormat('YYYY-MM-DD') === new Date().toFormat('YYYY-MM-DD')) {
          postTime = docs[i].date.toFormat('HH24:MI:SS');
        }
        post_list[i] = {
          index: docs[i].index,
          subject: docs[i].title,
          author: docs[i].author,
          date: postTime,
          viewcnt: docs[i].viewcnt,
          goodcnt: docs[i].goodcnt
        }
      }
    });
    //console.timeEnd();
    res.render('board', {
      nav: ["nav1", "nav2", "nav3", "nav4"],
      board_title: req.params.boardname,
      post_list: post_list
    });
  } catch (e) {
    console.log(e);
    res.send(e);
    //error
  }
});

// '/board/write'
router.get('/board/:boardname/write', (req, res, next) => {
  res.render('write', {
    nav: ["nav1", "nav2", "nav3", "nav4"],
    board_title: req.params.boardname
  });
});

// '/board/read'
//read post page
router.get('/board/:boardname/:index', async (req, res, next) => {
  try{
    var board = await db(req.params.boardname,"postSchema");
    //console.log(board.collection);
    var read_post;
    await board.findOne({index:req.params.index},(err,doc)=>{
      if (err) {
        console.log("find one error!", err);
        return res.status(500).json({
          error: err
        });
      }
      //get current time
      var postTime = doc.date.toFormat('YYYY-MM-DD');
      if (doc.date.toFormat('YYYY-MM-DD') === new Date().toFormat('YYYY-MM-DD')) {
        postTime = doc.date.toFormat('HH24:MI:SS');
      }
      read_post = {
        index: doc.index,
        subject: doc.title,
        contents:doc.contents,
        author: doc.author,
        date: postTime,
        viewcnt: doc.viewcnt,
        goodcnt: doc.goodcnt,
        comment: doc.comment
      };
      doc.viewcnt++;
      doc.save();
    });
    res.render('read', {
      nav: ["nav1","nav2","nav3","nav4"],
      board_title: req.params.boardname,
      read_post: read_post
    })
  }catch(e) {
    console.log(e);
    res.send(e);
    //error
  }
});

//write new comment
/*router.post('/:boardname/:index/comment', (req, res, next) => {
  try {
    var board = db(boardname,"postSchema");
    //save to DB & send json
    var id = req.body.id;
    var text = req.body.text;
    var newDate = new Date();
    var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
    board.findOne({
      index: req.params.index
    }, (err, res) => {
      if (err) {
        console.log("find one error!", err);
        return res.status(500).json({
          error: err
        });
      }
      res.comment.push({
        nickname: id,
        comment: text,
        date: time
      });
      res.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("saved!");
        }
      })
    })
  } catch (e) {
    console.log("error : ", e);
  } finally {
    res.json({
      "id": id,
      "text": text,
      "time": time
    });
  }
});*/

//write new post
router.post('/board/:boardname/write', async (req, res, next) => {
  try {
    var board = await db(req.params.boardname,"postSchema");
    var title = req.body.title;
    var contents = req.body.contents;
    var newDate = new Date();
    var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

    //lock
    board.create({
      title: title,
      contents: contents,
      author: "nickname",
      date: time
    }, (err, user) => {
      if (err) {
        console.log("create fail", err);
        res.json("create fail");
      } else {
        res.json("create!");
      }
    });
  } catch (e) {
    console.log("error : ", e);
  };
});


module.exports = router;

/*
comment data 구현
comment data를 주고받을때, 초기동작 시 DB에서 요청된 comment만을 한번에
ajax(get)을 통해서 보냄.
그 페이지가 열려있다고 가정할 때, polling을 통해서 일정간격마다 클라이언트에서
서버로 요청을 보낼지, long polling으로 서버와 클라이언트가 통신상태를 유지하면
서 서버에 부하를 그대로 줄지 고민중.
HTML5 에 나온 새로운 기술인 WebSocket을 이용하여 구현할 가능성이 있는지 알아봄
ws library와 socket.io library 둘 중 선택하여 WebSocket을 구현.
후자는 WebSocket을 구현하지 못한다면, polling 방식으로 서버와 클라이언트가 통신함
이러한 차이점에서 후자쪽이 좀 더 범용성있음. 단 node.js 환경에서만 구현됨.
*/
