import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './redux/store';


export const renderWithRedux = (
  component,
  reduxStore = store
) => render(<Provider store={reduxStore}>{component}</Provider>);

export const fakeClusterCpuUsage = {
  'status': 'success',
  'data': {
    'resultType': 'vector',
    'result': [
      {
        'metric': {
          'instance': '10.1.2.240:9100'
        },
        'value': [
          1639439695.158,
          '6.151261565921784'
        ]
      }
    ]
  }
};

