var db = require("./schema.js");


let get_time = (time)=>{
  //time format redefinition
  var postTime = time.toFormat('YYYY-MM-DD');
  if(time.toFormat('YYYY-MM-DD') === new Date().toFormat('YYYY-MM-DD')){
    postTime = time.toFormat('HH24:MI:SS');
  }
  return postTime;
};

module.exports = {
  get_post: async (board_name, num, num2) => {
    //get recently post list in 'board_name' range in num and num2
    var board = await db(board_name, "postSchema");
    var post_list;
    await board.find({},{}, {
      //sort 역방향
      sort: {
        index: -1
      },
      //limit num2 - num
      limit: num2 - num,
      //skip num element
      skip: num
    }, (err, docs) => {
      if (err) {
        console.log("get_post_recently find error!", err);
        return "error";
      }
      //범위의 수 보다 작은 경우 check
      var cnt = num2 - num < docs.length ? num2 - num : docs.length;
      post_list = new Array(cnt);
      //insert element
      for (var i = 0; i < post_list.length; i++) {
        post_list[i] = {
          index: docs[i].index,
          subject: docs[i].title,
          contents:docs[i].contents,
          author: docs[i].author,
          date: get_time(docs[i].date),
          viewcnt: docs[i].viewcnt,
          goodcnt: docs[i].goodcnt
        }
      }
    });
    return post_list;
  },

  get_post_one: async (board_name,index,view_call,good_call) => {
    //get one post data
    var board = await db(board_name,"postSchema");
    var read_post;
    await board.findOne({index:index},(err,doc)=>{
      if (err) {
        console.log("find one error!", err);
        return res.status(500).json({
          error: err
        });
      }
      read_post = {
        index: doc.index,
        subject: doc.title,
        contents:doc.contents,
        author: doc.author,
        date: get_time(doc.date),
        viewcnt: doc.viewcnt,
        goodcnt: doc.goodcnt,
        comment: doc.comment
      };
      //post view call
      if(view_call){
        doc.viewcnt++;
      }
      //post good call
      if(good_call){
        doc.goodcnt++;
      }
      doc.save();
    });
    return read_post;
  },

  create_new_post: async (board_name,title,contents,time) => {
    var board = await db(board_name, "postSchema");
    board.create({
      title: title,
      contents: contents,
      author: "nickname",
      date: time
    }, (err, user) => {
      if (err) {
        console.log("create fail", err);
      } else {
        console.log("success!");
      }
    });
  }
}
