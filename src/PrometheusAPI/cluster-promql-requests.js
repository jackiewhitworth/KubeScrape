/* eslint-disable no-console */
/* eslint-disable radix */
/**
 * ************************************
 *
 * @module  cluster-promql-requests
 * @description contains functions that fetch and return data about the cluster from the Prometheus server
 *
 * ************************************
 */
import { handleHttpResponse } from './handle-http-requests';

const prometheusEndpoint = 'http://localhost:30000/api/v1/query?query=';
// get the cpu usage percentage at the cluster level
const clusterCpuUsageQuery = '(1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))*100';

// get the memory usage percentage at the cluster level
// kube_node_status_capacity tells how much memory is available to kubernetes
// kube_node_status_allocatable tells memory resources of a node available for scheduling
const clusterMemoryUsageQuery = '(1-sum(kube_node_status_allocatable{resource="memory", unit="byte"})/sum(kube_node_status_capacity{resource="memory", unit="byte"}))*100';

// get all nodes in the cluster
const nodeInfoQuery = 'kube_node_info';

// get an array of deployments 
const deploymentInfoQuery = 'kube_deployment_created';

// get the total number of pods created in the cluster
const podCountQuery = 'count(kube_pod_created)';

// get the total number of services in the cluster
const serviceInfoQuery = 'kube_service_created';

// get all namespaces in the cluster
const namespacesQuery = 'kube_namespace_created';

export const fetchClusterCpuUsage = async (
  endpoint = prometheusEndpoint, 
  query = clusterCpuUsageQuery
) => {
  try {
    const data = await handleHttpResponse(endpoint, query);
    const clusterCpuUsage = parseInt(data.data.result[0].value[1]);
    return clusterCpuUsage;
  } catch (e){
    console.error('Error fetching cluster CPU usage data');
    return e;
  }
};

export const fetchClusterMemoryUsage = async(
  endpoint = prometheusEndpoint, 
  query = clusterMemoryUsageQuery
) => {
  try {
    const data = await handleHttpResponse(endpoint, query);
    const clusterMemoryUsage = data.data.result[0].value[1];
    return clusterMemoryUsage;
  } catch(e) {
    console.error('Error fetching cluster memory usage data');
    return e;
  }
};

export const fetchClusterNodes = async (
  endpoint = prometheusEndpoint, 
  query = nodeInfoQuery
) => {
  try {
    const data = await handleHttpResponse(endpoint, query);
    const nodes = data.data.result.map(result => result.metric.node);
    return nodes;  
  } catch(e) {
    console.error('error fetching node information');
    return e;
  }
};

export const fetchTotalDeployments = async (
  endpoint = prometheusEndpoint, 
  query = deploymentInfoQuery
) => {
  try {
    const data = await handleHttpResponse(endpoint, query);
    const totalDeployments = data.data.result;
    return totalDeployments;  
  } catch(e) {
    console.error('error fetching deployment information');
    return e;
  }
};

export const fetchTotalPods = async (
  endpoint = prometheusEndpoint, 
  query = podCountQuery
) => {
  try {
    const data = await handleHttpResponse(endpoint, query);
    const totalPods = data.data.result[0].value[1];
    return totalPods;  
  } catch(e) {
    console.error('Error fetching total number of pods');
    return e;
  }
};

export const fetchAllServices = async (
  endpoint = prometheusEndpoint, 
  query = serviceInfoQuery
) => {
  try {
    const data = await handleHttpResponse(endpoint, query);
    const totalServices = data.data.result;
    return totalServices;  
  } catch(e) {
    console.error('Error fetching service information');
    return e;
  }
};

export const fetchAllNamespaces = async (
  endpoint = prometheusEndpoint, 
  query = namespacesQuery
) => {
  try {    
    const data = await handleHttpResponse(endpoint, query);
    const namespaces = data.data.result;
    return namespaces;
  } catch (e) {
    console.error('Error fetching namespace information');
    return e;
  }
};
