process.env.UV_THREADPOOL_SIZE=6;
const start = Date.now();
function t(text) {
  setTimeout(()=>{
    let a = new Array(50000);
    for(let i=0;i<50000;i++) {
      a[i] = i;
    }
    console.log(text,":",Date.now() - start);
  },1000);
}
t("a");
t("b");
t("c");
t("d");
t("e");
t("f");
