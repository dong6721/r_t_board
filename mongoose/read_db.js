var db = require("./schema.js");

module.exports = {
  get_post: async (board_name, num, num2) => {
    //get recently post list in 'board_name' range in num and num2
    var board = await db(board_name, "postSchema");
    var post_list;
    await board.find({}, {
      _id: false,
      index: true,
      title: true,
      author: true,
      date: true,
      viewcnt: true,
      goodcnt: true
    }, {
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
    return post_list;
  }
}
