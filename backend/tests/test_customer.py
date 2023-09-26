import os
import sys
import json
import unittest
from app.models.eatery import Eatery
from app.models.review import Review
from app.models.customer import Customer
from app import create_app, db
from app.extensions import guard

# Get the current directory of 'test_auth.py'
current_dir = os.path.dirname(os.path.abspath(__file__))

# Get the parent directory (project root)
project_root = os.path.dirname(current_dir)

# Add the project root to sys.path
sys.path.append(project_root)


class CustomerTestCase(unittest.TestCase):
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

        with self.app.app_context():
            # create all tables
            db.create_all()

            # Creating a new customer
            test_customer_user = Customer(
                email=self.customer_data['email'], password=self.customer_data['password'], name=self.customer_data['name'])
            db.session.add(test_customer_user)

            db.session.commit()

            # Fetching the newly created customer and eatery to generate their tokens
            self.customer_user = guard.authenticate(
                self.customer_data['email'], self.customer_data['password'])
            self.customer_token = guard.encode_jwt_token(self.customer_user)

    def test_get_qr_short_code(self):

        headers = {
            'Authorization': f'Bearer {self.customer_token}'
        }

        res = self.client.get('/api/get_short_code', headers=headers)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data.decode())
        self.assertIn('code', data)

    def tearDown(self):
        with self.app.app_context():
            # Clear database after each test
            db.session.remove()
            db.drop_all()


if __name__ == '__main__':
    unittest.main()
