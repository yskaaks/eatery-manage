import datetime
import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from app import create_app, db
from app.models.image import Image
from app.models.review import Review
from app.models.cuisine import Cuisine
from app.models.cooks_cuisine import CooksCuisine
from app.models.likes_cuisine import LikesCuisine
from app.models.voucher import Voucher
from app.models.has_voucher import HasVoucher
from app.models.eatery import Eatery
from app.models.customer import Customer

    
if __name__ == '__main__':
    app = create_app(config_name='testing')
    with app.app_context():
        eatery_arr = [

            # Kingsford
            Eatery(
                restaurant_name="McDonald's Kingsford",
                email='mcds@fake.com',
                latitude=-33.91966242470431,
                longitude=151.22743957038773,
                password='123',
                location='10 Barker St, Kingsford NSW 2032'
            ),
            Eatery(
                restaurant_name='Regent Hotel',
                email='rege@fake.com',
                latitude=-33.92094547443076,
                longitude=151.22726800730348,
                password='123',
                location='416-418 Anzac Parade, Kingsford NSW 2032'
            ),
            Eatery(
                restaurant_name='Churchills Sports Bar',
                email='churchies@fake.com',
                latitude=-33.92373346017343,
                longitude=151.2282260894706,
                password='123',
                location='536 Anzac Parade, Kingsford NSW 2032'
            ),
            Eatery(
                restaurant_name='Time For Thai',
                email='tft@fake.com',
                latitude=-33.92218351458226,
                longitude=151.2267275092203,
                password='123',
                location='2/309 Anzac Parade, Kingsford NSW 2032'
            ),
            Eatery(
                restaurant_name='Papa Hans',
                email='papahans@fake.com',
                latitude=-33.922582064553424,
                longitude=151.2267606094381,
                password='123',
                location='323 Anzac Parade, Kingsford NSW 2032'
            ),
            Eatery(
                restaurant_name='Zhou Mum Cafe',
                email='zhoumum@fake.com',
                latitude=-33.920153566605,
                longitude=151.22636714754267,
                password='123',
                location='243-245 Anzac Parade, Kingsford NSW 2032'
            ),
            Eatery(
                restaurant_name='The Old Place Tobbacconist',
                email='oldplace@fake.com',
                latitude=-33.922376810853805,
                longitude=151.22683114334558,
                password='123',
                location='315 Anzac Parade, Kingsford NSW 2032'
            ),
            Eatery(
                restaurant_name='Tokyo Super',
                email='tokyosuper@fake.com',
                latitude=-33.92212860007362,
                longitude=151.22671365734158,
                password='123',
                location='307 Anzac Parade, Kingsford NSW 2032'
            ),
            Eatery(
                restaurant_name='Shalom Kingsford',
                email='shalom@fake.com',
                latitude=-33.922013642754635,
                longitude=151.2271671069826,
                password='123',
                location='2/458 Anzac Parade, Kingsford NSW 2032'
            ),
            # other Sydney
            Eatery(
                restaurant_name='Coogee Pavilion',
                email='coogeepav@fake.com',
                latitude=-33.91854837293536,
                longitude=151.25867325121,
                password='123',
                location='Ground Floor, 169 Dolphin St, Coogee NSW 2034'
            ),
            Eatery(
                restaurant_name="Ryan's Bar",
                email='ryansbar@fake.com',
                latitude=-33.86505856846632,
                longitude=151.2081175261286,
                password='123',
                location='264-278 George St, Sydney NSW 2000'
            ),
            Eatery(
                restaurant_name='Union Hotel',
                email='unionhotel@fake.com',
                latitude=-33.90376265121743,
                longitude=151.18028962673472,
                password='123',
                location='576 King St, Newtown NSW 2042'
            ),
            Eatery(
                restaurant_name='Dove & Olive',
                email='doveolive@fake.com',
                latitude=-33.8869720595346,
                longitude=151.21005833871993,
                password='123',
                location='156 Devonshire St, Surry Hills NSW 2010'
            ),
            Eatery(
                restaurant_name='Rooty Hill RSL',
                email='rootyhillrsl@fake.com',
                latitude=-33.77024903871825,
                longitude=150.83422849428325,
                password='123',
                location='33 Railway St, Rooty Hill NSW 2766'
            ),
            Eatery(
                email='testeatery@example.com',
                password='123',
                restaurant_name='Test Eatery',
                location="13 Some Street Kensington 2033 NSW",
                latitude=-33.896549,
                longitude=151.179962
            ),
            Eatery(
                email='mcdonalds@gmail.com',
                password='123',
                restaurant_name="McDonald's",
                location="12 Barker Street Kensington 2033 NSW",
                latitude=-33.890025,
                longitude=151.194498
            ),
            Eatery(
                email='joe@gmail.com',
                password='123',
                restaurant_name="Joe's Pizza",
                location="13 Henry Street Kensington 2033 NSW",
                latitude=-33.690210,
                longitude=151.190208
            ),
            Eatery(
                email='thai@gmail.com',
                password='123',
                restaurant_name="Thai Place",
                location="13 John Street Kensington 2033 NSW",
                latitude=-33.828644,
                longitude=151.245937
            ),
            Eatery(
                email='ambatukam@gmail.com',
                password='123',
                restaurant_name="Ambatukam's Indian",
                location="13 George Street Bondi 2033 NSW",
                latitude=-33.819831,
                longitude=151.231432
            ),
            Eatery(
                email='indian@gmail.com',
                password='123',
                restaurant_name="HurryCurry indian",
                location="34 Monash Street Kingsford 2034 NSW",
                latitude=-33.902479,
                longitude=151.171137
            ),
            Eatery(
                email='revs@gmail.com',
                password='123',
                restaurant_name="Revolver Upstairs",
                location="Level 2/229 Chapel St, Prahran VIC 3181",
                latitude=-37.85048518717178,
                longitude=144.99334016285275
            ),
        ]

        cuisine_arr=[
            Cuisine(cuisine_name="Chinese"),
            Cuisine(cuisine_name="American"),
            Cuisine(cuisine_name="Italian"),
            Cuisine(cuisine_name="Thai"),
            Cuisine(cuisine_name="Indian"),
            Cuisine(cuisine_name="Mexican"),
            Cuisine(cuisine_name="French"),
            Cuisine(cuisine_name="Japanese"),
            Cuisine(cuisine_name="Spanish"),
            Cuisine(cuisine_name="Greek"),
            Cuisine(cuisine_name="Lebanese"),
            Cuisine(cuisine_name="Brazilian"),
            Cuisine(cuisine_name="Vietnamese"),
            Cuisine(cuisine_name="Moroccan"),
            Cuisine(cuisine_name="Korean"),
            Cuisine(cuisine_name="Turkish"),
            Cuisine(cuisine_name="Russian"),
            Cuisine(cuisine_name="Mediterranean"),
        ]

        cooks_cuisine_arr=[
            CooksCuisine(eatery_id=1, cuisine_id=1),
            CooksCuisine(eatery_id=1, cuisine_id=2),
            CooksCuisine(eatery_id=1, cuisine_id=3),
            CooksCuisine(eatery_id=1, cuisine_id=4),
            CooksCuisine(eatery_id=4, cuisine_id=4),
            CooksCuisine(eatery_id=5, cuisine_id=1),
            CooksCuisine(eatery_id=6, cuisine_id=1),
            CooksCuisine(eatery_id=19, cuisine_id=5)
        ]

        customers_arr=[
            Customer(
                    name="John", 
                    email="email1@email.com",
                    password='123'),
            Customer(
                    name="John2", 
                    email="email2@email.com",
                    password='123'),
            Customer(
                    name="John3", 
                    email="email3@email.com",
                    password='123'),
            Customer(
                    name="John4", 
                    email="email4@email.com",
                    password='123'),
            Customer(
                    name="John5", 
                    email="email5@email.com",
                    password='123')
        ]

        reviews_arr=[
            Review(rating=5, review_text='Pretty good, would come back!', customer_id=22, eatery_id=1),
            Review(rating=3, review_text='Average, nothing stood out.', customer_id=23, eatery_id=1),

            Review(rating=4, review_text='Great service!', customer_id=22, eatery_id=2),
            Review(rating=5, review_text='Enjoyed the atmosphere.', customer_id=23, eatery_id=2),
            
            Review(rating=4, review_text='Interesting menu, good food.', customer_id=22, eatery_id=3),
            Review(rating=5, review_text='Wonderful ambiance and great service.', customer_id=23, eatery_id=3),
            
            Review(rating=5, review_text='Delicious food, excellent service!', customer_id=22, eatery_id=4),
            Review(rating=5, review_text='Nice environment, SICK food 5/5.', customer_id=23, eatery_id=4),
            
            Review(rating=5, review_text='Absolutely loved the food! A must-try for food enthusiasts.', customer_id=22, eatery_id=5),
            Review(rating=4, review_text='Good variety of dishes and friendly staff.', customer_id=23, eatery_id=5),
            
            Review(rating=4, review_text='Great atmosphere and friendly service!', customer_id=22, eatery_id=6),
            Review(rating=5, review_text='Delicious food and excellent presentation.', customer_id=23, eatery_id=6),
            
            Review(rating=5, review_text='The flavors were fantastic! Highly recommended.', customer_id=22, eatery_id=7),
            Review(rating=4, review_text='Cozy ambiance and attentive staff.', customer_id=23, eatery_id=7),
            
            Review(rating=5, review_text='The food was delicious and beautifully presented.', customer_id=22, eatery_id=8),
            Review(rating=5, review_text='Wonderful service and cozy atmosphere.', customer_id=23, eatery_id=8),
            
            Review(rating=5, review_text='Exquisite flavors and impeccable service!', customer_id=22, eatery_id=9),
            Review(rating=5, review_text='Cozy ambiance and tasty dishes.', customer_id=23, eatery_id=9),
            
            Review(rating=4, review_text='Great food and attentive staff!', customer_id=22, eatery_id=10),
            Review(rating=5, review_text='Charming atmosphere and delicious dishes.', customer_id=23, eatery_id=10),
            
            Review(rating=5, review_text='Absolutely loved the food! A hidden gem.', customer_id=22, eatery_id=11),
            Review(rating=4, review_text='Friendly staff and enjoyable atmosphere.', customer_id=23, eatery_id=11),
            
            Review(rating=4, review_text='Delicious cuisine with great presentation.', customer_id=22, eatery_id=12),
            Review(rating=5, review_text='Attentive service and cozy ambiance.', customer_id=23, eatery_id=12),
            
            Review(rating=5, review_text='Flavors that will blow your mind!', customer_id=22, eatery_id=13),
            Review(rating=5, review_text='Welcoming staff and cozy setting.', customer_id=23, eatery_id=13),
            
            Review(rating=4, review_text='Fantastic food and great service!', customer_id=22, eatery_id=14),
            Review(rating=5, review_text='Wonderful atmosphere and attentive staff.', customer_id=23, eatery_id=14),
            
            Review(rating=5, review_text='Memorable flavors and excellent service!', customer_id=22, eatery_id=15),
            Review(rating=4, review_text='Lovely ambiance and delicious cuisine.', customer_id=23, eatery_id=15),
            
            Review(rating=4, review_text='Great food and friendly staff!', customer_id=22, eatery_id=16),
            Review(rating=5, review_text='Enjoyable atmosphere and tasty dishes.', customer_id=23, eatery_id=16),
            
            Review(rating=5, review_text='Exquisite flavors and impeccable service!', customer_id=22, eatery_id=17),
            Review(rating=4, review_text='Cozy ambiance and delightful dishes.', customer_id=23, eatery_id=17),
            
            Review(rating=5, review_text='Great food and attentive staff!', customer_id=22, eatery_id=18),
            Review(rating=5, review_text='Charming atmosphere and delicious dishes.', customer_id=23, eatery_id=18),
            
            Review(rating=5, review_text='Absolutely loved the food! A hidden gem.', customer_id=22, eatery_id=19),
            Review(rating=4, review_text='Friendly staff and enjoyable atmosphere.', customer_id=23, eatery_id=19),
            
            Review(rating=1, review_text='this restuarant is ass', customer_id=22, eatery_id=20),
            Review(rating=1, review_text='pure ass', customer_id=23, eatery_id=20),
        ]

        likes_cuisine_arr=[
            LikesCuisine(customer_id=22, cuisine_id=2, affinity=1.0),
            LikesCuisine(customer_id=22, cuisine_id=3, affinity=0.75),
            LikesCuisine(customer_id=23, cuisine_id=1, affinity=1.0),
            LikesCuisine(customer_id=23, cuisine_id=4, affinity=0.5),
            LikesCuisine(customer_id=23, cuisine_id=8, affinity=1.0),
            LikesCuisine(customer_id=24, cuisine_id=1, affinity=1.0),
        ]

        voucher_arr=[
            Voucher(
                    description="50 percent off",
                    eatery=1,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="20 percent off",
                    eatery=2,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="30 percent off",
                    eatery=3,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="10 percent off",
                    eatery=4,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="60 percent off",
                    eatery=5,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="70 percent off",
                    eatery=6,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="80 percent off",
                    eatery=7,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="70 percent off",
                    eatery=8,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="90 percent off",
                    eatery=9,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="45 percent off",
                    eatery=10,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="55 percent off",
                    eatery=11,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="65 percent off",
                    eatery=12,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="75 percent off",
                    eatery=13,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="85 percent off",
                    eatery=14,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="25 percent off",
                    eatery=15,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="5 percent off",
                    eatery=16,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="65 percent off",
                    eatery=17,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="24 percent off",
                    eatery=18,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="27 percent off",
                    eatery=19,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
            Voucher(
                    description="37 percent off",
                    eatery=20,
                    quantity=250,
                    start=datetime.datetime(2023,12,12),
                    expiry=datetime.datetime(2024,12,12)),
        ]

        has_voucher_arr=[
            HasVoucher(
                    customer_id=22,
                    voucher_id=1),
            HasVoucher(
                    customer_id=23,
                    voucher_id=2),
            HasVoucher(
                    customer_id=24,
                    voucher_id=3),
            HasVoucher(
                    customer_id=25,
                    voucher_id=4),
        ]

        images_arr=[
            Image(
                filepath='mcdonalds1.jpg',
                eatery_id=1
            ),
            Image(
                filepath='mcdonalds2.jpg',
                eatery_id=1
            ),
            Image(
                filepath='mcdonalds3.jpg',
                eatery_id=1
            ),
            Image(
                filepath='mcdonalds4.jpg',
                eatery_id=1
            )
        ]
        
        for eatery in eatery_arr:
            db.session.add(eatery)
        for cuisine in cuisine_arr:
            db.session.add(cuisine)
        for cooks_cuisine in cooks_cuisine_arr:
            db.session.add(cooks_cuisine)
        for review in reviews_arr:
            db.session.add(review)
        for customer in customers_arr:
            db.session.add(customer)
        for likes_cuisine in likes_cuisine_arr:
            db.session.add(likes_cuisine)
        for voucher in voucher_arr:
            db.session.add(voucher)
        for has_voucher in has_voucher_arr:
            db.session.add(has_voucher)
        for image in images_arr:
            db.session.add(image)
        db.session.commit()