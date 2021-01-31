const express = require('express');
const router = express.Router();
//const clonedeep = require('lodash/clonedeep');
const controller = require('./ctrl');
const login_controller = require('./login_ctrl');

router.route('/')
      .get(controller.main_page); //'/home'   home

router.route('/login')
      .get(login_controller.login_page)  //'/login' login_page;
      .post(login_controller.login_request);  // '/login' login request
router.route('/logout')
      .get(login_controller.logout_page); //'/logout' logout page;
router.route('/login/register')
      .post(login_controller.login_create); //'/login/register' new member post

router.route('/board')
      .get(controller.board_list_page) //'/board'  board list
      .post(controller.board_create); //'/board' create new board;

router.route('/board/:boardname')
      .get(controller.boardname_check,controller.board_post_list_page);  // '/board' post list

router.route('/board/:boardname/write')
      .get(controller.boardname_check,controller.write_page) // '/write'   write post
      .post(controller.write_post); //'/board/:boardname/write' write post ajax

router.route('/board/:boardname/:index')
      .get(controller.boardname_check,controller.read_page)  // '/read'    read post
      .put(controller.modify_post)  //'/board/:boardname/:index/modify' modify post ajax
      .delete(controller.delete_post);  //'/board/:boardname/:index/delete' delete post ajax

router.route('/board/:boardname/modify/:index')
      .get(controller.boardname_check,controller.modify_page); // '/modify' modified post

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
