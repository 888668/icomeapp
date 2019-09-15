import json
data={
    'a':1,
    'name':'zhaoxin',
    'old':20
}
str=json.dumps(data)
print()
#print('python原始数据',repr(data))
#print('json对象',str)
pydic=json.loads(str)
print('a:  ',pydic['a'])
print('name: ',pydic['name'])
print('old:  ',pydic['old'])
