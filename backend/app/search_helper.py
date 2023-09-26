import sqlite3
from flask import jsonify
from app.extensions import db
from app.models.customer import Customer
from app.models.eatery import Eatery
from app.models.cuisine import Cuisine
from app.models.cooks_cuisine import CooksCuisine
from sqlalchemy import TypeCoerce, create_engine, func, literal, or_, type_coerce, and_
from sqlalchemy import cast, Float
from sqlalchemy.orm import sessionmaker, joinedload
import math

engine = create_engine(db.engine.url)
Session = sessionmaker(bind=engine)
session = Session()

def eatery_search(search_term, qty=1):
    
    joined = db.session.query(Eatery).join(Eatery.cuisines).join(Cuisine).options(joinedload(Eatery.cuisines))
    results = joined.filter(
        or_(Cuisine.cuisine_name.ilike(f"%{search_term}%"),
         Eatery.restaurant_name.ilike(f"%{search_term}%"))
    ).all()

    return_array = []
    i = 0
    for result in results:
        if i == qty:
            break
        eatery_info = {}
        eatery_info['name'] = result.restaurant_name
        eatery_info['longitude'] = result.longitude
        eatery_info['location'] = result.location
        eatery_info['latitude'] = result.latitude
        eatery_info['cuisine'] = []
        for cuisine in result.cuisines:
            eatery_info['cuisine'].append(cuisine.cuisine.cuisine_name)
        return_array.append(eatery_info)
        i = i + 1

    return jsonify({'results': return_array}), 200


def eatery_distance_search(search_term, user_long, user_lat, max_distance, qty=1):

    joined = db.session.query(Eatery).join(Eatery.cuisines).join(Cuisine).options(joinedload(Eatery.cuisines))

    results = (
        joined
        .filter(
            and_(Eatery.distance(user_lat, user_long, max_distance),
                 or_(Cuisine.cuisine_name.ilike(f"%{search_term}%"),
                 Eatery.restaurant_name.ilike(f"%{search_term}%")))
        )
        .all()
    )

    return_array = []
    i = 0
    for result in results:
        if i == qty:
            break
        eatery_info = {}
        eatery_info['name'] = result.restaurant_name
        eatery_info['longitude'] = result.longitude
        eatery_info['latitude'] = result.latitude
        eatery_info['location'] = result.location
        eatery_info['cuisine'] = []
        for cuisine in result.cuisines:
            eatery_info['cuisine'].append(cuisine.cuisine.cuisine_name)
        return_array.append(eatery_info)
        i = i + 1
    
    return jsonify({'results': return_array}), 200
    
    
    
