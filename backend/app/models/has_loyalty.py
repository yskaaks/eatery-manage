from app.extensions import db, ma
from marshmallow import fields

class HasLoyalty(db.Model):
    __tablename__ = 'has_loyalty'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer(), db.ForeignKey('customer.id'))
    eatery_id = db.Column(db.Integer(), db.ForeignKey('eatery.id'))
    points = db.Column(db.Integer)

class HasLoyaltySchema(ma.SQLAlchemySchema):
    class Meta:
        model = HasLoyalty
    
    id = ma.auto_field()
    customer_id = ma.auto_field()
    eatery_id = ma.auto_field()
    points = ma.auto_field()

has_loyalty_schema = HasLoyaltySchema()
has_loyalty_schema_list = HasLoyaltySchema(many=True)