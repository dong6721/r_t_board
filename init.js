const db = require('./mongoose/schema');

//server start, initialize server data
async function dbINIT() {
  console.log("INIT: Database Initialize start");
  console.log("INIT: database post counter init start")
  let bddata = await db("boarddata","boarddataSchema");
  let list = await bddata.find();
  console.log("INIT: board list length is :",list.length);
  for(let i=0;i<list.length;i++){
    console.log("INIT: board name '",list[i].board_name,"' is now updating...");
    let name= list[i].board_name;
    let board = await db(name,"postSchema");
    let cnt = await board.countDocuments({});
    bddata.updateOne({board_name:name},{postcnt:cnt});
    console.log("INIT: board name '",list[i].board_name,"' update completed");
  }
  console.log("INIT: database post counter init complete");  
}

module.exports= ()=>{
  //database initialize
  dbINIT();
};
