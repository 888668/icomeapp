var serverIP=localStorage.getItem("serverIP");
var access_token="......"//="24.86aef643e2c00140cb33a9cb59ff80f7.2592000.1558098870.282335-15858052"//="24.cdf4a15d5c98025153ea30af1c88465a.2592000.1556200708.282335-15858052"
var baiAPI_detect='https://aip.baidubce.com/rest/2.0/face/v3/detect' 
var baiAPI_match="https://aip.baidubce.com/rest/2.0/face/v3/match"
var url_get_access_token=serverIP+"/get_access_token"
function init_access_token(){
	mui.ajax(url_get_access_token,{
				data:{ 
					  
				},
				dataType:'jsonp',//服务器返回json格式数据
				type:'POST',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				//headers:{'Content-Type':'application/json'},//,'Access-Control-Allow-Origin':"*"
				success:function(data){
					//console.log("init_access_token成功")
					access_token=data
					//access_token="24.5b9239e84df9f0f68e35c3edd7a1fbc1.2592000.1558097939.282335-15858052"
					//alert(access_token)
				},
				error:function(xhr,type,errorThrown){
					alert("ajax error")
				},
			});
}
function match(str_base64,face_token){
	var res=""
	console.log(face_token)
	mui.ajax(baiAPI_match+"?access_token="+access_token,{
		data:
			    [{
					"image": str_base64,
					"image_type": "BASE64",
					"face_type": "LIVE",
					"quality_control": "LOW",
					"liveness_control": "HIGH"
				},
				{
					"image": face_token,
					"image_type": "FACE_TOKEN",
					"face_type": "LIVE",
					"quality_control": "LOW",
					"liveness_control": "HIGH"
				}],
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		async:false,
		headers:{'Content-Type':'application/json'},
		success:function(data){
			console.log(JSON.stringify(data))
			res=data.result.score
			
		},
		error:function(xhr,type,errorThrown){
			
		}
	});
	return res;
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




function fun_checkface(face_token) //拍照得到图片路径 加载为img 得到base64 将此与face_token对比 
//调用ajax调用百度API 返回相似度 打卡成功  将信息写入服务器 。。。
{
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
		takephoto.innerHTML="重新拍照"
		submit.style.display=""
		//console.log(event.size)
		}, function(err){}   );
		},
		function( error ) {alert( "Capture image failed: " + error.message );},{resolution:res,format:fmt}
		);
}