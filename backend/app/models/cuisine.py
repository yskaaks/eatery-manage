from app.extensions import db, ma

class Cuisine(db.Model):
    __tablename__ = 'cuisine'
    id = db.Column(db.Integer, primary_key=True)
    cuisine_name = db.Column(db.Text)
    
class CuisineSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Cuisine
    
    id = ma.auto_field()
    cuisine_name = ma.auto_field()

cuisine_schema = CuisineSchema()
cuisine_schema_list = CuisineSchema(many=True)