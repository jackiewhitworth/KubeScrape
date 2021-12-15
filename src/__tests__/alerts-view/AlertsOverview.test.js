/* eslint-disable no-undef */
import React from 'react';
import AlertsOverview from '../../react/alerts-view/AlertsOverview';
import { renderWithRedux } from '../../test-utils';


describe('AlertsOverview', () => {

  it('renders and matches the snapshot', () => {
    const { container } = renderWithRedux(<AlertsOverview />);
    expect(container).toMatchSnapshot();
  });
});
