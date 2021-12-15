/* eslint-disable no-undef */
import React from 'react';
import NodeOverview from '../../../react/home-view/components/NodeOverview';
import { renderWithRedux } from '../../../test-utils';


describe('NodeOverview', () => {

  it('renders and matches the snapshot', () => {
    const { container } = renderWithRedux(<NodeOverview />);
    expect(container).toMatchSnapshot();
  });

});
