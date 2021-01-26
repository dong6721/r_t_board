const mongoose = require('./mongoose');
const Schema = mongoose.Schema;
const autoincrement = require('mongoose-auto-increment');
autoincrement.initialize(mongoose.connection);
//schema 정리
/*
required: boolean or function, if true adds a required validator for this property
default: Any or function, sets a default value for the path. If the value is a function, the return value of the function is used as the default.
select: boolean, specifies default projections for queries
validate: function, adds a validator function for this property
get: function, defines a custom getter for this property using Object.defineProperty().
set: function, defines a custom setter for this property using Object.defineProperty().
alias: string, mongoose >= 4.10.0 only. Defines a virtual with the given name that gets/sets this path.
immutable: boolean, defines path as immutable. Mongoose prevents you from changing immutable paths unless the parent document has isNew: true.
transform: function, Mongoose calls this function when you call Document#toJSON() function, including when you JSON.stringify() a document.

indexes
index: boolean, whether to define an index on this property.
unique: boolean, whether to define a unique index on this property.
sparse: boolean, whether to define a sparse index on this property.

String
lowercase: boolean, whether to always call .toLowerCase() on the value
uppercase: boolean, whether to always call .toUpperCase() on the value
trim: boolean, whether to always call .trim() on the value
match: RegExp, creates a validator that checks if the value matches the given regular expression
enum: Array, creates a validator that checks if the value is in the given array.
minLength: Number, creates a validator that checks if the value length is not less than the given number
maxLength: Number, creates a validator that checks if the value length is not greater than the given number
populate: Object, sets default populate options

Number
min: Number, creates a validator that checks if the value is greater than or equal to the given minimum.
max: Number, creates a validator that checks if the value is less than or equal to the given maximum.
enum: Array, creates a validator that checks if the value is strictly equal to one of the values in the given array.
populate: Object, sets default populate options

Date
min: Date
max: Date

ObjectID
populate: Object, sets default populate options

more data is : https://mongoosejs.com/docs/schematypes.html#schematype-options
*/
//COMMENT(댓글) schema
const cmtSchema = new Schema({
  nickname: { //nickname data schema 추후 id number로 바꿀 예정
    type : String,
    required: true
  },
  comment: { //comment 내용
    type : String,
    required: true
  },
  date: {   //작성 날짜
    type : Date,
    required: true
  },
  deleted: {
    type : Boolean,
    default : false
  }
});
//POST(게시물) schema
const postSchema = new Schema({
  index: {
    type: Number,
    unique:true
  },
  title: {
    type : String
  },
  contents: {
    type : String
  },
  author: {
    type : String
  },
  date: {
    type:Date
  },
  viewcnt: {
    type:Number,
    default: 0
  },
  goodcnt: {
    type:Number,
    default: 0
  },
  deleted: {
    type : Boolean,
    default : false
  },
  comment : [ cmtSchema ]
});

//identitycounters schema
const counterSchema = new Schema({
  count: {
    type : Number
  },
  model: {
    type : String
  },
  field: {
    type: String
  }
});

//boarddata schema
const boarddataSchema = new Schema({
  board_name: {
    type: String,
    unique:true
  },
  postcnt: {
    type : Number,
    default: 0
  },
  active_post: {
    type : Number,
    default: 0
  }
});

//initialize auto autoincrement
mongoose.model("boarddata",boarddataSchema,"boarddata").find({},(err,docs)=>{
  if(err)
  {
    console.error(err);
  }
  for(let i=0;i<docs.length;i++)
  {
    console.log(`initialize ${docs[i].board_name} autoincrement data`)
    postSchema.plugin(autoincrement.plugin,{
      model: docs[i].board_name,
      field: 'index',
      startAt: 1,
      increment: 1
    });
  };
});

module.exports = async (req,schema_name)=>{
  //check collection name
  let res;
  await mongoose.model("boarddata",boarddataSchema,"boarddata").findOne({board_name:req},(err,doc)=>{
    if(err) {
      console.error(err);
    };
    res = doc;
  });
  try{
    if(res === "")
    {
      //no board name here
      return "no collection";
    }
    else {
      //collection is exist
      //get model
      if(schema_name === "postSchema"){
        return mongoose.model(req,postSchema,req);
      }
      else if(schema_name === "cntSchema"){
        return mongoose.model(req,counterSchema,req);
      }
      else if(schema_name === "boarddataSchema"){
        return mongoose.model(req,boarddataSchema,req);
      }
    }
  }
  catch(err){
    console.error(err);
  }
};
