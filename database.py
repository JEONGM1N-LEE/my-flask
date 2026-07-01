# MariaDB의 데이터베이스 연결 설정 파일

from flask import g
import pymysql

db_config = {
    'host': '43.200.39.239',  # localhost 대신 실제 서버 주소로 변경
    'port': 3306,
    'user': 'jmcoding',     # root 대신 실제 사용자 이름으로 변경
    'password': '123qwe!',  # Mdb@Pass94!2
    'db': 'alpha_shop_db',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def get_db():
    # 현재 요청(Request) 컨텍스트에 db 연결이 없으면 생성
    if 'db' not in g:
        g.db = pymysql.connect(**db_config)
    return g.db

def close_db(e=None):
    # 요청이 끝날 때 db 연결이 열려있으면 닫음
    db = g.pop('db', None)
    if db is not None:
        db.close()