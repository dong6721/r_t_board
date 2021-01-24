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
    let board = await db(board_name, "postSchema");
    let post_list;
    try{
      let docs = await board.find({deleted:false},{}, {
        //sort 역방향
        sort: {
          index: -1
        },
        //limit num2 - num
        limit: num2,
        //skip num element
        skip: num
      });
      //범위의 수 보다 작은 경우 check
      var cnt = num2 < docs.length ? num2 : docs.length;
      post_list = new Array(cnt);
      //insert element
      for (var i = 0; i < post_list.length; i++) {
        post_list[i] = {
          index: docs[i].index,
          subject: docs[i].title,
          author: docs[i].author,
          date: get_time(docs[i].date),
          viewcnt: docs[i].viewcnt,
          goodcnt: docs[i].goodcnt
        }
      }
    }
    catch(e){
      console.error(e);
    }
    return post_list;
  },

  get_post_one: async (board_name,index,view_call,good_call) => {
    //get one post data
    let board = await db(board_name,"postSchema");
    let read_post;
    try {
      let doc = await board.findOne({index:index,deleted:false});
      if(doc)
      {
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
      }
    }
    catch(e) {
      console.error(e);
    }
    return read_post;
  },

  cnt_update: async (board_name,number) =>{
    let boarddata = await db("boarddata","boarddataSchema");
    boarddata.findOne({board_name:board_name},(err,doc)=>{
      if(err) {
        console.error(err);
      }
      try{
        doc.postcnt+=number;
        doc.save();
      }
      catch(e){
        console.error(e);
      }
    });
  },

  create_new_post: async (board_name,title,contents,time) => {
    let board = await db(board_name, "postSchema");
    board.create({
      title: title,
      contents: contents,
      author: "nickname",
      date: time
    }, (err, user) => {
      if (err) {
        console.log("create fail", err);
      }
      try{
        count_update(board_name,1);
        console.log("success!");
      }
      catch(e) {
        console.error(e);
      }
    });
  },

  create_new_comment: async (board_name,index,id,contents,time)=>{
    let board = await db(board_name, "postSchema");
    let doc = await board.findOne({index:index});
    if(!doc) {
      console.log("create comment fail!",board_name,index,id,contents,time);
      return console.log("find one error!", err);
    };
    doc.comment.push({
      nickname: id,
      comment: contents,
      date: time
    });
    doc.save();
    return doc.comment.length - 1;
  },

  delete_one_post: async (board_name,index) => {
    let board = await db(board_name, "postSchema");
    board.updateOne({index: index},{deleted:true},(err,res)=>{
      if(err){
        console.log("post deleted error!",board_name,index);
        return console.log(err);
      }
    });
  },

  delete_one_comment: async (board_name,index,cmt_index) => {
    let board = await db(board_name, "postSchema");
    let cmt_idx = cmt_index.split('_')[2];
    board.updateOne({index:index},{comment[cmt_idx].deleted:true},(err,doc)=>{
      if(err){
        console.log("comment deleted error!",board_name,index,cmt_index);
        return console.log(err);
      }
    });
  },

  get_board_cnt: async (board_name) =>{
    let boarddata = await db("boarddata","boarddataSchema");
    let doc = await boarddata.findOne({board_name:board_name});
    return doc.postcnt;
  }
}
