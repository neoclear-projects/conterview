import axios from 'axios';

axios.defaults.withCredentials = true;

const req = axios.create({
	baseURL: `${process.env.REACT_APP_SERVER}/api/`,
	headers: {'Content-Type': 'application/json'}
});

export default req;