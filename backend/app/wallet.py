from flask import Blueprint, request, jsonify
from flask_praetorian import auth_required, current_user
from sqlalchemy import and_

from app.extensions import db
from app.models.eatery import Eatery
from app.models.customer import Customer, customer_schema
from app.models.voucher import Voucher
from app.models.has_loyalty import HasLoyalty
from app.models.has_voucher import HasVoucher, has_voucher_schema_list

from app.wallet_helper import code_dict, generate_short_code


wallet = Blueprint('wallet', __name__)


@wallet.get('/get_short_code')
@auth_required
def get_short_code():
    current_user_obj = current_user()

    if not isinstance(current_user_obj, Customer):
        return jsonify(success=False), 403

    code = generate_short_code()
    # regenerate if collision
    while code in code_dict:
        code = generate_short_code()

    code_dict[code] = current_user_obj.id
    qr_data = {
        "customerId": current_user_obj.id,
        "customerName": current_user_obj.name,
        "code": code
    } 
    return jsonify(qr_data), 200


@wallet.get('/verify_qrcode/<customer_id>/<code>')
@auth_required
def verify_qrcode(customer_id, code):
    current_user_obj = current_user()

    if not isinstance(current_user_obj, Eatery):
        return jsonify(success=False), 403

    mem_customer_id = code_dict.get(code)
    if str(mem_customer_id) == str(customer_id):
        return jsonify(success=True), 200
    
    return jsonify(success=False), 401
    


@wallet.post('/get_user_vouchers')
@auth_required
def get_user_vouchers():

    if not isinstance(current_user(), Eatery):
        return jsonify(success=False), 403

    code = request.json.get('code').upper()
    customer_id = code_dict.get(code)
    if not customer_id:
        return jsonify(success=False), 404
    
    curr_user_obj = current_user()
    user_loyalty = HasLoyalty.query.filter(and_(HasLoyalty.customer_id==customer_id, HasLoyalty.eatery_id==curr_user_obj.id)).first()
    if not user_loyalty:
        new_loyalty = HasLoyalty(customer_id=customer_id, eatery_id=curr_user_obj.id, points=0)
        db.session.add(new_loyalty)
        db.session.commit()
        
    customer=Customer.query.get_or_404(customer_id)
    
    return has_voucher_schema_list.dump(customer.vouchers), 200


def get_customer_vouchers_for_eatery(customer_id, eatery_id):
    eatery_vouchers = Voucher.query.filter(Voucher.eatery == eatery_id).all()
    has_vouchers = HasVoucher.query.filter(
        (HasVoucher.customer_id == customer_id)).all()

    vouchers = []
    for has_voucher in has_vouchers:
        voucher = Voucher.query.filter(
            Voucher.id == has_voucher.voucher_id).first()
        if voucher in eatery_vouchers:
            vouchers.append({
                'id': voucher.id,
                'description': voucher.description,
                'quantity': voucher.quantity,
                'start': voucher.start,
                'expiry': voucher.expiry,
                'eatery_id': voucher.eatery
            })

    return vouchers

@wallet.get('/get_customer_info/<customer_id>')
@auth_required
def get_customer_info(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    eatery_id = ...

    points = customer.points
    vouchers = get_customer_vouchers_for_eatery(customer_id, eatery_id)

    return jsonify({
        'name': customer.name,
        'points': points,
        'vouchers': vouchers,
    }), 200


@wallet.route('/get_vouchers_customer_wallet', methods=['POST'])
@auth_required
def get_vouchers_customer_wallet():
    if not isinstance(current_user(), Customer):
        return jsonify(success=False), 403


    eatery_id = request.json.get('eatery_id')
    curr_user_obj = current_user() 
    vouchers = get_customer_vouchers_for_eatery(curr_user_obj.id, eatery_id)

    return jsonify({'vouchers': vouchers}), 200