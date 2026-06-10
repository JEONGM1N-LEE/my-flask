from flask import Blueprint, render_template, request

# 블루프린트 객체 생성
test_bp = Blueprint('test', __name__, url_prefix='/api/test')

# 라우팅정의 : URL 경로(Route)와 실행할 함수 연결
@test_bp.route('/good', methods=['POST'])
def hello_world():
    return 'Hello, World!'


# 요청 시 데이터 수신 방법
# [1] params 방식

@test_bp.route('/get_user/<string:user_id>', methods=['GET'])

def get_user(user_id):

    print(user_id)

    return f'회원데이터 {user_id}'



# [2] query 방식 : URL의 끝에 ?를 붙이고 key=value 형태로 데이터를 전달하는 방식

@test_bp.route('/get_items', methods=['GET'])

def get_items():

    type = request.args.get('type')
    price = request.args.get('price')

    print(type, price)

    return 'ok'



# [3] body 방식 : URL이 아닌 요청 본문에 데이터를 담아 보내는 방식 (GET 요청 방식에서는 사용하지 않음)

@test_bp.route('/create_item', methods=['POST'])

def create_item():

    data = request.get_json()

    name = data.get('name')
    price = data.get('price')
    maker = data.get('maker')

    print(name, price, maker)

    return {
        'success': True,
        'message': '상품 생성 완료, data는 생성된 상품 정보입니다.',
        'status_code': 200,
        'data': {
            'name': name,
            'price': price,
            'maker': maker
        }
    }



# 실습 요청 쿠팡

@test_bp.route('/vp/products', methods=['GET'])

def get_product():

    product_id = request.args.get('productId')
    item_id = request.args.get('itemId')
    vendor_item_id = request.args.get('vendorItemId')

    if not product_id or not item_id or not vendor_item_id:
        return 'productId, itemId, vendorItemId is required'

    return f'상품데이터 product_id: {product_id} item_id: {item_id} vendor_item_id: {vendor_item_id}'