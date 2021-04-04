import req from './req';

export function register(organization, username, password, email, onSuccess, onError){
	const data = JSON.stringify({ organization, username, password, email });
	req.post('/auth/register', data).then(res => {
		window.localStorage.setItem('organizationId', res.data.organizationId);
		window.localStorage.setItem('username', res.data.username);
		window.localStorage.setItem('userId', res.data._id);
		onSuccess(res);
	}).catch(onError);
}

export function login(username, password, onSuccess, onError){
	const data = JSON.stringify({ username, password });
	req.post('/auth/login', data).then(res => {
		window.localStorage.setItem('organizationId', res.data.organizationId);
		window.localStorage.setItem('username', res.data.username);
		window.localStorage.setItem('userId', res.data._id);
		onSuccess(res);
	}).catch(onError);
}

export function logout(onSuccess){
	req.get('/auth/logout').then(res => {
		window.localStorage.removeItem('organizationId');
		window.localStorage.removeItem('username');
		window.localStorage.removeItem('userId');
		onSuccess(res);
	});
}

