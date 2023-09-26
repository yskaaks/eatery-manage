from marshmallow import fields

from app.extensions import db, ma
from app.models.voucher import VoucherSchema

class HasVoucher(db.Model):
    __tablename__ = 'has_voucher'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer(), db.ForeignKey('customer.id'))
    voucher_id = db.Column(db.Integer(), db.ForeignKey('voucher.id'))
    voucher = db.relationship('Voucher', backref='has_voucher')

class HasVoucherSchema(ma.SQLAlchemySchema):
    class Meta:
        model = HasVoucher
    
    id = ma.auto_field()
    customer_id = ma.auto_field()
    voucher = fields.Nested(VoucherSchema)

has_voucher_schema = HasVoucherSchema()
has_voucher_schema_list = HasVoucherSchema(many=True)