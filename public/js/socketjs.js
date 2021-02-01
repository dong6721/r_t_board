let new_cmt = (id,mine,nickname,text,date)=> {
  //append new_cmt
  var $input = document.createElement('li');
  $input.innerHTML =
  `<div id="cmt_id_${id}"class="comment-block">
    <div class="comment-nicknameBlock">
      <div class="comment-nicknameBox">
        <p>${nickname}</p>
      </div>
    </div>
    <div class="comment-inputtextBlock">
      <div class="comment-inputtextBox">
        <hgroup class="speech-bubble" role="textbox" maxlength="999" spellcheck="false">
          <p>${text}</p>
        </hgroup>
      </div>
    </div>
    <div class="comment-dateBlock">
      <div class="comment-dateBox">
        <p>${date}</p>
      </div>
    </div>`;
  if(mine) {
    $input.innerHTML +=`<div class="comment-deleteBlock">
      <div class="comment-deleteBox">
        <button class="comment-deletebtn">삭제</button>
      </div>
    </div>
  </div>`;
  }
  else {
    $input.innerHTML +=`<div class="comment-deleteBlock">
      <div class="comment-deleteBox">
      </div>
    </div>
  </div>`;
  }
  $("#cmt_list").append($input);
}

//comment count update function
var update_comment_count = ()=>{
  $('#cmt-count-text').html($('#cmt_list li').length + ' 개');
};

//comment websocket
const socket = io.connect('http://'+$(location).attr('host'), {
  path: '/socket.io',
});
var post_index = $(location).attr('pathname').split("/");

socket.on('cmt/'+post_index[2] + '/' + post_index[3] + '/write', (data) => {
  //new comment coming!
  console.log(data);
  //set new comment
  new_cmt(data.cmt_id,data.mine, data.nickname, data.comment, data.date);
  //comment animation
  var autoheight = $("#cmt_id_" + data.cmt_id).children(".comment-inputtextBlock").height();
  $("#cmt_id_" + data.cmt_id).children(".comment-inputtextBlock").css({
    height: 1
  });
  $("#cmt_id_" + data.cmt_id).children(".comment-inputtextBlock").animate({
    height: autoheight
  }, 500);
});

socket.on('cmt/'+post_index[2]+'/'+post_index[3]+'/typing', (data) => {
  //someone is typing comment contents or delete comment contents!
  let nickname = data.id;
  if(data.typing){
    //someone is typing
    var $input = document.createElement('li');
    $input.innerHTML =
    `<div id="${nickname}"class="comment-block">
      <div class="comment-nicknameBlock">
        <div class="comment-nicknameBox">
          <p>${nickname}</p>
        </div>
      </div>
      <div class="comment-inputtextBlock">
        <div class="comment-inputtextBox">
          <hgroup class="speech-bubble" role="textbox" maxlength="999" spellcheck="false">
            <p>. . .</p>
          </hgroup>
        </div>
      </div>
    </div>`;
    $("#cmt_list").append($input);

    //animation
    var autoheight = $('#'+nickname).children(".comment-inputtextBlock").height();
    $('#'+nickname).children(".comment-inputtextBlock").css({
      height:1
    });
    $('#'+nickname).children(".comment-inputtextBlock").animate({
      height:autoheight
    },500);
  }
  else {
    //someone delete contents
    $('#'+nickname).parent().remove();
  }
});

socket.on('cmt/'+post_index[2] +'/'+post_index[3]+'/delete', (data)=>{
    //delete existing comment!
    $('#'+data.cmt_index).parent().remove();
    update_comment_count();
});

//socket.io error
socket.on("error", (data) => {
  //comment write error!
  if (data === "cmt err!") {
    alert("comment error!");
    location.reload();
  }
});
$(document).ready(() => {
  //send comment
  $("#cmt-input-postButton").click(() => {
    var cmt_text = $("#cmt-input-text").val();
    if ($.trim(cmt_text) === "") {
      //text 내용 없을경우
      alert("내용을 입력해주세요.");
      return;
    }
    var post_data = {
      "id": $("#cmt-input-id").text(),
      "text": cmt_text
    };
    cmt_input_text_emptycheck = true;
    socket.emit('cmt/'+ post_index[2] + '/' + post_index[3] + "/typing", {typing:false});
    socket.emit('cmt/' + post_index[2] + '/' + post_index[3] + "/write", post_data);
    $("#cmt-input-text").val("");
  });

  //delete comment
  $(".comment-deletebtn").click((event)=>{
    if(confirm("delete comment?"))
    {
      let cmtblock = $(event.target).parent().parent().parent();
      socket.emit('cmt/'+ post_index[2] + '/' + post_index[3] + "/delete",{cmt_index:cmtblock.attr('id')});
    }
    else {
      //nothing happend;
    }
  });


  //comment typing effect
  var cmt_input_text_emptycheck = true;
  $("#cmt-input-text").on('input', (event) => {
    if ($.trim($("#cmt-input-text").val()) === "") {
      //emit to server nothing in comment
      cmt_input_text_emptycheck = true;
      socket.emit('cmt/'+ post_index[2] + '/' + post_index[3] + "/typing", {typing:false});
    }
    else if (cmt_input_text_emptycheck) {
      //emit to server I am typing
      cmt_input_text_emptycheck = false;
      socket.emit('cmt/'+ post_index[2] + '/' + post_index[3] + "/typing", {typing:true});
    }
  });

  update_comment_count();

  //before webpage closing
  $(window).on("beforeunload", () => {
    //comment typing update
    socket.emit('cmt/'+ post_index[2] + '/' + post_index[3] + "/typing", {typing:false});
  });
});
