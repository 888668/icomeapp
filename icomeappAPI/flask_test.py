from flask import Flask
from flask import request
app = Flask(__name__)

@app.route('/pos',methods=['POST'])
def f1():
    print(request.form['username'])
    return "hello"
@app.route('/get/',methods=['GET'])#
def hello_world():
    #print(request.args['id'])
    #print(request.args[0])
    print(request.args)
    return ""+request.args

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)