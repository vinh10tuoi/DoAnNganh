from flask import request, jsonify
from flask_cors import CORS, cross_origin  


def configure_artist_controller(app, mysql):

    @app.route('/artist', methods=['POST'])
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def create_artist():
        data = request.get_json()
        name = data.get('name')

        if not name:
            return jsonify({'error': 'Vui lòng cung cấp tên nghệ sĩ'})

        cur = mysql.connection.cursor()
        cur.execute('USE albumdb')

        cur.execute("INSERT INTO artist (Name) VALUES (%s)", (name,))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Nghệ sĩ đã được tạo thành công'})

    # API để lấy danh sách nghệ sĩ
    @app.route('/artist', methods=['GET'])
    def get_artists():
        cur = mysql.connection.cursor()
        cur.execute('USE albumdb')
        cur.execute("SELECT * FROM artist")
        artists = cur.fetchall()
        cur.close()

        artist_list = [{'ArtistID': artist[0], 'Name': artist[1]} for artist in artists]

        return jsonify({'artists': artist_list})

    # API để cập nhật thông tin nghệ sĩ
    @app.route('/artist/<int:artist_id>', methods=['PUT'])
    def update_artist(artist_id):
        data = request.get_json()
        name = data.get('name')

        cur = mysql.connection.cursor()
        cur.execute('USE albumdb')

        cur.execute("UPDATE artist SET Name = %s WHERE ArtistID = %s", (name, artist_id))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Thông tin nghệ sĩ đã được cập nhật'})

    # API để xóa nghệ sĩ
    @app.route('/artist/<int:artist_id>', methods=['DELETE'])
    def delete_artist(artist_id):
        cur = mysql.connection.cursor()
        cur.execute('USE albumdb')

        cur.execute("DELETE FROM artist WHERE ArtistID = %s", (artist_id,))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Nghệ sĩ đã được xóa'})
    
    @app.route('/artist/<int:artist_id>', methods=['GET'])
    def get_artist(artist_id):
        cur = mysql.connection.cursor()
        cur.execute('USE albumdb')

        cur.execute("SELECT * FROM artist WHERE ArtistID = %s", (artist_id,))
        artist = cur.fetchone()
        cur.close()

        if artist:
            artist_info = {'ArtistID': artist[0], 'Name': artist[1]}
            return jsonify({'artist': artist_info})
        else:
            return jsonify({'error': 'Không tìm thấy nghệ sĩ với ID đã cho'})
