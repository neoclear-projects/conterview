import req from './req';

export function getEvents(onSuccess, onError){
	req.get('organization/'+window.localStorage.getItem('organizationId')+'/event').then(onSuccess).catch(onError);
}