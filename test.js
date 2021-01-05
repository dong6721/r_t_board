module.exports = {
  func: ()=> {
    return "test";
  },
  method: (test)=> {
    return test;
  },
  method2: (test)=>{
    return setTimeout(()=>{
      return "test message";
    },500);
  }
}
