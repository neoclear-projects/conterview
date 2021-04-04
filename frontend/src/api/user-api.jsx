import req from './req';
import { getCookie } from '../util/get-cookie';

export function getUsers(fields, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	req.get('organization/'+getCookie('organization-id')+'/user', { params }).then(onSuccess);
}

export function getUser(userId, onSuccess){
	req.get('organization/'+getCookie('organization-id')+'/user/'+userId).then(onSuccess);
}

export function getUserByUsername(username, onSuccess){
	let params = {username};
	req.get('organization/'+getCookie('organization-id')+'/user', { params }).then(onSuccess);
}

export function updateUser(userId, username, email, department, title, personalStatement, onSuccess){
	let data = {username, email, department, title, personalStatement};
	req.patch('organization/'+getCookie('organization-id')+'/user/'+userId, data).then(onSuccess);
}