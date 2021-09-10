import axios from 'axios';
/**
 * Helper function that configures axios requests
 * @param {object} config The configuration data.
 * route - The route to make request to. e.g profiles, search?q=term&size=5
 * method - The HTTP method to use. e.g post, get, patch,
 * payload - The request body payload
 * token - The authorization token to use if any
 * @returns {Promise} The axios promise
 */

const baseUrl = process.env.REACT_APP_API_URL;
const request = async ({ route, verb, payload }) => {
  const token = localStorage.getItem('token');
  const method = verb || 'get';
  const headers = { 'Authorization': `Bearer ${token}` };
  if (!token) {
    delete headers.Authorization;
  }
  return axios({
    data: payload,
    url: `${baseUrl}${route}`,
    method,
    headers,
  });
};

export default request;
