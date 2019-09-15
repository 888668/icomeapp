var serverIP=localStorage.getItem("serverIP");
url_teacher=serverIP+'/teacher'
document.addEventListener('plusready',function(){
				var iconToIndex=document.getElementById('registerToIndex')
				iconToIndex.addEventListener('tap',function(){
				plus.webview.getWebviewById('teacher.html').hide()
				},false)
				var addClass=document.getElementById("addClass");
				addClass.addEventListener("tap",function(){
					tantantan()
				})
				plus.webview.getWebviewById("teacher.html").addEventListener("show",function(){  
					var list=localStorage.getItem("teacher").split(',')
					var class_list=document.getElementById("class_list")
					class_list.innerHTML=""
					if(list[0]=="")return;
					for(var i=0;i<list.length;i++){
						var s="<li  id='list{0}' class='mui-table-view-cell'>{1}</li>".replace("{1}",list[i]);
						s=s.replace("{0}",""+i)
						class_list.innerHTML+=s
						/*class_list.innerHTML+=
						"<li  id='class_list{0}' class='mui-table-view-cell'>{1}</li>".replace("{1}",list[i]);
					*/}
					for(var i=0;i<list.length;i++)
					{
						var listi=document.getElementById("list"+i)
						//console.log(list[listi.id.substring(4,listi.id.length)])
						listi.addEventListener("tap",function(event){
							list=localStorage.getItem("teacher").split(',')
							var obj=event.target||event.srcElement;
							class_id=list[obj.id.substring(4,obj.id.length)]
							st=window.localStorage
							st.setItem("class_id",class_id)//
							plus.webview.getWebviewById("teacher_class.html").show()
							plus.webview.getWebviewById("teacher.html").hide()
						},false)
					}
					
				},false);
			},false) 
			

function tantantan()
{
	console.log(window.localStorage.getItem('teacher_id'))
	mui.prompt('请输入课程名','xxxx ',"  ",function(e){
	if(e.index == 1){							
		var class_name=e.value
		if(class_name!="")
		{
			mui.ajax(url_teacher,{
				data:{
					"event":"add_class",
					"teacher_id":window.localStorage.getItem('teacher_id'),
					"class_name":class_name
				},
				//headers:{'Content-Type':'application/json'},
				//dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				success:function(data){
					alert("创建成功 请重新登陆")
					plus.webview.getWebviewById("teacher.html").hide()
				},
				error:function(xhr,type,errorThrown){
					
				}
			});
			/*var class_list=document.getElementById("class_list")
			var str_li="<li  id='class_list{0}' class='mui-table-view-cell'>{1}</li>"
			str_li=str_li.replace('{1}',class_name)
			var list=document.getElementsByTagName('li');
			str_li=str_li.replace("{0}",list.length)
			alert(str_li)
			class_list.innerHTML+=str_li*/
		}
	}else{
		mui.toast('您取消了输入');
	}
});
}