from flask import jsonify
from app.models.customer import Customer
from app.models.eatery import Eatery
from app.extensions import db
from app.auth_helper import get_user_model

def set_profile_pic(token, pic_url, role):
    """
    Update the authorised user's profile picture
    Parameters:
        token (str)
        pic_url (str)
        role (str)
        
    Returns:
        {}
    """
    UserModel = get_user_model(role)
    if not UserModel:
        return jsonify({"message": "Invalid role"}), 400

    user = UserModel.verify_auth_token(token)
    if not user:
        return jsonify({"message": "Invalid token"}), 400

    if role == 'customer':
        user.profile_pic = pic_url
    elif role == 'eatery':
        # add pic management for eateries if needed
        pass

    db.session.commit()
    return jsonify({'message': f'{role.capitalize()} profile picture updated successfully'})


def update_customer_details(token, new_name, new_email):
    user = Customer.verify_auth_token(token)
    if not user:
        return jsonify({"message": "Invalid token"}), 400
    if new_name:
        user.name = new_name
    if new_email:
        if Customer.query.filter_by(email=new_email).first():
            return jsonify({"message": "Email already exists"}), 400
        user.email = new_email

    db.session.commit()
    return jsonify({'message': 'Customer details updated successfully'})

def set_eatery_details(token, restaurant_name, cuisine, address):
    eatery = Eatery.verify_auth_token(token)
    if not eatery:
        return jsonify({"message": "Invalid token"}), 400
    
    if restaurant_name:
        eatery.restaurant_name = restaurant_name
    if address:
        eatery.location = address
    if cuisine:
        eatery.cuisine = cuisine 

    db.session.commit()
    return jsonify({'message': 'Eatery details updated successfully'})

def upload_restaurant_pics(token, pics):
    """
    Upload pictures for the authorised eatery's restaurant
    Parameters:
        token (str)
        pics (list of str): list of URLs of the pics
        
    Returns:
        {}
    """
    eatery = Eatery.verify_auth_token(token)
    
    if not eatery:
        return jsonify({"message": "Invalid token"}), 400

    # assuming that pics is a list of URLs and we join them into a single string
    eatery.restaurant_pics = ','.join(pics)
    db.session.commit()
    
    return jsonify({'message': 'Eatery pictures updated successfully'})


# from flask import jsonify, current_app
# from werkzeug.security import generate_password_hash, check_password_hash
# from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
# from app.models.user import User
# from app.database import db

# def customer_profile_setpic(token, pic_url):
#     """
#     Update the authorised customer's profile picture
#     Parameters:
#         token (str)
#         pic_url (str)
        
#     Returns:
#         {}
#     """
#     user = User.verify_auth_token(token)
#     if not user:
#         return jsonify({"message": "Invalid token"}), 400

#     if user.role != 'customer':
#         return jsonify({"message": "Only customers can update profile picture"}), 400

#     user.profile_pic = pic_url
#     db.session.commit()

#     return jsonify({'message': 'Profile picture updated successfully'})


# def manager_profile_set_restaurant_details(token, restaurant_name, address):
#     """
#     Update the authorised manager's restaurant details
#     Parameters:
#         token (str)
#         restaurant_name (str)
#         address (str)
        
#     Returns:
#         {}
#     """
#     manager = Manager.verify_auth_token(token)
    
#     if not manager:
#         return jsonify({"message": "Invalid token"}), 400
    
#     manager.restaurant_name = restaurant_name
#     manager.address = address
#     db.session.commit()
    
#     return jsonify({'message': 'Restaurant details updated successfully'})


# def manager_profile_upload_restaurant_pics(token, pics):
#     """
#     Upload pictures for the authorised manager's restaurant
#     Parameters:
#         token (str)
#         pics (list of str): list of URLs of the pics
        
#     Returns:
#         {}
#     """
#     manager = Manager.verify_auth_token(token)
    
#     if not manager:
#         return jsonify({"message": "Invalid token"}), 400

#     # Here we are assuming that pics is a list of URLs and we join them into a single string
#     manager.restaurant_pics = ','.join(pics)
#     db.session.commit()
    
#     return jsonify({'message': 'Restaurant pictures updated successfully'})
