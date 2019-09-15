import pymysql
import mysql_password
passwd_str=mysql_password.get_passwd()
def checkIdentity(id,passwd):
    status=''
    if(id[0:7]=='teacher'):
        try:
            db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
            cursor = db.cursor()
            sql = """
            SELECT * FROM `teacher` WHERE `id` = '%s'
            """ % (id)
            cursor.execute(sql)
            results = cursor.fetchall()
            '''for res in results:
                print(res[0],res[1])'''
            if (len(results) == 0):
                status = '{"status":"此用户名未注册"}'
            elif (results[0][1] == passwd):
                status = results[0][3]
            else:
                status = '{"status":"密码输入错误"}'
        except Exception:
            status = '{"status":"Exception"}'
        return status
    try:
        db=pymysql.connect("localhost","root",passwd_str,'ICOMEAPP')
        cursor = db.cursor()
        sql="""
        SELECT * FROM `usr1` WHERE `id` = '%s'
        """%(id)
        cursor.execute(sql)
        results = cursor.fetchall()
        '''for res in results:
            print(res[0],res[1])'''
        if(len(results)==0):
            status='{"status":"此用户名未注册"}'
        elif(results[0][2]==passwd):
            s1=results[0][5]
            s2=results[0][3]

            status=(s1[0:len(s1)-1]+',"face_token":"'+s2+'"}')
        else:
            status='{"status":"密码输入错误"}'
    except Exception:
        status='{"status":"Exception"}'
    db.close()
    return status
#print(checkIdentity('1','1'))