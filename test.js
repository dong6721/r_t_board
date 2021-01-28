// process.env.UV_THREADPOOL_SIZE=6;
// const start = Date.now();
// function t(text) {
//   setTimeout(()=>{
//     let a = new Array(50000);
//     for(let i=0;i<50000;i++) {
//       a[i] = i;
//     }
//     console.log(text,":",Date.now() - start);
//   },1000);
// }
// t("a");
// t("b");
// t("c");
// t("d");
// t("e");
// t("f");
//
// //foreach 비동기 test
// var a = [1,2,3,4,5];
// console.log("test");
// a.forEach((element) => {
//   setTimeout(()=>{
//     console.log("timeout:",element);
//   },0);
//   console.log(element);
// });
// console.log("test2");

module.exports = {
  test: (test,test2)=>{
    console.log(test,"here!");
  }
}
