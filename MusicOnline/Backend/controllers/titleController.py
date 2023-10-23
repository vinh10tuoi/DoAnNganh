from flask import render_template, request, jsonify
from flask_cors import CORS, cross_origin
from flask_mysqldb import MySQL
from database import create_db_connection


def configure_title_controller(app, mysql):

    @app.route('/add_title', methods=['POST'])
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def add_title():
        data = request.get_json()
        title_name = data.get('title_name')

        if not title_name:
            return jsonify({'error': 'Vui lòng cung cấp tên tiêu đề'})

        cur = mysql.connection.cursor()
        cur.execute('USE albumdb')

        cur.execute("INSERT INTO title (Title) VALUES (%s)", (title_name,))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Tiêu đề đã được thêm thành công'})
    
    @app.route('/get_title/<int:title_id>', methods=['GET'])
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def get_title(title_id):
        cur = mysql.connection.cursor()
        cur.execute('USE albumdb')

        cur.execute("SELECT * FROM title WHERE TitleID = %s", (title_id,))
        title = cur.fetchone()
        cur.close()

        if title:
            title_info = {'TitleID': title[0], 'Title': title[1]}
            return jsonify({'title': title_info})
        else:
            return jsonify({'error': 'Không tìm thấy tiêu đề với ID đã cho'})

    @app.route('/update_title/<int:title_id>', methods=['PUT'])
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def update_title(title_id):
        data = request.get_json()
        title_name = data.get('title_name')

        if not title_name:
            return jsonify({'error': 'Vui lòng cung cấp tên tiêu đề'})

        cur = mysql.connection.cursor()
        cur.execute('USE albumdb')

        cur.execute("UPDATE title SET Title = %s WHERE TitleID = %s", (title_name, title_id))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Thông tin tiêu đề đã được cập nhật'})

    @app.route('/delete_title/<int:title_id>', methods=['DELETE'])
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def delete_title(title_id):
        cur = mysql.connection.cursor()
        cur.execute('USE albumdb')

        cur.execute("DELETE FROM title WHERE TitleID = %s", (title_id,))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Tiêu đề đã bị xóa'})

    @app.route('/list_titles', methods=['GET'])
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def list_titles():
        cur = mysql.connection.cursor()
        cur.execute('USE albumdb')

        cur.execute("SELECT * FROM title")
        titles = cur.fetchall()
        cur.close()

        title_list = [{'TitleID': title[0], 'Title': title[1]} for title in titles]
        
        return jsonify({'titles': title_list})
