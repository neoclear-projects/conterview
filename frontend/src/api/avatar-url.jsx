import { getCookie } from '../util/get-cookie';

export function avatarUrl(userId){
	return `${process.env.REACT_APP_SERVER}/api/organization/${getCookie('organization-id')}/user/${userId}/avatar`;
}