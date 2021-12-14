/* eslint-disable no-undef */
import React from 'react';
import DeploymentOverview from './DeploymentOverview';
import renderWithRedux from '../../../test-utils';


describe('DeploymentOverview', () => {

  it('renders and matches the snapshot', () => {
    const { container } = renderWithRedux(<DeploymentOverview />);
    expect(container).toMatchSnapshot();
  });

});
