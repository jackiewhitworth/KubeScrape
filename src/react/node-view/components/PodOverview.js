/**
 * ************************************
 *
 * @module  PodOverview.js
 * @description Presentational component that renders basic information about a pod
 *
 * ************************************
 */

import React from 'react';
import { Box, List, ListItem, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import regeneratorRuntime from 'regenerator-runtime';

const Detail = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
}));

const PodOverview = ({ podName, namespace, ip, deployment, uid }) => {
  const podHeadings = {
    'Pod': podName,
    'Namespace': namespace,
    'IP': ip,
    'Deployment': deployment,
    'UID': uid
  };

  return (
    <Box
      sx={{
        wordWrap: 'break-word',
        width: '350px',
        fontSize: '1rem',
        ':hover': {
          filter: 'brightness(150%)',
          cursor: 'pointer',
        },
      }}
    >
      <Paper elevation={5} sx={{ display: 'flex', alignItems: 'center', height: '200px' }}>
        <List>
          {Object.entries(podHeadings).map(([heading, value]) => <Detail key={`${heading}${value}`}><span>{heading}:{value}</span></Detail>)}
        </List>
      </Paper>
    </Box>
  );
};

export default PodOverview;
