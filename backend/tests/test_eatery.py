import os
import sys
import json
import unittest
from io import BytesIO
from app.models.image import Image
from app.models.eatery import Eatery
from app import create_app, db
from app.extensions import guard

# Get the current directory of 'test_auth.py'
current_dir = os.path.dirname(os.path.abspath(__file__))

# Get the parent directory (project root)
project_root = os.path.dirname(current_dir)

# Add the project root to sys.path
sys.path.append(project_root)


class EateryTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(config_name='testing')
        self.client = self.app.test_client()

        # Add User's data
        self.eatery_data = {
            'email': 'testeatery0@example.com',
            'password': 'test_password',
            'restaurant_name': 'Test Eatery',
            'role': 'eatery',
            'location': '34 Monash Street Kingsford 2034 NSW',
            'latitude': -33.902479,
            'longitude': 151.171137
        }

        with self.app.app_context():
            # create all tables
            db.create_all()

            # Creating a new eatery
            test_eatery_user = Eatery(email=self.eatery_data['email'],
                                      restaurant_name=self.eatery_data['restaurant_name'],
                                      password=self.eatery_data['password'],
                                      location=self.eatery_data['location'],
                                      latitude=self.eatery_data['latitude'], longitude=self.eatery_data['longitude'])
            db.session.add(test_eatery_user)

            db.session.commit()

            # Fetching the newly created customer and eatery to generate their tokens
            self.eatery_user = guard.authenticate(
                self.eatery_data['email'], self.eatery_data['password'])
            self.eatery_token = guard.encode_jwt_token(self.eatery_user)

    def test_get_all_eateries(self):
        res = self.client.get('/api/eatery')
        data = json.loads(res.data.decode())
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(data, list)

    def test_add_opening_hours(self):
        eatery_id = self.eatery_user.id
        headers = {
            'Authorization': f'Bearer {self.eatery_token}'
        }
        req_body = [
            {
                "eatery_id": eatery_id,
                "day_of_week": "Monday",
                "opening_time": "09:00",
                "closing_time": "18:00",
                "is_closed": True
            },
            {
                "eatery_id": eatery_id,
                "day_of_week": "Tuesday",
                "opening_time": "09:00",
                "closing_time": "18:00",
                "is_closed": False
            },
            {
                "eatery_id": eatery_id,
                "day_of_week": "Wednesday",
                "opening_time": "09:00",
                "closing_time": "18:00",
                "is_closed": False
            },
            {
                "eatery_id": eatery_id,
                "day_of_week": "Thursday",
                "opening_time": "09:00",
                "closing_time": "18:00",
                "is_closed": False
            },
            {
                "eatery_id": eatery_id,
                "day_of_week": "Friday",
                "opening_time": "09:00",
                "closing_time": "18:00",
                "is_closed": False
            },
            {
                "eatery_id": eatery_id,
                "day_of_week": "Saturday",
                "opening_time": "09:00",
                "closing_time": "18:00",
                "is_closed": False
            },
            {
                "eatery_id": eatery_id,
                "day_of_week": "Sunday",
                "opening_time": "09:00",
                "closing_time": "18:00",
                "is_closed": True
            }
        ]
        res = self.client.post(f'/api/eatery/opening_hours',
                               headers=headers, json=req_body)
        data = json.loads(res.data.decode())

        self.assertEqual(res.status_code, 200)
        self.assertIn('successfully', data['message'])

    def test_get_eatery_by_id(self):
        with self.app.app_context():
            eatery_id = Eatery.query.filter().first().id
            res = self.client.get(f'/api/eatery/{eatery_id}')
            data = json.loads(res.data.decode())

            self.assertEqual(res.status_code, 200)
            self.assertIsInstance(data, dict)
            self.assertIn('id', data)

    def test_add_image(self):
        # Prepare the request headers with the token
        headers = {
            'Authorization': f'Bearer {self.eatery_token}'
        }
        with self.app.app_context():
            # Simulate the image upload request using BytesIO
            image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR...'
            image_io = BytesIO(image_data)
            image_io.name = 'test_image.jpg'
            image_io.seek(0)
            res = self.client.post('/api/add_image', headers=headers,
                                   data={'file': (image_io, 'test_image.jpg')})

            # Check the response
            self.assertEqual(res.status_code, 201)
            data = json.loads(res.data.decode())
            self.assertIsInstance(data, dict)
            self.assertEqual(True, data['success'])

    def test_delete_image(self):
        self.test_add_image()
        with self.app.app_context():
            # Fetch the image ID from the newly added image
            image = Image.query.filter_by().first()
            image_id = image.id
            headers = {
                'Authorization': f'Bearer {self.eatery_token}',
                'Content-Type': 'application/json'
            }
            data = {'image_id': image_id}
            res = self.client.delete(
                '/api/delete_image', headers=headers, json=data)

            # Check the response
            self.assertEqual(res.status_code, 200)
            data = json.loads(res.data.decode())
            self.assertTrue(data['success'])
            # Make sure the image is deleted from the database
            self.assertIsNone(Image.query.get(image_id))
            # Make sure the image is deleted from disk
            self.assertFalse(os.path.exists(os.path.join(
                self.app.config['IMAGE_SAVE_DIRECTORY'], image.filepath)))

    def test_get_all_cuisines(self):
        headers = {
            'Authorization': f'Bearer {self.eatery_token}',
            'Content-Type': 'application/json'
        }
        res = self.client.get('/api/cuisines', headers=headers)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data.decode())
        self.assertIsInstance(data, list)

    def remove_all_test_images(self):
        # Remove all images from the tests/images folder
        image_directory = os.path.join(project_root, 'tests/images')
        for filename in os.listdir(image_directory):
            file_path = os.path.join(image_directory, filename)
            if filename == 'cat.txt': 
                continue
            try:
                if os.path.isfile(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Error while deleting {file_path}: {e}")

    def tearDown(self):
        with self.app.app_context():
            # Clear database after each test
            db.session.remove()
            db.drop_all()
            self.remove_all_test_images()


if __name__ == '__main__':
    unittest.main()
