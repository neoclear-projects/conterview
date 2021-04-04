import req from './req';

export function createInterview(positionId, candidateName, candidateEmail, scheduledTime, scheduledLength, interviewerIds, problemIds, onSuccess, onError){
	const data = JSON.stringify({ interviewerIds, scheduledTime, scheduledLength, problemIds, candidate: {name: candidateName, email: candidateEmail} });
	req.post('organization/'+window.localStorage.getItem('organizationId')+'/position/'+positionId+'/interview', data).then(onSuccess).catch(onError);
}

export function getInterviewsAllPosition(inParams, onSuccess){
	let params = {};
	if(inParams.fields) params.fields = inParams.fields;
	if(inParams.positionContains) params.positionContains = inParams.positionContains;
	if(inParams.candidateContains) params.candidateContains = inParams.candidateContains;
	if(inParams.page) params.page = inParams.page;
	if(inParams.status) params.status = inParams.status;
	req.get('organization/'+window.localStorage.getItem('organizationId')+'/interview', { params }).then(onSuccess);
}

export function getInterviews(positionId, fields, status, onSuccess){
	let params = {};
	if(fields) params.fields = fields;
	if(status) params.status = status;
	req.get('organization/'+window.localStorage.getItem('organizationId')+'/position/'+positionId+'/interview', { params }).then(onSuccess);
}

export function getInterview(positionId, interviewId, fields, onSuccess, onError){
	let params = {};
	if(fields) params.fields = fields;
	req.get('organization/'+window.localStorage.getItem('organizationId')+'/position/'+positionId+'/interview/'+interviewId, { params }).then(onSuccess).catch(onError);
}

export function updateInterview(positionId, interviewId, candidateName, candidateEmail, scheduledTime, scheduledLength, interviewerIds, problemIds, onSuccess, onError){
	const data = JSON.stringify({ interviewerIds, scheduledTime, scheduledLength, problemIds, candidate: {name: candidateName, email: candidateEmail} });
	req.patch('organization/'+window.localStorage.getItem('organizationId')+'/position/'+positionId+'/interview/'+interviewId, data).then(onSuccess).catch(onError);
}

export function deleteInterview(positionId, interviewId, onSuccess){
	req.delete('organization/'+window.localStorage.getItem('organizationId')+'/position/'+positionId+'/interview/'+interviewId).then(onSuccess);
}