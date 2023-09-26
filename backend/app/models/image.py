from app.extensions import db, ma

class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    filepath = db.Column(db.Text())
    eatery_id = db.Column(db.Integer(), db.ForeignKey('eatery.id'))

class ImageSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Image
    
    id = ma.auto_field()
    filepath = ma.auto_field()
    eatery_id = ma.auto_field()

image_schema = ImageSchema()
