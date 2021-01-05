const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const db = require('../mongoose/schema');
const clonedeep = require('lodash/clonedeep');
const read_db = require('../mongoose/read_db');
const controller = require('./ctrl');

//body-bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

//'/'
router.get('/', controller.main);
// '/board/:boardindex'
router.get('/board/:boardname', controller.board_post_list);

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
    //var board = await db(req.params.boardname,"postSchema");
    //console.log(board.collection);
    var read_post = await read_db.get_post_one(req.params.boardname,req.params.index,true,false);

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

//write new post
router.post('/board/:boardname/write', (req, res, next) => {
  try {
    read_db.create_new_post(req.params.boardname,
    req.body.title,
  req.body.contents,
new Date().toFormat('YYYY-MM-DD HH24:MI:SS'));
res.json("success!");
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
