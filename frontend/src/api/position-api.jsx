import req from './req';
import { getCookie } from '../util/get-cookie';

export function createPosition(name, description, onSuccess, onError){
	const data = JSON.stringify({name, description});
	req.post('organization/'+getCookie('organization-id')+'/position', data).then(onSuccess).catch(onError);
}

export function updatePosition(positionId, name, description, onSuccess, onError){
	const data = JSON.stringify({name, description});
	req.patch('organization/'+getCookie('organization-id')+'/position/'+positionId, data).then(onSuccess).catch(onError);
}

export function getPositions(fields, page, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	if(page !== 0) params.page = page;
	req.get('organization/'+getCookie('organization-id')+'/position', { params }).then(onSuccess);
}

export function getPosition(positionId, fields, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	req.get('organization/'+getCookie('organization-id')+'/position/'+positionId, { params }).then(onSuccess);
}

export function deletePosition(positionId, onSuccess){
	req.delete('organization/'+getCookie('organization-id')+'/position/'+positionId).then(onSuccess);
}