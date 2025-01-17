/* eslint-disable no-undef */
import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen } from '@testing-library/react';
import PodOverview from '../../../react/node-view/components/PodOverview';
 
// export const handlers = [
//   rest.get('/', (req, res, ctx) => res(ctx.json('testing'), ctx.delay(150)))
// ];
 
// const server = setupServer(...handlers);
 
// Enable API mocking before tests.
// beforeAll(() => server.listen());
 
// Reset any runtime request handlers we may add during the tests.
// afterEach(() => server.resetHandlers());
 
// Disable API mocking after the tests are done.
// afterAll(() => server.close());
 
 
test('renders node details header', async() => {
  const { container } = render(<PodOverview podName="test" namespace="namespace" ip="111.111.111.111" deployment="deployed" uid="uid"/>);
  expect(screen.getByText(/test/i));
  expect(screen.getByText(/namespace/i));
  expect(screen.getByText(/111.111.111.111/i));
  expect(screen.getByText(/deployed/i));
  expect(screen.getByText(/uid/i));
 
  // await waitFor(() => screen.getByRole('heading'));
  // const linkElement = screen.getByText(/node details/i);
  // expect(screen.getByRole('heading')).toHaveTextContent(linkElement);
  // expect(linkElement).toBeInTheDocument();
});