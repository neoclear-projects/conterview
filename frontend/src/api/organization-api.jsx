import req from './req';

export function registerOrganization(name, passcode, onSuccess, onError){
	const data = JSON.stringify({ name, passcode });
	req.post('/organization', data).then(onSuccess).catch(onError);
}