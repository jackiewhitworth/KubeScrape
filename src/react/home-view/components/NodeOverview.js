/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-absolute-path */
/**
 * ************************************
 *
 * @module  NodeOverview.js
 * @description component that renders information about a node
 *
 * ************************************
 */

import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as actions from '/src/redux/actions/actions';
import renderGauge from '/src/lib/renderGauge';

// fetch requests to the Prometheus server are stored as functions in PrometheusAPI/node-promql-requests.js
import * as nodePromql from '/src/PrometheusAPI/node-promql-requests';

// Styles
const PREFIX = 'NodeOverview';
const classes = {
  flex: `${PREFIX}-flex`,
  graphItem: `${PREFIX}-graphItem`,
  metricsItem: `${PREFIX}-metrixItem`,
};
const StyledContainer = styled(Container)(({ theme }) => ({
  ':hover': {
    filter: 'brightness(150%)',
    cursor: 'pointer',
  },
}));
const GridItem = styled(Grid)(({ theme }) => ({
  [`&.${classes.flex}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  [`&.${classes.graphItem}`]: {
    marginTop: '-15px',
  },
  [`&.${classes.metricsItem}`]: {
    marginTop: '25px',
  },
}));

const NodeOverview = ({ nodeName }) => {
  // useSelector allows you to extract data from the Redux store state, using a selector function
  // this function accesses the state from the nodeReducer by subscribing to the store through sseSelector
  const { nodeCpuUsage, nodeMemoryUsage, pods, nodePodCapacity } = useSelector(state => state.node);
  const [nodeNetworkUtilization, setNodeNetworkUtilization] = useState(0);
  const [nodeNetworkErrors, setNodeNetworkErrors] = useState(0);

  // the useDispatch hook returns a reference to the dispatch function from the Redux store.
  // dispatch can now be used to dispatch actions as needed
  const dispatch = useDispatch();
  const history = useHistory();

  // function to fetch prometheus data and store using redux
  // TODO: wrap in useCallback hook to memoize

  const apiRequests = [nodePromql.fetchCpuUsage(), nodePromql.fetchMemoryUsage(nodeName), nodePromql.fetchNodePods(nodeName), nodePromql.fetchPodCapacity(), nodePromql.fetchNetworkUtilization(), nodePromql.fetchNetworkErrors()];

  const fetchDataToStore = async () => {
    const data = await Promise.all(apiRequests);
    dispatch(actions.setCpuUsage(data[0]));
    dispatch(actions.setMemoryUsage(data[1]));
    dispatch(actions.setNodePods(data[2]));
    dispatch(actions.setPodCapacity(data[3]));
    setNodeNetworkUtilization(data[4]);
    setNodeNetworkErrors(data[5]);
  };

  // fetch data, then fetch again in 30 seconds
  // when component unmounts, cancel setInterval in a cleanup function
  useEffect(() => {
    fetchDataToStore();
    const interval = setInterval(() => fetchDataToStore(), 30000);
    return () => clearInterval(interval);
  }, []);


  // function to handle node click
  // TODO: wrap in useCallback
  const goToNode = useCallback((node) => {
    history.push({
      pathname: '/node',
      node,
    });
  }, []);

  const infoHeadings = {
    'Active Pods': pods.length,
    'Available Pods': nodePodCapacity,
    'Network Utilization': `${nodeNetworkUtilization} kb/s`,
    'Errors': nodeNetworkErrors
  };

  const gaugeHeadings = {
    'Node CPU Usage': nodeCpuUsage / 100,
    'Node Memory Usage': nodeMemoryUsage / 100
  };

  return (
    <StyledContainer
      maxWidth="xs"
      onClick={goToNode}
    >
      <Paper elevation={3}>
        <Typography
          variant="h6"
          component="div"
          align="center"
          sx={{
            paddingTop: '20px',
          }}
        >
          Node: {nodeName}
        </Typography>
        <Grid container justifyContent="center">
          {Object.entries(infoHeadings).map(([heading, value]) => (
            <GridItem key={heading} item sm={6} lg={3} className={`${classes.flex} ${classes.metricsItem}`}>
              <span>{value}</span>
              <h6>{heading}</h6>
            </GridItem>
          )
          )}

          {Object.entries(gaugeHeadings).map(([heading, value]) => (
            <GridItem item key={heading} lg={6} className={`${classes.flex} ${classes.graphItem}`}>
              {renderGauge(heading, value)}
            </GridItem>
          )
          )}

        </Grid>
      </Paper>
    </StyledContainer>
  );
};

export default NodeOverview;
