from app.extensions import db, ma
from app.models.cuisine import CuisineSchema
from marshmallow import fields

class LikesCuisine(db.Model):
    __tablename__ = 'likes_cuisine'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer(), db.ForeignKey('customer.id'))
    cuisine_id = db.Column(db.Integer(), db.ForeignKey('cuisine.id'))
    affinity = db.Column(db.Float)
    cuisine = db.relationship('Cuisine')

class LikesCuisineSchema(ma.SQLAlchemySchema):
    class Meta:
        model = LikesCuisine
    
    id = ma.auto_field()
    customer_id = ma.auto_field()
    cuisine_id = ma.auto_field()
    affinity = ma.auto_field()
    cuisine = fields.Nested(CuisineSchema)

likes_cuisine_schema = LikesCuisineSchema()
likes_cuisine_schema_list = LikesCuisineSchema(many=True)