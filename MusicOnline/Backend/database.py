from flask import Flask
from flask_mysqldb import MySQL


app = Flask(__name__)

def create_db_connection(app):
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = 'root'
    app.config['MYSQL_DB'] = 'albumdb'

    mysql = MySQL(app)

    return mysql


