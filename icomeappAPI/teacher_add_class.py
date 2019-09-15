import pymysql
import json
import mysql_password
passwd_str=mysql_password.get_passwd()
def add(teacher_name,class_name):
    try:
        db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
        cursor = db.cursor()
        sql = """
                SELECT `class_id` FROM `teacher` WHERE `id` = '%s'
                """ % (teacher_name)
        cursor.execute(sql)
        results = cursor.fetchall()
        #for i in results:
            #print(i)
        json_str=results[0][0]
        #print(json_str)
        #print('end line')
        dic=json.loads(json_str)
        #print(dic['class_id'],type(dic['class_id']))
        dic['t_class_id'].append(class_name)
        class_id=json.dumps(dic,ensure_ascii=False)
        sql = """UPDATE `teacher` SET `class_id`='%s' WHERE (`id`='%s') LIMIT 1
        """%(class_id,teacher_name)
        #sql="""
        #UPDATE `teacher` SET `class_id`='{\"t_class_id\":[\"计算机网络\", \"软件项目管理\",\"789\"]}' WHERE (`id`='teacher_zhangju') LIMIT 1
        #"""
        print(sql)
        #print(sql) #{"class_id":["计算机网络","软件项目管理"]}
        cursor.execute(sql)
        db.commit()  # 不commit不行
    except Exception:
        print(Exception)
        status='Exception'
    db.close()

def get_class_id(teacher_name):
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
    return res
if __name__=='__main__':
    add('teacher','5555')