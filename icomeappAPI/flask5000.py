from flask import Flask
from flask import json
from flask import request
import json as JSON
import register
import checkIdentityModule
import teacher
import student
app = Flask(__name__)

@app.route('/')
def hello_world():
    return request.method
@app.route("/teacher_regist",methods=['GET'])
def f1():
    return 'hellossss:6'
@app.route("/register",methods=['POST'])
def regist():#注册
    d=request.form
    status=register.regist(d['id'],d['name'],d['password'],d['face_token'],d['sex'])
    return status
@app.route("/checkIdentity",methods=['POST'])
def checkIdentityfunction():#登录时验证身份
    usr_id=request.form['id']
    usr_passwd=request.form['passwd']
    check_res=checkIdentityModule.checkIdentity(usr_id,usr_passwd)
    return check_res
@app.route("/get_access_token",methods=['POST'])#得到百度API access_token
def f2():
    fp=open('access_token.txt','r')
    data=fp.readline()
    fp.close()
    return data
@app.route("/teacher",methods=['POST'])#teacher的请求都放在这里
def f3():
    d = request.form
    data=""
    if(d['event']=='add_class'):
        #print(d['teacher_id'],"  ",d['class_name'])
        teacher.add(d['teacher_id'],d['class_name'])
    '''if(d['event']=='get_class_id'):
        data=teacher.get_class_id(d[teacher_name])'''
    if(d['event']=='checkPeople'):
        teacher.checkPeople(d['teacher_id'],d['class_id'],d['lon'],d['lat'])
    if(d['event']=='checkStop'):
        teacher.checkStop(d['teacher_id'],d['class_id'])
    if(d['event']=='getInviteKey'):
        print(d['class_id'])
        data=teacher.getInviteKey(d['class_id'])
    if(d['event']=='getStudentMessage'):
        teacher.create_excel(d['class_id'],'static/data/'+d['class_id']+'.xls')
    if(d['event']=='deleteClass'):
        teacher.deleteClass(d['class_id'],d['teacher_id'])
    return data
@app.route("/student",methods=['POST'])#student的请求都放在这里
def f4():
    d=request.form
    res=""
    if(d['event']=='get_lonlat'):
        res=student.get_lonlat(d['class_id'],d['lon'],d['lat'])
        print(res)
    if(d['event']=='add_class'):
        res=student.add_class(d['student_id'],d['nums'])
    if(d['event']=='sign'):
        student.sign(d['student_id'],d['class_id'])
    if(d['event']=='can_sign'):
        res=student.can_sign(d['class_id'])
    if(d['event']=='feedback'):
        student.feedback(d['class_id'],d['txt'])
    if (d['event'] == 'deleteClass'):
        student.deleteClass(d['student_id'],d['class_id'])
    return res #("\"status\":\"%s\""%(res))
#app.static('/file', '/root/wkd/data') #静态资源 url /file/x 可以访问/root/wkd/data/x
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)






'''@app.route("/index")
def a(request):
    return file('index.html')
@app.route("/js")
def a(request):
    return file('test.js')
@app.route("/")
def query_string(request):
    return json({ "parsed": True, "args": request.args, "url": request.url, "query_string": request.query_string })
'''


