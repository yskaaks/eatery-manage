from flask import Blueprint

main = Blueprint('main', __name__)

@main.route('/', methods=['GET'])
def home():
    return f"Welcome to the Flask backend!"

# @main.route('/customer/profile/setname', methods=['PUT'])
# def set_customer_name():
#     token = request.json.get('token')
#     name_first = request.json.get('name_first')
#     name_last = request.json.get('name_last')
#     return user_profile_setname_v1(token, name_first, name_last, 'customer')

# @main.route('/customer/profile/setemail', methods=['PUT'])
# def set_customer_email():
#     token = request.json.get('token')
#     email = request.json.get('email')
#     return user_profile_setemail_v1(token, email, 'customer')

# @main.route('/customer/profile/sethandle', methods=['PUT'])
# def set_customer_handle():
#     token = request.json.get('token')
#     handle = request.json.get('handle')
#     return user_profile_sethandle_v1(token, handle, 'customer')

# @main.route('/customer/profile/setpic', methods=['POST'])
# def set_customer_profile_pic():
#     token = request.json.get('token')
#     pic_url = request.json.get('pic_url')
#     return customer_profile_setpic(token, pic_url)

# @main.route('/manager/profile/setrestaurantdetails', methods=['PUT'])
# def set_restaurant_details():
#     token = request.json.get('token')
#     restaurant_name = request.json.get('restaurant_name')
#     address = request.json.get('address')
#     return manager_profile_set_restaurant_details(token, restaurant_name, address)

# @main.route('/manager/profile/uploadpics', methods=['POST'])
# def upload_restaurant_pics():
#     token = request.json.get('token')
#     pics = request.json.get('pics')
#     return manager_profile_upload_restaurant_pics(token, pics)


# @main.route('/customer/profile/setname', methods=['PUT'])
# def set_customer_name():
#     # implementation

# @main.route('/customer/profile/setemail', methods=['PUT'])
# def set_customer_email():
#     # implementation

# @main.route('/customer/profile/sethandle', methods=['PUT'])
# def set_customer_handle():
#     # implementation

# @main.route('/customer/profile/setpic', methods=['POST'])
# def set_customer_profile_pic():
#     # implementation

# @main.route('/manager/profile/setrestaurantdetails', methods=['PUT'])
# def set_restaurant_details():
#     # implementation

# @main.route('/manager/profile/uploadpics', methods=['POST'])
# def upload_restaurant_pics():
#     # implementation



# @main.route('/user/profile/uploadphoto', methods=['POST'])
# def user_profile_uploadphoto():
#     token = request.json.get('token')
#     img_url = request.json.get('img_url')
#     x_start = request.json.get('x_start')
#     y_start = request.json.get('y_start')
#     x_end = request.json.get('x_end')
#     y_end = request.json.get('y_end')
#     result = Customer.user_profile_uploadphoto(token, img_url, x_start, y_start, x_end, y_end)
#     return jsonify(result)

# @main.route('/user/profile', methods=['GET'])
# def get_user_profile():
#     token = request.json.get('token')
#     return user.get_user_profile(token)

# @main.route('/user/profile', methods=['PUT'])
# def update_user_profile():
#     token = request.json.get('token')
#     name = request.json.get('name')
#     return user.update_user_profile(token, name)
