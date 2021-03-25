import req from './req';
import { getCookie } from '../util/get-cookie';

export function createInterview(positionId, candidateName, candidateEmail, scheduledTime, scheduledLength, interviewerIds, problemIds, onSuccess, onError){
	const data = JSON.stringify({ positionId, interviewerIds, scheduledTime, scheduledLength, problemIds, candidate: {name: candidateName, email: candidateEmail} });
	req.post('organization/'+getCookie('organization-id')+'/position/'+positionId+'/interview', data).then(onSuccess).catch(onError);
}

export function getInterviewsAllPosition(fields, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	req.get('organization/'+getCookie('organization-id')+'/interview', { params }).then(onSuccess);
}

export function getInterviews(positionId, fields, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	req.get('organization/'+getCookie('organization-id')+'/position/'+positionId+'/interview', { params }).then(onSuccess);
}

export function getInterview(positionId, interviewId, fields, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	req.get('organization/'+getCookie('organization-id')+'/position/'+positionId+'/interview/'+interviewId, { params }).then(onSuccess);
}

export function deleteInterview(positionId, interviewId, onSuccess){
	req.delete('organization/'+getCookie('organization-id')+'/position/'+positionId+'/interview/'+interviewId).then(onSuccess);
}