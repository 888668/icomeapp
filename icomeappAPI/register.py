import pymysql
import mysql_password
passwd_str=mysql_password.get_passwd()
def regist(stuid,name,password,face_token,sex):
    status="注册成功"
    print(stuid,name,password,face_token,sex)

    #print(passwd_str+"--")
    try:
        db=pymysql.connect("localhost","root",passwd_str,'ICOMEAPP')
        cursor = db.cursor()
        sql="""
        INSERT INTO `usr1` (`id`, `name`, `password`, `face_token`, `sex`, `class_id`) VALUES ('%s', '%s', '%s', '%s', '%s','{"s_class_id": []}')
        """%(stuid,name,password,face_token,sex)
        cursor.execute(sql)
        db.commit()
    except Exception:
        db.rollback()
        print('插入错误已经回滚')
        status=Exception
    db.close()
    return status
#status=regist("23366666666","1","1","1","1")
#print (status)