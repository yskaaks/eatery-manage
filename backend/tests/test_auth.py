import os
import sys
import json
import unittest
from app import create_app, db
from app.extensions import guard

# Get the current directory of 'test_auth.py'
current_dir = os.path.dirname(os.path.abspath(__file__))

# Get the parent directory (project root)
project_root = os.path.dirname(current_dir)

# Add the project root to sys.path
sys.path.append(project_root)


class AuthTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app(config_name='testing')
        self.client = self.app.test_client()
        self.customer_data = {
            'email': 'testcustomer@example.com',
            'password': 'test_password',
            'name': 'Test Customer',
            'role': 'customer'
        }
        self.eatery_data = {
            'email': 'testeatery@example.com',
            'password': 'test_password',
            'name': 'Test Eatery',
            'role': 'eatery',
            'location': '34 Monash Street Kingsford 2034 NSW',
            'latitude': -33.902479,
            'longitude': 151.171137
        }

        with self.app.app_context():
            # create all tables
            db.create_all()

    def test_customer_registration(self):
        res = self.client.post('/api/auth/register', json=self.customer_data)
        data = json.loads(res.data.decode())

        self.assertEqual(res.status_code, 200)
        self.assertIn('token', data)
        self.assertIn('id', data)
        self.assertEqual(data['role'], 'customer')

    def test_customer_login(self):
        # Register the user first
        self.test_customer_registration()

        # Login with the registered user's data
        res = self.client.post(
            '/api/auth/login', json={'email': self.customer_data['email'],
                                     'password': self.customer_data['password'],
                                     'role': 'customer'})
        data = json.loads(res.data.decode())

        self.assertEqual(res.status_code, 200)
        self.assertIn('token', data)

    def test_eatery_registration(self):

        res = self.client.post('/api/auth/register', json=self.eatery_data)
        data = json.loads(res.data.decode())

        self.assertEqual(res.status_code, 200)
        self.assertIn('token', data)
        self.assertIn('id', data)
        self.assertEqual(data['role'], 'eatery')

    def test_eatery_login(self):

        # Register the user first
        self.test_eatery_registration()

        # Login with the registered user's data
        res = self.client.post(
            '/api/auth/login', json={'email': self.eatery_data['email'],
                                     'password': self.eatery_data['password'],
                                     'role': 'eatery'})
        data = json.loads(res.data.decode())

        self.assertEqual(res.status_code, 200)
        self.assertIn('token', data)

    # invalid Data Test
    def test_invalid_registration(self):
        # Invalid Role
        res = self.client.post('/api/auth/register', json={
            'email': 'invalid@example.com',
            'password': 'invalid_password',
            'name': 'Invalid Customer',
            'role': 'invalid'
        })
        self.assertEqual(res.status_code, 400)

    def test_invalid_login(self):
        res = self.client.post(
            '/api/auth/login', json={'email': 'invalid@invalid.com', 'password': 'invalidpass', 'role': 'customer'})
        data = json.loads(res.data.decode())

        self.assertEqual(res.status_code, 401)
        self.assertIn('AuthenticationError', data['error'])

    def test_whoami(self):
        # Register the user first
        self.test_customer_registration()

        with self.app.app_context():
            # Authenticate and get the user
            user = guard.authenticate(
                self.customer_data['email'], self.customer_data['password'])

            # Generate the token for the user
            customer_token = guard.encode_jwt_token(user)

            # Authorization header with the token
            headers = {
                'Authorization': f'Bearer {customer_token}'
            }

            res = self.client.get('/api/auth/whoami', headers=headers)
            data = json.loads(res.data.decode())
 
            self.assertEqual(res.status_code, 200)
            self.assertIn('id', data)
            self.assertIn('email', data)

    def tearDown(self):
        with self.app.app_context():
            # Clear database after each test
            db.session.remove()
            db.drop_all()


if __name__ == '__main__':
    unittest.main()
