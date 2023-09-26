"""Module for handling loyality points Customer and Eatery"""

from flask import Blueprint, jsonify, request
from flask_praetorian import auth_required
from sqlalchemy import and_
from app.extensions import db
from app.models.has_loyalty import HasLoyalty


has_loyalty = Blueprint('has_loyalty', __name__)


@has_loyalty.route('/loyalty/points', methods=['POST'])
@auth_required
def add_or_deduct_customer_points():

    data = request.json

    # Validate the required fields are present in the JSON data
    required_fields = ['eatery_id', 'customer_id', 'action', 'points']
    if not all(field in data for field in required_fields):
        return jsonify({'success': False, 'message': 'Missing required fields.'}), 400

    eatery_id = data['eatery_id']
    customer_id = data['customer_id']
    action = data['action']
    points = data.get('points', 0)

    # Validate the action is either 'add' or 'deduct'
    if action not in ('add', 'deduct'):
        return jsonify({'success': False, 'message': 'Invalid action. Use "add" or "deduct".'}), 400

    # Get the HasLoyalty record for the specified eatery and customer
    has_loyalty_record = HasLoyalty.query.filter_by(
        eatery_id=eatery_id, customer_id=customer_id).first()

    if not has_loyalty_record:
        # Create a new HasLoyalty record if not found
        has_loyalty_record = HasLoyalty(
            eatery_id=eatery_id, customer_id=customer_id, points=0)

    # Perform the action based on 'add' or 'deduct'
    if action == 'add':
        has_loyalty_record.points += points
    elif action == 'deduct':
        if has_loyalty_record.points < points:
            return jsonify({'success': False, 'message': 'Insufficient points to deduct.'}), 400
        has_loyalty_record.points -= points

    db.session.add(has_loyalty_record)
    db.session.commit()

    return jsonify({'success': True, 'message': f'Points {action}ed successfully.'}), 200


@has_loyalty.route('/loyalty/program/<eatery_id>/<customer_id>', methods=['GET'])
@auth_required
def add_customer_to_loyalty_program(eatery_id, customer_id):

    # Get the HasLoyalty record for the specified eatery and customer
    has_loyalty_record = HasLoyalty.query.filter_by(
        eatery_id=eatery_id, customer_id=customer_id).first()

    if not has_loyalty_record:
        # Create a new HasLoyalty record if not found
        has_loyalty_record = HasLoyalty(
            eatery_id=eatery_id, customer_id=customer_id, points=0)

    db.session.add(has_loyalty_record)
    db.session.commit()

    return jsonify({'success': True, 'message': f'Customer added to loyalty program successfully.'}), 200