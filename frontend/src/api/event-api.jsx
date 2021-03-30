import req from './req';
import { getCookie } from '../util/get-cookie';

export function getEvents(onSuccess, onError){
	req.get('organization/'+getCookie('organization-id')+'/event').then(onSuccess).catch(onError);
}