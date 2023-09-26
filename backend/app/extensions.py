from flask_sqlalchemy import SQLAlchemy
from flask_praetorian import Praetorian
from flask_marshmallow import Marshmallow
from flask_mail import Mail

db = SQLAlchemy()
guard = Praetorian()
ma = Marshmallow()

mail = Mail()

def init_mail(app):
    app.config['MAIL_SERVER'] = 'smtp.office365.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USERNAME'] = 'tempemsbeast123@outlook.com'
    app.config['MAIL_PASSWORD'] = 'Sql12345'
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    # RESET EMAIL CONFIG
    app.config['PRAETORIAN_RESET_SENDER'] = 'tempemsbeast123@outlook.com'
    app.config['PRAETORIAN_RESET_URI'] = 'http://localhost:5173/auth/reset-password' # Frontend Reset Password Page url
    app.config['PRAETORIAN_RESET_SUBJECT'] = 'Password Reset Request'  
    mail.init_app(app)
