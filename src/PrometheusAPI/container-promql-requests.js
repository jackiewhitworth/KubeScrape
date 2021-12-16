/* eslint-disable no-console */
/**
 * ************************************
 *
 * @module  container-promql-requests
 * @description contains functions that fetches and return data about containers from the Prometheus server
 *
 * ************************************
*/

// NOTE on using rate() in queries
// rate()  it lets you calculate the per-second average rate of how a value is increasing over a period of time.
// user rate() when working with counters (e.g. cpu seconds)

import { handleHttpResponse, handleErrors } from './handle-http-requests';

const prometheusEndpoint = 'http://localhost:30000/api/v1/query?query=';
const rangeEndpoint = 'http://localhost:30000/api/v1/query_range?query=';
const containerInfoQuery = 'kube_pod_container_info';


// returns container names and their associated pod name as an array of arrays where containerNamesList[0] = containerName, containerNamesList[1] = podName
export const fetchContainerNames = async (
  endpoint = prometheusEndpoint, 
  query = containerInfoQuery
) => {
  try {
    const data = await handleHttpResponse(endpoint, query);
    const containers = data.data.result.map(result => [ result.metric.container, result.metric.pod ]
    );
    return containers; 
  } catch(e) {
    console.error('error fetching container names');
    return e;
  }
};

// returns current CPU Usage rate and timestamp as an array where cpuUsage[0] = unixtimestamp, cpuUsage[1] = 
export const fetchContainerCpuUsage = async ( 
  containerName,
  endpoint = prometheusEndpoint
) => {
  try {
    const response = await fetch(`${endpoint}rate(container_cpu_usage_seconds_total{container="${containerName}"}[10m])`);
    const data = await handleErrors(response);
    const containerCpuUsage = data.data.result[0].value;
    return containerCpuUsage; 
  } catch(e) {
    console.error('error fetching container CPU usage data');
    return e;
  }
};

// returns an array of CPU usage values between an input start and end time, in 60s intervals
// for each element in the array, element[0] = unixtimestamp, element[1] = CPU usage seconds
export const fetchRangeContainerCpuUsage = async (
  containerName, 
  startTime, 
  endTime,
  endpoint = rangeEndpoint
) => {
  let rangeContainerCpuUsage;
  try {
    const response = await fetch(`${endpoint}rate(container_cpu_usage_seconds_total{container="${containerName}"}[10m])&start=${startTime}&end=${endTime}&step=60s`);
    const data = await handleErrors(response);
    if (data.data.result.length === 0) {
      rangeContainerCpuUsage = 0;
    } else {
      rangeContainerCpuUsage = data.data.result[0].values;
    }
    return rangeContainerCpuUsage; 
  } catch(e) {
    console.error('error fetching container CPU usage time-series data');
    return e;
  }
};

// returns an array of CPU saturation values between an input start and end time, in 60s intervals
// for each element in the array, element[0] = unixtimestamp, element[1] = CPU throttled seconds (time CPU was trying to run but couldn't and was throttled)
export const fetchRangeContainerCpuSaturation = async (
  containerName, 
  startTime, 
  endTime,
  endpoint = prometheusEndpoint
) => {
  let rangeContainerCpuSaturation;
  try {
    const response = await fetch(`${endpoint}rate(container_cpu_cfs_throttled_seconds_total{container="${containerName}"}[10m])&start=${startTime}&end=${endTime}&step=60s`);
    const data = await handleErrors(response);
    if (data.data.result.length === 0) {
      rangeContainerCpuSaturation = 0;
    } else {
      rangeContainerCpuSaturation = data.data.result[0].values;
    }
    return rangeContainerCpuSaturation;  
  } catch(e) {
    console.error('error fetching container CPU saturation time-series data');
    return e;
  }
};

// returns an array of Memory usage values between an input start and end time, in 60s intervals
// for each element in the array, element[0] = unixtimestamp, element[1] = Memory working in bytes
// working_set_bytes: more realistic measurement than usage_bytes
export const fetchRangeContainerMemoryUsage = async (
  containerName, 
  startTime, 
  endTime,
  endpoint = rangeEndpoint
) => {
  let rangeContainerMemoryUsage;
  try {
    const response = await fetch(`${endpoint}container_memory_working_set_bytes{container="${containerName}"}&start=${startTime}&end=${endTime}&step=60s`);
    const data = await handleErrors(response);
    if (data.data.result.length === 0) {
      rangeContainerMemoryUsage = 0;
    } else {
      rangeContainerMemoryUsage = data.data.result[0].values;
    }
    return rangeContainerMemoryUsage;
  } catch(e) {
    console.error('error fetching container memory usage time-series data');
    return e;
  }
};

// returns an array of Memory saturation values between an input start and end time, in 60s intervals
// for each element in the array, element[0] = unixtimestamp, element[1] = Memory saturation as a ratio of memory in use against memory limit allocated to container
// NOTE: kube_pod_container_resource_limits is experimental, meaning it could change at any time. 
// possibly can be replaced by container_spec_memory_limit_bytes, which returns 0 if no limit is set
// info on setting memory limits: https://sysdig.com/blog/kubernetes-resource-limits/
export const fetchRangeContainerMemorySaturation = async (
  containerName, 
  startTime, 
  endTime,
  endpoint = rangeEndpoint
) => {
  let rangeContainerMemorySaturation;
  try {
    const response = await fetch(`${endpoint}sum(container_memory_working_set_bytes{container="${containerName}"})%20/%20sum(kube_pod_container_resource_limits{resource="memory",unit="byte",container="${containerName}"})&start=${startTime}&end=${endTime}&step=60s`);
    const data = await handleErrors(response);
    if (data.data.result.length === 0) {
      rangeContainerMemorySaturation = 0;
    } else {
      rangeContainerMemorySaturation = data.data.result[0].values;
    }
    return rangeContainerMemorySaturation;  
  } catch(e) {
    console.error('error fetching container memory saturation time-series data');
    return e;
  }
};
