import { rest } from 'msw';
import React from "react";
import { setupServer } from 'msw/node';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import SignIn from '../../src/pages/SignIn'
import { AuthProvider } from '../../src/context/AuthContext';
import { expect } from 'chai';
import { BrowserRouter as Router} from 'react-router-dom'



// Here, replace '/auth/login' with your actual API endpoint
const server = setupServer(
  rest.post('/auth/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'example_token' }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('SignIn works', async () => {
  const { getByPlaceholderText, getByText } = render(
    <AuthProvider>
      <Router>
        <SignIn />
      </Router>
    </AuthProvider>
  );

  // Fill out the form
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });

  // Submit the form
  fireEvent.click(getByText('Sign In'));

  // Wait for promises to resolve
  await waitFor(() => {
    expect(screen.findByText('success')).to.exist;
  });
});
