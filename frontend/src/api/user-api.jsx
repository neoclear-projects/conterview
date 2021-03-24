import req from './req';
import { getCookie } from '../util/get-cookie';

export function getUsers(fields, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	req.get('organization/'+getCookie('organization-id')+'/user', { params }).then(onSuccess);
}