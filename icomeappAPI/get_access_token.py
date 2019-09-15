import urllib3, sys
import ssl
import json
# client_id 为官网获取的AK， client_secret 为官网获取的SK
def get():
    http=urllib3.PoolManager()
    ak='rxbUisBRn6BZ7z4LicR2uzZI'
    sk='dsUVojXyhKcoj8ttDtgtQcXvP2VWXruH'
    r=http.request('POST','https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='+ak+'&client_secret='+sk
    ,headers={'Content-Type':'application/json; charset=UTF-8'})
    print(r.data)
    dic=json.loads(r.data.decode('utf-8'))
    data=dic['access_token']
    fp=open('access_token.txt','w')
    fp.write(data)
    fp.close()
    #return dic["access_token"]#dic["access_token"]#str类型
if __name__=="__main__":
    get()

