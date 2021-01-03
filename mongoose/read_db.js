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
          sort: {
            index: -1
          },
          limit: num2
        }, (err, docs) => {
          if (err) {
            console.log("get_post_recently find error!", err);
            return "error";
          }
          post_list = new Array(num2 - num);
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
