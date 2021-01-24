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
      var num = 1; //home board number
      var home_board = new Array(num);
      var board_name = new Array(num);
      board_name[0] = "board";  //임시 value
      for(var i=0;i<num;i++){
        //게시물 7개까지 작성 가능
        home_board[i] = await read_db.get_post(board_name[i],0,7);
      }
      res.render('home', {
        nav: basic_data.nav_bar,
        board_name:board_name,
        home_board:home_board
      });
    }
    catch(e){
      console.log(e);
      err_handling(500,res);
    }
  },
  board_post_list_page: async (req, res, next) => {
    try {
      //error처리
      /*var board = await db(req.params.boardname,"postSchema");
      if(board === "no collection")
      {
        //not exist board
        res.send("존재하지 않는 게시판입니다");
        return;
      }*/

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

      /*var col = db("identitycounters", "cntSchema");
      col.findOne({ model: "board"},{_id:false,model:true,count:true},(err,docs)=>{
        cnt = docs.count;
      });*/
      //get DB page
      if(post_list&&cur_page&&start_page&&end_page)
      {
        res.render('board', {
          nav: basic_data.nav_bar,
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
    res.render('write', {
      nav: basic_data.nav_bar,
      board_title: req.params.boardname
    });
  },

  read_page: async (req, res, next) => {
    try{
      //var board = await db(req.params.boardname,"postSchema");
      //console.log(board.collection);
      var read_post = await read_db.get_post_one(req.params.boardname,req.params.index,true,false);
      if(read_post){
        //get read_post success
        res.render('read', {
          nav: basic_data.nav_bar,
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

  //POST
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
    err_handling(500,res);
  }
}
