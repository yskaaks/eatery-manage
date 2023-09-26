from flask import jsonify, current_app
import requests

from app.extensions import db, guard
from app.models.user import User
from app.models.customer import Customer
from app.models.eatery import Eatery


def check_role(role):
    return role in ['customer', 'eatery']

def auth_login(email, password, role):
    
    user = guard.authenticate(email, password)
    
    if not user:
        return jsonify(success=False), 401
    
    role = 'eatery' if isinstance(user, Eatery) else 'customer'
    
    return jsonify(
        {
            'token': guard.encode_jwt_token(user),
            'user': user.name if role == 'customer' else user.restaurant_name,
            'role': role,
            'id': user.id
        }
    ), 200

def auth_register(email, password, name, role, location="", latitude=None, longitude=None):
    
    if not check_role(role):
        return jsonify({"message": "Invalid role"}), 400

    if User.lookup(email=email):
        return jsonify({"message": "user with that email already exists"}), 409

    if role == 'customer':
        user = Customer(email=email, name=name, password=password)
    elif role == 'eatery':
        user = Eatery(email=email, restaurant_name=name, password=password,
                    location=location, latitude=latitude, longitude=longitude)

    db.session.add(user)
    db.session.commit()

    return jsonify({'id': user.id, 'token': guard.encode_jwt_token(user), 'user': name, 'role': role}), 200

# def auth_passwordreset_reset(token, password):

#     role = data['role']
    
#     if role not in ['customer', 'eatery']:
#         return jsonify({"message": "Invalid role"}), 400

#     user = User.query.filter_by(email=data['email']).first()
#     if not user:
#         return jsonify({"message": "This email does not exist"}), 400

#     user.hash_password(password)
#     db.session.commit()
#     return jsonify({'message': 'Password reset successfully'})


def auth_passwordreset_request(email, role):
    if not check_role(role):
        return jsonify({"message": "Invalid role"}), 400

    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"success": False, "message": "We are not able to find this email address"}), 400

    # Token will be added default in PRAETORIAN_RESET_URI and Subject in added in /extensions.py/init_mail()
    guard.send_reset_email(email) 

    return jsonify({"success": True, 'message': 'Check your email for the instructions to reset your password'}), 200


def validate_google_auth_token_and_send_back_token(code, role):
    client_id = '397558360733-au1inv2shr9v7cqdrkghl31t5pfh9qfp.apps.googleusercontent.com'
    client_secret = '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'
    redirect_uri = 'http://localhost:5173'

    token_url = 'https://oauth2.googleapis.com/token'
    token_payload = {
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }

    response = requests.post(token_url, data=token_payload)
    response_json = response.json()

    if 'access_token' in response_json:
        access_token = response_json['access_token']
        userinfo_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(userinfo_url, headers=headers)
        userinfo_json = response.json()

        if 'email' in userinfo_json and 'name' in userinfo_json:
            email = userinfo_json['email'].lower().strip()
            name = userinfo_json['name']

            user = User.query.filter_by(email=email).first()
            if user:
                role = 'customer' if isinstance(user, Customer) else 'eatery'
                return jsonify({'token': guard.encode_jwt_token(user), 'user': name, 'role': role})

            if role == 'customer':
                user = Customer(email=email, name=name, auth_source='google')
            else: # role == 'eatery'
                user = Eatery(email=email, restaurant_name=name, auth_source='google')

            db.session.add(user)
            db.session.commit()
            return jsonify({'token': guard.encode_jwt_token(user), 'user': name, 'role': role})

    return jsonify({"message": "Failed to validate token"}), 400