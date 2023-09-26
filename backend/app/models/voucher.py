from app.extensions import db, ma

class Voucher(db.Model):
    __tablename__ = 'voucher'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text)
    eatery = db.Column(db.Integer, db.ForeignKey('eatery.id'))
    quantity = db.Column(db.Integer)
    start = db.Column(db.DateTime)
    expiry = db.Column(db.DateTime)

class VoucherSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Voucher
    
    id = ma.auto_field()
    description = ma.auto_field()
    eatery = ma.auto_field()
    quantity = ma.auto_field()
    start = ma.auto_field()
    expiry = ma.auto_field()

voucher_schema = VoucherSchema()