const read_db = require('../mongoose/read_db');
const db = require('../mongoose/schema');
const basic_data = require('../data/basic_data');

//error handling!
let err_handling = (number,res)=>{
  if(number === 404)
  {
    try{
      res.status(404).render('404',{
        nav: basic_data.nav_bar
      });
    }
    catch(e) {
      console.log("error : ",e);
      res.send("error!");
      //res.status(500).send("error handling!");
    }
  }
  else if(number === 500)
  {
    res.status(500).send("something is broke...");
  }
}

module.exports = {
  main_page: async (req,res,next) => {
    try{
      //get all of board data
      let boarddata = await read_db.get_board_data();
      let board_name = new Array();
      let home_board = new Array();
      for(let element of boarddata){
        board_name.push(element.board_name);
        home_board.push(await read_db.get_post(element.board_name,0,7)); //게시물 7개까지 작성 가능
      }
      res.render('home', {
        nav: basic_data.nav_bar,
        host_url:basic_data.host_url,
        board_name:board_name,
        home_board:home_board
      });
    }
    catch(e){
      console.log(e);
      err_handling(500,res);
    }
  },
  boardname_check: async(req,res,next) => {
    let data = await read_db.get_board_data(req.params.boardname);
    if(data[0]){
      next();
    }
    else {
      err_handling(404,res);
    }
  },
  board_list_page: async (req,res,next) => {
    try {
      let board_data = await read_db.get_board_data();
      let board_list = new Array();
      board_data.forEach((element)=>{
        board_list.push({board_name:element.board_name,cnt:element.active_post});
      });
      res.render('list',{
        nav: basic_data.nav_bar,
        host_url:basic_data.host_url,
        board_list:board_list,
      });
    } catch (e) {
      console.log(e);
      err_handling(500,res);
    }
  },
  board_post_list_page: async (req, res, next) => {
    try {
      //paging system
      if (req.query.page === undefined) {
        //page = 1
        req.query.page = 1;
      }
      let cur_page = req.query.page;
      //get end page number
      let cnt = await read_db.get_board_cnt(req.params.boardname);
      let limit = 20; //1 page per document
      let end_page =  Math.ceil(cnt / limit);
      if(end_page == 0){
        //no post in board
        end_page = 1;
      }
      let start_page = Math.floor((cur_page - 1) / 10) * 10 + 1;

      //get current page
      let start = (req.query.page - 1) * limit;
      //console.time();
      let post_list = await read_db.get_post(req.params.boardname,start,limit);
      //console.timeEnd();

      //get DB page
      if(post_list&&cur_page&&start_page&&end_page)
      {
        res.render('board', {
          nav: basic_data.nav_bar,
          host_url:basic_data.host_url,
          board_title: req.params.boardname,
          post_list: post_list,
          cur_page:cur_page,
          start_page:start_page,
          end_page:end_page
        });
      }
      else {
        err_handling(404,res);
      }
    } catch (e) {
      //error
      console.log(e);
      err_handling(500,res);
    }
  },

  write_page: (req, res, next) => {
    try {
      res.render('write', {
        nav: basic_data.nav_bar,
        host_url:basic_data.host_url,
        board_title: req.params.boardname,
        modifycheck:false,
        read_post:{
          subject:"",
          contents:""
        },
      });
    } catch (e) {
      //error
      console.log(e);
      err_handling(500,res);
    }
  },

  read_page: async (req, res, next) => {
    try{
      let read_post = await read_db.get_post_one(req.params.boardname,req.params.index);
      if(read_post){
        //read_post contents setting
        read_post.contents = read_post.contents.split(/(?:\r\n|\r|\n)/g);
        //post view call
        read_db.view_good_call(req.params.boardname,req.params.index,true,false);
        //get read_post success
        res.render('read', {
          nav: basic_data.nav_bar,
          host_url:basic_data.host_url,
          board_title: req.params.boardname,
          read_post: read_post,
        })
      }
      else {
        //fail to get read_post;
        err_handling(404,res);
      }
    }catch(e) {
      //error
      console.log(e);
      err_handling(500,res);
    }
  },

  modify_page: async(req,res,next)=>{
    try{
      console.log("test");
      var read_post = await read_db.get_post_one(req.params.boardname,req.params.index);
      if(read_post){
        res.render('modify', {
          nav: basic_data.nav_bar,
          host_url:basic_data.host_url,
          board_title:req.params.boardname,
          modifycheck:true,
          read_post:read_post
        });
      }
    }
    catch(e) {
      //error
      console.log(e);
      err_handling(500,res);
    }
  },

  //POST
  board_create: async (req,res,next) => {
    try {
      //overlap check;
      let result = await read_db.get_board_data(req.body.board_name);
      if(result[0]){
        console.log(result);
        res.json("overlap");
      }
      read_db.create_new_board(req.body.board_name);
    }
    catch(e) {
      console.log("error : ",e);
      res.json("error!");
    }
  },
  write_post: (req, res, next) => {
    try {
      read_db.create_new_post(req.params.boardname,
      req.body.title,
    req.body.contents,
  new Date().toFormat('YYYY-MM-DD HH24:MI:SS'));
  res.json("success!");
    } catch (e) {
      console.log("error : ", e);
      res.json("error!");
    };
  },
  modify_post: (req,res,next) => {
    try {
      //read_db control
      read_db.modify_post(req.params.boardname,req.params.index,req.body.title,req.body.contents);
      res.json("success!");
    } catch (e) {
      console.log("error : ",e);
      res.json("error!");
    }
  },
  delete_post: (req,res,next) =>{
    try{
      console.log(`board name: ${req.params.boardname}  post index:${req.body.index} request for deletion has been received`);
      //deleting...
      read_db.delete_one_post(req.params.boardname,req.body.index);
      res.json("success!");
    }
    catch(e) {
      console.log("error : ", e);
      res.json("error!");
    };
  },

  //404 handling
  no_page: (req,res,next) =>{
    //console.log("500 handling");
    err_handling(500,res);
  }
}
