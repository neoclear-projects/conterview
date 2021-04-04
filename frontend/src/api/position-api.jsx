import req from './req';

export function createPosition(name, description, onSuccess, onError){
	const data = JSON.stringify({name, description});
	req.post('organization/'+window.localStorage.getItem('organizationId')+'/position', data).then(onSuccess).catch(onError);
}

export function updatePosition(positionId, name, description, onSuccess, onError){
	const data = JSON.stringify({name, description});
	req.patch('organization/'+window.localStorage.getItem('organizationId')+'/position/'+positionId, data).then(onSuccess).catch(onError);
}

export function getPositions(fields, page, nameContains, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	if(page !== 0) params.page = page;
	if(nameContains) params.nameContains = nameContains;
	req.get('organization/'+window.localStorage.getItem('organizationId')+'/position', { params }).then(onSuccess);
}

export function getPosition(positionId, fields, onSuccess, onError){
	let params = {};
	if(fields) params.fields = fields;
	req.get('organization/'+window.localStorage.getItem('organizationId')+'/position/'+positionId, { params }).then(onSuccess).catch(onError);
}

export function deletePosition(positionId, onSuccess){
	req.delete('organization/'+window.localStorage.getItem('organizationId')+'/position/'+positionId).then(onSuccess);
}