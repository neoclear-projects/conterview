import req from './req';
import { getCookie } from '../util/get-cookie';

export function createPosition(name, description, onSuccess, onError){
	const data = JSON.stringify({ name, description });
	req.post('organization/'+getCookie('organization-id')+'/position', data).then(onSuccess).catch(onError);
}

export function getPositions(fields, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
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