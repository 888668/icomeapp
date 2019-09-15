import mysql_password
import pymysql
import xlwt

passwd_str=mysql_password.get_passwd()
def getConn():
    db = pymysql.connect("localhost", "root", passwd_str, 'ICOMEAPP')
    return db

def mysql2excel(database='pydb',table='test',excelResult = ''):
    conn = getConn()
    cursor = conn.cursor()
    cursor.execute("select * from `{}`".format(table))
    data_list = cursor.fetchall()
    excel = xlwt.Workbook()
    sheet = excel.add_sheet("sheet1")
    row_number = len(data_list)
    column_number = len(cursor.description)
    for i in range(column_number):
        sheet.write(0,i,cursor.description[i][0])
    for i in range(row_number):
        for j in range(column_number):
            sheet.write(i+1,j,data_list[i][j])
    excelName = "mysql_{}_{}.xls".format(database,table)
    if excelResult != '':
        excelName = excelResult
    excel.save(excelName)

if __name__ == "__main__":
    mysql2excel("","计算机网络-teacher_zhangju","myexcel")