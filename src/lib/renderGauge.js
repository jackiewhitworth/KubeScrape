/**
 * ************************************
 *
 * @module renderGague.js
 * @description Container component that renders overviews of K8s pods
 *
 * ************************************
 */

import React from 'react';
import GaugeChart from 'react-gauge-chart';


const renderGauge = (title, value) => (
  <>
    <h6>{title}</h6>
    <GaugeChart
      id="gauge-chart"
      nrOfLevels={3}
      colors={['#29648A', '#F8E9A1', '#F76C6C']}
      arcWidth={0.3}
      arcPadding={0}
      cornerRadius={0}
      percent={value}
      textColor="#FFF"
      needleColor="#FFF"
      animate={false}
    />
  </>
);

export default renderGauge;
