var serverIP=localStorage.getItem("serverIP");

//qqqqq:student加入课堂 改两个表的信息。。
url_student=serverIP+'/student'
document.addEventListener('plusready',function(){
				
	/*var wvs=plus.webview.all();
	for(var i=0;i<wvs.length;i++){
		console.log('webview'+i+': '+wvs[i].getURL());
	}*/
	//plus.webview.getWebviewById("HBuilder").close() //关闭
	
	var mainToIndex=document.getElementById('mainToIndex')
	mainToIndex.addEventListener('tap',function(){
	plus.webview.getWebviewById('main.html').hide()
	},false)
	
	var addClass=document.getElementById("addClass");
	addClass.addEventListener("tap",function(){
		tantantan()
	})
	plus.webview.getWebviewById("main.html").addEventListener("show",function(){
		
		
		var list=localStorage.getItem("student").split(',')
		var class_list=document.getElementById("class_list")
		class_list.innerHTML=""
		if(list[0]=="")return;//list为空
		
		for(var i=0;i<list.length;i++){
			var s="<li  id='list{0}' class='mui-table-view-cell'>{1}</li>".replace("{1}",list[i]);
			s=s.replace("{0}",""+i)
			class_list.innerHTML+=s
		}
		for(var i=0;i<list.length;i++)
		{
			var listi=document.getElementById("list"+i)
			//console.log(list[listi.id.substring(4,listi.id.length)])
			listi.addEventListener("tap",function(event){
				list=localStorage.getItem("student").split(',')
				var obj=event.target||event.srcElement;
				class_id=list[obj.id.substring(4,obj.id.length)]
				st=window.localStorage
				st.setItem("class_id",class_id)//
				plus.webview.getWebviewById("student_class.html").show()
				plus.webview.getWebviewById("main.html").hide()
			},false)
		}
		
		
	},false);
	
},false) 

function tantantan()
{
	mui.prompt('请输入课堂邀请码', 'xxxx', 'Hello', "", function(e) {
		if (e.index == 1) {
			//alert(e.value)
			mui.ajax(url_student,{
				data:{
					"event":"add_class",
					"student_id":window.localStorage.getItem('student_id'),
					"nums":e.value
				},
				//headers:{'Content-Type':'application/json'},
				//dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				success:function(data){
					if(data=="1"){
						alert("添加成功 请重新登陆");
						plus.webview.getWebviewById('main.html').hide()
					}
					
					else alert("邀请码不正确")
					
				},
				error:function(xhr,type,errorThrown){
					alert("邀请码不正确")
				}
			});
		} else {
			 alert( '您点了取消按钮'); 
		}
	})
            
}