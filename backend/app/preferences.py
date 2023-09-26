from flask import Blueprint, request, jsonify
from flask_praetorian import auth_required, current_user
from sqlalchemy import func
from sqlalchemy.orm import joinedload
import math

from app.extensions import db

from app.models.eatery import Eatery
from app.models.customer import Customer
from app.models.cuisine import Cuisine
from app.models.cooks_cuisine import CooksCuisine
from app.models.review import Review
from app.models.likes_cuisine import LikesCuisine, likes_cuisine_schema_list
from app.preferences_helper import coord_distance

preferences = Blueprint('preferences', __name__)

#this is only for the first time (when user registers)
@preferences.route('/add_preferences', methods=['POST'])
@auth_required
def add_preferences():
    req_json = request.get_json()
    # customer_id = req_json.get('customer_id')
    curr_user_obj = current_user()
    cuisines_picked = req_json.get('cuisines')

    # delete all preferences
    curr_user_obj.cuisine_preferences = []
    db.session.commit()

    all_cuisines = Cuisine.query.all()
    for cuisine in all_cuisines:
        if cuisine.cuisine_name in cuisines_picked:
            likes_cuisine = LikesCuisine(customer_id=curr_user_obj.id, cuisine_id=cuisine.id, affinity=0.85)
            db.session.add(likes_cuisine)
        db.session.commit()

    return jsonify({'message': f'preferences for customer ({curr_user_obj.id}) added'}), 200

@preferences.route('/get_preferences/<int:customer_id>', methods=['GET'])
@auth_required
def get_customer_preferences(customer_id):
    preferences = LikesCuisine.query.filter(LikesCuisine.customer_id==customer_id, LikesCuisine.specified==True).all()

    return likes_cuisine_schema_list.dump(preferences), 200

@preferences.get('/get_eatery_preferences')
@auth_required
def get_eateries_preference():
    curr_user = current_user()

    if not isinstance(current_user(), Customer):
        return jsonify(success=False), 403

    lat = float(request.args.get("lat"))
    lon = float(request.args.get("lon"))
    
    
    review_scores = {}
    
    # get eateries within a rough large, square area (0.5 degrees)
    ROUGH_ANGULAR_DELTA = 0.5
    # get eatery ids, location, average review score
    near_eateries = db.session.query(Eatery.id, Eatery.latitude, Eatery.longitude, func.avg(Review.rating), func.group_concat(CooksCuisine.cuisine_id))\
        .select_from(Eatery).join(CooksCuisine, isouter=True)\
        .join(Review, isouter=True).group_by(Eatery.id)\
        .filter(Eatery.latitude.between(lat - ROUGH_ANGULAR_DELTA, lat + ROUGH_ANGULAR_DELTA), Eatery.longitude.between(lon - ROUGH_ANGULAR_DELTA, lon + ROUGH_ANGULAR_DELTA)).all()
    
    # get this user's cuisine preferences
    curr_user_cuisines = { likes_cuisine.cuisine_id for likes_cuisine in curr_user.cuisine_preferences }
    
    for eatery in near_eateries:
        # component: overall eatery score:  range=[0,1]
        review_scores[eatery[0]] = eatery[3] / 5
        
        # component: distance:              range=[-0.5,1]
        eatery_lat = eatery[1]
        eatery_lon = eatery[2]
        distance = coord_distance(lat, lon, eatery_lat, eatery_lon)
        # use exponential as more smooth, maintains bounds
        distance_score = (math.exp(-(distance**2)/8) * (1.5)) - 0.5
        review_scores[eatery[0]] += distance_score
        
        # component: liked cuisines:        range=[0,1]
        this_eatery_cuisines = set(eatery[4].split(",") if eatery[4] else [])
        # liked_cuisines_score=ln(x+1)*(2/3), where x=# of liked & cooked cuisines
        # we use log+max to curve, so 1 common cuisine is ~0.45
        # and disincentivise eateries from spamming cuisines
        liked_cuisines_score = min(math.log(len(curr_user_cuisines.intersection(this_eatery_cuisines)) + 1) * (2 / 3), 1)
        review_scores[eatery[0]] += liked_cuisines_score
    
    # get near eateries that this user has reviewed
    near_eateries_reviewed = db.session.query(Eatery.id, Review.rating).join(Review, isouter=True)\
        .filter(Review.customer_id == curr_user.id, Eatery.latitude.between(lat - ROUGH_ANGULAR_DELTA, lat + ROUGH_ANGULAR_DELTA), Eatery.longitude.between(lon - ROUGH_ANGULAR_DELTA, lon + ROUGH_ANGULAR_DELTA)).all()
    for reviewed_eatery in near_eateries_reviewed:
        # compenent: this user's review:    range=[-1,1]
        review_scores[reviewed_eatery[0]] += (reviewed_eatery[1] - 2.5) / 5
    
    
    return jsonify(review_scores), 200
    