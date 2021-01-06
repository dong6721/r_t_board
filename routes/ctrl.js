const read_db = require('../mongoose/read_db');
const db = require('../mongoose/schema');


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
        nav: ["nav1", "nav2", "nav3", "nav4"],
        board_name:board_name,
        home_board:home_board
      });
    }
    catch(e){
      console.log(e);
      res.send(e);
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

      let limit = 20; //1 page per document
      let start = (req.query.page - 1) * limit;

      //console.time();
      var post_list = await read_db.get_post(req.params.boardname,start,limit);
      //console.timeEnd();
      /*var col = db("identitycounters", "cntSchema");
      col.findOne({ model: "board"},{_id:false,model:true,count:true},(err,docs)=>{
        cnt = docs.count;
      });*/
      //get DB page

      res.render('board', {
        nav: ["nav1", "nav2", "nav3", "nav4"],
        board_title: req.params.boardname,
        post_list: post_list
      });
    } catch (e) {
      //error
      console.log(e);
      res.send(e);
    }
  },
  write_page: (req, res, next) => {
    res.render('write', {
      nav: ["nav1", "nav2", "nav3", "nav4"],
      board_title: req.params.boardname
    });
  },
  read_page: async (req, res, next) => {
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
      //error
      console.log(e);
      res.send(e);
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
    };
  }




}
