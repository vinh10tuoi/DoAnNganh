from flask import Flask, request, jsonify, send_from_directory, url_for
from flask_cors import CORS, cross_origin  
from datetime import timedelta
from datetime import datetime
import os
from werkzeug.utils import secure_filename

def format_timedelta(timedelta_obj):
    total_seconds = int(timedelta_obj.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

def configure_song_controller(app, mysql):

    @app.route('/song')
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def song():
        conn = mysql.connection
        cur = conn.cursor()

        cur.execute('USE albumdb')
        cur.execute('SELECT s.SongID, s.TitleID, t.Title, s.ReleaseDate, s.ArtistID, a.Name AS Artist, s.Length, s.UserID, u.UserName AS User, s.Path FROM song s LEFT JOIN title t ON s.TitleID = t.TitleID LEFT JOIN artist a ON s.ArtistID = a.ArtistID LEFT JOIN user u ON s.UserID = u.UserID')

        songs = cur.fetchall()
        cur.close()

        song_list = []
        for song in songs:
            song_object = {
                'SongID': song[0],
                'TitleID': song[1],
                'Title': song[2],  # Thêm thông tin Title
                'ReleaseDate': song[3].isoformat(),
                'ArtistID': song[4],
                'Artist': song[5],  # Thêm thông tin Artist
                'Length': song[6],
                'UserID': song[7],
                'User': song[8],  # Thêm thông tin User
                'Path': song[9]
            }
            song_list.append(song_object)

        return jsonify(songs=song_list)


    @app.route('/add_song', methods=['POST'])
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def add_song():
        # Thêm bài hát mới
        data = request.get_json()
        title_id = data.get('title_id')
        release_date = datetime.fromisoformat(data.get('release_date').replace('Z', '+00:00')).date()
        artist_id = data.get('artist_id')
        length = data.get('length')
        user_id = data.get('user_id')
        path = data.get('path')

        conn = mysql.connection
        cur = conn.cursor()

        cur.execute('USE albumdb')
        cur.execute(
            "INSERT INTO song (TitleID, ReleaseDate, ArtistID, Length, UserID, Path) VALUES (%s, %s, %s, %s, %s, %s)", (title_id, release_date, artist_id, length, user_id, path))
        conn.commit()
        cur.close()

        return jsonify({'message': 'Bài hát đã được thêm thành công'})

    @app.route('/update_song/<int:song_id>', methods=['PUT'])
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def update_song(song_id):
        # Cập nhật thông tin bài hát
        data = request.get_json()
        title_id = data.get('title_id')
        release_date = datetime.fromisoformat(data.get('release_date').replace('Z', '+00:00')).date()
        artist_id = data.get('artist_id')
        length = data.get('length')
        user_id = data.get('user_id')
        path = data.get('path')

        conn = mysql.connection
        cur = conn.cursor()

        cur.execute('USE albumdb')
        cur.execute(
            "UPDATE song SET TitleID = %s, ReleaseDate = %s, ArtistID = %s, Length = %s, UserID = %s, Path = %s WHERE SongID = %s", (title_id, release_date, artist_id, length, user_id, path, song_id))
        conn.commit()
        cur.close()

        return jsonify({'message': 'Thông tin bài hát đã được cập nhật'})

    @app.route('/delete_song/<int:song_id>', methods=['DELETE'])
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def delete_song(song_id):
        # Xóa bài hát
        conn = mysql.connection
        cur = conn.cursor()

        cur.execute('USE albumdb')
        cur.execute("DELETE FROM song WHERE SongID = %s", (song_id,))
        conn.commit()
        cur.close()

        return jsonify({'message': 'Bài hát đã được xóa'})
    
    @app.route('/song/<int:song_id>', methods=['GET'])
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def get_song(song_id):
        conn = mysql.connection
        cur = conn.cursor()

        cur.execute('USE albumdb')
        cur.execute("SELECT * FROM song WHERE SongID = %s", (song_id,))
        song = cur.fetchone()
        cur.close()

        if song:
            song_info = {
                'SongID': song[0],
                'TitleID': song[1],
                'ReleaseDate': song[2],
                'ArtistID': song[3],
                'Length': song[4],
                'UserID': song[5],
                'Path': song[6]
            }
            return jsonify({'song': song_info})
        else:
            return jsonify({'error': 'Không tìm thấy bài hát với ID đã cho'})
        
    app.config['UPLOAD_FOLDER'] = './mp3'  
    app.config['UPLOAD_URL'] = '/mp3'  

    @app.route('/upload_mp3', methods=['POST'])
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def upload_mp3():
        if 'mp3' not in request.files:
            return jsonify({'error': 'No file part'})

        mp3_file = request.files['mp3']

        if mp3_file.filename == '':
            return jsonify({'error': 'No selected file'})

        if mp3_file and mp3_file.filename.endswith('.mp3'):
            filename = secure_filename(mp3_file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            mp3_file.save(file_path)
            file_url = url_for('uploaded_file', filename=filename)
            return jsonify({'message': 'MP3 file uploaded successfully', 'file_url': file_url})
        else:
            return jsonify({'error': 'Invalid file format'})

    @app.route('/uploads/<filename>')
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
    @app.route('/get_mp3/<filename>')
    @cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
    def get_mp3(filename):
        mp3_directory = request.args.get('mp3_directory')
        if mp3_directory:
            return send_from_directory(mp3_directory, filename)
        return 'Mp3 directory not provided', 404

