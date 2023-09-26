from marshmallow import fields

from app.extensions import db, ma
from app.models.cuisine import CuisineSchema

class CooksCuisine(db.Model):
    __tablename__ = 'cooks_cuisine'
    id = db.Column(db.Integer, primary_key=True)
    eatery_id = db.Column(db.Integer, db.ForeignKey('eatery.id'))
    cuisine_id = db.Column(db.Integer, db.ForeignKey('cuisine.id'))
    cuisine = db.relationship('Cuisine')
    
class CooksCuisineSchema(ma.SQLAlchemySchema):
    class Meta:
        model = CooksCuisine
    
    id = ma.auto_field()
    eatery_id = ma.auto_field()
    cuisine_id = ma.auto_field()
    cuisine = fields.Nested(CuisineSchema)

cooks_cuisine_schema = CooksCuisineSchema()
