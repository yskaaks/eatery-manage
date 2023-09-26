import { rest } from 'msw';
import React from "react";
import { setupServer } from 'msw/node';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import SignUp from '../../src/pages/SignUp'
import { AuthProvider } from '../../src/context/AuthContext';
import { expect } from 'chai';
import { BrowserRouter as Router} from 'react-router-dom'


// Here, replace '/auth/register' with your actual API endpoint
const server = setupServer(
  rest.post('/auth/register', (req, res, ctx) => {
    return res(ctx.json({ message: 'success' }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('SignUp works', async () => {
  const { getByPlaceholderText, getByText } = render(
    <AuthProvider>
      <Router>
        <SignUp />
      </Router>
    </AuthProvider>
  );

  // Fill out the form
  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'test user' } });
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example1.com' } });
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
  fireEvent.click(getByText("I'm a Customer"));

  // Submit the form
  fireEvent.click(getByText('Sign Up'));

  // Wait for promises to resolve
  await waitFor(() => {
    expect(screen.findByText('success')).to.exist;
  });
});
