import pymysql
import json
import mysql_password
import os

passwd_str=mysql_password.get_passwd()
def add(teacher_name,class_name):
    try:
        db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
        cursor = db.cursor()
        #改teacher表的class_id字段
        sql = """
                SELECT `class_id` FROM `teacher` WHERE `id` = '%s'
                """ % (teacher_name)
        cursor.execute(sql)
        results = cursor.fetchall()
        json_str=results[0][0]
        dic=json.loads(json_str)
        dic['t_class_id'].append(class_name)
        class_id=json.dumps(dic,ensure_ascii=False)
        sql = """UPDATE `teacher` SET `class_id`='%s' WHERE (`id`='%s') LIMIT 1
        """%(class_id,teacher_name)
        cursor.execute(sql)
        db.commit()  # 不commit不行
        # 建立课堂表，学生加入到这个表中，便于管理学生的课堂表现信息
        sql=""" 
        CREATE TABLE `%s-%s` (
        `usr1_id` varchar(20) NOT NULL,
        `json` text
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        """%(class_name,teacher_name)
        cursor.execute(sql)
        db.commit()

    except Exception:
        print(Exception)
        status='Exception'
    db.close()
def checkPeople(teacher_id,class_id,lon,lat):
    #建立查人文件

    table = class_id + '-' + teacher_id
    fp=open('class_data/'+table,'w')
    fp.write('\n\n666666666666666666666666666')
    fp.close()
    #建立教师位置文件
    doc='location_data/'+teacher_id
    fp=open(doc,'w')
    fp.writelines(str(lon)+"\n")
    #fp.write('\n')
    fp.writelines(str(lat)+"\n")
    fp.close()
    #total_sign+=1
    try:
        db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
        cursor = db.cursor()
        sql = """
        SELECT * FROM `%s` WHERE `usr1_id` = 'total_sign' LIMIT 0, 1000
                            """ % table
        cursor.execute(sql)
        results = cursor.fetchall()
        res = int(results[0][1])
        res+=1
        sql="""
        UPDATE
        `%s`
        SET
        `json` = '%d'
        WHERE(`usr1_id` = 'total_sign') LIMIT 1
        """%(table,res)
        cursor.execute(sql)
        db.commit()  # 不commit不行
    except Exception:
        print('异常')
    db.close()
def checkStop(teacher_id,class_id):
    txt = 'class_data/'+class_id + '-' + teacher_id
    os.remove(txt)
'''def get_class_id(teacher_name):
    res=""
    try:
        db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
        cursor = db.cursor()
        sql = """
                        SELECT `class_id` FROM `teacher` WHERE `id` = '%s'
                        """ % (teacher_name)
        cursor.execute(sql)
        results = cursor.fetchall()
        res = results[0][0]
    except Exception:
        status='Exception'
    db.close()
    return res'''

if __name__=='__main__':
    checkPeople('teacher_zhangju','计算机网络')