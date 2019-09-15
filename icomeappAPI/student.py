import pymysql
import mysql_password
import json
import os
passwd_str=mysql_password.get_passwd()
def add_class(student_id,nums):
    #根据num 在num-class中找class表名字
    #在class表中加此学生信息
    #在usr1表中修改信息
    db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
    cursor = db.cursor()
    sql = """
    SELECT * FROM `num-class` WHERE `invite_num` = '%s'
          """ % (nums)  #查询
    cursor.execute(sql)
    results = cursor.fetchall()
    if(len(results)==0):
        return "num error"
    class_name=results[0][1] #得到了class_name
    sql="""
    INSERT INTO `%s` (`usr1_id`, `sign`, `submit`) VALUES ('%s', '0', '0')
    """%(class_name,student_id)
    cursor.execute(sql)
    db.commit()
    sql="""
    SELECT * FROM `usr1` WHERE `id` = '%s' 
    """%(student_id)
    cursor.execute(sql)
    results=cursor.fetchall()
    dic = json.loads(results[0][5])
    dic['s_class_id'].append(class_name)
    json_str=json.dumps(dic,ensure_ascii=False)
    sql = """UPDATE `usr1` SET `class_id`='%s' WHERE (`id`='%s') LIMIT 1
            """ % (json_str, student_id)
    cursor.execute(sql)
    db.commit()
    #print(class_name)
    #print(student_id,nums)
    db.close()
    return "1"
def deleteClass(student_id,class_id):
    db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
    cursor = db.cursor()
    sql = """
        SELECT * FROM `usr1` WHERE `id` = '%s' 
        """ % (student_id)
    cursor.execute(sql)
    results = cursor.fetchall()
    dic = json.loads(results[0][5])
    dic['s_class_id'].remove(class_id)
    json_str = json.dumps(dic, ensure_ascii=False)
    sql = """UPDATE `usr1` SET `class_id`='%s' WHERE (`id`='%s') LIMIT 1
                """ % (json_str, student_id)
    cursor.execute(sql)
    db.commit()
    sql="""
    DELETE FROM `%s` WHERE (`usr1_id`='%s')
    """%(class_id,student_id)
    cursor.execute(sql)
    db.commit()
    db.close()
def sign(student_id,class_id):#修改class_id表 中的数据sign
    db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
    cursor = db.cursor()
    fp = open('static/class_data/' + class_id, 'a+')
    fp.write(student_id+'\r\n')
    fp.close()

    return
def can_sign(class_id):
    filetext="static/class_data/"+class_id

    print(filetext)
    if(os.path.exists(filetext)):
        print("存在")
        return "can_sign"
    else:
        return ""
def get_lonlat(class_id,lon,lat):
    fp=open('static/location_data/'+class_id,"r")
    line=fp.readline();
    fp.close()
    lonlat=line.split(',')
    if(float(lonlat[0])-float(lon)<=0.003 and float(lonlat[1])-float(lat)<=0.003):
        return "yes"
    else:
        return "no"
def feedback(class_id,txt): #向文件中追加写入txt
    fp=open('static/data/'+class_id+'.txt','a+')
    fp.write(txt + '\r\n\r\n')
    fp.close()
if __name__=="__main__":
    fp = open('static/class_data/' + 1, 'a+')
    fp.writelines( 'abcdefg\nabc111' )
    fp.close()
