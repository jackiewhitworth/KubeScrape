/* eslint-disable no-undef */
import React from 'react';
import { StateMock } from '@react-mock/state';
// import { rest } from 'msw';
// import { setupServer } from 'msw/node';
import ClusterOverview from '../../../react/home-view/components/ClusterOverview';
import { renderWithRedux } from '../../../test-utils';
  
// const handlers = [
//   rest.get('/', (req, res, ctx) => res(ctx.json('testing'), ctx.delay(150)))
// ];
  
// const server = setupServer(...handlers);
  
// Enable API mocking before tests.
// beforeAll(() => server.listen());
  
// Reset any runtime request handlers we may add during the tests.
// afterEach(() => server.resetHandlers());
  
// Disable API mocking after the tests are done.
// afterAll(() => server.close());


describe('ClusterOverview', () => {

  it('renders and matches the snapshot', () => {
    const { container } = renderWithRedux(
      <StateMock state={{ clusterCpuUsage: 6 }}>
        <ClusterOverview />
      </StateMock>
    );
    expect(container).toMatchSnapshot();
  });

});
