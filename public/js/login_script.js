$(document).ready(function(){
	//login button
	$(".loginBox-confirmButton").click(()=>{
		if(errcheck($("#loginBox-errMessageBox"),$("#userid"),$("#userpassword"),""))
		{
			$.ajax({
				url: $(location).attr('href'),
				type: "POST",
				dataType: "json",
				contentType:"application/json",
				data:
				JSON.stringify({
					"id": $("#userid").val(),
					"ps": $("#userpassword").val()
				}),
				success:(result)=>{
					console.log("login ",result);
					if(result === "success!")
					{
						//alert("login success!");
						location.href = document.referrer;
					}
					else if(result === "fail!")
					{
						//alert("login fail!");
						//fail message to html
					}
				},
				error:(request,status,error)=>{
					console.log("login error!",request.responseJSON.error);
					if(request.responseJSON.error === "id not found")
					{
						 alert("찾을 수 없는 아이디입니다.");
					}
				}
			});
		}
	});
	//new id create dialog setting
	var dialog = $( "#newIdDialog" ).dialog({
			dialogClass: "noTitleStuff",
			autoOpen: false,
			resizable: false,
			draggable: false,
			height: 400,
			width: 350,
			modal: true,
			buttons: {
				submit: ()=> {
					//ajax POST new create id
					if(errcheck($("#newIdBox-errMessageBox"),$("#newuserid"),$("#newuserpassword"),$("#newuserpassword2")))
					{
						$.ajax({
							url:$(location).attr('href') + "/register",
							type: "POST",
							dataType: "json",
							contentType:"application/json",
							data:
							JSON.stringify({
								"id": $("#newuserid").val(),
								"ps": $("#newuserpassword").val()
							}),
							success: (result)=> {
								console.log(result);
								dialog.dialog( "close" );
							},
							error:(request,status,error)=>{
								console.log("create id fail!",error);
								alert("error!",error);
							}
						});
					}
				},
				Cancel: ()=> {
					dialog.dialog( "close" );
				}
			},
			open: function (event, ui) {/*
								$(".ui-widget-overlay").click(function () {
										$('#newIdDialog').dialog('close');
								});*/
							},
			close: function() {
				$("#newuserid").val("");
				$("#newuserpassword").val("");
				$("#newuserpassword2").val("");
			}
		});

		$(".ui-dialog").css("background","#24292E");
		$(".ui-widget-content").css("background","#24292E");
		$(".loginBox-newIdButton").click(()=>{
			dialog.dialog( "open" );
		});
});

function errcheck(a,b,c,d){
	//err check message
	a.html("");
	if(b.val() === "")
	{
		a.append("<div>아이디를 입력해 주십시오.</div>");
	}
	if(c.val() === "")
	{
		a.append("<div>비밀번호를 입력해 주십시오.</div>");
	}
	else if(d !== "" && (c.val() !== d.val()))
	{
		a.append("<div>비밀번호확인 과 비밀번호가 일치하지 않습니다.</div>");
	}

	if(a.html() === ""){
		return true;
	}
	else {
		return false;
	}
};
