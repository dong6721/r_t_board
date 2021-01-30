const read_db = require("../mongoose/read_db");
const basic_data = require('../data/basic_data');
const crypto = require ('crypto');

module.exports = {
  check_login: (req,res,next)=> {
    console.log("check_login pattern");
    let login_bool = true;
    if(login_bool){
      //login_user
      next();
    }
    else {
      //login check fail
      res.redirect(basic_data.host_url);
    }
  },
  //get
  //main_page
  login_page: (req,res,next)=> {
    //session part
    // console.log(req.sessionID);
    // if(req.session.login === "login"){
    //   req.session.login = "test";
    //   res.redirect('/success');
    // }
    // else {
    //   res.render('login_home');
    // }
    res.render('login_home');
  },

  //post
  //login action
  login_request: async (req,res,next) => {
    try{
      let doc = await read_db.get_login_data(req.body.id);
      console.log("login request");
      if(!doc) {
        console.log("no data in DB!");
        res.status(400).json({error: 'id not found'});
      }
      crypto.pbkdf2(req.body.ps, doc.userpsbuf , 100000, 64, 'sha512', (err,key)=>{
        if(key.toString().trim() == doc.userps){
          //req.session.login = "login";    //로그인 세션인증이 필요.
          console.log("login success");
          res.json("success!");
        }
        else {
          console.log("login fail");
          res.json("fail!");
        }
      });
    }
    catch(e) {
      console.log(e);
      res.status(500).json({error:e});
      //restart option
    }
  },
  //create action
  login_create: (req,res,next) => {
    console.log("register request");
    crypto.randomBytes(64, (err, buf) => {
      crypto.pbkdf2(req.body.ps, buf.toString('base64'), 100000, 64, 'sha512',  (err, key)=> {
        result = key;
        read_db.create_login_data(req.body.id,result,buf.toString('base64'));
        //console.log(toString(result));
        res.json("create!");
      });
    });
  }
}
