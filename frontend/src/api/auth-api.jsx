import req from './req';

export function register(organization, username, password, email, onSuccess, onError){
	const data = JSON.stringify({ organization, username, password, email });
	req.post('/auth/register', data).then(onSuccess).catch(onError);
}

export function login(username, password, onSuccess, onError){
	const data = JSON.stringify({ username, password });
	req.post('/auth/login', data).then(onSuccess).catch(onError);
}

export function logout(onSuccess){
	req.get('/auth/logout').then(onSuccess);
}

