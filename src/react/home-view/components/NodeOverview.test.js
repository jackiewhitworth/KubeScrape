/* eslint-disable no-undef */
import React from 'react';
import NodeOverview from './NodeOverview';
import renderWithRedux from '../../../test-utils';


describe('NodeOverview', () => {

  it('renders and matches the snapshot', () => {
    const { container } = renderWithRedux(<NodeOverview />);
    expect(container).toMatchSnapshot();
  });

});
