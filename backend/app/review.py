from flask import Blueprint, request, jsonify, g
from flask_praetorian import auth_required, current_user

from app.models.eatery import Eatery
from app.models.review import Review
from app.extensions import db


review = Blueprint('review', __name__)

# get the current_user 's review
@review.post('/get_review')
@auth_required
def get_review():
    req_json = request.get_json()
    eatery_id = req_json['eatery_id'].strip()
    # ensure eatery id valid
    Eatery.query.get_or_404(eatery_id)
    review = Review.query.filter_by(eatery_id = eatery_id, customer_id = current_user().id).first()
    if not review:
        return '', 204

    rating = review.rating
    review_text = review.review_text

    return jsonify({
        'rating': rating,
        'review_text': review_text,
    }), 200

# get all public reviews given a restaurant
@review.post('/get_all_reviews')
@auth_required
def get_all_reviews():
    req_json = request.get_json()
    eatery_id = req_json['eatery_id']
    reviews = Review.query.filter_by(eatery_id=eatery_id)
    
    if not reviews:
        return '', 204

    reviews_list = []
    for review in reviews: 
        reviews_list.append({ 
            "rating": review.rating, 
            "review_text": review.review_text, 
            "id": review.id,
            "customer_id": review.customer_id
        })
    return jsonify({
        'reviews': reviews_list
    }), 200

@review.post('/add_review')
@auth_required
def add_review():
    req_json = request.get_json()
    rating = req_json['rating'].strip()
    review_text = req_json['review_text'].strip()
    eatery_id = req_json['eatery_id'].strip()

    eatery = Eatery.query.get_or_404(eatery_id)
    new_review = Review(rating=rating, review_text=review_text, customer_id=current_user().id, eatery_id=eatery.id)
    db.session.add(new_review)
    db.session.commit()

    return jsonify(success=True), 201

@auth_required
@review.delete('/delete_review/<int:review_id>')
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)
    db.session.delete(review)
    db.session.commit()
    return jsonify(success=True), 200

    