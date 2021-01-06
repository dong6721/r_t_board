const db = require('./mongoose/schema');

//server start, initialize server data
async function dbINIT() {
  console.log("INIT: Database Initialize start");
  console.log("INIT: database post counter init start")
  let bddata = await db("boarddata","boarddataSchema");
  bddata.find({},{
    _id:false,
    board_name:true,
    postcnt:true
  },async (err,docs)=>{
    for(let i=0;i<docs.length;i++){
      let board = await db(docs[i].board_name,"postSchema");
      let cnt = board.countDocuments({});
      docs[i].postcnt = cnt;
      docs[i].save();
    }
  });
  console.log("INIT: database post counter init complete");

}

module.exports= ()=>{
  //database initialize
  dbINIT();
};
