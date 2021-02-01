const read_db = require("../mongoose/read_db");
const basic_data = require('../data/basic_data');
const crypto = require ('crypto');

module.exports = {
  //get
  //main_page
  login_page: (req,res,next)=> {
    if(req.session.login){
      //already login data is in
      if(req.headers.referer) { //redirect to post page or main_page
        res.redirect(req.headers.referer);
      }
      else {
        res.redirect(basic_data.host_url);
      }
    }
    else {
      res.render('login_home');
    }
  },
  logout_page: (req,res,next)=>{
    //delete login data from session
    if(req.session.login) {
      req.session.login = undefined;
    }
    //redirect to post page or main_page
    if(req.headers.referer) {
      res.redirect(req.headers.referer);
    }
    else {
      res.redirect(basic_data.host_url);
    }
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
          req.session.login = {
            id:doc.userid,
            uid:doc.uid,
          };
          if(doc.admin) {
            console.log("관리자 로그인:",doc.userid);
            req.session.login.admin = doc.admin;
          };
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
