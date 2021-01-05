const read_db = require('../mongoose/read_db');

module.exports = {
  main: async (req,res,next) => {
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
  },
  board_post_list: async (req, res, next) => {
    try {
      //error처리
      /*var board = await db(req.params.boardname,"postSchema");
      if(board === "no collection")
      {
        //not exist board
        res.send("존재하지 않는 게시판입니다");
        return;
      }*/

      //console.time();
      var post_list = await read_db.get_post(req.params.boardname,0,20);
      //console.timeEnd();
      /*var col = db("identitycounters", "cntSchema");
      col.findOne({ model: "board"},{_id:false,model:true,count:true},(err,docs)=>{
        cnt = docs.count;
      });*/
      //get DB page
      if (req.query.page === undefined || req.query.page === 1) {
        //page = 1
      }
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




}
