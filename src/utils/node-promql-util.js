/**
 * ************************************
 *
 * @module  node-promql-requests
 * @description contains functions that fetch and return data from the Prometheus server
 *
 * ************************************
 */


//return a node names as an array of strings
export const fetchNodeNamesList = async () => {
  const data = await fetch('http://localhost:9090/api/v1/query?query=kube_node_info', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());
  const nodeNamesList = data.data.result.map(result => {
    return result.metric.node;
  });

  return nodeNamesList;  
}

//return node CPU usage as a number
export const fetchCpuUsage = async() => {
  const data = await fetch('http://localhost:9090/api/v1/query?query=100 * (1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  const cpuUsage = Math.round(data.data.result[0].value[1]);

  return cpuUsage;
}

//return node memory usage as a number
export const fetchMemoryUsage = async() => {
  const data = await fetch('http://localhost:9090/api/v1/query?query=((sum(node_memory_MemTotal_bytes)%20-%20sum(node_memory_MemFree_bytes)%20-%20sum(node_memory_Buffers_bytes)%20-%20sum(node_memory_Cached_bytes))%20/%20sum(node_memory_MemTotal_bytes))%20*%20100', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  const memoryUsage = data.data.result[0].value[1];
  return memoryUsage;
}

//return total pods running in node as a number
export const fetchPodTotal= async() => {
  const data = await fetch('http://localhost:9090/api/v1/query?query=count(kube_pod_info)', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  const podTotal= data.data.result[0].value[1];
  return podTotal;
}

//return pod capacity of node as a number
export const fetchPodCapacity = async() => {
  const data = await fetch('http://localhost:9090/api/v1/query?query=kube_node_status_capacity{resource=%22pods%22}', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  const podCapacity= data.data.result[0].value[1];
  return podCapacity;
}