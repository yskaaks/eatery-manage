from flask import Blueprint, request, jsonify
from flask_praetorian import current_user, auth_required

from app.models.customer import Customer, customer_schema
from app.models.eatery import Eatery, eatery_schema, OpeningHours
from app.models.user import User
from app.models.cooks_cuisine import CooksCuisine
from app.models.voucher import Voucher
from app.models.image import Image
from app.models.review import Review
from app.models.likes_cuisine import LikesCuisine
from app.models.has_loyalty import HasLoyalty
from app.models.has_voucher import HasVoucher
from app.extensions import db, guard

user = Blueprint('user', __name__)

@user.route('/customer/profile', methods=['GET'])
@auth_required
def get_customer():
    current_user_obj = current_user()
    
    if not isinstance(current_user_obj, Customer):
        return jsonify(success=False), 403

    return customer_schema.dump(current_user)

@user.route('/customer/edit-profile', methods=['POST'])
@auth_required
def edit_customer():
    current_user_obj = current_user()

    if not isinstance(current_user_obj, Customer):
        return jsonify(success=False), 403

    data = request.get_json()
    
    
    current_user_obj.name = data.get('name', current_user_obj.name)
    current_user_obj.email = data.get('email', current_user_obj.email)

    if 'password' in data:
        current_user_obj.password_hash - guard.hash_password(data.get('password'))

    db.session.commit()
    return jsonify({"message": "Customer updated"}), 200

@user.route('/eatery/edit-profile', methods=['PUT'])
@auth_required
def edit_eatery():
    current_user_obj = current_user()
    
    if not isinstance(current_user_obj, Eatery):
        return jsonify(success=False), 403

    data = request.get_json()
    
    
    current_user_obj.restaurant_name = data.get('restaurant_name', current_user_obj.restaurant_name)
    current_user_obj.location = data.get('location', current_user_obj.location)
    current_user_obj.email = data.get('email', current_user_obj.email)

    if 'password' in data:
        current_user_obj.hash_password(data.get('password'))

    db.session.commit()
    return jsonify({"message": "Eatery updated"}), 200

@user.route('/eatery/profile', methods=['GET'])
@auth_required
def get_eatery():
    current_user_obj = current_user()
    
    if not isinstance(current_user_obj, Eatery):
        return jsonify(success=False), 403

    return eatery_schema.dump(current_user_obj), 200

# get users' PUBLIC information
@user.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = Customer.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # return the user's data
    return jsonify({
        "id": user.id,
        "name": user.name,
        # add any other fields you want to return here
    }), 200

@user.route('/delete_user/', methods=['DELETE'])
@auth_required
def delete_user():
    curr_user_obj = current_user()
    user = User.query.get(curr_user_obj.id)
    if user.type == 'customer':
        user_obj = Customer.query.get(curr_user_obj.id)

        reviews = Review.query.filter(Review.eatery_id==curr_user_obj.id).all()
        for review in reviews:
            db.session.delete(review)
            db.session.commit()
    
        like_cuisines = LikesCuisine.query.filter(LikesCuisine.customer_id==curr_user_obj.id).all()
        for like_cuisine in like_cuisines:
            db.session.delete(like_cuisine)
            db.session.commit()
        
        has_loyalties = HasLoyalty.query.filter(HasLoyalty.eatery_id==curr_user_obj.id).all()
        for has_loyalty in has_loyalties:
            db.session.delete(has_loyalty)
            db.session.commit()

        has_vouchers = HasVoucher.query.filter(HasVoucher.customer_id==curr_user_obj.id).all()
        for has_voucher in has_vouchers:
            db.session.delete(has_voucher)
            db.session.commit()
    else:
        user_obj = Eatery.query.get(curr_user_obj.id)

        cooks_cuisines = CooksCuisine.query.filter(CooksCuisine.eatery_id==curr_user_obj.id).all()
        for cooks_cuisine in cooks_cuisines:
            db.session.delete(cooks_cuisine)
            db.session.commit()

        vouchers = Voucher.query.filter(Voucher.eatery==curr_user_obj.id).all()
        for voucher in vouchers:
            hv = HasVoucher.query.filter(HasVoucher.voucher_id==voucher.id).first()
            db.session.delete(hv)
            db.session.delete(voucher)
            db.session.commit()

        opening_hours = OpeningHours.query.filter(OpeningHours.eatery_id==curr_user_obj.id).all()
        for oh in opening_hours:
            db.session.delete(oh)
            db.session.commit()

        images = Image.query.filter(Image.eatery_id==curr_user_obj.id).all()
        for image in images:
            db.session.delete(image)
            db.session.commit()

        reviews = Review.query.filter(Review.eatery_id==curr_user_obj.id).all()
        for review in reviews:
            db.session.delete(review)
            db.session.commit()

        has_loyalties = HasLoyalty.query.filter(HasLoyalty.eatery_id==curr_user_obj.id).all()
        for has_loyalty in has_loyalties:
            db.session.delete(has_loyalty)
            db.session.commit()
        
    
    db.session.delete(user_obj)
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": f"user {curr_user_obj.id} deleted"}), 200


