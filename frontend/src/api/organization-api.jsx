import req from './req';

export function registerOrganization(name, onSuccess, onError){
	const data = JSON.stringify({ name });
	req.post('/organization', data).then(onSuccess).catch(onError);
}