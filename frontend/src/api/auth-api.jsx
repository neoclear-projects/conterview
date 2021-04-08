import req from './req';

export function getStatus(onSuccess, onError){
	req.get('/auth/status').then(res => {
		window.localStorage.setItem('organizationId', res.data.organizationId);
		window.localStorage.setItem('username', res.data.username);
		window.localStorage.setItem('userId', res.data._id);
		onSuccess(res);
	}).catch(onError);
}

export function register(organization, passcode, username, password, email, onSuccess, onError){
	const data = JSON.stringify({ organization, passcode, username, password, email });
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

export async function candidateLogin(interviewId, passcode, onSuccess, onError){
	const data = JSON.stringify({ interviewId, passcode });
	req.post('/auth/candidate-login', data).then(res => {
		window.localStorage.setItem('organizationId', res.data.organizationId);
		onSuccess(res);
	}, err => {
		onError(err);
	})
}

