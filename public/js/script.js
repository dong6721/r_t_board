$(document).ready(()=>{
  //ready action ( DOM Tree 생성 완료 후)
  $("#board-write-confirm").click(()=> {
    //send post
    var title = $("#board-write-title").val();
    var contents = $("#board-write-contents").val();
    if(check_write_post(title,contents)){
      return;
    }
    // console.log(title);
    // console.log(contents);
    $.ajax({
      //write post ajax
      url:get_complete_url($(location).attr('href')),
      type:"POST",
      dataType:"json",
      contentType:"application/json",
      data:
      JSON.stringify({
        "title" : title,
        "contents": contents
      }),
      success:(res)=>{
        //console.log(res);
        location.href=document.referrer;
        //alert("post is committed");
      },
      error:(req,status,err) => {
        console.log("post error!",req.responseJSON.error);
        alert("post error!");
      }
    });
  });
  $("#board-modify-confirm").click(()=>{
    //modify post
    var title = $("#board-write-title").val();
    var contents = $("#board-write-contents").val();
    if(check_write_post(title,contents)){
      return;
    }
    // console.log(title);
    // console.log(contents);
    $.ajax({
      //modify post ajax
      url:get_complete_url($(location).attr('href')).replace('/modify',''),
      type:"PUT",
      dataType:"json",
      contentType:"application/json",
      data:
      JSON.stringify({
        "title" : title,
        "contents": contents
      }),
      success:(res)=>{
        //console.log(res);
        location.href=get_complete_url($(location).attr('href')).replace('/modify','');
      },
      error:(req,status,err) =>{
        console.log("post error!",req.responseJSON.error);
        alert("post error!");
      }
    });
  });

  //test comment
  // $("#new_comment").click(()=> {
  //   new_cmt(2,"nickname","Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo. Nibh nisl condimentum id venenatis. Diam sit amet nisl suscipit. Dolor purus non enim praesent elementum facilisis leo. Quam vulputate dignissim suspendisse in est ante in nibh mauris. Tristique senectus et netus et malesuada fames ac turpis. Tincidunt eget nullam non nisi est. Eu augue ut lectus arcu bibendum at varius vel pharetra. Tincidunt arcu non sodales neque sodales ut. Odio tempor orci dapibus ultrices in iaculis nunc sed augue. Purus in mollis nunc sed. Facilisi morbi tempus iaculis urna id volutpat. Proin fermentum leo vel orci porta non. Enim diam vulputate ut pharetra sit amet aliquam id. Et netus et malesuada fames. Amet nulla facilisi morbi tempus iaculis urna id.","2020-02-02 12:32:42");
  //   var autoheight = $("#cmt_id_2").height();
  //   var autowidth = $("#cmt_id_2").width();
  //   $("#cmt_id_2").css({height:0,width:0});
  //   $("#cmt_id_2").animate({
  //     height: autoheight,
  //     width: autowidth
  //   },500);
  // });
});

let check_write_post = (title,contents)=>{
  //check post in write
  if($.trim(title) == ""){
    alert("제목을 입력해주세요.");
    return true;
  }
  if($.trim(contents) == "") {
    alert("내용을 입력해주세요.");
    return true;
  }
  return false;
}

let get_complete_url = (url)=>{
  if(url[url.length-1] =='/' || url[url.length-1] == '?'){
    return url.slice(0,-1);
  }
  return url;
}

let deletepost = (board_title,index)=>{
  if(confirm("delete?"))
  {
    //delete script
    //console.log($(location).attr('href') + "/delete");
    $.ajax({
      url: get_complete_url($(location).attr('href')),
      type:"DELETE",
      dataType:"json",
      contentType:"application/json",
      data:
      JSON.stringify({
        index:index
      }),
      success:(res)=>{
        //alert(res);
        location.href=`/board/${board_title}`;
      }
    });
  }
  else {
    //nothing happend;;
  }
}

$(document).on("pageload",()=>{
  window.location.reload(true);
});

// $(window).onload(function() {
//   //onload action(모든 페이지 구성요소 페인팅 완료 후)
// });
