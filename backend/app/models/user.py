from app.extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    type = db.Column(db.String(20))
    
    __mapper_args__ = {
        'polymorphic_identity':'user',
        'polymorphic_on':type
    }
    
    @property
    def identity(self):
        return self.id

    @property
    def rolenames(self):
        return []

    @property
    def password(self):
        return self.password_hash

    @classmethod
    def lookup(cls, email):
        return cls.query.filter_by(email=email).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    def __repr__(self):
        return '<User {}>'.format(self.email)