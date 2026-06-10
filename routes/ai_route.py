# iris 붓꽃 종류 예측 모델 _ 외부에서 만든 모델 사용

from flask import Blueprint, request
import joblib
import numpy as np
from sklearn.datasets import load_iris

# 블루프린트 객체 생성
ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# MODEL_PATH = os.path.join(BASE_DIR, 'models', 'iris_model_0610.pkl')


iris = load_iris()
# 모델 로드 : 매번 모델을 로드하는 것은 비효율적이므로, 전역 변수로 선언하여 한 번만 로드
loaded_model = joblib.load('./models/iris_model_0610.pkl')

@ai_bp.route('/predict-iris', methods=['POST'])

def predict_iris():

    # 요청 데이터 수신
    data = request.get_json()

    # 요청 데이터 추출
    sepal_length = data.get('sepal_length')
    sepal_width = data.get('sepal_width')
    petal_length = data.get('petal_length')
    petal_width = data.get('petal_width')


    # 요청 데이터 유효성 검사
    if not sepal_length or not sepal_width or not petal_length or not petal_width:
        return {
            'success': False,
            'message': 'sepal_length, sepal_width, petal_length, petal_width 는 필수입니다.',
            'status': 400,
            'data': None
        }

    # 모델 예측
    temp_X = np.array([[sepal_length, sepal_width, petal_length, petal_width]])
    temp_y_pred = loaded_model.predict(temp_X)
    class_number = int(temp_y_pred[0])
    class_names = ['setosa', 'versicolor', 'virginica']

    class_name = class_names[class_number]

    return {
        'success': True,
        'message': '붓꽃 종류 예측 완료',
        'status_code': 200,
        'data': {
            '붓꽃 종류 번호': class_number,
            '붓꽃 종류': class_name
        }
    }
