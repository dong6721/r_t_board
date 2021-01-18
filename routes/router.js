const express = require('express');
const router = express.Router();
//const clonedeep = require('lodash/clonedeep');
const controller = require('./ctrl');


//GET
//'/'   home
router.get('/', controller.main_page);
// '/board/:boardindex' post list
router.get('/board/:boardname', controller.board_post_list_page);
// '/board/write'   write post
router.get('/board/:boardname/write', controller.write_page);
// '/board/read'    read post
router.get('/board/:boardname/:index', controller.read_page);

//POST
//'/board/:boardname/write'
router.post('/board/:boardname/write', controller.write_post);
//'/board/:boardname/:index/delete'
router.post('/board/:boardname/:index/delete',controller.delete_post);

router.use(controller.no_page);

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

socket.io 를 이용하여 구현. 자세한 코드는 socket/socket.js 와 read.ejs file을 client & server side로 구성
*/
