import req from './req';
import { getCookie } from '../util/get-cookie';

export function createInterview(positionId, candidateName, candidateEmail, time, interviewerIds, problemIds, onSuccess, onError){
	const data = JSON.stringify({ positionId, interviewerIds, time, problemIds, candidate: {name: candidateName, email: candidateEmail} });
	req.post('organization/'+getCookie('organization-id')+'/position/'+positionId+'/interview', data).then(onSuccess).catch(onError);
}

export function getInterviewsAllPosition(fields, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	req.get('organization/'+getCookie('organization-id')+'/interview', { params }).then(onSuccess);
}

export function getInterview(positionId, interviewId, fields, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	req.get('organization/'+getCookie('organization-id')+'/position/'+positionId+'/interview/'+interviewId, { params }).then(onSuccess);
}