import os
import sys
import json 
import unittest
from app.models.eatery import Eatery
from app.models.customer import Customer
from app import create_app, db
from app.extensions import guard

# Get the current directory of 'test_auth.py'
current_dir = os.path.dirname(os.path.abspath(__file__))

# Get the parent directory (project root)
project_root = os.path.dirname(current_dir)

# Add the project root to sys.path
sys.path.append(project_root)


class UserUtilsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(config_name='testing')
        self.client = self.app.test_client()
        # Add User's data
        self.customer_data = {
            'email': 'testcustomer@example.com',
            'password': 'test_password',
            'name': 'Test Customer',
            'role': 'customer'
        }
        self.eatery_data = {
            'email': 'testeatery0@example.com',
            'password': 'test_password',
            'restaurant_name': 'Test Eatery',
            'role': 'eatery',
            'location': '34 Monash Street Kingsford 2034 NSW',
            'latitude': -33.902479,
            'longitude': 151.171137
        }
        # Edit User's data
        self.edit_customer_data = {
            'email': 'test.edit.customer@example.com',
            'name': 'Test Edit Customer',
        }
        self.edit_eatery_data = {
            'email': 'test.edit.eatery0@example.com',
            'restaurant_name': 'Test Edit Eatery',
            'location': '151 Monash Street Kingsford 2034 NSW',
        }
        self.update_password_data = {
            'current_password': 'test_password',
            'new_password': 'UpdatedPwd123'
        }

        with self.app.app_context():
            # create all tables
            db.create_all()

            # Creating a new customer
            test_customer_user = Customer(
                email=self.customer_data['email'], password=self.customer_data['password'], name=self.customer_data['name'])
            db.session.add(test_customer_user)

            # Creating a new eatery
            test_eatery_user = Eatery(email=self.eatery_data['email'],
                                      restaurant_name=self.eatery_data['restaurant_name'],
                                      password=self.eatery_data['password'],
                                      location=self.eatery_data['location'],
                                      latitude=self.eatery_data['latitude'], longitude=self.eatery_data['longitude'])
            db.session.add(test_eatery_user)

            db.session.commit()

            # Fetching the newly created customer and eatery to generate their tokens
            cuser = guard.authenticate(
                self.customer_data['email'], self.customer_data['password'])
            self.customer_token = guard.encode_jwt_token(cuser)

            euser = guard.authenticate(
                self.eatery_data['email'], self.eatery_data['password'])
            self.eatery_token = guard.encode_jwt_token(euser)

    def test_edit_customer_profile(self):
        headers = {
            'Authorization': f'Bearer {self.customer_token}'
        }

        res = self.client.post('/api/customer/edit-profile',
                               headers=headers, json=self.edit_customer_data)
        data = json.loads(res.data.decode())

        self.assertEqual(res.status_code, 200)
        self.assertEqual("Customer updated", data['message'])

    def test_edit_eatery_profile(self):
        headers = {
            'Authorization': f'Bearer {self.eatery_token}'
        }

        res = self.client.put('/api/eatery/edit-profile',
                              headers=headers, json=self.edit_eatery_data)
        data = json.loads(res.data.decode())

        self.assertEqual(res.status_code, 200)
        self.assertEqual("Eatery updated", data['message'])

    def test_update_password(self):
        headers = {
            'Authorization': f'Bearer {self.customer_token}'
        }

        res = self.client.post('/api/auth/password/update',
                              headers=headers, json=self.update_password_data)
        data = json.loads(res.data.decode())

        self.assertEqual(res.status_code, 200)
        self.assertEqual(True, data['success'])

    def tearDown(self):
        with self.app.app_context():
            # Clear database after each test
            db.session.remove()
            db.drop_all()


if __name__ == '__main__':
    unittest.main()
