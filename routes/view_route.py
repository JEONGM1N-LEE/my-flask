from flask import Blueprint, render_template

# 블루프린트 객체 생성
view_bp = Blueprint('view', __name__, url_prefix='/')

# 페이지 호출
@view_bp.route('/')
def index():
    return render_template('index.html')