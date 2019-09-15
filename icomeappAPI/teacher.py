import pymysql
import json
import mysql_password
import os
import random
import xlwt
import student
passwd_str=mysql_password.get_passwd()
def add(teacher_name,class_name): #添加课堂
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
        `usr1_id`  varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
        `sign`  varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
        `submit`  varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
        PRIMARY KEY (`usr1_id`)
        )
        ENGINE=InnoDB
        DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
        ROW_FORMAT=COMPACT
        ;
        """%(class_name,teacher_name)
        cursor.execute(sql)
        db.commit()

        key=getKey()  #key 是 str
        sql="""
       INSERT INTO `num-class` (`invite_num`, `class_name`) VALUES ('%s', '%s')
        """%(key,class_name+'-'+teacher_name)
        cursor.execute(sql)
        db.commit()
        #产生key 插入num-class表中
        #random.uniform(10, 20)
    except Exception:
        print(Exception)
        status='Exception'
    db.close()
def checkPeople(teacher_id,class_id,lon,lat):
    #建立查人文件

    table = class_id + '-' + teacher_id
    fp=open('static/class_data/'+table,'w')
    #fp.write('')#这句并没有卵用
    fp.close()
    #建立教师位置文件
    doc='static/location_data/'+class_id+"-"+teacher_id
    fp=open(doc,'w')
    fp.write(str(lon)+","+str(lat))
    fp.close()

    #total_sign+=1
    try:
        db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
        cursor = db.cursor()
        sql = """update `%s` set sign = (sign+1) where usr1_id ='teacher' """ % table
        cursor.execute(sql)
        db.commit()  # 不commit不行
    except Exception:
        print(str(Exception))
    db.close()
def checkStop(teacher_id,class_id):
    doc = 'static/class_data/'+class_id + '-' + teacher_id #签到表
    #首先把签到表中的学生读到集合里 为的是去除重复
    SET=set()
    fp=open(doc,"r")
    for line in fp:
        SET.add(line)
    fp.close()
    # 然后再依次执行sign=sign+1操作
    db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
    cursor = db.cursor()
    for usr1_id in SET:
        sql = '''
            update `%s` set sign = (sign+1) where usr1_id =%s 
            ''' % (class_id + '-' + teacher_id, usr1_id)
        cursor.execute(sql)
    db.commit()
    db.close()


    os.remove(doc) #最后把此文件删除 学生就不能继续签到了
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
def getKey(): #返回key str类型
    fp = open("static/key/001", "r+")
    num=fp.readline().strip('\n')
    num=int(num)
    fp.seek(0)
    fp.truncate()
    fp.writelines(str(num+1))
    fp.close()
    return str(num+1)
def getInviteKey(class_id):
    #根据class_id 在表num-class中找到key然后返回
    print(class_id)
    sql="""
    SELECT * FROM `num-class` WHERE `class_name` = '%s'
    """%(class_id)
    db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
    cursor = db.cursor()
    cursor.execute(sql)
    results = cursor.fetchall()
    res = results[0][0]
    return res
def create_excel(class_id,excelResult = ''):
    conn = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
    cursor = conn.cursor()
    cursor.execute("""
    SELECT
	usr1.id,
	usr1.`name`,
	`{}`.sign,
	`{}`.submit
FROM
	usr1
INNER JOIN `{}` ON usr1.id = `{}`.usr1_id
    """.format(class_id,class_id,class_id,class_id))
    data_list = cursor.fetchall()

    excel = xlwt.Workbook()
    sheet = excel.add_sheet("sheet1")
    row_number = len(data_list)
    column_number = len(cursor.description)
    for i in range(column_number):
        sheet.write(0, i, cursor.description[i][0])
    for i in range(row_number):
        for j in range(column_number):
            sheet.write(i + 1, j, data_list[i][j])
    excelName = excelResult
    excel.save(excelName)
    conn.close()
def deleteClass(class_id,teacher_name):
    class_name=class_id+'-'+teacher_name
    db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
    cursor = db.cursor()
    # 改teacher表的class_id字段
    sql = """
                    SELECT `class_id` FROM `teacher` WHERE `id` = '%s'
                    """ % (teacher_name)
    cursor.execute(sql)
    results = cursor.fetchall()
    json_str = results[0][0]
    dic = json.loads(json_str)
    if class_id in dic['t_class_id']:
        dic['t_class_id'].remove(class_id) #删除一门课
    new_class_id = json.dumps(dic, ensure_ascii=False)
    sql = """UPDATE `teacher` SET `class_id`='%s' WHERE (`id`='%s') LIMIT 1
            """ % (new_class_id, teacher_name)
    cursor.execute(sql)
    db.commit()  # 不commit不行
    sql = """
                               SELECT usr1_id FROM `%s`  LIMIT 0, 1000
                                """ % (class_id + '-' + teacher_name)
    cursor.execute(sql)
    results = cursor.fetchall()
    for id in results:
        student.deleteClass(id[0],class_id + '-' + teacher_name)
    sql="DROP TABLE `%s`"%(class_id + '-' + teacher_name)
    cursor.execute(sql)
    db.commit()
    sql="delete from `num-class` where(`class_name`='%s')"%(class_id + '-' + teacher_name)
    cursor.execute(sql)
    db.commit()
    db.close()

if __name__=="__main__":
    create_excel("计算机网络-teacher_zhangju","data.xls")

    sql = """
                           SELECT usr1_id FROM `%s`  LIMIT 0, 1000
                            """ % (class_id + '-' + teacher_name)
    cursor.execute(sql)
    results = cursor.fetchall()
    for id in results:
        print(id[0])
    db.close()