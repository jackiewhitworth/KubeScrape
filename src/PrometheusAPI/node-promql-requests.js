/* eslint-disable no-console */
/* eslint-disable radix */
/**
 * ************************************
 *
 * @module  node-promql-requests
 * @description contains functions that fetch and return data from the Prometheus server
 *
 * ************************************
 */

import 'regenerator-runtime/runtime';
import { handleHttpResponse, handleErrors } from './handle-http-requests';

const prometheusEndpoint = 'http://localhost:30000/api/v1/query?query=';

// return node CPU usage as a number
export const fetchCpuUsage = async(
  endpoint = prometheusEndpoint
) => {
  try {
    const response = await fetch(`${endpoint}(1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))*100`)
    const data = await handleErrors(response);
    const cpuUsage = parseInt(data.data.result[0].value[1]);
    return cpuUsage;
  } catch(e) {
    console.error('error fetching node CPU usage data');
    return e;
  }
};

// return node memory usage as a number
export const fetchMemoryUsage = async(
  nodeName,
  endpoint = prometheusEndpoint
) => {
  try {
    const response = await fetch(`${endpoint}(1-sum(kube_node_status_allocatable{resource="memory",unit="byte",node="${nodeName}"})/sum(kube_node_status_capacity{resource="memory",unit="byte",node="${nodeName}"}))*100`);
    const data = await handleErrors(response);
    const memoryUsage = data.data.result[0].value[1];
    return memoryUsage;
  } catch(e) {
    console.error('error fetching node memory usage data');
    return e;
  }
};

// return all pods from a node
export const fetchNodePods = async(
  nodeName,
  endpoint = prometheusEndpoint
) => {
  try {
    const response = await fetch(`${endpoint}kube_pod_info{node="${nodeName}"}`);
    const data = await handleErrors(response);
    const podCount = data.data.result;
    return podCount;
  } catch(e) {
    console.error('error fetching node pod count');
    return e;
  }
};

// return pod capacity of node as a number
export const fetchPodCapacity = async(endpoint = prometheusEndpoint) => {
  try {
    const response = await fetch(`${endpoint}kube_node_status_capacity`);
    const data = await handleErrors(response);
    const podCapacity = data.data.result[0].value[1];
    return podCapacity;
  } catch(e) {
    console.error('error fetching pod capacity');
    return e;
  }
};

// return network utilization in kilobytes per second
export const fetchNetworkUtilization = async(endpoint = prometheusEndpoint) => {
  const receivedResponse = await fetch(`${endpoint}sum(rate(container_network_receive_bytes_total[5m]))`);
  const received = await handleErrors(receivedResponse);

  const transmittedResponse = await fetch(`${endpoint}sum(rate(container_network_transmit_bytes_total[5m]))`);
  const transmitted = await handleErrors(transmittedResponse);

  const networkUtilization = Math.floor((parseInt(received.data.result[0].value[1]) + parseInt(transmitted.data.result[0].value[1])) / 1024);
  return networkUtilization;
};

// return network errors
export const fetchNetworkErrors = async(endpoint = prometheusEndpoint) => {
  const receivedResponse = await fetch(`${endpoint}sum(node_network_receive_errs_total)`);
  const received = await handleErrors(receivedResponse);
  
  const transmittedResponse = await fetch(`${endpoint}sum(node_network_transmit_errs_total)`);
  const transmitted = await handleErrors(transmittedResponse);

  const networkErrors = Math.floor((parseInt(received.data.result[0].value[1]) + parseInt(transmitted.data.result[0].value[1])) / 1024);
  return networkErrors;
};
