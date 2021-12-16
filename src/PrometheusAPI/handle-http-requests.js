// rename to get
// write logError handler
export const handleHttpResponse = async (endpoint, query) => {
  const response = await fetch(`${endpoint}${query}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data;
};

export const handleErrors = async (response) => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};
