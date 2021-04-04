import req from './req';

export function getEvents(page, onSuccess, onError){
	let params = {};
	params.page = page;
	req.get('organization/'+window.localStorage.getItem('organizationId')+'/event', { params }).then(onSuccess).catch(onError);
}