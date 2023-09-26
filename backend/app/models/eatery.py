import math
from datetime import datetime
from sqlalchemy import func
from sqlalchemy.ext.hybrid import hybrid_method
from marshmallow import fields
from app.extensions import db, guard, ma
from app.models.user import User
from app.models.review import ReviewSchema
from app.models.cooks_cuisine import CooksCuisineSchema
from enum import Enum as PyEnum


class WeekDays(PyEnum):
    Monday = 'Monday'
    Tuesday = 'Tuesday'
    Wednesday = 'Wednesday'
    Thursday = 'Thursday'
    Friday = 'Friday'
    Saturday = 'Saturday'
    Sunday = 'Sunday'

    def toJSON(self):
        return self.name


class OpeningHours(db.Model):

    __tablename__ = 'opening_hours'

    id = db.Column(db.Integer, primary_key=True)
    eatery_id = db.Column(db.Integer, db.ForeignKey('eatery.id'))
    day_of_week = db.Column(db.Enum(WeekDays), nullable=False)
    opening_time = db.Column(db.Time, nullable=True)
    closing_time = db.Column(db.Time, nullable=True)
    # True If closed for any day i.e. Sunday
    is_closed = db.Column(db.Boolean, default=False)


class OpenHoursSchema(ma.SQLAlchemySchema):

    class Meta:
        model = OpeningHours

    id = ma.auto_field()
    eatery_id = ma.auto_field()
    day_of_week = ma.Method("get_day_of_week")
    # Set the format to display only HH:MM
    opening_time = ma.Time(format="%H:%M")
    closing_time = ma.Time(format="%H:%M")
    is_closed = ma.auto_field()

    def get_day_of_week(self, obj):
        return obj.day_of_week.toJSON()


open_hours_schema = OpenHoursSchema()
open_hours_schema_list = OpenHoursSchema(many=True)


class Eatery(User):
    __tablename__ = 'eatery'

    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    restaurant_name = db.Column(db.String(100))
    # display location to help human users find (e.g. inside quad food court)
    location = db.Column(db.Text)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    reviews = db.relationship('Review', backref='eatery')
    eatery_image = db.relationship('Image', backref='eatery')
    cuisines = db.relationship('CooksCuisine', backref='eatery')
    opening_hours = db.relationship(
        'OpeningHours', backref='eatery', lazy=True)

    __mapper_args__ = {
        'polymorphic_identity': 'eatery'
    }

    def __init__(self, restaurant_name, email, password):
        self.restaurant_name = restaurant_name
        self.email = email
        self.password_hash = guard.hash_password(password)

    def __init__(self, longitude, latitude, location, password, **kwargs):
        super(Eatery, self).__init__(**kwargs)
        self.longitude = longitude
        self.latitude = latitude
        self.location = location
        self.password_hash = guard.hash_password(password)

    def distance(self, user_lat, user_long):
        earth_radius = 6371  # Radius of the Earth in kilometers

        # Convert latitude and longitude to radians
        lat1_rad = math.radians(self.latitude)
        lon1_rad = math.radians(self.longitude)
        lat2_rad = math.radians(user_lat)
        lon2_rad = math.radians(user_long)

        # Calculate the differences between the latitudes and longitudes
        delta_lat = lat2_rad - lat1_rad
        delta_lon = lon2_rad - lon1_rad

        # Calculate the Haversine formula
        a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1_rad) * \
            math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = earth_radius * c

        return distance

class EaterySchema(ma.SQLAlchemySchema):
    class Meta:
        model = Eatery

    role = fields.Constant('eatery')
    id = ma.auto_field()
    email = ma.auto_field()
    restaurant_name = ma.auto_field()
    location = ma.auto_field()
    latitude = ma.auto_field()
    longitude = ma.auto_field()
    reviews = fields.Nested(ReviewSchema, many=True)
    eatery_image = ma.auto_field()
    cuisines = fields.Nested(CooksCuisineSchema, many=True)
    opening_hours = fields.Nested(OpenHoursSchema, many=True)
    is_open_now = ma.Method("get_is_open_now")

    
    def get_is_open_now(self, obj):

        """Function to check if Eatery is open"""

        now = datetime.now()
        current_day_of_week = now.strftime("%A")  # Get the current day of the week as a string

        try:
            for opening_hour in obj.opening_hours:
                if opening_hour.day_of_week.name == current_day_of_week:

                    if opening_hour.is_closed:
                        return False  # If is_closed is True, the store is closed for the entire day

                    opening_time = datetime.strptime(str(opening_hour.opening_time), "%H:%M:%S").time()
                    closing_time = datetime.strptime(str(opening_hour.closing_time), "%H:%M:%S").time()
                    
                    if opening_time <= now.time() < closing_time:
                        return True

            return False
        except Exception as e:
            raise e


eatery_schema = EaterySchema()
eatery_schema_list = EaterySchema(many=True)
