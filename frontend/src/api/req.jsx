import axios from 'axios';
import { browserRouterRef } from '../App';

let req = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER}/api/`,
  headers: {'Content-Type': 'application/json'},
  withCredentials: true,
});

req.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  console.log(error);
  let message = error.response.data;
  if(message.startsWith('id invalid') || message.startsWith('need to login as organization user')){
    browserRouterRef.current.history.push('/login');
  }
  return Promise.reject(error);
});

export default req;