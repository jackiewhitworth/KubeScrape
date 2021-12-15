/* eslint-disable no-undef */
import React from 'react';
import HomeContainer from '../../react/home-view/HomeContainer';
import { renderWithRedux } from '../../test-utils';


describe('HomeContainer', () => {

  it('renders and matches the snapshot', () => {
    const { container } = renderWithRedux(<HomeContainer />);
    expect(container).toMatchSnapshot();
  });
});
