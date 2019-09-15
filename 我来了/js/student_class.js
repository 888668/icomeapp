var serverIP=localStorage.getItem("serverIP");
var url_student=serverIP+"/student"
document.addEventListener("plusready",function(){
	
	var toMain=document.getElementById("toMain")//返回键
	toMain.addEventListener("tap",function(){
		plus.webview.getWebviewById("student_class.html").hide()
		plus.webview.getWebviewById("main.html").show()
	})
	
	var sign=document.getElementById("sign") //扫脸签到
	sign.addEventListener("tap",function(){
		f_sign();
	})
	var feedback=document.getElementById("feedback")//匿名反馈
	feedback.addEventListener("tap",function(){
		 mui.prompt('请输入反馈意见','文本默认值','标题',new Array('取消','匿名提交'),function(e){
                    if(e.index == 1){ 
                        mui.toast(e.value); 
						mui.ajax(url_student,{
							data:{
								"event":"feedback",
								//"student_id":window.localStorage.getItem('student_id'),//匿名
								"class_id":window.localStorage.getItem('class_id') ,
								"txt":e.value
								
							},
							//headers:{'Content-Type':'application/json'},
							//dataType:'json',//服务器返回json格式数据
							type:'post',//HTTP请求类型
							timeout:10000,//超时时间设置为10秒；
							success:function(data){
								
							},
							error:function(xhr,type,errorThrown){
								
							}
						});
                    }else{
                        mui.toast('您取消了输入');
                    }
                });
	})
	var deleteClass=document.getElementById("deleteClass")//
	deleteClass.addEventListener("tap",function(){
		mui.ajax(url_student,{
			data:{
				"event":"deleteClass",
				"student_id":window.localStorage.getItem('student_id'),//匿名
				"class_id":window.localStorage.getItem('class_id')
				
			},
			//headers:{'Content-Type':'application/json'},
			//dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				alert("删除成功 请重新登陆")
				plus.webview.getWebviewById("student_class.html").hide()
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	})
	plus.webview.getWebviewById("student_class.html").addEventListener("show",function(){
		st=window.localStorage
		var class_id=st.getItem("class_id")
		
	},false)
	
	
})
function f_sign()
{
	//先发送请求，教师是否发起查人
	var can_sign=0;
	mui.ajax(url_student,{
		data:{
			"event":"can_sign",
			//"student_id":window.localStorage.getItem('student_id'),
			"class_id":window.localStorage.getItem('class_id')
		},
		//headers:{'Content-Type':'application/json'},
		dataType:'jsonp',//服务器返回json格式数据
		async:false,
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			console.log(data)
			if(data=="can_sign"){
				can_sign=1;
			}
			else{
				alert("教师未查人")
			}
		},
		error:function(xhr,type,errorThrown){
			alert("ajax错误")
		}
	});
	if(can_sign==0)return;
	//1 拍照->照片->div->base64 +根据face_token->相似度->够80->签到成功
	var cmr=plus.camera.getCamera()
	var res = cmr.supportedImageResolutions[0];
	var fmt = cmr.supportedImageFormats[0];
	cmr.captureImage( function( path ){
		plus.zip.compressImage( {
		src:path,
		dst:path,
		overwrite:true,
		quality:50,
		//rotate:90
		}, function(event){
		var _src=event.target;
		//alert(_src) //输出图片路径
		pic_face.src=_src
		pic_face.onload=function(){
			var str_base64=getBase64Image(pic_face);
			//console.log(str_base64) //成功输出HaHaHa~
			var face_token=window.localStorage.getItem("face_token")//成功得到
			var res=match(str_base64,face_token)//得到相似度 match函数在function.js中定义
			if(res<80){
				
				alert("请本人签到");
				return;
			}
			check_distance();//检查位置信息 完成签到
			
			
		}
		
		}, function(err){});
		},
		function( error ) {alert( "Capture image failed: " + error.message );},{resolution:res,format:fmt}
		);
	
}
function signYES(){ //签到成功部分
	
	mui.ajax(url_student,{
		data:{
			"event":"sign",
			"student_id":window.localStorage.getItem('student_id'),
			"class_id":window.localStorage.getItem('class_id')
		},
		//headers:{'Content-Type':'application/json'},
		//dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			alert('签到成功！')
		},
		error:function(xhr,type,errorThrown){
			
		}
	});
}
function getBase64Image(img) 
{ 
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
	var dataURL = canvas.toDataURL("image/" + ext);
	dataURL=dataURL.substring(dataURL.indexOf(',')+1,dataURL.length) //去掉头 data:image/png;base64,iVBORw0K根据的是逗号
	//可能之后会出错
    return dataURL;
}
function check_distance(){ //与老师距离小于50米代表OK 返回1

	//需要向服务器发送请求得到老师精度 纬度

	plus.geolocation.getCurrentPosition(function(p){
		var s=JSON.stringify(p);
		var lon=p.coords.longitude;
		var lat=p.coords.latitude;
		mui.ajax(url_student,{
			data:{
				"event":"get_lonlat",
				"class_id":window.localStorage.getItem('class_id'),
				"lon":lon,
				"lat":lat
			},
			//headers:{'Content-Type':'application/json'},
			//dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				if(data=="yes"){
					signYES()
				}
				else{
					alert("请在教室签到")
				}
				//处理得到的服务器端经度纬度
			},
			error:function(xhr,type,errorThrown){
				console.log('gps check ajax 错误')
			}
		});
	},function(e){
		
	},false)
	return 1;
}

