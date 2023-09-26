from flask import Flask
from flask_cors import CORS
from flask.sessions import SecureCookieSessionInterface, SessionMixin

from app.extensions import db, ma, guard, init_mail
from app.config import config

from app.wallet_helper import code_dict

def create_app(config_name='default'):

    app = Flask(__name__)
    
    app.config.from_object(config[config_name])
        
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

    # disable flask session cookie
    class CustomSessionInterface(SecureCookieSessionInterface):
        def should_set_cookie(self, app: "Flask", session: SessionMixin) -> bool:
            return False
    
    app.session_interface = CustomSessionInterface()

    init_mail(app)
    
    from app.models.user import User
    
    db.init_app(app)
    guard.init_app(app, User)
    ma.init_app(app)
    

    from app.models.has_voucher import HasVoucher
    from app.models.voucher import Voucher
    from app.models.review import Review
    from app.models.image import Image
    from app.models.cuisine import Cuisine
    from app.models.cooks_cuisine import CooksCuisine
    from app.models.eatery import Eatery
    from app.models.likes_cuisine import LikesCuisine
    from app.models.customer import Customer
    from app.models.has_loyalty import HasLoyalty
    from app.models.eatery import OpeningHours


    with app.app_context():
        db.create_all()

        from app.main import main as main_blueprint
        app.register_blueprint(main_blueprint, url_prefix="/api")

        from app.auth import auth as auth_blueprint
        app.register_blueprint(auth_blueprint, url_prefix="/api")

        from app.user import user as user_blueprint
        app.register_blueprint(user_blueprint, url_prefix="/api")
    
        from app.eatery import eatery as eatery_blueprint
        app.register_blueprint(eatery_blueprint, url_prefix="/api")

        from app.review import review as review_blueprint
        app.register_blueprint(review_blueprint, url_prefix="/api")

        from app.search import search_bp as search_blueprint
        app.register_blueprint(search_blueprint, url_prefix="/api")

        from app.voucher import voucher as voucher_blueprint
        app.register_blueprint(voucher_blueprint, url_prefix="/api")

        from app.preferences import preferences as preferences_blueprint
        app.register_blueprint(preferences_blueprint, url_prefix="/api")
        
        from app.wallet import wallet as wallet_blueprint
        app.register_blueprint(wallet_blueprint, url_prefix="/api")

        from app.cuisine import cuisine as cuisine_blueprint
        app.register_blueprint(cuisine_blueprint, url_prefix="/api")

        from app.has_loyalty import has_loyalty as has_loyalty_blueprint
        app.register_blueprint(has_loyalty_blueprint, url_prefix="/api")
    
    return app