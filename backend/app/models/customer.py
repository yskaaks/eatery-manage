from marshmallow import fields

from app.extensions import db, guard, ma
from app.models.user import User

class Customer(User):
    __tablename__ = 'customer'
    
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    name = db.Column(db.String(50))
    auth_source = db.Column(db.String(20), default='local')
    vouchers = db.relationship('HasVoucher', backref='customer')
    cuisine_preferences = db.relationship('LikesCuisine', backref='customer')
    # profile_pic = db.Column(db.String(120), default='default.jpg')
    # points = db.Column(db.Integer, default=0)
 
    __mapper_args__ = {
        'polymorphic_identity':'customer'
    }

    def __init__(self, **kwargs):
        password = kwargs.pop('password', None)
        super(Customer, self).__init__(**kwargs)
        if password:
            self.password_hash = guard.hash_password(password)

class CustomerSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Customer
    
    role = fields.Constant('customer')
    id = ma.auto_field()
    email = ma.auto_field()
    name = ma.auto_field()

customer_schema = CustomerSchema()