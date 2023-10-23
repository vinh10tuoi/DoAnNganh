from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from controllers.songController import configure_song_controller
from controllers.titleController import configure_title_controller
from controllers.artistController import configure_artist_controller
from database import create_db_connection

import os
from werkzeug.utils import secure_filename
from flask_mysqldb import MySQL

app = Flask(__name__)
app.debug = True

app.secret_key = 'your_secret_key_here'
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:port"}})

mysql = create_db_connection(app)
configure_song_controller(app, mysql)
configure_title_controller(app, mysql)
configure_artist_controller(app, mysql)


@app.route('/login', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content- Type', 'Authorization'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Vui lòng cung cấp tên đăng nhập và mật khẩu'})

    cur = mysql.connection.cursor()
    cur.execute('USE albumdb')

    cur.execute(
        "SELECT * FROM user WHERE UserName = %s AND PassWord = %s", (username, password))
    user = cur.fetchone()

    cur.close()

    if user:
        user_info = {
            'user_id': user[0],
            'username': user[1],
        }
        return jsonify({'message': 'Đăng nhập thành công', 'user_info': user_info})
    else:
        return jsonify({'error': 'Đăng nhập thất bại'})


@app.route('/register', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content- Type', 'Authorization'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Vui lòng cung cấp tên đăng nhập và mật khẩu'})

    cur = mysql.connection.cursor()
    cur.execute('USE albumdb')

    # Kiểm tra xem tên đăng nhập đã tồn tại hay chưa
    cur.execute("SELECT * FROM user WHERE UserName = %s", (username,))
    existing_user = cur.fetchone()

    if existing_user:
        cur.close()
        return jsonify({'error': 'Tên đăng nhập đã tồn tại'})

    # Nếu tên đăng nhập chưa tồn tại, thực hiện đăng ký
    cur.execute("INSERT INTO user (UserName, PassWord) VALUES (%s, %s)", (username, password))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Đăng ký thành công'})


@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Đã đăng xuất'})


if __name__ == '__main__':
    app.run()
