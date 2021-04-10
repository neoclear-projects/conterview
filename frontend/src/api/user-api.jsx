import req from './req';

export function getUsers(fields, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	req.get('organization/'+window.localStorage.getItem('organizationId')+'/user', { params }).then(onSuccess);
}

export function getUser(userId, onSuccess){
	req.get('organization/'+window.localStorage.getItem('organizationId')+'/user/'+userId).then(onSuccess);
}

export function getUserByUsername(username, onSuccess){
	let params = {username};
	req.get('organization/'+window.localStorage.getItem('organizationId')+'/user', { params }).then(onSuccess);
}

export function updateUser(userId, username, email, department, title, personalStatement, onSuccess, onError){
	let data = {username, email, department, title, personalStatement};
	req.patch('organization/'+window.localStorage.getItem('organizationId')+'/user/'+userId, data).then(onSuccess).catch(onError);
}