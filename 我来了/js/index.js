localStorage.setItem("serverIP","http://152.136.158.218:5000");
var serverIP=localStorage.getItem("serverIP");
document.addEventListener('plusready',function(){
			init_access_token()
			/*if(window.localStorage){
			var data=localStorage.getItem('1051003502')
			alert(data);
		}*/
			var btn_login=document.getElementById('btn_login')
			//var index=plus.webview.create('index.html','index.html',{top:"0px",bottom:"50px"});
			var main=plus.webview.create('main.html','main.html',{top:"0px",bottom:"50px"});
			main.hide()
			var register=plus.webview.create('register.html','register.html',{top:"0px",bottom:"50px"});
			register.hide()
			var teacher=plus.webview.create('teacher.html','teacher.html',{top:"0px",bottom:"50px"});
			teacher.hide()
			var teacher=plus.webview.create('student_class.html','student_class.html',{top:"0px",bottom:"50px"});
			teacher.hide()
			var teacher=plus.webview.create('teacher_class.html','teacher_class.html',{top:"0px",bottom:"50px"});
			teacher.hide() 
			var w=plus.webview.currentWebview();
			//w.append(index)
			w.append(main)
			w.append(register)
			//w.append(teacher)
			//index.show()
			
			var btn_login=document.getElementById('btn_login')
			btn_login.addEventListener('tap',function(){
				var id=document.getElementById('id')
				var passwd=document.getElementById('passwd')
				var data=checkIdentity(id.value,passwd.value)
				//console.log(data)
				var json_data=JSON.parse(data) 
				//console.log(json_data.t_class_id)
				if(json_data.hasOwnProperty("s_class_id"))
				{
					if(window.localStorage){
						st=window.localStorage
						st.setItem("student",json_data.s_class_id)
						st.setItem("student_id",id.value)
						st.setItem("face_token",json_data.face_token)
					plus.webview.getWebviewById('main.html').show()
					}
				}
				else if(json_data.hasOwnProperty("t_class_id"))
				{
					if(window.localStorage){
						st=window.localStorage
						st.setItem("teacher",json_data.t_class_id )
						st.setItem("teacher_id",id.value)
						//st[student]=json_data
					plus.webview.getWebviewById('teacher.html').show()
					}
					
				}
				else
				{
					alert(status)
				}
				
				//plus.webview.getWebviewById('index.html').hide()
			})
			var btn_register=document.getElementById('btn_register')
			btn_register.addEventListener('tap',function(){
				var re=plus.webview.getWebviewById('register.html')
				re.show()
			})
		})
function checkIdentity(id,passwd)
{
	status='';
	mui.ajax(serverIP+'/checkIdentity',{
			data:{ 
				'id':id,
				'passwd':passwd
			}, 
			async:false,
			//dataType:'jsonp',
			type:'post',//HTTP请求类型
			timeout:5000,//超时时间设置为10秒
			
			//headers:{'Content-Type':'application/json'},//,'Access-Control-Allow-Origin':"*"
			success:function(data){
				//console.log(data)
				status=(data)
			},
			error:function(xhr,type,errorThrown){
				status="服务器网络状态差"
				//alert("服务器网络状态差");
			},
		});
	return status
}