from flask import Blueprint, jsonify, request
from flask_praetorian import auth_required, current_user
from sqlalchemy import and_
from datetime import datetime

from app.extensions import db
from app.models.voucher import Voucher
from app.models.has_voucher import HasVoucher
from app.models.has_loyalty import HasLoyalty
from app.models.eatery import Eatery

voucher = Blueprint('voucher', __name__)

date_format = "%H:%M:%S %d/%m/%Y"
#date_string_example = "12:34:56 06/07/2023"

@voucher.route('/create_voucher', methods=['POST'])
@auth_required
def create_voucher():
    description = request.json.get('description')
    eatery = request.json.get('eatery_id')
    quantity = request.json.get('quantity')
    start = request.json.get('start')
    expiry = request.json.get('expiry')

    start_dt = datetime.strptime(start, date_format)
    expiry_dt = datetime.strptime(expiry, date_format)

    new_voucher = Voucher(description=description, eatery=eatery, quantity=quantity, start=start_dt, expiry=expiry_dt)
    db.session.add(new_voucher)
    db.session.commit()

    recently_added_voucher = db.session.query(Voucher).order_by(Voucher.id.desc()).first()
    voucher_id = recently_added_voucher.id

    return jsonify({'message': f'added voucher with id ({voucher_id})'}), 201

@voucher.route('/delete_voucher/<int:voucher_id>', methods=['DELETE'])
@auth_required
def delete_voucher(voucher_id):
    voucher = Voucher.query.filter(Voucher.id == voucher_id).first()
    if voucher == None:
        return jsonify({'message': f'voucher with id ({voucher_id}) not found'}), 404
    db.session.delete(voucher)
    db.session.commit()
    return jsonify({'message': f'voucher with id ({voucher_id}) deleted'}), 200


@voucher.route('/delete_customer_voucher/<int:voucher_id>/<int:customer_id>', methods=['DELETE'])
@auth_required
def delete_customer_voucher(voucher_id, customer_id):
     
    if not isinstance(current_user(), Eatery):
        return jsonify(success=False), 403
     
    voucher = HasVoucher.query.filter(
        HasVoucher.customer_id == customer_id, HasVoucher.voucher_id== voucher_id).first()
    
    if voucher == None:
        return jsonify({'message': f'voucher with id ({voucher_id}) not found'}), 404
    
    db.session.delete(voucher)
    db.session.commit()
    return jsonify({'message': f'voucher with id ({voucher_id}) deleted for customer id {customer_id}'}), 200


@voucher.route('/edit_voucher/<int:voucher_id>', methods=['PUT'])
@auth_required
def edit_voucher(voucher_id):
    voucher = Voucher.query.filter(Voucher.id == voucher_id).first()
    if voucher == None:
        return jsonify({'message': f'voucher with id ({voucher_id}) not found'}), 404

    description = request.json.get('description')
    eatery = request.json.get('eatery_id')
    quantity = request.json.get('quantity')
    start = request.json.get('start')
    expiry = request.json.get('expiry')

    if description != None:
        voucher.description = description
    if eatery != None:
        voucher.eatery = eatery
    if quantity != None:
        voucher.quantity = quantity
    if start != None:
        start_dt = datetime.strptime(start, date_format)
        voucher.start = start_dt
    if expiry != None:
        expiry_dt = datetime.strptime(expiry, date_format)
        voucher.expiry = expiry_dt
    db.session.commit()
    return jsonify({'message': f'voucher with id ({voucher_id}) was updated'}), 200


@voucher.route('/get_vouchers_eatery/<int:eatery_id>', methods=['GET'])
@auth_required
def get_vouchers_eatery_id(eatery_id):
    vouchers = Voucher.query.filter(Voucher.eatery == eatery_id).all()
    if vouchers == None:
        return jsonify({'message': f'voucher(s) associated with eatery id ({eatery_id}) not found'}), 204
    
    vouchers_list = []
    for voucher in vouchers:
        vouchers_list.append({
            'id': voucher.id,
            'description': voucher.description,
            'quantity': voucher.quantity,
            'start': voucher.start,
            'expiry': voucher.expiry,
            'eatery_id': voucher.eatery
        })
    
    return jsonify({'vouchers': vouchers_list}), 200

@voucher.route('/get_vouchers_customer/<int:customer_id>', methods=['GET'])
@auth_required
def get_vouchers_customer_id(customer_id):
    has_vouchers = HasVoucher.query.filter((HasVoucher.customer_id==customer_id)).all()

    vouchers = []
    for has_voucher in has_vouchers:
        voucher = Voucher.query.filter(Voucher.id==has_voucher.voucher_id).first()
        if voucher:
             # HasLoyalty
            loyalty = HasLoyalty.query.filter(
                HasLoyalty.eatery_id == voucher.eatery, HasLoyalty.customer_id == customer_id).first()
            vouchers.append({
                'id': voucher.id,
                'description': voucher.description,
                'quantity': voucher.quantity,
                'start': voucher.start,
                'expiry': voucher.expiry,
                'eatery_id': voucher.eatery,
                'loyalty_points': loyalty.points if loyalty else 0
            })
    
    return jsonify({'vouchers': vouchers}), 200


@voucher.route('/claim_voucher', methods=['POST'])
@auth_required
def claim_voucher():
    voucher_id = request.json.get('voucher_id')
    customer_id = request.json.get('customer_id')
    
    voucher = Voucher.query.filter(Voucher.id==voucher_id).first()
    if voucher == None:
        return jsonify({'vouchers': f'voucher ({voucher_id}) doesnt exist'}), 400
    
    if voucher.quantity == 0:
        return jsonify({'vouchers': f'voucher ({voucher_id}) quantity exhausted'}), 401

    has_voucher = HasVoucher.query.filter(and_(HasVoucher.customer_id==customer_id,HasVoucher.voucher_id==voucher_id)).first()
    if has_voucher != None:
        return jsonify({'vouchers': f'voucher ({voucher_id}) already claimed by customer ({customer_id})'}), 402
    else:
        has_voucher = HasVoucher(voucher_id=voucher_id, customer_id=customer_id)
       
    voucher = Voucher.query.filter(Voucher.id==voucher_id).first()
    voucher.quantity = voucher.quantity - 1
    db.session.add(has_voucher)
    db.session.commit()

    return jsonify({'vouchers': f'voucher ({voucher_id}) claimed by customer ({customer_id})'}), 200

@voucher.route('/redeem_voucher', methods=['POST'])
@auth_required
def redeem_voucher():
    voucher_id = request.json.get('voucher_id')
    customer_id = request.json.get('customer_id')

    has_voucher = HasVoucher.query.filter(and_(HasVoucher.customer_id==customer_id,HasVoucher.voucher_id==voucher_id)).first()
    db.session.delete(has_voucher)
    db.session.commit()

    return jsonify({'vouchers': f'voucher ({voucher_id}) redeemed by customer ({customer_id})'}), 200