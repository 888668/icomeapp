var serverIP=localStorage.getItem("serverIP");
function add(img,id)
{
	var d="";
	//console.log(access_token)
	mui.ajax(baiAPI_detect+"?access_token="+access_token,{
		data:{
			image:getBase64Image(img),
			image_type:"BASE64",
			face_field:"beauty,gender",
			liveness_control:"HIGH" 
			
		},
		async:false,
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:5000,//超时时间设置为10秒；
		//headers:{'Content-Type':'application/json'},
		success:function(data){
			
			d=JSON.stringify(data);
			//console.log(d)
			/*
			//d=data.result.face_list[0].face_token;
			//console.log(JSON.stringify(data)); 
			
			var extra="";
			var beau=data.result.face_list[0].beauty;
			if(data.result.face_list[0].gender.type=="female" )
			{
				
				if(beau<50)extra="             你很有气质！"
				else if(beau>=50 && beau<55)extra="           美人微笑转星眸，不施粉黛天然美。"
				else if(beau<=60)extra="           绿意盎然遍葱茏，姣姣丽质蕴其中。"
				else if(beau<=65)extra="           美如冠玉 红飞翠舞"
				else if(beau<=70)extra="           一笑倾人城，再笑倾人国"
				else extra="           今朝得见真仪容，方知梦中不是仙"
				
			}
			else
			{
				//alert(beau)
				if(beau<50)extra="             你这块肌肉长得不错"
				else extra="           帅"
			}
			//"result":{"face_num":1,"face_list":[{"face_token":"921556150d3f2e23a64459aa48ec89ad","location":{"left":98.12,"top":141.52,"width":149,"height":165,"rotation":0},"face_probability":1,"angle":{"yaw":-2.25,"pitch":7.97,"roll":-2.57},"beauty":58.4}]}
			var score=data.result.face_list[0].beauty
			alert("您的颜值得分为:"+score+" (满分100)"+extra);*/
		},
		error:function(xhr,type,errorThrown){
			alert('ajax错误');
			d='0'
		}
	});
	mui.ajax('https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add'+'?access_token='+access_token,{
			data:{
				image:getBase64Image(img),
				image_type:'BASE64',
				group_id:'usr',
				user_id:id, 
			},
			//async:false,
			dataType:'jsonp',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			
			//headers:{'Content-Type':'application/json'},//,'Access-Control-Allow-Origin':"*"
			success:function(data){
			},
			error:function(xhr,type,errorThrown){
				alert("ajax error")
			},
		});
		return d;
}

function checkmessage(id,passwd1,passwd2,name,face_token,sex){
	var txt=[id,passwd1,passwd2,name,face_token,sex]
	for(var i=0;i<4;i++)
	{
		if(txt[i].length==0)return "请将信息填写完整";
	}
	if(passwd1!=passwd2)return "两次密码输入不一致";
	return '1';
}
function sentregister(id,passwd1,name,face_token,sex)
{
	//console.log(id+passwd1+name+face_token+sex)
	mui.ajax(serverIP+'/register',{
			data:{
				'id':id,
				'password':passwd1,
				'name':name,
				'face_token':face_token,
				'sex':sex,
				//'liveness_control':'NORMAL'
			},
			//async:false,
			//dataType:'jsonp',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:5000,//超时时间设置为10秒 
			
			//headers:{'Content-Type':'application/json'},//,'Access-Control-Allow-Origin':"*"
			success:function(data){
				if(JSON.stringify(data)!='"注册成功"')
				{
					alert("此账号已被注册")
					//reture 0;
				}
				else
				{
					/*if(window.localStorage){
						var data_json={
							'id':id,
							'passwd1':passwd1,
							'name':name,
							'face_token':face_token,
							'sex':sex
						}
						localStorage.setItem("ICOMEAPP_regist",JSON.stringify(data_json));
					}*/
					var chi_sex;
					if(sex=="1")chi_sex="先生" 
					else chi_sex="女士"
					alert(name+chi_sex+"，您已经注册成功:")
				}
				
			},
			error:function(xhr,type,errorThrown){
				alert("服务器网络状态差")
				/*console.log(xhr)
				console.log(type)
				console.log(errorThrown)*/
			},
		});
}