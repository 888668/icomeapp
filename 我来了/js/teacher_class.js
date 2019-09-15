var serverIP=localStorage.getItem("serverIP");
url_teacher=serverIP+'/teacher'
var class_id
var teacher_id
//var lon,lat
document.addEventListener("plusready",function(){
	var toTeacher=document.getElementById("toTeacher")
	toTeacher.addEventListener("tap",function(){
		plus.webview.getWebviewById("teacher_class.html").hide()
		plus.webview.getWebviewById("teacher.html").show()
	})
	var checkPeople=document.getElementById("checkPeople")
	checkPeople.addEventListener("tap",function(){//扫脸查人
		
		sentPosition()
		
		
		var btnArray = ['取消查人'];
		mui.confirm('同学们可以签到了  查人中......', 'xxxx', btnArray, function(e) {
		    if (e.index == 0) {
				checkStop()
		    } else {
		        
		    }
		})
		
	})
	var seeFeedback=document.getElementById("seeFeedback") //查看学生反馈信息
	seeFeedback.addEventListener("tap",function(){
		
				var file_url=serverIP+"/static/data/"+class_id+'-'+teacher_id+'.txt'
				//alert(file_url)
				var dtask = plus.downloader.createDownload(file_url, {}, function(d, status){
				// 下载完成
				if(status == 200){ 
					plus.runtime.openFile(d.filename)
				} else {
					 alert("Download failed: " + status); 
				}  
				});
			//dtask.addEventListener("statechanged", onStateChanged, false);
			dtask.start(); 
			
			
	})
	var seeStudentMessage=document.getElementById("seeStudentMessage") //学生信息汇总
	seeStudentMessage.addEventListener("tap",function(){
		mui.ajax(url_teacher,{
			data:{
				"event":"getStudentMessage",
				"class_id":class_id+'-'+teacher_id
			},
			//headers:{'Content-Type':'application/json'},
			dataType:'jsonp',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				var file_url=serverIP+"/static/data/"+class_id+'-'+teacher_id+'.xls'
				//alert(file_url)
				var dtask = plus.downloader.createDownload(file_url, {}, function(d, status){
				// 下载完成
				if(status == 200){ 
					plus.runtime.openFile(d.filename)
				} else {
					 alert("Download failed: " + status); 
				}  
			});
			//dtask.addEventListener("statechanged", onStateChanged, false);
			dtask.start(); 
			
			},
			error:function(xhr,type,errorThrown){
				alert('error')
			}
		});
	})
	var getInviteKey=document.getElementById("getInviteKey")
	getInviteKey.addEventListener("tap",function(){
		mui.ajax(url_teacher,{
			data:{
				"event":"getInviteKey",
				"class_id":class_id+'-'+teacher_id
			},
			//headers:{'Content-Type':'application/json'},
			dataType:'jsonp',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				alert("课堂邀请码为： "+data)
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
		//alert("课堂邀请码: "+1234)
	})
	var deleteClass=document.getElementById("deleteClass")
	deleteClass.addEventListener("tap",function(){
		mui.ajax(url_teacher,{
			data:{
				"event":"deleteClass",
				"class_id":class_id,
				"teacher_id":teacher_id
			},
			//headers:{'Content-Type':'application/json'},
			dataType:'jsonp',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				alert("删除成功 请重新登陆")
				plus.webview.getWebviewById("teacher_class.html").hide()
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	})
	
	plus.webview.getWebviewById("teacher_class.html").addEventListener("show",function(){
		st=window.localStorage
		class_id=st.getItem("class_id")
		teacher_id=st.getItem("teacher_id")
	},false)
})
function checkStop(){
	mui.ajax(url_teacher,{
		data:{
			"event":"checkStop",
			"teacher_id":teacher_id,
			"class_id":class_id
		},
		//headers:{'Content-Type':'application/json'},
		dataType:'json',//服务器返回json格式数据 
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			
		},
		error:function(xhr,type,errorThrown){
			
		}
	});
}
function mf(lon,lat){
	mui.ajax(url_teacher,{
		data:{
			"event":"checkPeople",
			"teacher_id":teacher_id,
			"class_id":class_id,
			"lon":lon,
			"lat":lat
		},
		//headers:{'Content-Type':'application/json'},
		//dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			//alert('success')
		},
		error:function(xhr,type,errorThrown){
			alert(errorThrown)
		}
	});
	console.log(lon)
	console.log(lat)
}
function sentPosition(){
	var lon1,lon2,lat1,lat2
	plus.geolocation.getCurrentPosition(function(p){
		var s=JSON.stringify(p);
		lon1=p.coords.longitude; 
		lat1=p.coords.latitude;
		plus.geolocation.getCurrentPosition(function(p){
			var s=JSON.stringify(p);
			lon2=p.coords.longitude; 
			lat2=p.coords.latitude;
			
			lon=(lon1+lon2)/2;
			lat=(lat1+lat2)/2;
			mf(lon,lat)
		},function(e){
			mark=0;
			//console.log(e.message);
		},false)
	},function(e){
		//console.log(e.message);
	},false)
}
